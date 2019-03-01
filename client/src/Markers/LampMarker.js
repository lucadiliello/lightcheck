import React, { Component } from 'react';
import { Icon, Button } from 'semantic-ui-react';
import { Marker, Popup } from 'react-leaflet';

import { onIcon, offIcon } from './Icons';

class LampMarker extends Component {

    constructor(props){
        super(props);
        this.popup = React.createRef();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.selection(this.props.index);
        this.props.map.current.leafletElement.closePopup();
    }

    render() {
        if(this.props.show)
            return (<Marker position={[this.props.lat, this.props.lng]} icon={this.props.working ? onIcon : offIcon}>
                    <Popup ref={this.popup} color="black" style={{opacity: 0.2}}>
                        <Button onClick={this.handleClick} color='teal' icon>
                            <Icon name={this.props.mode === 'info' ? "info" : "selected radio"}/> {this.props.mode === 'info' ? "Info" : "Select"}
                        </Button>
                    </Popup>
                </Marker>);
        return null;
    }
}

export default LampMarker;
