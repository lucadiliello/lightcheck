import React, { Component } from 'react';
import { Icon, Button } from 'semantic-ui-react';
import { Popup } from 'react-leaflet';

import L from 'leaflet';

let icon_size = new L.Point(30, 40);

const onIcon = new L.Icon({
    iconUrl: '/icons/lamp_on.svg',
    iconRetinaUrl: '/icons/lamp_on.svg',
    iconSize: icon_size,
    iconAnchor: [5, 55],
    popupAnchor: [15, -44],
});

const offIcon = new L.Icon({
    iconUrl: '/icons/lamp_off.svg',
    iconRetinaUrl: '/icons/lamp_off.svg',
    iconSize: icon_size,
    iconAnchor: [5, 55],
    popupAnchor: [15, -44],
});

class CustomMarker extends Component {

    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.selection(this.props.index);
        this.setState({
            visible: false
        })
    }

    render() {
        if(this.props.visible)
            return (<Popup>
                <Button onClick={this.handleClick} color='teal' icon>
                    <Icon name={this.props.mode === 'info' ? "info" : "selected radio"}/>{this.props.mode === 'info' ? "Info" : "Select"}
                </Button>
            </Popup>);
        else return null;
    }
}

export default CustomMarker;
