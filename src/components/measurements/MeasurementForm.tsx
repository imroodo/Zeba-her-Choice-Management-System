import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useMeasurements } from '../../hooks';
import type { Measurement } from '../../types';
import { DRESS_TYPES, MEASUREMENT_FIELDS } from '../../utils/constants';
import Button from '../common/Button';
import { validateMeasurement } from '../../utils/validators';

export default function MeasurementForm() {
  const navigate = useNavigate();
  const { customerId: customerIdParam, id } = useParams<{ customerId: string; id: string }>();
  const { addMeasurement, updateMeasurement } = useMeasurements();

  const [formData, setFormData] = useState<Partial<Measurement>>(() => ({
    dressType: 'Blouse',
    length: 0,
    shoulder: 0,
    sleeveLength: 0,
    sleeveLoose: 0,
    armHole: 0,
    chest: 0,
    waist: 0,
    hip: 0,
    frontNeck: 0,
    backNeck: 0,
    bottom: 0,
    bottomHip: 0,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);

  // Fetch measurement data directly from database when editing
  useEffect(() => {
    if (id) {
      const fetchMeasurement = async () => {
        try {
          const { data, error } = await supabase
            .from('measurements')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (data) {
            setFormData({
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
            });
          }
        } catch (err) {
          console.error('Error fetching measurement:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMeasurement();
    }
  }, [id]);

  const customerId = customerIdParam || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number | undefined = value;

    if (name !== 'dressType') {
      parsedValue = value === '' ? undefined : Number(value);
    }

    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateMeasurement(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 && customerId) {
      try {
        if (id) {
          await updateMeasurement(id, formData);
        } else {
          await addMeasurement(customerId, formData as Omit<Measurement, 'id' | 'customerId' | 'createdAt'>);
        }
        navigate(`/customers/${customerId}`);
      } catch (error) {
        console.error('Error saving measurement:', error);
      }
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading measurement data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dress Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dressType" className="block text-sm font-medium text-gray-700 mb-2">
                Dress Type *
              </label>
              <select
                id="dressType"
                name="dressType"
                value={formData.dressType}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  errors.dressType ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                {DRESS_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.dressType && <p className="mt-1 text-sm text-red-600">{errors.dressType}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Measurements (in inches)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MEASUREMENT_FIELDS.map(field => (
              <div key={field.key}>
                <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                <input
                  type="number"
                  step="0.5"
                  id={field.key}
                  name={field.key}
                  value={formData[field.key as keyof Measurement] ?? ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/customers/${customerId}`)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Saving...' : id ? 'Update Measurement' : 'Add Measurement'}
          </Button>
        </div>
      </form>
    </div>
  );
}
