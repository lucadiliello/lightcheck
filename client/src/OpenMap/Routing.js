import { MapLayer } from 'react-leaflet';
import L from 'leaflet';
import { withLeaflet } from 'react-leaflet';
import 'leaflet-routing-machine/src';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const config = require('../Config/config.json');

class Routing extends MapLayer {

    componentDidUpdate(prevProps, prevState) {
        if (!this.arraysEqual(prevProps.road, this.props.road)) {
            this.state.leafletElement.setWaypoints(this.props.road);
        }
        if(this.props.road.length === 0) this.state.leafletElement.hide();
        else this.state.leafletElement.show();
    }

    arraysEqual(arr1, arr2) {
        if(!arr1 || !arr2) return true;
        if(arr1.length !== arr2.length) return false;
        for(var i = arr1.length; i--;) if(arr1[i] !== arr2[i]) return false;
        return true;
    }

    createLeafletElement() {
        let leafletElement = L.Routing.control({
            waypoints: this.props.road,
            lineOptions: {
                styles: [{
                    color: this.props.color,
                    opacity: .8,
                    weight: 6
                }]
            },
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: false,
            showAlternatives: false,
            altLineOptions: { styles: [{opacity: 0}] },
            createMarker: () => { return null; },
            router: new L.Routing.OSRMv1({
                serviceUrl: config.osrm_server + '/route/v1',
                profile: 'driving'
            })
        })
        .on('routingstart', () => {})
        .on('routesfound routingerror', () => {})
        .addTo(this.props.map.current.leafletElement);

        this.state = {
            leafletElement: leafletElement
        }
        leafletElement.hide();

        return leafletElement.getPlan();
    }
}

export default withLeaflet(Routing);
