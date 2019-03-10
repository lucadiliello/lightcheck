////////////////////////////////////////////////////////////////////////////////
// Simulates lot of sensors calling the server for updates about the lamps state
////////////////////////////////////////////////////////////////////////////////

const prob_broken_lamp = 0.05;
const prob_broken_sensor = 0.01;
const waiting_time = 300;
const axios = require('axios');
const positions = require('./positions.json');
const config = require('./config.json');

axios.defaults.baseURL = 'http://localhost:' + config.default_server_port;

class Sensor {
    constructor(data) {
        this.lat = data.lat;
        this.lng = data.lng;
        this.status = data.status;

        this.simulate = this.simulate.bind(this);
        this.set = this.set.bind(this);
        this.update = this.update.bind(this);

        this.set(
            () => {
                this.update(
                    () => {
                        if (this.status !== 'main') this.simulate();
                    }
                )
            }
        );
    }

    simulate() {
        if(Math.random() < prob_broken_lamp){
            this.status = 'broken';
            this.update();
        } else if (Math.random() < prob_broken_sensor) {
            this.status = 'dead';
            this.update();
        } else {
            setTimeout(this.simulate, Math.floor(Math.random() * waiting_time * 1000 + 10000));
        }
    }

    set(callback){
        axios.post('/devices', {
            lat: this.lat,
            lng: this.lng
        }).then((res) => {
            this._id = res.data._id;
            if(callback) callback();
        }).catch(err => console.log(err));
    }

    update(callback){
        axios.put(`/devices/${this._id}`, {
            lat: this.lat,
            lng: this.lng,
            status: this.status
        }).then((res) => {
            if(callback) callback();
        }).catch(err => console.log(err));
    }
}


for (var i in positions.lamps) new Sensor(positions.lamps[i]);
console.log("Simulation started");
