import React, { Component } from 'react';
import { Segment, Header, Label, List } from 'semantic-ui-react';
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
            return `Lat:${this.props.selected.value.lat} - Lng:${this.props.selected.value.lng}`;
        }
        return "No point selected";
    }

    render() {
        return (
            <Segment>
                <Header as='h2' className='info-header'>
                    Lamp Info
                </Header>
                <List className='info-list'>
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
