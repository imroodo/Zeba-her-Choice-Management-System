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

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 hover:text-rose-600 transition-colors"
              >
                ← Back
              </button>
            )}
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-gray-900">{crumb.label}</span>
                ) : (
                  <span className="hover:text-rose-600 cursor-pointer">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
      </div>
    </header>
  );
}
