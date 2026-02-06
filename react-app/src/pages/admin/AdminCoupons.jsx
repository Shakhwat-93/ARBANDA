import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../supabaseClient';
import { Plus, Search, Trash2, Tag, Calendar, MoreHorizontal, CheckCircle, XCircle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import PremiumLoader from '../../components/common/PremiumLoader';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New Coupon State
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discount_type: 'percentage', // percentage | fixed
        discount_value: 0,
        min_purchase_amount: 0,
        usage_limit: 100,
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_active: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCoupons(data || []);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            // toast.error('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('coupons')
                .insert([newCoupon]);

            if (error) throw error;

            toast.success('Coupon created successfully');
            setIsModalOpen(false);
            fetchCoupons();
            // Reset form
            setNewCoupon({
                code: '',
                discount_type: 'percentage',
                discount_value: 0,
                min_purchase_amount: 0,
                usage_limit: 100,
                start_date: new Date().toISOString().split('T')[0],
                end_date: '',
                is_active: true
            });
        } catch (error) {
            console.error('Error creating coupon:', error);
            toast.error('Failed to create coupon');
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('coupons')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            toast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'}`);
            fetchCoupons();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const generateCode = () => {
        const code = 'SALE' + Math.floor(1000 + Math.random() * 9000);
        setNewCoupon({ ...newCoupon, code });
    };

    const filteredCoupons = coupons.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ height: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PremiumLoader text="Loading Coupons..." />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Coupons & Discounts</h1>
                        <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px' }}>Manage store promotions and discount codes.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#d946ef', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
                    >
                        <Plus size={18} /> Create Coupon
                    </button>
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search size={18} color="#71717a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search coupons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff', outline: 'none' }}
                    />
                </div>
            </div>

            {/* Coupons List */}
            <div style={{ background: '#18181b', borderRadius: '16px', border: '1px solid #27272a', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #27272a', background: '#202023' }}>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#a1a1aa', fontWeight: '500' }}>Code</th>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#a1a1aa', fontWeight: '500' }}>Discount</th>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#a1a1aa', fontWeight: '500' }}>Usage</th>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#a1a1aa', fontWeight: '500' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#a1a1aa', fontWeight: '500' }}>Expiry</th>
                                <th style={{ textAlign: 'right', padding: '16px', color: '#a1a1aa', fontWeight: '500' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCoupons.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#71717a' }}>No coupons found. Create one to get started!</td>
                                </tr>
                            ) : (
                                filteredCoupons.map((coupon) => (
                                    <tr key={coupon.id} style={{ borderBottom: '1px solid #27272a' }}>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ padding: '6px 10px', background: 'rgba(217, 70, 239, 0.1)', color: '#d946ef', borderRadius: '6px', fontWeight: '600', fontFamily: 'monospace', letterSpacing: '1px' }}>
                                                    {coupon.code}
                                                </div>
                                                <Copy size={14} color="#71717a" style={{ cursor: 'pointer' }} onClick={() => { navigator.clipboard.writeText(coupon.code); toast.success('Copied!'); }} />
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: '500' }}>
                                            {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `$${coupon.discount_value} OFF`}
                                            <div style={{ fontSize: '12px', color: '#71717a' }}>Min: ${coupon.min_purchase_amount}</div>
                                        </td>
                                        <td style={{ padding: '16px', color: '#a1a1aa' }}>
                                            {coupon.usage_count} / {coupon.usage_limit}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                background: coupon.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: coupon.is_active ? '#10b981' : '#ef4444'
                                            }}>
                                                {coupon.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', color: '#a1a1aa' }}>
                                            {coupon.end_date ? new Date(coupon.end_date).toLocaleDateString() : 'No Expiry'}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                                                style={{ padding: '6px 12px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}
                                            >
                                                {coupon.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#18181b', width: '100%', maxWidth: '500px', borderRadius: '16px', border: '1px solid #27272a', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Create New Coupon</h2>
                            <XCircle size={24} color="#71717a" style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(false)} />
                        </div>

                        <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a1a1aa' }}>Coupon Code</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        value={newCoupon.code}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                        placeholder="e.g. SUMMER2025"
                                        required
                                        style={{ flex: 1, padding: '10px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    />
                                    <button type="button" onClick={generateCode} style={{ padding: '10px 16px', background: '#3f3f46', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Generate</button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a1a1aa' }}>Discount Type</label>
                                    <select
                                        value={newCoupon.discount_type}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
                                        style={{ width: '100%', padding: '10px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a1a1aa' }}>Value</label>
                                    <input
                                        type="number"
                                        value={newCoupon.discount_value}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '10px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a1a1aa' }}>Min Purchase ($)</label>
                                    <input
                                        type="number"
                                        value={newCoupon.min_purchase_amount}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, min_purchase_amount: e.target.value })}
                                        style={{ width: '100%', padding: '10px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a1a1aa' }}>Usage Limit</label>
                                    <input
                                        type="number"
                                        value={newCoupon.usage_limit}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, usage_limit: e.target.value })}
                                        style={{ width: '100%', padding: '10px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a1a1aa' }}>Expiry Date (Optional)</label>
                                <input
                                    type="date"
                                    value={newCoupon.end_date}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, end_date: e.target.value })}
                                    style={{ width: '100%', padding: '10px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{ width: '100%', padding: '12px', background: '#d946ef', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '8px' }}
                            >
                                CREATE COUPON
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCoupons;
