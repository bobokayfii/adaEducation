import { useState } from 'react';
import { ChevronLeft, Clock, Award, TrendingUp, CheckCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getOverallProgress, minutesToHM } from '../../utils/helpers';
import TestResultModal from './TestResultModal';
import ModuleDetailModal from './ModuleDetailModal';

function UserProgress({ modulesData, user, onBackToCatalog, onStartModule }) {
  const overall = getOverallProgress(user.progress);
  const [selectedTestResult, setSelectedTestResult] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  const getIconComponent = (iconName) => {
    const iconMap = {
      brain: LucideIcons.Brain,
      cpu: LucideIcons.Cpu,
      'file-spreadsheet': LucideIcons.FileSpreadsheet,
      image: LucideIcons.Image,
      'file-text': LucideIcons.FileText,
    };
    return iconMap[iconName] || LucideIcons.BookOpen;
  };

  const completedModules = Object.values(user.progress).filter(
    (m) => m.completed === m.total
  ).length;

  const avgTestScore =
    user.testResults.length > 0
      ? Math.round(
          user.testResults.reduce((sum, t) => sum + t.score, 0) /
            user.testResults.length
        )
      : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <button
        onClick={onBackToCatalog}
        className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 transition-all text-sm sm:text-base hover:-translate-x-1"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Назад к курсам</span>
        <span className="sm:hidden">Назад</span>
      </button>

      <div>
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2">Мой прогресс</h2>
        <p className="text-sm sm:text-base text-gray-600">Отслеживайте свои достижения и результаты</p>
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl shadow-default border border-gray-200 p-4 sm:p-6 hover:shadow-hover transition-all">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="bg-gradient-primary p-1.5 sm:p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold gradient-text">{overall}%</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Общий прогресс</div>
        </div>

        <div className="bg-white rounded-xl shadow-default border border-gray-200 p-4 sm:p-6 hover:shadow-hover transition-all">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="bg-secondary/10 border border-secondary/30 p-1.5 sm:p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-secondary">
              {completedModules}
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Завершено модулей</div>
        </div>

        <div className="bg-white rounded-xl shadow-default border border-gray-200 p-4 sm:p-6 hover:shadow-hover transition-all">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="bg-primary/10 border border-primary/30 p-1.5 sm:p-2 rounded-lg">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-primary">
              {Math.floor(user.timeSpent / 60)}ч
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Времени потрачено</div>
        </div>

        <div className="bg-white rounded-xl shadow-default border border-gray-200 p-4 sm:p-6 hover:shadow-hover transition-all">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="bg-accent/10 border border-accent/30 p-1.5 sm:p-2 rounded-lg">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-accent">
              {avgTestScore > 0 ? `${avgTestScore}%` : '-'}
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Средний балл</div>
        </div>
      </div>

      {/* Прогресс по модулям */}
      <div className="bg-white rounded-xl shadow-default border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
          Прогресс по модулям
        </h3>
        <div className="space-y-3 sm:space-y-4 max-h-[600px] overflow-y-auto">
          {modulesData.map((module) => {
            const progress = user.progress[module.id] || { completed: 0, total: 6 };
            const progressPercent = progress.total
              ? Math.round((progress.completed / progress.total) * 100)
              : 0;
            const IconComponent = getIconComponent(module.icon);

            return (
              <div
                key={module.id}
                onClick={() => setSelectedModule(module)}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-primary/30 hover:shadow-default transition-all cursor-pointer bg-white"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                  <div className="bg-gradient-primary p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{module.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {progress.completed} из {progress.total} уроков
                    </p>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold gradient-text flex-shrink-0">
                    {progressPercent}%
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div
                    className="bg-gradient-primary h-1.5 sm:h-2 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Результаты тестов */}
      <div className="bg-white rounded-xl shadow-default border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Результаты тестов</h3>
        {user.testResults.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-sm sm:text-base text-gray-500 px-4">
            Вы еще не проходили тесты. Завершите модуль, чтобы пройти тест.
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3 max-h-[500px] overflow-y-auto">
              {user.testResults.map((result, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedTestResult(result)}
                    className="border border-gray-200 rounded-xl p-4 hover:border-primary/30 hover:shadow-default transition-all cursor-pointer bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">
                          {modulesData.find(m => m.id === result.moduleId)?.title || 'Модуль'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {result.date} • {result.time}
                        </div>
                      </div>
                      <span
                        className={`ml-2 inline-block px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                          result.score >= 90
                            ? 'bg-secondary/10 text-secondary border border-secondary/30'
                            : result.score >= 70
                            ? 'bg-accent/10 text-accent border border-accent/30'
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                      >
                        {result.score}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Модуль
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Балл
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Дата
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Время
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {user.testResults.map((result, index) => {
                    return (
                      <tr
                        key={index}
                        onClick={() => setSelectedTestResult(result)}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-primary/5 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                          {modulesData.find(m => m.id === result.moduleId)?.title || 'Модуль'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              result.score >= 90
                                ? 'bg-secondary/10 text-secondary border border-secondary/30'
                                : result.score >= 70
                                ? 'bg-accent/10 text-accent border border-accent/30'
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}
                          >
                            {result.score}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-600">
                          {result.date}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-600">
                          {result.time}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Test Result Modal */}
      {selectedTestResult && (
        <TestResultModal
          result={selectedTestResult}
          onClose={() => setSelectedTestResult(null)}
        />
      )}

      {/* Module Detail Modal */}
      {selectedModule && (
        <ModuleDetailModal
          module={selectedModule}
          progress={user.progress[selectedModule.id] || { completed: 0, total: 6, started: false }}
          onClose={() => setSelectedModule(null)}
          onStartModule={onStartModule}
        />
      )}
    </div>
  );
}

export default UserProgress;
