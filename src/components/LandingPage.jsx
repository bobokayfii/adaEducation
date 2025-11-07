import { useNavigate } from 'react-router-dom';
import { BookOpen, PlayCircle, Layout, Infinity, Video, Trophy, Phone, Rocket, GraduationCap, ArrowRight, Users, Clock, Award } from 'lucide-react';
import { modulesData } from '../data/mockData';

function LandingPage() {
  const navigate = useNavigate();

  // Получаем приветствие в зависимости от времени суток
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Доброй ночи';
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  // Получаем популярные курсы (первые 3)
  const popularCourses = modulesData.slice(0, 3);

  const handleStartLearning = () => {
    navigate('/login');
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 text-white/95">
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
          <div className="bg-white rounded-xl shadow-default p-6 text-center hover:shadow-hover transition-all">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{modulesData.length}</h3>
            <p className="text-gray-600">Курсов в каталоге</p>
          </div>
          <div className="bg-white rounded-xl shadow-default p-6 text-center hover:shadow-hover transition-all">
            <PlayCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {modulesData.reduce((sum, module) => sum + module.lessons.length, 0)}
            </h3>
            <p className="text-gray-600">Видеоуроков</p>
          </div>
          <div className="bg-white rounded-xl shadow-default p-6 text-center hover:shadow-hover transition-all">
            <Layout className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">3</h3>
            <p className="text-gray-600">Направления обучения</p>
          </div>
          <div className="bg-white rounded-xl shadow-default p-6 text-center hover:shadow-hover transition-all">
            <Infinity className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">∞</h3>
            <p className="text-gray-600">Сотрудников можно обучить</p>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16" id="courses">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">Популярные курсы</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Выберите курс и начните свой путь к профессиональному росту
          </p>
          <button
            onClick={handleStartLearning}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            Все курсы
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCourses.map((course) => {
            const getIconComponent = () => {
              const iconMap = {
                brain: '🧠',
                cpu: '💻',
                'file-spreadsheet': '📊',
                image: '🖼️',
                'file-text': '📄',
              };
              return iconMap[course.icon] || '📚';
            };

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-default overflow-hidden hover:shadow-hover transition-all cursor-pointer border border-gray-200 transform hover:-translate-y-1 group"
                onClick={handleStartLearning}
              >
                <div className="p-6">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{getIconComponent()}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.lessons.length} уроков</p>
                  <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    <span>Начать курс</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
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
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Активных студентов</p>
            </div>
            <div>
              <Clock className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">24/7</h3>
              <p className="text-gray-600">Доступ к материалам</p>
            </div>
            <div>
              <Award className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">95%</h3>
              <p className="text-gray-600">Успешных выпускников</p>
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
              <ul className="space-y-2 text-gray-400">
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
              <ul className="space-y-2 text-gray-400">
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

