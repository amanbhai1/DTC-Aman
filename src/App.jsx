import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Blogs from './pages/Blogs';
import Services from './pages/Services';

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    return token ? element : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Route for Login and Signup without Navbar and Footer */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Route for pages with Navbar and Footer */}
                <Route element={<Layout />}>
                    <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
                    <Route path="/services" element={<ProtectedRoute element={<Services />} />} />
                    <Route path="/about" element={<ProtectedRoute element={<About />} />} />
                    <Route path="/contact" element={<ProtectedRoute element={<Contact />} />} />
                    <Route path="/blogs" element={<ProtectedRoute element={<Blogs />} />} />
                </Route>

                {/* Redirect to login initially */}
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
