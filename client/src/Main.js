import React, { Component } from 'react';

import { Button, Container, Grid, Label, Segment, Image } from 'semantic-ui-react';

import 'react-activity/dist/react-activity.css';
import openSocket from 'socket.io-client';
import './Main.css';

import MarkerMaps from './MarkerMaps';

var config = require('./config.json');
const socket = openSocket(config.default_server);

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class Main extends Component {

    constructor(){
        super();
        this.state = {};
    }

    render() {
        return (
            <Grid textAlign="center" stackable>
                <Grid.Row divided>
                    <Grid.Column mobile="four"><MarkerMaps/></Grid.Column>
                    <Grid.Column mobile="four"><Image src='/images/foto.jpg'/></Grid.Column>
                    <Grid.Column mobile="four"><Image src='/images/foto.jpg'/></Grid.Column>
                    <Grid.Column mobile="four"><MarkerMaps/></Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Main;
