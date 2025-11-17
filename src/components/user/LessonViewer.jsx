import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Play, Award, Sparkles, Send, Loader2, User } from 'lucide-react';
import { lessonContent } from '../../data/lessonContent';
import { getLessonVideoData, getVideoEmbedUrl } from '../../data/lessonVideos';
import { io } from 'socket.io-client';

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

  // Состояние для AI запросов (чат)
  const [aiQuestion, setAiQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);
  const isReceivingResponseRef = useRef(false); // Ref для отслеживания получения ответа
  const responseTimeoutRef = useRef(null); // Ref для таймаута завершения ответа

  // Socket.IO connection setup
  useEffect(() => {
    // Connect to Socket.IO server using /chat namespace
    // URL: https://fb828cd874cc.ngrok-free.app/chat
    // Listener: response
    // Event: sendMessage
    const socket = io('https://fb828cd874cc.ngrok-free.app/chat', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true,
      // Add extra headers for ngrok
      extraHeaders: {
        'ngrok-skip-browser-warning': 'true'
      }
    });

    socketRef.current = socket;

    // Handle successful connection
    socket.on('connect', () => {
      console.log('Socket.IO connected to /chat namespace:', socket.id);
    });

    // Listen for 'response' event - accumulate parts into one message
    socket.on('response', (data) => {
      const responseText = typeof data === 'string' ? data : data.message || data.text || JSON.stringify(data);
      
      // Очищаем предыдущий таймаут
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }
      
      setChatMessages((prev) => {
        // Проверяем, есть ли уже незавершенное сообщение AI (которое мы начали получать)
        const lastMessage = prev[prev.length - 1];
        
        if (lastMessage && lastMessage.type === 'ai' && isReceivingResponseRef.current) {
          // Обновляем существующее сообщение, добавляя новую часть
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            text: lastMessage.text + responseText,
          };
          return updatedMessages;
        } else {
          // Создаем новое сообщение AI
          isReceivingResponseRef.current = true;
          return [
            ...prev,
            {
              type: 'ai',
              text: responseText,
            },
          ];
        }
      });
      
      // Устанавливаем таймаут: если в течение 1.5 секунд не придет новая часть, завершаем загрузку
      responseTimeoutRef.current = setTimeout(() => {
        isReceivingResponseRef.current = false;
        setIsLoadingAi(false);
        responseTimeoutRef.current = null;
      }, 1500);
    });
    
    // Слушаем событие завершения ответа (если сервер отправляет такое)
    socket.on('response_end', () => {
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
        responseTimeoutRef.current = null;
      }
      isReceivingResponseRef.current = false;
      setIsLoadingAi(false);
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
        responseTimeoutRef.current = null;
      }
      const errorMessage = {
        type: 'ai',
        text: 'Ошибка подключения к серверу. Пожалуйста, попробуйте снова.',
      };
      setChatMessages((prev) => [...prev, errorMessage]);
      setIsLoadingAi(false);
      isReceivingResponseRef.current = false;
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
        responseTimeoutRef.current = null;
      }
      isReceivingResponseRef.current = false;
      setIsLoadingAi(false);
    });

    // Cleanup on unmount
    return () => {
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
        responseTimeoutRef.current = null;
      }
      socket.disconnect();
    };
  }, []);

  // Автопрокрутка к последнему сообщению
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoadingAi]);

  const handleNextClick = () => {
    // Отмечаем урок как просмотренный
    onCompleteLesson();
    // Переходим к следующему уроку
    onNextLesson();
  };

  const handleAiSubmit = () => {
    if (!aiQuestion.trim() || isLoadingAi || !socketRef.current) return;

    // Сохраняем вопрос перед очисткой поля
    const questionToSend = aiQuestion.trim();
    
    // Добавляем вопрос пользователя в чат
    const userMessage = {
      type: 'user',
      text: questionToSend,
    };
    setChatMessages((prev) => [...prev, userMessage]);
    
    // Очищаем поле ввода сразу после отправки
    setAiQuestion('');
    setIsLoadingAi(true);
    isReceivingResponseRef.current = false; // Сбрасываем флаг перед новым запросом
    
    // Очищаем предыдущий таймаут если есть
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }

    // Формируем контекстный запрос с информацией об уроке
    const contextualQuestion = `Тема урока: "${content.title}" (${module.title}). 
Контент урока: ${content.content.substring(0, 500)}...

Вопрос пользователя: ${questionToSend}`;

    // Emit 'sendMessage' event to Socket.IO server
    // Send message as string (like in the Socket.IO client tool)
    try {
      socketRef.current.emit('sendMessage', contextualQuestion);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'ai',
        text: 'Извините, произошла ошибка при отправке сообщения. Пожалуйста, попробуйте снова.',
      };
      setChatMessages((prev) => [...prev, errorMessage]);
      setIsLoadingAi(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAiSubmit();
    }
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

              {/* AI помощник по темам урока */}
              <div className="mb-4 sm:mb-6 lg:mb-8">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200/50 shadow-default overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-2 bg-gradient-primary rounded-lg">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          Задайте вопрос по теме урока
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Получите помощь от AI по материалам этого урока
                        </p>
                      </div>
                    </div>

                    {/* История чата */}
                    {chatMessages.length > 0 && (
                      <div className="mb-3 sm:mb-4 max-h-96 overflow-y-auto bg-white rounded-lg border border-gray-200 p-3 sm:p-4 space-y-3 sm:space-y-4">
                        {chatMessages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex gap-3 ${
                              message.type === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {message.type === 'ai' && (
                              <div className="p-1.5 bg-purple-100 rounded-lg flex-shrink-0 self-start">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                              </div>
                            )}
                            <div
                              className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-3 sm:p-4 ${
                                message.type === 'user'
                                  ? 'bg-gradient-primary text-white'
                                  : 'bg-gray-50 text-gray-800 border border-gray-200'
                              }`}
                            >
                              {message.type === 'user' && (
                                <div className="flex items-center gap-2 mb-1">
                                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <p className="text-xs font-medium opacity-90">Вы</p>
                                </div>
                              )}
                              {message.type === 'ai' && (
                                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1.5">
                                  AI помощник
                                </p>
                              )}
                              <p
                                className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${
                                  message.type === 'user' ? 'text-white' : 'text-gray-800'
                                }`}
                              >
                                {message.text}
                              </p>
                            </div>
                            {message.type === 'user' && (
                              <div className="p-1.5 bg-primary/20 rounded-lg flex-shrink-0 self-start">
                                <User className="w-4 h-4 text-primary" />
                              </div>
                            )}
                          </div>
                        ))}
                        {isLoadingAi && (
                          <div className="flex items-center gap-3 justify-start">
                            <div className="p-1.5 bg-purple-100 rounded-lg flex-shrink-0">
                              <Sparkles className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                <p className="text-sm text-gray-600">AI обрабатывает ваш вопрос...</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>
                    )}

                    {/* Поле ввода вопроса */}
                    <div className="mb-0">
                      <div className="relative flex gap-2">
                        <textarea
                          value={aiQuestion}
                          onChange={(e) => setAiQuestion(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Например: Объясни подробнее эту тему..."
                          className="w-full px-4 py-3 pr-12 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-500"
                          rows="3"
                          disabled={isLoadingAi}
                        />
                        <button
                          onClick={handleAiSubmit}
                          disabled={!aiQuestion.trim() || isLoadingAi}
                          className="absolute right-2 bottom-2 p-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                          title="Отправить вопрос"
                        >
                          {isLoadingAi ? (
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
