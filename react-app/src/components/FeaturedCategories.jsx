import React from 'react';

export default function FeaturedCategories({ selectedCategory, onCategorySelect }) {
    const categories = [
        { icon: '✨', name: 'All' },
        { icon: '🧖‍♀️', name: 'Skincare' },
        { icon: '👜', name: 'Accessories' },
        { icon: '📱', name: 'Electronics' },
    ];

    return (
        <div className="featured-categories-section">
            <h2 className="featured-categories-title">Shop by Category</h2>
            <div className="featured-categories-grid">
                {categories.map((cat, idx) => {
                    const isAll = cat.name === 'All';
                    const isActive = isAll ? selectedCategory === null : selectedCategory === cat.name;

                    return (
                        <div
                            key={idx}
                            className={`category-card ${isActive ? 'active' : ''}`}
                            onClick={() => onCategorySelect(isAll ? null : cat.name)}
                            style={{
                                cursor: 'pointer',
                                border: isActive ? '1px solid #ebcfb9' : '1px solid #ebcfb9',
                                background: isActive ? '#261a13' : 'transparent',
                                padding: '20px',
                                borderRadius: '12px',
                                transition: 'all 0.3s'
                            }}
                        >
                            <div className="category-icon" style={{ fontSize: '24px', marginBottom: '10px' }}>{cat.icon}</div>
                            <div className="category-name" style={{ color: isActive ? '#fdf0e1' : '#261a13', fontWeight: isActive ? '700' : 'normal', fontSize: '14px', letterSpacing: '1px' }}>{cat.name.toUpperCase()}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
