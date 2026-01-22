import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import { toast } from 'react-hot-toast';

const STATIC_PRODUCTS = [
    {
        id: '1',
        name: 'Moisture Surge Night Cream',
        price: 98.09,
        summary: 'Lorem ipsum dolor sit amet consectetur. Molestie lorem arcu egestas varius donec.',
        image_url: '/images/64ca4dd15a0181f9bad85d7b_Shop%20Item%20Image%206.jpg',
        category: 'Skincare'
    },
    {
        id: '2',
        name: 'Brightening Eye Cream',
        price: 22.82,
        summary: 'Lorem ipsum dolor sit amet consectetur. Molestie lorem arcu egestas varius donec.',
        image_url: '/images/64ca4d96eb1c7a5f1bd47ffb_Shop%20Item%20Image%203.jpg',
        category: 'Skincare'
    },
    {
        id: '3',
        name: 'Lash Lift Mascara',
        price: 18.86,
        summary: 'Lorem ipsum dolor sit amet consectetur. Molestie lorem arcu egestas varius donec.',
        image_url: '/images/64ca4d867c8482abb0961ebd_Shop%20Item%20Image%202.jpg',
        category: 'Accessories'
    },
    {
        id: '4',
        name: 'Radiant Glow Face Oil',
        price: 33.70,
        summary: 'Enhances skin\'s radiance. Moisturizes and nourishes the skin.',
        image_url: '/images/64ca47b61bf10fc72066c12_Shop%20Item%20Image1.jpg',
        category: 'Skincare'
    }
];

export default function ShopSection({ selectedCategory }) {
    const [products, setProducts] = useState(STATIC_PRODUCTS);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let query = supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (selectedCategory) {
                    query = query.eq('category', selectedCategory);
                }

                const { data, error } = await query;

                if (!error && data && data.length > 0) {
                    setProducts(data);
                } else {
                    // Filter static products if DB is empty/fails
                    const filteredStatic = selectedCategory
                        ? STATIC_PRODUCTS.filter(p => p.category === selectedCategory)
                        : STATIC_PRODUCTS;
                    setProducts(filteredStatic);
                }
            } catch (err) {
                console.log('Using static products fallback');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        // Realtime subscription
        const channel = supabase
            .channel('realtime-products')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'products'
                },
                () => {
                    fetchProducts();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedCategory]);

    return (
        <div className="section">
            <div className="container">
                <div className="flex-center-text">
                    <div className="horizontal-tag-holder">
                        <div className="tag"> {selectedCategory || 'Organic'} </div>
                        <img src="/images/64ca49034fddad01069d9497_Carbs_light.svg" loading="lazy" alt="" />
                    </div>
                    <div className="shop-title-holder">
                        <div className="main-text">
                            {selectedCategory ? `Premium ${selectedCategory} Collection` : 'Nourishing Ingredients for Healthy, Radiant Skin'}
                        </div>
                    </div>
                </div>
                <div className="shop-wrapper w-dyn-list">
                    <div role="list" className="shop-list w-dyn-items">
                        {products.length === 0 ? (
                            <div style={{ padding: '60px', textAlign: 'center', color: '#666', gridColumn: '1 / -1' }}>
                                <p>No products found in this category yet.</p>
                            </div>
                        ) : (
                            products.map((product) => (
                                <div key={product.id} role="listitem" className="shop-item w-dyn-item">
                                    <Link to={`/product/${product.id}`} className="product-item-link w-inline-block">
                                        <div className="small-thumbnail-image">
                                            <img
                                                alt={product.name}
                                                loading="lazy"
                                                src={product.image_url}
                                                className="shop-item-image"
                                                onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Product'; }}
                                            />
                                        </div>
                                        <div className="shop-item-content">
                                            <div className="blog-item-text-header"></div>
                                            <div className="shop-item-title-price">
                                                <div className="shop-item-title">{product.name}</div>
                                                <div className="shop-item-price">$ {product.price} USD</div>
                                                <div className="fade-in-on-scroll">
                                                    <p className="shop-item-summary">{product.summary || product.description?.substring(0, 100)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="product-add-to-cart-holder">
                                        <button
                                            onClick={() => {
                                                addItem(product);
                                                toast.success(`${product.name} added to bag!`);
                                            }}
                                            className="w-commerce-commerceaddtocartbutton add-to-cart-button"
                                            style={{
                                                border: 'none',
                                                cursor: 'pointer',
                                                width: '100%',
                                                background: '#261a13',
                                                color: '#fdf0e1',
                                                borderRadius: '30px',
                                                padding: '12px 0',
                                                fontWeight: '700',
                                                letterSpacing: '1px',
                                                textTransform: 'uppercase',
                                                fontSize: '12px',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Add to Bag
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
