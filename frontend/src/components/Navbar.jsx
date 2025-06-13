import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/apiService';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // On mount, try to load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('user');
            }
        }
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem('user');
            setUser(null);
            alert('You have been logged out 👋');
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err.message);
        }
    };

    return (
        <header className="navbar">
            <h1 className="logo">RentMyRide</h1>
            <nav className="nav-links">
                <Link to="/cars">Cars</Link>
                <Link to="/about">About us</Link>

                {user ? (
                    <>
                        <Link to="/booking">Booking</Link>
                        <Link to="/profile">Profile</Link>
                        <button onClick={handleLogout} className="nav-button">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}
            </nav>
        </header>
    );
}