import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { getAllCars, refreshCarAvailability } from '../services/apiService'; // API functions
import { motion as _motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Cars() {
    const [cars, setCars] = useState([]); // Store all cars fetched from backend

    useEffect(() => {
        // Load car data when component mounts
        async function loadCars() {
            try {
                // First, refresh availability in DB (e.g. expire outdated bookings)
                await refreshCarAvailability();
                console.log('Availability refreshed');

                // Then, fetch all cars including updated availability
                const allCars = await getAllCars();
                setCars(allCars);
            } catch (err) {
                console.error('Error fetching cars:', err);
            }
        }
        loadCars(); // Trigger fetch
    }, []); // Empty dependency array = only run once on mount

    return (
        <_motion.div
            className="homepage-container"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5 }}
        >
            <Navbar />

            <main className="cars-list">
                <h2 className="cars-title">Browse Our Cars</h2>

                <div className="car-grid">
                    {/* Loop through car list and display each car in a card */}
                    {cars.map(car => (
                        <Link to={`/cars/${car.car_id}`} className="car-card-link" key={car.car_id}>
                            <_motion.div
                                className="car-card"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                            >
                                <img
                                    src={`http://localhost:3000${car.image_url}`}
                                    alt={`${car.brand} ${car.model}`}
                                    className="car-image"
                                />
                                <h3>{car.brand} {car.model}</h3>
                                <p className="car-category">{car.category}</p>
                                <p className="car-price">€{car.price_per_day}/day</p>
                                <p
                                    className="car-status"
                                    style={{ color: car.available ? '#22c55e' : '#f87171' }}
                                >
                                    {car.available ? 'Available' : 'Booked'}
                                </p>
                            </_motion.div>
                        </Link>
                    ))}
                </div>
            </main>

            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </_motion.div>
    );
}