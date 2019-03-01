import React, { Component } from 'react';
import { Segment, Header, Progress } from 'semantic-ui-react';
import { Digital } from 'react-activity';
import './ControlPanel.css';

class ControlPanel extends Component {

    constructor(props){
        super(props);
        this.getProgressColor = this.getProgressColor.bind(this);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(!nextProps.lamps) return null;
        let working = nextProps.lamps.map( (object, i) => object.working ? 1 : 0).reduce( (a,b) => a + b);
        return {
            lampsNumber: nextProps.lamps.length,
            workingLampsNumber: working,
            brokenLampsNumber: nextProps.lamps.length - working
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
        return (
            <Segment textAlign="left">
                <Header as='h2' className='header'>
                    Working Lamps
                </Header>
                {this.state ?
                <Progress className='progress-bar'
                    color={this.getProgressColor()}
                    value={this.state.workingLampsNumber}
                    total={this.state.lampsNumber}
                    progress='ratio' active/> : <Digital />}
            </Segment>
        );
    }
}

export default ControlPanel;
