import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import AddProductModal from '../../components/admin/AddProductModal';
import EditProductModal from '../../components/admin/EditProductModal';
import { supabase } from '../../supabaseClient';
import { Search, Plus, Edit, Trash2, MoreHorizontal, Filter } from 'lucide-react';

const AdminProducts = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
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
                        boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)'
                    }}
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Controls Bar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
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
                            outline: 'none'
                        }}
                    />
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#e4e4e7', fontSize: '13px', cursor: 'pointer' }}>
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* Table */}
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
                            <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#71717a' }}>Loading products...</td></tr>
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
