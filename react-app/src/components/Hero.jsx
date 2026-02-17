import React, { useEffect, useState, useRef } from 'react';
import './Hero.css';
import { supabase } from '../supabaseClient';

const Hero = () => {
    // Start with empty values to avoid flash of hardcoded content
    const [heroImages, setHeroImages] = useState({
        col1_image: '',
        col2_top_image: '',
        col2_bottom_image: '',
        center_image: '',
        col4_top_image: '',
        col4_bottom_image: '',
        col5_image: ''
    });

    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchHeroContent = async () => {
            try {
                const { data, error } = await supabase
                    .from('hero_section_content')
                    .select('*')
                    .limit(1)
                    .single();

                if (data) {
                    setHeroImages({
                        col1_image: data.col1_image,
                        col2_top_image: data.col2_top_image,
                        col2_bottom_image: data.col2_bottom_image,
                        center_image: data.center_image,
                        col4_top_image: data.col4_top_image,
                        col4_bottom_image: data.col4_bottom_image,
                        col5_image: data.col5_image
                    });
                }
            } catch (err) {
                console.log('Error fetching hero images', err);
                // Only on error might we want fallbacks, but for now keep empty to avoid flash
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchHeroContent();

        // Realtime Subscription
        const channel = supabase
            .channel('hero-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'hero_section_content' },
                (payload) => {
                    console.log('Realtime update received!', payload);
                    fetchHeroContent();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Auto-scroll for mobile view
    useEffect(() => {
        const handleAutoScroll = () => {
            if (window.innerWidth <= 768 && scrollRef.current) {
                const container = scrollRef.current;
                const maxScroll = container.scrollWidth - container.clientWidth;
                // If nearly at the end, scroll back to start
                if (container.scrollLeft >= maxScroll - 10) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Scroll to next snap point (approx 85vw + gap)
                    container.scrollBy({ left: window.innerWidth * 0.85, behavior: 'smooth' });
                }
            }
        };

        const intervalId = setInterval(handleAutoScroll, 3500); // Scroll every 3.5s

        return () => clearInterval(intervalId);
    }, []);

    return (
        <section className="hero-section-magazine">
            <div className="hero-container-magazine">

                {/* --- Top Section: 5-Column Grid --- */}
                <div className={`hero-media-grid ${loading ? 'loading-skeleton' : ''}`} ref={scrollRef}>

                    {/* Col 1: Far Left - Skincare Product */}
                    <div className="col-1">
                        <div className="magazine-card floating-item-card">
                            {!loading && heroImages.col1_image && <img src={heroImages.col1_image} alt="Premium Skincare" loading="eager" />}
                        </div>
                    </div>

                    {/* Col 2: Inner Left - Fashion Stack */}
                    <div className="vertical-stack col-2">
                        <div className="magazine-card stack-card top">
                            {!loading && heroImages.col2_top_image && <img src={heroImages.col2_top_image} alt="Vibrant Summer Fashion Collection" loading="eager" />}
                        </div>
                        <div className="magazine-card stack-card bottom">
                            {!loading && heroImages.col2_bottom_image && <img src={heroImages.col2_bottom_image} alt="Stylish Men's Apparel Collection" />}
                        </div>
                    </div>

                    {/* Col 3: Center Hero Image (Lifestyle) */}
                    <div className="col-3">
                        <div className="magazine-card hero-center-card">
                            {!loading && heroImages.center_image && <img src={heroImages.center_image} alt="High Quality Fashion Model" fetchpriority="high" loading="eager" />}
                        </div>
                    </div>

                    {/* Col 4: Inner Right - Accessories Stack */}
                    <div className="vertical-stack col-4">
                        <div className="magazine-card stack-card top">
                            {!loading && heroImages.col4_top_image && <img src={heroImages.col4_top_image} alt="Urban Sneakers" />}
                        </div>
                        <div className="magazine-card stack-card bottom">
                            {!loading && heroImages.col4_bottom_image && <img src={heroImages.col4_bottom_image} alt="Street Style" />}
                        </div>
                    </div>

                    {/* Col 5: Far Right - Watch/Gadget */}
                    <div className="col-5">
                        <div className="magazine-card floating-item-card">
                            {!loading && heroImages.col5_image && <img src={heroImages.col5_image} alt="Luxury Watch and Accessories" />}
                        </div>
                    </div>

                </div>

                {/* --- Bottom Section: Info Bar --- */}
                <div className="hero-info-bar">
                    <div className="info-left"></div>
                    <div className="info-center"></div>
                    <div className="info-right"></div>
                </div>

            </div>
        </section>
    );
}

export default Hero;
