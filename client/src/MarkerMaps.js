import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Digital } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import openSocket from 'socket.io-client';

var config = require('./config.json');
const socket = openSocket(config.default_server);

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class MarkerMaps extends Component {

    constructor(){
        super();
        this.state = {
            positions: null
        };

        socket.on("update", data =>
            this.setState({
                ...this.state,
                positions: data
            })
        );
    }

    render(){
        if (this.state.positions)
            return (
                <div style={{ height: '100vh', width: '100%' }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: "AIzaSyAYUQBt0jOyQyq8NTS1qYKlndr3N7-uImE" }}
                        defaultCenter={{
                            lat: this.state.positions.station.lat,
                            lng: this.state.positions.station.lng
                        }}
                        defaultZoom={this.state.positions.station.zoom}
                    >
                        {this.state.positions.lamps.map((object, i) => <AnyReactComponent
                            key={i}
                            lat={object.lat}
                            lng={object.lng}
                            text={object.working ? "+" : "-"}
                        />)}
                    </GoogleMapReact>
                </div>);
        else return (<Digital />);
    }
}

export default MarkerMaps;
