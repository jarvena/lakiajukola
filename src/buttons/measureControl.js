import './measureControl.css';
import length from '@turf/length';

class MeasureControl {
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group'
        this._measureButton = document.createElement('button')
        this._measureButton.className = 'maplibregl-ctrl-measure'
        this._container.appendChild(this._measureButton)
        this._measureSpan = document.createElement('span')
        this._measureSpan.setAttribute('aria-hidden', 'true')
        this._measureSpan.className = 'maplibregl-ctrl-icon'
        this._measureButton.appendChild(this._measureSpan)
        this._measureButton.type = 'button';
        this._measureButton.addEventListener('click', this._toggleMeasure);
        this._container.title = 'Toggle measurement';
        this._geojson = {}
        this._linestring = {}
        return this._container;
    }
    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map.off('measure', this._updateMeasureIcon);
        this._map = undefined;
    }
    _toggleMeasure = () => {
        if (this._map.getLayer('measure-points')) {
            this._map.removeLayer('measure-points')
            this._map.removeLayer('measure-lines')
            this._map.removeSource('measureGeojson')
            this._map.off('click', this._measureClickHandler)
            this._map.off('mousemove', this._measureMoveHandler)
        } else {
            this._geojson = {
                'type': 'FeatureCollection',
                'features': []
            }
            this._linestring = {
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [],
                }
            }
            this._map.addSource('measureGeojson', {
                type: 'geojson',
                data: this._geojson,
            })
            this._map.addLayer({
                id: 'measure-points',
                type: 'circle',
                source: 'measureGeojson',
                paint: {
                    'circle-color': '#000',
                    'circle-radius': 5,
                },
                filter: ['in', '$type', 'Point']
            })
            this._map.addLayer({
                id: 'measure-lines',
                type: 'line',
                source: 'measureGeojson',
                paint: {
                    'line-color': '#000',
                    'line-width': 3
                },
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                filter: ['in', '$type', 'LineString']
            })

            this._map.on('click', this._measureClickHandler)
            this._map.on('mousemove', this._measureMoveHandler)
        }
    }
    _updateMeasureIcon = () => {
        return null
    }
    _measureClickHandler = (e) => {
        const features = this._map.queryRenderedFeatures(e.point, {
            layers: ['measure-points']
        })

        if (this._geojson.features.length > 1) this._geojson.features.pop()
        if (features.length) {
            const id = features[0].properties.id
            this._geojson.features = this._geojson.features.filter((point) => {
                return point.properties.id !== id
            })
        } else {
            const point = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [e.lngLat.lng, e.lngLat.lat],
                },
                'properties': {
                    'id': String(new Date().getTime())
                }
            }
            this._geojson.features.push(point)
        }

        if (this._geojson.features.length > 1) {
            this._linestring.geometry.coordinates = this._geojson.features.map(
                (point) => {
                    return point.geometry.coordinates
                }
            )
            this._geojson.features.push(this._linestring)

            this._map.getSource('measureGeojson').setData(this._geojson)
            
            const distanceContainer = document.getElementById('distance')
            distanceContainer.innerHTML = ''
            distanceContainer.innerHTML = `${length(this._linestring, {units: 'kilometers'}).toFixed(2)} km`
        }
    }

    _measureMoveHandler = (e) => {
        const features = this._map.queryRenderedFeatures(e.point, {
            layers: ['measure-points']
        })
        this._map.getCanvas().style.cursor = features.length ?
            'pointer' : 'grab'
    }
}
    

export default MeasureControl