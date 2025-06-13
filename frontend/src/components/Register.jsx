import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import Navbar from "./Navbar.jsx";
import { toast } from 'react-toastify';

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
        <div className="homepage-container">
            <Navbar />
            <div className="auth-container">
                <h2 className="auth-title">Register yourself</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input name="username" value={form.username} onChange={handleChange} placeholder="eg: User123" required />

                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="eg: user@example.com" required />

                    <label>Password</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="password" required />

                    <button type="submit" className="auth-button">Register</button>
                    {error && <p className="auth-error">{error}</p>}
                    {success && <p className="auth-success">Registration successful! Redirecting...</p>}
                </form>

                <div className="auth-footer">
                    Already have an account?
                    <a href="/login">Log in</a>
                </div>
            </div>
        </div>
    );
}