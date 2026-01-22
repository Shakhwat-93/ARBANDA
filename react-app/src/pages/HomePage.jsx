import React from 'react';
import Hero from '../components/Hero';
import WhySection from '../components/WhySection';
import ShopSection from '../components/ShopSection';
import AboutArbanda from '../components/AboutArbanda';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Subscribe from '../components/Subscribe';

export default function HomePage() {
    return (
        <>
            <Hero />
            <WhySection />
            <ShopSection />
            <AboutArbanda />
            <Features />
            <Testimonials />
            <Subscribe />
        </>
    );
}
