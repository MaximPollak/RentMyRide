import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { getCurrentUser, getUserBookings } from '../services/apiService';
import { motion as _motion } from 'framer-motion';
import { Link } from 'react-router-dom';
export const API_BASE = import.meta.env.VITE_API_BASE;

export default function Profile() {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getCurrentUser();
                const userBookings = await getUserBookings();
                setUser(userData);
                setBookings(userBookings);
            } catch (err) {
                setError(err.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p className="auth-error">{error}</p>;

    return (
        <_motion.div
            className="homepage-container"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <Navbar />
            <div className="profile-page">
                <div className="profile-info">
                    <h2>Welcome, {user.username}!</h2>
                    <p>Email: {user.email}</p>
                    <p>
                        <strong>Account created:</strong>{' '}
                        {new Date(user.created_at).toLocaleDateString('de-DE')}
                    </p>
                    <Link to="/edit-profile" className="edit-profile-link">
                        Edit your profile
                    </Link>
                </div>

                <div className="bookings-section">
                    <h3 style={{ marginBottom: '1rem', color: '#facc15' }}>Your Bookings</h3>
                    {bookings.length === 0 ? (
                        <p>You have no bookings yet.</p>
                    ) : (
                        <div className="booking-list">
                            {bookings.map((booking) => (
                                <div key={booking.booking_id} className="booking-card">
                                    <img
                                        src={`${API_BASE}${booking.image_url}`}
                                        alt={`${booking.brand} ${booking.model}`}
                                        className="booking-car-image"
                                    />
                                    <div className="booking-details">
                                        <h4>{booking.brand} {booking.model}</h4>
                                        <p><strong>Category:</strong> {booking.category}</p>
                                        <p>
                                            <strong>Rental:</strong>{' '}
                                            {new Date(booking.start_date).toLocaleDateString('de-DE')} →{' '}
                                            {new Date(booking.end_date).toLocaleDateString('de-DE')}
                                        </p>
                                        <p><strong>Price per day:</strong> €{booking.price_per_day}</p>
                                        <p><strong>Total:</strong> €{booking.total_price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </_motion.div>
    );
}