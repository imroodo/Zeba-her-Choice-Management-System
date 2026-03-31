import { useMemo } from 'react';
import { useOrders, useCustomers } from '../../hooks';
import { formatDate } from '../../utils/helpers';
import Button from '../common/Button';

export default function UpcomingDeliveries() {
  const { orders } = useOrders();
  const { customers } = useCustomers();

  const upcomingDeliveries = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return orders
      .filter(order => {
        if (!order.deliveryDate) return false;
        const deliveryDate = new Date(order.deliveryDate);
        return deliveryDate >= today;
      })
      .sort((a, b) => {
        if (!a.deliveryDate || !b.deliveryDate) return 0;
        return new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime();
      })
      .slice(0, 5)
      .map(order => {
        const customer = customers.find(c => c.id === order.customerId);
        // Get first item description
        const firstItem = order.items[0];
        let itemDescription = '';
        if (firstItem) {
          if (firstItem.type === 'Stitching') {
            itemDescription = `${firstItem.dressType} - Stitching`;
          } else {
            itemDescription = `${firstItem.productName} (${firstItem.quantity}x)`;
          }
        }
        // Show "+X more" if there are additional items
        const additionalItems = order.items.length > 1 ? ` +${order.items.length - 1} more` : '';

        return {
          ...order,
          customer,
          itemDescription: itemDescription + additionalItems,
        };
      });
  }, [orders, customers]);

  const getDaysRemaining = (deliveryDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const delivery = new Date(deliveryDate);
    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days: number) => {
    if (days === 0) return 'bg-red-100 text-red-700 border-red-200';
    if (days <= 2) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (days <= 7) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  if (upcomingDeliveries.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Deliveries</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>No upcoming deliveries scheduled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Deliveries</h3>
        <Button variant="secondary" size="sm" onClick={() => window.location.href = '/customers'}>
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {upcomingDeliveries.map(order => {
          const daysRemaining = order.deliveryDate ? getDaysRemaining(order.deliveryDate) : 0;
          const urgencyColor = getUrgencyColor(daysRemaining);

          return (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={() => window.location.href = `/billing/${order.id}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">
                    {order.itemDescription}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.customer?.name || 'Unknown Customer'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${urgencyColor}`}>
                  {daysRemaining === 0
                    ? 'Today'
                    : daysRemaining === 1
                    ? 'Tomorrow'
                    : daysRemaining > 1
                    ? `In ${daysRemaining} days`
                    : ''}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">
                    📦 {order.items.length} item(s)
                  </span>
                  <span className="text-gray-500">
                    ₹{order.total.toLocaleString()}
                  </span>
                </div>
                <span className="text-rose-600 font-medium">
                  {formatDate(order.deliveryDate!)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
