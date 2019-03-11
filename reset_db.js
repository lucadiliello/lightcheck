const config = require('./config.json');
const mongodb = require('mongodb');
const assert = require('assert');
const MongoClient = mongodb.MongoClient;

MongoClient.connect(config.db_url, { useNewUrlParser: true }, (err, client) => {
	assert.equal(null, err);
	console.log("Successfully connected to database");
	var db = client.db(config.db_name);

    db.collection('lamps').drop(function(err, delOK) {
        if (err) console.log("Database already resetted");;
        if (delOK) console.log("Collection lamps deleted");
        client.close();
    });
});
