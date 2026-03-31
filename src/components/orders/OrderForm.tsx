import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCustomers, useMeasurements, useOrders } from '../../hooks';
import type { OrderItem as OrderItemType } from '../../types';
import { ORDER_STATUSES } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import Button from '../common/Button';
import OrderItem from './OrderItem';

const MEASUREMENT_FIELDS = [
  'length', 'shoulder', 'sleeveLength', 'sleeveLoose', 'armHole', 'chest',
  'waist', 'hip', 'frontNeck', 'backNeck', 'bottom', 'bottomHip'
] as const;

export default function OrderForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerIdFromQuery = searchParams.get('customerId');

  const { customers } = useCustomers();
  const { allMeasurements } = useMeasurements();
  const { addOrder } = useOrders();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customerIdFromQuery || ''
  );
  const [items, setItems] = useState<OrderItemType[]>([]);
  const [discount, setDiscount] = useState(0);
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed' | 'Delivered'>('Pending');
  const [deliveryDate, setDeliveryDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [showCustomerSelector, setShowCustomerSelector] = useState(!customerIdFromQuery);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const customerMeasurements = selectedCustomer
    ? allMeasurements.filter(m => m.customerId === selectedCustomer.id)
    : [];

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      (item.type === 'Stitching'
        ? item.stitchingCharge || 0
        : (item.quantity || 0) * (item.price || 0)),
    0
  );

  const total = subtotal - discount;

  const addItem = () => {
    const newItem: OrderItemType = {
      id: `temp-${Date.now()}`,
      type: 'Stitching',
      dressType: 'Blouse',
      quantity: 1,
      price: 0,
      // Set all measurement fields to 1 by default
      length: 1,
      shoulder: 1,
      sleeveLength: 1,
      sleeveLoose: 1,
      armHole: 1,
      chest: 1,
      waist: 1,
      hip: 1,
      frontNeck: 1,
      backNeck: 1,
      bottom: 1,
      bottomHip: 1,
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (index: number, updates: Partial<OrderItemType>) => {
    setItems(prev =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
    if (errors[`item-${index}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`item-${index}`];
        return newErrors;
      });
    }
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const validateItems = () => {
    const newErrors: Record<string, string> = {};

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type === 'Stitching') {
        if (!item.dressType) {
          newErrors[`item-${i}-dressType`] = 'Dress type is required';
        }
        if (!item.measurementId) {
          // Check if all manual measurement fields are filled with positive values
          const hasAllMeasurements = MEASUREMENT_FIELDS.every(field => {
            const value = item[field];
            return value !== undefined && value !== null && value > 0;
          });
          if (!hasAllMeasurements) {
            newErrors[`item-${i}-measurement`] = 'Either select a saved measurement or fill all measurement fields (must be > 0)';
          }
        }
        if (!item.stitchingCharge || item.stitchingCharge <= 0) {
          newErrors[`item-${i}-stitchingCharge`] = 'Stitching charge must be greater than 0';
        }
      } else {
        if (!item.productName?.trim()) {
          newErrors[`item-${i}-productName`] = 'Product name is required';
        }
        if (!item.quantity || item.quantity <= 0) {
          newErrors[`item-${i}-quantity`] = 'Quantity must be at least 1';
        }
        if (!item.price || item.price <= 0) {
          newErrors[`item-${i}-price`] = 'Price must be greater than 0';
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return 'Please fix the errors in the form';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomerId) {
      setErrors({ customer: 'Please select a customer' });
      return;
    }

    if (items.length === 0) {
      setErrors({ general: 'Please add at least one item' });
      return;
    }

    const validationError = validateItems();
    if (validationError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrder = await addOrder(selectedCustomerId, items, discount, status, 'Not Paid', deliveryDate || undefined);
      navigate(`/billing/${newOrder.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      setErrors({ general: 'Failed to create order' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showCustomerSelector) {
    return (
      <div className="p-6 max-w-2xl mx-auto animate-fade-in">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Order</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-gray-900 mb-2">
                Select Customer *
              </label>
              <select
                value={selectedCustomerId}
                onChange={e => {
                  const customerId = e.target.value;
                  setSelectedCustomerId(customerId);
                  if (customerId) {
                    setShowCustomerSelector(false);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white bg-gray-50 text-gray-900"
              >
                <option value="">Choose a customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id} className="text-gray-900">
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
              {errors.customer && (
                <p className="mt-1 text-sm text-red-600 ">{errors.customer}</p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => navigate('/customers/new')}
                className="text-gray-900"
              >
                Add New Customer
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex-1">
              <p className="text-sm text-gray-900 mb-1">Customer</p>
              <p className="font-semibold text-gray-900">{selectedCustomer?.name}</p>
              <p className="text-gray-900 text-sm">{selectedCustomer?.phone}</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowCustomerSelector(true)}
            >
              Change Customer
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
            <Button type="button" onClick={addItem} size="sm">
              + Add Item
            </Button>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 border-red-200 rounded-lg text-red-700  text-sm">
              {errors.general}
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-900">
              No items added yet. Click "Add Item" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id}>
                  <OrderItem
                    item={item}
                    index={index}
                    onRemove={() => removeItem(index)}
                    onUpdate={updates => updateItem(index, updates)}
                    measurements={customerMeasurements}
                  />
                  {errors[`item-${index}`] && (
                    <p className="mt-2 text-sm text-red-600  bg-red-50 p-2 rounded">
                      {errors[`item-${index}`]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 text-gray-900 mb-2">
                Delivery Date
              </label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white bg-gray-50 text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">Expected delivery date for the order</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-gray-900 mb-2">
                Order Status *
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as typeof status)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white bg-gray-50 text-gray-900"
              >
                {ORDER_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-between text-gray-600 text-gray-900">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-gray-900">Discount</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-gray-900">₹</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={e => setDiscount(Number(e.target.value) || 0)}
                  className="w-32 px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white bg-gray-50 text-gray-900"
                />
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold text-rose-600 pt-3 border-t">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            {total < 1 && (
              <p className="text-sm text-amber-600  bg-amber-50  p-2 rounded">
                Total amount must be at least ₹1
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/customers/${selectedCustomerId}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || items.length === 0 || total < 1}
          >
            {isSubmitting ? 'Creating...' : 'Create Order'}
          </Button>
        </div>
      </form>
    </div>
  );
}
