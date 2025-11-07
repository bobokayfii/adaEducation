import { Users, LogOut } from 'lucide-react';

function AdminHeader({ userName, onLogout }) {
  return (
    <header className="bg-gradient-primary shadow-default sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-white truncate">Админ панель</h1>
              <p className="text-xs text-white/90 hidden sm:block">Управление платформой</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="text-xs sm:text-sm text-white/90 font-medium truncate max-w-[100px] sm:max-w-none">{userName}</span>
            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="Выйти"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
