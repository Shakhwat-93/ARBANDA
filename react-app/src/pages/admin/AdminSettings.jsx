import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getSession = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getSession();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    return (
        <AdminLayout>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ color: '#ebcfb9', margin: 0 }}>Settings</h1>
                <p style={{ color: '#666', marginTop: '10px' }}>Configure your store and admin profile.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
                <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
                    <h3 style={{ color: '#ebcfb9', marginBottom: '20px' }}>Admin Account</h3>
                    <div style={{ padding: '20px', background: '#111', borderRadius: '8px', border: '1px solid #222', marginBottom: '20px' }}>
                        <div style={{ color: '#888', fontSize: '13px', marginBottom: '5px' }}>Email Address</div>
                        <div style={{ color: '#fff' }}>{user?.email || 'Loading...'}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ background: '#e74c3c22', color: '#e74c3c', border: '1px solid #e74c3c44', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Logout Session
                    </button>
                </div>

                <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
                    <h3 style={{ color: '#ebcfb9', marginBottom: '20px' }}>Store Preferences</h3>
                    <div style={{ color: '#666' }}>
                        <p>Currency: <strong>USD ($)</strong></p>
                        <p>Timezone: <strong>UTC</strong></p>
                        <p>Orders: <strong>Enabled</strong></p>
                        <p style={{ marginTop: '20px', color: '#444', fontSize: '13px' }}>Additional store configuration options will be available soon.</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
