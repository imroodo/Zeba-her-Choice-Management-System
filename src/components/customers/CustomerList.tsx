import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Customer } from '../../types';
import SearchBar from '../common/SearchBar';
import Button from '../common/Button';
import CustomerCard from './CustomerCard';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CustomerList({ customers, onEdit, onDelete }: CustomerListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;

    const query = searchQuery.toLowerCase();
    return customers.filter(
      c =>
        c.name.toLowerCase().includes(query) ||
        c.phone.includes(query)
    );
  }, [customers, searchQuery]);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="w-full sm:flex-1 sm:max-w-md">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search customers by name or phone..."
          />
        </div>
        <Link to="/customers/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Customer
          </Button>
        </Link>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="w-12 h-12 text-gray-900 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-600 text-gray-900 mb-2">
            {searchQuery ? 'No matching customers found' : 'No customers yet'}
          </p>
          {!searchQuery && (
            <Link to="/customers/new">
              <Button variant="primary" size="sm">
                Add your first customer
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map(customer => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
