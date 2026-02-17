import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { optimizeImage } from '../utils/imageOptimizer';

export default function ShopHero() {
    const [heroData, setHeroData] = useState({ slides: [], banners: [] });
    const [loading, setLoading] = useState(true);
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

    useEffect(() => {
        const fetchHeroData = async () => {
            // Mock data or fetch from Supabase
            try {
                const { data } = await supabase
                    .from('shop_hero_content')
                    .select('*')
                    .limit(1)
                    .single();

                if (data) {
                    setHeroData({
                        slides: data.slides || [],
                        banners: data.banners || []
                    });
                }
            } catch (err) {
                console.error("Error fetching shop hero:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroData();
    }, []);

    if (loading) return <div className="section"><div className="container" style={{ height: '400px', background: '#f5f5f5', borderRadius: '12px' }}></div></div>;

    // If no data, return nothing or default
    if (heroData.slides.length === 0 && heroData.banners.length === 0) return null;

    return (
        <div className="section" style={{ padding: '20px 0' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px', minHeight: '500px' }}>

                    {/* Main Slider - Spans 8 columns on desktop, 12 on mobile */}
                    <div style={{ gridColumn: 'span 8', position: 'relative', overflow: 'hidden', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} className="shop-hero-slider-col">
                        <div className="embla" ref={emblaRef} style={{ height: '100%', width: '100%' }}>
                            <div className="embla__container" style={{ display: 'flex', height: '100%' }}>
                                {heroData.slides.map((slide) => (
                                    <div className="embla__slide" key={slide.id} style={{ flex: '0 0 100%', position: 'relative', minWidth: 0 }}>
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <img
                                                src={optimizeImage(slide.image_url, { width: 1200 })}
                                                alt={slide.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px' }}>
                                                <h2 style={{ color: '#fff', fontSize: '3rem', fontWeight: '800', marginBottom: '10px', maxWidth: '600px', lineHeight: '1.2' }}>{slide.title}</h2>
                                                <p style={{ color: '#e4e4e7', fontSize: '1.2rem', marginBottom: '24px', maxWidth: '500px' }}>{slide.subtitle}</p>
                                                {slide.link && (
                                                    <Link to={slide.link} className="primary-button" style={{ width: 'fit-content', padding: '12px 30px', background: '#fff', color: '#000', fontWeight: '700', borderRadius: '30px', textDecoration: 'none' }}>
                                                        Shop Now
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Banner Grid - Spans 4 columns on desktop, 12 on mobile */}
                    <div style={{ gridColumn: 'span 4', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '20px' }} className="shop-hero-banner-col">
                        {heroData.banners.slice(0, 4).map((banner) => (
                            <Link to={banner.link || '#'} key={banner.id} style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'block', height: '100%' }}>
                                <img
                                    src={optimizeImage(banner.image_url, { width: 400 })}
                                    alt={banner.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', display: 'flex', alignItems: 'flex-end', padding: '16px' }}>
                                    <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: '600', margin: 0 }}>{banner.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>

            <style>{`
                @media (max-width: 991px) {
                    .shop-hero-slider-col, .shop-hero-banner-col {
                        grid-column: span 12 !important;
                    }
                    .shop-hero-banner-col {
                        height: 400px; /* Fixed height for mobile grid */
                    }
                }
            `}</style>
        </div>
    );
}
