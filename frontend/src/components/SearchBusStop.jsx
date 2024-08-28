// src/SearchBusStop.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { FaBusAlt, FaMapMarkerAlt } from 'react-icons/fa';

const SearchBusStop = () => {
  const [query, setQuery] = useState('');
  const [busStopDetails, setBusStopDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mapboxApiKey = 'pk.eyJ1IjoiYW1hbmd1cHRhMTIxIiwiYSI6ImNtMGUzNDEyMzBqc2oya3NjY3E3cWRyd3kifQ.77WQk0FBICCtjCWqF_GStA';

  const searchLocation = async (locationQuery) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      locationQuery
    )}.json?access_token=${mapboxApiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.features.length > 0) {
        const { center } = response.data.features[0];
        return {
          latitude: center[1],
          longitude: center[0],
        };
      } else {
        throw new Error('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setError('Error fetching location');
      return null;
    }
  };

  const getNearbyBusStops = async (latitude, longitude) => {
    const url = `http://localhost:9002/api/bus-stops/nearby?lat=${latitude}&lng=${longitude}`;

    try {
      const response = await axios.get(url);
      setBusStopDetails(response.data);
    } catch (error) {
      console.error('Error fetching bus stops:', error);
      setError('Error fetching bus stops');
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const location = await searchLocation(query);
      if (location) {
        await getNearbyBusStops(location.latitude, location.longitude);
      }
    } catch (error) {
      setError('No details found for this location.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg text-white relative overflow-hidden">
      <img
        src="https://via.placeholder.com/600x400"
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full opacity-30"
      />

      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-300">
          Search Bus Stop
        </h2>
        <div className="flex flex-col items-center mb-6 space-y-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter location"
            className="w-4/5 md:w-1/2 p-3 mb-4 border border-gray-700 rounded-md bg-gray-800 text-white"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-green-700 transition duration-150"
          >
            {loading ? 'Searching...' : 'Find'}
          </button>
        </div>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {busStopDetails.length > 0 && (
          <div className="mt-8">
            <table className="table-auto w-full text-center border-collapse bg-gray-800 rounded-lg">
              <thead>
                <tr className="bg-green-800">
                  <th className="border border-green-900 p-3">S. No.</th>
                  <th className="border border-green-900 p-3">Name</th>
                  <th className="border border-green-900 p-3">
                    Distance from {query} (in meters)
                  </th>
                  <th className="border border-green-900 p-3">Routes</th>
                </tr>
              </thead>
              <tbody>
                {busStopDetails.map((stop, index) => (
                  <tr key={stop._id} className="bg-gray-700 hover:bg-gray-600">
                    <td className="border border-green-900 p-3">{index + 1}</td>
                    <td className="border border-green-900 p-3 text-blue-400 cursor-pointer">
                      <FaMapMarkerAlt className="inline-block mr-2 text-green-500" />
                      {stop.name}
                    </td>
                    <td className="border border-green-900 p-3">{stop.distance}</td>
                    <td className="border border-green-900 p-3 text-blue-400">
                      {stop.routes.map((route, i) => (
                        <span key={i} className="flex items-center justify-center">
                          <FaBusAlt className="inline-block mr-1 text-yellow-400" />
                          {route}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBusStop;
