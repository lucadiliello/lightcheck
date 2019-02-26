import React, { Component } from 'react';
import { Segment, Header, Button, List, Label } from 'semantic-ui-react';
import './Trips.css';

class Trips extends Component {

    state = {
        selection: [],
        active: false
    }

    constructor(props){
        super(props);
        this.handleclick = this.handleclick.bind(this);
    }

    componentDidUpdate(){
        if(this.state.active && this.props.selected){
            if(this.state.selection.indexOf(this.props.selected) === -1){
                let newArray = this.state.selection;
                newArray.push(this.props.selected);
                this.setState({
                    ...this.state,
                    selection: newArray
                });
            }
        }
    }

    handleclick(){
        this.setState({
            ...this.state,
            active: !this.state.active
        }, this.props.switch);
    }

    render(){
        return (<Segment textAlign='left'>
            <Header as='h2' textAlign="center">
                Generate a trip
            </Header>
            <Button fluid onClick={this.handleclick} color={this.state.active ? 'red' : 'blue'}>
                {this.state.active ? 'Stop selection' : 'Start selection'}
            </Button>
            <List bulleted className='list'>
                {this.state.selection
                    .map((object, i) => this.props.lamps[object])
                    .map((point, i) =>
                        (
                            <List.Item key={i}>
                                <Label color='teal' horizontal>
                                    {point.working ? 'Working' : 'Broken'} @ {`Lat: ${point.lat} - Lng: ${point.lng}`}
                                </Label>
                            </List.Item>
                        )
                    )
                }
            </List>
        </Segment>);
    }
}

export default Trips;
