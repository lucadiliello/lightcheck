import axios from 'axios';
const config = require('../Config/config.json');

export default class Point{

    constructor(data, cb) {
        this.callback = cb;
        this.update(data);
    }

    update(data) {
        let shouldUpdateAddress = (this.lat !== data.lat && this.lng !== data.lng);
        this.lat = data.lat;
        this.lng = data.lng;
        this._id = data._id;
        this.status = data.status;
        if (shouldUpdateAddress) this.retrieveAddress();
        else this.callback();
    }

    retrieveAddress() {
        axios.get(config.osrm_server + `/nearest/v1/driving/${this.lng},${this.lat}`)
        .then((res) => {
            this.address = res.data.waypoints[0].name;
            this.callback();
        });
    }
}
