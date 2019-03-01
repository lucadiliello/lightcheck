import React, { Component } from 'react';
import { Segment, Header, Button, Popup, List, Label, Card, Container, Form } from 'semantic-ui-react';
import './Trips.css';
import axios from 'axios';
import L from 'leaflet';

const config = require('../Config/config.json');

class Trips extends Component {

    state = {
        selection: [],
        loading: false,
        start_from_warehouse: true
    }

    constructor(props){
        super(props);
        this.remove = this.remove.bind(this);
        this.move = this.move.bind(this);
        this.add = this.add.bind(this);
        this.optimiseList = this.optimiseList.bind(this);
        this.clear = this.clear.bind(this);
        this.autoSelect = this.autoSelect.bind(this);
    }

    componentDidUpdate(){
        if((this.props.mode === 'selection') && this.props.selected && this.props.selected.fresh){
            if(this.state.selection.indexOf(this.props.selected.value) === -1){
                this.add(this.props.selected.value);
            }
        }
    }

    add(element){
        let newArray = this.state.selection;
        newArray.push(element);
        this.setState({
            ...this.state,
            selection: newArray
        }, this.props.reset());
    }

    remove(index){
        let newArray = this.state.selection;
        newArray.splice(index, 1);
        this.setState({
            ...this.state,
            selection: newArray
        });
    }

    swap(list, pos_a, pos_b){
        let tmp = list[pos_a];
        list[pos_a] = list[pos_b];
        list[pos_b] = tmp;
    }

    move(index, direction){
        if((index === 0 && direction === 'up') || (index === (this.state.selection.length-1) && direction === 'down')) return;
        let newArray = this.state.selection;
        this.swap(newArray, index, direction === 'down' ? index + 1 : index - 1);
        this.setState({
            ...this.state,
            selection: newArray
        });
    }

    clear(){
        this.setState({
            ...this.state,
            selection: [],
        }, () => this.props.set([]));
    }

    optimiseList(){
        var request = config.osrm_server + '/trip/v1/driving/';
        if(this.state.start_from_warehouse) request += `${this.props.center.lat},${this.props.center.lng};`;
        request += this.state.selection.map((object, i) => `${this.props.lamps[object].lng},${this.props.lamps[object].lat}`).join(';');
        request += '?source=first';
        if(this.state.start_from_warehouse) request += '&roundtrip=true';
        console.log(request);
        this.setState({
            ...this.state,
            loading: true
        }, () => axios({
                method:'get',
                url: request,
                responseType:'json'
            }).then((response) => {
                let best;
                if(this.state.start_from_warehouse){
                    best = response.data.waypoints.map((object, i) => object.waypoint_index - 1);
                    best.shift();
                }
                else best = response.data.waypoints.map((object, i) => object.waypoint_index);
                this.setState({
                    ...this.state,
                    loading: false,
                    selection: best.map((object, i) => this.state.selection[object])
                }, () => this.props.set(this.getRoute()));
            })
        );
    }

    getRoute(){
        let base = this.state.selection.map((object, i) => this.props.lamps[object]).map((object, i) => L.latLng(object.lat, object.lng));
        let center = L.latLng(this.props.center.lat, this.props.center.lng);
        return this.state.start_from_warehouse ?
            [center].concat(base).concat([center]) :
            base;
    }

    autoSelect(){
        this.setState({
            ...this.state,
            selection: this.props.lamps.filter((object, i) => !object.working).map((object, i) => i)
        });
    }

    render(){
        return (<Segment textAlign='left'>
            <Header as='h2' textAlign="center">
                Generate a Trip
            </Header>
            <Form>
                <Form.Group widths='equal'>
                    <Form.Button fluid onClick={this.props.switch} color={this.props.mode === 'selection' ? 'red' : 'blue'}>
                        {this.props.mode === 'selection' ? 'Stop selection' : 'Start selection'}
                    </Form.Button>
                    <Popup trigger={<Form.Button fluid onClick={this.autoSelect} primary>
                        Auto select
                    </Form.Button>} content='Automatically select all non-working lamps'/>
                </Form.Group>
                <Form.Checkbox
                    label='Roundtrip from/to warehouse'
                    onChange={() => this.setState({...this.state, start_from_warehouse: !this.state.start_from_warehouse})}
                    checked={this.state.start_from_warehouse} />
                <Form.Group widths='equal'>
                    <Form.Button
                        fluid onClick={this.optimiseList}
                        primary loading={this.state.loading}
                        disabled={!((this.state.selection.length > 0 && this.state.start_from_warehouse) || this.state.selection.length > 1)}>
                        Generate Route
                    </Form.Button>
                    <Form.Button fluid onClick={this.clear} color='red' disabled={this.state.selection.length === 0}>
                        Clear
                    </Form.Button>
                </Form.Group>
            </Form>

            <List className='list'>
                {this.state.selection
                    .map((object, i) => this.props.lamps[object])
                    .map((point, i) =>
                        (<List.Item key={i}>
                            <Card className='item'>
                                <Card.Content>
                                    <Card.Description>{point.address}</Card.Description>
                                    <Card.Meta>
                                        <Container>
                                            <Popup content='Remove' trigger={
                                                <Button
                                                    icon='delete' circular compact
                                                    size='tiny' color='teal'
                                                    onClick={() => this.remove(i)}/>}/>
                                            <Popup content='Move Up' trigger={
                                                <Button icon='angle up' circular compact
                                                    size='tiny' color='teal'
                                                    onClick={() => this.move(i, 'up')}/>}/>
                                            <Popup content='Move Down' trigger={
                                                <Button icon='angle down' circular compact
                                                    size='tiny' color='teal'
                                                    onClick={() => this.move(i, 'down')}/>}/>
                                            <Label circular color={point.working ? 'olive' : 'yellow'}>{point.working ? 'Working' : 'Broken'}</Label>
                                        </Container>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        </List.Item>)
                    )
                }
            </List>
        </Segment>);
    }
}

export default Trips;
