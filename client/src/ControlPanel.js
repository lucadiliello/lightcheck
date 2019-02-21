import React, { Component } from 'react';

import { Button, Container, Form} from 'semantic-ui-react';

import openSocket from 'socket.io-client';

var config = require('./config.json');
const socket = openSocket(config.default_server);

class ControlPanel extends Component {

    render() {
        return (
            <Form>
                Form
            </Form>
        );
    }
}

export default ControlPanel;
