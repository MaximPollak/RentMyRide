import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { getCurrentUser, updateUser } from '../services/apiService'; // API functions for fetching/updating user
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion as _motion } from 'framer-motion';

export default function EditProfile() {
    const [form, setForm] = useState({ username: '', email: '', password: '' }); // Holds form input values
    const [userId, setUserId] = useState(null); // Stores current user's ID
    const navigate = useNavigate(); // Used to redirect user after saving

    // Load user details when component mounts
    useEffect(() => {
        async function fetchUser() {
            try {
                const user = await getCurrentUser(); // Get user data from backend
                setForm({ username: user.username, email: user.email, password: '' }); // Prefill form
                setUserId(user.user_id); // Save user ID for update call
            } catch (err) {
                toast.error('Failed to load user', err); // Show error if fetch fails
            }
        }
        fetchUser();
    }, []);

    // Update form state on input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = { ...form };

        // If password field is empty, don't send it
        if (!updatedData.password) {
            delete updatedData.password;
        }

        try {
            await updateUser(userId, updatedData); // Call backend to save changes
            toast.success('Profile updated successfully!');
            navigate('/profile'); // Redirect to profile page after success
        } catch (err) {
            toast.error(err.message || 'Failed to update profile');
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
            <div className="auth-container">
                <h2 className="auth-title">Edit Your Profile</h2>

                {/* Profile edit form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label>New Password</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Write your old/new password"
                        required
                    />

                    <button type="submit" className="auth-button">Save Changes</button>
                </form>
            </div>

            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </_motion.div>
    );
}