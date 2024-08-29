import React, { useState } from 'react';
import axios from 'axios';

const RouteDetails = () => {
  const [routeDetails, setRouteDetails] = useState({
    routeId: '',
    origin: '',
    destination: '',
    busStops: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRouteChange = async (e) => {
    const routeId = e.target.value;
    setRouteDetails({ routeId, origin: '', destination: '', busStops: [] });
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:9002/api/routes/${routeId}`);
      const data = response.data;

      // Transform data to match expected format
      const transformedData = {
        routeId: data.route_short_name,
        route_name: data.route_name || 'Origin Placeholder',
        destination: data.bus_stops[data.bus_stops.length - 1] || 'Destination Placeholder',
        busStops: data.bus_stops || [],
      };

      setRouteDetails(transformedData);
    } catch (err) {
      setError('No details found for this route.');
      setRouteDetails({ routeId, origin: '', destination: '', busStops: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
      <h2 className="text-2xl font-bold mb-4 animate-bounce">Bus Details</h2>
      <p className="mb-4">Enter the route number to view the details:</p>
      <input
        type="text"
        className="w-full p-2 mb-4 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        placeholder="Enter Route Number"
        onChange={handleRouteChange}
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {routeDetails.routeId && (
        <div className="mt-4 p-4 bg-gray-700 rounded-md transition-opacity duration-500 ease-in-out opacity-100">
          <h3 className="text-xl font-semibold mb-2">Bus Details:</h3>
          <p><strong>Route ID:</strong> {routeDetails.routeId}</p>
          <p><strong>Route Name:</strong> {routeDetails.route_short_name}</p>
          <p><strong>Destination:</strong> {routeDetails.destination}</p>
          <p><strong>Bus Stops:</strong></p>
          <ul className="list-disc ml-6">
            {routeDetails.busStops.map((stop, index) => (
              <li key={index}>{stop}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RouteDetails;
