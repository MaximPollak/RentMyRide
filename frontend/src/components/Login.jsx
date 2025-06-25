import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/apiService'; // API call to log in user
import { toast } from 'react-toastify'; // For showing success/error messages
import Navbar from "./Navbar.jsx";
import { motion as _motion } from 'framer-motion'; // Animation wrapper

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' }); // State for login form
    const navigate = useNavigate(); // Used to navigate after login

    // Handles input change for email and password
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handles form submission for login
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form behavior

        try {
            await loginUser(form); // Call login API
            toast.success('Logged in successfully!'); // Show success toast
            navigate('/profile'); // Navigate to profile page after login
        } catch (err) {
            toast.error(err.message || 'Login failed'); // Show error if login fails
        }
    };

    return (
        <_motion.div
            className="homepage-container"
            initial={{ opacity: 0, scale: 0.96 }} // Entrance animation
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <Navbar />

            {/* Login form UI */}
            <div className="login-container">
                {/* Animated heading */}
                <_motion.h2
                    className="auth-title"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                >
                    Log in to your account
                </_motion.h2>

                {/* Login form */}
                <_motion.form
                    className="auth-form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                >
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="user@example.com"
                        required
                    />

                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />

                    <button type="submit" className="auth-button">Login</button>
                </_motion.form>

                {/* Navigation to register page */}
                <div className="auth-footer">
                    Don’t have an account?
                    <a href="/register">Register here</a>
                </div>
            </div>

            {/* Footer with credit */}
            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </_motion.div>
    );
}