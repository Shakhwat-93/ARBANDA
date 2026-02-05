import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import {
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    Users,
    BarChart3,
    Layers,
    Ticket,
    CreditCard,
    Truck,
    Settings,
    LogOut,
    Search
} from 'lucide-react';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const linkStyle = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        color: isActive ? '#fff' : '#a1a1aa',
        textDecoration: 'none',
        background: isActive ? 'linear-gradient(90deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)' : 'transparent',
        borderLeft: isActive ? '3px solid #d946ef' : '3px solid transparent',
        borderRadius: '0 8px 8px 0',
        marginBottom: '4px',
        fontSize: '14px',
        fontWeight: isActive ? '500' : '400',
        transition: 'all 0.2s ease',
    });

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { path: '/admin/products', icon: ShoppingBag, label: 'Products' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/customers', icon: Users, label: 'Customers' },
        { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' }, // Placeholder route
        { path: '/admin/inventory', icon: Layers, label: 'Inventory' }, // Placeholder route
        { path: '/admin/coupons', icon: Ticket, label: 'Coupons & Discounts' }, // Placeholder route
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div style={{
            width: '260px',
            background: '#18181b', // Main sidebar bg
            minHeight: '100vh',
            borderRight: '1px solid #27272a',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            zIndex: 50,
            paddingTop: '20px'
        }}>
            {/* Logo Section */}
            <div style={{ padding: '0 24px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #a855f7, #ec4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>A</div>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        margin: 0,
                        background: 'linear-gradient(to right, #fff, #a1a1aa)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        ARBANDA
                    </h2>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, paddingRight: '16px' }}>
                <div style={{ padding: '0 24px 10px', fontSize: '11px', fontWeight: '600', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Main Menu
                </div>
                {menuItems.map((item) => (
                    <NavLink key={item.path} to={item.path} end={item.end} style={linkStyle}>
                        <item.icon size={18} />
                        {item.label}
                    </NavLink>
                ))}

                <div style={{ padding: '20px 24px 10px', fontSize: '11px', fontWeight: '600', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    System
                </div>
                <NavLink to="/admin/integrations" style={linkStyle}>
                    <CreditCard size={18} />
                    Payments
                </NavLink>
                <NavLink to="/admin/shipping" style={linkStyle}>
                    <Truck size={18} />
                    Shipping
                </NavLink>
            </nav>

            {/* Footer / Logout */}
            <div style={{ padding: '20px' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: '#27272a',
                        color: '#ef4444',
                        border: '1px solid #3f3f46',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#3f3f46'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#27272a'; }}
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
