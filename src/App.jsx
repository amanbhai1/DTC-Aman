// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Blogs from './pages/Blogs';
import Services from './pages/Services';
import Booking from './pages/Booking';
import BlogDetails from './pages/BlogDetails';
import Login from './loginSystem/Login';
// import Signup from './loginSystem/Signup';
import AdminLogin from './loginSystem/AdminPanel';
import ForgotPassword from './loginSystem/ForgotPassword';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="./loginSystem/Login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Login and Signup without Navbar and Footer */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/forgot" element={<ForgotPassword />} />


        {/* Route for pages with Navbar and Footer */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/booking" element={<Booking />} />
        <Route path="/blog/:id" element={<BlogDetails />} />

        </Route>

        {/* Redirect to login initially */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
