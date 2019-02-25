import React, { Component } from 'react';
import { Digital } from 'react-activity';
import { Segment, Button } from 'semantic-ui-react';
import 'react-activity/dist/react-activity.css';
import CustomMarker from './CustomMarker';

import L from 'leaflet';
import 'leaflet-routing-machine';
import { Map, TileLayer } from 'react-leaflet';

import Routing from './Routing';

class OpenMap extends Component {

    state = {
        road: [L.latLng(46.670262, 11.150988), L.latLng(46.673626, 11.146950)]
    }

    constructor(props){
        super(props);
        this.map = React.createRef();
        this.router = React.createRef();
        this.selection = this.selection.bind(this);
        this.updateRoute = this.updateRoute.bind(this);
    }

    selection(i){
        this.props.selection(i);
    }

    updateRoute(){
        console.log(this.router);
        this.router.current.leafletElement.setWaypoints([]);
    }

    render(){
        return (<Segment>
            
            {this.props.lamps ?
                (<Map
                    style={{height: '80vh', width: '100%'}}
                    center={{
                        lat: this.props.center.lat,
                        lng: this.props.center.lng
                    }}
                    zoom={this.props.center.zoom}
                    ref={this.map}>
                    <TileLayer
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> Routing hosted with <3 by Luca Di Liello"
                        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    />
                    {this.props.lamps.map( (object, i) =>
                        <CustomMarker
                            key={i}
                            index={i}
                            lat={object.lat}
                            lng={object.lng}
                            working={object.working}
                            show={this.props.visibility[i]}
                            selection={this.selection}/>
                    )}
                    <Routing
                        ref={this.router}
                        color="blue"
                        map={this.map}
                        road={this.state.road}
                    />
                </Map>)
            : <Digital />}
        </Segment>);
    }
}

export default OpenMap;

/*
<Map ref={this.map}
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

</Map> :
*/
