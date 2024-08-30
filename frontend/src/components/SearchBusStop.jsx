import React, { useState } from 'react';
import { FaBusAlt, FaMapMarkerAlt } from 'react-icons/fa';

// Replace with your backend API URL
const API_URL = '/api/stops';

const SearchBusStop = () => {
  const [query, setQuery] = useState('');
  const [busStopDetails, setBusStopDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setBusStopDetails([]); // Clear previous results
    try {
      const response = await fetch(`${API_URL}?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        const errorText = await response.text(); // Get the error text from the response
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }
  
      // Attempt to parse JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Failed to parse JSON response');
      }
      
      // Check if the data is in the expected format
      if (!Array.isArray(data)) {
        throw new Error('Unexpected data format');
      }
      
      setBusStopDetails(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(`An error occurred while fetching bus stop details. Error: ${error.message}`);
    }
    setLoading(false);
  };
  

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg text-white relative overflow-hidden">
      {/* Background Image */}
      <img
        src="https://via.placeholder.com/600x400" // Replace with your preferred image URL
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full opacity-30"
      />

      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-300">Search Bus Stop</h2>
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
            Find
          </button>
        </div>

        {loading && <p className="mt-4 text-gray-400 text-center">Searching...</p>}

        {busStopDetails.length > 0 && (
          <div className="mt-8">
            <table className="table-auto w-full text-center border-collapse bg-gray-800 rounded-lg">
              <thead>
                <tr className="bg-green-800">
                  <th className="border border-green-900 p-3">S. No.</th>
                  <th className="border border-green-900 p-3">Stop Code</th>
                  <th className="border border-green-900 p-3">Stop Name</th>
                  <th className="border border-green-900 p-3">Stop Latitude</th>
                  <th className="border border-green-900 p-3">Stop Longitude</th>
                </tr>
              </thead>
              <tbody>
                {busStopDetails.map((stop, index) => (
                  <tr key={stop.stop_code} className="bg-gray-700 hover:bg-gray-600">
                    <td className="border border-green-900 p-3">{index + 1}</td>
                    <td className="border border-green-900 p-3 text-blue-400">
                      {stop.stop_code}
                    </td>
                    <td className="border border-green-900 p-3 text-blue-400">
                      <FaMapMarkerAlt className="inline-block mr-2 text-green-500" />
                      {stop.stop_name}
                    </td>
                    <td className="border border-green-900 p-3">{stop.stop_lat}</td>
                    <td className="border border-green-900 p-3">{stop.stop_lon}</td>
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
