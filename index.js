var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var positions = require('./positions.json');

const speed = 1000;

app.get('/', function(req, res){
    console.log("Sending bundle react " + __dirname);
    res.sendFile(__dirname + '/client/build/index.html');
});

// On connection of a new user
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.emit('update', positions);

    // If some client marks a lamp as repaired
    socket.on('repaired', (index) => {
        if(index >= 0 && index < positions.lamps.length){
            positions.lamps[index].working = True;
            socket.broadcast.emit('update', positions);
        }
    });

    socket.on('disconnect', () => {
        console.log("Client disconnected")
    });
});


// Starting the development server
http.listen(5000, function () {
    console.log('Example app listening on port 5000!');
});

// Function that simulates lamps breaking (by usure, vandalism, ...)
const breakLamps = () => {
    var rand = Math.floor(Math.random() * positions.lamps.length);
    positions.lamps[rand].working = false;

    io.sockets.emit('update', positions);
    setTimeout(breakLamps, Math.floor(Math.random() * speed * 1000 + 10000));
}

// Start breaking stuffs
setTimeout(breakLamps, 10000);
