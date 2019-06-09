import React, { Component } from 'react';
import ApiCalendar from './ApiCalendar';
import { Segment, Header, Form, Popup, Divider, Message, List, Button, Label } from 'semantic-ui-react';
import { DateTimeInput, TimeInput } from 'semantic-ui-calendar-react';
import moment from 'moment';
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment);

class Calendar extends Component {

    state = {
        calendars: {
            list: [],
            loading: false
        },
        signed: ApiCalendar.sign,
        start_time: '',
        fix_time: '',
        events: [],
        loadingLogin: false,
        loadingAdd: false
    }

    constructor() {
        super();
        this.updateCalendars = this.updateCalendars.bind(this);
        this.updateSignedStatus = this.updateSignedStatus.bind(this);
        this.getCalendars = this.getCalendars.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.createFixEvent = this.createFixEvent.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);

        ApiCalendar.onLoad(() => {
            ApiCalendar.listenSign(this.updateSignedStatus);
            this.updateSignedStatus();
            if(ApiCalendar.sign) this.updateCalendars();
        });
    }

    /* LOGIN */
    updateSignedStatus() {
        this.setState({
            ...this.state,
            signed: ApiCalendar.sign,
            loadingLogin: false
        });
    }

    login() {
        this.setState({
            ...this.state,
            loadingLogin: true
        }, ApiCalendar.handleAuthClick);

    }

    logout() {        
        this.setState({
            ...this.state,
            loadingLogin: true
        }, ApiCalendar.handleSignoutClick);
    }

    /* CALENDAR SELECTION */
    setCalendar(e, { value }) {
        ApiCalendar.setCalendar(value);
    }

    updateCalendars() {
        this.setState({
            ...this.state,
            calendars: {
                ...this.state.calendars,
                loading: true
            }
        }, () => ApiCalendar.getCalendars(
            (response) => this.setState({
                ...this.state,
                calendars: {
                    ...this.state.calendars,
                    list: response.result.items,
                    loading: false
                }
            })
        ));
    }

    getCalendars() {
        return this.state.calendars.list.map((a) => ({text: a.summary, value: a.id}));
    }

    createFixEvent(){
        this.setState({
            ...this.state,
            loadingAdd: true
        }, () => {
            let trip_time = moment.duration(this.state.fix_time, 'mm:ss').asSeconds() * this.props.trip.route.length + this.props.trip.details.summary.totalTime;
            let start = moment(this.state.start_time, 'DD-MM-YYYY hh:mm');
            let end = moment(this.state.start_time, 'DD-MM-YYYY hh:mm').add(trip_time, 'seconds');

            let duration = moment.duration(end.diff(start)).format("h [hrs], m [min]");
            let length = (this.props.trip.details.summary.totalDistance / 1000).toFixed(3);
            let description = "Fix event through: " + this.props.trip.route.map((a) => a.address).join(", ") + ` | Duration: ${duration}, Length: ${length}km`;

            this.addEvent({
                startTime: start,
                endTime: end,
                route: this.props.trip.route.slice(0),
                description: description
            });
        });
    }

    /**
     * Insert a new event in Google Calendar
     * @param {event} event Event object should have a startTime, an endTime and a description
     */
    addEvent(_event){
        ApiCalendar.createEvent({
            start: {
                dateTime: _event.startTime.format("YYYY-MM-DDTHH:mm:ssZ")
            },
            end: {
                dateTime: _event.endTime.format("YYYY-MM-DDTHH:mm:ssZ")
            },
            summary: _event.description

        }).then((result) => {
            _event.id = result.result.id;
            this.setState({
                ...this.state,
                events: this.state.events.concat([_event]),
                loadingAdd: false
            })
        }).catch((error) => {
            console.log(error);
        });
    }

    deleteEvent(eventId) {
        ApiCalendar.deleteEvent(eventId, () => {
            this.setState({
                ...this.state,
                events: this.state.events.filter((e) => e.id !== eventId)
            })
        }, (err) => console.log(err));
    }

    render() {
        return (
            <Segment textAlign='left'>
                <Header as='h2' textAlign="center">
                    Create calendar events
                </Header>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Button fluid onClick={this.state.signed ? this.logout : this.login} primary inverted={this.state.signed} loading={this.state.loadingLogin}>
                            {this.state.signed ? "Logout" : "Login"}
                        </Form.Button>
                        <Form.Button fluid onClick={this.createFixEvent} primary disabled={!(this.state.start_time && this.props.trip.details && (this.props.trip.route.length > 0) && this.state.signed)}>
                            Add
                        </Form.Button>
                    </Form.Group>
                    <Form.Group>
                        <Form.Dropdown width={13} placeholder='Using default calendar' fluid selection options={this.getCalendars()} onChange={this.setCalendar}/>
                        <Popup content='Update calendar list' trigger={
                            <Form.Button fluid width={3} icon='refresh' disabled={!this.state.signed} onClick={this.updateCalendars} loading={this.state.calendars.loading} primary/>
                        }/>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <DateTimeInput
                            label='Starting date and time'
                            value={this.state.start_time}
                            placeholder='select a date'
                            iconPosition="left"
                            onChange={
                               (event, {name, value}) =>
                                   this.setState({
                                       ...this.state,
                                       start_time: value
                                   })
                            }/>
                        <TimeInput
                            label='Estimated time to fix a lamp'
                            value={this.state.fix_time}
                            iconPosition="left"
                            placeholder='select hours and minutes'
                            onChange={
                               (event, {name, value}) =>
                                   this.setState({
                                       ...this.state,
                                       fix_time: value
                                   })
                            }/>
                    </Form.Group>
                </Form>
                <Divider/>
                <div style={{textAlign: 'center'}}>
                {
                    this.state.events.length > 0 ?
                    (
                        <List className='trip-list'>
                            {this.state.events.map((ev, i) =>
                                (<List.Item key={i}>
                                    <Message>
                                        <Message.Header>
                                            <Button
                                                icon='delete' circular
                                                size='small' color='red'
                                                onClick={() => this.deleteEvent(ev.id)}/>

                                            <Button icon='angle double up' circular
                                                    size='small' color='teal'
                                                    onClick={() => this.props.set(ev.route)}/>

                                        </Message.Header>
                                            <p>
                                                {ev.description}
                                            </p>
                                      </Message>
                                   </List.Item>
                               ))
                        }</List>) : <Label>No event in memory</Label>
                    }
                    </div>
            </Segment>
        );
    }
}

export default Calendar;
