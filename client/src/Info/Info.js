import React, { Component } from 'react';
import { Segment, Header, Label, List } from 'semantic-ui-react';
import { Digital } from 'react-activity';
import axios from 'axios';
import './Info.css';
const config = require('../Config/config.json');

class Manage extends Component {

    constructor(props){
        super(props);
        this.getAddress = this.getAddress.bind(this);
        this.getPosition = this.getPosition.bind(this);
    }

    getAddress(){
        if (this.props.selected.value) return this.props.lamps[this.props.selected.value].address;
        return "No point selected";
    }

    getPosition(){
        if (this.props.selected.value)
            return `Lat:${this.props.lamps[this.props.selected.value].lat} - Lng:${this.props.lamps[this.props.selected.value].lng}`;
        return "No point selected";
    }

    render() {
        return (
            <Segment>
                <Header as='h2' className='header'>
                    Lamp Info
                </Header>
                <List className='list'>
                    <List.Item>
                        <Label color='teal' horizontal>
                            Address:
                        </Label>{this.getAddress()}
                    </List.Item>
                    <List.Item>
                        <Label color='teal' horizontal>
                            Position:
                        </Label>{this.getPosition()}
                    </List.Item>
                </List>
            </Segment>
        );
    }
}

export default Manage;
