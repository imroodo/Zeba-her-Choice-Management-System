import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Customer } from '../types';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      // Convert database fields to match our TypeScript interface
      const convertedData: Customer[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        phone: item.phone || '',
        address: item.address || '',
        notes: item.notes || '',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      setCustomers(convertedData);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = useCallback(async (
    customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const newCustomer = {
      ...customer,
      created_at: now,
      updated_at: now,
    };

    const { data, error: supabaseError } = await supabase
      .from('customers')
      .insert([newCustomer])
      .select()
      .single();

    if (supabaseError) {
      console.error('Error adding customer:', supabaseError);
      throw supabaseError;
    }

    const convertedCustomer: Customer = {
      id: data.id,
      name: data.name,
      phone: data.phone || '',
      address: data.address || '',
      notes: data.notes || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    setCustomers(prev => [convertedCustomer, ...prev]);
    return convertedCustomer;
  }, []);

  const updateCustomer = useCallback(async (id: string, updates: Partial<Customer>) => {
    const updateData: Record<string, any> = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.address !== undefined) updateData.address = updates.address;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    updateData.updated_at = new Date().toISOString();

    const { data, error: supabaseError } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (supabaseError) {
      console.error('Error updating customer:', supabaseError);
      throw supabaseError;
    }

    const convertedCustomer: Customer = {
      id: data.id,
      name: data.name,
      phone: data.phone || '',
      address: data.address || '',
      notes: data.notes || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    setCustomers(prev => prev.map(c => c.id === id ? convertedCustomer : c));
    return convertedCustomer;
  }, []);

  const deleteCustomer = useCallback(async (id: string) => {
    const { error: supabaseError } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (supabaseError) {
      console.error('Error deleting customer:', supabaseError);
      throw supabaseError;
    }

    setCustomers(prev => prev.filter(c => c.id !== id));
  }, []);

  const getCustomer = useCallback((id: string) => {
    return customers.find(c => c.id === id);
  }, [customers]);

  return {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
    refresh: fetchCustomers,
  };
}
