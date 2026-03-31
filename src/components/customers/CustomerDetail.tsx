import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import { useCustomers, useMeasurements, useOrders } from '../../hooks';
import { ORDER_STATUSES } from '../../utils/constants';
import type { TabType, Order } from '../../types';
import CustomerForm from './CustomerForm';
import MeasurementList from '../measurements/MeasurementList';
import OrderList from '../orders/OrderList';
import Button from '../common/Button';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deleteCustomer, getCustomer } = useCustomers();
  const { measurements, deleteMeasurement } = useMeasurements(id);
  const { orders: customerOrders, updateOrderStatus, updatePaymentStatus } = useOrders(id);

  const [activeTab, setActiveTab] = useState<TabType>('measurements');
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const customer = id ? getCustomer(id) : null;

  if (!customer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Customer not found</p>
          <Button onClick={() => navigate('/customers')} className="mt-4">
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'measurements' as TabType, label: 'Measurements', count: measurements.length },
    { id: 'orders' as TabType, label: 'Orders', count: customerOrders.length },
    { id: 'billing' as TabType, label: 'Billing', count: customerOrders.length },
  ];

  const handleDeleteCustomer = async () => {
    if (id) {
      try {
        await deleteCustomer(id);
        navigate('/customers');
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'measurements':
        return (
          <MeasurementList
            measurements={measurements}
            onAdd={() => navigate(`/customers/${id}/measurements/new`)}
            onEdit={(mid) => navigate(`/customers/${id}/measurements/${mid}/edit`)}
            onDelete={deleteMeasurement}
          />
        );
      case 'orders':
        return (
          <OrderList
            orders={customerOrders}
            onView={(orderId: string) => navigate(`/billing/${orderId}`)}
            onCreateNew={() => navigate(`/orders/new?customerId=${id}`)}
          />
        );
      case 'billing':
        return (
          <div className="space-y-4">
            {customerOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500 mb-4">No orders yet</p>
                <Button onClick={() => navigate(`/orders/new?customerId=${id}`)}>
                  Create Order
                </Button>
              </div>
            ) : (
              customerOrders.map(order => {
                const firstItem = order.items[0];
                let itemText = '';
                if (firstItem) {
                  if (firstItem.type === 'Stitching') {
                    itemText = `${firstItem.dressType} - Stitching`;
                  } else {
                    itemText = `${firstItem.productName} (${firstItem.quantity}x)`;
                  }
                }
                const additionalCount = order.items.length > 1 ? ` +${order.items.length - 1} more` : '';

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/billing/${order.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {itemText}{additionalCount}
                        </p>
                        <p className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        {order.deliveryDate && (
                          <p className="text-sm text-rose-600 font-medium">
                            Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 text-gray-900">
                          {order.items.length} item(s) - ₹{order.total.toLocaleString()}
                        </p>
                      </div>
                      <div
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-2"
                      >
                        <select
                        value={order.status}
                        onChange={async e => {
                          e.stopPropagation();
                          try {
                            await updateOrderStatus(order.id, e.target.value as Order['status']);
                          } catch (error) {
                            console.error('Failed to update order status:', error);
                          }
                        }}
                        className="text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white bg-gray-50 text-gray-900 cursor-pointer"
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s} className="text-gray-900">{s}</option>
                        ))}
                      </select>
                      <select
                        value={order.paymentStatus}
                        onChange={async e => {
                          e.stopPropagation();
                          try {
                            await updatePaymentStatus(order.id, e.target.value as Order['paymentStatus']);
                          } catch (error) {
                            console.error('Failed to update payment status:', error);
                          }
                        }}
                        className={`text-xs px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white bg-gray-50 cursor-pointer ${
                          order.paymentStatus === 'Paid'
                            ? 'border-green-200 border-green-200 text-green-700 text-green-700'
                            : 'border-red-200 border-red-200 text-red-700 text-red-700'
                        } text-gray-900`}
                      >
                        <option value="Paid" className="text-gray-900">Paid</option>
                        <option value="Not Paid" className="text-gray-900">Not Paid</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            }
            )
            )
          }
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header title={customer.name} showBack />

      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Customer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600">{customer.phone}</p>
              {customer.address && (
                <p className="text-gray-500 mt-1">{customer.address}</p>
              )}
              {customer.notes && (
                <p className="text-gray-400 mt-2 italic">"{customer.notes}"</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate(`/orders/new?customerId=${id}`)}>
                Create Order
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-rose-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 text-gray-400">({tab.count})</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>

      {showEditForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Edit Customer</h2>
              </div>
              <div className="p-6">
                <CustomerForm />
              </div>
              <div className="p-6 border-t flex justify-end">
                <Button variant="secondary" onClick={() => setShowEditForm(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Customer?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {customer.name}? This action cannot be undone and will also delete all associated measurements and orders.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteCustomer}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
