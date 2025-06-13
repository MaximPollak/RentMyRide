import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import Navbar from "./Navbar.jsx";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await registerUser(form);
            toast.success('🎉 Registration successful!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        }
    };

    return (
        <motion.div
            className="homepage-container"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <Navbar />
            <div className="auth-container">
                <motion.h2
                    className="auth-title"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                >
                    Register yourself
                </motion.h2>
                <motion.form
                    className="auth-form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                >
                    <label>Username</label>
                    <input name="username" value={form.username} onChange={handleChange} placeholder="eg: User123" required />

                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="eg: user@example.com" required />

                    <label>Password</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="password" required />

                    <button type="submit" className="auth-button">Register</button>
                    {error && <p className="auth-error">{error}</p>}
                    {success && <p className="auth-success">Registration successful! Redirecting...</p>}
                </motion.form>

                <div className="auth-footer">
                    Already have an account?
                    <a href="/login">Log in</a>
                </div>
            </div>
            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </motion.div>
    );
}
