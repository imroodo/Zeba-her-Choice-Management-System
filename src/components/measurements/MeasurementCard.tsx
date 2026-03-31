import type { Measurement } from '../../types';

interface MeasurementCardProps {
  measurement: Measurement;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function MeasurementCard({ measurement, onEdit, onDelete }: MeasurementCardProps) {
  const displayFields = [
    { label: 'Length', value: measurement.length },
    { label: 'Shoulder', value: measurement.shoulder },
    { label: 'Sleeve', value: measurement.sleeveLength },
    { label: 'Sleeve Loose', value: measurement.sleeveLoose },
    { label: 'Arm Hole', value: measurement.armHole },
    { label: 'Chest', value: measurement.chest },
    { label: 'Waist', value: measurement.waist },
    { label: 'Hip', value: measurement.hip },
    { label: 'Front Neck', value: measurement.frontNeck },
    { label: 'Back Neck', value: measurement.backNeck },
    { label: 'Bottom', value: measurement.bottom },
    { label: 'Bottom Hip', value: measurement.bottomHip },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-sm font-medium rounded-full">
          {measurement.dressType}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(measurement.id)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(measurement.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {displayFields.slice(0, 6).map(field => (
          <div key={field.label} className="flex justify-between py-1">
            <span className="text-gray-500">{field.label}:</span>
            <span className="font-medium text-gray-900">{field.value || '-'}</span>
          </div>
        ))}
      </div>

      <details className="mt-3 pt-3 border-t border-gray-100">
        <summary className="text-sm text-rose-600 cursor-pointer hover:text-rose-700 font-medium">
          Show all measurements
        </summary>
        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
          {displayFields.slice(6).map(field => (
            <div key={field.label} className="flex justify-between py-1">
              <span className="text-gray-500">{field.label}:</span>
              <span className="font-medium text-gray-900">{field.value || '-'}</span>
            </div>
          ))}
        </div>
      </details>

      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
        Added {new Date(measurement.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
