import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

import '@watergis/maplibre-gl-export/dist/maplibre-gl-export.css';

import MeasureControl from '../buttons/measureControl';

export default function Map(){
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(23.036);
    const [lat] = useState(63.16);
    const [zoom] = useState(12.5);
  
    useEffect(() => {
      if (map.current) return;
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
            version: 8,
            sources: {
                mapantTiles: {
                    type: 'raster',
                    tiles: ['https://wmts.mapant.fi/wmts_EPSG3857.php?z={z}&y={y}&x={x}'],
                    tileSize: 256,
                    attribution: 'MapAnt',
                },
                oldMapTiles: {
                    type: 'raster',
                    tiles: ['./tiles/{z}/{x}/{y}.png'],
                    tileSize: 512,
                    attribution: 'Jukola 2024',
                    maxzoom: 16,
                    minzoom: 10,
                    bounds: [22.9741304476998884, 63.123, 23.0975667163662273, 63.1911428168735370],
                },
                forbiddenAreaPolygon: {
                    type: 'geojson',
                    data: './data/forbiddenArea.geojson'
                },
                terrainSource: {
                  type: 'raster-dem',
                  url: './data/elevation/tileset.json',
                  tileSize: 256
                }
            },
            layers: [
                {
                    id: 'mapant',
                    type: 'raster',
                    source: 'mapantTiles',
                    maxzoom: 20,
                },
                {
                    id: 'oldMaps',
                    type: 'raster',
                    source: 'oldMapTiles',
                },
                {
                    id: 'forbiddenArea',
                    type: 'line',
                    source: 'forbiddenAreaPolygon',
                    paint: {
                      'line-color': '#CC29CC',
                      'line-width':  [
                        'interpolate', 
                        // ['linear'], 
                        // ['zoom'], 
                        // 10, 2, 
                        // 24, 3
                        ['exponential', 2], 
                        ['zoom'],
                        12, ["*", 10, ["^", 2, -2]], 
                        24, ["*", 10, ["^", 2, 8]]
                    ],
                    }
                },
            ],
        },
        center: [lng, lat],
        zoom: zoom,
        maxZoom: 18,
        minZoom: 10,
      });
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.current.addControl(
        new maplibregl.TerrainControl({
            source: 'terrainSource',
            exaggeration: 10
        })
      );
      map.current.addControl(new MeasureControl())
    });
  
    return (
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
        <div id="distance" className="distance-container"></div>
      </div>
    );
  }