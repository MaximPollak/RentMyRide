import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarById } from '../services/apiService';
import Navbar from './Navbar';
import { motion as _motion } from 'framer-motion';

export default function CarDetail() {
    const { id } = useParams(); // Get car ID from route parameters
    const navigate = useNavigate(); // For navigating back or to booking page

    const [car, setCar] = useState(null); // Holds the fetched car object
    const [error, setError] = useState(null); // Error message if fetch fails

    useEffect(() => {
        // Fetch car details by ID on component mount
        getCarById(id)
            .then(setCar)
            .catch(err => setError(err.message));
    }, [id]);

    // Show error message if request failed
    if (error) return <p className="auth-error">Error: {error}</p>;

    // Show loading message while data is being fetched
    if (!car) return <p>Loading car details...</p>;

    return (
        <_motion.div
            className="homepage-container"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <Navbar />

            <div className="car-detail-container">
                {/* Back button navigates one step back in browser history */}
                <button onClick={() => navigate(-1)} className="car-detail-back-button">← Back</button>

                <div className="car-detail-card">
                    {/* Display car image */}
                    <img
                        src={`http://localhost:3000${car.image_url}`}
                        alt={`${car.brand} ${car.model}`}
                        className="car-detail-image"
                    />

                    {/* Car details */}
                    <div className="car-detail-info">
                        <h4>{car.brand} {car.model}</h4>
                        <p><strong>Category:</strong> {car.category}</p>
                        <p><strong>Info:</strong> {car.info}</p>
                        <p><strong>Price per day:</strong> €{car.price_per_day}</p>
                        <p><strong>Status:</strong> {
                            car.available ? (
                                <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Available</span>
                            ) : (
                                <span style={{ color: '#f87171', fontWeight: 'bold' }}>Currently Booked</span>
                            )
                        }</p>

                        {/* Show booking button if car is available */}
                        {car.available && (
                            <button
                                onClick={() => navigate(`/booking?car_id=${car.car_id}`)}
                                className="auth-button"
                                style={{ marginTop: '1rem' }}
                            >
                                Book this car
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </_motion.div>
    );
}