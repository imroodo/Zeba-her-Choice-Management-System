import type { Measurement } from '../../types';
import Button from '../common/Button';
import MeasurementCard from './MeasurementCard';

interface MeasurementListProps {
  measurements: Measurement[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function MeasurementList({
  measurements,
  onAdd,
  onEdit,
  onDelete,
}: MeasurementListProps) {
  if (measurements.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No measurements yet</h3>
        <p className="text-gray-500 mb-4">Add measurements for different dress types</p>
        <Button onClick={onAdd}>Add Measurement</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <p className="text-gray-600">{measurements.length} measurement(s) saved</p>
        <Button onClick={onAdd} size="sm" className="w-full sm:w-auto">
          Add Measurement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {measurements.map(measurement => (
          <MeasurementCard
            key={measurement.id}
            measurement={measurement}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
