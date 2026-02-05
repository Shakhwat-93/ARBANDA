import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Bell, Shield, Wallet } from 'lucide-react';

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

    const SectionCard = ({ icon: Icon, title, children }) => (
        <div style={{ background: '#18181b', borderRadius: '16px', border: '1px solid #27272a', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #27272a' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.1)', color: '#d946ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{title}</h3>
            </div>
            {children}
        </div>
    );

    return (
        <AdminLayout>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Settings</h1>
                <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px' }}>Configure your profile and store preferences.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                {/* Account Settings */}
                <SectionCard icon={User} title="Admin Profile">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#27272a', overflow: 'hidden' }}>
                            <img src="https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff" alt="Profile" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontWeight: '600' }}>Admin User</h4>
                            <p style={{ margin: '4px 0 0 0', color: '#a1a1aa', fontSize: '13px' }}>Super Administrator</p>
                        </div>
                    </div>

                    <div style={{ padding: '16px', background: '#27272a', borderRadius: '12px', marginBottom: '24px' }}>
                        <div style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>Email Address</div>
                        <div style={{ color: '#e4e4e7', fontWeight: '500' }}>{user?.email || 'Loading...'}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #3f3f46', borderRadius: '8px', color: '#e4e4e7', cursor: 'pointer', fontSize: '13px', textAlign: 'center' }}>Edit Profile</button>
                        <button style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #3f3f46', borderRadius: '8px', color: '#e4e4e7', cursor: 'pointer', fontSize: '13px', textAlign: 'center' }}>Change Password</button>
                    </div>
                </SectionCard>

                {/* Store Settings */}
                <SectionCard icon={Settings} title="Store Configuration">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272a' }}>
                            <div>
                                <div style={{ fontWeight: '500', color: '#e4e4e7' }}>Store Currency</div>
                                <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Default currency for your products.</div>
                            </div>
                            <span style={{ fontWeight: '600', color: '#d946ef' }}>USD ($)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272a' }}>
                            <div>
                                <div style={{ fontWeight: '500', color: '#e4e4e7' }}>Timezone</div>
                                <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Your local timezone.</div>
                            </div>
                            <span style={{ fontWeight: '600', color: '#d946ef' }}>UTC</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0' }}>
                            <div>
                                <div style={{ fontWeight: '500', color: '#e4e4e7' }}>Order System</div>
                                <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Accepting new orders.</div>
                            </div>
                            <span style={{ display: 'inline-block', width: '40px', height: '20px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '10px', position: 'relative', border: '1px solid #10b981' }}>
                                <span style={{ position: 'absolute', right: '2px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', background: '#10b981' }}></span>
                            </span>
                        </div>
                    </div>
                </SectionCard>

                {/* Notifications & Security */}
                <SectionCard icon={Shield} title="Security & Notifications">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Bell size={18} color="#a1a1aa" />
                            <div>
                                <div style={{ color: '#e4e4e7', fontSize: '14px' }}>Email Notifications</div>
                                <div style={{ color: '#71717a', fontSize: '12px' }}>Receive emails for new orders</div>
                            </div>
                        </div>
                        <div style={{ width: '36px', height: '20px', background: '#3f3f46', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                            <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', left: '2px', top: '2px' }}></div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Wallet size={18} color="#a1a1aa" />
                            <div>
                                <div style={{ color: '#e4e4e7', fontSize: '14px' }}>Payment Alerts</div>
                                <div style={{ color: '#71717a', fontSize: '12px' }}>Notify on high-value transactions</div>
                            </div>
                        </div>
                        <div style={{ width: '36px', height: '20px', background: '#d946ef', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                            <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }}></div>
                        </div>
                    </div>
                </SectionCard>

                {/* Danger Zone */}
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ef4444', margin: '0 0 4px 0' }}>Sign Out</h3>
                        <p style={{ fontSize: '13px', color: '#fca5a5', margin: 0 }}>End your current administrator session safely.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '13px'
                        }}
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
