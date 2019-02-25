import { MapLayer } from 'react-leaflet';
import L from 'leaflet';
import { withLeaflet } from 'react-leaflet';
import 'leaflet-routing-machine/src';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

class Routing extends MapLayer {

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
                serviceUrl: 'http://127.0.0.1:5001/route/v1',
                profile: 'driving'
            })
        })
        .on('routingstart', () => {})
        .on('routesfound routingerror', () => {})
        .addTo(this.props.map.current.leafletElement);

        leafletElement.hide(); // hide road describtion

        return leafletElement.getPlan();
    }
}

export default withLeaflet(Routing);
