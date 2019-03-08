const express = require('express');
var app = express();
var http = require('http').Server(app);
const config = require('./config.json');
const mongodb = require('mongodb');

var io = require('socket.io')(http, { pingTimeout: 60000 });

const bodyParser= require('body-parser');
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));
app.use(bodyParser.urlencoded({ extended:true, limit:1024*1024*20, type:'application/x-www-form-urlencoding'}));

// DB INITIALIZATION
const MongoClient = mongodb.MongoClient;
const assert = require('assert');
var db;

MongoClient.connect(config.db_url, { useNewUrlParser: true }, (err, client) => {
	assert.equal(null, err);
	console.log("Successfully connected to database");
	db = client.db(config.db_name);
});

const api_router = express.Router();
app.use('/devices', api_router);
api_router.all('*', (req, res, next) => {
	if(db) next();
	else {
		console.log("DB not connected!");
		res.status(404).json({"status":"db not connected"});
	}
});


////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SOCKET APIs ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// On connection of a new user
io.on('connection', (socket) => {
    console.log('New client connected');

    if(db) db.collection('lamps').find({}).toArray((err, _results) => {
		if (err) {
			console.log(err);
		} else {
			socket.emit('init', _results);
        }
	});

    socket.on('disconnect', () => {
        console.log("Client disconnected")
    });
});



////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// REST APIs /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


//// TO REGISTER/RETRIEVE THE ID ///////////
app.post('/devices', (req, res) => {
    db.collection('lamps').findOne(req.body, (err, _result) => {
        if (err) {
            console.log(err);
            res.status(500).json({"status":"internal_error"});
        } else {
            if (_result) {
                res.status(200).json({ _id: _result._id });
            } else {
                db.collection('lamps').insertOne(req.body, (err, _result) => {
                    res.status(200).json({ _id: _result.insertedId });
                    db.collection('lamps').findOne({ _id: mongodb.ObjectId(_result.insertedId) }, (err, _result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            io.sockets.emit('add', _result);
                        }
                    });
                });
            }
        }
    });
});

//// TO UPDATE THE DATA ////////
app.put('/devices/:id', (req, res) => {
    const id = req.params.id;
    db.collection('lamps').updateOne({ _id: mongodb.ObjectId(id) }, { $set: req.body }, (err, _results) => {
		if (err) {
			console.log(err);
			res.status(500).json({"status":"internal_error"});
		} else {
			res.status(200).json({"status":"ok"});
            db.collection('lamps').findOne({ _id: mongodb.ObjectId(id) }, (err, _result) => {
                if (err) {
                    console.log(err);
                } else {
                    io.sockets.emit('update', _result);
                }
            });
        }
	});
});


//// SEND DEFAULT REACT BUNDLE //////
app.get('/', (req, res) => {
    console.log("Sending bundle react " + __dirname);
    res.sendFile(__dirname + '/client/build/index.html');
});



// Starting the development server
http.listen(config.default_server_port, () => {
    console.log('Default server listening on ' + config.default_server_port);
});
