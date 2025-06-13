import React from 'react';
import Navbar from './Navbar';

export default function AboutUs() {
    return (
        <div className="about-container">
            <Navbar />
            <main className="about-content">
                <div className="about-card">
                    <h3>Why Choose Us?</h3>
                    <p>
                        We believe car rental should be smooth, flexible, and completely transparent. That’s why we offer competitive pricing,
                        clear terms, and a simple booking process — no confusing fine print, no last-minute surprises. Just quality service from start to finish.
                    </p>
                </div>
                <div className="about-card">
                    <h3>A Fleet You Can Trust</h3>
                    <p>
                        Whether you’re heading out on a weekend trip or need a reliable ride for the week, our cars are regularly maintained,
                        fully insured, and kept in top condition. From everyday models to stylish upgrades, RentMyRide gives you the keys to quality and comfort.
                    </p>
                </div>
                <div className="about-card">
                    <h3>Fast & Flexible Booking</h3>
                    <p>
                        Life moves fast — and so do we. With RentMyRide, you can book a car in just a few clicks, choose pickup and return times that
                        suit your schedule, and cancel or adjust your booking easily if plans change. Renting a car has never been this convenient.
                    </p>
                </div>
            </main>
            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </div>
    );
}