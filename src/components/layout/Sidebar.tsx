import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/customers', label: 'Customers', icon: '👥' },
  { to: '/orders/new', label: 'New Order', icon: '📝' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-30 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-rose-600">Zeba her Choice</h1>
          <p className="text-sm text-gray-500 mt-1">Management System</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors min-h-[44px] ${
                      isOpen ? 'justify-start' : 'justify-center lg:justify-start'
                    } ${
                      isActive
                        ? 'bg-rose-50 text-rose-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <span className={`${!isOpen ? 'hidden lg:inline' : 'inline'} truncate`}>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <p className="text-xs text-center text-gray-400 hidden lg:block">
            Single Shop Owner Edition
          </p>
        </div>
      </aside>
    </>
  );
}
