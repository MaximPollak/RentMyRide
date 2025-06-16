import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarById } from '../services/apiService';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

export default function CarDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCarById(id)
            .then(setCar)
            .catch(err => setError(err.message));
    }, [id]);

    if (error) return <p className="auth-error">Error: {error}</p>;
    if (!car) return <p>Loading car details...</p>;

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
                <button onClick={() => navigate(-1)} className="back-button">← Back</button>

                <div className="booking-card">
                    <img
                        src={`http://localhost:3000${car.image_url}`}
                        alt={`${car.brand} ${car.model}`}
                        className="booking-car-image"
                    />
                    <div className="booking-details">
                        <h4>{car.brand} {car.model}</h4>
                        <p><strong>Category:</strong> {car.category}</p>
                        <p><strong>Info:</strong> {car.info}</p>
                        <p><strong>Price per day:</strong> €{car.price_per_day}</p>
                        <p><strong>Status:</strong> {car.available ? 'Available' : 'Booked'}</p>
                    </div>
                </div>
            </div>
            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </motion.div>
    );
}