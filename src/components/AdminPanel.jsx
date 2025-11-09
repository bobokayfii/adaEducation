import { useState, useEffect } from 'react';
import AdminHeader from './admin/AdminHeader';
import AdminTabs from './admin/AdminTabs';
import AdminUsers from './admin/AdminUsers';
import AdminContent from './admin/AdminContent';
import AdminAIQuestions from './admin/AdminAIQuestions';
import AdminStats from './admin/AdminStats';

function AdminPanel({ userName, onLogout, users, setUsers }) {
  const [activeView, setActiveView] = useState(() => {
    return localStorage.getItem('adminActiveView') || 'adminUsers';
  });

  useEffect(() => {
    localStorage.setItem('adminActiveView', activeView);
  }, [activeView]);

  return (
    <div className="min-h-screen bg-dark-bg">
      <AdminHeader userName={userName} onLogout={onLogout} />
      <AdminTabs activeView={activeView} setActiveView={setActiveView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {activeView === 'adminUsers' && (
          <AdminUsers users={users} setUsers={setUsers} />
        )}
        {activeView === 'adminContent' && (
          <AdminContent
            users={users}
            setUsers={setUsers}
            setActiveView={setActiveView}
          />
        )}
        {activeView === 'adminAIQuestions' && <AdminAIQuestions />}
        {activeView === 'adminStats' && <AdminStats users={users} />}
      </main>
    </div>
  );
}

export default AdminPanel;
