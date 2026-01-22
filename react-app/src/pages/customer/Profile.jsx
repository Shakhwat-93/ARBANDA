import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({ full_name: '', avatar_url: '' });
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('settings'); // settings, addresses, orders
    const [isSaving, setIsSaving] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addressForm, setAddressForm] = useState({
        title: '',
        full_name: '',
        phone: '',
        address_line: '',
        is_default: false
    });

    const refreshAddresses = async () => {
        const { data: addressesData } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', user?.id)
            .order('is_default', { ascending: false });

        if (addressesData) setAddresses(addressesData);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/login');
                    return;
                }
                setUser(user);

                // Fetch profile data
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileData) {
                    setProfile({
                        full_name: profileData.full_name || '',
                        avatar_url: profileData.avatar_url || ''
                    });
                }

                // Helper function for repetitive fetching
                const getOrders = async (userId) => {
                    const { data: ordersData, error: ordersError } = await supabase
                        .from('orders')
                        .select('*')
                        .eq('user_id', userId)
                        .order('created_at', { ascending: false });

                    if (ordersError) throw ordersError;
                    setOrders(ordersData);
                };

                // Fetch initial orders
                await getOrders(user.id);

                // Fetch addresses
                const { data: addressesData } = await supabase
                    .from('addresses')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('is_default', { ascending: false });

                if (addressesData) setAddresses(addressesData);

                // Set up realtime subscription for this user's orders
                const channel = supabase
                    .channel(`profile-orders-${user.id}`)
                    .on(
                        'postgres_changes',
                        {
                            event: '*',
                            schema: 'public',
                            table: 'orders',
                            filter: `user_id=eq.${user.id}`
                        },
                        () => {
                            getOrders(user.id);
                        }
                    )
                    .subscribe();

                return channel;

            } catch (err) {
                console.error('Error fetching profile data:', err.message);
            } finally {
                setLoading(false);
            }
        };

        const channelPromise = fetchUserData();

        return () => {
            channelPromise.then(channel => {
                if (channel) supabase.removeChannel(channel);
            });
        };
    }, [navigate]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: profile.full_name,
                    avatar_url: profile.avatar_url,
                    updated_at: new Date()
                });
            if (error) throw error;
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Error updating profile: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPG, PNG, etc).');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('File size too large. Max 2MB allowed.');
            return;
        }

        setIsSaving(true);
        try {
            const fileName = `${user.id}/${Date.now()}-${file.name}`;
            const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(data.path);

            setProfile({ ...profile, avatar_url: publicUrl });

            // Auto-save the new URL to profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            alert('Photo updated successfully!');
        } catch (err) {
            alert('Error uploading photo: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                ...addressForm,
                user_id: user.id
            };

            if (addressForm.is_default) {
                // If this is default, clear other defaults first
                await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
            }

            if (editingAddress) {
                const { error } = await supabase.from('addresses').update(payload).eq('id', editingAddress.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('addresses').insert([payload]);
                if (error) throw error;
            }

            setIsAddressModalOpen(false);
            setEditingAddress(null);
            setAddressForm({ title: '', full_name: '', phone: '', address_line: '', is_default: false });
            await refreshAddresses();
            alert('Address saved!');
        } catch (err) {
            alert('Error saving address: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            const { error } = await supabase.from('addresses').delete().eq('id', id);
            if (error) throw error;
            await refreshAddresses();
        } catch (err) {
            alert('Error deleting address: ' + err.message);
        }
    };

    const openAddressModal = (addr = null) => {
        if (addr) {
            setEditingAddress(addr);
            setAddressForm({
                title: addr.title,
                full_name: addr.full_name,
                phone: addr.phone || '',
                address_line: addr.address_line,
                is_default: addr.is_default
            });
        } else {
            setEditingAddress(null);
            setAddressForm({ title: '', full_name: '', phone: '', address_line: '', is_default: addresses.length === 0 });
        }
        setIsAddressModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ffaa00';
            case 'processing': return '#3498db';
            case 'shipped': return '#9b59b6';
            case 'delivered': return '#2ecc71';
            case 'cancelled': return '#e74c3c';
            default: return '#888';
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#fdf0e1', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#261a13' }}>
                <div className="loading-spinner">Loading your premium dashboard...</div>
            </div>
        );
    }

    const navigationItems = [
        { id: 'settings', label: 'Account Settings', icon: '👤' },
        { id: 'addresses', label: 'Saved Addresses', icon: '📍' },
        { id: 'orders', label: 'Order History', icon: '📦' },
    ];

    return (
        <div className="page-wrapper" style={{ background: '#fdf0e1', color: '#261a13', minHeight: '100vh' }}>
            <div className="section">
                <div className="container" style={{ maxWidth: '1200px' }}>

                    {/* Header */}
                    <div className="profile-header">
                        <div>
                            <h1>My Dashboard</h1>
                            <p>Welcome back, {profile.full_name || user.email.split('@')[0]} ✨</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="logout-btn"
                        >
                            LOG OUT
                        </button>
                    </div>

                    <div className="profile-dashboard-layout">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .profile-dashboard-layout {
                                display: flex;
                                gap: 40px;
                                align-items: flex-start;
                            }
                            .profile-sidebar {
                                position: sticky;
                                top: 120px;
                                z-index: 10;
                            }
                            .profile-tabs-scroll {
                                display: none;
                            }
                            @media (max-width: 991px) {
                                .profile-dashboard-layout {
                                    flex-direction: column;
                                    gap: 0;
                                }
                                .profile-sidebar {
                                    display: none;
                                }
                                .profile-tabs-scroll {
                                    display: flex;
                                    width: calc(100% + 40px);
                                    margin-left: -20px;
                                    overflow-x: auto;
                                    padding: 10px 20px 20px;
                                    gap: 12px;
                                    scrollbar-width: none;
                                    -ms-overflow-style: none;
                                    margin-bottom: 20px;
                                    position: sticky;
                                    top: 70px;
                                    background: #fdf0e1;
                                    z-index: 100;
                                }
                                .profile-tabs-scroll::-webkit-scrollbar {
                                    display: none;
                                }
                                .mobile-tab-btn {
                                    flex: 0 0 auto;
                                    padding: 12px 24px;
                                    border-radius: 30px;
                                    border: 1px solid #ebcfb9;
                                    background: #fff;
                                    color: #8d7a6e;
                                    font-size: 14px;
                                    font-weight: 700;
                                    transition: all 0.3s ease;
                                    white-space: nowrap;
                                }
                                .mobile-tab-btn.active {
                                    background: #261a13;
                                    color: #fdf0e1;
                                    border-color: #261a13;
                                    box-shadow: 0 10px 20px rgba(38,26,19,0.1);
                                }
                                .profile-content-area {
                                    padding: 0 !important;
                                }
                                .profile-card {
                                    padding: 30px 20px !important;
                                    border-radius: 24px !important;
                                    border: none !important;
                                    box-shadow: 0 10px 30px rgba(38,26,19,0.05) !important;
                                }
                                h1 {
                                    font-size: 28px !important;
                                    margin-bottom: 5px !important;
                                }
                                .profile-header {
                                    margin-bottom: 30px !important;
                                    flex-direction: column;
                                    align-items: flex-start !important;
                                    gap: 20px;
                                }
                                .logout-btn {
                                    width: 100%;
                                    text-align: center;
                                }
                            }
                        `}} />

                        {/* Mobile Tabs */}
                        <div className="profile-tabs-scroll">
                            {navigationItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`mobile-tab-btn ${activeTab === item.id ? 'active' : ''}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Sidebar Navigation (Desktop) */}
                        <div className="profile-sidebar" style={{ width: '300px', background: '#fff0e5', borderRadius: '30px', padding: '30px', border: '1px solid #ebcfb9', boxShadow: '0 20px 40px rgba(38,26,19,0.03)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {navigationItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px',
                                            padding: '16px 20px',
                                            borderRadius: '15px',
                                            border: 'none',
                                            background: activeTab === item.id ? '#fff0e5' : 'transparent',
                                            color: activeTab === item.id ? '#261a13' : '#8d7a6e',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            textAlign: 'left',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <span style={{ fontSize: '20px' }}>{item.icon}</span>
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="profile-content-area" style={{ flex: 1, minHeight: '600px' }}>

                            {activeTab === 'settings' && (
                                <div className="profile-card" style={{ background: '#fff0e5', padding: '40px', borderRadius: '30px', border: '1px solid #ebcfb9', boxShadow: '0 20px 40px rgba(38,26,19,0.03)' }}>
                                    <h2 style={{ fontSize: '24px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        Account Settings
                                    </h2>
                                    <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                                            <div style={{ width: '100px', height: '100px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', border: '1px solid #ebcfb9', overflow: 'hidden', flexShrink: 0 }}>
                                                {profile.avatar_url ? <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                                            </div>
                                            <div style={{ flex: 1, minWidth: '200px' }}>
                                                <input
                                                    type="file"
                                                    id="avatar-upload"
                                                    hidden
                                                    accept="image/*"
                                                    onChange={handlePhotoUpload}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('avatar-upload').click()}
                                                    style={{ background: '#261a13', border: 'none', color: '#fdf0e1', padding: '12px 24px', borderRadius: '30px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}
                                                >
                                                    {isSaving ? 'Uploading...' : 'Upload New Photo'}
                                                </button>
                                                <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#8d7a6e' }}>JPG or PNG. Max size 2MB.</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                            <div className="input-group">
                                                <label style={{ display: 'block', marginBottom: '10px', color: '#261a13', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
                                                <input
                                                    type="text"
                                                    value={profile.full_name}
                                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                                    style={{ width: '100%', padding: '15px 20px', background: '#fff', border: '1px solid #ebcfb9', borderRadius: '15px', color: '#261a13', fontSize: '16px', outline: 'none' }}
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label style={{ display: 'block', marginBottom: '10px', color: '#261a13', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{user.email ? 'Email Address' : 'Phone Identity'}</label>
                                                <input
                                                    type="text"
                                                    disabled
                                                    value={user.email || user.phone}
                                                    style={{ width: '100%', padding: '15px 20px', background: '#f5eee8', border: '1px solid #ebcfb9', borderRadius: '15px', color: '#8d7a6e', fontSize: '16px', cursor: 'not-allowed', fontWeight: '600' }}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="button w-button"
                                            style={{ alignSelf: 'flex-start', padding: '18px 45px', borderRadius: '40px', fontSize: '15px', fontWeight: '800' }}
                                        >
                                            {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'addresses' && (
                                <div className="profile-card" style={{ background: '#fff0e5', padding: '40px', borderRadius: '30px', border: '1px solid #ebcfb9', boxShadow: '0 20px 40px rgba(38,26,19,0.03)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                                        <h2 style={{ fontSize: '24px', margin: 0 }}>Saved Addresses</h2>
                                        <button onClick={() => openAddressModal()} className="button w-button" style={{ padding: '12px 25px', borderRadius: '40px', fontSize: '13px' }}>+ ADD NEW ADDRESS</button>
                                    </div>

                                    {addresses.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff0e5', borderRadius: '20px', border: '1px dashed #ebcfb9' }}>
                                            <div style={{ fontSize: '40px', marginBottom: '15px' }}>🏠</div>
                                            <p style={{ color: '#8d7a6e', margin: 0 }}>No addresses saved yet.</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                            {addresses.map(addr => (
                                                <div key={addr.id} style={{ border: '1px solid #ebcfb9', borderRadius: '20px', padding: '25px', position: 'relative', background: addr.is_default ? '#fff0e5' : 'transparent', transition: 'all 0.3s ease' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                                        <span style={{ fontWeight: '800', color: '#261a13', fontSize: '15px', letterSpacing: '0.5px' }}>{addr.title.toUpperCase()}</span>
                                                        {addr.is_default && <span style={{ fontSize: '10px', background: '#261a13', color: '#fff', padding: '4px 10px', borderRadius: '40px', fontWeight: '800' }}>DEFAULT</span>}
                                                    </div>
                                                    <div style={{ fontSize: '14px', color: '#8d7a6e', lineHeight: '1.8' }}>
                                                        <strong style={{ color: '#261a13' }}>{addr.full_name}</strong><br />
                                                        {addr.phone}<br />
                                                        <span style={{ fontSize: '13px' }}>{addr.address_line}</span>
                                                    </div>
                                                    <div style={{ marginTop: '25px', display: 'flex', gap: '25px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '15px' }}>
                                                        <button onClick={() => openAddressModal(addr)} style={{ background: 'none', border: 'none', color: '#b08d74', cursor: 'pointer', fontWeight: '800', fontSize: '11px', letterSpacing: '1px', padding: 0 }}>EDIT</button>
                                                        <button onClick={() => handleDeleteAddress(addr.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: '800', fontSize: '11px', letterSpacing: '1px', padding: 0 }}>DELETE</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Address Modal Overlay */}
                                    {isAddressModalOpen && (
                                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(38, 26, 19, 0.4)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setIsAddressModalOpen(false)}>
                                            <div style={{ background: '#fff', padding: '40px', borderRadius: '30px', width: '500px', maxWidth: '95%', border: '1px solid #ebcfb9', boxShadow: '0 30px 60px rgba(0,0,0,0.2)', animation: 'modalFadeUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
                                                <h3 style={{ marginBottom: '30px', color: '#261a13' }}>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                                                <form onSubmit={handleAddressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                    <div className="input-group">
                                                        <label style={{ display: 'block', marginBottom: '8px', color: '#b08d74', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Address Title (e.g. Home)</label>
                                                        <input required type="text" value={addressForm.title} onChange={e => setAddressForm({ ...addressForm, title: e.target.value })} style={{ width: '100%', padding: '14px', background: '#fff0e5', border: '1px solid #ebcfb9', borderRadius: '12px', outline: 'none', color: '#261a13' }} />
                                                    </div>
                                                    <div className="input-group">
                                                        <label style={{ display: 'block', marginBottom: '8px', color: '#b08d74', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Recipient Name</label>
                                                        <input required type="text" value={addressForm.full_name} onChange={e => setAddressForm({ ...addressForm, full_name: e.target.value })} style={{ width: '100%', padding: '14px', background: '#fff0e5', border: '1px solid #ebcfb9', borderRadius: '12px', outline: 'none', color: '#261a13' }} />
                                                    </div>
                                                    <div className="input-group">
                                                        <label style={{ display: 'block', marginBottom: '8px', color: '#b08d74', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone Number</label>
                                                        <input type="tel" value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} style={{ width: '100%', padding: '14px', background: '#fff0e5', border: '1px solid #ebcfb9', borderRadius: '12px', outline: 'none', color: '#261a13' }} />
                                                    </div>
                                                    <div className="input-group">
                                                        <label style={{ display: 'block', marginBottom: '8px', color: '#b08d74', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Address Details</label>
                                                        <textarea required rows="3" value={addressForm.address_line} onChange={e => setAddressForm({ ...addressForm, address_line: e.target.value })} style={{ width: '100%', padding: '14px', background: '#fff0e5', border: '1px solid #ebcfb9', borderRadius: '12px', resize: 'none', outline: 'none', color: '#261a13' }} />
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fdf0e1', padding: '15px', borderRadius: '12px' }}>
                                                        <input type="checkbox" checked={addressForm.is_default} onChange={e => setAddressForm({ ...addressForm, is_default: e.target.checked })} id="is_default" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                                        <label htmlFor="is_default" style={{ fontSize: '14px', color: '#261a13', fontWeight: '700', cursor: 'pointer', margin: 0 }}>Set as default shipping address</label>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                                        <button type="submit" disabled={isSaving} className="button w-button" style={{ flex: 1, padding: '15px', borderRadius: '40px', fontSize: '15px' }}>{isSaving ? 'SAVING...' : 'SAVE ADDRESS'}</button>
                                                        <button type="button" onClick={() => setIsAddressModalOpen(false)} style={{ background: '#f5f5f5', color: '#666', border: 'none', padding: '15px 25px', borderRadius: '40px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease' }}>CANCEL</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="profile-card" style={{ background: '#fff0e5', padding: '40px', borderRadius: '30px', border: '1px solid #ebcfb9', boxShadow: '0 20px 40px rgba(38,26,19,0.03)' }}>
                                    <h2 style={{ fontSize: '24px', marginBottom: '40px' }}>Order History</h2>
                                    {orders.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
                                            <p style={{ color: '#8d7a6e', marginBottom: '30px', fontSize: '18px' }}>You haven't placed any orders yet.</p>
                                            <button onClick={() => navigate('/shop')} className="button w-button">START SHOPPING</button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {orders.map((order) => (
                                                <div key={order.id} style={{ padding: '25px', borderRadius: '25px', border: '1px solid #f0f0f0', transition: 'all 0.3s ease' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                                                        <div>
                                                            <div style={{ color: '#b08d74', fontSize: '13px', fontWeight: '700' }}>ORDER #{order.id.substring(0, 8).toUpperCase()}</div>
                                                            <div style={{ color: '#261a13', fontSize: '15px', marginTop: '4px', fontWeight: '600' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                                                        </div>
                                                        <span style={{
                                                            padding: '6px 16px',
                                                            borderRadius: '40px',
                                                            fontSize: '11px',
                                                            fontWeight: '800',
                                                            background: getStatusColor(order.status) + '15',
                                                            color: getStatusColor(order.status),
                                                            border: `1px solid ${getStatusColor(order.status)}33`,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '1px'
                                                        }}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div style={{ fontSize: '20px', fontWeight: '800' }}>$ {order.total_amount}</div>
                                                        <button
                                                            onClick={() => navigate(`/checkout`)}
                                                            className="button w-button"
                                                            style={{ padding: '10px 24px', fontSize: '13px', borderRadius: '40px' }}
                                                        >
                                                            DETAILS
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
