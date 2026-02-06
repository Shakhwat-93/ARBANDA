import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Bell, Shield, Wallet, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PremiumLoader from '../../components/common/PremiumLoader';

const AdminSettings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Store Settings State
    const [settings, setSettings] = useState({
        currency: 'USD',
        timezone: 'UTC',
        order_system_enabled: true,
        email_notifications: false,
        payment_alerts: true
    });

    useEffect(() => {
        const getSession = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('store_settings')
                    .select('*')
                    .single();

                if (data) {
                    setSettings({
                        currency: data.currency,
                        timezone: data.timezone,
                        order_system_enabled: data.order_system_enabled,
                        email_notifications: data.email_notifications,
                        payment_alerts: data.payment_alerts
                    });
                }
            } catch (error) {
                console.error('Error loading settings:', error);
                // If table doesn't exist or empty, we keep defaults
            } finally {
                setLoading(false);
            }
        };

        getSession();
        fetchSettings();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            // Check if row exists
            const { data: existing } = await supabase.from('store_settings').select('id').single();

            let error;
            if (existing) {
                const { error: updateError } = await supabase
                    .from('store_settings')
                    .update(settings)
                    .eq('id', existing.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('store_settings')
                    .insert([settings]);
                error = insertError;
            }

            if (error) throw error;
            toast.success('Settings saved successfully');
        } catch (err) {
            console.error('Error saving settings:', err);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    // Toggle handler
    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Change handler
    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const SectionCard = ({ icon: Icon, title, children }) => (
        <div style={{ background: '#18181b', borderRadius: '16px', border: '1px solid #27272a', padding: '24px', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #27272a' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.1)', color: '#d946ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{title}</h3>
            </div>
            {children}
        </div>
    );

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ height: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PremiumLoader text="Loading Settings..." />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Settings</h1>
                    <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px' }}>Configure your profile and store preferences.</p>
                </div>
                <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        background: '#d946ef',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: '600',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.7 : 1
                    }}
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                {/* Account Settings */}
                <SectionCard icon={User} title="Admin Profile">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#27272a', overflow: 'hidden' }}>
                            <img src={`https://ui-avatars.com/api/?name=${user?.email || 'Admin'}&background=3b82f6&color=fff`} alt="Profile" style={{ width: '100%', height: '100%' }} />
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #27272a' }}>
                            <div>
                                <div style={{ fontWeight: '500', color: '#e4e4e7' }}>Store Currency</div>
                                <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Default currency for your products.</div>
                            </div>
                            <select
                                value={settings.currency}
                                onChange={(e) => handleChange('currency', e.target.value)}
                                style={{ background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', padding: '6px 12px', color: '#d946ef', fontWeight: '600', outline: 'none' }}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="JPY">JPY (¥)</option>
                                <option value="BDT">BDT (৳)</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #27272a' }}>
                            <div>
                                <div style={{ fontWeight: '500', color: '#e4e4e7' }}>Timezone</div>
                                <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Your local timezone.</div>
                            </div>
                            <select
                                value={settings.timezone}
                                onChange={(e) => handleChange('timezone', e.target.value)}
                                style={{ background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', padding: '6px 12px', color: '#d946ef', fontWeight: '600', outline: 'none', maxWidth: '100px' }}
                            >
                                <option value="UTC">UTC</option>
                                <option value="EST">EST</option>
                                <option value="PST">PST</option>
                                <option value="GMT">GMT</option>
                                <option value="BST">BST</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: '500', color: '#e4e4e7' }}>Order System</div>
                                <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Accepting new orders.</div>
                            </div>
                            <button
                                onClick={() => toggleSetting('order_system_enabled')}
                                style={{
                                    width: '44px',
                                    height: '24px',
                                    background: settings.order_system_enabled ? 'rgba(16, 185, 129, 0.2)' : '#3f3f46',
                                    borderRadius: '12px',
                                    position: 'relative',
                                    border: `1px solid ${settings.order_system_enabled ? '#10b981' : '#52525b'}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <span style={{
                                    position: 'absolute',
                                    left: settings.order_system_enabled ? '22px' : '2px',
                                    top: '1px',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    background: settings.order_system_enabled ? '#10b981' : '#a1a1aa',
                                    transition: 'all 0.3s'
                                }}></span>
                            </button>
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
                        <button
                            onClick={() => toggleSetting('email_notifications')}
                            style={{ width: '36px', height: '20px', background: settings.email_notifications ? '#d946ef' : '#3f3f46', borderRadius: '12px', position: 'relative', cursor: 'pointer', border: 'none' }}
                        >
                            <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', right: settings.email_notifications ? '2px' : 'auto', left: settings.email_notifications ? 'auto' : '2px', top: '2px', transition: 'all 0.3s' }}></div>
                        </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Wallet size={18} color="#a1a1aa" />
                            <div>
                                <div style={{ color: '#e4e4e7', fontSize: '14px' }}>Payment Alerts</div>
                                <div style={{ color: '#71717a', fontSize: '12px' }}>Notify on high-value transactions</div>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleSetting('payment_alerts')}
                            style={{ width: '36px', height: '20px', background: settings.payment_alerts ? '#d946ef' : '#3f3f46', borderRadius: '12px', position: 'relative', cursor: 'pointer', border: 'none' }}
                        >
                            <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', right: settings.payment_alerts ? '2px' : 'auto', left: settings.payment_alerts ? 'auto' : '2px', top: '2px', transition: 'all 0.3s' }}></div>
                        </button>
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
