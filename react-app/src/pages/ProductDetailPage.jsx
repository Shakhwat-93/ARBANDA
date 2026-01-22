import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Subscribe from '../components/Subscribe';
import RelatedProducts from '../components/RelatedProducts';
import useCartStore from '../store/useCartStore';
import { toast } from 'react-hot-toast';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setProduct(data);
            } catch (err) {
                console.error('Error fetching product:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    const handleQuantityChange = (type) => {
        if (type === 'inc') setQuantity(prev => prev + 1);
        if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fdf0e1', color: '#261a13' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '3px solid #fff0e5', borderTop: '3px solid #b08d74', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ letterSpacing: '2px', fontSize: '12px', textTransform: 'uppercase', opacity: 0.8, color: '#8d7a6e' }}>Unveiling Perfection...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fdf0e1', color: '#261a13', padding: '20px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Product Not Found</h2>
                <p style={{ marginBottom: '30px', opacity: 0.7, color: '#8d7a6e' }}>The product you're looking for might have been moved or is no longer available.</p>
                <Link to="/shop" className="button w-button">Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="page-wrapper" style={{ background: '#fdf0e1' }}>
            <div className="section" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
                <div className="container">
                    <div className="w-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '60px', alignItems: 'start' }}>

                        {/* Image Column */}
                        <div className="product-image-column">
                            <div style={{
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '24px',
                                background: '#fffcf9',
                                border: '1px solid #ebcfb9',
                                boxShadow: '0 20px 40px rgba(38, 26, 19, 0.05)',
                                transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)'
                            }}>
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                        transition: 'transform 0.8s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                    onError={(e) => { e.target.src = 'https://placehold.co/800x1000?text=' + product.name; }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '20px',
                                    background: '#b08d74',
                                    color: '#fff',
                                    padding: '6px 14px',
                                    borderRadius: '30px',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase'
                                }}>
                                    Featured Product
                                </div>
                            </div>
                        </div>

                        {/* Info Column */}
                        <div className="product-info-column" style={{ position: 'sticky', top: '100px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <Link to="/shop" style={{ color: '#b08d74', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7, transition: 'opacity 0.3s' }} onMouseOver={(e) => e.target.style.opacity = '1'} onMouseOut={(e) => e.target.style.opacity = '0.7'}>
                                    <span>← Back to Collection</span>
                                </Link>
                            </div>

                            <h1 style={{ color: '#261a13', fontSize: '48px', lineHeight: '1.1', marginBottom: '15px', fontFamily: 'inherit' }}>{product.name}</h1>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                                <div style={{ color: '#b08d74', fontSize: '24px', fontWeight: '600' }}>$ {product.price} USD</div>
                                <div style={{ width: '1px', height: '20px', background: '#ebcfb9' }}></div>
                                <div style={{ color: '#8d7a6e', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>{product.category}</div>
                            </div>

                            <p style={{ color: '#8d7a6e', fontSize: '17px', lineHeight: '1.6', marginBottom: '40px', maxWidth: '500px' }}>
                                {product.description || 'Elevate your daily ritual with this meticulously crafted piece. Designed for those who appreciate the finer details of high-end skincare and lifestyle.'}
                            </p>

                            <div style={{
                                background: '#fff0e5',
                                border: '1px solid #ebcfb9',
                                borderRadius: '24px',
                                padding: '30px',
                                marginBottom: '40px',
                                boxShadow: '0 10px 30px rgba(38, 26, 19, 0.03)'
                            }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ color: '#261a13', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>SELECT QUANTITY</div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: '#fdf0e1',
                                        width: 'fit-content',
                                        borderRadius: '40px',
                                        border: '1px solid #ebcfb9',
                                        padding: '4px'
                                    }}>
                                        <button
                                            onClick={() => handleQuantityChange('dec')}
                                            style={{ background: 'none', border: 'none', color: '#261a13', width: '40px', height: '40px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >—</button>
                                        <span style={{ color: '#261a13', width: '40px', textAlign: 'center', fontSize: '16px', fontWeight: '600' }}>{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange('inc')}
                                            style={{ background: 'none', border: 'none', color: '#261a13', width: '40px', height: '40px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >+</button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        addItem(product, quantity);
                                        toast.success(`${product.name} added to bag!`);
                                    }}
                                    className="button add-to-cart"
                                    style={{
                                        width: '100%',
                                        padding: '24px',
                                        fontSize: '16px',
                                        borderRadius: '40px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        background: '#261a13',
                                        color: '#fff',
                                        border: 'none'
                                    }}
                                >
                                    <span>Add to Bag</span>
                                    <span style={{ opacity: 0.3, color: '#fff' }}>|</span>
                                    <span>$ {(product.price * quantity).toFixed(2)}</span>
                                </button>
                            </div>

                            {/* Accordion Section */}
                            <div className="product-info-accordions">
                                {[
                                    { title: 'Benefits', content: product.benefits || 'Experience deep hydration and rejuvenation. Formulated to provide lasting results and a premium feel.' },
                                    { title: 'How to use', content: product.how_to_use || 'Apply to clean skin in circular motions. Use daily for optimal results.' },
                                    { title: 'Ingredients', content: product.ingredients || 'Natural extracts, minerals, and vitamins curated for maximum efficacy.' }
                                ].map((item, index) => (
                                    <div key={index} style={{ borderTop: '1px solid #ebcfb9', overflow: 'hidden' }}>
                                        <div
                                            onClick={() => toggleAccordion(index)}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '20px 0',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <div style={{ color: '#261a13', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px', fontWeight: '600' }}>{item.title}</div>
                                            <div style={{
                                                color: '#b08d74',
                                                fontSize: '20px',
                                                transform: activeAccordion === index ? 'rotate(45deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                                            }}>+</div>
                                        </div>
                                        <div style={{
                                            height: activeAccordion === index ? 'auto' : '0',
                                            opacity: activeAccordion === index ? 1 : 0,
                                            paddingBottom: activeAccordion === index ? '20px' : '0',
                                            transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                            color: '#8d7a6e',
                                            fontSize: '15px',
                                            lineHeight: '1.6'
                                        }}>
                                            {item.content}
                                        </div>
                                    </div>
                                ))}
                                <div style={{ borderTop: '1px solid #ebcfb9' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            <div style={{ background: '#fdf0e1', padding: '100px 0', borderTop: '1px solid #ebcfb9' }}>
                <RelatedProducts currentProductId={product.id} category={product.category} />
            </div>

            <Subscribe />

            <style>{`
                @media (max-width: 991px) {
                    .w-layout-grid {
                        grid-template-columns: 1fr !important;
                        gap: 40px !important;
                    }
                    .product-info-column {
                        position: static !important;
                    }
                    h1 {
                        font-size: 36px !important;
                    }
                }
                @media (min-width: 1920px) {
                    .container {
                        max-width: 1600px !important;
                    }
                    h1 {
                        font-size: 64px !important;
                    }
                    .product-info-column p {
                        font-size: 20px !important;
                        max-width: 700px !important;
                    }
                }
                @media (min-width: 2560px) {
                    .container {
                        max-width: 2000px !important;
                    }
                    h1 {
                        font-size: 84px !important;
                    }
                    .product-info-column p {
                        font-size: 24px !important;
                        max-width: 900px !important;
                    }
                }
                @media (min-width: 3840px) {
                    .container {
                        max-width: 2800px !important;
                    }
                    h1 {
                        font-size: 110px !important;
                    }
                    .product-info-column p {
                        font-size: 32px !important;
                        max-width: 1200px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductDetailPage;
