import React, { useState } from 'react';
import ShopHero from '../components/ShopHero';
import FeaturedCategories from '../components/FeaturedCategories';
import ShopSection from '../components/ShopSection';
import Subscribe from '../components/Subscribe';

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <div className="page-wrapper">
            <ShopHero />
            <div className="section">
                <div className="container shop-items-container">
                    <FeaturedCategories
                        selectedCategory={selectedCategory}
                        onCategorySelect={setSelectedCategory}
                    />
                    <ShopSection selectedCategory={selectedCategory} />
                </div>
            </div>
            <Subscribe />
        </div>
    );
}
