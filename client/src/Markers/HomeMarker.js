import React, { Component } from 'react';
import { Marker } from 'react-leaflet';

import { HomeIcon } from './Icons';

class HomeMarker extends Component {

    render(){
        return <Marker position={[this.props.lat, this.props.lng]} icon={HomeIcon}/>
    }
}

export default HomeMarker;
