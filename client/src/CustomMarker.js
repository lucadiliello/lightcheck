import React, { Component } from 'react';

import { Icon, Button } from 'semantic-ui-react';
import { Marker, Popup } from 'react-leaflet';

import L from 'leaflet';

const onIcon = new L.Icon({
    iconUrl: '/icons/lamp_on.svg',
    iconRetinaUrl: '/icons/lamp_on.svg',
    iconSize: new L.Point(40, 50),
    iconAnchor: [5, 55],
    popupAnchor: [15, -44],
});

const offIcon = new L.Icon({
    iconUrl: '/icons/lamp_off.svg',
    iconRetinaUrl: '/icons/lamp_off.svg',
    iconSize: new L.Point(40, 50),
    iconAnchor: [5, 55],
    popupAnchor: [15, -44],
});

class CustomMarker extends Component {

    shouldComponentUpdate(nextProps){
        return this.props.working !== nextProps.working;
    }

    render() {
        return <Marker position={[this.props.lat, this.props.lng]} icon={this.props.working ? onIcon : offIcon}>
            <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
        </Marker>;
    }
}

CustomMarker.defaultProps = {
    working: true
};

export default CustomMarker;
