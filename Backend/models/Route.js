import mongoose from 'mongoose';

// Define the schema for the route details
const routeSchema = new mongoose.Schema({
    route_id: { type: String, required: true },
    route_name: { type: String, required: true },
    route_short_name: { type: String, required: false },
    route_type: { type: String, required: true },
    route_description: { type: String, required: false },
    busStops: [{ name: String, position: [Number] }], // Adjust according to your data format
     // Adjust according to your data format
});

// Create and export the model
const Route = mongoose.model('Route', routeSchema, 'routedetails'); // 'routedetails' is the collection name

export default Route;
