import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import UserDashboard from './components/UserDashboard';
import { demoUsers } from './data/mockData';

function App() {
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
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('adminUsers');
    const parsedUsers = savedUsers ? JSON.parse(savedUsers) : [...demoUsers];
    
    // Гарантируем наличие постоянного пользователя
    const defaultUser = demoUsers[0]; // Тестовый пользователь
    const userExists = parsedUsers.some(u => u.email === defaultUser.email);
    
    if (!userExists) {
      return [...parsedUsers, defaultUser];
    }
    
    return parsedUsers;
  });
  const [currentView, setCurrentView] = useState(() => (localStorage.getItem('isLoggedIn') === 'true' ? 'app' : 'landing'));

  useEffect(() => {
    // Гарантируем наличие постоянного пользователя перед сохранением
    const defaultUser = demoUsers[0];
    const userExists = users.some(u => u.email === defaultUser.email);
    
    let usersToSave = users;
    if (!userExists) {
      usersToSave = [...users, defaultUser];
      setUsers(usersToSave);
    }
    
    localStorage.setItem('adminUsers', JSON.stringify(usersToSave));
  }, [users]);

  useEffect(() => {
    if (isLoggedIn) {
      setCurrentView('app');
    }
  }, [isLoggedIn]);

  const handleLogin = (email, password) => {
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

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return {
        success: false,
        message: 'Пользователь с таким email не найден. Обратитесь к администратору.'
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: 'Неверный пароль'
      };
    }

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
    const currentUserName = userName;

    setIsLoggedIn(false);
    setRole(null);
    setUserName('');
    setUserEmail('');

    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminActiveView');

    setCurrentView('landing');
  };

  if (!isLoggedIn) {
    if (currentView === 'login') {
      return <Login onLogin={handleLogin} onBack={() => setCurrentView('landing')} />;
    }

    return <LandingPage onStart={() => setCurrentView('login')} />;
  }

  if (role === 'admin') {
    return (
      <AdminPanel
        userName={userName}
        onLogout={handleLogout}
        users={users}
        setUsers={setUsers}
      />
    );
  }

  return (
    <UserDashboard
      userName={userName}
      userEmail={userEmail}
      onLogout={handleLogout}
      users={users}
      setUsers={setUsers}
    />
  );
}

export default App;
