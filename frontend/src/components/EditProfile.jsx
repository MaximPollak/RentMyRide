import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { getCurrentUser, updateUser } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function EditProfile() {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            try {
                const user = await getCurrentUser();
                setForm({ username: user.username, email: user.email, password: '' });
                setUserId(user.user_id);
            } catch (err) {
                toast.error('Failed to load user');
            }
        }
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = { ...form };
        if (!updatedData.password) {
            delete updatedData.password; // prevent sending empty password
        }

        try {
            await updateUser(userId, updatedData);
            toast.success('Profile updated successfully!');
            navigate('/profile');
        } catch (err) {
            toast.error(err.message || 'Failed to update profile');
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
                <h2 className="auth-title">Edit Your Profile</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input name="username" value={form.username} onChange={handleChange} required />

                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required />

                    <label>New Password</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Leave blank to keep current password" />

                    <button type="submit" className="auth-button">Save Changes</button>
                </form>
            </div>
            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </motion.div>
    );
}