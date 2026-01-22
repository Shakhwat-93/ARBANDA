import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../supabaseClient';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

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

        // Realtime subscription for orders
        const channel = supabase
            .channel('admin-orders-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders'
                },
                () => {
                    fetchOrders();
                }
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

    return (
        <AdminLayout>
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ color: '#ebcfb9', margin: 0 }}>Orders</h1>
                    <p style={{ color: '#666', marginTop: '10px' }}>Monitor and manage your customer purchases.</p>
                </div>
                <button onClick={fetchOrders} style={{ background: '#222', color: '#fff', border: '1px solid #333', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
                    Refresh Orders
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#888' }}>Loading orders...</div>
            ) : orders.length === 0 ? (
                <div style={{ background: '#1a1a1a', padding: '80px', borderRadius: '12px', border: '1px solid #333', textAlign: 'center' }}>
                    <p style={{ color: '#666' }}>No orders have been placed yet.</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
                        <thead>
                            <tr style={{ background: '#222', textAlign: 'left' }}>
                                <th style={{ padding: '20px', color: '#ebcfb9' }}>Order ID</th>
                                <th style={{ padding: '20px', color: '#ebcfb9' }}>Customer</th>
                                <th style={{ padding: '20px', color: '#ebcfb9' }}>Date</th>
                                <th style={{ padding: '20px', color: '#ebcfb9' }}>Total</th>
                                <th style={{ padding: '20px', color: '#ebcfb9' }}>Status</th>
                                <th style={{ padding: '20px', color: '#ebcfb9' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '20px', color: '#888', fontSize: '13px' }}>#{order.id.substring(0, 8)}</td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ color: '#fff', fontWeight: '500' }}>{order.customer_name}</div>
                                            {order.user_id && (
                                                <span title="Registered Customer" style={{ fontSize: '10px', background: '#ebcfb922', color: '#ebcfb9', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ebcfb944' }}>
                                                    👤 CUSTOMER
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ color: '#666', fontSize: '13px' }}>{order.customer_email}</div>
                                    </td>
                                    <td style={{ padding: '20px', color: '#888' }}>
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '20px', color: '#ebcfb9', fontWeight: 'bold' }}>
                                        $ {order.total_amount}
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            background: getStatusColor(order.status) + '22',
                                            color: getStatusColor(order.status),
                                            border: `1px solid ${getStatusColor(order.status)}44`
                                        }}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <button
                                            onClick={() => fetchOrderItems(order)}
                                            style={{ background: '#333', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
                                        >
                                            View Details
                                        </button>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            style={{ background: '#111', color: '#fff', border: '1px solid #444', padding: '5px', borderRadius: '4px' }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#1a1a1a', width: '90%', maxWidth: '800px', borderRadius: '20px', padding: '40px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                            <h2 style={{ color: '#ebcfb9', margin: 0 }}>Order Detail</h2>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                            <div>
                                <h4 style={{ color: '#888', textTransform: 'uppercase', fontSize: '12px', marginBottom: '10px' }}>Customer Info</h4>
                                <div style={{ color: '#fff' }}>{selectedOrder.customer_name}</div>
                                <div style={{ color: '#666' }}>{selectedOrder.customer_email}</div>
                                <div style={{ color: '#666' }}>{selectedOrder.customer_phone || 'No phone provided'}</div>
                            </div>
                            <div>
                                <h4 style={{ color: '#888', textTransform: 'uppercase', fontSize: '12px', marginBottom: '10px' }}>Shipping Address</h4>
                                <p style={{ color: '#ccc', margin: 0 }}>{selectedOrder.shipping_address}</p>
                            </div>
                        </div>

                        <h4 style={{ color: '#888', textTransform: 'uppercase', fontSize: '12px', marginBottom: '20px' }}>Items Ordered</h4>
                        <div style={{ marginBottom: '40px' }}>
                            {selectedOrder.items?.map((item) => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #222' }}>
                                    <div>
                                        <div style={{ color: '#fff' }}>{item.product_name}</div>
                                        <div style={{ color: '#666', fontSize: '13px' }}>Qty: {item.quantity} × $ {item.unit_price}</div>
                                    </div>
                                    <div style={{ color: '#ebcfb9' }}>$ {item.total_price}</div>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px' }}>
                                <div style={{ color: '#fff', fontWeight: 'bold' }}>Total Result</div>
                                <div style={{ color: '#ebcfb9', fontWeight: 'bold', fontSize: '20px' }}>$ {selectedOrder.total_amount}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <button onClick={() => setSelectedOrder(null)} className="button w-button" style={{ flex: 1 }}>Close Window</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminOrders;
