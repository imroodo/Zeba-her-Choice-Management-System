import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders, useCustomers } from '../../hooks';

export default function DashboardStats() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { customers } = useCustomers();

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

    return {
      totalCustomers: customers.length,
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
    };
  }, [orders, customers]);

  const statCards = [
    {
      label: 'Total Customers',
      value: stats.totalCustomers,
      icon: '👥',
      color: 'bg-blue-50 text-blue-600',
      onClick: () => navigate('/customers'),
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: '📦',
      color: 'bg-rose-50 text-rose-600',
      onClick: () => navigate('/orders'),
    },
    {
      label: 'Pending',
      value: stats.pendingOrders,
      icon: '⏳',
      color: 'bg-yellow-50 text-yellow-600',
      onClick: () => navigate('/orders'),
    },
    {
      label: 'Delivered',
      value: stats.deliveredOrders,
      icon: '✅',
      color: 'bg-green-50 text-green-600',
      onClick: () => navigate('/orders'),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <button
          key={stat.label}
          onClick={stat.onClick}
          className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300 text-left min-h-[120px] flex flex-col justify-between active:scale-[0.98]"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <span className="text-sm text-gray-600 font-medium">{stat.label}</span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
