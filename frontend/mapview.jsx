import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';

// Ensure you use the correct path to your CSS file
import './style.css';

// Initialize the Socket.io client
const socket = io('http://localhost:9002'); // Update with your server URL if different

const MapView = () => {
    useEffect(() => {
        // Initialize Leaflet map
        const map = L.map('map').setView([51.505, -0.09], 13); // Set your default location and zoom level

        // Add tile layer to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Handle real-time location updates
        socket.on('receive-location', (data) => {
            // Update the map with the new location data
            L.marker([data.latitude, data.longitude]).addTo(map)
                .bindPopup(`<b>User ID:</b> ${data.id}`)
                .openPopup();
        });

        // Cleanup on component unmount
        return () => {
            socket.off('receive-location');
        };
    }, []);

    return (
        <div id="map" style={{ height: '100vh', width: '100%' }}></div>
    );
};

export default MapView;
