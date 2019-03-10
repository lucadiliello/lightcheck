import React, { Component } from 'react';
import { Segment, Header, Button, Divider } from 'semantic-ui-react';
import './Manage.css';

class Manage extends Component {

    state = {
        status: 'all',
    };

    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(_choice){
        this.setState({
            ...this.state,
            status: _choice
        }, this.props.updateVisibility(_choice));
    }

    render() {
        return (
            <Segment>
                <Header as='h2'>
                    View options
                </Header>
                    <Segment>
                        <Button size='small' fluid primary inverted disabled={this.state.status === 'all'} onClick={() => this.handleClick('all')}>All</Button>
                        <Divider/>
                        <Button size='small' fluid color='green' inverted disabled={this.state.status === 'working'} onClick={() => this.handleClick('working')}>Working</Button>
                        <Divider/>
                        <Button size='small' fluid color='yellow' inverted disabled={this.state.status === 'broken'} onClick={() => this.handleClick('broken')}>Broken</Button>
                        <Divider/>
                        <Button size='small' fluid color='red' inverted disabled={this.state.status === 'dead'} onClick={() => this.handleClick('dead')}>Dead</Button>
                    </Segment>
                    <Segment>
                        <Button size='small' basic inverted={this.props.legend} color='violet' fluid onClick={this.props.switchLegend}>{this.props.legend ? 'Hide Legend' : 'Show Legend'}</Button>
                    </Segment>
            </Segment>
        );
    }
}

export default Manage;
