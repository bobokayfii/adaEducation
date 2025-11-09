import { useNavigate } from 'react-router-dom';
import { BookOpen, PlayCircle, Video, Trophy, Phone, Rocket, GraduationCap, ArrowRight, BarChart3, Brain, Cpu, FileSpreadsheet, Image, FileText } from 'lucide-react';
import { modulesData } from '../data/mockData';

function LandingPage({ onStart }) {
  const navigate = onStart ? null : useNavigate();

  // Получаем приветствие в зависимости от времени суток
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Доброй ночи';
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  const totalModules = modulesData.length;
  const totalLessons = modulesData.reduce((sum, module) => sum + module.lessons.length, 0);
  const averageLessonsPerModule = totalModules > 0 ? Math.round(totalLessons / totalModules) : 0;

  const platformMetrics = [
    {
      id: 'catalog',
      value: totalModules,
      label: 'Курсов в каталоге',
      description: 'AI, аналитика данных и офисные инструменты',
      icon: BookOpen,
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'lessons',
      value: totalLessons,
      label: 'Видео-уроков',
      description: `В среднем ${averageLessonsPerModule} уроков в каждом модуле`,
      icon: PlayCircle,
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      id: 'tests',
      value: totalModules,
      label: 'Финальных тестов',
      description: 'Контроль знаний после каждого модуля',
      icon: Trophy,
      iconBg: 'bg-amber-100 text-amber-600',
    },
    {
      id: 'analytics',
      value: '100%',
      label: 'Живая статистика',
      description: 'Мониторинг прогресса и достижений как в пользовательском дашборде',
      icon: BarChart3,
      iconBg: 'bg-purple-100 text-purple-600',
    },
  ];

  const iconMap = {
    brain: Brain,
    cpu: Cpu,
    'file-spreadsheet': FileSpreadsheet,
    image: Image,
    'file-text': FileText,
  };

  const highlightedCoursesData = [
    {
      moduleId: 1,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      moduleId: 2,
      image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      moduleId: 3,
      image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const popularCourses = highlightedCoursesData
    .map(({ moduleId, image }) => {
      const module = modulesData.find((m) => m.id === moduleId);
      if (!module) return null;
      return { ...module, image };
    })
    .filter(Boolean)
    .slice(0, 3);

  const handleStartLearning = () => {
    if (onStart) {
      onStart();
    } else if (navigate) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gradient-primary shadow-default sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <a href="#hero" className="flex items-center gap-2 text-white font-bold text-xl hover:opacity-90 transition-opacity">
              <GraduationCap className="w-6 h-6" />
              AdaEducation
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-white/90 hover:text-white transition-colors font-medium">Возможности</a>
              <a href="#courses" className="text-white/90 hover:text-white transition-colors font-medium">Курсы</a>
              <a href="#about" className="text-white/90 hover:text-white transition-colors font-medium">О нас</a>
              <button
                onClick={handleStartLearning}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                Войти
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="bg-gradient-primary text-white py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 fade-in">
              {getGreeting()}!
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 text-white/95 welcome-text">
              Добро пожаловать в AdaEducation
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto fade-in">
              Образовательная платформа для изучения AI, аналитики данных и офисных инструментов. 
              Развивайте свои навыки с лучшими видеокурсами и практическими заданиями.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartLearning}
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-hover transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-5 h-5" />
                Начать обучение
              </button>
              <a
                href="#courses"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg border border-white/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Посмотреть курсы
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16" id="features">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">Возможности платформы</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Все необходимое для эффективного обучения в одном месте
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformMetrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={metric.id}
                className="bg-white rounded-2xl shadow-default p-6 hover:shadow-hover transition-all border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl inline-flex ${metric.iconBg}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{metric.label}</h3>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16" id="courses">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">Популярные курсы</h2>
            <p className="text-lg text-gray-600">
              Выберите курс из актуального каталога и начните путь к профессиональному росту
            </p>
          </div>
          <button
            onClick={handleStartLearning}
            className="inline-flex items-center gap-2 self-start sm:self-auto text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            Все курсы
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {popularCourses.map((course) => {
            const IconComponent = iconMap[course.icon] || BookOpen;
            const lessonsCount = course.lessons.length;
            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-default border border-gray-200 overflow-hidden hover:shadow-hover transition-all group"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl text-primary shadow">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-white">
                      <h3 className="text-lg font-semibold">{course.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-white/90">
                        <BookOpen className="w-4 h-4" />
                        <span>{lessonsCount} уроков</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Прогресс</span>
                    <span>0/{lessonsCount}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-gradient-primary rounded-full" />
                  </div>
                  <button
                    onClick={handleStartLearning}
                    className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gradient-primary py-3 rounded-lg hover:shadow-hover transition-all active:scale-[0.99]"
                  >
                    Начать
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16" id="about">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">Почему выбирают нас?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Мы создали платформу, которая делает обучение простым, интересным и эффективным
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-default p-6 text-center hover:shadow-hover transition-all">
              <Video className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Видео уроки</h4>
              <p className="text-gray-600">
                Качественные видео от лучших экспертов отрасли
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-default p-6 text-center hover:shadow-hover transition-all">
              <Trophy className="w-12 h-12 text-accent mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Геймификация</h4>
              <p className="text-gray-600">
                Зарабатывайте XP, получайте уровни и достижения
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-default p-6 text-center hover:shadow-hover transition-all">
              <Phone className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Адаптивность</h4>
              <p className="text-gray-600">
                Учитесь где угодно: на компьютере, планшете или телефоне
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Готовы начать обучение?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам студентов, которые уже развивают свои навыки с AdaEducation
          </p>
          <button
            onClick={handleStartLearning}
            className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-hover transition-all transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
          >
            <Rocket className="w-5 h-5" />
            Начать сейчас
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h5 className="flex items-center gap-2 text-xl font-bold mb-4">
                <GraduationCap className="w-6 h-6" />
                AdaEducation
              </h5>
              <p className="text-gray-400">
                Образовательная платформа для изучения AI, аналитики и офисных инструментов
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Навигация</h6>
              <ul className="space-y-2 text-gray-400 list-none">
                <li><a href="#features" className="hover:text-white transition-colors">Возможности</a></li>
                <li><a href="#courses" className="hover:text-white transition-colors">Курсы</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">О нас</a></li>
                <li>
                  <button onClick={handleStartLearning} className="hover:text-white transition-colors">
                    Войти
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Контакты</h6>
              <ul className="space-y-2 text-gray-400 list-none">
                <li>info@adaeducation.com</li>
                <li>www.adaeducation.com</li>
              </ul>
            </div>
          </div>
          <hr className="my-8 border-gray-700" />
          <div className="text-center text-gray-400">
            <p>&copy; 2024 AdaEducation. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

