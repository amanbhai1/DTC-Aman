import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Blogs from './pages/Blogs';
import Services from './pages/Services';
import Login from './loginSystem/Login';
import ForgotPassword from './loginSystem/ForgotPassword';
import AdminPanel from './loginSystem/AdminPanel';
import Booking from './pages/Booking';
import BlogDetails from './pages/BlogDetails';

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    return token ? element : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Route for Login, Signup, and Forgot Password without Navbar and Footer */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<AdminPanel />} />
                <Route path="/forgot" element={<ForgotPassword />} />

                {/* Routes for pages with Navbar and Footer */}
                <Route element={<Layout />}>
                <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/booking" element={<ProtectedRoute element={<Booking />} />} />
                    <Route path="/blog/:id" element={<BlogDetails />} />
                </Route>

                {/* Redirect to login initially */}
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
