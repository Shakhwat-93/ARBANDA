import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import useCartStore from '../store/useCartStore';
import { toast } from 'react-hot-toast';

const RelatedProducts = ({ currentProductId, category }) => {
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchRelated = async () => {
            if (!category) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', category)
                    .neq('id', currentProductId)
                    .limit(3);

                if (error) throw error;
                setRelated(data);
            } catch (err) {
                console.error('Error fetching related products:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();

        // Real-time subscription for products in this category
        const channel = supabase
            .channel(`related-products-${category}-${currentProductId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'products',
                    filter: `category=eq.${category}`
                },
                () => {
                    fetchRelated();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentProductId, category]);

    if (loading || related.length === 0) return null;

    return (
        <div className="section" style={{ background: 'transparent', borderTop: 'none' }}>
            <div className="container">
                <div className="shop-title-holder" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ color: '#261a13' }}>Continue Your Skincare Journey</h2>
                    <p style={{ color: '#8d7a6e' }}>Explore more products tailored for your needs.</p>
                </div>
                <div className="shop-wrapper w-dyn-list">
                    <div role="list" className="shop-list w-dyn-items">
                        {related.map((product) => (
                            <div key={product.id} role="listitem" className="shop-item w-dyn-item">
                                <Link to={`/product/${product.id}`} className="product-item-link w-inline-block">
                                    <div className="small-thumbnail-image" style={{ borderRadius: '16px', border: '1px solid #ebcfb9' }}>
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="shop-item-image"
                                            onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=' + product.name; }}
                                        />
                                    </div>
                                    <div className="shop-item-content">
                                        <div className="shop-item-title-price">
                                            <div className="shop-item-title" style={{ color: '#261a13', fontWeight: '600' }}>{product.name}</div>
                                            <div className="shop-item-price" style={{ color: '#b08d74' }}>$ {product.price} USD</div>
                                        </div>
                                    </div>
                                </Link>
                                <div className="product-add-to-cart-holder" style={{ marginTop: '15px' }}>
                                    <button
                                        onClick={() => {
                                            addItem(product);
                                            toast.success(`${product.name} added to bag!`);
                                        }}
                                        className="button add-to-cart"
                                        style={{ width: '100%', border: 'none', cursor: 'pointer', background: '#261a13', color: '#fff', padding: '12px', borderRadius: '30px' }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RelatedProducts;
