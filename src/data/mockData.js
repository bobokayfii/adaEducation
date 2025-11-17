export const modulesData = [
  { id: 1, icon: 'brain', title: 'Введение в AI', lessons: ['Понятие AI','История развития','AI vs ML vs DL','Области применения','Generative AI','Практика'] },
  { id: 2, icon: 'cpu', title: 'Инструменты AI', lessons: ['Экосистема','LLM модели','Генерация изображений','AI аудио','AI видео','Практика'] },
  { id: 3, icon: 'file-spreadsheet', title: 'No-code AI', lessons: ['Работа с файлами','AI-запросы','Автоматизация','Лучшие практики','Кейс','Практика'] },
  { id: 4, icon: 'image', title: 'AI изображения', lessons: ['Основы','Редактирование','Расширенные функции','Сравнение','Автоматизация','Практика'] },
  { id: 5, icon: 'file-text', title: 'OCR и AI', lessons: ['Что такое OCR','No-code OCR','Сервисы','Продвинутое','Применение','Практика'] }
];

export const demoUsers = [
  {
    id: 1,
    name: 'Тестовый Пользователь',
    email: 'user@test.com',
    password: 'user123',
    progress: {},
    testResults: [],
    timeSpent: 0,
    lastActivity: new Date().toISOString().split('T')[0],
    department: 'Тестирование'
  }
];
