import React, { Component } from 'react';
import { Segment, Header, Progress, Grid } from 'semantic-ui-react';
import { Digital } from 'react-activity';
import './Statistics.css';

class Statistics extends Component {

    getNumberInStatus(status){
        return this.props.lamps.length > 0 ? this.props.lamps
            .map((object, i) => object.status === status ? 1 : 0)
            .reduce((a,b) => a + b) : 0;
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
                    <Grid stackable>
                        <Grid.Row columns="4">
                            <Grid.Column width={4}>
                                <Progress
                                    className='progress-bar'
                                    progress='value' color='brown' active
                                    value={this.getNumberInStatus('main')}
                                    total={5}>
                                    Active warehouses
                                </Progress>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Progress
                                    className='progress-bar'
                                    progress='value' success active
                                    value={this.getNumberInStatus('working')}
                                    total={this.props.lamps.length}>
                                    Working lamps
                                </Progress>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Progress
                                    className='progress-bar'
                                    progress='value' warning active
                                    value={this.getNumberInStatus('broken')}
                                    total={this.props.lamps.length}>
                                    Broken lamps
                                </Progress>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Progress
                                    className='progress-bar'
                                    progress='value' error active
                                    value={this.getNumberInStatus('dead')}
                                    total={this.props.lamps.length}>
                                    Dead lamps
                                </Progress>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid> :  <Digital />}
            </Segment>
        );
    }
}

export default Statistics;
