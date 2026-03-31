import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useCustomers } from '../../hooks';
import { useOrders } from '../../hooks';
import { formatCurrency } from '../../utils/helpers';
import Button from '../common/Button';
import UpcomingDeliveries from './UpcomingDeliveries';

const COLORS = ['#ec4899', '#db2777', '#be185d', '#9d174d', '#831843', '#f472b6', '#fbc7eb', '#fce7f3'];

export default function DashboardStats() {
  const { customers } = useCustomers();
  const { orders, deleteOrder } = useOrders();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const orderStatusData = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const paymentStatusData = useMemo(() => {
    const paymentCounts: Record<string, number> = {};
    orders.forEach(order => {
      paymentCounts[order.paymentStatus] = (paymentCounts[order.paymentStatus] || 0) + 1;
    });
    return Object.entries(paymentCounts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const topCustomersData = useMemo(() => {
    const customerTotals: Record<string, number> = {};
    orders.forEach(order => {
      customerTotals[order.customerId] = (customerTotals[order.customerId] || 0) + order.total;
    });
    const sorted = Object.entries(customerTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([customerId, total]) => {
        const customer = customers.find(c => c.id === customerId);
        return {
          name: customer?.name || 'Unknown',
          total,
        };
      });
    return sorted;
  }, [orders, customers]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  }, [orders]);

  const handleResetRevenue = async () => {
    // Delete all orders to reset revenue
    try {
      await Promise.all(orders.map(order => deleteOrder(order.id)));
      setShowResetConfirm(false);
    } catch (error) {
      console.error('Error resetting revenue:', error);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-boutique-500 to-boutique-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Revenue</p>
              <p className="text-4xl font-bold">{formatCurrency(0)}</p>
            </div>
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c0 1.78-1.73 2.8-3.12 3.16z"/>
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-4">
            <div>
              <p className="text-xs opacity-75">Customers</p>
              <p className="text-lg font-semibold">{customers.length}</p>
            </div>
            <div>
              <p className="text-xs opacity-75">Orders</p>
              <p className="text-lg font-semibold">0</p>
            </div>
          </div>
        </div>
        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl p-6 border border-gray-200">
          <p>No data available yet. Create orders to see statistics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Revenue Card */}
      <div className="bg-gradient-to-br from-boutique-500 to-boutique-600 rounded-2xl p-6 text-white shadow-lg relative">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="absolute top-6 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          title="Reset Revenue"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Total Revenue</p>
            <p className="text-4xl font-bold">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c0 1.78-1.73 2.8-3.12 3.16z"/>
            </svg>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-4">
          <div>
            <p className="text-xs opacity-75">Customers</p>
            <p className="text-lg font-semibold">{customers.length}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">Orders</p>
            <p className="text-lg font-semibold">{orders.length}</p>
          </div>
        </div>
      </div>

      {/* Upcoming Deliveries */}
      <UpcomingDeliveries />

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Reset Revenue?</h2>
            <p className="text-gray-600 mb-6">
              This will permanently delete all {orders.length} order(s) and reset revenue to ₹0. This action cannot be undone. Are you sure?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleResetRevenue}>
                Reset All Orders
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentStatusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Customers Bar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers by Revenue</h3>
        {topCustomersData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCustomersData} layout="vertical">
                <XAxis
                  type="number"
                  tickFormatter={(value) => `₹${value}`}
                  className="text-gray-600"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fontSize: 12 }}
                  className="text-gray-600"
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'var(--tw-color-white)',
                    border: '1px solid var(--tw-color-gray-200)',
                    borderRadius: '0.5rem',
                    color: 'var(--tw-color-gray-900)',
                  }}
                />
                <Bar dataKey="total" fill="#ec4899" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>No revenue data yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
