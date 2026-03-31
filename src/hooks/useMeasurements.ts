import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Measurement } from '../types';

export function useMeasurements(customerId?: string) {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all measurements on mount
  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('measurements')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      // Convert database fields to match our TypeScript interface
      const convertedData: Measurement[] = (data || []).map(item => ({
        id: item.id,
        customerId: item.customer_id,
        dressType: item.dress_type,
        length: item.length || 0,
        shoulder: item.shoulder || 0,
        sleeveLength: item.sleeve_length || 0,
        sleeveLoose: item.sleeve_loose || 0,
        armHole: item.arm_hole || 0,
        chest: item.chest || 0,
        waist: item.waist || 0,
        hip: item.hip || 0,
        frontNeck: item.front_neck || 0,
        backNeck: item.back_neck || 0,
        bottom: item.bottom || 0,
        bottomHip: item.bottom_hip || 0,
        createdAt: item.created_at,
      }));

      setMeasurements(convertedData);
    } catch (err) {
      console.error('Error fetching measurements:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch measurements');
    } finally {
      setLoading(false);
    }
  };

  // Filter measurements by customerId if provided
  const filteredMeasurements = customerId
    ? measurements.filter(m => m.customerId === customerId)
    : measurements;

  const addMeasurement = useCallback(async (
    customerId: string,
    measurement: Omit<Measurement, 'id' | 'customerId' | 'createdAt'>
  ) => {
    const now = new Date().toISOString();

    const insertData = {
      customer_id: customerId,
      dress_type: measurement.dressType,
      length: measurement.length,
      shoulder: measurement.shoulder,
      sleeve_length: measurement.sleeveLength,
      sleeve_loose: measurement.sleeveLoose,
      arm_hole: measurement.armHole,
      chest: measurement.chest,
      waist: measurement.waist,
      hip: measurement.hip,
      front_neck: measurement.frontNeck,
      back_neck: measurement.backNeck,
      bottom: measurement.bottom,
      bottom_hip: measurement.bottomHip,
      created_at: now,
    };

    const { data, error: supabaseError } = await supabase
      .from('measurements')
      .insert([insertData])
      .select()
      .single();

    if (supabaseError) {
      console.error('Error adding measurement:', supabaseError);
      throw supabaseError;
    }

    const convertedMeasurement: Measurement = {
      id: data.id,
      customerId: data.customer_id,
      dressType: data.dress_type,
      length: data.length || 0,
      shoulder: data.shoulder || 0,
      sleeveLength: data.sleeve_length || 0,
      sleeveLoose: data.sleeve_loose || 0,
      armHole: data.arm_hole || 0,
      chest: data.chest || 0,
      waist: data.waist || 0,
      hip: data.hip || 0,
      frontNeck: data.front_neck || 0,
      backNeck: data.back_neck || 0,
      bottom: data.bottom || 0,
      bottomHip: data.bottom_hip || 0,
      createdAt: data.created_at,
    };

    setMeasurements(prev => [convertedMeasurement, ...prev]);
    return convertedMeasurement;
  }, []);

  const updateMeasurement = useCallback(async (id: string, updates: Partial<Measurement>) => {
    const updateData: Record<string, any> = {};

    if (updates.dressType !== undefined) updateData.dress_type = updates.dressType;
    if (updates.length !== undefined) updateData.length = updates.length;
    if (updates.shoulder !== undefined) updateData.shoulder = updates.shoulder;
    if (updates.sleeveLength !== undefined) updateData.sleeve_length = updates.sleeveLength;
    if (updates.sleeveLoose !== undefined) updateData.sleeve_loose = updates.sleeveLoose;
    if (updates.armHole !== undefined) updateData.arm_hole = updates.armHole;
    if (updates.chest !== undefined) updateData.chest = updates.chest;
    if (updates.waist !== undefined) updateData.waist = updates.waist;
    if (updates.hip !== undefined) updateData.hip = updates.hip;
    if (updates.frontNeck !== undefined) updateData.front_neck = updates.frontNeck;
    if (updates.backNeck !== undefined) updateData.back_neck = updates.backNeck;
    if (updates.bottom !== undefined) updateData.bottom = updates.bottom;
    if (updates.bottomHip !== undefined) updateData.bottom_hip = updates.bottomHip;

    const { data, error: supabaseError } = await supabase
      .from('measurements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (supabaseError) {
      console.error('Error updating measurement:', supabaseError);
      throw supabaseError;
    }

    const convertedMeasurement: Measurement = {
      id: data.id,
      customerId: data.customer_id,
      dressType: data.dress_type,
      length: data.length || 0,
      shoulder: data.shoulder || 0,
      sleeveLength: data.sleeve_length || 0,
      sleeveLoose: data.sleeve_loose || 0,
      armHole: data.arm_hole || 0,
      chest: data.chest || 0,
      waist: data.waist || 0,
      hip: data.hip || 0,
      frontNeck: data.front_neck || 0,
      backNeck: data.back_neck || 0,
      bottom: data.bottom || 0,
      bottomHip: data.bottom_hip || 0,
      createdAt: data.created_at,
    };

    setMeasurements(prev => prev.map(m => m.id === id ? convertedMeasurement : m));
    return convertedMeasurement;
  }, []);

  const deleteMeasurement = useCallback(async (id: string) => {
    const { error: supabaseError } = await supabase
      .from('measurements')
      .delete()
      .eq('id', id);

    if (supabaseError) {
      console.error('Error deleting measurement:', supabaseError);
      throw supabaseError;
    }

    setMeasurements(prev => prev.filter(m => m.id !== id));
  }, []);

  const getMeasurement = useCallback((id: string) => {
    return measurements.find(m => m.id === id);
  }, [measurements]);

  const getMeasurementsByCustomer = useCallback((customerId: string) => {
    return measurements.filter(m => m.customerId === customerId);
  }, [measurements]);

  return {
    measurements: filteredMeasurements,
    allMeasurements: measurements,
    loading,
    error,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    getMeasurement,
    getMeasurementsByCustomer,
    refresh: fetchMeasurements,
  };
}
