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

    state = {
        lamps: undefined,
        center: undefined,
        visibility: []
    };


    constructor(props){
        super(props);

        this.updateVisibility = this.updateVisibility.bind(this);

        socket.on('update', (data) =>
            this.setState({
                lamps: data.lamps,
                center: data.station,
                visibility: this.state.visibility.length === data.lamps.length ? this.state.visibility : Array(data.lamps.length).fill(true)
            })
        );
    }

    updateVisibility(choice){
        let newVisibility;
        switch (choice) {
            case 'working':
                newVisibility = this.state.lamps.map((object, i) => object.working);
                break;
            case 'broken':
                newVisibility = this.state.lamps.map((object, i) => !object.working);
                break;
            default:
                newVisibility = Array(this.state.lamps.length).fill(true);
        };
        this.setState({
            ...this.state,
            visibility: newVisibility
        });
    }

    render() {
        return (
            <div>
                <Header size='medium' attached>
                    <div >
                        Work Trip Manager v1.0
                    </div>
                </Header>
                <Segment attached>
                    <Grid textAlign="center" stackable>
                        <Grid.Row columns="2">
                            <Grid.Column width="twelve">
                                <OpenMap lamps={this.state.lamps} center={this.state.center} visibility={this.state.visibility}/>
                            </Grid.Column>
                            <Grid.Column width="four">
                                <ControlPanel lamps={this.state.lamps}/>
                                <Manage lamps={this.state.lamps} update={this.updateVisibility}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        );
    }
}

export default Main;
