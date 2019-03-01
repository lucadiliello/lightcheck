import React, { Component } from 'react';
import { Segment, Header, Button } from 'semantic-ui-react';

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
            <Segment>
                <Header as='h2' textAlign="center">
                    Show
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
