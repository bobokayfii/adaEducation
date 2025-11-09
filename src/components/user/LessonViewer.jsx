import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Play, Award } from 'lucide-react';
import { lessonContent } from '../../data/lessonContent';
import { getLessonVideoData, getVideoEmbedUrl } from '../../data/lessonVideos';

function LessonViewer({
  modulesData,
  moduleId,
  lessonIndex,
  onCompleteLesson,
  onStartTest,
  onBack,
  onNextLesson,
  userProgress,
}) {
  const module = modulesData.find((m) => m.id === moduleId);
  const currentLesson = module.lessons[lessonIndex];
  const isLastLesson = lessonIndex === module.lessons.length - 1;
  const videoMeta = getLessonVideoData(currentLesson);
  const videoEmbedUrl = getVideoEmbedUrl(currentLesson);

  // Загружаем контент из localStorage или используем дефолтный
  const localContent = (() => {
    const saved = localStorage.getItem('adminLessonContent');
    return saved ? JSON.parse(saved) : lessonContent;
  })();

  const content =
    localContent[currentLesson] || {
      title: currentLesson,
      content: `Это урок "${currentLesson}" модуля "${module.title}".

В реальном приложении здесь будет:
• Видео-материалы
• Интерактивные демонстрации
• Практические задания
• Дополнительные ресурсы

Нажмите кнопку ниже, чтобы завершить урок.`,
    };

  const handleNextClick = () => {
    // Отмечаем урок как просмотренный
    onCompleteLesson();
    // Переходим к следующему уроку
    onNextLesson();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <button
        onClick={onBack}
        className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 transition-all text-sm sm:text-base hover:-translate-x-1"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Назад к курсам</span>
        <span className="sm:hidden">Назад</span>
      </button>

      <div className="bg-white rounded-xl shadow-default overflow-hidden border border-gray-200">
        <div className="bg-gradient-primary text-white p-4 sm:p-6">
          <div className="text-xs sm:text-sm opacity-90 mb-1 sm:mb-2">
            {module.title} • Урок {lessonIndex + 1} из {module.lessons.length}
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{content.title}</h1>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Прогресс-бар уроков */}
          <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 lg:mb-8">
            {module.lessons.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1.5 sm:h-2 rounded-full transition-all ${
                  index < lessonIndex
                    ? 'bg-secondary'
                    : index === lessonIndex
                    ? 'bg-primary'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <>
              <div className="prose max-w-none mb-4 sm:mb-6 lg:mb-8">
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {content.content}
                </div>
              </div>

              {/* Видео-плеер */}
              {videoEmbedUrl ? (
                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <div className="relative rounded-lg overflow-hidden shadow-default border border-gray-200" style={{ paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={videoEmbedUrl}
                      title={videoMeta?.title || currentLesson}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  {videoMeta && (
                    <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
                      <p className="font-medium text-gray-900">{videoMeta.title}</p>
                      {(videoMeta.channel || videoMeta.duration) && (
                        <p className="text-gray-500">
                          {videoMeta.channel}
                          {videoMeta.channel && videoMeta.duration ? ' • ' : ''}
                          {videoMeta.duration}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center mb-4 sm:mb-6 lg:mb-8 border border-gray-200">
                  <div className="text-center text-gray-500">
                    <Play className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 opacity-50" />
                    <p className="text-xs sm:text-sm">Видео-контент</p>
                  </div>
                </div>
              )}

              {/* Кнопка зависит от того, последний урок или нет */}
              {isLastLesson ? (
                <button
                  onClick={() => {
                    onCompleteLesson();
                    onStartTest();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all shadow-default hover:shadow-hover transform hover:-translate-y-0.5 active:scale-95"
                >
                  <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Пройти итоговый тест модуля</span>
                </button>
              ) : (
                <button
                  onClick={handleNextClick}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-primary text-white px-6 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all shadow-default hover:shadow-hover transform hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Следующий урок</span>
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </>
        </div>
      </div>
    </div>
  );
}

export default LessonViewer;
