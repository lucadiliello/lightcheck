import React, { Component } from 'react';

import { Segment, Header, Progress, Divider, List, Label, Button } from 'semantic-ui-react';

import openSocket from 'socket.io-client';
import { Digital } from 'react-activity';

var config = require('./config.json');
//const socket = openSocket(config.default_server);

class Manage extends Component {

    state = {
        choice: 'all'
    };

    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(_choice){
        this.setState({
            ...this.state,
            choice: _choice
        }, this.props.update(_choice));
    }

    render() {
        return (
            <Segment textAlign="left">
                <Header as='h2' textAlign="center">
                    Manage
                </Header>
                <Header as='h4' textAlign="left">
                    Show lamps:
                </Header>
                <Button.Group fluid>
                    <Button primary disabled={this.state.choice === 'all'} onClick={() => this.handleClick('all')}>All</Button>
                    <Button.Or />
                    <Button primary disabled={this.state.choice === 'working'} onClick={() => this.handleClick('working')}>Working</Button>
                    <Button.Or />
                    <Button primary disabled={this.state.choice === 'broken'} onClick={() => this.handleClick('broken')}>Broken</Button>
                </Button.Group>
            </Segment>
        );
    }
}

export default Manage;
