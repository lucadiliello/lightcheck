import React, { Component } from 'react';

import { Segment, Header, Progress, Divider, List, Label } from 'semantic-ui-react';

import openSocket from 'socket.io-client';
import { Digital } from 'react-activity';

var config = require('./config.json');
//const socket = openSocket(config.default_server);

class Manage extends Component {

    constructor(props){
        super(props);
        this.getProgressColor = this.getProgressColor.bind(this);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(!nextProps.positions) return null;
        let working = nextProps.positions.lamps.map( (object, i) => object.working ? 1 : 0).reduce( (a,b) => a + b);
        return {
            lampsNumber: nextProps.positions.lamps.length,
            workingLampsNumber: working,
            brokenLampsNumber: nextProps.positions.lamps.length - working
        };
    }

    getProgressColor(){
        if(this.state.workingLampsNumber === this.state.lampsNumber) return 'teal';
        if(this.state.workingLampsNumber > this.state.lampsNumber * 0.80) return 'green';
        if(this.state.workingLampsNumber > this.state.lampsNumber * 0.60) return 'olive';
        if(this.state.workingLampsNumber > this.state.lampsNumber * 0.40) return 'yellow';
        if(this.state.workingLampsNumber > this.state.lampsNumber * 0.20) return 'orange';
        return 'red';
    }

    render() {
        if(this.state) return (
            <Segment textAlign="left">
                <Header as='h2' textAlign="center">
                    Manage
                </Header>
                <Progress
                    color={this.getProgressColor()}
                    value={this.state.workingLampsNumber}
                    total={this.state.lampsNumber}
                    progress='ratio' active>
                </Progress>
                <Divider />
                <List divided selection>
                    <List.Item>
                        <Label color='blue' horizontal>
                            Total:
                        </Label>
                        {this.state.lampsNumber}
                    </List.Item>
                    <List.Item>
                        <Label color='olive' horizontal>
                            Working:
                        </Label>
                        {this.state.workingLampsNumber}
                    </List.Item>
                    <List.Item>
                        <Label color='yellow' horizontal>
                            Broken:
                        </Label>
                        {this.state.brokenLampsNumber}
                    </List.Item>
                </List>
            </Segment>
        );
        else return <Digital />;
    }
}

export default Manage;
