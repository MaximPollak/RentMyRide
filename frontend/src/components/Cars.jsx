import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { getAllCars } from '../services/apiService';
import { motion } from 'framer-motion';

export default function Cars() {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        getAllCars()
            .then(setCars)
            .catch(err => console.error('Error fetching cars:', err));
    }, []);

    return (
        <motion.div
            className="homepage-container"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5 }}
        >
            <Navbar />
            <main className="cars-list">
                <h2 className="cars-title">Browse Available Cars</h2>
                <div className="car-grid">
                    {cars.map(car => (
                        <motion.div
                            className="car-card"
                            key={car.car_id}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <img src={`http://localhost:3000${car.image_url}`} alt={`${car.brand} ${car.model}`} className="car-image" />
                            <h3>{car.brand} {car.model}</h3>
                            <p className="car-category">{car.category}</p>
                            <p className="car-price">€{car.price_per_day}/day</p>
                            <p className="car-status" style={{ color: car.available ? '#22c55e' : '#f87171' }}>
                                {car.available ? 'Available' : 'Booked'}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </main>
            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </motion.div>
    );
}