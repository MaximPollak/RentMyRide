import React from 'react';
import { Link } from 'react-router-dom';
import homepageCar from '../assets/bmw.png';
import Navbar from './Navbar'; // ✅ Import the new component

export default function Homepage() {
    return (
        <div className="homepage-container">
            <Navbar /> {/* ✅ No need to wrap it in <header> */}

            <main className="intro-section">
                <div className="intro-text">
                    <h2 className="subtitle">The Best</h2>
                    <h1 className="title">Car Rental</h1>
                    <p className="tagline">It’s easier on wheels!</p>

                    <Link to="/booking" className="book-button">
                        Book a car
                    </Link>

                    <div className="register-info">
                        You don’t have an account yet?{' '}
                        <Link to="/register" className="register-link">
                            Register yourself
                        </Link>
                    </div>
                </div>

                <div className="intro-image">
                    <img src={homepageCar} alt="Homepage car" />
                </div>
            </main>

            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </div>
    );
}