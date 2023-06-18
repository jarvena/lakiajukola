import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import './map.css';

export default function Map(){
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(23.052577972412);
    const [lat] = useState(63.138004141458);
    const [zoom] = useState(14);
  
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
                forbiddenAreaPolygon: {
                    type: 'geojson',
                    data: './data/forbiddenArea.geojson'
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
                    id: 'forbiddenArea',
                    type: 'line',
                    source: 'forbiddenAreaPolygon'
                }
            ]
        },
        center: [lng, lat],
        zoom: zoom
      });
      //map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    });
  
    return (
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
    );
  }