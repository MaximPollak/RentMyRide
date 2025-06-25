import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService'; // API function to handle user registration
import Navbar from "./Navbar.jsx";
import { toast } from 'react-toastify';
import { motion as _motion } from 'framer-motion';

export default function Register() {
    // Form state: holds username, email, and password
    const [form, setForm] = useState({ username: '', email: '', password: '' });

    // Error message state (used if registration fails)
    const [error, setError] = useState('');

    // Placeholder success state (optional)
    const [success] = useState(false);

    const navigate = useNavigate(); // For redirecting after successful registration

    // Handles input change and updates form state
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default browser reload
        setError(''); // Clear existing error messages

        try {
            await registerUser(form); // Send form data to backend API
            toast.success('Registration successful! Redirecting...'); // Show toast
            setTimeout(() => navigate('/login'), 2000); // Redirect to login after short delay
        } catch (err) {
            toast.error(err.message || 'Registration failed'); // Handle error
        }
    };

    return (
        <_motion.div
            className="homepage-container"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <Navbar />

            <div className="register-container">
                {/* Form Title */}
                <_motion.h2
                    className="auth-title"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                >
                    Register yourself
                </_motion.h2>

                {/* Registration Form */}
                <_motion.form
                    className="auth-form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                >
                    <label>Username</label>
                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="eg: User123"
                        required
                    />

                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="eg: user@example.com"
                        required
                    />

                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="password"
                        required
                    />

                    <button type="submit" className="auth-button">Register</button>

                    {/* Show error message if registration fails */}
                    {error && <p className="auth-error">{error}</p>}

                    {/* Optional: show success (unused here) */}
                    {success && <p className="auth-success">Registration successful! Redirecting...</p>}
                </_motion.form>

                {/* Link to login page */}
                <div className="auth-footer">
                    Already have an account? <a href="/login">Log in</a>
                </div>
            </div>

            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </_motion.div>
    );
}