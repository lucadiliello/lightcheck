import React, { Component } from 'react';
import { Digital } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import 'leaflet-routing-machine';
import { Map, TileLayer } from 'react-leaflet';

import Routing from './Routing';
import LampMarker from '../Markers/LampMarker';

import './OpenMap.css';

const config = require('../Config/config.json');

class OpenMap extends Component {

    constructor(props){
        super(props);
        this.map = React.createRef();
    }

    render(){
        if (this.props.lamps) {
            let center = this.props.lamps.find((a) => a.status === 'main') || {lat: 0, lng: 0};
            return (<div className='container'>
                <Map
                    maxZoom={18}
                    className='map'
                    center={{
                        lat: center.lat,
                        lng: center.lng
                    }}
                    zoom={this.props.zoom}
                    ref={this.map}>
                    <TileLayer
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> Hosted with <3 by Luca Di Liello"
                        url={config.tile_server}
                    />

                    {this.props.lamps.map( (point, i) =>
                        <LampMarker
                            key={point._id}
                            point={point}
                            visibility={this.props.visibility}
                            set={this.props.set}
                            mode={this.props.mode}
                            map={this.map}/>
                    )}
                    <Routing
                        color="blue"
                        map={this.map}
                        road={this.props.route}
                    />
                </Map>
            </div>);
        }
        return <div className='container'><Digital /></div>;
    }
}

export default OpenMap;
