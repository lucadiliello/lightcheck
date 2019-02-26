import React, { Component } from 'react';
import { Segment, Header } from 'semantic-ui-react';
import * as esri from 'esri-leaflet-geocoder';

const config = require('./config.json');

const geocodeService = esri.geocodeService({
    url: config.reverse_server
});

class Manage extends Component {

    state = {
        address: undefined,
        position: undefined,
        loading: false
    }

    constructor(props){
        super(props);
        this.reset = this.reset.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.selected !== prevProps.selected && this.props.selected) {
            let point = this.props.lamps[this.props.selected];
            geocodeService.reverse().latlng([point.lat, point.lng]).run( (error, result) =>
                this.setState({
                    ...this.state,
                    address: result.address.Match_addr,
                    position: `Lat: ${point.lat} - Lng: ${point.lng}`
                })
            );
        }
    }

    reset(){
        this.setState({
            address: undefined,
            coordinates: undefined
        });
    }

    render() {
        return (
            <Segment textAlign='left'>
                <Header as='h2' textAlign="center">
                    Lamp Info
                </Header>
                <Header as='h4'>
                    Address:
                </Header>
                <p>{this.state.address ? this.state.address : "No point selected"}</p>
                <Header as='h4'>
                    Position:
                </Header>
                <p>{this.state.position ? this.state.position : "No point selected"}</p>
            </Segment>
        );
    }
}

export default Manage;
