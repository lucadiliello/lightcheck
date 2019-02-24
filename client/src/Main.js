import React, { Component } from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react';

import 'react-activity/dist/react-activity.css';
import openSocket from 'socket.io-client';
import './Main.css';

import OpenMap from './OpenMap';
import ControlPanel from './ControlPanel';
import Manage from './Manage';

var config = require('./config.json');
const socket = openSocket(config.default_server);

class Main extends Component {

    constructor(props){
        super(props);
        this.state = {
            positions: null
        };

        socket.on('update', data =>
            this.setState({
                ...this.state,
                positions: data
            })
        );
    }

    render() {
        return (
            <div>
                <Header size='medium' attached className='title'>
                    <div >
                        Work Trip Manager v1.0
                    </div>
                </Header>
                <Segment attached>
                    <Grid textAlign="center" stackable>
                        <Grid.Row columns="2">
                            <Grid.Column width="twelve">
                                <OpenMap positions={this.state.positions}/>
                            </Grid.Column>
                            <Grid.Column width="four">
                                <ControlPanel positions={this.state.positions}/>
                                <Manage positions={this.state.positions}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        );
    }
}

export default Main;
