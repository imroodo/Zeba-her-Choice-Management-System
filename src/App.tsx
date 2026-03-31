import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layout } from './components/layout';
import { CustomerList, CustomerForm, CustomerDetail } from './components/customers';
import { MeasurementForm } from './components/measurements';
import { OrderForm } from './components/orders';
import { InvoicePage } from './components/billing';
import DashboardStats from './components/dashboard/DashboardStats';
import { useCustomers } from './hooks';
import Login from './components/auth/Login';

function CustomerListWrapper() {
  const navigate = useNavigate();
  const { deleteCustomer } = useCustomers();
  const { customers } = useCustomers();

  return (
    <CustomerList
      customers={customers}
      onEdit={id => navigate(`/customers/${id}/edit`)}
      onDelete={deleteCustomer}
    />
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(auth);
    if (!auth) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<CustomerListWrapper />} />
          <Route path="customers/new" element={<CustomerForm />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="customers/:id/edit" element={<CustomerForm />} />
          <Route path="customers/:customerId/measurements/new" element={<MeasurementForm />} />
          <Route path="customers/:customerId/measurements/:id/edit" element={<MeasurementForm />} />
          <Route path="orders/new" element={<OrderForm />} />
          <Route path="billing/:id" element={<InvoicePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to Zeba her Choice Management System</p>
      </div>

      <DashboardStats />

      <div className="mt-6 bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          <QuickAction
            title="Add New Customer"
            description="Register a new customer"
            icon="➕"
            onClick={() => navigate('/customers/new')}
          />
          <QuickAction
            title="View Customers"
            description="See all customers"
            icon="👥"
            onClick={() => navigate('/customers')}
          />
          <QuickAction
            title="Create Order"
            description="Start a new order"
            icon="📝"
            onClick={() => navigate('/orders/new')}
          />
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

function QuickAction({ title, description, icon, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-50 rounded-lg border border-gray-200 p-3 lg:p-4 hover:bg-rose-50 hover:border-rose-200 transition-all hover:scale-105 duration-300 text-left w-full min-h-[44px] flex items-center"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-2xl sm:text-3xl lg:text-4xl flex-shrink-0">{icon}</span>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{title}</h3>
          <p className="text-xs lg:text-sm text-gray-500 truncate">{description}</p>
        </div>
      </div>
    </button>
  );
}

export default App;
