import React, { Component } from 'react';
import { Digital } from 'react-activity';
import { Segment } from 'semantic-ui-react';
import 'react-activity/dist/react-activity.css';
import CustomMarker from './CustomMarker';

import 'leaflet-routing-machine';
import { Map, TileLayer } from 'react-leaflet';

import Routing from './Routing';

const config = require('./config.json');

class OpenMap extends Component {

    constructor(props){
        super(props);
        this.map = React.createRef();
        this.router = React.createRef();
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
    }

    handleMarkerClick(i){
        this.props.selection(i);
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
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> Hosted with <3 by Luca Di Liello"
                        url={config.tile_server}
                    />
                    {this.props.lamps.map( (object, i) =>
                        <CustomMarker
                            key={i}
                            index={i}
                            lat={object.lat}
                            lng={object.lng}
                            working={object.working}
                            show={this.props.visibility[i]}
                            selection={this.handleMarkerClick}
                            mode={this.props.mode}/>
                    )}
                    <Routing
                        ref={this.router}
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
