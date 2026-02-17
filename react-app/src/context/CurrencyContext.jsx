import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const CurrencyContext = createContext();

export const useCurrency = () => {
    return useContext(CurrencyContext);
};

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('BDT'); // Default to BDT
    const [exchangeRate, setExchangeRate] = useState(120); // 1 USD = 120 BDT (Approx state)
    const [loading, setLoading] = useState(true);

    // Format price Helper
    const formatPrice = (priceInBDT) => {
        if (!priceInBDT) return currency === 'BDT' ? '৳0' : '$0';

        if (currency === 'BDT') {
            return `৳${new Intl.NumberFormat('en-BD').format(priceInBDT)}`;
        } else {
            // Convert to USD
            const priceInUSD = (priceInBDT / exchangeRate).toFixed(2);
            return `$${new Intl.NumberFormat('en-US').format(priceInUSD)}`;
        }
    };

    // Converters for raw numbers
    const convertToUSD = (bdtAmount) => {
        return parseFloat((bdtAmount / exchangeRate).toFixed(2));
    };

    // Fetch Settings from Supabase
    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('store_settings')
                .select('*')
                .eq('setting_key', 'currency')
                .single();

            if (data && data.setting_value) {
                // Remove quotes if json string
                const savedCurrency = data.setting_value.replace(/"/g, '');
                setCurrency(savedCurrency);
            }
        } catch (error) {
            console.log("Using default currency (BDT)");
        } finally {
            setLoading(false);
        }
    };

    // Update Currency (Admin Only)
    const updateStoreCurrency = async (newCurrency) => {
        try {
            const { error } = await supabase
                .from('store_settings')
                .upsert({
                    setting_key: 'currency',
                    setting_value: JSON.stringify(newCurrency)
                }, { onConflict: 'setting_key' });

            if (error) throw error;

            setCurrency(newCurrency);
            toast.success(`Store currency updated to ${newCurrency}`);
            return true;
        } catch (error) {
            console.error('Error updating currency:', error);
            toast.error('Failed to update store currency');
            return false;
        }
    };

    useEffect(() => {
        fetchSettings();

        // Subscribe to changes
        const channel = supabase
            .channel('settings-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'store_settings' },
                (payload) => {
                    if (payload.new && payload.new.setting_key === 'currency') {
                        const newCurr = payload.new.setting_value.replace(/"/g, '');
                        setCurrency(newCurr);
                        toast(`Store currency changed to ${newCurr}`, {
                            icon: '💱',
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            },
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const value = {
        currency,
        exchangeRate,
        formatPrice,
        updateStoreCurrency,
        loading
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};
