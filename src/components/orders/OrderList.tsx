import type { Order } from '../../types';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/helpers';

interface OrderListProps {
  orders: Order[];
  onView: (orderId: string) => void;
  onCreateNew?: () => void;
}

export default function OrderList({ orders, onView, onCreateNew }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No orders yet</h3>
        <p className="text-gray-500 mb-4">Create an order for a customer</p>
        {onCreateNew && <Button onClick={onCreateNew}>Create Order</Button>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {onCreateNew && (
        <div className="flex justify-end mb-4">
          <Button onClick={onCreateNew}>Create New Order</Button>
        </div>
      )}

      {orders.map(order => {
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
            className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onView(order.id)}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
              <div>
                <p className="font-medium text-gray-900">
                  {itemText}{additionalCount}
                </p>
                <p className="text-sm text-gray-500">
                  Ordered: {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                {order.deliveryDate && (
                  <p className="text-sm text-rose-600 font-medium">
                    Delivery: {new Date(order.deliveryDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                <span className="font-bold text-rose-600">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {order.items.slice(0, 3).map(item => (
                <span
                  key={item.id}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {item.type === 'Stitching' ? (
                    <>
                      {item.dressType} - ₹{item.stitchingCharge?.toLocaleString()}
                    </>
                  ) : (
                    <>
                      {item.productName} x{item.quantity ?? 0} - ₹{((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString()}
                    </>
                  )}
                </span>
              ))}
              {order.items.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                  +{order.items.length - 3} more
                </span>
              )}
            </div>

            <div className="border-t pt-3 flex justify-between items-center text-sm">
              <span className="text-gray-500">{order.items.length} item(s)</span>
              <span className="text-rose-600 font-medium">View Invoice →</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
