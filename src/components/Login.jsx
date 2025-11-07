import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft } from 'lucide-react';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    const result = onLogin(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-default p-8 max-w-md w-full border border-gray-200 relative">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Назад
        </button>
        
        <div className="text-center mb-8 pt-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-xl mb-6 shadow-default">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-3">AdaEducation</h1>
          <p className="text-base text-gray-600">Платформа онлайн обучения</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all hover:border-primary/50"
              placeholder="user@sqb.uz"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all hover:border-primary/50"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-primary text-white py-3.5 rounded-lg font-semibold hover:shadow-hover transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
