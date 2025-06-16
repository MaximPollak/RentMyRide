import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/apiService';
import { toast } from 'react-toastify';
import Navbar from "./Navbar.jsx";
import { motion } from 'framer-motion';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await loginUser(form);
            toast.success('Logged in successfully!');
            navigate('/profile');
        } catch (err) {
            toast.error(err.message || 'Login failed');
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
            <div className="login-container">
                <motion.h2
                    className="auth-title"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                >
                    Log in to your account
                </motion.h2>
                <motion.form
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
                </motion.form>

                <div className="auth-footer">
                    Don’t have an account?
                    <a href="/register">Register here</a>
                </div>
            </div>
            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </motion.div>
    );
}