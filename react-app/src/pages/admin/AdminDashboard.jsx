import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../supabaseClient';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingBag,
    Users,
    CreditCard,
    MoreHorizontal,
    Download,
    RefreshCw,
    Filter
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import PremiumLoader from '../../components/common/PremiumLoader';

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth < 1024);
        };
        handleResize(); // Set initial
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mock Data for Charts
    const chartData = [
        { name: 'Jan', revenue: 4000, target: 2400 },
        { name: 'Feb', revenue: 3000, target: 1398 },
        { name: 'Mar', revenue: 2000, target: 9800 },
        { name: 'Apr', revenue: 2780, target: 3908 },
        { name: 'May', revenue: 1890, target: 4800 },
        { name: 'Jun', revenue: 2390, target: 3800 },
        { name: 'Jul', revenue: 3490, target: 4300 },
    ];

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                // Fetch Total Products
                const { count: productCount } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true });

                // Fetch Orders
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
                    recentOrders: orders.slice(0, 5)
                });
            } catch (err) {
                console.error('Error fetching metrics:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    // Reusable Stat Card Component
    const StatCard = ({ title, value, change, isPositive, icon: Icon, gradient, color = '#fff' }) => (
        <div style={{
            background: gradient ? gradient : '#18181b', // Gradient or Solid Dark
            borderRadius: '16px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #27272a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '160px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    width: '40px', height: '40px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: color
                }}>
                    <Icon size={20} />
                </div>
                <MoreHorizontal size={20} color="#71717a" style={{ cursor: 'pointer' }} />
            </div>

            <div>
                <p style={{ color: gradient ? 'rgba(255,255,255,0.8)' : '#a1a1aa', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>{title}</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                    <h3 style={{ fontSize: '28px', fontWeight: '700', margin: 0, color: '#fff' }}>{value}</h3>
                    {change && (
                        <span style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            background: isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: isPositive ? '#34d399' : '#f87171',
                            padding: '2px 8px',
                            borderRadius: '20px',
                            marginBottom: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                        }}>
                            {isPositive ? '+' : ''}{change}%
                        </span>
                    )}
                </div>
                {change && <p style={{ fontSize: '11px', color: gradient ? 'rgba(255,255,255,0.6)' : '#52525b', marginTop: '4px' }}>Compared to last month</p>}
            </div>
        </div>
    );

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ height: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PremiumLoader text="Loading Dashboard..." />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>

            <div style={{ marginBottom: '32px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Hi, Boss! 👋</h1>
                    <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px' }}>Let's schedule your projects.</p>
                </div>
                {!isMobile && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
                            <RefreshCw size={14} />
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#ec4899', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                            <Download size={14} /> Share Report
                        </button>
                    </div>
                )}
            </div>

            {/* Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <StatCard
                    title="Revenue"
                    value={`$${metrics.totalRevenue}`}
                    change="12.95"
                    isPositive={true}
                    icon={DollarSign}
                    gradient="linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)" // Purple Gradient
                    color="#fff"
                />
                <StatCard
                    title="Orders"
                    value={metrics.totalOrders}
                    change="8.12"
                    isPositive={true}
                    icon={ShoppingBag}
                    color="#f59e0b" // Amber
                />
                <StatCard
                    title="Products"
                    value={metrics.totalProducts}
                    change="5.18"
                    isPositive={false}
                    icon={CreditCard}
                    color="#3b82f6" // Blue
                />
                <StatCard
                    title="Conversion"
                    value="2.4%"
                    change="1.2"
                    isPositive={true}
                    icon={TrendingUp}
                    color="#10b981" // Green
                />
            </div>

            {/* Analytics Section */}
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
                {/* Main Chart */}
                <div style={{ background: '#18181b', borderRadius: '16px', padding: '16px', border: '1px solid #27272a', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Revenue Analytics</h3>
                        {!isMobile && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#a1a1aa' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></span> Revenue
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#a1a1aa' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span> Target
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={{ height: '300px', width: '100%', minWidth: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                <Area type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorTarget)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders by Country (Placeholder stats) */}
                <div style={{ background: '#18181b', borderRadius: '16px', padding: '24px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Orders by Region</h3>
                        <MoreHorizontal size={18} color="#71717a" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { country: 'United States', amount: '85%', color: '#8b5cf6' },
                            { country: 'Japan', amount: '70%', color: '#ec4899' },
                            { country: 'Indonesia', amount: '45%', color: '#f59e0b' },
                            { country: 'South Korea', amount: '38%', color: '#10b981' },
                        ].map((item) => (
                            <div key={item.country}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>
                                    <span>{item.country}</span>
                                    <span>{item.amount}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#27272a', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: item.amount, height: '100%', background: item.color, borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button style={{ width: '100%', padding: '12px', marginTop: '20px', background: 'transparent', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>View Full Report</button>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div style={{ background: '#18181b', borderRadius: '16px', padding: '24px', border: '1px solid #27272a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Transaction History</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#27272a', border: 'none', borderRadius: '6px', color: '#a1a1aa', fontSize: '12px' }}>
                            <Filter size={14} /> Filter
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#27272a', border: 'none', borderRadius: '6px', color: '#a1a1aa', fontSize: '12px' }}>
                            <Download size={14} /> Export
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #27272a' }}>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#71717a', fontWeight: '500' }}>Customer</th>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#71717a', fontWeight: '500' }}>Product</th>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#71717a', fontWeight: '500' }}>Date</th>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#71717a', fontWeight: '500' }}>Amount</th>
                                <th style={{ textAlign: 'left', padding: '16px', color: '#71717a', fontWeight: '500' }}>Status</th>
                                <th style={{ textAlign: 'right', padding: '16px', color: '#71717a', fontWeight: '500' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#52525b' }}>No recent orders found.</td>
                                </tr>
                            ) : (
                                metrics.recentOrders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #27272a', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#27272a'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' }}>
                                                {order.customer_name ? order.customer_name.charAt(0) : 'U'}
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: '500' }}>{order.customer_name || 'Guest User'}</p>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#71717a' }}>{order.customer_email || 'No email'}</p>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: '#a1a1aa' }}>Order #{order.id}</td>
                                        <td style={{ padding: '16px', color: '#a1a1aa' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td style={{ padding: '16px', fontWeight: '600' }}>${order.total_amount}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                background: order.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                color: order.status === 'pending' ? '#f59e0b' : '#10b981',
                                                border: `1px solid ${order.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                            }}>
                                                • {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <button style={{ padding: '6px 12px', background: '#27272a', border: 'nome', borderRadius: '6px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>View</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
