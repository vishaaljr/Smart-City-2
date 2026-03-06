import React, { useEffect, useRef } from 'react';
import { getPriorityColor } from '../utils/priorityHelpers';

export default function MapPanel({ incidents, onSelectIncident }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const heatmapLayerRef = useRef(null);
    const markersLayerRef = useRef(null);

    useEffect(() => {
        // Inject Leaflet and Leaflet.heat scripts if not already present
        // It's safer to ensure they exist before initializing
        const checkLeaflet = () => {
            if (window.L) {
                initMap();
            } else {
                if (!document.getElementById('leaflet-script')) {
                    const lScript = document.createElement('script');
                    lScript.id = 'leaflet-script';
                    lScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    document.body.appendChild(lScript);

                    lScript.onload = initMap;
                } else {
                    // Check periodically if another component mounted it
                    setTimeout(checkLeaflet, 100);
                }
            }
        };
        checkLeaflet();

        return () => {
            // Map cleanup occurs on unmount
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    const initMap = () => {
        if (mapInstanceRef.current || !mapRef.current) return;

        const L = window.L;

        // Initialize standard Leaflet Map
        const map = L.map(mapRef.current, {
            center: [13.0827, 80.2707], // Chennai
            zoom: 12,
            zoomControl: false,
            attributionControl: false
        });

        // Google Maps style tiles
        L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 19
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;
        markersLayerRef.current = L.layerGroup().addTo(map);

        // Initial draw
        updateMapData();
    };

    const updateMapData = () => {
        if (!mapInstanceRef.current || !window.L) return;

        const L = window.L;
        const map = mapInstanceRef.current;

        // Update Markers
        markersLayerRef.current.clearLayers();

        incidents.forEach(inc => {
            const color = getPriorityColor(inc.priorityScore);
            const isCritical = inc.priorityScore >= 80;

            // Custom HTML Icon
            const customIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `
          <div class="relative flex items-center justify-center pointer-events-auto" style="width: 24px; height: 24px;">
            <div class="absolute w-4 h-4 rounded-full border-2 border-dark z-10" style="background-color: ${color}"></div>
            ${isCritical ? `<div class="absolute w-full h-full rounded-full pulse-ring" style="background-color: ${color}"></div>` : ''}
          </div>
        `,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            const marker = L.marker([inc.lat, inc.lng], { icon: customIcon });

            marker.on('click', () => {
                onSelectIncident(inc);
                // Subtle flyTo on select
                map.flyTo([inc.lat, inc.lng], 14, { duration: 0.8 });
            });

            markersLayerRef.current.addLayer(marker);
        });
    };

    // Re-run update when incidents change
    useEffect(() => {
        if (mapInstanceRef.current) {
            updateMapData();
        }
    }, [incidents, onSelectIncident]);

    return (
        <div className="w-full h-full relative p-6 pointer-events-none">
            <div
                ref={mapRef}
                className="w-full h-full rounded-2xl border border-white/10 glass-panel overflow-hidden pointer-events-auto shadow-2xl transition-all-300"
            />
        </div>
    );
}
