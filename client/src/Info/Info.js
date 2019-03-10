import React, { Component } from 'react';
import { Segment, Header, Label, List, Message } from 'semantic-ui-react';
import './Info.css';

class Manage extends Component {

    constructor(props){
        super(props);
        this.getAddress = this.getAddress.bind(this);
        this.getPosition = this.getPosition.bind(this);
    }

    getAddress(){
        if (this.props.selected.value) return this.props.selected.value.address;
        return "No point selected";
    }

    getPosition(){
        if (this.props.selected.value){
            return `Lat:${this.props.selected.value.lat} \n Lng:${this.props.selected.value.lng}`;
        }
        return "No point selected";
    }

    render() {
        return (
            <Segment>
                <Header as='h2'>
                    Lamp Info
                </Header>
                <List>
                    <List.Item>
                        <Message>
                            <Message.Header>
                                <Label color='teal' horizontal>
                                    Address
                                </Label>
                            </Message.Header>
                            {this.getAddress()}
                        </Message>
                    </List.Item>
                    <List.Item>
                        <Message>
                            <Message.Header>
                                <Label color='teal' horizontal>
                                    Position
                                </Label>
                            </Message.Header>
                            {this.getPosition()}
                        </Message>
                    </List.Item>
                </List>
            </Segment>
        );
    }
}

export default Manage;
