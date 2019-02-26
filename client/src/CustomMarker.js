import React, { Component } from 'react';
import { Icon, Button } from 'semantic-ui-react';
import { Marker, Popup } from 'react-leaflet';

import L from 'leaflet';

let icon_size = new L.Point(30, 40);

const onIcon = new L.Icon({
    iconUrl: '/icons/lamp_on.svg',
    iconRetinaUrl: '/icons/lamp_on.svg',
    iconSize: icon_size,
    iconAnchor: [5, 55],
    popupAnchor: [10, -50],
});

const offIcon = new L.Icon({
    iconUrl: '/icons/lamp_off.svg',
    iconRetinaUrl: '/icons/lamp_off.svg',
    iconSize: icon_size,
    iconAnchor: [5, 55],
    popupAnchor: [10, -50],
});

class CustomMarker extends Component {

    constructor(props){
        super(props);
        this.popup = React.createRef();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.selection(this.props.index);
        this.popup.current.leafletElement.options.leaflet.map.closePopup();
    }

    render() {
        if(this.props.show)
            return <Marker position={[this.props.lat, this.props.lng]} icon={this.props.working ? onIcon : offIcon}>
                        <Popup ref={this.popup}>
                            <Button onClick={this.handleClick} color='teal' icon>
                                <Icon name={this.props.mode === 'info' ? "info" : "selected radio"}/>{this.props.mode === 'info' ? "Info" : "Select"}
                            </Button>
                        </Popup>
                    </Marker>;
        return null;
    }
}

export default CustomMarker;
