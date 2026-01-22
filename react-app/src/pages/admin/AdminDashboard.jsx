import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../supabaseClient';

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                // Fetch Total Products count
                const { count: productCount } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true });

                // Fetch Orders for metrics and recent activity
                const { data: orders, error: ordersError } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (ordersError) throw ordersError;

                const revenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

                setMetrics({
                    totalProducts: productCount || 0,
                    totalOrders: orders.length,
                    totalRevenue: revenue.toFixed(2),
                    recentOrders: orders.slice(0, 5) // Last 5 orders
                });
            } catch (err) {
                console.error('Error fetching metrics:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <AdminLayout>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ color: '#ebcfb9', margin: 0 }}>Overview</h1>
                <p style={{ color: '#666', marginTop: '10px' }}>Welcome back! Here is what's happening with your store today.</p>
            </div>

            {loading ? (
                <div style={{ color: '#666', padding: '40px' }}>Updating metrics...</div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
                            <h3 style={{ color: '#888', marginBottom: '10px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Products</h3>
                            <p style={{ fontSize: '32px', fontWeight: '700', margin: 0, color: '#fff' }}>{metrics.totalProducts}</p>
                        </div>
                        <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
                            <h3 style={{ color: '#888', marginBottom: '10px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Orders</h3>
                            <p style={{ fontSize: '32px', fontWeight: '700', margin: 0, color: '#fff' }}>{metrics.totalOrders}</p>
                        </div>
                        <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
                            <h3 style={{ color: '#888', marginBottom: '10px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Revenue</h3>
                            <p style={{ fontSize: '32px', fontWeight: '700', margin: 0, color: '#ebcfb9' }}>$ {metrics.totalRevenue}</p>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', background: '#1a1a1a', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
                        <h3 style={{ color: '#ebcfb9', marginBottom: '20px' }}>Recent Orders</h3>
                        {metrics.recentOrders.length === 0 ? (
                            <div style={{ color: '#666', textAlign: 'center', padding: '60px 0' }}>
                                <p style={{ margin: 0 }}>No recent orders to show.</p>
                                <small>Once customers start buying, their activity will appear here.</small>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #222' }}>
                                            <th style={{ padding: '15px 10px', color: '#888', fontWeight: '500' }}>Customer</th>
                                            <th style={{ padding: '15px 10px', color: '#888', fontWeight: '500' }}>Date</th>
                                            <th style={{ padding: '15px 10px', color: '#888', fontWeight: '500' }}>Amount</th>
                                            <th style={{ padding: '15px 10px', color: '#888', fontWeight: '500' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {metrics.recentOrders.map(order => (
                                            <tr key={order.id} style={{ borderBottom: '1px solid #111' }}>
                                                <td style={{ padding: '15px 10px', color: '#fff' }}>{order.customer_name}</td>
                                                <td style={{ padding: '15px 10px', color: '#666' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td style={{ padding: '15px 10px', color: '#ebcfb9' }}>$ {order.total_amount}</td>
                                                <td style={{ padding: '15px 10px' }}>
                                                    <span style={{
                                                        fontSize: '11px',
                                                        textTransform: 'uppercase',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        border: '1px solid #333',
                                                        color: order.status === 'pending' ? '#ffaa00' : '#888'
                                                    }}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;
