// Система пользователей
class UserManager {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.loadCurrentUser();
    }
    
    loadCurrentUser() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }
    
    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }
    
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }
    
    register(name, email, password) {
        // Проверяем, существует ли пользователь с таким email
        if (this.users.find(user => user.email === email)) {
            return { success: false, message: 'Пользователь с таким email уже существует' };
        }
        
        // Создаем нового пользователя
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            preferences: [],
            favorites: [],
            theme: 'light',
            createdAt: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.saveUsers();
        
        return { success: true, user: newUser };
    }
    
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            this.saveCurrentUser();
            return { success: true, user: user };
        } else {
            return { success: false, message: 'Неверный email или пароль' };
        }
    }
    
    logout() {
        this.currentUser = null;
        this.saveCurrentUser();
    }
    
    updateUserPreferences(preferences) {
        if (this.currentUser) {
            this.currentUser.preferences = preferences;
            this.saveUserData();
        }
    }
    
    toggleFavorite(articleId) {
        if (this.currentUser) {
            const index = this.currentUser.favorites.indexOf(articleId);
            if (index === -1) {
                this.currentUser.favorites.push(articleId);
            } else {
                this.currentUser.favorites.splice(index, 1);
            }
            this.saveUserData();
            return index === -1;
        }
        return false;
    }
    
    isFavorite(articleId) {
        return this.currentUser ? this.currentUser.favorites.includes(articleId) : false;
    }
    
    saveUserData() {
        if (this.currentUser) {
            const index = this.users.findIndex(u => u.id === this.currentUser.id);
            if (index !== -1) {
                this.users[index] = this.currentUser;
                this.saveUsers();
                this.saveCurrentUser();
            }
        }
    }
    
    setTheme(theme) {
        if (this.currentUser) {
            this.currentUser.theme = theme;
            this.saveUserData();
        }
    }
    
    getTheme() {
        return this.currentUser ? this.currentUser.theme : 'light';
    }
}

// База данных
class Database {
    constructor(userManager) {
        this.userManager = userManager;
        this.initializeData();
    }
    
    initializeData() {
        if (!localStorage.getItem('articles')) {
            this.createSampleArticles();
        }
        
        if (!localStorage.getItem('categories')) {
            this.createSampleCategories();
        }
    }
    
    createSampleCategories() {
        const categories = [
            { id: 1, name: 'Технологии', icon: '💻', description: 'Новости из мира технологий и IT' },
            { id: 2, name: 'Наука', icon: '🔬', description: 'Последние научные открытия и исследования' },
            { id: 3, name: 'Искусство', icon: '🎨', description: 'Творчество, культура и искусство' },
            { id: 4, name: 'Спорт', icon: '⚽', description: 'Спортивные события и новости' },
            { id: 5, name: 'Здоровье', icon: '🏥', description: 'Медицина, здоровый образ жизни' },
            { id: 6, name: 'Политика', icon: '🏛️', description: 'Политические события и аналитика' },
            { id: 7, name: 'Экономика', icon: '📈', description: 'Финансы, бизнес и экономика' },
            { id: 8, name: 'Путешествия', icon: '✈️', description: 'Туризм и интересные места' }
        ];
        
        localStorage.setItem('categories', JSON.stringify(categories));
    }
    
    createSampleArticles() {
        const articles = [
            {
                id: 1,
                title: 'Искусственный интеллект в медицине: революция уже здесь',
                excerpt: 'Как ИИ меняет диагностику и лечение заболеваний',
                content: 'Искусственный интеллект становится неотъемлемой частью современной медицины. Алгоритмы машинного обучения уже сегодня помогают врачам ставить более точные диагнозы, предсказывать развитие заболеваний и подбирать персонализированные методы лечения. В этой статье мы рассмотрим самые перспективные применения ИИ в здравоохранении и то, как они меняют медицинскую практику.',
                category: 1,
                date: '2023-10-15',
                image: '🧠'
            },
            {
                id: 2,
                title: 'Квантовые компьютеры: прорыв в вычислениях',
                excerpt: 'Новые возможности квантовых технологий',
                content: 'Квантовые компьютеры обещают революцию в области вычислений, решая задачи, которые недоступны даже самым мощным классическим суперкомпьютерам. В этой статье мы расскажем о принципах работы квантовых компьютеров, текущих достижениях и перспективах этой технологии.',
                category: 2,
                date: '2023-10-12',
                image: '⚛️'
            },
            {
                id: 3,
                title: 'Цифровое искусство: NFT и будущее творчества',
                excerpt: 'Как блокчейн меняет арт-индустрию',
                content: 'NFT (невзаимозаменяемые токены) произвели революцию в мире цифрового искусства, предоставив художникам новые способы монетизации своих работ. В этой статье мы исследуем феномен NFT, его влияние на арт-рынок и перспективы развития цифрового искусства.',
                category: 3,
                date: '2023-10-10',
                image: '🖼️'
            },
            {
                id: 4,
                title: 'Олимпийские игры 2024: что ждать от Парижа',
                excerpt: 'Подготовка к главному спортивному событию',
                content: 'Париж готовится к проведению летних Олимпийских игр 2024 года. В этой статье мы расскажем о нововведениях, которые ожидают зрителей, о подготовке города к мероприятию и о перспективах сборной России на этих играх.',
                category: 4,
                date: '2023-10-08',
                image: '🏅'
            },
            {
                id: 5,
                title: 'Ментальное здоровье в цифровую эпоху',
                excerpt: 'Как сохранить психологическое благополучие',
                content: 'Современный ритм жизни, постоянное использование цифровых устройств и информационная перегрузка создают новые вызовы для нашего ментального здоровья. В этой статье мы рассмотрим стратегии поддержания психологического благополучия в цифровую эпоху.',
                category: 5,
                date: '2023-10-05',
                image: '🧘'
            },
            {
                id: 6,
                title: 'Мировая экономика в условиях кризиса',
                excerpt: 'Анализ текущей экономической ситуации',
                content: 'Глобальная экономика сталкивается с множеством вызовов: инфляция, энергетический кризис, геополитическая напряженность. В этой статье мы проанализируем текущую экономическую ситуацию и возможные пути выхода из кризиса.',
                category: 7,
                date: '2023-10-03',
                image: '🌍'
            },
            {
                id: 7,
                title: 'Устойчивый туризм: путешествия с заботой о планете',
                excerpt: 'Как стать ответственным путешественником',
                content: 'Устойчивый туризм становится все более популярным как среди путешественников, так и среди туроператоров. В этой статье мы расскажем, как можно минимизировать негативное воздействие на окружающую среду во время путешествий и как выбрать экологичные варианты отдыха.',
                category: 8,
                date: '2023-10-01',
                image: '🌱'
            },
            {
                id: 8,
                title: 'Кибербезопасность в эпоху интернета вещей',
                excerpt: 'Защита умных устройств от кибератак',
                content: 'С ростом числа подключенных устройств в наших домах и офисах вопросы кибербезопасности становятся как никогда актуальными. В этой статье мы рассмотрим основные угрозы для интернета вещей и способы защиты ваших умных устройств.',
                category: 1,
                date: '2023-09-28',
                image: '🔒'
            }
        ];
        
        localStorage.setItem('articles', JSON.stringify(articles));
    }
    
    getCategories() {
        return JSON.parse(localStorage.getItem('categories')) || [];
    }
    
    getArticles() {
        return JSON.parse(localStorage.getItem('articles')) || [];
    }
    
    getUserPreferences() {
        return this.userManager.currentUser ? this.userManager.currentUser.preferences : [];
    }
    
    saveUserPreferences(preferences) {
        this.userManager.updateUserPreferences(preferences);
    }
    
    toggleFavorite(articleId) {
        return this.userManager.toggleFavorite(articleId);
    }
    
    isFavorite(articleId) {
        return this.userManager.isFavorite(articleId);
    }
    
    getFilteredArticles(categoryIds = null) {
        const articles = this.getArticles();
        
        if (!categoryIds || categoryIds.length === 0) {
            return articles;
        }
        
        return articles.filter(article => categoryIds.includes(article.category));
    }
    
    getTheme() {
        return this.userManager.getTheme();
    }
    
    setTheme(theme) {
        this.userManager.setTheme(theme);
    }
}

// Основной класс приложения
class MagazineApp {
    constructor() {
        this.userManager = new UserManager();
        this.db = new Database(this.userManager);
        this.currentSection = 'home';
        this.init();
    }
    
    init() {
        this.applyTheme();
        this.setupEventListeners();
        this.checkAuthState();
    }
    
    checkAuthState() {
        if (this.userManager.currentUser) {
            this.showAuthenticatedUI();
            this.loadHomePage();
        } else {
            this.showAuthUI();
        }
    }
    
    showAuthenticatedUI() {
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userMenu').style.display = 'flex';
        document.getElementById('username').textContent = this.userManager.currentUser.name;
        document.getElementById('userAvatar').textContent = this.userManager.currentUser.name.charAt(0).toUpperCase();
        document.getElementById('profileAvatar').textContent = this.userManager.currentUser.name.charAt(0).toUpperCase();
        document.getElementById('userName').textContent = this.userManager.currentUser.name;
        document.getElementById('userEmail').textContent = this.userManager.currentUser.email;
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.style.display = 'inline-block';
        });
        
        document.getElementById('auth').classList.remove('active');
    }
    
    showAuthUI() {
        document.getElementById('authButtons').style.display = 'flex';
        document.getElementById('userMenu').style.display = 'none';
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.style.display = 'none';
        });
        
        this.showSection('auth');
    }
    
    applyTheme() {
        const theme = this.db.getTheme();
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.getElementById('themeToggle').textContent = '☀️';
        } else {
            document.body.classList.remove('dark-theme');
            document.getElementById('themeToggle').textContent = '🌙';
        }
    }
    
    setupEventListeners() {
        // Навигация
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.showSection(section);
            });
        });
        
        // Переключение темы
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Кнопки авторизации
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showSection('auth');
            this.showLoginForm();
        });
        
        document.getElementById('registerBtn').addEventListener('click', () => {
            this.showSection('auth');
            this.showRegisterForm();
        });
        
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
        
        // Формы авторизации
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });
        
        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });
        
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        document.getElementById('registerFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
        
        // Кнопка изменения предпочтений
        document.getElementById('editPreferences').addEventListener('click', () => {
            this.showSection('categories');
        });
        
        // Сохранение предпочтений
        document.getElementById('savePreferences').addEventListener('click', () => {
            this.savePreferences();
        });
        
        // Кнопки в профиле
        document.getElementById('resetPreferences').addEventListener('click', () => {
            this.resetPreferences();
        });
        
        document.getElementById('clearFavorites').addEventListener('click', () => {
            this.clearFavorites();
        });
        
        // Модальное окно
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('toggleFavorite').addEventListener('click', () => {
            this.toggleFavoriteInModal();
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('articleModal')) {
                this.closeModal();
            }
        });
    }
    
    showSection(sectionName) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(sectionName).classList.add('active');
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionName) {
                link.classList.add('active');
            }
        });
        
        this.currentSection = sectionName;
        
        switch(sectionName) {
            case 'home':
                this.loadHomePage();
                break;
            case 'categories':
                this.loadCategoriesPage();
                break;
            case 'favorites':
                this.loadFavoritesPage();
                break;
            case 'profile':
                this.loadProfilePage();
                break;
        }
    }
    
    showLoginForm() {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        this.clearFormErrors();
    }
    
    showRegisterForm() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        this.clearFormErrors();
    }
    
    clearFormErrors() {
        document.querySelectorAll('.form-error').forEach(error => {
            error.style.display = 'none';
            error.textContent = '';
        });
    }
    
    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        this.clearFormErrors();
        
        if (!email) {
            this.showError('loginEmailError', 'Введите email');
            return;
        }
        
        if (!password) {
            this.showError('loginPasswordError', 'Введите пароль');
            return;
        }
        
        const result = this.userManager.login(email, password);
        
        if (result.success) {
            this.checkAuthState();
            this.showSection('home');
        } else {
            this.showError('loginPasswordError', result.message);
        }
    }
    
    handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        this.clearFormErrors();
        
        if (!name) {
            this.showError('registerNameError', 'Введите имя');
            return;
        }
        
        if (!email) {
            this.showError('registerEmailError', 'Введите email');
            return;
        }
        
        if (!password) {
            this.showError('registerPasswordError', 'Введите пароль');
            return;
        }
        
        if (password.length < 6) {
            this.showError('registerPasswordError', 'Пароль должен содержать не менее 6 символов');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showError('registerConfirmPasswordError', 'Пароли не совпадают');
            return;
        }
        
        const result = this.userManager.register(name, email, password);
        
        if (result.success) {
            this.userManager.login(email, password);
            this.checkAuthState();
            this.showSection('home');
        } else {
            this.showError('registerEmailError', result.message);
        }
    }
    
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    logout() {
        this.userManager.logout();
        this.checkAuthState();
    }
    
    loadHomePage() {
        if (!this.userManager.currentUser) return;
        
        const preferences = this.db.getUserPreferences();
        this.displaySelectedPreferences(preferences);
        
        const articles = this.db.getFilteredArticles(preferences);
        this.displayArticles(articles, 'articlesGrid');
    }
    
    loadCategoriesPage() {
        if (!this.userManager.currentUser) return;
        
        const categories = this.db.getCategories();
        const userPreferences = this.db.getUserPreferences();
        
        const categoriesGrid = document.getElementById('categoriesGrid');
        categoriesGrid.innerHTML = '';
        
        categories.forEach(category => {
            const isSelected = userPreferences.includes(category.id);
            
            const categoryCard = document.createElement('div');
            categoryCard.className = `category-card ${isSelected ? 'selected' : ''}`;
            categoryCard.setAttribute('data-id', category.id);
            
            categoryCard.innerHTML = `
                <div class="category-icon">${category.icon}</div>
                <div class="category-content">
                    <h3 class="category-title">${category.name}</h3>
                    <p class="category-description">${category.description}</p>
                </div>
            `;
            
            categoryCard.addEventListener('click', () => {
                categoryCard.classList.toggle('selected');
            });
            
            categoriesGrid.appendChild(categoryCard);
        });
    }
    
    loadFavoritesPage() {
        if (!this.userManager.currentUser) return;
        
        const favorites = this.userManager.currentUser.favorites;
        const articles = this.db.getArticles().filter(article => 
            favorites.includes(article.id)
        );
        
        this.displayArticles(articles, 'favoritesGrid');
    }
    
    loadProfilePage() {
        if (!this.userManager.currentUser) return;
        
        const preferences = this.db.getUserPreferences();
        const favorites = this.userManager.currentUser.favorites;
        
        document.getElementById('preferencesCount').textContent = preferences.length;
        document.getElementById('favoritesCount').textContent = favorites.length;
    }
    
    displaySelectedPreferences(preferences) {
        const categories = this.db.getCategories();
        const selectedPreferencesContainer = document.getElementById('selectedPreferences');
        selectedPreferencesContainer.innerHTML = '';
        
        if (preferences.length === 0) {
            selectedPreferencesContainer.innerHTML = '<p>Вы еще не выбрали предпочтения. Нажмите "Изменить предпочтения", чтобы настроить ленту.</p>';
            return;
        }
        
        preferences.forEach(prefId => {
            const category = categories.find(cat => cat.id === prefId);
            if (category) {
                const tag = document.createElement('span');
                tag.className = 'preference-tag';
                tag.textContent = category.name;
                selectedPreferencesContainer.appendChild(tag);
            }
        });
    }
    
    displayArticles(articles, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        if (articles.length === 0) {
            container.innerHTML = '<p>Статьи не найдены. Попробуйте изменить ваши предпочтения.</p>';
            return;
        }
        
        articles.forEach(article => {
            const category = this.db.getCategories().find(cat => cat.id === article.category);
            const isFavorite = this.db.isFavorite(article.id);
            
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            
            articleCard.innerHTML = `
                <div class="article-image">${article.image}</div>
                <div class="article-content">
                    <div class="article-meta">
                        <span class="article-category">${category ? category.name : 'Без категории'}</span>
                        <span>${this.formatDate(article.date)}</span>
                    </div>
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-actions">
                        <button class="btn-primary read-more" data-id="${article.id}">Читать</button>
                        <button class="btn-secondary favorite-btn" data-id="${article.id}">
                            ${isFavorite ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>
            `;
            
            container.appendChild(articleCard);
        });
        
        container.querySelectorAll('.read-more').forEach(button => {
            button.addEventListener('click', (e) => {
                const articleId = parseInt(e.target.getAttribute('data-id'));
                this.showArticleModal(articleId);
            });
        });
        
        container.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const articleId = parseInt(e.target.getAttribute('data-id'));
                this.toggleFavorite(articleId, e.target);
            });
        });
    }
    
    showArticleModal(articleId) {
        const article = this.db.getArticles().find(a => a.id === articleId);
        if (!article) return;
        
        const category = this.db.getCategories().find(cat => cat.id === article.category);
        const isFavorite = this.db.isFavorite(articleId);
        
        document.getElementById('modalTitle').textContent = article.title;
        document.getElementById('modalCategory').textContent = category ? category.name : 'Без категории';
        document.getElementById('modalDate').textContent = this.formatDate(article.date);
        document.getElementById('modalContent').textContent = article.content;
        
        const favoriteButton = document.getElementById('toggleFavorite');
        favoriteButton.setAttribute('data-id', articleId);
        favoriteButton.textContent = isFavorite ? 'Убрать из избранного' : 'Добавить в избранное';
        
        document.getElementById('articleModal').style.display = 'block';
    }
    
    closeModal() {
        document.getElementById('articleModal').style.display = 'none';
    }
    
    toggleFavorite(articleId, button) {
        const isAdded = this.db.toggleFavorite(articleId);
        
        if (button) {
            button.textContent = isAdded ? '❤️' : '🤍';
        }
        
        if (this.currentSection === 'profile') {
            this.loadProfilePage();
        }
        
        if (this.currentSection === 'favorites') {
            this.loadFavoritesPage();
        }
    }
    
    toggleFavoriteInModal() {
        const button = document.getElementById('toggleFavorite');
        const articleId = parseInt(button.getAttribute('data-id'));
        
        const isAdded = this.db.toggleFavorite(articleId);
        button.textContent = isAdded ? 'Убрать из избранного' : 'Добавить в избранное';
        
        const articleButton = document.querySelector(`.favorite-btn[data-id="${articleId}"]`);
        if (articleButton) {
            articleButton.textContent = isAdded ? '❤️' : '🤍';
        }
        
        if (this.currentSection === 'profile') {
            this.loadProfilePage();
        }
        
        if (this.currentSection === 'favorites') {
            this.loadFavoritesPage();
        }
    }
    
    savePreferences() {
        const selectedCategories = document.querySelectorAll('.category-card.selected');
        const preferences = Array.from(selectedCategories).map(card => 
            parseInt(card.getAttribute('data-id'))
        );
        
        this.db.saveUserPreferences(preferences);
        this.showSection('home');
    }
    
    resetPreferences() {
        if (confirm('Вы уверены, что хотите сбросить ваши предпочтения?')) {
            this.db.saveUserPreferences([]);
            this.loadHomePage();
            this.loadProfilePage();
        }
    }
    
    clearFavorites() {
        if (confirm('Вы уверены, что хотите очистить избранное?')) {
            this.userManager.currentUser.favorites = [];
            this.userManager.saveUserData();
            this.loadFavoritesPage();
            this.loadProfilePage();
        }
    }
    
    toggleTheme() {
        const currentTheme = this.db.getTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.db.setTheme(newTheme);
        this.applyTheme();
    }
    
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new MagazineApp();
});