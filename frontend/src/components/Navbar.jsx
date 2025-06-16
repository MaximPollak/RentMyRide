import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/apiService';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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
            <NavLink to="/" className={({ isActive }) => isActive ? "logo active-glow" : "logo"}>RentMyRide</NavLink>
            <nav className="nav-links">
                <NavLink to="/cars" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Cars</NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About us</NavLink>

                {user ? (
                    <>
                        <NavLink to="/booking" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Booking</NavLink>
                        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Profile</NavLink>
                        <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Register</NavLink>
                        <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Login</NavLink>
                    </>
                )}
            </nav>
        </header>
    );
}