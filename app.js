// Quiz Genius Ultimate - Main Application Logic
// The Most Beautiful Quiz Platform

// Application State Management (using JavaScript variables since localStorage is restricted)
class QuizApp {
    constructor() {
        this.currentSection = 'home';
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.bookmarkedQuestions = [];
        this.userProgress = {
            quizzesTaken: 0,
            totalScore: 0,
            subjectScores: {},
            achievements: [],
            streakDays: 0,
            lastQuizDate: null
        };
        this.theme = 'light';
        this.timer = null;
        this.timeRemaining = 0;
        
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.setupTheme();
        this.animateHeroStats();
        this.initializeAchievements();
        this.updateDashboard();
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                this.showSection(targetId);
            }
        });

        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Mobile navigation
        document.getElementById('nav-toggle')?.addEventListener('click', () => {
            this.toggleMobileNav();
        });

        // Hero CTA
        document.getElementById('start-quiz-btn')?.addEventListener('click', () => {
            this.showQuizModeSelection();
        });

        // Subject cards
        document.querySelectorAll('.subject-card').forEach(card => {
            card.addEventListener('click', () => {
                const subject = card.dataset.subject;
                this.startSubjectQuiz(subject);
            });
        });

        // Mode cards
        document.querySelectorAll('.mode-card').forEach(card => {
            const button = card.querySelector('.mode-btn');
            button?.addEventListener('click', (e) => {
                e.stopPropagation();
                const mode = card.dataset.mode;
                this.configureQuiz(mode);
            });
        });

        // Quiz configuration
        document.getElementById('back-to-home')?.addEventListener('click', () => {
            this.showSection('home');
        });

        document.getElementById('start-configured-quiz')?.addEventListener('click', () => {
            this.startConfiguredQuiz();
        });

        // Quiz interface
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectAnswer(parseInt(btn.dataset.option));
            });
        });

        document.getElementById('next-btn')?.addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('skip-btn')?.addEventListener('click', () => {
            this.skipQuestion();
        });

        document.getElementById('bookmark-btn')?.addEventListener('click', () => {
            this.bookmarkCurrentQuestion();
        });

        // Results actions
        document.getElementById('take-another-quiz')?.addEventListener('click', () => {
            this.showSection('home');
        });

        document.getElementById('review-answers')?.addEventListener('click', () => {
            this.showAnswerReview();
        });

        document.getElementById('export-results')?.addEventListener('click', () => {
            this.exportResults();
        });

        // Study tools
        document.getElementById('view-bookmarks')?.addEventListener('click', () => {
            this.showBookmarks();
        });

        document.getElementById('create-custom-quiz')?.addEventListener('click', () => {
            this.createCustomQuiz();
        });

        document.getElementById('view-notes')?.addEventListener('click', () => {
            this.showNotes();
        });

        document.getElementById('search-questions')?.addEventListener('click', () => {
            this.showSearchInterface();
        });

        document.getElementById('perform-search')?.addEventListener('click', () => {
            this.performSearch();
        });
    }

    setupTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.theme = prefersDark ? 'dark' : 'light';
        this.updateThemeIcon();

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!document.documentElement.hasAttribute('data-color-scheme')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.updateThemeIcon();
            }
        });
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-color-scheme', this.theme);
        this.updateThemeIcon();
        this.showToast('Theme switched to ' + this.theme + ' mode', 'info');
    }

    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.theme === 'light' ? '🌙' : '☀️';
        }
    }

    toggleMobileNav() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        navMenu?.classList.toggle('active');
        navToggle?.classList.toggle('active');
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            this.currentSection = sectionId;

            // Update navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector(`[href="#${sectionId}"]`)?.classList.add('active');

            // Handle section-specific logic
            this.handleSectionChange(sectionId);
        }
    }

    handleSectionChange(sectionId) {
        switch(sectionId) {
            case 'dashboard':
                this.updateDashboard();
                this.renderProgressCharts();
                break;
            case 'study-tools':
                this.updateStudyToolsStats();
                break;
            case 'progress':
                this.renderProgressAnalytics();
                break;
        }
    }

    animateHeroStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    this.animateCounter(entry.target, 0, target, 2000);
                    observer.unobserve(entry.target);
                }
            });
        });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * this.easeOutQuart(progress));
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        requestAnimationFrame(update);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    showQuizModeSelection() {
        this.showSection('home');
        document.querySelector('.quiz-modes').scrollIntoView({ behavior: 'smooth' });
    }

    startSubjectQuiz(subject) {
        this.currentQuiz = {
            mode: 'subject_specific',
            subject: subject,
            difficulty: 'mixed',
            questionCount: 10,
            timeLimit: 0
        };
        this.configureQuiz('subject_specific', subject);
    }

    configureQuiz(mode, preselectedSubject = null) {
        this.showSection('quiz-config');
        
        const selectedModeEl = document.getElementById('selected-mode');
        const subjectSelection = document.getElementById('subject-selection');
        const timerConfig = document.getElementById('timer-config');
        
        // Update mode display
        const modeNames = {
            'subject_specific': '📚 Subject Quiz',
            'mixed_quiz': '🎲 Mixed Quiz',
            'timed_challenge': '⏱️ Timed Challenge',
            'practice_mode': '🧘 Practice Mode',
            'adaptive_quiz': '🤖 Adaptive Quiz',
            'custom_quiz': '📝 Custom Quiz'
        };
        selectedModeEl.textContent = modeNames[mode] || mode;
        
        // Show/hide subject selection
        if (mode === 'subject_specific') {
            subjectSelection.style.display = 'block';
            if (preselectedSubject) {
                document.getElementById('subject-select').value = preselectedSubject;
            }
        } else {
            subjectSelection.style.display = 'none';
        }
        
        // Configure timer based on mode
        if (mode === 'timed_challenge') {
            timerConfig.style.display = 'block';
            document.getElementById('time-limit').value = '600'; // Default 10 minutes
        } else if (mode === 'practice_mode') {
            timerConfig.style.display = 'block';
            document.getElementById('time-limit').value = '0'; // No limit
        } else {
            timerConfig.style.display = 'block';
        }

        this.currentQuiz = { mode, subject: preselectedSubject };
    }

    startConfiguredQuiz() {
        const config = {
            mode: this.currentQuiz.mode,
            subject: document.getElementById('subject-select')?.value || null,
            questionCount: parseInt(document.getElementById('question-count').value),
            difficulty: document.getElementById('difficulty-select').value,
            timeLimit: parseInt(document.getElementById('time-limit').value)
        };

        this.currentQuiz = {
            ...config,
            questions: this.generateQuestions(config),
            startTime: Date.now(),
            answers: [],
            score: 0
        };

        this.currentQuestionIndex = 0;
        this.showLoadingOverlay();
        
        setTimeout(() => {
            this.hideLoadingOverlay();
            this.startQuiz();
        }, 1500);
    }

    generateQuestions(config) {
        // Generate questions based on configuration
        const allQuestions = this.getQuestionDatabase();
        let filteredQuestions = allQuestions;

        // Filter by subject
        if (config.subject) {
            filteredQuestions = allQuestions.filter(q => q.subject.toLowerCase().replace(/\s+/g, '_') === config.subject);
        }

        // Filter by difficulty
        if (config.difficulty !== 'mixed') {
            filteredQuestions = filteredQuestions.filter(q => q.difficulty.toLowerCase() === config.difficulty);
        }

        // Shuffle and select required number
        const shuffled = this.shuffleArray([...filteredQuestions]);
        return shuffled.slice(0, Math.min(config.questionCount, shuffled.length));
    }

    getQuestionDatabase() {
        return [
            {
                id: 1,
                subject: "Chemistry",
                category: "Nobel Prizes",
                question: "Who was awarded the Nobel Prize in Chemistry in 1911 for discovering radium and polonium?",
                options: ["John Dalton", "Dmitri Mendeleev", "Emil Fischer", "Marie Curie"],
                correct: 3,
                difficulty: "Medium",
                explanation: "Marie Curie won the 1911 Nobel Prize in Chemistry for her discovery of radium and polonium."
            },
            {
                id: 2,
                subject: "Current Affairs",
                category: "Sports",
                question: "Which Indian shooter won gold in men's 10m air rifle at ISSF World Cup 2025?",
                options: ["Arjun Babuta", "Rudrankksh Patil", "Kiran Jadhav", "Divyansh Panwar"],
                correct: 1,
                difficulty: "Medium",
                explanation: "Rudrankksh Balasaheb Patil won the gold medal in Buenos Aires."
            },
            {
                id: 3,
                subject: "General Knowledge",
                category: "Music",
                question: "How many strings does a standard guitar have?",
                options: ["4", "5", "6", "7"],
                correct: 2,
                difficulty: "Easy",
                explanation: "A standard guitar has 6 strings tuned to E-A-D-G-B-E."
            },
            {
                id: 4,
                subject: "Mathematics",
                category: "Number Systems",
                question: "Every rational number is also a:",
                options: ["Natural number", "Whole number", "Real number", "Integer"],
                correct: 2,
                difficulty: "Easy",
                explanation: "All rational numbers are real numbers, but not all are natural, whole, or integers."
            },
            {
                id: 5,
                subject: "Science",
                category: "Physics",
                question: "What is the speed of light in vacuum?",
                options: ["3 × 10⁸ m/s", "3 × 10⁷ m/s", "3 × 10⁹ m/s", "3 × 10⁶ m/s"],
                correct: 0,
                difficulty: "Easy",
                explanation: "The speed of light in vacuum is approximately 3 × 10⁸ meters per second."
            },
            {
                id: 6,
                subject: "Chemistry",
                category: "Periodic Table",
                question: "Which element has the atomic number 1?",
                options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
                correct: 1,
                difficulty: "Easy",
                explanation: "Hydrogen has atomic number 1, making it the first element in the periodic table."
            },
            {
                id: 7,
                subject: "Current Affairs",
                category: "Technology",
                question: "Which company launched the most advanced AI model in 2025?",
                options: ["OpenAI", "Google", "Meta", "Microsoft"],
                correct: 0,
                difficulty: "Medium",
                explanation: "OpenAI continued to lead in AI model development throughout 2025."
            },
            {
                id: 8,
                subject: "General Knowledge",
                category: "Geography",
                question: "Which is the smallest country in the world?",
                options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
                correct: 2,
                difficulty: "Easy",
                explanation: "Vatican City is the smallest sovereign nation in the world by both area and population."
            },
            {
                id: 9,
                subject: "Mathematics",
                category: "Geometry",
                question: "What is the sum of angles in a triangle?",
                options: ["90°", "180°", "270°", "360°"],
                correct: 1,
                difficulty: "Easy",
                explanation: "The sum of all interior angles in any triangle is always 180 degrees."
            },
            {
                id: 10,
                subject: "Science",
                category: "Biology",
                question: "Which organ in the human body produces insulin?",
                options: ["Liver", "Kidney", "Pancreas", "Heart"],
                correct: 2,
                difficulty: "Medium",
                explanation: "The pancreas produces insulin, which regulates blood sugar levels."
            },
            {
                id: 11,
                subject: "Chemistry",
                category: "Organic Chemistry",
                question: "What is the molecular formula of methane?",
                options: ["CH₃", "CH₄", "C₂H₄", "C₂H₆"],
                correct: 1,
                difficulty: "Easy",
                explanation: "Methane has the molecular formula CH₄, consisting of one carbon and four hydrogen atoms."
            },
            {
                id: 12,
                subject: "Current Affairs",
                category: "Politics",
                question: "Who is the current Secretary-General of the United Nations (2025)?",
                options: ["António Guterres", "Ban Ki-moon", "Kofi Annan", "Dag Hammarskjöld"],
                correct: 0,
                difficulty: "Medium",
                explanation: "António Guterres continues to serve as UN Secretary-General through 2025."
            },
            {
                id: 13,
                subject: "General Knowledge",
                category: "Literature",
                question: "Who wrote the novel '1984'?",
                options: ["Aldous Huxley", "Ray Bradbury", "George Orwell", "H.G. Wells"],
                correct: 2,
                difficulty: "Medium",
                explanation: "George Orwell wrote the dystopian novel '1984', published in 1949."
            },
            {
                id: 14,
                subject: "Mathematics",
                category: "Algebra",
                question: "What is the value of x in the equation 2x + 6 = 14?",
                options: ["2", "4", "6", "8"],
                correct: 1,
                difficulty: "Easy",
                explanation: "Solving: 2x + 6 = 14, so 2x = 8, therefore x = 4."
            },
            {
                id: 15,
                subject: "Science",
                category: "Environmental Science",
                question: "What is the main cause of ozone layer depletion?",
                options: ["Carbon dioxide", "Methane", "Chlorofluorocarbons", "Nitrogen oxides"],
                correct: 2,
                difficulty: "Medium",
                explanation: "Chlorofluorocarbons (CFCs) are the primary cause of ozone layer depletion."
            }
        ];
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    startQuiz() {
        this.showSection('quiz');
        this.setupTimer();
        this.displayQuestion();
        this.updateProgress();
    }

    setupTimer() {
        if (this.currentQuiz.timeLimit > 0) {
            this.timeRemaining = this.currentQuiz.timeLimit;
            document.getElementById('quiz-timer').style.display = 'flex';
            this.startTimer();
        } else {
            document.getElementById('quiz-timer').style.display = 'none';
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.endQuiz();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timerText = document.getElementById('timer-text');
        if (timerText) {
            timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Add warning color when time is running low
            const timerEl = document.getElementById('quiz-timer');
            if (this.timeRemaining <= 60) {
                timerEl?.classList.add('warning');
            }
        }
    }

    displayQuestion() {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        if (!question) {
            this.endQuiz();
            return;
        }

        // Update question display
        document.getElementById('question-subject').textContent = question.subject;
        document.getElementById('question-difficulty').textContent = question.difficulty;
        document.getElementById('question-text').textContent = question.question;

        // Update options
        const optionBtns = document.querySelectorAll('.option-btn');
        optionBtns.forEach((btn, index) => {
            if (question.options[index]) {
                btn.style.display = 'flex';
                btn.querySelector('.option-text').textContent = question.options[index];
                btn.classList.remove('selected', 'correct', 'incorrect');
                btn.disabled = false;
            } else {
                btn.style.display = 'none';
            }
        });

        // Reset next button
        document.getElementById('next-btn').disabled = true;
        
        // Hide explanation panel
        document.getElementById('explanation-panel').style.display = 'none';
    }

    selectAnswer(optionIndex) {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const optionBtns = document.querySelectorAll('.option-btn');
        
        // Clear previous selections
        optionBtns.forEach(btn => btn.classList.remove('selected'));
        
        // Mark selected option
        optionBtns[optionIndex].classList.add('selected');
        
        // Store answer
        this.currentQuiz.answers[this.currentQuestionIndex] = {
            questionId: question.id,
            selectedOption: optionIndex,
            correct: optionIndex === question.correct,
            timeSpent: Date.now() - this.currentQuiz.startTime
        };
        
        // Enable next button
        document.getElementById('next-btn').disabled = false;
        
        // Show explanation in practice mode
        if (this.currentQuiz.mode === 'practice_mode') {
            this.showExplanation(question, optionIndex);
        }
    }

    showExplanation(question, selectedOption) {
        const explanationPanel = document.getElementById('explanation-panel');
        const explanationText = document.getElementById('explanation-text');
        const optionBtns = document.querySelectorAll('.option-btn');
        
        // Mark correct and incorrect answers
        optionBtns.forEach((btn, index) => {
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === selectedOption && index !== question.correct) {
                btn.classList.add('incorrect');
            }
        });
        
        // Show explanation
        explanationText.textContent = question.explanation;
        explanationPanel.style.display = 'block';
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.currentQuiz.questions.length) {
            this.endQuiz();
        } else {
            this.displayQuestion();
            this.updateProgress();
        }
    }

    skipQuestion() {
        this.currentQuiz.answers[this.currentQuestionIndex] = {
            questionId: this.currentQuiz.questions[this.currentQuestionIndex].id,
            selectedOption: -1,
            correct: false,
            skipped: true,
            timeSpent: 0
        };
        
        this.nextQuestion();
    }

    bookmarkCurrentQuestion() {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        
        if (!this.bookmarkedQuestions.find(q => q.id === question.id)) {
            this.bookmarkedQuestions.push(question);
            this.showToast('Question bookmarked!', 'success');
        } else {
            this.showToast('Question already bookmarked', 'info');
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.currentQuiz.questions.length}`;
    }

    endQuiz() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.calculateResults();
        this.updateUserProgress();
        this.checkAchievements();
        this.displayResults();
    }

    calculateResults() {
        const answers = this.currentQuiz.answers;
        const correctAnswers = answers.filter(a => a.correct).length;
        const totalQuestions = this.currentQuiz.questions.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        const totalTime = Date.now() - this.currentQuiz.startTime;
        const avgTimePerQuestion = totalTime / totalQuestions;
        
        this.currentQuiz.results = {
            score: percentage,
            correctAnswers,
            incorrectAnswers: totalQuestions - correctAnswers,
            totalQuestions,
            totalTime,
            avgTimePerQuestion,
            subjectBreakdown: this.calculateSubjectBreakdown(),
            newAchievements: []
        };
    }

    calculateSubjectBreakdown() {
        const breakdown = {};
        
        this.currentQuiz.questions.forEach((question, index) => {
            const subject = question.subject;
            if (!breakdown[subject]) {
                breakdown[subject] = { correct: 0, total: 0 };
            }
            breakdown[subject].total++;
            
            if (this.currentQuiz.answers[index]?.correct) {
                breakdown[subject].correct++;
            }
        });
        
        // Convert to percentages
        Object.keys(breakdown).forEach(subject => {
            const data = breakdown[subject];
            breakdown[subject].percentage = Math.round((data.correct / data.total) * 100);
        });
        
        return breakdown;
    }

    updateUserProgress() {
        this.userProgress.quizzesTaken++;
        this.userProgress.totalScore += this.currentQuiz.results.score;
        this.userProgress.lastQuizDate = new Date().toDateString();
        
        // Update subject scores
        const breakdown = this.currentQuiz.results.subjectBreakdown;
        Object.keys(breakdown).forEach(subject => {
            if (!this.userProgress.subjectScores[subject]) {
                this.userProgress.subjectScores[subject] = [];
            }
            this.userProgress.subjectScores[subject].push(breakdown[subject].percentage);
        });
    }

    checkAchievements() {
        const newAchievements = [];
        
        // First Steps
        if (this.userProgress.quizzesTaken === 1 && !this.userProgress.achievements.includes('first_steps')) {
            this.userProgress.achievements.push('first_steps');
            newAchievements.push(this.getAchievementData('first_steps'));
        }
        
        // Perfect Score
        if (this.currentQuiz.results.score === 100 && !this.userProgress.achievements.includes('perfect_score')) {
            this.userProgress.achievements.push('perfect_score');
            newAchievements.push(this.getAchievementData('perfect_score'));
        }
        
        // Speed Master
        if (this.currentQuiz.timeLimit > 0 && this.currentQuiz.results.totalTime < (this.currentQuiz.timeLimit * 0.8 * 1000)) {
            if (!this.userProgress.achievements.includes('speed_master')) {
                this.userProgress.achievements.push('speed_master');
                newAchievements.push(this.getAchievementData('speed_master'));
            }
        }
        
        // Subject Expert achievements
        Object.keys(this.currentQuiz.results.subjectBreakdown).forEach(subject => {
            const percentage = this.currentQuiz.results.subjectBreakdown[subject].percentage;
            const achievementId = `${subject.toLowerCase().replace(/\s+/g, '_')}_expert`;
            
            if (percentage >= 95 && !this.userProgress.achievements.includes(achievementId)) {
                this.userProgress.achievements.push(achievementId);
                newAchievements.push({
                    id: achievementId,
                    name: `${subject} Expert`,
                    description: `Score 95%+ in ${subject} quiz`,
                    icon: this.getSubjectIcon(subject)
                });
            }
        });
        
        // Knowledge Seeker
        if (this.userProgress.quizzesTaken >= 10 && !this.userProgress.achievements.includes('knowledge_seeker')) {
            this.userProgress.achievements.push('knowledge_seeker');
            newAchievements.push(this.getAchievementData('knowledge_seeker'));
        }
        
        this.currentQuiz.results.newAchievements = newAchievements;
    }

    getAchievementData(id) {
        const achievements = {
            'first_steps': { name: 'First Steps', description: 'Complete your first quiz', icon: '🎯' },
            'perfect_score': { name: 'Perfect Score', description: 'Achieve 100% accuracy', icon: '🏆' },
            'speed_master': { name: 'Speed Master', description: 'Complete timed quiz quickly', icon: '⚡' },
            'knowledge_seeker': { name: 'Knowledge Seeker', description: 'Complete 10 quizzes', icon: '📚' },
            'streak_master': { name: 'Streak Master', description: '5 consecutive days', icon: '🔥' }
        };
        return { id, ...achievements[id] };
    }

    getSubjectIcon(subject) {
        const icons = {
            'Chemistry': '⚗️',
            'Current Affairs': '📰',
            'General Knowledge': '🌍',
            'Mathematics': '🔢',
            'Science': '🔬'
        };
        return icons[subject] || '📖';
    }

    displayResults() {
        this.showSection('results');
        const results = this.currentQuiz.results;
        
        // Update score display
        document.getElementById('score-percentage').textContent = `${results.score}%`;
        document.getElementById('correct-count').textContent = results.correctAnswers;
        document.getElementById('incorrect-count').textContent = results.incorrectAnswers;
        document.getElementById('accuracy').textContent = `${results.score}%`;
        
        // Format time
        const minutes = Math.floor(results.totalTime / 60000);
        const seconds = Math.floor((results.totalTime % 60000) / 1000);
        document.getElementById('time-taken').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Update score circle
        this.updateScoreCircle(results.score);
        
        // Display achievements
        this.displayNewAchievements(results.newAchievements);
        
        // Create charts
        this.createResultsCharts();
        
        // Show improvement suggestions
        this.showImprovementSuggestions();
    }

    updateScoreCircle(score) {
        const circle = document.querySelector('.score-circle');
        if (circle) {
            const angle = (score / 100) * 360;
            circle.style.background = `conic-gradient(var(--color-primary) 0deg ${angle}deg, var(--color-secondary) ${angle}deg 360deg)`;
        }
    }

    displayNewAchievements(achievements) {
        const achievementsList = document.getElementById('achievements-list');
        achievementsList.innerHTML = '';
        
        if (achievements.length === 0) {
            achievementsList.innerHTML = '<p>No new achievements this time. Keep going!</p>';
            return;
        }
        
        achievements.forEach(achievement => {
            const achievementEl = document.createElement('div');
            achievementEl.className = 'achievement-item';
            achievementEl.innerHTML = `
                <span class="achievement-icon">${achievement.icon}</span>
                <span>${achievement.name}</span>
            `;
            achievementsList.appendChild(achievementEl);
        });
    }

    createResultsCharts() {
        // Subject breakdown chart
        this.createSubjectChart();
        
        // Performance trend chart
        this.createPerformanceChart();
    }

    createSubjectChart() {
        const ctx = document.getElementById('subject-chart');
        if (!ctx) return;
        
        const breakdown = this.currentQuiz.results.subjectBreakdown;
        const subjects = Object.keys(breakdown);
        const scores = subjects.map(subject => breakdown[subject].percentage);
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: subjects,
                datasets: [{
                    data: scores,
                    backgroundColor: colors.slice(0, subjects.length),
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    createPerformanceChart() {
        const ctx = document.getElementById('performance-chart');
        if (!ctx) return;
        
        const questions = this.currentQuiz.questions;
        const answers = this.currentQuiz.answers;
        
        const correctData = questions.map((_, index) => answers[index]?.correct ? 1 : 0);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: questions.map((_, index) => `Q${index + 1}`),
                datasets: [{
                    label: 'Correct Answers',
                    data: correctData,
                    backgroundColor: '#10b981',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return value === 1 ? 'Correct' : 'Incorrect';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    showImprovementSuggestions() {
        const suggestionsContainer = document.querySelector('.suggestions-list');
        suggestionsContainer.innerHTML = '';
        
        const suggestions = this.generateImprovementSuggestions();
        
        suggestions.forEach(suggestion => {
            const suggestionEl = document.createElement('div');
            suggestionEl.className = 'suggestion-item';
            suggestionEl.innerHTML = `
                <div class="suggestion-icon">${suggestion.icon}</div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${suggestion.title}</div>
                    <p class="suggestion-description">${suggestion.description}</p>
                </div>
            `;
            suggestionsContainer.appendChild(suggestionEl);
        });
    }

    generateImprovementSuggestions() {
        const suggestions = [];
        const results = this.currentQuiz.results;
        
        if (results.score < 60) {
            suggestions.push({
                icon: '📚',
                title: 'Study Fundamentals',
                description: 'Focus on basic concepts and use our study notes to strengthen your foundation.'
            });
        }
        
        if (results.score < 80) {
            suggestions.push({
                icon: '🎯',
                title: 'Practice More',
                description: 'Take more practice quizzes to improve your accuracy and confidence.'
            });
        }
        
        const breakdown = results.subjectBreakdown;
        Object.keys(breakdown).forEach(subject => {
            if (breakdown[subject].percentage < 70) {
                suggestions.push({
                    icon: this.getSubjectIcon(subject),
                    title: `Improve ${subject}`,
                    description: `Your ${subject} score was ${breakdown[subject].percentage}%. Focus on this subject for better results.`
                });
            }
        });
        
        if (this.currentQuiz.mode === 'timed_challenge' && results.avgTimePerQuestion > 90000) {
            suggestions.push({
                icon: '⏱️',
                title: 'Work on Speed',
                description: 'Practice quick decision-making to improve your time management in timed quizzes.'
            });
        }
        
        return suggestions.length > 0 ? suggestions : [{
            icon: '🎉',
            title: 'Excellent Performance!',
            description: 'Keep up the great work and continue challenging yourself with harder questions.'
        }];
    }

    showAnswerReview() {
        // Implementation for detailed answer review
        this.showToast('Answer review feature - detailed implementation would show incorrect answers with explanations', 'info');
    }

    exportResults() {
        const results = this.currentQuiz.results;
        const exportData = {
            quizMode: this.currentQuiz.mode,
            subject: this.currentQuiz.subject,
            score: results.score,
            correctAnswers: results.correctAnswers,
            totalQuestions: results.totalQuestions,
            timeSpent: this.formatTime(results.totalTime),
            date: new Date().toLocaleDateString(),
            achievements: results.newAchievements.map(a => a.name)
        };
        
        // Create downloadable content
        const content = this.generateResultsReport(exportData);
        this.downloadFile('quiz-results.txt', content);
        
        this.showToast('Results exported successfully!', 'success');
    }

    generateResultsReport(data) {
        return `
═══════════════════════════════════════
        QUIZ GENIUS ULTIMATE
        QUIZ RESULTS REPORT
═══════════════════════════════════════

Date: ${data.date}
Quiz Mode: ${data.quizMode.replace('_', ' ').toUpperCase()}
Subject: ${data.subject || 'Mixed'}

───────────────────────────────────────
             PERFORMANCE
───────────────────────────────────────

Final Score: ${data.score}%
Correct Answers: ${data.correctAnswers}/${data.totalQuestions}
Time Spent: ${data.timeSpent}

───────────────────────────────────────
            ACHIEVEMENTS
───────────────────────────────────────

${data.achievements.length > 0 ? data.achievements.join('\n') : 'No new achievements'}

═══════════════════════════════════════
        Generated by Quiz Genius Ultimate
═══════════════════════════════════════
        `;
    }

    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    formatTime(milliseconds) {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }

    updateDashboard() {
        // Update stats
        document.getElementById('total-quizzes').textContent = this.userProgress.quizzesTaken;
        
        const avgScore = this.userProgress.quizzesTaken > 0 
            ? Math.round(this.userProgress.totalScore / this.userProgress.quizzesTaken) 
            : 0;
        document.getElementById('avg-score').textContent = `${avgScore}%`;
        
        document.getElementById('current-streak').textContent = this.userProgress.streakDays;
        document.getElementById('achievements-earned').textContent = this.userProgress.achievements.length;
        
        // Update all achievements display
        this.updateAllAchievements();
    }

    updateAllAchievements() {
        const achievementsGrid = document.getElementById('all-achievements');
        if (!achievementsGrid) return;
        
        const allPossibleAchievements = [
            { id: 'first_steps', name: 'First Steps', description: 'Complete your first quiz', icon: '🎯' },
            { id: 'perfect_score', name: 'Perfect Score', description: 'Achieve 100% accuracy', icon: '🏆' },
            { id: 'speed_master', name: 'Speed Master', description: 'Complete timed quiz quickly', icon: '⚡' },
            { id: 'chemistry_expert', name: 'Chemistry Expert', description: 'Score 95%+ in Chemistry', icon: '⚗️' },
            { id: 'current_affairs_expert', name: 'Current Affairs Expert', description: 'Score 95%+ in Current Affairs', icon: '📰' },
            { id: 'general_knowledge_expert', name: 'General Knowledge Expert', description: 'Score 95%+ in General Knowledge', icon: '🌍' },
            { id: 'mathematics_expert', name: 'Mathematics Expert', description: 'Score 95%+ in Mathematics', icon: '🔢' },
            { id: 'science_expert', name: 'Science Expert', description: 'Score 95%+ in Science', icon: '🔬' },
            { id: 'knowledge_seeker', name: 'Knowledge Seeker', description: 'Complete 10 quizzes', icon: '📚' },
            { id: 'streak_master', name: 'Streak Master', description: '5 consecutive days', icon: '🔥' }
        ];
        
        achievementsGrid.innerHTML = '';
        
        allPossibleAchievements.forEach(achievement => {
            const earned = this.userProgress.achievements.includes(achievement.id);
            const achievementEl = document.createElement('div');
            achievementEl.className = `achievement-card ${earned ? 'earned' : 'locked'}`;
            achievementEl.innerHTML = `
                <div class="achievement-badge">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <p class="achievement-description">${achievement.description}</p>
                </div>
            `;
            achievementsGrid.appendChild(achievementEl);
        });
    }

    renderProgressCharts() {
        // Progress over time chart
        const ctx = document.getElementById('progress-chart');
        if (!ctx) return;
        
        // Generate sample progress data
        const progressData = this.generateProgressData();
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: progressData.dates,
                datasets: [{
                    label: 'Average Score',
                    data: progressData.scores,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    generateProgressData() {
        // Generate sample data for demonstration
        const dates = [];
        const scores = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            scores.push(Math.floor(Math.random() * 30) + 60); // Simulate improving scores
        }
        
        return { dates, scores };
    }

    updateStudyToolsStats() {
        document.getElementById('bookmarked-count').textContent = this.bookmarkedQuestions.length;
    }

    showBookmarks() {
        const bookmarksViewer = document.getElementById('bookmarks-viewer');
        const bookmarksList = document.getElementById('bookmarks-list');
        
        // Hide other viewers
        document.getElementById('notes-viewer').style.display = 'none';
        document.getElementById('search-interface').style.display = 'none';
        
        bookmarksViewer.style.display = 'block';
        bookmarksList.innerHTML = '';
        
        if (this.bookmarkedQuestions.length === 0) {
            bookmarksList.innerHTML = '<p>No bookmarked questions yet. Start taking quizzes and bookmark interesting questions!</p>';
            return;
        }
        
        this.bookmarkedQuestions.forEach(question => {
            const bookmarkEl = document.createElement('div');
            bookmarkEl.className = 'bookmark-item';
            bookmarkEl.innerHTML = `
                <div class="bookmark-question">${question.question}</div>
                <div class="bookmark-meta">
                    <span>Subject: ${question.subject}</span>
                    <span>Difficulty: ${question.difficulty}</span>
                    <span>Category: ${question.category}</span>
                </div>
            `;
            bookmarksList.appendChild(bookmarkEl);
        });
    }

    createCustomQuiz() {
        if (this.bookmarkedQuestions.length === 0) {
            this.showToast('No bookmarked questions available. Bookmark some questions first!', 'warning');
            return;
        }
        
        this.currentQuiz = {
            mode: 'custom',
            subject: 'Mixed',
            questions: [...this.bookmarkedQuestions].slice(0, 10), // Limit to 10 questions
            questionCount: Math.min(this.bookmarkedQuestions.length, 10),
            difficulty: 'mixed',
            timeLimit: 0,
            startTime: Date.now(),
            answers: [],
            score: 0
        };
        
        this.currentQuestionIndex = 0;
        this.startQuiz();
        this.showToast('Custom quiz created from your bookmarks!', 'success');
    }

    showNotes() {
        const notesViewer = document.getElementById('notes-viewer');
        
        // Hide other viewers
        document.getElementById('bookmarks-viewer').style.display = 'none';
        document.getElementById('search-interface').style.display = 'none';
        
        notesViewer.style.display = 'block';
    }

    showSearchInterface() {
        const searchInterface = document.getElementById('search-interface');
        
        // Hide other viewers
        document.getElementById('bookmarks-viewer').style.display = 'none';
        document.getElementById('notes-viewer').style.display = 'none';
        
        searchInterface.style.display = 'block';
    }

    performSearch() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const subjectFilter = document.getElementById('search-subject').value;
        const difficultyFilter = document.getElementById('search-difficulty').value;
        const resultsContainer = document.getElementById('search-results');
        
        if (!searchTerm.trim()) {
            this.showToast('Please enter a search term', 'warning');
            return;
        }
        
        const allQuestions = this.getQuestionDatabase();
        let results = allQuestions.filter(question => {
            const matchesSearch = question.question.toLowerCase().includes(searchTerm) ||
                                question.category.toLowerCase().includes(searchTerm) ||
                                question.subject.toLowerCase().includes(searchTerm);
            
            const matchesSubject = !subjectFilter || 
                                 question.subject.toLowerCase().replace(/\s+/g, '_') === subjectFilter;
            
            const matchesDifficulty = !difficultyFilter || 
                                    question.difficulty.toLowerCase() === difficultyFilter;
            
            return matchesSearch && matchesSubject && matchesDifficulty;
        });
        
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No questions found matching your search criteria.</p>';
            return;
        }
        
        results.forEach(question => {
            const resultEl = document.createElement('div');
            resultEl.className = 'search-result-item';
            resultEl.innerHTML = `
                <div class="bookmark-question">${question.question}</div>
                <div class="bookmark-meta">
                    <span>Subject: ${question.subject}</span>
                    <span>Difficulty: ${question.difficulty}</span>
                    <span>Category: ${question.category}</span>
                </div>
            `;
            resultsContainer.appendChild(resultEl);
        });
        
        this.showToast(`Found ${results.length} questions`, 'success');
    }

    renderProgressAnalytics() {
        // Trends chart
        const ctx = document.getElementById('trends-chart');
        if (!ctx) return;
        
        const trendsData = this.generateTrendsData();
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendsData.labels,
                datasets: [{
                    label: 'Performance Trend',
                    data: trendsData.scores,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    generateTrendsData() {
        const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
        const scores = [65, 72, 78, 75, 82, 88]; // Sample trending data
        return { labels, scores };
    }

    showLoadingOverlay() {
        document.getElementById('loading-overlay').style.display = 'flex';
    }

    hideLoadingOverlay() {
        document.getElementById('loading-overlay').style.display = 'none';
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    initializeAchievements() {
        // Initialize with demo achievements for new users
        if (this.userProgress.achievements.length === 0 && this.userProgress.quizzesTaken === 0) {
            // No achievements initially - they'll be earned through usage
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new QuizApp();
    
    // Make app globally available for debugging
    window.quizApp = app;
    
    // Show welcome message with confetti effect
    setTimeout(() => {
        app.showToast('Welcome to Quiz Genius Ultimate! ✨ The Most Beautiful Quiz Platform!', 'success');
        // Add scroll event for navbar animation
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
        });
    }, 1000);
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (window.quizApp && window.quizApp.currentSection === 'quiz') {
        // Number keys for option selection
        if (e.key >= '1' && e.key <= '4') {
            const optionIndex = parseInt(e.key) - 1;
            const optionBtn = document.querySelector(`[data-option="${optionIndex}"]`);
            if (optionBtn && optionBtn.style.display !== 'none') {
                optionBtn.click();
            }
        }
        
        // Enter key for next question
        if (e.key === 'Enter' && !document.getElementById('next-btn').disabled) {
            document.getElementById('next-btn').click();
        }
        
        // Space key for skip
        if (e.key === ' ' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            document.getElementById('skip-btn').click();
        }
    }
    
    // Theme toggle with Ctrl/Cmd + Shift + T
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        window.quizApp?.toggleTheme();
    }
});

// Handle page visibility changes for streak tracking
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.quizApp) {
        // User returned to the page - could implement streak logic here
        const today = new Date().toDateString();
        if (window.quizApp.userProgress.lastQuizDate !== today) {
            // New day - could reset daily progress, check streaks, etc.
        }
    }
});

// Service Worker registration for offline functionality (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be implemented here for offline functionality
        console.log('Quiz Master Pro 2025 loaded successfully!');
    });
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizApp;
}