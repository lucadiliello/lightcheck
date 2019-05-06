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
        legend: false,
        visibility: 'all',
        trip: {
            route: [],
            details: undefined
        },
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
        this.switchLegend = this.switchLegend.bind(this);
        this.updateDetails = this.updateDetails.bind(this);

        socket.on('init', (data) => {
            this.setState({
                lamps: data.map((a) => new Point(a, this.refresh))
            });
        });

        socket.on('update', (data) => {
            this.state.lamps.find((a) => a._id === data._id).update(data);
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

    setRoute(_route, callback) {
        this.setState({
            ...this.state,
            trip: {
                ...this.state.trip,
                route: _route,
            }
        }, callback);
    }

    updateDetails(_details, callback){
        this.setState({
            ...this.state,
            trip: {
                ...this.state.trip,
                details: _details,
            }
        }, callback);
    }

    updateVisibility(choice) {
        this.setState({
            ...this.state,
            visibility: choice
        });
    }

    switchLegend(){
        this.setState({
            ...this.state,
            legend: !this.state.legend
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
            <Segment >
                <Grid stackable className='main'>
                    <Grid.Row>
                        <Grid.Column>
                            <Intestation/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Statistics lamps={this.state.lamps}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns="2">
                        <Grid.Column width={13}>
                            <OpenMap
                                zoom={config.initialZoom}
                                route={this.state.trip.route}
                                lamps={this.state.lamps}
                                set={this.set}
                                visibility={this.state.visibility}
                                mode={this.state.mode}
                                legend={this.state.legend}
                                updateDetails={this.updateDetails}/>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Manage
                                lamps={this.state.lamps}
                                updateVisibility={this.updateVisibility}
                                legend={this.state.legend}
                                switchLegend={this.switchLegend}
                                trip={this.state.trip}ì/>
                            <Info
                                lamps={this.state.lamps}
                                selected={this.state.selected}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Trips
                                set={this.setRoute}
                                lamps={this.state.lamps}
                                selected={this.state.selected}
                                switch={this.switchMode}
                                mode={this.state.mode}
                                reset={this.reset}/>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Calendar
                                trip={this.state.trip}
                                set={this.setRoute}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Footer/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}

export default Main;
