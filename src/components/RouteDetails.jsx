import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import axios from 'axios';

const Routes = () => {
  const [routeNumber, setRouteNumber] = useState('');
  const [busDetails, setBusDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:9002/api/routes/${routeNumber}`);
      const data = response.data;

      // Transform data to match expected format
      const transformedData = {
        routeNumber: data.route_short_name,
        serviceProvider: 'DTC', // Static value or replace with actual data if available
        origin: data.route_name || 'Origin Placeholder', // First bus stop as origin
        destination: data.bus_stops[data.bus_stops.length - 1] || 'Destination Placeholder', // Last bus stop as destination
        busStops: data.bus_stops.map(stop => ({ name: stop, position: [/* Add actual coordinates here if available */] })),
        routePath: [], // Add logic to populate route path if available
      };
      setBusDetails(transformedData);
    } catch (err) {
      setError('No details found for this route.');
      setBusDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const scrollToETA = () => {
    const element = document.getElementById('eta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-900 text-white p-28 h-auto flex flex-col lg:flex-row">
      <div className="w-full h-1/2 lg:w-1/2 p-4">
        <h2 className="text-3xl font-bold mb-4 animate-fadeIn">Route Details</h2>
        <div className="mb-4">
          <input
            type="text"
            value={routeNumber}
            onChange={(e) => setRouteNumber(e.target.value)}
            placeholder="Enter Route Number"
            className="p-2 rounded bg-gray-800 text-white w-full"
          />
          <button
            onClick={handleSearch}
            className="mt-2 p-2 bg-blue-600 rounded text-white w-full transition-transform transform hover:scale-105"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        {busDetails && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold mb-2">Details for Route {busDetails.routeNumber}</h3>
            <p><strong>Service Provider:</strong> {busDetails.serviceProvider}</p>
            <p><strong>Route Name:</strong> {busDetails.origin}</p>
            <p><strong>Last Stop:</strong> {busDetails.destination}</p>
            <p><strong>Bus Stops:</strong></p>
            <ul className="list-disc ml-6">
              {busDetails.busStops.map((stop, index) => (
                <li key={index}>{stop.name}</li>
              ))}
            </ul>
            <button
              onClick={scrollToETA}
              className="mt-4 p-2 bg-green-600 rounded text-white w-full transition-transform transform hover:scale-105"
            >
              Show More Bus Stops
            </button>
          </motion.div>
        )}
      </div>

      {busDetails && (
        <div className="w-full lg:w-1/2 p-4 relative z-0">
          <div className="absolute inset-0">
            <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {busDetails.busStops.map((stop, index) => (
                <Marker key={index} position={[28.6139, 77.2090]}> {/* Replace with actual stop coordinates */}
                  <Popup>{stop.name}</Popup>
                </Marker>
              ))}
              <Polyline positions={busDetails.routePath} color="blue" />
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routes;
