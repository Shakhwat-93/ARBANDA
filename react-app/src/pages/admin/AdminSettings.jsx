import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useCurrency } from '../../context/CurrencyContext';
import { Settings, AlertTriangle, Save, CheckCircle } from 'lucide-react';

const AdminSettings = () => {
    const { currency, updateStoreCurrency } = useCurrency();
    const [selectedCurrency, setSelectedCurrency] = useState(currency || 'BDT');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.target.value);
    };

    const handleSaveClick = () => {
        if (selectedCurrency !== currency) {
            setShowConfirmModal(true);
        }
    };

    const confirmUpdate = async () => {
        setIsSaving(true);
        const success = await updateStoreCurrency(selectedCurrency);
        setIsSaving(false);
        if (success) {
            setShowConfirmModal(false);
        }
    };

    const cancelUpdate = () => {
        setShowConfirmModal(false);
        setSelectedCurrency(currency); // Revert
    };

    return (
        <div style={{ display: 'flex', background: '#09090b', minHeight: '100vh', color: '#fff' }}>
            <AdminSidebar />
            <div style={{ flex: 1, marginLeft: '260px', padding: '40px' }}>

                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Global Settings</h1>
                    <p style={{ color: '#a1a1aa' }}>Manage store-wide configurations and preferences.</p>
                </div>

                {/* Store Configuration Card */}
                <div style={{
                    background: '#18181b',
                    borderRadius: '16px',
                    border: '1px solid #27272a',
                    padding: '24px',
                    maxWidth: '800px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{
                            background: 'rgba(168, 85, 247, 0.1)',
                            padding: '10px',
                            borderRadius: '12px',
                            color: '#a855f7'
                        }}>
                            <Settings size={24} />
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Store Configuration</h2>
                    </div>

                    {/* Currency Setting */}
                    <div style={{
                        borderTop: '1px solid #27272a',
                        paddingTop: '24px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px'
                    }}>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Store Currency</h3>
                            <p style={{ color: '#71717a', fontSize: '14px', lineHeight: '1.5' }}>
                                This is the default currency for all your products.
                                <br /> Changing this will affect prices across the entire website immediately.
                            </p>
                        </div>

                        <div>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={selectedCurrency}
                                    onChange={handleCurrencyChange}
                                    style={{
                                        width: '100%',
                                        background: '#27272a',
                                        border: '1px solid #3f3f46',
                                        color: '#fff',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        appearance: 'none',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                                    <option value="USD">USD ($) - US Dollar</option>
                                </select>
                                <div style={{
                                    position: 'absolute',
                                    right: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none',
                                    color: '#71717a'
                                }}>
                                    ▼
                                </div>
                            </div>

                            {selectedCurrency !== currency && (
                                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={handleSaveClick}
                                        style={{
                                            background: '#a855f7',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <Save size={16} /> Update Currency
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Other settings placeholders */}
                    <div style={{
                        marginTop: '24px',
                        borderTop: '1px solid #27272a',
                        paddingTop: '24px'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', opacity: 0.5 }}>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Timezone</h3>
                                <p style={{ color: '#71717a', fontSize: '14px' }}>Your local timezone.</p>
                            </div>
                            <div>
                                <input disabled type="text" value="Asia/Dhaka (GMT+6)" style={{
                                    width: '100%',
                                    background: '#27272a',
                                    border: '1px solid #3f3f46',
                                    color: '#a1a1aa',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                }} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* RISKY ALERT MODAL */}
            {showConfirmModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100
                }}>
                    <div style={{
                        background: '#18181b',
                        border: '1px solid #dc2626',
                        borderRadius: '16px',
                        padding: '32px',
                        maxWidth: '480px',
                        width: '100%',
                        boxShadow: '0 25px 50px rgba(220, 38, 38, 0.25)',
                        animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'rgba(220, 38, 38, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#dc2626',
                            marginBottom: '16px'
                        }}>
                            <AlertTriangle size={24} />
                        </div>

                        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#fff' }}>
                            Wait! This is a risky change.
                        </h3>

                        <p style={{ color: '#a1a1aa', lineHeight: '1.6', marginBottom: '24px' }}>
                            You are about to change the entire store's currency from
                            <strong style={{ color: '#fff', margin: '0 4px' }}>{currency}</strong>
                            to
                            <strong style={{ color: '#fff', margin: '0 4px' }}>{selectedCurrency}</strong>.
                            <br /><br />
                            1. All product prices will be recalculated immediately.
                            <br />
                            2. Active carts might show mismatched values.
                            <br />
                            3. Customers currently browsing might see price jumps.
                        </p>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={cancelUpdate}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #3f3f46',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmUpdate}
                                disabled={isSaving}
                                style={{
                                    background: '#dc2626',
                                    border: 'none',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    opacity: isSaving ? 0.7 : 1
                                }}
                            >
                                {isSaving ? 'Applying...' : 'Yes, Change Currency'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;
