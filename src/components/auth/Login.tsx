import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CORRECT_PASSWORD = 'sabrina';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === CORRECT_PASSWORD) {
      // Set login flag in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Zeba Her Choice</h1>
          <p className="text-gray-600 text-sm sm:text-base">Boutique Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                error ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Enter password"
              autoFocus
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 px-4 rounded-lg transition-colors min-h-[44px]"
          >
            Enter
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center text-sm text-gray-500">
          <p>Authorized access only</p>
        </div>
      </div>
    </div>
  );
}
