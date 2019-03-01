import React, { Component } from 'react';
import { Grid, Header, Segment, Icon } from 'semantic-ui-react';
import 'react-activity/dist/react-activity.css';
import openSocket from 'socket.io-client';
import './Main.css';
import 'leaflet';
import axios from 'axios';

import OpenMap from '../OpenMap/OpenMap';
import ControlPanel from '../ControlPanel/ControlPanel';
import Manage from '../Manage/Manage';
import Info from '../Info/Info';
import Trips from '../Trips/Trips';

var config = require('../Config/config.json');
const socket = openSocket(config.default_server);

class Main extends Component {

    state = {
        lamps: undefined,
        center: undefined,
        selected: {
            value: undefined,
            fresh: false
        },
        visibility: [],
        route: [],
        mode: 'info'
    };

    constructor(props){
        super(props);

        this.updateVisibility = this.updateVisibility.bind(this);
        this.set = this.set.bind(this);
        this.reset = this.reset.bind(this);
        this.setRoute = this.setRoute.bind(this);
        this.switchMode = this.switchMode.bind(this);
        this.setAddress = this.setAddress.bind(this);
        this.getAddresses = this.getAddresses.bind(this);

        socket.on('update', (data) =>
            this.setState({
                lamps: data.lamps,
                center: data.station,
                visibility: this.state.visibility.length === data.lamps.length ? this.state.visibility : Array(data.lamps.length).fill(true)
            }, this.getAddresses)
        );
    }

    getAddresses(){
        let requests = this.state.lamps.map(
            (object, i) => axios.get(config.osrm_server + `/nearest/v1/driving/${object.lng},${object.lat}`)
        );
        axios.all(requests).then((res) => {
            let newLamps = this.state.lamps;
            for(var i in newLamps) newLamps[i].address = res[i].data.waypoints[0].name;
            this.setState({
                ...this.state,
                lamps: newLamps
            });
        });
    }

    switchMode(){
        this.setState({
            ...this.state,
            mode: this.state.mode === 'info' ? 'selection' : 'info',
            selected: {
                ...this.state.selected,
                fresh: false
            }
        });
    }

    setRoute(_route){
        this.setState({
            ...this.state,
            route: _route
        });
    }

    updateVisibility(choice){
        let newVisibility;
        switch (choice) {
            case 'working':
                newVisibility = this.state.lamps.map((object, i) => object.working);
                break;
            case 'broken':
                newVisibility = this.state.lamps.map((object, i) => !object.working);
                break;
            default:
                newVisibility = Array(this.state.lamps.length).fill(true);
        };
        this.setState({
            ...this.state,
            visibility: newVisibility
        });
    }

    set(index){
        this.setState({
            ...this.state,
            selected: {
                value: index,
                fresh: true
            }
        });
    }

    setAddress(_address){
        let newLamps = this.state.lamps;
        if(newLamps && this.state.selected.value){
            newLamps[this.state.selected.value].address = _address;
            this.setState({
                ...this.state,
                lamps: newLamps
            });
        }
    }

    reset(){
        this.setState({
            ...this.state,
            selected: {
                ...this.state.selected,
                fresh: false
            }
        });
    }

    render() {
        return (
            <div>
                <Header as='h2' color='orange' attached className='main-header'>
                    <Icon circular name='lightbulb outline'/>
                    <Header.Content>
                        Work Trip Manager
                        <Header.Subheader>version 1.0</Header.Subheader>
                    </Header.Content>
                </Header>
                <Segment attached>
                    <Grid textAlign="center" stackable>
                        <Grid.Row columns="2">
                            <Grid.Column width="twelve">
                                <OpenMap
                                    route={this.state.route}
                                    lamps={this.state.lamps}
                                    center={this.state.center}
                                    visibility={this.state.visibility}
                                    selection={this.set}
                                    mode={this.state.mode}/>
                            </Grid.Column>
                            <Grid.Column width="four">
                                <ControlPanel lamps={this.state.lamps}/>
                                <Manage lamps={this.state.lamps} update={this.updateVisibility}/>
                                <Info
                                    lamps={this.state.lamps}
                                    selected={this.state.selected}/>
                                <Trips
                                    center={this.state.center}
                                    set={this.setRoute}
                                    lamps={this.state.lamps}
                                    selected={this.state.selected}
                                    switch={this.switchMode}
                                    mode={this.state.mode}
                                    reset={this.reset}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        );
    }
}

export default Main;
