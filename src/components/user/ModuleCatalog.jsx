import * as LucideIcons from 'lucide-react';

function ModuleCatalog({ modulesData, userProgress, onStartModule }) {
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

  const moduleImages = {
    1: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    2: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    3: 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&q=80',
    4: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
    5: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:3xl font-bold gradient-text mb-2">Каталог курсов</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Выберите курс для начала обучения
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 xl:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {modulesData.map((module) => {
          const progress = userProgress[module.id] || { completed: 0, total: module.lessons.length };
          const lessonsCount = module.lessons.length;
          const safeTotal = progress.total && progress.total > 0 ? progress.total : lessonsCount || 1;
          const progressPercent = Math.min(100, Math.round((progress.completed / safeTotal) * 100));
          const isCompleted = safeTotal > 0 && progress.completed >= safeTotal;
          const isStarted = progress.started || progress.completed > 0;
          const IconComponent = getIconComponent(module.icon);
          const imageSrc = moduleImages[module.id] || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80';

          return (
            <div
              key={module.id}
              className="bg-white rounded-3xl shadow-default border border-gray-200 overflow-hidden hover:shadow-hover transition-all group"
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={imageSrc}
                  alt={module.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-2xl shadow">
                    <div className="bg-gradient-primary text-white rounded-xl p-2">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-500">{lessonsCount} уроков</p>
                      <h3 className="text-sm font-semibold text-gray-800">{module.title}</h3>
                    </div>
                  </div>
                </div>
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-white shadow">
                      <LucideIcons.CheckCircle className="w-4 h-4" />
                      Завершен
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>Прогресс</span>
                    <span className="font-semibold text-gray-900">
                      {progress.completed}/{safeTotal}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${progressPercent === 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-emerald-400'} transition-all duration-500`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => onStartModule(module.id, isCompleted)}
                  className={`w-full py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-transform flex items-center justify-center gap-2 shadow-default hover:shadow-hover active:scale-95 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                      : 'bg-gradient-to-r from-primary to-secondary text-white'
                  }`}
                >
                  {isCompleted ? 'Начать заново' : isStarted ? 'Продолжить' : 'Начать'}
                  <LucideIcons.ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ModuleCatalog;
