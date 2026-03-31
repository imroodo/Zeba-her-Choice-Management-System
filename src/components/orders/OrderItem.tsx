import type { OrderItem as OrderItemType, Measurement } from '../../types';
import { DRESS_TYPES } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import Button from '../common/Button';

interface OrderItemProps {
  item: OrderItemType;
  index: number;
  onRemove: () => void;
  onUpdate: (updates: Partial<OrderItemType>) => void;
  measurements?: Measurement[];
  readOnly?: boolean;
}

const MEASUREMENT_FIELDS = [
  { key: 'length', label: 'Length' },
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'sleeveLength', label: 'Sleeve Length' },
  { key: 'sleeveLoose', label: 'Sleeve Loose' },
  { key: 'armHole', label: 'Arm Hole' },
  { key: 'chest', label: 'Chest' },
  { key: 'waist', label: 'Waist' },
  { key: 'hip', label: 'Hip' },
  { key: 'frontNeck', label: 'Front Neck' },
  { key: 'backNeck', label: 'Back Neck' },
  { key: 'bottom', label: 'Bottom' },
  { key: 'bottomHip', label: 'Bottom Hip' },
] as const;

export default function OrderItem({
  item,
  index,
  onRemove,
  onUpdate,
  measurements = [],
  readOnly = false,
}: OrderItemProps) {
  const filteredMeasurements = measurements.filter(
    m => m.dressType === item.dressType
  );

  const itemTotal = (item.quantity ?? 0) * (item.price ?? 0);

  const handleLoadMeasurement = (mid: string) => {
    const selected = filteredMeasurements.find(m => m.id === mid);
    if (selected) {
      onUpdate({
        measurementId: mid,
        length: selected.length,
        shoulder: selected.shoulder,
        sleeveLength: selected.sleeveLength,
        sleeveLoose: selected.sleeveLoose,
        armHole: selected.armHole,
        chest: selected.chest,
        waist: selected.waist,
        hip: selected.hip,
        frontNeck: selected.frontNeck,
        backNeck: selected.backNeck,
        bottom: selected.bottom,
        bottomHip: selected.bottomHip,
      });
    }
  };

  const handleManualChange = (field: string, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    onUpdate({
      [field]: numValue,
      measurementId: undefined,
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-start mb-3">
        <span className="font-medium text-gray-900">
          Item {index + 1}: {item.type}
        </span>
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-600 hover:text-red-700"
          >
            Remove
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={item.type}
            onChange={e => {
              const updates: Partial<OrderItemType> = {
                type: e.target.value as 'Stitching' | 'Readymade',
                dressType: undefined,
                measurementId: undefined,
                stitchingCharge: undefined,
                productName: undefined,
              };
              onUpdate(updates);
            }}
            disabled={readOnly}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
          >
            <option value="Stitching">Stitching</option>
            <option value="Readymade">Readymade</option>
          </select>
        </div>

        {item.type === 'Stitching' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dress Type *
              </label>
              <select
                value={item.dressType || ''}
                onChange={e =>
                  onUpdate({
                    dressType: e.target.value,
                    measurementId: undefined,
                  })
                }
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
              >
                <option value="">Select dress type</option>
                {DRESS_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {item.dressType && (
              <div className="space-y-3">
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    Measurements (in inches) *
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Enter all measurements manually or load from saved.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {MEASUREMENT_FIELDS.map(field => (
                      <div key={field.key}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {field.label} *
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={item[field.key as keyof OrderItemType] ?? ''}
                          onChange={e => handleManualChange(field.key, e.target.value)}
                          disabled={readOnly}
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {filteredMeasurements.length > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-500 mb-2">Or load from saved measurement:</p>
                    <select
                      value={item.measurementId || ''}
                      onChange={e => handleLoadMeasurement(e.target.value)}
                      disabled={readOnly}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white text-sm"
                    >
                      <option value="">Select saved measurement</option>
                      {filteredMeasurements.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.dressType} — L:{m.length}" S:{m.shoulder}" C:{m.chest}" W:{m.waist}"
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stitching Charge (₹) *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={item.stitchingCharge || ''}
                onChange={e =>
                  onUpdate({ stitchingCharge: Number(e.target.value) || 0 })
                }
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="0"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={item.productName || ''}
                onChange={e => onUpdate({ productName: e.target.value })}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Enter product name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={e => onUpdate({ quantity: Number(e.target.value) || 1 })}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Price (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={item.price}
                  onChange={e => onUpdate({ price: Number(e.target.value) || 0 })}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end pt-2 border-t border-gray-200">
          <span className="font-medium text-gray-900">
            Total: {formatCurrency(itemTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
