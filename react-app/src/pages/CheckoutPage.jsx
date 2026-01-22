import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import useCartStore from '../store/useCartStore';
import { useEffect } from 'react';

const CheckoutPage = () => {
    const { items, getTotalPrice, clearCart } = useCartStore();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [showAddressDropdown, setShowAddressDropdown] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                setFormData(prev => ({ ...prev, email: session.user.email }));

                // Fetch saved addresses
                const { data: addrData } = await supabase
                    .from('addresses')
                    .select('*')
                    .eq('user_id', session.user.id);

                if (addrData && addrData.length > 0) {
                    setAddresses(addrData);
                    // Find default address
                    const defaultAddr = addrData.find(a => a.is_default) || addrData[0];
                    if (defaultAddr) {
                        setFormData(prev => ({
                            ...prev,
                            name: defaultAddr.full_name,
                            phone: defaultAddr.phone || '',
                            address: defaultAddr.address_line
                        }));
                    }
                }
            }
        };
        fetchSession();
    }, []);

    const handleSelectAddress = (addr) => {
        setFormData({
            ...formData,
            name: addr.full_name,
            phone: addr.phone || '',
            address: addr.address_line
        });
        setShowAddressDropdown(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (items.length === 0) return;

        setLoading(true);
        try {
            // 1. Insert into Orders table
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    customer_name: formData.name,
                    customer_email: formData.email,
                    customer_phone: formData.phone,
                    shipping_address: formData.address,
                    total_amount: getTotalPrice(),
                    user_id: user?.id || null,
                    status: 'pending'
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Insert into Order Items table
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                total_price: item.price * item.quantity
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Success!
            clearCart();
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 5000);
        } catch (err) {
            console.error('Checkout error:', err.message);
            alert('There was an error processing your order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="section" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fdf0e1', textAlign: 'center' }}>
                <div className="container">
                    <div style={{ fontSize: '80px', marginBottom: '20px', animation: 'scalePulse 1s ease-out' }}>❤️</div>
                    <h1 style={{ color: '#261a13', marginBottom: '20px', fontSize: '42px', fontWeight: '800' }}>Thank You for Your Order!</h1>
                    <p style={{ color: '#8d7a6e', fontSize: '18px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>Your purchase was successful. We've received your request and will start processing it shortly.</p>
                    <Link to="/" className="button w-button" style={{ padding: '18px 40px', borderRadius: '40px' }}>Return to Gallery</Link>
                    <p style={{ marginTop: '25px', color: '#b08d74', fontSize: '14px', fontWeight: '600' }}>Redirecting to home in 5 seconds...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="section" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fdf0e1', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
                <h2 style={{ color: '#261a13', marginBottom: '30px' }}>Your luxury bag is currently empty</h2>
                <Link to="/shop" className="button w-button" style={{ borderRadius: '40px', padding: '15px 35px' }}>Start Exploring</Link>
            </div>
        );
    }

    return (
        <div className="page-wrapper" style={{ background: '#fdf0e1', color: '#261a13' }}>
            <div className="section">
                <div className="container">
                    <div className="checkout-grid-container">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .checkout-grid-container {
                                display: grid;
                                grid-template-columns: 1.25fr 0.75fr;
                                gap: 60px;
                            }
                            @media (max-width: 991px) {
                                .checkout-grid-container {
                                    grid-template-columns: 1fr;
                                    gap: 40px;
                                }
                                .checkout-form-holder, .order-summary-holder {
                                    padding: 30px !important;
                                }
                                .shop-title-holder h1 {
                                    font-size: 36px !important;
                                }
                            }
                            @media (max-width: 479px) {
                                .checkout-form-holder, .order-summary-holder {
                                    padding: 20px !important;
                                    border-radius: 20px !important;
                                }
                            }
                        `}} />
                        {/* Order Form or Login Wall */}
                        <div className="checkout-form-holder">
                            {!user ? (
                                <div style={{ background: '#fff0e5', padding: '60px', borderRadius: '35px', border: '1px solid #ebcfb9', textAlign: 'center', boxShadow: '0 25px 50px rgba(38,26,19,0.06)' }}>
                                    <h3 style={{ color: '#261a13', marginBottom: '20px', fontSize: '32px', fontWeight: '800' }}>Exclusive Membership</h3>
                                    <p style={{ color: '#8d7a6e', marginBottom: '40px', fontSize: '17px', lineHeight: '1.6' }}>Please login or join us to complete your purchase and enjoy personalized shopping experiences.</p>
                                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                                        <Link to="/login" state={{ from: { pathname: '/checkout' } }} className="button w-button" style={{ padding: '15px 40px', borderRadius: '40px' }}>Log In</Link>
                                        <Link to="/register" state={{ from: { pathname: '/checkout' } }} style={{ color: '#261a13', textDecoration: 'none', display: 'flex', alignItems: 'center', fontWeight: '700', borderBottom: '2px solid #ebcfb9', paddingBottom: '2px' }}>Join Arbanda</Link>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ background: '#fff0e5', padding: '45px', borderRadius: '35px', border: '1px solid #ebcfb9', boxShadow: '0 20px 40px rgba(38,26,19,0.04)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                                        <h3 style={{ color: '#261a13', margin: 0, display: 'flex', alignItems: 'center', gap: '15px', fontSize: '24px', fontWeight: '800' }}>
                                            <span style={{ background: '#261a13', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>1</span>
                                            Shipping Details
                                        </h3>

                                        {addresses.length > 0 && (
                                            <div style={{ position: 'relative' }}>
                                                <button
                                                    onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                                                    style={{ background: '#fff0e5', border: '1px solid #ebcfb9', color: '#261a13', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                                >
                                                    📍 USE SAVED ADDRESS
                                                </button>
                                                {showAddressDropdown && (
                                                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', width: '300px', background: '#fdf0e1', border: '1px solid #ebcfb9', borderRadius: '20px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', zIndex: 100, padding: '10px', animation: 'fadeIn 0.2s ease' }}>
                                                        {addresses.map(addr => (
                                                            <div
                                                                key={addr.id}
                                                                onClick={() => handleSelectAddress(addr)}
                                                                style={{ padding: '15px', borderRadius: '12px', cursor: 'pointer', borderBottom: '1px solid #f9f9f9', transition: 'all 0.2s ease' }}
                                                                className="saved-addr-item"
                                                            >
                                                                <div style={{ fontWeight: '800', fontSize: '13px', color: '#261a13', marginBottom: '4px' }}>{addr.title.toUpperCase()}</div>
                                                                <div style={{ fontSize: '12px', color: '#8d7a6e', lineHeight: '1.4' }}>{addr.full_name}, {addr.address_line}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                        <div className="input-group">
                                            <label style={{ display: 'block', marginBottom: '12px', color: '#b08d74', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                style={{ width: '100%', padding: '18px', background: '#fff0e5', border: '1px solid #ebcfb9', borderRadius: '15px', color: '#261a13', fontSize: '16px', outline: 'none' }}
                                                placeholder="Enter recipient name"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', marginBottom: '12px', color: '#b08d74', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                disabled
                                                value={formData.email}
                                                style={{ width: '100%', padding: '18px', background: '#f8f8f8', border: '1px solid #eee', borderRadius: '15px', color: '#999', fontSize: '16px', cursor: 'not-allowed' }}
                                            />
                                            <span style={{ fontSize: '12px', color: '#b08d74', marginTop: '10px', display: 'block', fontStyle: 'italic' }}>* Official account email used for order tracking</span>
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', marginBottom: '12px', color: '#b08d74', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                style={{ width: '100%', padding: '18px', background: '#fff0e5', border: '1px solid #ebcfb9', borderRadius: '15px', color: '#261a13', fontSize: '16px', outline: 'none' }}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', marginBottom: '12px', color: '#b08d74', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Delivery Address</label>
                                            <textarea
                                                name="address"
                                                required
                                                rows="4"
                                                value={formData.address}
                                                onChange={handleChange}
                                                style={{ width: '100%', padding: '18px', background: '#fff0e5', border: '1px solid #ebcfb9', borderRadius: '15px', color: '#261a13', fontSize: '16px', resize: 'none', outline: 'none' }}
                                                placeholder="Detailed street address, building, apartment..."
                                            ></textarea>
                                        </div>

                                        <div style={{ marginTop: '15px' }}>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="button w-button"
                                                style={{ width: '100%', padding: '22px', fontSize: '18px', borderRadius: '40px', fontWeight: '900', letterSpacing: '1px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                                            >
                                                {loading ? 'PROCESSING...' : `PLACE ORDER - $${getTotalPrice()} USD`}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="order-summary-holder" style={{ background: '#fff0e5', border: '1px solid #ebcfb9', borderRadius: '30px', padding: '40px', height: 'fit-content', boxShadow: '0 10px 30px rgba(38,26,19,0.03)' }}>
                            <h3 style={{ color: '#261a13', marginBottom: '30px' }}>Order Summary</h3>
                            <div className="cart-list" style={{ marginBottom: '30px' }}>
                                {items.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #f9f9f9', paddingBottom: '15px' }}>
                                        <div>
                                            <div style={{ color: '#261a13', fontWeight: '600', fontSize: '16px' }}>{item.name}</div>
                                            <div style={{ color: '#8d7a6e', fontSize: '14px' }}>Qty: {item.quantity} × $ {item.price}</div>
                                        </div>
                                        <div style={{ color: '#261a13', fontWeight: '700' }}>$ {item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-total" style={{ borderTop: '2px solid #fff0e5', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '800' }}>
                                    <div style={{ color: '#8d7a6e' }}>Total Amount</div>
                                    <div style={{ color: '#261a13' }}>$ {getTotalPrice()} USD</div>
                                </div>
                            </div>
                            <div style={{ marginTop: '40px', padding: '20px', background: '#fdf0e1', borderRadius: '15px', border: '1px dashed #ebcfb9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src="/images/64cb71637e6b66a1f09c668b_Brown%20Heart.svg" alt="" style={{ width: '18px' }} />
                                    <p style={{ color: '#261a13', fontSize: '13px', margin: 0, fontWeight: '600' }}>Secure SSL Encrypted Checkout</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
