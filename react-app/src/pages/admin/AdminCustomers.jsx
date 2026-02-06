import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../supabaseClient';
import { Search, Filter, Ban, CheckCircle, MoreHorizontal, UserX, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import PremiumLoader from '../../components/common/PremiumLoader';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, active, banned

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setCustomers(data || []);
        } catch (err) {
            console.error('Error fetching customers:', err.message);
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const toggleBanStatus = async (customerId, currentStatus) => {
        const newStatus = !currentStatus;
        const action = newStatus ? 'Ban' : 'Unban';

        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_banned: newStatus })
                .eq('id', customerId);

            if (error) throw error;

            toast.success(`User ${newStatus ? 'banned' : 'unbanned'} successfully`);
            fetchCustomers(); // Refresh list
        } catch (err) {
            console.error(`Error ${action}ing user:`, err.message);
            toast.error(`Failed to ${action} user`);
        }
    };

    // Filter Logic
    const filteredCustomers = customers.filter(customer => {
        const matchesSearch =
            (customer.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (customer.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus === 'all' ? true :
                filterStatus === 'banned' ? customer.is_banned :
                    !customer.is_banned; // active

        return matchesSearch && matchesFilter;
    });

    return (
        <AdminLayout>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '16px', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Customers</h1>
                    <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px' }}>Manage user access and profiles.</p>
                </div>
                {!isMobile && (
                    <div style={{ background: '#18181b', padding: '8px 16px', borderRadius: '8px', border: '1px solid #27272a', display: 'flex', gap: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Total Customers: <span style={{ color: '#fff', fontWeight: 'bold' }}>{customers.length}</span></div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? '100%' : '400px' }}>
                    <Search size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            background: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '8px',
                            padding: '10px 10px 10px 40px',
                            color: '#e4e4e7',
                            fontSize: '13px',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', background: '#18181b', borderRadius: '8px', border: '1px solid #27272a', overflow: 'hidden', alignSelf: isMobile ? 'flex-start' : 'auto' }}>
                    <button
                        onClick={() => setFilterStatus('all')}
                        style={{ padding: '10px 16px', background: filterStatus === 'all' ? '#27272a' : 'transparent', color: filterStatus === 'all' ? '#fff' : '#a1a1aa', border: 'none', cursor: 'pointer', fontSize: '13px', flex: 1 }}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterStatus('active')}
                        style={{ padding: '10px 16px', background: filterStatus === 'active' ? '#27272a' : 'transparent', color: filterStatus === 'active' ? '#10b981' : '#a1a1aa', border: 'none', cursor: 'pointer', fontSize: '13px', flex: 1 }}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilterStatus('banned')}
                        style={{ padding: '10px 16px', background: filterStatus === 'banned' ? '#27272a' : 'transparent', color: filterStatus === 'banned' ? '#ef4444' : '#a1a1aa', border: 'none', cursor: 'pointer', fontSize: '13px', flex: 1 }}
                    >
                        Banned
                    </button>
                </div>
            </div>

            {/* Customer List */}
            {isMobile ? (
                // Mobile Card View
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {loading ? (
                        <PremiumLoader text="Loading customers..." />
                    ) : filteredCustomers.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#71717a' }}>No customers found.</div>
                    ) : (
                        filteredCustomers.map((customer) => (
                            <div key={customer.id} style={{ background: '#18181b', borderRadius: '12px', padding: '16px', border: '1px solid #27272a' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #27272a' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                                        {customer.full_name ? customer.full_name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', color: '#fff' }}>{customer.full_name || 'Unknown User'}</div>
                                        <div style={{ fontSize: '13px', color: '#a1a1aa', wordBreak: 'break-all' }}>{customer.email || 'N/A'}</div>
                                    </div>
                                    {customer.is_banned ? (
                                        <div style={{ color: '#ef4444' }}><Ban size={18} /></div>
                                    ) : (
                                        <div style={{ color: '#10b981' }}><CheckCircle size={18} /></div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '12px', color: '#71717a' }}>
                                        Joined: {new Date(customer.updated_at || Date.now()).toLocaleDateString()}
                                    </div>
                                    <button
                                        onClick={() => toggleBanStatus(customer.id, customer.is_banned)}
                                        style={{
                                            padding: '8px 12px',
                                            background: customer.is_banned ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            border: `1px solid ${customer.is_banned ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                            borderRadius: '8px',
                                            color: customer.is_banned ? '#10b981' : '#ef4444',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        {customer.is_banned ? 'Unban User' : 'Ban User'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                // Desktop Table View
                <div style={{ background: '#18181b', borderRadius: '16px', border: '1px solid #27272a', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #27272a', background: 'rgba(39, 39, 42, 0.5)' }}>
                                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Customer</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Email</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Status</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Joined</th>
                                <th style={{ padding: '16px', textAlign: 'right', color: '#a1a1aa', fontWeight: '500' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5"><PremiumLoader text="Loading customers..." /></td></tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#71717a' }}>No customers found.</td></tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} style={{ borderBottom: '1px solid #27272a', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#27272a'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '12px' }}>
                                                    {customer.full_name ? customer.full_name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '500', color: '#fff' }}>{customer.full_name || 'Unknown User'}</div>
                                                    <div style={{ fontSize: '12px', color: '#71717a' }}>ID: {customer.id.substring(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: '#d1d5db' }}>
                                            {customer.email || 'N/A'}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            {customer.is_banned ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                                    <Ban size={12} /> Banned
                                                </span>
                                            ) : (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                                    <CheckCircle size={12} /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px', color: '#d1d5db' }}>
                                            {new Date(customer.updated_at || Date.now()).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => toggleBanStatus(customer.id, customer.is_banned)}
                                                style={{
                                                    background: 'transparent',
                                                    border: '1px solid #3f3f46',
                                                    borderRadius: '6px',
                                                    padding: '6px 12px',
                                                    color: customer.is_banned ? '#10b981' : '#ef4444',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: '500'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.borderColor = customer.is_banned ? '#10b981' : '#ef4444';
                                                    e.currentTarget.style.background = customer.is_banned ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.borderColor = '#3f3f46';
                                                    e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                {customer.is_banned ? <><UserCheck size={14} /> Unban User</> : <><UserX size={14} /> Ban User</>}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCustomers;
