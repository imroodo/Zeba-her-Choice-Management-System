import type { Customer } from '../../types';
import { useNavigate } from 'react-router-dom';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/customers/${customer.id}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-rose-600  transition-colors">
            {customer.name}
          </h3>
          <p className="text-gray-900 text-sm mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {customer.phone}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleView}
            className="p-2 text-gray-900 hover:text-rose-600 hover:bg-rose-50 hover:bg-rose-50 rounded-lg transition-all duration-200"
            title="View Details"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(customer.id)}
            className="p-2 text-gray-900 hover:text-blue-600 hover:bg-blue-50 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(customer.id)}
            className="p-2 text-gray-900 hover:text-red-600 hover:bg-red-50 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      {customer.address && (
        <p className="text-gray-600 text-gray-900 text-sm mb-2 flex items-start gap-1">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{customer.address}</span>
        </p>
      )}
      {customer.notes && (
        <p className="text-gray-900 text-sm italic truncate bg-gray-50 bg-gray-50/50 p-2 rounded-lg">"{customer.notes}"</p>
      )}
      <div className="mt-3 pt-3 border-t border-gray-100 border-gray-200 text-xs text-gray-900 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Added {new Date(customer.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
