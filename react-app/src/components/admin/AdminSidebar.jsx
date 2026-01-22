import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const linkStyle = ({ isActive }) => ({
        display: 'block',
        padding: '12px 20px',
        color: isActive ? '#ebcfb9' : '#888',
        textDecoration: 'none',
        background: isActive ? '#222' : 'transparent',
        borderRadius: '8px',
        marginBottom: '5px',
        fontWeight: isActive ? '600' : '400',
        transition: 'all 0.3s'
    });

    return (
        <div style={{
            width: '260px',
            background: '#111',
            minHeight: '100vh',
            borderRight: '1px solid #333',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed'
        }}>
            <div style={{ marginBottom: '40px', paddingLeft: '10px' }}>
                <h2 style={{ color: '#ebcfb9', fontSize: '24px', margin: 0 }}>ARBANDA</h2>
                <small style={{ color: '#666' }}>ADMIN PANEL</small>
            </div>

            <nav style={{ flex: 1 }}>
                <NavLink to="/admin" end style={linkStyle}>Dashboard</NavLink>
                <NavLink to="/admin/products" style={linkStyle}>Products</NavLink>
                <NavLink to="/admin/orders" style={linkStyle}>Orders</NavLink>
                <NavLink to="/admin/settings" style={linkStyle}>Settings</NavLink>
            </nav>

            <button
                onClick={handleLogout}
                style={{
                    padding: '12px',
                    background: 'transparent',
                    color: '#ff4d4d',
                    border: '1px solid #ff4d4d',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    marginTop: '20px'
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default AdminSidebar;
