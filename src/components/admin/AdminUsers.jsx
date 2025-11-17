import { useState, useEffect } from 'react';
import { Download, Search, Eye, UserPlus, Edit, Trash2 } from 'lucide-react';
import UserDetail from './UserDetail';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import { modulesData, demoUsers } from '../../data/mockData';
import { getOverallProgress, minutesToHM, exportUsersToCSV } from '../../utils/helpers';

function AdminUsers({ users, setUsers }) {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Загружаем список модулей из localStorage или используем дефолтный
  const [moduleList, setModuleList] = useState(() => {
    const saved = localStorage.getItem('adminModuleList');
    return saved ? JSON.parse(saved) : [...modulesData];
  });

  const filteredUsers = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.department || '').toLowerCase().includes(q)
    );
  };

  const handleExport = () => {
    exportUsersToCSV(filteredUsers(), getOverallProgress);
  };

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleEditUser = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    
    // Проверяем, является ли пользователь постоянным (из demoUsers)
    const defaultUser = demoUsers[0];
    if (user && user.email === defaultUser.email) {
      alert('Этот пользователь является системным и не может быть удален.');
      return;
    }
    
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя? Все данные будут потеряны.')) {
      setUsers(users.filter(u => u.id !== userId));
      // Удаляем данные пользователя из localStorage
      if (user) {
        localStorage.removeItem(`user_${user.name}`);
        localStorage.removeItem(`showAIChat_${user.name}`);
        localStorage.removeItem(`aiAgentData_${user.name}`);
      }
    }
  };

  if (selectedUserId) {
    const user = users.find((u) => u.id === selectedUserId);
    return (
      <UserDetail
        user={user}
        onBack={() => setSelectedUserId(null)}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold gradient-text">
            Пользователи платформы
          </h2>
          <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Прогресс и результаты всех пользователей</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-3 sm:px-4 py-2 rounded-lg transition-all shadow-default hover:shadow-hover transform hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Добавить</span>
            <span className="sm:hidden">Добавить</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-gradient-primary text-white px-3 sm:px-4 py-2 rounded-lg transition-all shadow-default hover:shadow-hover transform hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            Экспорт
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-default border border-gray-200 p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-2 sm:left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск..."
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3">
          {filteredUsers().map((u) => {
            const progress = getOverallProgress(u.progress);
            return (
              <div
                key={u.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 hover:shadow-default transition-all bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{u.name}</div>
                    <div className="text-sm text-gray-600 truncate">{u.email}</div>
                    <div className="text-xs text-gray-500 mt-1">{u.department}</div>
                  </div>
                  <div className="flex gap-1 ml-2 flex-shrink-0">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="p-2 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-all"
                      title="Редактировать"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedUserId(u.id)}
                      className="p-2 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-all"
                      title="Подробнее"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {u.email !== demoUsers[0]?.email && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(u.id);
                        }}
                        className="p-2 text-danger hover:text-danger/80 hover:bg-danger/10 rounded-lg transition-all"
                        title="Удалить"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Прогресс</span>
                      <span className="font-semibold text-gray-900">{progress}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
                    <span>Тесты: <span className="font-semibold text-gray-900">{u.testResults.length}</span></span>
                    <span>Время: <span className="font-semibold text-gray-900">{minutesToHM(u.timeSpent)}</span></span>
                    <span>Активность: <span className="font-semibold text-gray-900">{u.lastActivity}</span></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto scroll-shadow rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Пользователь
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Отдел
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Прогресс
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Тесты
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Время
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Активность
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers().map((u) => {
                const progress = getOverallProgress(u.progress);
                return (
                  <tr
                    key={u.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{u.name}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-gray-600">{u.department}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-primary h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-10">
                          {progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-gray-900">
                        {u.testResults.length}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-gray-900">
                        {minutesToHM(u.timeSpent)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-gray-600">{u.lastActivity}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 transition-colors"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                          Редактировать
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => setSelectedUserId(u.id)}
                          className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 transition-colors"
                          title="Подробнее"
                        >
                          <Eye className="w-4 h-4" />
                          Подробнее
                        </button>
                        {u.email !== demoUsers[0]?.email && (
                          <>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(u.id);
                              }}
                              className="text-danger hover:text-danger/80 font-medium text-sm flex items-center gap-1 transition-colors"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                              Удалить
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onAddUser={handleAddUser}
          modules={moduleList}
        />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onEditUser={handleEditUser}
        />
      )}
    </div>
  );
}

export default AdminUsers;
