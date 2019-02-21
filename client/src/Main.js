import React, { Component } from 'react';

import { Button, Container, Grid, Header, Segment, Image, Divider} from 'semantic-ui-react';

import 'react-activity/dist/react-activity.css';
import openSocket from 'socket.io-client';
import './Main.css';

import MarkerMaps from './MarkerMaps';
import ControlPanel from './ControlPanel';

var config = require('./config.json');
const socket = openSocket(config.default_server);

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class Main extends Component {

    render() {
        return (
            <Grid textAlign="center" >
                <Grid.Row>
                    <Header size='medium' textAlign='center' className="title">Work Trip Manager</Header>
                </Grid.Row>
                <Divider/>
                <Grid.Row columns="2">
                    <Grid.Column width="twelve"><Segment><MarkerMaps/></Segment></Grid.Column>
                    <Grid.Column width="four">
                        <Grid.Row>
                            <ControlPanel />
                        </Grid.Row>
                        <Grid.Row>
                            Bellali
                        </Grid.Row>

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Main;
