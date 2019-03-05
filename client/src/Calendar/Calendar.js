import React, { Component } from 'react';
import ApiCalendar from './ApiCalendar';
import { Segment, Header, Form, Popup } from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import moment from 'moment';

class Calendar extends Component {

    state = {
        calendars: {
            list: [],
            selected: undefined,
            loading: false
        },
        signed: ApiCalendar.sign,
        start_time: ''
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

    getRFC3339(date){
        return moment(date).format("YYYY-MM-DDTHH:mm:ssZ")
    }

    addEvent() {
        let target = new Date(this.state.start_time);
        let date1 = new Date(target);
        target.setHours(target.getHours()+2);
        let date2 = new Date(target);
        console.log(date1.toISOString());
        console.log(date2);
        ApiCalendar.createEvent({
            start: {
                dateTime: date1.toISOString()
            },
            end: {
                dateTime: date2.toISOString()
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
                        <Form.Dropdown fluid width={13} placeholder='Select a calendar' fluid selection options={this.getCalendars()} onChange={this.setCalendar}/>
                        <Popup content='Update calendar list' trigger={
                            <Form.Button fluid width={3} icon='refresh' onClick={this.updateCalendars} loading={this.state.calendars.loading} primary/>
                        }/>
                    </Form.Group>
                    <Form.Group>
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
