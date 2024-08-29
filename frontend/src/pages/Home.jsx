import React from 'react';
import { FaBus, FaCalendarAlt, FaCheckCircle, FaThumbsUp, FaMap, FaCalendarDay } from 'react-icons/fa';
import RouteDetails from '../components/RouteDetails'; // Ensure this import is correct
import TripPlanner from '../components/TripPlanner'; // Ensure this import is correct
import landingBus from '../assets/landingBus.png';

const HomePage = () => {
  return (
    <div className="h-auto bg-gray-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center gap-8 p-4 md:p-8 lg:p-24 bg-gray-800 rounded-lg shadow-lg m-4 lg:m-10 h-auto mt-24">
  <div className="w-full text-center lg:text-left md:max-w-2xl">
    <h1 className="font-bold text-2xl sm:text-3xl lg:text-5xl xl:text-6xl mb-4">
      Your Satisfaction is Our Commitment to Excellence in Bus Services
    </h1>
    <p className="text-base sm:text-lg lg:text-xl">
      Experience top-notch bus services designed for your convenience and reliability. Join us for a seamless travel experience with our advanced tools and support.
    </p>
  </div>
  <div className="w-full lg:w-auto mt-8 lg:mt-0">
    <img
      src={landingBus}
      alt="Bus"
      className="w-full max-w-xs sm:max-w-md h-auto rounded-lg shadow-md mx-auto"
    />
  </div>
</div>


      {/* Feature Highlights */}
      <div className="p-4 sm:p-6 lg:p-10 bg-gray-800 rounded-lg shadow-lg m-4 lg:m-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-start space-x-4">
            <FaBus className="text-green-500 text-3xl sm:text-4xl" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">Reliable Transport</h3>
              <p className="text-base sm:text-lg">Our buses are always on time, ensuring you reach your destination without delay.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <FaCalendarAlt className="text-blue-500 text-3xl sm:text-4xl" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">Flexible Scheduling</h3>
              <p className="text-base sm:text-lg">Choose from a variety of schedules that fit your needs, whether it's for daily commutes or special trips.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <FaCheckCircle className="text-yellow-500 text-3xl sm:text-4xl" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">Easy Booking</h3>
              <p className="text-base sm:text-lg">Book your rides quickly and easily through our user-friendly platform.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <FaThumbsUp className="text-red-500 text-3xl sm:text-4xl" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">Customer Satisfaction</h3>
              <p className="text-base sm:text-lg">We prioritize your satisfaction with excellent service and support.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-10 m-4 lg:m-10">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-center">Ready to Experience Top-Quality Bus Services?</h2>
        <p className="text-base sm:text-lg mb-4 text-center">
          Discover the convenience and reliability of our bus services today. Explore our routes, book your trip, and enjoy a smooth journey.
        </p>
        <div className="flex justify-center">
          <a href="/services" className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-md hover:bg-green-700 transition duration-150">
            Explore Our Services
          </a>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="p-4 sm:p-6 lg:p-10 space-y-8 sm:space-y-12">
        {/* RouteDetails Component */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 relative">
          <div className="absolute top-0 right-0 p-2 sm:p-4">
            <FaMap className="text-green-500 text-5xl sm:text-6xl" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Discover Our Bus Routes</h2>
          <p className="text-base sm:text-lg mb-2 sm:mb-4">
            Explore our extensive network of bus routes designed to make your travel easy and efficient. Our RouteDetails component provides comprehensive information on all available routes, helping you plan your journey with ease.
          </p>
          <RouteDetails />
        </div>

        {/* TripPlanner Component */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 relative">
          <div className="absolute top-0 right-0 p-2 sm:p-4">
            <FaCalendarDay className="text-blue-500 text-5xl sm:text-6xl" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Plan Your Trip with Ease</h2>
          <p className="text-base sm:text-lg mb-2 sm:mb-4">
            Use our TripPlanner component to customize your travel plans. Whether you're planning a daily commute or a special journey, our tool provides you with the best routes and schedules tailored to your needs.
          </p>
          <TripPlanner />
        </div>

        {/* Navigation Directions */}
        <div className="bg-gray-900 text-white rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 text-center">Navigate Our Website Easily</h2>
          <p className="text-base sm:text-lg mb-2 sm:mb-4 text-center">
            Ready to explore more? Use the following links to navigate our website and access the features that best suit your needs:
          </p>
          <ul className="list-disc list-inside space-y-1 sm:space-y-2">
            <li><a href="/services" className="text-green-500 hover:underline">Explore Our Services</a></li>
            <li><a href="/contact" className="text-blue-500 hover:underline">Contact Us</a></li>
            <li><a href="/about" className="text-yellow-500 hover:underline">Learn About Us</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
