import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import { supabase } from '../supabaseClient';

export default function Navbar() {
    const { getTotalItems, items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // New state for mobile menu
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
        } else {
            setIsAccountMenuOpen(false);
            navigate('/login');
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="navbar w-nav">
            <style dangerouslySetInnerHTML={{
                __html: `
                .nav-menu-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    gap: 15px;
                }
                .nav-left-wrapper {
                    flex: 1;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                }
                .nav-center-wrapper {
                    flex: 0 0 auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .nav-right-wrapper {
                    flex: 1;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
                .brand-link {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                }
                .brand-logo {
                    max-width: 80px;
                    height: auto;
                }
                .nav-auth-holder {
                    position: relative;
                }
                .account-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    width: 280px;
                    background: #fdf0e1;
                    border: 1px solid #ebcfb9;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(38, 26, 19, 0.1);
                    margin-top: 15px;
                    padding: 10px 0;
                    z-index: 1001;
                    animation: dropdownSlide 0.3s ease;
                }
                @keyframes dropdownSlide {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 20px;
                    color: #261a13;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    cursor: pointer;
                    font-size: 15px;
                }
                .dropdown-item:hover {
                    background: #fff0e5;
                }
                .dropdown-icon-wrapper {
                    width: 32px;
                    height: 32px;
                    background: #fff0e5;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .dropdown-divider {
                    height: 1px;
                    background: #ebcfb9;
                    margin: 8px 0;
                    opacity: 0.5;
                }
                .dropdown-item.logout {
                    color: #8b0000;
                }
                @media (max-width: 991px) {
                    .nav-menu-container {
                        padding: 0 10px;
                    }
                    .nav-left-wrapper {
                        flex: 0 0 auto;
                    }
                    .nav-center-wrapper {
                        flex: 1;
                        justify-content: center;
                    }
                    .nav-right-wrapper {
                        flex: 0 0 auto;
                    }
                }
                @media (max-width: 479px) {
                    .brand-text {
                        font-size: 14px;
                    }
                    .brand-logo {
                        width: 30px;
                        height: 30px;
                    }
                    .account-dropdown {
                        width: 240px;
                        right: -10px;
                    }
                }
                @media (min-width: 1920px) {
                    .container.nav-container {
                        max-width: 1600px;
                    }
                    .brand-logo {
                        max-width: 100px;
                    }
                }
                @media (min-width: 2560px) {
                    .container.nav-container {
                        max-width: 2000px;
                    }
                    .brand-logo {
                        max-width: 120px;
                    }
                    .nav-link {
                        font-size: 18px;
                    }
                }
                @media (min-width: 3840px) {
                    .container.nav-container {
                        max-width: 2800px;
                    }
                    .brand-logo {
                        max-width: 150px;
                    }
                    .nav-link {
                        font-size: 22px;
                    }
                }
                @media (max-width: 991px) {
                    .nav-menu {
                        display: ${isMenuOpen ? 'flex' : 'none'};
                        position: fixed;
                        top: 0;
                        left: 0;
                        height: 100vh;
                        width: 280px;
                        background: #fdf0e1;
                        flex-direction: column;
                        justify-content: flex-start;
                        padding: 80px 30px;
                        gap: 30px;
                        box-shadow: 10px 0 30px rgba(38, 26, 19, 0.1);
                        z-index: 2000;
                        border-right: 1px solid #ebcfb9;
                    }
                    .nav-links-block {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 25px;
                    }
                    .nav-link {
                        font-size: 20px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    }
                    .menu-button {
                        display: flex !important;
                        cursor: pointer;
                        z-index: 2001;
                        padding: 10px;
                        background: transparent; /* Changed from #fff to transparent */
                        border: 1px solid #ebcfb9; /* Added border for better definition */
                        border-radius: 12px;
                        transition: all 0.3s ease;
                    }
                    .menu-button:hover {
                        background: #fff0e5;
                    }
                }
                @media (min-width: 992px) {
                    .menu-button {
                        display: none;
                    }
                    .nav-menu {
                        display: block;
                    }
                }
            `}} />
            <div className="container nav-container">
                <div className="nav-menu-container">
                    <div className="nav-left-wrapper">
                        {/* Mobile Menu Overlay Toggle */}
                        {isMenuOpen && (
                            <div
                                className="menu-overlay"
                                style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(38, 26, 19, 0.2)', backdropFilter: 'blur(4px)', zIndex: 1999 }}
                                onClick={() => setIsMenuOpen(false)}
                            />
                        )}
                        <nav role="navigation" className={`nav-menu w-nav-menu ${isMenuOpen ? 'w--open' : ''}`}>
                            <div className="nav-links-block" onClick={() => setIsMenuOpen(false)}>
                                <div className="nav-link-holder">
                                    <NavLink to="/" className={({ isActive }) => `nav-link w-inline-block ${isActive ? 'w--current' : ''}`}>
                                        <div>home</div>
                                        <img src="/images/64cb71637e6b66a1f09c668b_Brown%20Heart.svg" alt="" className="nav-link-heart-image" />
                                    </NavLink>
                                </div>
                                <div className="nav-link-holder">
                                    <NavLink to="/about" className={({ isActive }) => `nav-link w-inline-block ${isActive ? 'w--current' : ''}`}>
                                        <div>about</div>
                                        <img src="/images/64cb71637e6b66a1f09c668b_Brown%20Heart.svg" alt="" className="nav-link-heart-image" />
                                    </NavLink>
                                </div>
                                <div className="nav-link-holder">
                                    <NavLink to="/shop" className={({ isActive }) => `nav-link w-inline-block ${isActive ? 'w--current' : ''}`}>
                                        <div>Shop</div>
                                        <img src="/images/64cb71637e6b66a1f09c668b_Brown%20Heart.svg" alt="" className="nav-link-heart-image" />
                                    </NavLink>
                                </div>
                            </div>
                        </nav>
                        <div className="menu-button w-nav-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <img src={isMenuOpen ? "/images/64c90de928c2823d70ea1ba1_x.svg" : "/images/64c90de928c2823d70ea1b90_menu-icon.svg"} loading="lazy" alt="" className="menu-icon" style={{ width: '24px', height: '24px' }} />
                        </div>
                    </div>

                    <div className="nav-center-wrapper">
                        <Link to="/" className="brand-link w-nav-brand">
                            <img src="/assets/Untitled design (5).png" loading="lazy" alt="Brand Logo" className="brand-logo" />
                            <span className="brand-text">ARBANDA</span>
                        </Link>
                    </div>

                    <div className="nav-right-wrapper">
                        <div className="nav-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div className="nav-cart-holder">
                                <div className="w-commerce-commercecartwrapper cart">
                                    <div onClick={() => setIsCartOpen(true)} className="w-commerce-commercecartopenlink cart-button w-inline-block" style={{ cursor: 'pointer' }}>
                                        <img src="/images/64c90de928c2823d70ea1ba0_Cart.svg" alt="" className="cart-image" />
                                        <div className="w-commerce-commercecartopenlinkcount cart-quantity-number">{getTotalItems()}</div>
                                        <div className="link-background"></div>
                                    </div>
                                    {/* ... rest of cart items ... */}

                                    {/* Cart Sidebar Overlay */}
                                    {isCartOpen && (
                                        <div className="cart-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(38, 26, 19, 0.4)', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsCartOpen(false)}>
                                            <div className="cart-container" style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '400px', maxWidth: '100%', background: '#fdf0e1', borderLeft: '1px solid #ebcfb9', padding: '30px', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
                                                <div className="cart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                                    <h4 className="cart-title" style={{ margin: 0, color: '#261a13', fontSize: '24px', fontFamily: 'inherit' }}>Your Cart</h4>
                                                    <div onClick={() => setIsCartOpen(false)} style={{ cursor: 'pointer', padding: '10px', background: '#fff0e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <img src="/images/64c90de928c2823d70ea1ba1_x.svg" alt="Close" style={{ width: '14px', height: '14px', filter: 'brightness(0.2)' }} />
                                                    </div>
                                                </div>

                                                <div className="cart-form-wrapper" style={{ flex: 1, overflowY: 'auto' }}>
                                                    {items.length === 0 ? (
                                                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
                                                            <p style={{ color: '#666', marginBottom: '30px', fontSize: '18px' }}>Your cart is empty.</p>
                                                            <Link to="/shop" onClick={() => setIsCartOpen(false)} className="button w-button">SHOP NOW</Link>
                                                        </div>
                                                    ) : (
                                                        <div className="cart-items-list">
                                                            {items.map((item) => (
                                                                <div key={item.id} className="cart-item" style={{ display: 'flex', gap: '15px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                                                                    <img src={item.image_url} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Product'; }} />
                                                                    <div style={{ flex: 1 }}>
                                                                        <div style={{ color: '#261a13', fontWeight: '600', marginBottom: '5px', fontSize: '16px' }}>{item.name}</div>
                                                                        <div style={{ color: '#b08d74', fontSize: '15px', fontWeight: '500' }}>$ {item.price} USD</div>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '12px' }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', background: '#fff0e5', borderRadius: '20px', padding: '2px 10px', border: '1px solid #eee' }}>
                                                                                <button onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))} style={{ background: 'none', border: 'none', color: '#261a13', cursor: 'pointer', padding: '5px 10px' }}>-</button>
                                                                                <span style={{ color: '#261a13', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: '#261a13', cursor: 'pointer', padding: '5px 10px' }}>+</button>
                                                                            </div>
                                                                            <div onClick={() => removeItem(item.id)} style={{ cursor: 'pointer', color: '#888', fontSize: '12px', textDecoration: 'underline' }}>Remove</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {items.length > 0 && (
                                                    <div className="cart-footer" style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: 'auto' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                                            <div style={{ color: '#666', fontSize: '16px' }}>Subtotal</div>
                                                            <div style={{ color: '#261a13', fontWeight: '700', fontSize: '20px' }}>$ {getTotalPrice()} USD</div>
                                                        </div>
                                                        <Link
                                                            to="/checkout"
                                                            onClick={() => setIsCartOpen(false)}
                                                            className="button w-button"
                                                            style={{ width: '100%', textAlign: 'center', display: 'block', padding: '20px', fontSize: '16px', borderRadius: '40px' }}
                                                        >
                                                            CONTINUE TO CHECKOUT
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Auth / Profile Link with Dropdown */}
                            <div className="nav-auth-holder">
                                {user ? (
                                    <>
                                        <div
                                            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                                            className={`cart-button w-inline-block ${isAccountMenuOpen ? 'w--current' : ''}`}
                                            style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'all 0.3s ease' }}>
                                                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#261a13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21" stroke="#261a13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="link-background"></div>
                                        </div>

                                        {isAccountMenuOpen && (
                                            <div className="account-dropdown">
                                                <Link to="/profile" className="dropdown-item" onClick={() => setIsAccountMenuOpen(false)}>
                                                    <div className="dropdown-icon-wrapper">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                    </div>
                                                    <span>Manage My Account</span>
                                                </Link>
                                                <Link to="/profile?tab=orders" className="dropdown-item" onClick={() => setIsAccountMenuOpen(false)}>
                                                    <div className="dropdown-icon-wrapper">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg>
                                                    </div>
                                                    <span>My Orders</span>
                                                </Link>
                                                <Link to="/profile?tab=wishlist" className="dropdown-item" onClick={() => setIsAccountMenuOpen(false)}>
                                                    <div className="dropdown-icon-wrapper">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                                                    </div>
                                                    <span>My Wishlist</span>
                                                </Link>
                                                <div className="dropdown-divider"></div>
                                                <div className="dropdown-item logout" onClick={handleLogout}>
                                                    <div className="dropdown-icon-wrapper" style={{ background: '#fff0f0' }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                                    </div>
                                                    <span>Logout</span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <NavLink to="/login" className={({ isActive }) => `cart-button w-inline-block ${isActive ? 'w--current' : ''}`} style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
                                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#261a13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#261a13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="link-background"></div>
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
