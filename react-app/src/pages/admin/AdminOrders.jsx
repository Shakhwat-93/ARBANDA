import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../supabaseClient';
import { Search, Filter, Eye, X, RefreshCw } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        const channel = supabase
            .channel('admin-orders-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                () => { fetchOrders(); }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;
            fetchOrders();
        } catch (err) {
            alert('Error updating status: ' + err.message);
        }
    };

    const fetchOrderItems = async (order) => {
        try {
            const { data, error } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', order.id);

            if (error) throw error;
            setSelectedOrder({ ...order, items: data });
        } catch (err) {
            alert('Error fetching order items: ' + err.message);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' }; // Amber
            case 'processing': return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' }; // Blue
            case 'shipped': return { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' }; // Purple
            case 'delivered': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' }; // Green
            case 'cancelled': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' }; // Red
            default: return { bg: 'rgba(113, 113, 122, 0.15)', color: '#a1a1aa', border: 'rgba(113, 113, 122, 0.3)' };
        }
    };

    // Filter orders
    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminLayout>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '16px', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Orders</h1>
                    <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px' }}>Monitor and manage customer purchases.</p>
                </div>
                <button onClick={fetchOrders} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '13px', cursor: 'pointer', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            {/* Controls Bar */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? '100%' : '400px' }}>
                    <Search size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search orders..."
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
                <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#e4e4e7', fontSize: '13px', cursor: 'pointer' }}>
                    <Filter size={16} /> Filter
                </button>
            </div>

            {/* Orders List */}
            {isMobile ? (
                // Mobile Card View
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#71717a' }}>Loading orders...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#71717a' }}>No orders found.</div>
                    ) : (
                        filteredOrders.map((order) => {
                            const statusStyle = getStatusStyle(order.status);
                            return (
                                <div key={order.id} style={{ background: '#18181b', borderRadius: '12px', padding: '16px', border: '1px solid #27272a' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #27272a' }}>
                                        <div>
                                            <div style={{ fontFamily: 'monospace', color: '#a1a1aa', fontSize: '12px' }}>#{order.id.substring(0, 8)}</div>
                                            <div style={{ color: '#fff', fontWeight: '500', marginTop: '4px' }}>{order.customer_name || 'Guest'}</div>
                                            <div style={{ fontSize: '11px', color: '#71717a' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: '500',
                                            background: statusStyle.bg,
                                            color: statusStyle.color,
                                            border: `1px solid ${statusStyle.border}`
                                        }}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Total</div>
                                            <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>$ {order.total_amount}</div>
                                        </div>
                                        <button
                                            onClick={() => fetchOrderItems(order)}
                                            style={{ background: '#27272a', border: 'none', padding: '8px 16px', borderRadius: '8px', color: '#e4e4e7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                                        >
                                            <Eye size={14} /> View Details
                                        </button>
                                    </div>

                                    <div>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            style={{ width: '100%', background: '#18181b', color: '#d1d5db', border: '1px solid #3f3f46', padding: '10px', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            ) : (
                // Desktop Table View
                <div style={{ background: '#18181b', borderRadius: '16px', border: '1px solid #27272a', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #27272a', background: 'rgba(39, 39, 42, 0.5)' }}>
                                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Order ID</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Customer</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Date</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Total</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Status</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#71717a' }}>Loading orders...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#71717a' }}>No orders found.</td></tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const statusStyle = getStatusStyle(order.status);
                                    return (
                                        <tr key={order.id} style={{ borderBottom: '1px solid #27272a', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#27272a'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '16px 24px', color: '#a1a1aa', fontFamily: 'monospace' }}>#{order.id.substring(0, 8)}</td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ color: '#fff', fontWeight: '500' }}>{order.customer_name || 'Guest'}</div>
                                                <div style={{ fontSize: '12px', color: '#71717a' }}>{order.customer_email}</div>
                                            </td>
                                            <td style={{ padding: '16px', color: '#a1a1aa' }}>
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '16px', color: '#fff', fontWeight: '600' }}>
                                                $ {order.total_amount}
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    background: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    border: `1px solid ${statusStyle.border}`
                                                }}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <button
                                                        onClick={() => fetchOrderItems(order)}
                                                        style={{ background: '#27272a', border: 'none', padding: '6px 12px', borderRadius: '6px', color: '#e4e4e7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                                                    >
                                                        <Eye size={14} /> View
                                                    </button>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                                        style={{ background: '#18181b', color: '#d1d5db', border: '1px solid #3f3f46', padding: '5px 8px', borderRadius: '6px', fontSize: '12px', outline: 'none' }}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: isMobile ? '16px' : '0' }}>
                    <div style={{ background: '#18181b', width: isMobile ? '100%' : '90%', maxWidth: '700px', borderRadius: '16px', padding: isMobile ? '20px' : '32px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #27272a', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #27272a' }}>
                            <div>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Order Details</h2>
                                <p style={{ color: '#a1a1aa', fontSize: '14px', margin: '4px 0 0 0' }}>ID: #{selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                            <div style={{ background: '#27272a', padding: '20px', borderRadius: '12px' }}>
                                <h4 style={{ color: '#a1a1aa', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em', marginBottom: '12px' }}>Customer Info</h4>
                                <div style={{ color: '#fff', fontWeight: '500' }}>{selectedOrder.customer_name}</div>
                                <div style={{ color: '#d1d5db', fontSize: '13px' }}>{selectedOrder.customer_email}</div>
                                <div style={{ color: '#d1d5db', fontSize: '13px', marginTop: '4px' }}>{selectedOrder.customer_phone || 'No phone'}</div>
                            </div>
                            <div style={{ background: '#27272a', padding: '20px', borderRadius: '12px' }}>
                                <h4 style={{ color: '#a1a1aa', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em', marginBottom: '12px' }}>Shipping Address</h4>
                                <p style={{ color: '#d1d5db', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{selectedOrder.shipping_address}</p>
                            </div>
                        </div>

                        <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Items</h4>
                        <div style={{ marginBottom: '32px', border: '1px solid #27272a', borderRadius: '12px', overflow: 'hidden' }}>
                            {selectedOrder.items?.map((item, index) => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: index !== selectedOrder.items.length - 1 ? '1px solid #27272a' : 'none', background: '#1c1c1f' }}>
                                    <div>
                                        <div style={{ color: '#fff', fontWeight: '500' }}>{item.product_name}</div>
                                        <div style={{ color: '#71717a', fontSize: '13px', marginTop: '2px' }}>Qty: {item.quantity} × ${item.unit_price}</div>
                                    </div>
                                    <div style={{ color: '#fff', fontWeight: '600' }}>${item.total_price}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #27272a' }}>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ color: '#a1a1aa', fontSize: '14px', marginRight: '12px' }}>Total Amount</span>
                                <span style={{ color: '#fff', fontWeight: '700', fontSize: '24px' }}>${selectedOrder.total_amount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminOrders;
