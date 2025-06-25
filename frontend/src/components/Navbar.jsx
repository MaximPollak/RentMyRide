import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser, getCurrentUser } from '../services/apiService';
import { toast } from 'react-toastify';

export default function Navbar() {
    const [user, setUser] = useState(null); // Holds logged-in user info
    const [menuOpen, setMenuOpen] = useState(false); // Controls mobile menu toggle
    const location = useLocation(); // Tracks current route
    const navigate = useNavigate(); // Used for redirecting

    useEffect(() => {
        const storedUser = localStorage.getItem('user'); // Check if user info is in localStorage
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser); // Try parsing user data
                setUser(parsedUser); // Set user state
            } catch (err) {
                console.error('Failed to parse user from localStorage:', err);
                localStorage.removeItem('user'); // Remove corrupted data
            }
        } else {
            setUser(null); // No user found
        }
    }, []);

    // Handles user logout
    const handleLogout = async () => {
        try {
            await logoutUser(); // Call backend to clear cookie
            localStorage.removeItem('user'); // Remove user from localStorage
            setUser(null); // Reset user state
            toast.success('You have been logged out'); // Show confirmation
            navigate('/'); // Redirect to homepage
        } catch (err) {
            console.error('Logout failed:', err.message);
        }
    };

    // Check if a nav link is the current page
    const isActive = (path) => location.pathname === path;

    return (
        <header className="navbar">
            {/* Logo link to homepage */}
            <Link to="/" className={`logo ${isActive('/') ? 'active-glow' : ''}`}>RentMyRide</Link>

            {/* Mobile menu toggle button */}
            <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </button>

            {/* Navigation links container */}
            <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
                <Link to="/cars" className={isActive('/cars') ? 'nav-link active' : 'nav-link'}>Cars</Link>
                <Link to="/about" className={isActive('/about') ? 'nav-link active' : 'nav-link'}>About us</Link>

                {user ? (
                    // Links for authenticated users
                    <>
                        <Link to="/booking" className={isActive('/booking') ? 'nav-link active' : 'nav-link'}>Book a car</Link>
                        <Link to="/profile" className={isActive('/profile') ? 'nav-link active' : 'nav-link'}>Profile</Link>

                        {user.role === 'admin' && (
                            <Link to="/admin" className={isActive('/admin') ? 'nav-link active' : 'nav-link'}>
                                Admin
                            </Link>
                        )}

                        <button onClick={handleLogout} className="nav-button">Logout</button>
                    </>
                ) : (
                    // Links for guests
                    <>
                        <Link to="/register" className={isActive('/register') ? 'nav-link active' : 'nav-link'}>Register</Link>
                        <Link to="/login" className={isActive('/login') ? 'nav-link active' : 'nav-link'}>Login</Link>
                    </>
                )}
            </nav>
        </header>
    );
}