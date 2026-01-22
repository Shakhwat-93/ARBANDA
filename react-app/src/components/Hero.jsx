import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <div className="hero-section">
            <div className="container hero-container">
                <div className="hero-content">
                    <div className="flex-center-text full-width">
                        <div className="home-hero-content">
                            <h1 className="hero-main-headline">ARBANDA - Shop Everything You Love Under One Roof</h1>
                            <div className="hero-text white">ARBANDA</div>

                            <div className="hero-3d-scene">
                                {/* Center Card (Glassmorphism) */}
                                <div className="hero-card-3d center-card">
                                    <img src="/images/64ca4dd15a0181f9bad85d7b_Shop%20Item%20Image%206.jpg" loading="lazy" alt="Featured Product" className="hero-card-image" />
                                    <div className="card-glass-overlay"></div>
                                </div>

                                {/* Surrounding Cards */}
                                <div className="hero-card-3d side-card pos-1">
                                    <img src="/images/64ca4d96eb1c7a5f1bd47ffb_Shop%20Item%20Image%203.jpg" loading="lazy" alt="Product" className="hero-card-image" />
                                </div>
                                <div className="hero-card-3d side-card pos-2">
                                    <img src="/images/64ca4d867c8482abb0961ebd_Shop%20Item%20Image%202.jpg" loading="lazy" alt="Product" className="hero-card-image" />
                                </div>
                                <div className="hero-card-3d side-card pos-3">
                                    <img src="/images/64ca4d7b61bf10fc72066c12_Shop%20Item%20Image1.jpg" loading="lazy" alt="Product" className="hero-card-image" />
                                </div>
                                <div className="hero-card-3d side-card pos-4">
                                    <img src="/images/64ca4db661bf10fc7206bccc_Shop%20Item%20Image%205.jpg" loading="lazy" alt="Product" className="hero-card-image" />
                                </div>
                                <div className="hero-card-3d side-card pos-5">
                                    <img src="/images/64ca4da34be2f713426fd6b3_Shop%20Item%20Image%204.jpg" loading="lazy" alt="Product" className="hero-card-image" />
                                </div>
                            </div>
                        </div>
                        <div className="hero-button-panel">
                            <Link to="/shop" className="button w-button">Shop Now</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
