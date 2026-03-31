import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useCustomers } from '../../hooks';
import { validateCustomer } from '../../utils/validators';
import Button from '../common/Button';

export default function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addCustomer, updateCustomer } = useCustomers();

  const [formData, setFormData] = useState(() => ({
    name: '',
    phone: '',
    address: '',
    notes: '',
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);

  // Fetch customer data directly from database when editing
  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        try {
          const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (data) {
            setFormData({
              name: data.name,
              phone: data.phone || '',
              address: data.address || '',
              notes: data.notes || '',
            });
          }
        } catch (err) {
          console.error('Error fetching customer:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateCustomer(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        if (id) {
          await updateCustomer(id, formData);
        } else {
          await addCustomer(formData);
        }
        navigate('/customers');
      } catch (error) {
        console.error('Error saving customer:', error);
      }
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
              errors.name ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Customer name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="10-digit phone number"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
              errors.address ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Full address"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="Additional notes about the customer"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/customers')}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Saving...' : id ? 'Update Customer' : 'Add Customer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
