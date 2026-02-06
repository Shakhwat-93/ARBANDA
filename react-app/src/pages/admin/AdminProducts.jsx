import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import AddProductModal from '../../components/admin/AddProductModal';
import EditProductModal from '../../components/admin/EditProductModal';
import { supabase } from '../../supabaseClient';
import { Search, Plus, Edit, Trash2, MoreHorizontal, Filter } from 'lucide-react';
import PremiumLoader from '../../components/common/PremiumLoader';

const AdminProducts = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setProducts(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();

        const channel = supabase
            .channel('admin-products-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                () => { fetchProducts(); }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const { error } = await supabase.from('products').delete().eq('id', id);
                if (error) throw error;
                fetchProducts();
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        }
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    // Filter products
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            {/* Header Section */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '16px', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Products</h1>
                    <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px' }}>Manage your product catalog.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)',
                        width: isMobile ? '100%' : 'auto',
                        justifyContent: 'center'
                    }}
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Controls Bar */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? '100%' : '400px' }}>
                    <Search size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search products..."
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
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* Product List */}
            {isMobile ? (
                // Mobile Card View
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {loading ? (
                        <PremiumLoader text="Loading products..." />
                    ) : filteredProducts.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#71717a' }}>No products found.</div>
                    ) : (
                        filteredProducts.map(product => (
                            <div key={product.id} style={{ background: '#18181b', borderRadius: '12px', padding: '16px', border: '1px solid #27272a' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#fff', fontSize: '16px' }}>{product.name}</div>
                                        <div style={{ fontSize: '12px', color: '#71717a', marginTop: '2px' }}>ID: #{product.id.substring(0, 6)}</div>
                                    </div>
                                    <span style={{ background: '#27272a', color: '#e4e4e7', padding: '4px 8px', borderRadius: '8px', fontSize: '11px' }}>
                                        {product.category}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #27272a' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Price</div>
                                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#e4e4e7' }}>${product.price}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Stock</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: product.stock > 10 ? '#10b981' : product.stock > 0 ? '#f59e0b' : '#ef4444' }}></div>
                                            <span style={{ color: product.stock > 0 ? '#e4e4e7' : '#ef4444', fontSize: '14px' }}>{product.stock}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => handleEditClick(product)}
                                        style={{ flex: 1, padding: '10px', background: '#27272a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        style={{ flex: 1, padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <Trash2 size={14} /> Delete
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
                                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Product Name</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Category</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Price</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1aa', fontWeight: '500' }}>Stock</th>
                                <th style={{ padding: '16px', textAlign: 'right', color: '#a1a1aa', fontWeight: '500' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5"><PremiumLoader text="Loading..." /></td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#71717a' }}>No products found matching your search.</td></tr>
                            ) : (
                                filteredProducts.map(product => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid #27272a', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#27272a'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontWeight: '500', color: '#fff' }}>{product.name}</div>
                                            <div style={{ fontSize: '12px', color: '#71717a' }}>ID: #{product.id.substring(0, 6)}</div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ background: '#27272a', color: '#e4e4e7', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', color: '#e4e4e7', fontWeight: '500' }}>${product.price}</td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: product.stock > 10 ? '#10b981' : product.stock > 0 ? '#f59e0b' : '#ef4444' }}></div>
                                                <span style={{ color: product.stock > 0 ? '#e4e4e7' : '#ef4444' }}>{product.stock} in stock</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    style={{ background: 'transparent', border: '1px solid #3f3f46', borderRadius: '6px', padding: '6px', color: '#a1a1aa', cursor: 'pointer', transition: 'all 0.2s' }}
                                                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#d946ef'; e.currentTarget.style.color = '#d946ef'; }}
                                                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#3f3f46'; e.currentTarget.style.color = '#a1a1aa'; }}
                                                    title="Edit"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    style={{ background: 'transparent', border: '1px solid #3f3f46', borderRadius: '6px', padding: '6px', color: '#a1a1aa', cursor: 'pointer', transition: 'all 0.2s' }}
                                                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
                                                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#3f3f46'; e.currentTarget.style.color = '#a1a1aa'; }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onProductAdded={fetchProducts}
            />

            <EditProductModal
                isOpen={isEditModalOpen}
                product={selectedProduct}
                onClose={() => setIsEditModalOpen(false)}
                onProductUpdated={fetchProducts}
            />
        </AdminLayout>
    );
};

export default AdminProducts;
