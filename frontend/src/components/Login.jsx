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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Navbar />
            <div className="auth-container">
                <h2 className="auth-title">Log in to your account</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
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
                </form>

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