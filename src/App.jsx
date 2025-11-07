import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import UserDashboard from './components/UserDashboard';
import { demoUsers } from './data/mockData';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Проверяем localStorage при загрузке
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('role') || null;
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || '';
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || '';
  });
  // Загружаем пользователей из localStorage или используем demoUsers
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('adminUsers');
    return savedUsers ? JSON.parse(savedUsers) : [...demoUsers];
  });

  // Сохраняем пользователей при изменении
  useEffect(() => {
    localStorage.setItem('adminUsers', JSON.stringify(users));
  }, [users]);

  // Редирект после успешного логина
  useEffect(() => {
    if (isLoggedIn) {
      if (location.pathname === '/login') {
        if (role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (role === 'user') {
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [isLoggedIn, role, location.pathname, navigate]);

  const handleLogin = (email, password) => {
    // Проверка учетной записи администратора
    if (email.toLowerCase() === 'admin@sqb.uz' && password === 'admin123') {
      const name = 'Admin';
      setUserName(name);
      setUserEmail(email.toLowerCase());
      setRole('admin');
      setIsLoggedIn(true);

      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email.toLowerCase());
      localStorage.setItem('role', 'admin');
      localStorage.setItem('isLoggedIn', 'true');

      return { success: true };
    }

    // Поиск пользователя в списке users
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return {
        success: false,
        message: 'Пользователь с таким email не найден. Обратитесь к администратору.'
      };
    }

    // Проверка пароля
    if (user.password !== password) {
      return {
        success: false,
        message: 'Неверный пароль'
      };
    }

    // Успешная авторизация пользователя
    const name = user.name || email.split('@')[0];
    setUserName(name);
    setUserEmail(user.email);
    setRole('user');
    setIsLoggedIn(true);

    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('role', 'user');
    localStorage.setItem('isLoggedIn', 'true');

    return { success: true };
  };

  const handleLogout = () => {
    // Очищаем state
    setIsLoggedIn(false);
    setRole(null);
    setUserName('');
    setUserEmail('');

    // Очищаем localStorage авторизации
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');

    // Переходим на главную страницу
    navigate('/');
  };

  // Защищенный роут для авторизованных пользователей
  const ProtectedRoute = ({ children, requiredRole = null }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    if (requiredRole && role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={!isLoggedIn ? <LandingPage /> : (role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />)} 
      />
      <Route 
        path="/login" 
        element={!isLoggedIn ? <Login onLogin={handleLogin} /> : (role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />)} 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel
              userName={userName}
              onLogout={handleLogout}
              users={users}
              setUsers={setUsers}
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard
              userName={userName}
              userEmail={userEmail}
              onLogout={handleLogout}
              users={users}
              setUsers={setUsers}
            />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
