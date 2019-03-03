import React, { Component } from 'react';
import { Digital } from 'react-activity';
import { Segment } from 'semantic-ui-react';
import 'react-activity/dist/react-activity.css';
import 'leaflet-routing-machine';
import { Map, TileLayer } from 'react-leaflet';

import Routing from './Routing';
import HomeMarker from '../Markers/HomeMarker';
import LampMarker from '../Markers/LampMarker';

const config = require('../Config/config.json');

class OpenMap extends Component {

    constructor(props){
        super(props);
        this.map = React.createRef();
    }

    render(){
        return (<Segment>
            {this.props.lamps ?
                (<Map
                    maxZoom={18}
                    style={{height: '80vh', width: '100%'}}
                    center={{
                        lat: this.props.center.lat,
                        lng: this.props.center.lng
                    }}
                    zoom={this.props.center.zoom}
                    ref={this.map}>
                    <TileLayer
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> Hosted with <3 by Luca Di Liello"
                        url={config.tile_server}
                    />
                    <HomeMarker lat={this.props.center.lat} lng={this.props.center.lng}/>
                    {this.props.lamps.map( (object, i) =>
                        <LampMarker
                            key={i}
                            index={i}
                            lat={object.lat}
                            lng={object.lng}
                            working={object.working}
                            show={this.props.visibility[i]}
                            selection={this.props.selection}
                            mode={this.props.mode}
                            map={this.map}/>
                    )}
                    <Routing
                        color="blue"
                        map={this.map}
                        road={this.props.route}
                    />
                </Map>)
            : <Digital />}
        </Segment>);
    }
}

export default OpenMap;
