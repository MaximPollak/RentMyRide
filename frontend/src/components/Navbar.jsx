import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser, getCurrentUser } from '../services/apiService';
import { toast } from 'react-toastify';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser); // set user state immediately
            } catch (err) {
                console.error('Failed to parse user from localStorage:', err);
                localStorage.removeItem('user');
            }
        } else {
            setUser(null);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem('user');
            setUser(null);
            toast.success('You have been logged out');
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err.message);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="navbar">
            <Link to="/" className={`logo ${isActive('/') ? 'active-glow' : ''}`}>RentMyRide</Link>

            <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </button>

            <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
                <Link to="/cars" className={isActive('/cars') ? 'nav-link active' : 'nav-link'}>Cars</Link>
                <Link to="/about" className={isActive('/about') ? 'nav-link active' : 'nav-link'}>About us</Link>

                {user ? (
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
                    <>
                        <Link to="/register" className={isActive('/register') ? 'nav-link active' : 'nav-link'}>Register</Link>
                        <Link to="/login" className={isActive('/login') ? 'nav-link active' : 'nav-link'}>Login</Link>
                    </>
                )}
            </nav>
        </header>
    );
}