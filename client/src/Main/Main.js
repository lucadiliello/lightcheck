import React, { Component } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import 'react-activity/dist/react-activity.css';
import openSocket from 'socket.io-client';
import './Main.css';
import 'leaflet';

import OpenMap from '../OpenMap/OpenMap';
import Statistics from '../Statistics/Statistics';
import Manage from '../Manage/Manage';
import Info from '../Info/Info';
import Trips from '../Trips/Trips';
import Footer from '../Footer/Footer';
import Intestation from '../Intestation/Intestation';
import Calendar from '../Calendar/Calendar';
import Point from './Point';

const config = require('../Config/config.json');
const socket = openSocket(config.default_server);

class Main extends Component {

    state = {
        lamps: undefined,
        selected: {
            value: undefined,
            fresh: false
        },
        visibility: 'all',
        route: [],
        mode: 'info'
    };

    constructor(props) {
        super(props);

        this.updateVisibility = this.updateVisibility.bind(this);
        this.set = this.set.bind(this);
        this.reset = this.reset.bind(this);
        this.setRoute = this.setRoute.bind(this);
        this.switchMode = this.switchMode.bind(this);
        this.refresh = this.refresh.bind(this);

        socket.on('init', (data) => {
            this.setState({
                lamps: data.map((a) => new Point(a, this.refresh))
            });
        });

        socket.on('update', (data) => {
            this.state.lamps.find((a) => a._id === data._id).update(data);
        });

        socket.on('add', (data) => {
            this.setState({
                ...this.state,
                lamps: this.state.lamps.concat([data])
            });
        });
    }

    refresh(){
        this.forceUpdate();
    }

    switchMode() {
        this.setState({
            ...this.state,
            mode: this.state.mode === 'info' ? 'selection' : 'info',
            selected: {
                ...this.state.selected,
                fresh: false
            }
        });
    }

    setRoute(_route) {
        this.setState({
            ...this.state,
            route: _route
        });
    }

    updateVisibility(choice) {
        this.setState({
            ...this.state,
            visibility: choice
        });
    }

    set(point) {
        this.setState({
            ...this.state,
            selected: {
                value: point,
                fresh: true
            }
        });
    }

    reset() {
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
                <Intestation/>
                <Segment attached>
                    <Grid textAlign="center" stackable>
                        <Grid.Row columns="2">
                            <Grid.Column width={13}>
                                <OpenMap
                                    zoom={config.initialZoom}
                                    route={this.state.route}
                                    lamps={this.state.lamps}
                                    set={this.set}
                                    visibility={this.state.visibility}
                                    mode={this.state.mode}/>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Statistics lamps={this.state.lamps}/>
                                <Manage lamps={this.state.lamps} update={this.updateVisibility}/>
                                <Info
                                    lamps={this.state.lamps}
                                    selected={this.state.selected}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Trips
                                    center={this.state.center}
                                    set={this.setRoute}
                                    lamps={this.state.lamps}
                                    selected={this.state.selected}
                                    switch={this.switchMode}
                                    mode={this.state.mode}
                                    reset={this.reset}/>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Calendar/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Footer/>
            </div>
        );
    }
}

export default Main;
