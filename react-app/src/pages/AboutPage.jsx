import React from 'react';
import OurStory from '../components/OurStory';

const AboutPage = () => {
    return (
        <div className="page-wrapper" style={{ background: '#fdf0e1' }}>
            {/* Hero Section */}
            <div className="section" style={{ padding: '80px 0 60px', background: 'transparent', textAlign: 'center' }}>
                <div className="container">
                    <div style={{ display: 'inline-block', padding: '8px 20px', background: '#fff0e5', border: '1px solid #ebcfb9', borderRadius: '40px', color: '#b08d74', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', marginBottom: '25px', textTransform: 'uppercase' }}>Established 2024</div>
                    <h1 style={{ color: '#261a13', fontSize: '4.5rem', marginBottom: '20px', lineHeight: '1.1', fontFamily: 'DM Serif Display, serif' }}>Redefining Shopping <br /> in Bangladesh</h1>
                    <p style={{ color: '#8d7a6e', maxWidth: '800px', margin: '0 auto', fontSize: '18px', lineHeight: '1.6' }}>
                        ARBANDA BD is more than just an e-commerce platform. We are a multi-product marketplace dedicated to bringing premium quality, authenticity, and convenience to your doorstep.
                    </p>
                </div>
            </div>

            {/* Mission & Vision Section */}
            <div className="section" style={{ padding: '60px 0', background: '#fff0e5', borderTop: '1px solid #ebcfb9', borderBottom: '1px solid #ebcfb9' }}>
                <div className="container">
                    <div className="about-split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            @media (max-width: 991px) {
                                .about-split-grid {
                                    grid-template-columns: 1fr !important;
                                    gap: 40px !important;
                                }
                                h1 { font-size: 3rem !important; }
                            }
                        `}} />
                        <div>
                            <div style={{ fontSize: '12px', color: '#b08d74', fontWeight: '800', marginBottom: '15px', letterSpacing: '2px', textTransform: 'uppercase' }}>Our Mission</div>
                            <h2 style={{ color: '#261a13', fontSize: '32px', marginBottom: '20px' }}>Empowering Consumers with Quality</h2>
                            <p style={{ color: '#8d7a6e', fontSize: '16px', lineHeight: '1.7', margin: 0 }}>
                                Our mission is to curate a diverse selection of premium products—from advanced skincare to the latest lifestyle essentials—ensuring that every customer in Bangladesh has access to the best the world has to offer, backed by reliable service and trust.
                            </p>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#b08d74', fontWeight: '800', marginBottom: '15px', letterSpacing: '2px', textTransform: 'uppercase' }}>Our Vision</div>
                            <h2 style={{ color: '#261a13', fontSize: '32px', marginBottom: '20px' }}>The Premier Digital Marketplace</h2>
                            <p style={{ color: '#8d7a6e', fontSize: '16px', lineHeight: '1.7', margin: 0 }}>
                                We envision a future where ARBANDA becomes synonymous with premium digital commerce in Bangladesh, recognized for our commitment to authenticity, community empowerment, and an effortless shopping experience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories & Reach Section */}
            <div className="section" style={{ padding: '80px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div style={{ fontSize: '12px', color: '#b08d74', fontWeight: '800', marginBottom: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>What We Offer</div>
                        <h2 style={{ color: '#261a13', fontSize: '40px' }}>A Universe of Products</h2>
                    </div>
                    <div className="about-benefits-grid">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .about-benefits-grid {
                                display: grid;
                                grid-template-columns: repeat(4, 1fr);
                                gap: 30px;
                                text-align: center;
                            }
                            @media (max-width: 767px) {
                                .about-benefits-grid {
                                    grid-template-columns: 1fr 1fr;
                                }
                            }
                        `}} />
                        <div className="about-card" style={{ background: '#fff', padding: '40px 20px', borderRadius: '30px', border: '1px solid #ebcfb9', boxShadow: '0 15px 35px rgba(38,26,19,0.03)' }}>
                            <div style={{ fontSize: '40px', marginBottom: '20px' }}>🧴</div>
                            <h3 style={{ color: '#261a13', fontSize: '18px', marginBottom: '10px' }}>Premium Skincare</h3>
                            <p style={{ color: '#8d7a6e', fontSize: '14px', margin: 0 }}>High-end organic & clinical solutions.</p>
                        </div>
                        <div className="about-card" style={{ background: '#fff', padding: '40px 20px', borderRadius: '30px', border: '1px solid #ebcfb9', boxShadow: '0 15px 35px rgba(38,26,19,0.03)' }}>
                            <div style={{ fontSize: '40px', marginBottom: '20px' }}>⌚</div>
                            <h3 style={{ color: '#261a13', fontSize: '18px', marginBottom: '10px' }}>Luxury Lifestyle</h3>
                            <p style={{ color: '#8d7a6e', fontSize: '14px', margin: 0 }}>Curated essentials for modern living.</p>
                        </div>
                        <div className="about-card" style={{ background: '#fff', padding: '40px 20px', borderRadius: '30px', border: '1px solid #ebcfb9', boxShadow: '0 15px 35px rgba(38,26,19,0.03)' }}>
                            <div style={{ fontSize: '40px', marginBottom: '20px' }}>🔌</div>
                            <h3 style={{ color: '#261a13', fontSize: '18px', marginBottom: '10px' }}>Smart Tech</h3>
                            <p style={{ color: '#8d7a6e', fontSize: '14px', margin: 0 }}>Innovative gadgets for your daily needs.</p>
                        </div>
                        <div className="about-card" style={{ background: '#fff', padding: '40px 20px', borderRadius: '30px', border: '1px solid #ebcfb9', boxShadow: '0 15px 35px rgba(38,26,19,0.03)' }}>
                            <div style={{ fontSize: '40px', marginBottom: '20px' }}>🛍️</div>
                            <h3 style={{ color: '#261a13', fontSize: '18px', marginBottom: '10px' }}>Fashion & Beyond</h3>
                            <p style={{ color: '#8d7a6e', fontSize: '14px', margin: 0 }}>Trending apparel and unique accessories.</p>
                        </div>
                    </div>
                </div>
            </div>

            <OurStory />

            {/* Commitment Section */}
            <div className="section" style={{ background: '#261a13', padding: '100px 0', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ color: '#fdf0e1', fontSize: '40px', marginBottom: '30px' }}>Our Commitment to Bangladesh</h2>
                    <p style={{ color: '#ebcfb9', maxWidth: '800px', margin: '0 auto 40px', fontSize: '18px', lineHeight: '1.8' }}>
                        We are proud to be a Bangladeshi brand serving our fellow citizens. With local warehouses and a dedicated delivery network, we ensure that your orders reach you wherever you are, from Dhaka to the remotest parts of the country.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#fff', fontSize: '32px', fontWeight: '800' }}>100%</div>
                            <div style={{ color: '#b08d74', fontSize: '12px', textTransform: 'uppercase', fontWeight: '700' }}>Authentic Products</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#fff', fontSize: '32px', fontWeight: '800' }}>64</div>
                            <div style={{ color: '#b08d74', fontSize: '12px', textTransform: 'uppercase', fontWeight: '700' }}>Districts Covered</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#fff', fontSize: '32px', fontWeight: '800' }}>24/7</div>
                            <div style={{ color: '#b08d74', fontSize: '12px', textTransform: 'uppercase', fontWeight: '700' }}>Support Ready</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
