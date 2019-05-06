import React, { Component } from 'react';
import { Icon, Button } from 'semantic-ui-react';
import { Marker, Popup } from 'react-leaflet';

import { OnIcon, OffIcon, DeadIcon, HomeIcon } from './Icons';

class LampMarker extends Component {

    constructor(props){
        super(props);
        this.popup = React.createRef();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.set(this.props.point);
        this.props.map.current.leafletElement.closePopup();
    }

    render() {
        let icon;
        switch (this.props.point.status) {
            case 'working':
                icon = OnIcon;
                break;
            case 'broken':
                icon = OffIcon;
                break;
            case 'dead':
                icon = DeadIcon;
                break;
            case 'main':
                icon = HomeIcon;
                break;
            default:
                icon = DeadIcon;
                break;
        }

        if((this.props.point.status === this.props.visibility) || (this.props.visibility === 'all')) {
            return (
                <Marker position={[this.props.point.lat, this.props.point.lng]} icon={icon}>
                    <Popup ref={this.popup} color="black" className='lamp-marker'>
                        <Button onClick={this.handleClick} color='teal' icon>
                            <Icon name={this.props.mode === 'info' ? "info" : "selected radio"}/> {this.props.mode === 'info' ? "Info" : "Select"}
                        </Button>
                    </Popup>
                </Marker>
            );
        }
        else return null;
    }
}

export default LampMarker;
