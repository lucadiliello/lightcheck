import React, { Component } from 'react';
import { Digital } from 'react-activity';
import { Segment } from 'semantic-ui-react';
import 'react-activity/dist/react-activity.css';
import CustomMarker from './CustomMarker';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

class OpenMap extends Component {

    render(){
        return (<Segment>
            {this.props.lamps ?
                <Map
                    animate={true}
                    center={{
                        lat: this.props.center.lat,
                        lng: this.props.center.lng
                    }} zoom={this.props.center.zoom}
                    style={{height: '80vh', width: '100%'}}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                    {this.props.lamps.map( (object, i) =>
                        <CustomMarker
                            key={i}
                            lat={object.lat}
                            lng={object.lng}
                            working={object.working}
                            show={this.props.visibility[i]}/>
                    )}
                </Map> :
            <Digital />}
        </Segment>);
    }
}

export default OpenMap;
