import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export default function Header({ title, showBack = false }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      return { label: path.charAt(0).toUpperCase() + path.slice(1), href };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1 flex-wrap">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 hover:text-rose-600 transition-colors flex-shrink-0 font-medium"
              >
                ← Back
              </button>
            )}
            <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.href} className="flex items-center gap-2 whitespace-nowrap">
                  {index > 0 && <span className="flex-shrink-0">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">{crumb.label}</span>
                  ) : (
                    <span className="hover:text-rose-600 cursor-pointer truncate max-w-[80px] sm:max-w-[150px]">{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">{title}</h2>
        </div>
        <button
          onClick={handleLogout}
          className="ml-4 px-3 lg:px-4 py-2 text-sm text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors whitespace-nowrap min-h-[44px] flex items-center justify-center"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
