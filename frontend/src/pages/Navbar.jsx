import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // For hamburger and close icons

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session or authentication tokens here if necessary
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src="https://img.freepik.com/premium-vector/vector-illustration-yellow-bus-transparent-background_181203-31343.jpg?semt=ais_hybrid"
            alt="Bus Logo"
            className="w-10 h-10 sm:w-12 sm:h-12"
          />
          <span className="text-white font-bold ml-4 hidden sm:block md:hidden lg:block xl:hidden 2xl:block">
            Bus Route Manager
          </span>
        </div>

        {/* Hamburger Menu for Small Screens */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Menu Links */}
        <div
          className={`fixed left-0 top-0 h-full w-3/5 sm:w-2/5 md:w-auto bg-gray-800 transition-transform transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:static md:flex md:ml-auto md:space-x-4 md:transform-none`}
        >
          <div className="flex flex-col items-center justify-center h-full w-full space-y-6 mt-16 md:mt-0 md:flex-row md:space-y-0 md:space-x-2 md:ml-auto md:w-auto bg-gray-800">
            {[
              { to: '/home', label: 'Home' },
              { to: '/services', label: 'Services' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
              { to: '/blogs', label: 'Blogs' },
              { to: '/booking', label: 'Booking' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `w-4/6 sm:w-3/6 text-center text-white px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-blue-700' : 'hover:bg-gray-700'
                  }`
                }
                onClick={toggleMenu}
              >
                {label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="w-4/6 sm:w-3/6 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}


export default Navbar;
