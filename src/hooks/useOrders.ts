import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Order, OrderItem } from '../types';
import { calculateOrderSubtotal } from '../utils/helpers';

export function useOrders(customerId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch orders with their items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      // Convert database fields to match our TypeScript interface
      const convertedOrders: Order[] = (ordersData || []).map(order => ({
        id: order.id,
        customerId: order.customer_id,
        items: (order.order_items || []).map((item: any) => ({
          id: item.id,
          type: item.type,
          dressType: item.dress_type || undefined,
          measurementId: item.measurement_id || undefined,
          stitchingCharge: item.stitching_charge || undefined,
          deliveryDate: item.delivery_date || undefined,
          productName: item.product_name || undefined,
          quantity: item.quantity || undefined,
          price: item.price || undefined,
        })),
        subtotal: order.subtotal,
        discount: order.discount || 0,
        total: order.total,
        status: order.status,
        paymentStatus: order.payment_status,
        deliveryDate: order.delivery_date || undefined,
        createdAt: order.created_at,
      }));

      setOrders(convertedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by customerId if provided
  const filteredOrders = customerId
    ? orders.filter(o => o.customerId === customerId)
    : orders;

  const addOrder = useCallback(async (
    customerId: string,
    items: OrderItem[],
    discount: number = 0,
    status: Order['status'] = 'Pending',
    paymentStatus: Order['paymentStatus'] = 'Not Paid',
    deliveryDate?: string
  ) => {
    const now = new Date().toISOString();
    const subtotal = calculateOrderSubtotal(items);
    const total = subtotal - discount;

    // First, create the order
    const orderData = {
      customer_id: customerId,
      subtotal,
      discount,
      total,
      status,
      payment_status: paymentStatus,
      delivery_date: deliveryDate || null,
      created_at: now,
    };

    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // Process items: save manual measurements and prepare order items
    const orderItemsData: any[] = [];
    const measurementInsertPromises: Promise<any>[] = [];

    for (const item of items) {
      let measurementId = item.measurementId || null;

      // If it's a stitching item without a measurementId but with manual measurements, save to measurements table
      if (item.type === 'Stitching' && !measurementId && item.dressType) {
        const hasManualMeasurements =
          item.length || item.shoulder || item.sleeveLength || item.sleeveLoose ||
          item.armHole || item.chest || item.waist || item.hip ||
          item.frontNeck || item.backNeck || item.bottom || item.bottomHip;

        if (hasManualMeasurements) {
          const measurementData = {
            customer_id: customerId,
            dress_type: item.dressType,
            length: item.length || null,
            shoulder: item.shoulder || null,
            sleeve_length: item.sleeveLength || null,
            sleeve_loose: item.sleeveLoose || null,
            arm_hole: item.armHole || null,
            chest: item.chest || null,
            waist: item.waist || null,
            hip: item.hip || null,
            front_neck: item.frontNeck || null,
            back_neck: item.backNeck || null,
            bottom: item.bottom || null,
            bottom_hip: item.bottomHip || null,
            created_at: now,
          };

          // Insert measurement (don't fail order if measurement save fails)
          const insertMeasurement = async () => {
            try {
              const { data } = await supabase
                .from('measurements')
                .insert([measurementData])
                .select()
                .single();
              return data?.id || null;
            } catch (error) {
              console.error('Error creating measurement for order:', error);
              return null;
            }
          };

          measurementInsertPromises.push(insertMeasurement());
        }
      }
    }

    // Wait for all measurements to be created and collect their IDs
    const measurementIds = await Promise.all(measurementInsertPromises);

    // Now map items, using new measurement IDs where applicable
    let measurementIndex = 0;
    for (const item of items) {
      let measurementId = item.measurementId || null;

      if (item.type === 'Stitching' && !measurementId && item.dressType) {
        const hasManualMeasurements =
          item.length || item.shoulder || item.sleeveLength || item.sleeveLoose ||
          item.armHole || item.chest || item.waist || item.hip ||
          item.frontNeck || item.backNeck || item.bottom || item.bottomHip;

        if (hasManualMeasurements && measurementIds[measurementIndex]) {
          measurementId = measurementIds[measurementIndex];
        }
        measurementIndex++;
      }

      orderItemsData.push({
        order_id: orderResult.id,
        type: item.type,
        dress_type: item.dressType || null,
        measurement_id: measurementId,
        stitching_charge: item.stitchingCharge || null,
        product_name: item.productName || null,
        quantity: item.quantity || null,
        price: item.price || null,
      });
    }

    // Insert all order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Try to cleanup - delete the order if items fail
      await supabase.from('orders').delete().eq('id', orderResult.id);
      throw itemsError;
    }

    const newOrder: Order = {
      id: orderResult.id,
      customerId: orderResult.customer_id,
      items,
      subtotal: orderResult.subtotal,
      discount: orderResult.discount || 0,
      total: orderResult.total,
      status: orderResult.status,
      paymentStatus: orderResult.payment_status,
      deliveryDate: orderResult.delivery_date || undefined,
      createdAt: orderResult.created_at,
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updateOrder = useCallback(async (id: string, updates: Partial<Order>) => {
    const updateData: Record<string, any> = {};

    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.paymentStatus !== undefined) updateData.payment_status = updates.paymentStatus;
    if (updates.deliveryDate !== undefined) updateData.delivery_date = updates.deliveryDate || null;
    if (updates.discount !== undefined) updateData.discount = updates.discount;
    if (updates.subtotal !== undefined) updateData.subtotal = updates.subtotal;
    if (updates.total !== undefined) updateData.total = updates.total;

    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      throw updateError;
    }

    // Fetch updated order with items
    const { data: updatedOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching updated order:', fetchError);
      throw fetchError;
    }

    const convertedOrder: Order = {
      id: updatedOrder.id,
      customerId: updatedOrder.customer_id,
      items: (updatedOrder.order_items || []).map((item: any) => ({
        id: item.id,
        type: item.type,
        dressType: item.dress_type || undefined,
        measurementId: item.measurement_id || undefined,
        stitchingCharge: item.stitching_charge || undefined,
        deliveryDate: item.delivery_date || undefined,
        productName: item.product_name || undefined,
        quantity: item.quantity || undefined,
        price: item.price || undefined,
      })),
      subtotal: updatedOrder.subtotal,
      discount: updatedOrder.discount || 0,
      total: updatedOrder.total,
      status: updatedOrder.status,
      paymentStatus: updatedOrder.payment_status,
      deliveryDate: updatedOrder.delivery_date || undefined,
      createdAt: updatedOrder.created_at,
    };

    setOrders(prev => prev.map(o => o.id === id ? convertedOrder : o));
    return convertedOrder;
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    // Note: order_items will be deleted automatically due to CASCADE
    const { error: supabaseError } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (supabaseError) {
      console.error('Error deleting order:', supabaseError);
      throw supabaseError;
    }

    setOrders(prev => prev.filter(o => o.id !== id));
  }, []);

  const getOrder = useCallback((id: string) => {
    return orders.find(o => o.id === id);
  }, [orders]);

  const getOrdersByCustomer = useCallback((customerId: string) => {
    return orders.filter(o => o.customerId === customerId);
  }, [orders]);

  const updateOrderStatus = useCallback(async (id: string, status: Order['status']) => {
    return updateOrder(id, { status });
  }, [updateOrder]);

  const updatePaymentStatus = useCallback(async (id: string, paymentStatus: Order['paymentStatus']) => {
    return updateOrder(id, { paymentStatus });
  }, [updateOrder]);

  return {
    orders: filteredOrders,
    allOrders: orders,
    loading,
    error,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrder,
    getOrdersByCustomer,
    updateOrderStatus,
    updatePaymentStatus,
    refresh: fetchOrders,
  };
}
