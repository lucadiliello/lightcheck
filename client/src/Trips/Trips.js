import React, { Component } from 'react';
import { Segment, Header, Button, Popup, List, Label, Form, Grid, Message } from 'semantic-ui-react';
import './Trips.css';
import axios from 'axios';

const config = require('../Config/config.json');

class Trips extends Component {

    state = {
        selection: [],
        details: undefined,
        loading: false,
        startFromWarehouse: true
    }

    constructor(props){
        super(props);
        this.remove = this.remove.bind(this);
        this.move = this.move.bind(this);
        this.add = this.add.bind(this);
        this.optimiseList = this.optimiseList.bind(this);
        this.clear = this.clear.bind(this);
        this.autoSelect = this.autoSelect.bind(this);
        this.getWarehouse = this.getWarehouse.bind(this);
        this.setRoute = this.setRoute.bind(this);
    }

    componentDidUpdate(){
        if((this.props.mode === 'selection') && this.props.selected.value && this.props.selected.fresh){
            if(this.state.selection.indexOf(this.props.selected.value) === -1){
                this.add(this.props.selected.value);
            }
        }
    }

    add(element){
        this.setState({
            ...this.state,
            selection: this.state.selection.concat([element])
        }, this.props.reset());
    }

    remove(element){
        this.setState({
            ...this.state,
            selection: this.state.selection.filter((item, j) => item !== element)
        });
    }

    move(index, direction){
        this.setState({
            ...this.state,
            selection: this.state.selection
                .slice(0, direction === 'up' ? (index - 1) : index)
                .concat([this.state.selection[direction === 'up' ? index : (index + 1)], this.state.selection[direction === 'up' ? (index - 1) : index]])
                .concat(this.state.selection.slice(direction === 'up' ? (index + 1) : (index + 2)))
        });
    }

    clear(){
        this.setState({
            ...this.state,
            selection: [],
        });
        this.props.set([]);
    }

    getWarehouse(){
        return this.props.lamps.find((a) => a.status === 'main');
    }

    optimiseList(){
        let request = config.osrm_server + '/trip/v1/driving/';
        let warehouse = this.getWarehouse();
        if(this.state.startFromWarehouse && warehouse) request += `${warehouse.lat},${warehouse.lng};`;
        request += this.state.selection.map((e) => `${e.lng},${e.lat}`).join(';');
        request += '?source=first';
        if(this.state.startFromWarehouse && warehouse) request += '&roundtrip=true';
        console.log(request);
        this.setState({
            ...this.state,
            loading: true
        }, () => axios.get(request)
            .then((res) => {
                let indexes;
                if (this.state.startFromWarehouse) {
                    indexes = res.data.waypoints.map((object, i) => object.waypoint_index - 1);
                    indexes.shift();
                }
                else {
                    indexes = res.data.waypoints.map((object, i) => object.waypoint_index);
                }
                this.setState({
                    ...this.state,
                    loading: false,
                    selection: indexes.map((object, i) => this.state.selection[object]),
                });
            })
        );
    }

    setRoute() {
        let warehouse = this.getWarehouse();
        let trip = this.state.startFromWarehouse ? [warehouse].concat(this.state.selection).concat([warehouse]) : this.state.selection;

        this.setState({
            ...this.state,
            loading: true
        }, this.props.set(trip, () => this.setState({
            ...this.state,
            loading: false
        })));
    }

    autoSelect(){
        this.setState({
            ...this.state,
            selection: this.props.lamps.filter((a) => (a.status === 'broken' || a.status === 'dead'))
        });
    }

    render(){
        return (
            <Segment textAlign='left'>
                <Header as='h2' className='trip-header'>
                    Generate a Trip
                </Header>
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Segment>
                                <Form>
                                    <Form.Button fluid onClick={this.props.switch} color={this.props.mode === 'selection' ? 'red' : 'blue'}>
                                        {this.props.mode === 'selection' ? 'Stop selection' : 'Start selection'}
                                    </Form.Button>

                                    <Popup trigger={<Form.Button fluid onClick={this.autoSelect} primary>
                                        Auto select
                                    </Form.Button>} content='Automatically select all non-working lamps'/>
                                    <Form.Checkbox
                                        label='Roundtrip from/to warehouse'
                                        onChange={() => this.setState({
                                            ...this.state,
                                            startFromWarehouse: !this.state.startFromWarehouse
                                        })}
                                        checked={this.state.startFromWarehouse} />
                                </Form>
                            </Segment>
                            <Segment>
                                <Form>
                                    <Form.Button
                                        fluid onClick={this.optimiseList}
                                        primary loading={this.state.loading}
                                        disabled={!((this.state.selection.length > 0 && this.state.startFromWarehouse) || this.state.selection.length > 1)}>
                                        Optimize Route
                                    </Form.Button>
                                    <Form.Button
                                        fluid onClick={this.setRoute}
                                        primary loading={this.state.loading}
                                        disabled={!((this.state.selection.length > 0 && this.state.startFromWarehouse) || this.state.selection.length > 1)}>
                                        Set Route
                                    </Form.Button>
                                    <Form.Button fluid onClick={this.clear} color='red'>
                                        Clear
                                    </Form.Button>
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            {this.state.selection.length > 0 ?
                                (
                                    <List className='trip-list'>
                                        {this.state.selection.map((point, i) =>
                                            (<List.Item key={i}>
                                                <Message>
                                                    <Message.Header>
                                                        <Label circular content={'N. ' + i}/>
                                                        <Label circular color={point.status === 'working' ? 'green' : (point.status === 'broken' ? 'yellow' : 'red')}>
                                                            {point.status.replace(/^\w/, c => c.toUpperCase())}
                                                        </Label>
                                                        <Button
                                                            icon='delete' circular compact
                                                            size='small' color='teal'
                                                            onClick={() => this.remove(point)}/>
                                                        <Button icon='angle up' circular compact disabled={!(i > 0)}
                                                            size='small' color='teal'
                                                            onClick={() => this.move(i, 'up')}/>
                                                        <Button icon='angle down' circular compact disabled={!(i < (this.state.selection.length - 1))}
                                                            size='small' color='teal'
                                                            onClick={() => this.move(i, 'down')}/>
                                                    </Message.Header>
                                                        <p>
                                                            {point.address}
                                                        </p>
                                                  </Message>
                                               </List.Item>))
                                        }
                                    </List>
                                ) :  <Label>No route selected</Label>

                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}

export default Trips;
