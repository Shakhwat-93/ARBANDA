import React from 'react';

export default function WhySection() {
    return (
        <div className="section value-prop-section">
            <div className="container">
                <h2 className="section-title text-center">Why ARBANDA?</h2>
                <div className="value-prop-grid">
                    <div className="value-prop-card">
                        <div className="value-prop-icon">🏷️</div>
                        <h3 className="value-prop-title">Competitive Pricing</h3>
                        <p className="value-prop-desc">Great deals every day on all your favorite items.</p>
                    </div>
                    <div className="value-prop-card">
                        <div className="value-prop-icon">📦</div>
                        <h3 className="value-prop-title">Wide Selection</h3>
                        <p className="value-prop-desc">Shop across multiple categories in one place.</p>
                    </div>
                    <div className="value-prop-card">
                        <div className="value-prop-icon">🚚</div>
                        <h3 className="value-prop-title">Fast Shipping</h3>
                        <p className="value-prop-desc">Reliable and quick delivery to your doorstep.</p>
                    </div>
                    <div className="value-prop-card">
                        <div className="value-prop-icon">💳</div>
                        <h3 className="value-prop-title">Secure Checkout</h3>
                        <p className="value-prop-desc">Safe payments and easy returns for peace of mind.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
