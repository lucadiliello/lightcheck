import React, { Component } from 'react';
import { Segment, Header, Progress, Label } from 'semantic-ui-react';
import { Digital } from 'react-activity';
import './Statistics.css';

class Statistics extends Component {

    getNumberInStatus(status){
        return this.props.lamps
            .map((object, i) => object.status === status ? 1 : 0)
            .reduce((a,b) => a + b);
    }

    // TODO: Lampadine cambiate all'anno
    // TODO: Rapporto costo lampada/durata
    // TODO: Lampioni che si rompono più spesso

    render() {
        return (
            <Segment className='control-segment'>
                <Header as='h2' className='header'>
                    Statistics
                </Header>

                {this.props.lamps ?
                    <div>
                        <Label circular color='teal'
                            content={"Warehouses: " + this.getNumberInStatus('main')}>
                        </Label>
                        <Progress
                            className='progress-bar'
                            progress='value' success active
                            value={this.getNumberInStatus('working')}
                            total={this.props.lamps.length}>
                            Working
                        </Progress>
                        <Progress
                            className='progress-bar'
                            progress='value' warning active
                            value={this.getNumberInStatus('broken')}
                            total={this.props.lamps.length}>
                            Broken
                        </Progress>
                        <Progress
                            className='progress-bar'
                            progress='value' error active
                            value={this.getNumberInStatus('dead')}
                            total={this.props.lamps.length}>
                            Dead
                        </Progress>
                    </div> :  <Digital />}
            </Segment>
        );
    }
}

export default Statistics;
