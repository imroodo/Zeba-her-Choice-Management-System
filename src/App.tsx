import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { CustomerList, CustomerForm, CustomerDetail } from './components/customers';
import { MeasurementForm } from './components/measurements';
import { OrderForm } from './components/orders';
import { InvoicePage } from './components/billing';
import DashboardStats from './components/dashboard/DashboardStats';
import { useCustomers } from './hooks';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
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
  return (
    <div className="p-6">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to Zeba her Choice Management System</p>
      </div>

      <DashboardStats />

      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction
            title="Add New Customer"
            description="Register a new customer"
            link="/customers/new"
            icon="➕"
          />
          <QuickAction
            title="View Customers"
            description="See all customers"
            link="/customers"
            icon="👥"
          />
          <QuickAction
            title="Create Order"
            description="Start a new order"
            link="/orders/new"
            icon="📝"
          />
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  link: string;
  icon: string;
}

function QuickAction({ title, description, link, icon }: QuickActionProps) {
  return (
    <a
      href={link}
      className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:bg-rose-50 hover:border-rose-200 transition-all hover:scale-105 duration-300"
    >
      <div className="flex items-center gap-3">
        <span className="text-4xl">{icon}</span>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </a>
  );
}

function CustomerListWrapper() {
  const { deleteCustomer } = useCustomers();
  const { customers } = useCustomers();

  return (
    <CustomerList
      customers={customers}
      onEdit={id => window.location.href = `/customers/${id}/edit`}
      onDelete={deleteCustomer}
    />
  );
}

export default App;
