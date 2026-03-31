import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders, useCustomers } from '../../hooks';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Button from '../common/Button';
import Header from '../layout/Header';

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getOrder, updateOrder } = useOrders();
  const { getCustomer } = useCustomers();

  const order = id ? getOrder(id) : null;
  const customer = order ? getCustomer(order.customerId) : null;

  const [localDiscount, setLocalDiscount] = useState(order?.discount || 0);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setLocalDiscount(order?.discount || 0);
    setIsEditing(true);
  };

  if (!order || !customer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Order not found</p>
          <Button onClick={() => navigate('/orders')} className="mt-4">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveDiscount = async () => {
    const newTotal = order.subtotal - localDiscount;
    try {
      await updateOrder(order.id, {
        discount: localDiscount,
        total: newTotal,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving discount:', error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Header title={`Invoice #${order.id.slice(0, 8).toUpperCase()}`} showBack />

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Zeba her Choice</h2>
              <p className="text-gray-600 text-sm">Your Trusted Fashion Partner</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Invoice Date</p>
              <p className="font-medium text-gray-900">
                {formatDate(order.createdAt)}
              </p>
              {order.deliveryDate && (
                <>
                  <p className="text-sm text-gray-500 mt-2">Delivery Date</p>
                  <p className="font-medium text-rose-600">
                    {formatDate(order.deliveryDate)}
                  </p>
                </>
              )}
              <p className="text-sm text-gray-500 mt-2">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'Delivered'
                  ? 'bg-green-100 text-green-700'
                  : order.status === 'Completed'
                  ? 'bg-blue-100 text-blue-700'
                  : order.status === 'In Progress'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Bill To</h3>
          <p className="font-medium text-gray-900">{customer.name}</p>
          <p className="text-gray-600 text-sm">{customer.phone}</p>
          {customer.address && (
            <p className="text-gray-600 text-sm">{customer.address}</p>
          )}
        </div>

        <div className="p-6 overflow-x-auto -mx-6 -mt-6">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Item / Description
                </th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-100 border-gray-200 last:border-0">
                  <td className="py-4 px-2">
                    <p className="font-medium text-gray-900">
                      {index + 1}. {item.type === 'Stitching' ? item.dressType : item.productName}
                    </p>
                    {item.type === 'Stitching' && (
                      <p className="text-sm text-gray-900 mt-1">
                        Stitching Service
                      </p>
                    )}
                    {item.type === 'Readymade' && (
                      <p className="text-sm text-gray-900 mt-1">
                        Qty: {item.quantity ?? 0} × ₹{(item.price ?? 0).toLocaleString()}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-2 text-right">
                    <span className="font-medium text-gray-900">
                      {formatCurrency(
                        item.type === 'Stitching'
                          ? item.stitchingCharge ?? 0
                          : (item.quantity ?? 0) * (item.price ?? 0)
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 bg-gray-50 bg-gray-50/50">
                <td colSpan={1} className="py-4 px-2 text-right">
                  <p className="text-gray-600 text-gray-900">Original Price</p>
                </td>
                <td className="py-4 px-2 text-right">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(order.subtotal)}
                  </p>
                </td>
              </tr>
              <tr>
                <td colSpan={1} className="py-4 px-2 text-right">
                  {isEditing ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-gray-600 text-gray-900">Discount</span>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600 text-gray-900">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={localDiscount}
                          onChange={e =>
                            setLocalDiscount(Number(e.target.value) || 0)
                          }
                          className="w-24 px-2 py-1 border border-gray-300 border-gray-200 rounded text-right bg-white bg-gray-50 text-gray-900"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-gray-600 text-gray-900">Discount</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEdit}
                        className="h-8 px-2"
                      >
                        {order.discount > 0 ? `₹${order.discount.toLocaleString()}` : 'Add'}
                      </Button>
                    </div>
                  )}
                </td>
                <td className="py-4 px-2 text-right">
                  <span className="font-medium text-gray-900">
                    {isEditing
                      ? `₹${localDiscount.toLocaleString()}`
                      : order.discount > 0
                      ? `-${formatCurrency(order.discount)}`
                      : '-'
                    }
                  </span>
                </td>
              </tr>
              {isEditing && (
                <tr>
                  <td colSpan={2} className="py-2 px-2 text-right">
                    <Button size="sm" onClick={handleSaveDiscount}>
                      Save Discount
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setLocalDiscount(order.discount);
                        setIsEditing(false);
                      }}
                      className="ml-2"
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              )}
              <tr className="border-t-2 border-gray-200">
                <td colSpan={1} className="py-4 px-2 text-right">
                  <p className="text-2xl font-bold text-gray-900">Final Amount</p>
                </td>
                <td className="py-4 px-2 text-right">
                  <p className="text-3xl font-bold text-rose-600 ">
                    {formatCurrency(order.subtotal - localDiscount)}
                  </p>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
        <Button
          variant="secondary"
          onClick={() => navigate(`/customers/${customer.id}`)}
          className="w-full sm:w-auto"
        >
          ← Back to Customer
        </Button>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="secondary" onClick={() => window.print()} className="flex-1 sm:flex-initial">
            Print Invoice
          </Button>
          <Button onClick={() => navigate('/orders/new')} className="flex-1 sm:flex-initial">
            Create New Order
          </Button>
        </div>
      </div>
    </div>
  );
}
