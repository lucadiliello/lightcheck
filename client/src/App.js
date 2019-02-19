import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

import './App.css';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000');

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class App extends Component {

    constructor(){
        super()
        this.state = {
            positions: {
                station: {
                    lat: 0,
                    lng: 0
                }
            }
        }
        socket.on("init", data => this.setState({ positions: data }));
        socket.on("update", (res) => {
            var pos = this.state.positions;
            pos.lamps[res].working = false;
            this.setState({
                ...this.state,
                positions: pos
            });
        })
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">

                    <div style={{ height: '100vh', width: '100%' }}>
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: "AIzaSyAYUQBt0jOyQyq8NTS1qYKlndr3N7-uImE" }}
                            defaultCenter={this.state.positions.station}
                            defaultZoom={11}
                        >
                            <AnyReactComponent
                                lat={59.955413}
                                lng={30.337844}
                                text="My Marker"
                            />
                        </GoogleMapReact>
                    </div>
                </header>
            </div>
        );
    }
}

export default App;
