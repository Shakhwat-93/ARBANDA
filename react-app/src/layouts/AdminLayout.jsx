import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; // Added NavLink
import AdminSidebar from '../components/admin/AdminSidebar';
import { Search, LayoutDashboard, ShoppingBag, Users, ShoppingCart } from 'lucide-react'; // Added icons

const MobileAdminNav = () => {
    const linkStyle = ({ isActive }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        color: isActive ? '#a855f7' : '#71717a',
        textDecoration: 'none',
        fontSize: '10px',
        fontWeight: isActive ? '600' : '500',
        flex: 1,
        padding: '8px 0',
        transition: 'all 0.2s'
    });

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70px',
            background: '#18181b', // Solid dark background
            borderTop: '1px solid #27272a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 100,
            paddingBottom: 'env(safe-area-inset-bottom)'
        }}>
            <NavLink to="/admin" end style={linkStyle}>
                <LayoutDashboard size={20} />
                <span>Home</span>
            </NavLink>
            <NavLink to="/admin/products" style={linkStyle}>
                <ShoppingBag size={20} />
                <span>Products</span>
            </NavLink>

            {/* Center + Button (Floating Action) */}
            <div style={{ position: 'relative', top: '-24px' }}>
                <NavLink to="/admin/products/new" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                    boxShadow: '0 8px 16px rgba(168, 85, 247, 0.4)',
                    color: '#fff',
                    border: '4px solid #09090b' // Matches body bg to look cut-out
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </NavLink>
            </div>

            <NavLink to="/admin/orders" style={linkStyle}>
                <ShoppingCart size={20} />
                <span>Orders</span>
            </NavLink>
            <NavLink to="/admin/customers" style={linkStyle}>
                <Users size={20} />
                <span>Profile</span>
            </NavLink>
        </div>
    );
};

const AdminLayout = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ display: 'flex', background: '#09090b', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif', width: '100%', overflowX: 'hidden' }}>
            {/* Desktop Sidebar (Left) */}
            {!isMobile && <AdminSidebar />}

            {/* Main Content Area */}
            <div style={{
                marginLeft: isMobile ? '0' : '260px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: isMobile ? '80px' : '0', // Space for bottom nav on mobile
                width: isMobile ? '100%' : 'calc(100% - 260px)', // Explicit width check
                overflowX: 'hidden' // Prevent horizontal scroll
            }}>

                {/* Responsive Top Bar */}
                <div style={{
                    height: '70px',
                    borderBottom: '1px solid #27272a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isMobile ? '0 16px' : '0 32px',
                    background: 'rgba(9, 9, 11, 0.8)',
                    backdropFilter: 'blur(8px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 40,
                    width: '100%',
                    boxSizing: 'border-box' // Important for padding
                }}>
                    <div style={{ position: 'relative', width: isMobile ? '100%' : '300px' }}>
                        <Search
                            size={16}
                            color="#71717a"
                            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            style={{
                                width: '100%',
                                background: '#18181b',
                                border: '1px solid #27272a',
                                borderRadius: '8px',
                                padding: '10px 10px 10px 40px',
                                color: '#e4e4e7',
                                fontSize: '13px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {!isMobile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            {/* Notification Icon */}
                            <div style={{ position: 'relative', cursor: 'pointer' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                                <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '8px', height: '8px', background: '#ec4899', borderRadius: '50%', border: '2px solid #09090b' }}></div>
                            </div>

                            {/* Profile Avatar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <div style={{ textAlign: 'right', display: 'none', lg: 'block' }}>
                                    <p style={{ fontSize: '13px', fontWeight: '500', margin: 0 }}>Admin User</p>
                                    <p style={{ fontSize: '11px', color: '#71717a', margin: 0 }}>Super Admin</p>
                                </div>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#27272a', overflow: 'hidden' }}>
                                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff" alt="Profile" style={{ width: '100%', height: '100%' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Page Content */}
                <div style={{
                    padding: isMobile ? '16px' : '32px',
                    maxWidth: '1600px',
                    width: '100%',
                    margin: '0 auto',
                    boxSizing: 'border-box'
                }}>
                    {children}
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            {isMobile && <MobileAdminNav />}
        </div>
    );
};

export default AdminLayout;
