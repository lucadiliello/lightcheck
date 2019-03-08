import React, { Component } from 'react';
import ApiCalendar from './ApiCalendar';
import { Segment, Header, Form, Popup } from 'semantic-ui-react';
import { DateTimeInput, TimeInput } from 'semantic-ui-calendar-react';
import moment from 'moment';

class Calendar extends Component {

    state = {
        calendars: {
            list: [],
            loading: false
        },
        signed: ApiCalendar.sign,
        start_time: '',
        fix_time: '30:00'
    }

    constructor(props) {
        super(props);
        this.updateCalendars = this.updateCalendars.bind(this);
        this.updateSignedStatus = this.updateSignedStatus.bind(this);
        this.getCalendars = this.getCalendars.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.addEvent = this.addEvent.bind(this);

        ApiCalendar.onLoad(() => {
            ApiCalendar.listenSign(this.updateSignedStatus);
            this.updateSignedStatus();
            this.updateCalendars();
        });
    }

    /* LOGIN */
    updateSignedStatus() {
        this.setState({
            ...this.state,
            signed: ApiCalendar.sign
        });
    }

    login() {
        ApiCalendar.handleAuthClick();
    }

    logout() {
        ApiCalendar.handleSignoutClick();
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

    getUpcomingEvents(){
        if(ApiCalendar.sign){
            ApiCalendar.listUpcomingEvents(10)
                .then((result) => {
                    console.log(result);
                });
        }
    }

    addEvent() {
        let target = moment(this.state.start_time, 'dd-mm-yyyy hh:mm');

        ApiCalendar.createEvent({
            start: {
                dateTime: target.format("YYYY-MM-DDTHH:mm:ssZ")
            },
            end: {
                dateTime: target.add(2, 'hours').format("YYYY-MM-DDTHH:mm:ssZ")
            },
            summary: "Meet with Passerini"

        }).then((result: object) => {
            console.log(result);
        }).catch((error: any) => {
            console.log(error);
        });
    }

    deleteEvent(eventId) {
        ApiCalendar.deleteEvent(eventId);
    }

    render() {
        return (
            <Segment textAlign='left'>
                <Header as='h2' textAlign="center">
                    Create calendar events
                </Header>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Button fluid onClick={this.login} primary disabled={this.state.signed}>
                            Login
                        </Form.Button>
                        <Form.Button fluid onClick={this.logout} primary disabled={!this.state.signed}>
                            Logout
                        </Form.Button>
                    </Form.Group>
                    <Form.Group>
                        <Form.Dropdown width={13} placeholder='Using default calendar' fluid selection options={this.getCalendars()} onChange={this.setCalendar}/>
                        <Popup content='Update calendar list' trigger={
                            <Form.Button fluid width={3} icon='refresh' onClick={this.updateCalendars} loading={this.state.calendars.loading} primary/>
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
                            label='Estimated time for fixing a lamp'
                            value={this.state.fix_time}
                            iconPosition="left"
                            onChange={
                               (event, {name, value}) =>
                                   this.setState({
                                       ...this.state,
                                       fix_time: value
                                   })
                            }/>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Button fluid onClick={this.addEvent} primary disabled={!this.state.start_time}>
                            Add
                        </Form.Button>
                        <Form.Button fluid onClick={this.getUpcomingEvents} primary>
                            Get
                        </Form.Button>
                    </Form.Group>
                </Form>
            </Segment>
        );
    }
}

export default Calendar;
