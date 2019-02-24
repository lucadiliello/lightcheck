import React, { Component } from 'react';
import { Digital } from 'react-activity';
import { Segment } from 'semantic-ui-react';
import 'react-activity/dist/react-activity.css';
import CustomMarker from './CustomMarker';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

class OpenMap extends Component {

    render(){
        return (<Segment>
            {this.props.positions ?
                <Map
                    animate={true}
                    center={{
                        lat: this.props.positions.station.lat,
                        lng: this.props.positions.station.lng
                    }} zoom={this.props.positions.station.zoom}
                    style={{height: '80vh', width: '100%'}}
                >
                    <TileLayer
                      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                      url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                    {this.props.positions.lamps.map( (object, i) =>
                        <CustomMarker
                            key={i}
                            lat={object.lat}
                            lng={object.lng}
                            working={object.working}/>)}
                </Map> :
            <Digital />}
        </Segment>);
    }
}

export default OpenMap;


/*
<Marker position={this.state.position}>
    <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
</Marker>


<GoogleMapReact
    bootstrapURLKeys={{ key: "AIzaSyAYUQBt0jOyQyq8NTS1qYKlndr3N7-uImE" }}
    defaultCenter={{
        lat: this.props.positions.station.lat,
        lng: this.props.positions.station.lng
    }}
    defaultZoom={this.props.positions.station.zoom}
>
    {this.props.positions.lamps.map( (object, i) =>
        <Marker
            key={i}
            lat={object.lat}
            lng={object.lng}
            working={object.working}/>)
    }
</GoogleMapReact>
*/
