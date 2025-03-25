/* Health & Wellness Tracker Module for Patel Productivity Suite */

const healthModule = {
    // Store DOM elements
    elements: {},
    
    // Health data
    healthData: {
        steps: [],
        water: [],
        sleep: [],
        meditation: [],
        mood: [],
        weight: [],
        exercises: []
    },
    
    // Goals
    goals: {
        steps: 10000,
        water: 8,
        sleep: 8,
        meditation: 15,
        weight: null
    },
    
    // Current view
    currentView: 'dashboard',
    
    // Date range
    dateRange: 'week',
    
    // Initialize the module
    init: async function(container) {
        console.log('Initializing Health & Wellness Tracker module');
        
        // Render the module UI
        this.render(container);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load health data
        await this.loadHealthData();
        
        // Check for motion sensors
        this.checkMotionSensors();
        
        // Set up notifications
        this.setupNotifications();
        
        // Render dashboard
        this.renderDashboard();
    },
    
    // Render the module UI
    render: function(container) {
        container.innerHTML = `
            <div class="module-header">
                <h2>Health & Wellness Tracker</h2>
                <div class="module-actions">
                    <div class="date-range-selector">
                        <button id="range-day" class="btn">Day</button>
                        <button id="range-week" class="btn active">Week</button>
                        <button id="range-month" class="btn">Month</button>
                    </div>
                    <button id="health-settings-btn" class="btn">Settings</button>
                </div>
            </div>
            
            <div class="health-navigation">
                <button id="nav-dashboard" class="health-nav-btn active">Dashboard</button>
                <button id="nav-steps" class="health-nav-btn">Steps</button>
                <button id="nav-water" class="health-nav-btn">Hydration</button>
                <button id="nav-sleep" class="health-nav-btn">Sleep</button>
                <button id="nav-meditation" class="health-nav-btn">Meditation</button>
                <button id="nav-mood" class="health-nav-btn">Mood</button>
                <button id="nav-weight" class="health-nav-btn">Weight</button>
                <button id="nav-exercise" class="health-nav-btn">Exercise</button>
            </div>
            
            <div class="health-content" id="health-content">
                <div class="loading">Loading health data...</div>
            </div>
            
            <!-- Settings Modal -->
            <div id="health-settings-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Health & Wellness Settings</h3>
                    <form id="health-settings-form">
                        <div class="form-group">
                            <label for="steps-goal">Daily Steps Goal</label>
                            <input type="number" id="steps-goal" min="1000" max="50000" step="1000">
                        </div>
                        <div class="form-group">
                            <label for="water-goal">Daily Water Goal (glasses)</label>
                            <input type="number" id="water-goal" min="1" max="20" step="1">
                        </div>
                        <div class="form-group">
                            <label for="sleep-goal">Daily Sleep Goal (hours)</label>
                            <input type="number" id="sleep-goal" min="4" max="12" step="0.5">
                        </div>
                        <div class="form-group">
                            <label for="meditation-goal">Daily Meditation Goal (minutes)</label>
                            <input type="number" id="meditation-goal" min="5" max="120" step="5">
                        </div>
                        <div class="form-group">
                            <label for="weight-goal">Weight Goal (optional)</label>
                            <input type="number" id="weight-goal" min="0" step="0.1">
                        </div>
                        <div class="form-group">
                            <label for="notifications">Notifications</label>
                            <div class="checkbox-group">
                                <label>
                                    <input type="checkbox" id="water-notification" checked>
                                    Water Reminders
                                </label>
                                <label>
                                    <input type="checkbox" id="meditation-notification" checked>
                                    Meditation Reminders
                                </label>
                                <label>
                                    <input type="checkbox" id="sleep-notification" checked>
                                    Sleep Reminders
                                </label>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" id="settings-cancel-btn" class="btn">Cancel</button>
                            <button type="submit" id="settings-save-btn" class="btn primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Add Entry Modal -->
            <div id="add-entry-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3 id="add-entry-title">Add Entry</h3>
                    <form id="add-entry-form">
                        <input type="hidden" id="entry-type">
                        <div class="form-group" id="entry-date-group">
                            <label for="entry-date">Date</label>
                            <input type="date" id="entry-date" required>
                        </div>
                        <div class="form-group" id="entry-time-group">
                            <label for="entry-time">Time</label>
                            <input type="time" id="entry-time">
                        </div>
                        <div class="form-group" id="entry-value-group">
                            <label for="entry-value" id="entry-value-label">Value</label>
                            <input type="number" id="entry-value" min="0" step="1" required>
                        </div>
                        <div class="form-group" id="entry-duration-group">
                            <label for="entry-duration">Duration (minutes)</label>
                            <input type="number" id="entry-duration" min="1" step="1">
                        </div>
                        <div class="form-group" id="entry-mood-group">
                            <label>Mood</label>
                            <div class="mood-selector">
                                <button type="button" class="mood-btn" data-mood="1">😢</button>
                                <button type="button" class="mood-btn" data-mood="2">😕</button>
                                <button type="button" class="mood-btn" data-mood="3">😐</button>
                                <button type="button" class="mood-btn" data-mood="4">🙂</button>
                                <button type="button" class="mood-btn" data-mood="5">😄</button>
                            </div>
                            <input type="hidden" id="entry-mood-value">
                        </div>
                        <div class="form-group" id="entry-notes-group">
                            <label for="entry-notes">Notes</label>
                            <textarea id="entry-notes" rows="3"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" id="entry-cancel-btn" class="btn">Cancel</button>
                            <button type="submit" id="entry-save-btn" class="btn primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Meditation Timer Modal -->
            <div id="meditation-timer-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Meditation Timer</h3>
                    <div class="meditation-timer-container">
                        <div class="meditation-timer" id="meditation-timer">
                            <div class="timer-display">
                                <span id="timer-minutes">15</span>:<span id="timer-seconds">00</span>
                            </div>
                            <div class="timer-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" id="timer-progress"></div>
                                </div>
                            </div>
                        </div>
                        <div class="meditation-controls">
                            <button id="timer-decrease-btn" class="btn">-</button>
                            <button id="timer-start-btn" class="btn primary">Start</button>
                            <button id="timer-pause-btn" class="btn" disabled>Pause</button>
                            <button id="timer-increase-btn" class="btn">+</button>
                        </div>
                        <div class="meditation-ambience">
                            <h4>Ambient Sound</h4>
                            <div class="ambience-options">
                                <button class="ambience-btn active" data-sound="none">None</button>
                                <button class="ambience-btn" data-sound="nature">Nature</button>
                                <button class="ambience-btn" data-sound="rain">Rain</button>
                                <button class="ambience-btn" data-sound="waves">Waves</button>
                                <button class="ambience-btn" data-sound="white-noise">White Noise</button>
                            </div>
                        </div>
                        <div class="meditation-guidance">
                            <h4>Meditation Guidance</h4>
                            <div class="guidance-message" id="guidance-message">
                                Take a deep breath in... and slowly exhale.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Store DOM elements
        this.elements = {
            healthContent: document.getElementById('health-content'),
            navDashboard: document.getElementById('nav-dashboard'),
            navSteps: document.getElementById('nav-steps'),
            navWater: document.getElementById('nav-water'),
            navSleep: document.getElementById('nav-sleep'),
            navMeditation: document.getElementById('nav-meditation'),
            navMood: document.getElementById('nav-mood'),
            navWeight: document.getElementById('nav-weight'),
            navExercise: document.getElementById('nav-exercise'),
            rangeDay: document.getElementById('range-day'),
            rangeWeek: document.getElementById('range-week'),
            rangeMonth: document.getElementById('range-month'),
            healthSettingsBtn: document.getElementById('health-settings-btn'),
            healthSettingsModal: document.getElementById('health-settings-modal'),
            healthSettingsForm: document.getElementById('health-settings-form'),
            stepsGoal: document.getElementById('steps-goal'),
            waterGoal: document.getElementById('water-goal'),
            sleepGoal: document.getElementById('sleep-goal'),
            meditationGoal: document.getElementById('meditation-goal'),
            weightGoal: document.getElementById('weight-goal'),
            waterNotification: document.getElementById('water-notification'),
            meditationNotification: document.getElementById('meditation-notification'),
            sleepNotification: document.getElementById('sleep-notification'),
            settingsCancelBtn: document.getElementById('settings-cancel-btn'),
            settingsSaveBtn: document.getElementById('settings-save-btn'),
            settingsCloseModal: document.querySelector('#health-settings-modal .close-modal'),
            addEntryModal: document.getElementById('add-entry-modal'),
            addEntryTitle: document.getElementById('add-entry-title'),
            addEntryForm: document.getElementById('add-entry-form'),
            entryType: document.getElementById('entry-type'),
            entryDate: document.getElementById('entry-date'),
            entryTime: document.getElementById('entry-time'),
            entryValue: document.getElementById('entry-value'),
            entryValueLabel: document.getElementById('entry-value-label'),
            entryDuration: document.getElementById('entry-duration'),
            entryMoodGroup: document.getElementById('entry-mood-group'),
            entryMoodValue: document.getElementById('entry-mood-value'),
            entryNotes: document.getElementById('entry-notes'),
            entryCancelBtn: document.getElementById('entry-cancel-btn'),
            entrySaveBtn: document.getElementById('entry-save-btn'),
            entryCloseModal: document.querySelector('#add-entry-modal .close-modal'),
            meditationTimerModal: document.getElementById('meditation-timer-modal'),
            timerMinutes: document.getElementById('timer-minutes'),
            timerSeconds: document.getElementById('timer-seconds'),
            timerProgress: document.getElementById('timer-progress'),
            timerDecreaseBtn: document.getElementById('timer-decrease-btn'),
            timerStartBtn: document.getElementById('timer-start-btn'),
            timerPauseBtn: document.getElementById('timer-pause-btn'),
            timerIncreaseBtn: document.getElementById('timer-increase-btn'),
            guidanceMessage: document.getElementById('guidance-message'),
            meditationTimerCloseModal: document.querySelector('#meditation-timer-modal .close-modal')
        };
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Navigation buttons
        this.elements.navDashboard.addEventListener('click', () => {
            this.setCurrentView('dashboard');
        });
        
        this.elements.navSteps.addEventListener('click', () => {
            this.setCurrentView('steps');
        });
        
        this.elements.navWater.addEventListener('click', () => {
            this.setCurrentView('water');
        });
        
        this.elements.navSleep.addEventListener('click', () => {
            this.setCurrentView('sleep');
        });
        
        this.elements.navMeditation.addEventListener('click', () => {
            this.setCurrentView('meditation');
        });
        
        this.elements.navMood.addEventListener('click', () => {
            this.setCurrentView('mood');
        });
        
        this.elements.navWeight.addEventListener('click', () => {
            this.setCurrentView('weight');
        });
        
        this.elements.navExercise.addEventListener('click', () => {
            this.setCurrentView('exercise');
        });
        
        // Date range buttons
        this.elements.rangeDay.addEventListener('click', () => {
            this.setDateRange('day');
        });
        
        this.elements.rangeWeek.addEventListener('click', () => {
            this.setDateRange('week');
        });
        
        this.elements.rangeMonth.addEventListener('click', () => {
            this.setDateRange('month');
        });
        
        // Settings button
        this.elements.healthSettingsBtn.addEventListener('click', () => {
            this.openSettingsModal();
        });
        
        // Settings modal
        this.elements.settingsCloseModal.addEventListener('click', () => {
            this.closeSettingsModal();
        });
        
        this.elements.settingsCancelBtn.addEventListener('click', () => {
            this.closeSettingsModal();
        });
        
        this.elements.healthSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
        
        // Add entry modal
        this.elements.entryCloseModal.addEventListener('click', () => {
            this.closeAddEntryModal();
        });
        
        this.elements.entryCancelBtn.addEventListener('click', () => {
            this.closeAddEntryModal();
        });
        
        this.elements.addEntryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEntry();
        });
        
        // Mood buttons
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.elements.entryMoodValue.value = btn.getAttribute('data-mood');
            });
        });
        
        // Meditation timer modal
        this.elements.meditationTimerCloseModal.addEventListener('click', () => {
            this.closeMeditationTimerModal();
        });
        
        this.elements.timerDecreaseBtn.addEventListener('click', () => {
            this.decreaseMeditationTime();
        });
        
        this.elements.timerIncreaseBtn.addEventListener('click', () => {
            this.increaseMeditationTime();
        });
        
        this.elements.timerStartBtn.addEventListener('click', () => {
            this.startMeditationTimer();
        });
        
        this.elements.timerPauseBtn.addEventListener('click', () => {
            this.pauseMeditationTimer();
        });
        
        // Ambience buttons
        document.querySelectorAll('.ambience-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.ambience-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setAmbienceSound(btn.getAttribute('data-sound'));
            });
        });
    },
    
    // Load health data from database
    loadHealthData: async function() {
        try {
            // Load steps data
            this.healthData.steps = await window.PatelDB.getAll('health_steps');
            
            // Load water data
            this.healthData.water = await window.PatelDB.getAll('health_water');
            
            // Load sleep data
            this.healthData.sleep = await window.PatelDB.getAll('health_sleep');
            
            // Load meditation data
            this.healthData.meditation = await window.PatelDB.getAll('health_meditation');
            
            // Load mood data
            this.healthData.mood = await window.PatelDB.getAll('health_mood');
            
            // Load weight data
            this.healthData.weight = await window.PatelDB.getAll('health_weight');
            
            // Load exercise data
            this.healthData.exercises = await window.PatelDB.getAll('health_exercises');
            
            // Load goals
            const savedGoals = await window.PatelDB.get('settings', 'health_goals');
            if (savedGoals) {
                this.goals = savedGoals;
            }
            
            // If no data, add sample data
            if (this.healthData.steps.length === 0) {
                await this.addSampleData();
            }
        } catch (error) {
            console.error('Error loading health data:', error);
            Utils.showNotification('Error loading health data', 'error');
        }
    },
    
    // Add sample data
    addSampleData: async function() {
        try {
            const today = new Date();
            
            // Add sample steps data for the past week
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                
                const steps = {
                    date: date.toISOString().split('T')[0],
                    value: Math.floor(Math.random() * 5000) + 5000, // Random between 5000-10000
                    notes: ''
                };
                
                const stepId = await window.PatelDB.add('health_steps', steps);
                steps.id = stepId;
                this.healthData.steps.push(steps);
            }
            
            // Add sample water data for the past week
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                
                const water = {
                    date: date.toISOString().split('T')[0],
                    value: Math.floor(Math.random() * 5) + 4, // Random between 4-8 glasses
                    notes: ''
                };
                
                const waterId = await window.PatelDB.add('health_water', water);
                water.id = waterId;
                this.healthData.water.push(water);
            }
            
            // Add sample sleep data for the past week
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                
                const sleep = {
                    date: date.toISOString().split('T')[0],
                    value: Math.floor(Math.random() * 3) + 6, // Random between 6-8 hours
                    notes: ''
                };
                
                const sleepId = await window.PatelDB.add('health_sleep', sleep);
                sleep.id = sleepId;
                this.healthData.sleep.push(sleep);
            }
            
            // Add sample meditation data for the past week
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                
                // Skip some days for more realistic data
                if (i % 2 === 0) {
                    const meditation = {
                        date: date.toISOString().split('T')[0],
                        value: Math.floor(Math.random() * 15) + 5, // Random between 5-20 minutes
                        notes: ''
                    };
                    
                    const meditationId = await window.PatelDB.add('health_meditation', meditation);
                    meditation.id = meditationId;
                    this.healthData.meditation.push(meditation);
                }
            }
            
            // Add sample mood data for the past week
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                
                const mood = {
                    date: date.toISOString().split('T')[0],
                    value: Math.floor(Math.random() * 5) + 1, // Random between 1-5
                    notes: ''
                };
                
                const moodId = await window.PatelDB.add('health_mood', mood);
                mood.id = moodId;
                this.healthData.mood.push(mood);
            }
            
            // Add sample weight data for the past month (weekly)
            for (let i = 0; i < 4; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - (i * 7));
                
                const weight = {
                    date: date.toISOString().split('T')[0],
                    value: 70 - (i * 0.5), // Starting at 70kg, losing 0.5kg per week
                    notes: ''
                };
                
                const weightId = await window.PatelDB.add('health_weight', weight);
                weight.id = weightId;
                this.healthData.weight.push(weight);
            }
            
            // Add sample exercise data
            const exercises = [
                { name: 'Running', date: new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0], duration: 30, calories: 300, notes: '5km run' },
                { name: 'Yoga', date: new Date(today.setDate(today.getDate() - 2)).toISOString().split('T')[0], duration: 45, calories: 150, notes: 'Morning yoga' },
                { name: 'Strength Training', date: new Date(today.setDate(today.getDate() - 3)).toISOString().split('T')[0], duration: 60, calories: 400, notes: 'Upper body' },
                { name: 'Cycling', date: new Date(today.setDate(today.getDate() - 5)).toISOString().split('T')[0], duration: 45, calories: 350, notes: '10km ride' }
            ];
            
            for (const exercise of exercises) {
                const exerciseId = await window.PatelDB.add('health_exercises', exercise);
                exercise.id = exerciseId;
                this.healthData.exercises.push(exercise);
            }
            
            Utils.showNotification('Sample health data added', 'success');
        } catch (error) {
            console.error('Error adding sample data:', error);
            Utils.showNotification('Error adding sample data', 'error');
        }
    },
    
    // Set current view
    setCurrentView: function(view) {
        this.currentView = view;
        
        // Update active nav button
        document.querySelectorAll('.health-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(`nav-${view}`).classList.add('active');
        
        // Render the view
        switch (view) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'steps':
                this.renderStepsView();
                break;
            case 'water':
                this.renderWaterView();
                break;
            case 'sleep':
                this.renderSleepView();
                break;
            case 'meditation':
                this.renderMeditationView();
                break;
            case 'mood':
                this.renderMoodView();
                break;
            case 'weight':
                this.renderWeightView();
                break;
            case 'exercise':
                this.renderExerciseView();
                break;
        }
    },
    
    // Set date range
    setDateRange: function(range) {
        this.dateRange = range;
        
        // Update active range button
        document.querySelectorAll('.date-range-selector .btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(`range-${range}`).classList.add('active');
        
        // Re-render current view
        this.setCurrentView(this.currentView);
    },
    
    // Render dashboard
    renderDashboard: function() {
        // Get today's data
        const today = new Date().toISOString().split('T')[0];
        
        const todaySteps = this.healthData.steps.find(s => s.date === today) || { value: 0 };
        const todayWater = this.healthData.water.find(w => w.date === today) || { value: 0 };
        const todaySleep = this.healthData.sleep.find(s => s.date === today) || { value: 0 };
        const todayMeditation = this.healthData.meditation.find(m => m.date === today) || { value: 0 };
        const todayMood = this.healthData.mood.find(m => m.date === today) || { value: 0 };
        
        // Calculate progress percentages
        const stepsProgress = Math.min(100, (todaySteps.value / this.goals.steps) * 100);
        const waterProgress = Math.min(100, (todayWater.value / this.goals.water) * 100);
        const sleepProgress = Math.min(100, (todaySleep.value / this.goals.sleep) * 100);
        const meditationProgress = Math.min(100, (todayMeditation.value / this.goals.meditation) * 100);
        
        // Get mood emoji
        const moodEmoji = this.getMoodEmoji(todayMood.value);
        
        // Get latest weight
        const latestWeight = this.healthData.weight.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        )[0] || { value: 0 };
        
        // Get recent exercises
        const recentExercises = this.healthData.exercises
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        
        // Render dashboard
        this.elements.healthContent.innerHTML = `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <h3>Today's Overview</h3>
                    <div class="dashboard-date">${Utils.formatDate(new Date())}</div>
                </div>
                
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h4>Steps</h4>
                            <button class="add-entry-btn" data-type="steps">+</button>
                        </div>
                        <div class="card-content">
                            <div class="progress-circle" data-progress="${stepsProgress}">
                                <div class="progress-circle-inner">
                                    <div class="progress-value">${todaySteps.value}</div>
                                    <div class="progress-label">steps</div>
                                </div>
                            </div>
                            <div class="progress-goal">Goal: ${this.goals.steps} steps</div>
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h4>Hydration</h4>
                            <button class="add-entry-btn" data-type="water">+</button>
                        </div>
                        <div class="card-content">
                            <div class="progress-circle" data-progress="${waterProgress}">
                                <div class="progress-circle-inner">
                                    <div class="progress-value">${todayWater.value}</div>
                                    <div class="progress-label">glasses</div>
                                </div>
                            </div>
                            <div class="progress-goal">Goal: ${this.goals.water} glasses</div>
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h4>Sleep</h4>
                            <button class="add-entry-btn" data-type="sleep">+</button>
                        </div>
                        <div class="card-content">
                            <div class="progress-circle" data-progress="${sleepProgress}">
                                <div class="progress-circle-inner">
                                    <div class="progress-value">${todaySleep.value}</div>
                                    <div class="progress-label">hours</div>
                                </div>
                            </div>
                            <div class="progress-goal">Goal: ${this.goals.sleep} hours</div>
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h4>Meditation</h4>
                            <button class="add-entry-btn" data-type="meditation">+</button>
                        </div>
                        <div class="card-content">
                            <div class="progress-circle" data-progress="${meditationProgress}">
                                <div class="progress-circle-inner">
                                    <div class="progress-value">${todayMeditation.value}</div>
                                    <div class="progress-label">minutes</div>
                                </div>
                            </div>
                            <div class="progress-goal">Goal: ${this.goals.meditation} minutes</div>
                            <button class="meditation-timer-btn">Start Timer</button>
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h4>Mood</h4>
                            <button class="add-entry-btn" data-type="mood">+</button>
                        </div>
                        <div class="card-content">
                            <div class="mood-display">
                                <div class="mood-emoji">${moodEmoji}</div>
                                <div class="mood-label">${this.getMoodLabel(todayMood.value)}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h4>Weight</h4>
                            <button class="add-entry-btn" data-type="weight">+</button>
                        </div>
                        <div class="card-content">
                            <div class="weight-display">
                                <div class="weight-value">${latestWeight.value} kg</div>
                                <div class="weight-date">Last updated: ${latestWeight.date ? Utils.formatDate(new Date(latestWeight.date)) : 'Never'}</div>
                            </div>
                            ${this.goals.weight ? `<div class="progress-goal">Goal: ${this.goals.weight} kg</div>` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-section">
                    <div class="section-header">
                        <h3>Recent Exercises</h3>
                        <button class="add-entry-btn" data-type="exercise">Add Exercise</button>
                    </div>
                    <div class="exercise-list">
                        ${recentExercises.length > 0 ? recentExercises.map(exercise => `
                            <div class="exercise-item">
                                <div class="exercise-icon">🏋️</div>
                                <div class="exercise-details">
                                    <div class="exercise-name">${exercise.name}</div>
                                    <div class="exercise-info">
                                        <span>${exercise.duration} min</span>
                                        <span>${exercise.calories} cal</span>
                                        <span>${Utils.formatDate(new Date(exercise.date))}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('') : '<div class="empty-state">No recent exercises</div>'}
                    </div>
                </div>
                
                <div class="dashboard-section">
                    <div class="section-header">
                        <h3>Wellness Tips</h3>
                    </div>
                    <div class="wellness-tips">
                        <div class="tip-item">
                            <div class="tip-icon">💧</div>
                            <div class="tip-content">
                                <div class="tip-title">Stay Hydrated</div>
                                <div class="tip-text">Drinking water helps maintain the balance of body fluids, energizes muscles, and keeps skin looking good.</div>
                            </div>
                        </div>
                        <div class="tip-item">
                            <div class="tip-icon">🧘</div>
                            <div class="tip-content">
                                <div class="tip-title">Mindful Breathing</div>
                                <div class="tip-text">Take 5 minutes to focus on your breath. Inhale for 4 counts, hold for 2, exhale for 6.</div>
                            </div>
                        </div>
                        <div class="tip-item">
                            <div class="tip-icon">🚶</div>
                            <div class="tip-content">
                                <div class="tip-title">Move More</div>
                                <div class="tip-text">Try to stand up and move around for at least 5 minutes every hour to improve circulation and energy levels.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize progress circles
        this.initProgressCircles();
        
        // Add event listeners to add entry buttons
        document.querySelectorAll('.add-entry-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                this.openAddEntryModal(type);
            });
        });
        
        // Add event listener to meditation timer button
        document.querySelector('.meditation-timer-btn').addEventListener('click', () => {
            this.openMeditationTimerModal();
        });
    },
    
    // Render steps view
    renderStepsView: function() {
        // Get data for selected date range
        const data = this.getDataForDateRange('steps');
        
        // Calculate stats
        const total = data.reduce((sum, item) => sum + item.value, 0);
        const average = data.length > 0 ? Math.round(total / data.length) : 0;
        const max = data.length > 0 ? Math.max(...data.map(item => item.value)) : 0;
        
        // Render view
        this.elements.healthContent.innerHTML = `
            <div class="health-view-container">
                <div class="view-header">
                    <h3>Steps Tracker</h3>
                    <button class="add-entry-btn" data-type="steps">Add Steps</button>
                </div>
                
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-value">${average}</div>
                        <div class="stat-label">Average Steps</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${total}</div>
                        <div class="stat-label">Total Steps</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${max}</div>
                        <div class="stat-label">Max Steps</div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="steps-chart"></canvas>
                </div>
                
                <div class="entries-container">
                    <h4>Steps Entries</h4>
                    <div class="entries-list">
                        ${data.length > 0 ? data.map(entry => `
                            <div class="entry-item" data-id="${entry.id}">
                                <div class="entry-date">${Utils.formatDate(new Date(entry.date))}</div>
                                <div class="entry-value">${entry.value} steps</div>
                                <div class="entry-actions">
                                    <button class="entry-edit-btn" data-id="${entry.id}" data-type="steps">Edit</button>
                                    <button class="entry-delete-btn" data-id="${entry.id}" data-type="steps">Delete</button>
                                </div>
                            </div>
                        `).join('') : '<div class="empty-state">No steps data for this period</div>'}
                    </div>
                </div>
            </div>
        `;
        
        // Initialize chart
        this.initStepsChart(data);
        
        // Add event listeners to add entry button
        document.querySelector('.add-entry-btn').addEventListener('click', () => {
            this.openAddEntryModal('steps');
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.entry-edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const type = btn.getAttribute('data-type');
                this.openEditEntryModal(type, id);
            });
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.entry-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const type = btn.getAttribute('data-type');
                this.deleteEntry(type, id);
            });
        });
    },
    
    // Render water view
    renderWaterView: function() {
        // Get data for selected date range
        const data = this.getDataForDateRange('water');
        
        // Calculate stats
        const total = data.reduce((sum, item) => sum + item.value, 0);
        const average = data.length > 0 ? (total / data.length).toFixed(1) : 0;
        const max = data.length > 0 ? Math.max(...data.map(item => item.value)) : 0;
        
        // Render view
        this.elements.healthContent.innerHTML = `
            <div class="health-view-container">
                <div class="view-header">
                    <h3>Hydration Tracker</h3>
                    <button class="add-entry-btn" data-type="water">Add Water</button>
                </div>
                
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-value">${average}</div>
                        <div class="stat-label">Average Glasses</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${total}</div>
                        <div class="stat-label">Total Glasses</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${max}</div>
                        <div class="stat-label">Max Glasses</div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="water-chart"></canvas>
                </div>
                
                <div class="entries-container">
                    <h4>Hydration Entries</h4>
                    <div class="entries-list">
                        ${data.length > 0 ? data.map(entry => `
                            <div class="entry-item" data-id="${entry.id}">
                                <div class="entry-date">${Utils.formatDate(new Date(entry.date))}</div>
                                <div class="entry-value">${entry.value} glasses</div>
                                <div class="entry-actions">
                                    <button class="entry-edit-btn" data-id="${entry.id}" data-type="water">Edit</button>
                                    <button class="entry-delete-btn" data-id="${entry.id}" data-type="water">Delete</button>
                                </div>
                            </div>
                        `).join('') : '<div class="empty-state">No hydration data for this period</div>'}
                    </div>
                </div>
            </div>
        `;
        
        // Initialize chart
        this.initWaterChart(data);
        
        // Add event listeners to add entry button
        document.querySelector('.add-entry-btn').addEventListener('click', () => {
            this.openAddEntryModal('water');
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.entry-edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const type = btn.getAttribute('data-type');
                this.openEditEntryModal(type, id);
            });
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.entry-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const type = btn.getAttribute('data-type');
                this.deleteEntry(type, id);
            });
        });
    },
    
    // Render sleep view
    renderSleepView: function() {
        // Get data for selected date range
        const data = this.getDataForDateRange('sleep');
        
        // Calculate stats
        const total = data.reduce((sum, item) => sum + item.value, 0);
        const average = data.length > 0 ? (total / data.length).toFixed(1) : 0;
        const max = data.length > 0 ? Math.max(...data.map(item => item.value)) : 0;
        
        // Render view
        this.elements.healthContent.innerHTML = `
            <div class="health-view-container">
                <div class="view-header">
                    <h3>Sleep Tracker</h3>
                    <button class="add-entry-btn" data-type="sleep">Add Sleep</button>
                </div>
                
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-value">${average}</div>
                        <div class="stat-label">Average Hours</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${total}</div>
                        <div class="stat-label">Total Hours</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${max}</div>
                        <div class="stat-label">Max Hours</div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="sleep-chart"></canvas>
                </div>
                
                <div class="entries-container">
                    <h4>Sleep Entries</h4>
                    <div class="entries-list">
                        ${data.length > 0 ? data.map(entry => `
                            <div class="entry-item" data-id="${entry.id}">
                                <div class="entry-date">${Utils.formatDate(new Date(entry.date))}</div>
                                <div class="entry-value">${entry.value} hours</div>
                                <div class="entry-actions">
                                    <button class="entry-edit-btn" data-id="${entry.id}" data-type="sleep">Edit</button>
                                    <button class="entry-delete-btn" data-id="${entry.id}" data-type="sleep">Delete</button>
                                </div>
                            </div>
                        `).join('') : '<div class="empty-state">No sleep data for this period</div>'}
                    </div>
                </div>
            </div>
        `;
        
        // Initialize chart
        this.initSleepChart(data);
        
        // Add event listeners to add entry button
        document.querySelector('.add-entry-btn').addEventListener('click', () => {
            this.openAddEntryModal('sleep');
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.entry-edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const type = btn.getAttribute('data-type');
                this.openEditEntryModal(type, id);
            });
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.entry-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const type = btn.getAttribute('data-type');
                this.deleteEntry(type, id);
            });
        });
    },
    
    // Render meditation view
    renderMeditationView: function() {
        // Get data for selected date range
        const data = this.getDataForDateRange('meditation');
        
        // Calculate stats
        const total = data.reduce((sum, item) => sum + item.value, 0);
        const average = data.length > 0 ? Math.round(total / data.length) : 0;
        const max = data.length > 0 ? Math.max(...data.map(item => item.value)) : 0;
        
        // Render view
        this.elements.healthContent.innerHTML = `
            <div class="health-view-container">
                <div class="view-header">
                    <h3>Meditation Tracker</h3>
                    <div class="view-actions">
                        <button class="meditation-timer-btn">Start Timer</button>
                        <button class="add-entry-btn" data-type="meditation">Add Meditation</button>
                    </div>
                </div>
                
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-value">${average}</div>
                        <div class="stat-label">Average Minutes</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${total}</div>
                        <div class="stat-label">Total Minutes</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${max}</div>
                        <div class="stat-label">Max Minutes</div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="meditation-chart"></canvas>
                </div>
                
                <div class="entries-container">
                    <h4>Meditation Entries</h4>
                    <div class="entries-list">
                        ${data.length > 0 ? data.map(entry => `
                            <div class="entry-item" data-id="${entry.id}">
                                <div class="entry-date">${Utils.formatDate(new Date(entry.date))}</div>
                                <div class="entry-value">${entry.value} minutes</div>
                                <div class="entry-actions">
                                    <button class="entry-edit-btn" data-id="${entry.id}" data-type="meditation">Edit</button>
                                    <button class="entry-delete-btn" data-id="${entry.id}" data-type="meditation">Delete</button>
                                </div>
                            </div>
                        `).join('') : '<div class="empty-state">No meditation data for this period</div>'}
                    </div>
                </div>
                
                <div class="meditation-tips">
                    <h4>Meditation Tips</h4>
                    <div class="tip-item">
                        <div class="tip-icon">🧘</div>
                        <div class="tip-content">
                            <div class="tip-title">Start Small</div>
                            <div class="tip-text">Begin with just 5 minutes a day and gradually increase your meditation time.</div>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">🌬️</div>
                        <div class="tip-content">
                            <div class="tip-title">Focus on Breath</div>
                            <div class="tip-text">When your mind wanders, gently bring your attention back to your breath.</div>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">⏰</div>
                        <div class="tip-content">
                            <div class="tip-title">Consistent Time</div>
                            <div class="tip-text">Try to meditate at the same time each day to build a habit.</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize chart
        this.initMeditationChart(data);
        
        // Add event listeners to add entry button
        document.querySelector('.add-entry-btn').addEventListener('click', () => {
            this.openAddEntryModal('meditation');
        });
        
        // Add event listener to meditation timer button
        document.querySelector('.meditation-timer-btn').addEventListener('click', () => {
            this.openMeditationTimerModal();
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.entry-edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const type = btn.getAttribute('data-type');
                this.openEditEntryModal(type, id);
            });
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.entry-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const type = btn.getAttribute('data-type');
                this.deleteEntry(type, id);
            });
        });
    },
    
    // Render mood view
    renderMoodView: function() {
        // Get data for selected date range
        const data = this.getDataForDateRange('mood');
        
        // Calculate average mood
        const total = data.reduce((sum, item) => sum + item.value, 0);
        const average = data.length > 0 ? (total / data.length).toFixed(1) : 0;
        
        // Render view
        this.elements.healthContent.innerHTML = `
            <div class="health-view-container">
                <div class="view-header">
                    <h3>Mood Tracker</h3>
                    <button class="add-entry-btn" data-type="mood">Add Mood</button>
                </div>
                
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-value">${average}</div>
                        <div class="stat-label">Average Mood</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.getMoodEmoji(Math.round(average))}</div>
                        <div class="stat-label">Average Mood</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${data.length}</div>
                        <div class="stat-label">Total Entries</div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="mood-chart"></canvas>
                </div>
                
                <div class="mood-calendar">
                    <h4>Mood Calendar</h4>
                    <div class="calendar-container" id="mood-calendar">
                        <!-- Calendar will be rendered here -->
                    </div>
                </div>
                
                <div class="entries-container">
                    <h4>Mood Entries</h4>
                    <div class="entries-list">
                        ${data.length > 0 ? data.map(entry => `
                            <div class="entry-item" data-id="${entry.id}">
                                <div class="entry-date">${Utils.formatDate(new Date(entry.date))}</div>
                                <div class="entry-value">${this.getMoodEmoji(entry.value)} ${this.getMoodLabel(entry.value)}</div>
                                <div class="entry-actions">
                                    <button class="entry-edit-btn" data-id="${entry.id}" data-type="mood">Edit</button>
                                    <button class="entry-delete-btn" data-id="${entry.id}" data-type="mood">Delete</button>
                                </div>
                            </div>
                        `).join('') : '<div class="empty-state">No mood data for this period</div>'}
                    </div>
                </div>
            </div>
        `;
        
        // Initialize chart
        this.initMoodChart(data);
        
        // Initialize mood calendar
        this.initMoodCalendar(data);
        
        // Add event listeners to add entry button
        document.querySelector('.add-entry-btn').addEventListener('click', () => {
            this.openAddEntryModal('mood');
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.entry-edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const type = btn.getAttribute('data-type');
                this.openEditEntryModal(type, id);
            });
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.entry-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const type = btn.getAttribute('data-type');
                this.deleteEntry(type, id);
            });
        });
    },
    
    // Render weight view
    renderWeightView: function() {
        // Get data for selected date range
        const data = this.getDataForDateRange('weight');
        
        // Sort data by date
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Calculate stats
        const latest = data.length > 0 ? data[data.length - 1].value : 0;
        const first = data.length > 0 ? data[0].value : 0;
        const change = data.length > 0 ? (latest - first).toFixed(1) : 0;
        
        // Render view
        this.elements.healthContent.innerHTML = `
            <div class="health-view-container">
                <div class="view-header">
                    <h3>Weight Tracker</h3>
                    <button class="add-entry-btn" data-type="weight">Add Weight</button>
                </div>
                
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-value">${latest} kg</div>
                        <div class="stat-label">Current Weight</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${change} kg</div>
                        <div class="stat-label">Change</div>
                    </div>
                    ${this.goals.weight ? `
                        <div class="stat-card">
                            <div class="stat-value">${(latest - this.goals.weight).toFixed(1)} kg</div>
                            <div class="stat-label">To Goal</div>
                        </div>
                    ` : `
                        <div class="stat-card">
                            <div class="stat-value">-</div>
                            <div class="stat-label">No Goal Set</div>
                        </div>
                    `}
                </div>
                
                <div class="chart-container">
                    <canvas id="weight-chart"></canvas>
                </div>
                
                <div class="entries-container">
                    <h4>Weight Entries</h4>
                    <div class="entries-list">
                        ${data.length > 0 ? data.map(entry => `
                            <div class="entry-item" data-id="${entry.id}">
                                <div class="entry-date">${Utils.formatDate(new Date(entry.date))}</div>
                                <div class="entry-value">${entry.value} kg</div>
                                <div class="entry-actions">
                                    <button class="entry-edit-btn" data-id="${entry.id}" data-type="weight">Edit</button>
                                    <button class="entry-delete-btn" data-id="${entry.id}" data-type="weight">Delete</button>
                                </div>
                            </div>
                        `).join('') : '<div class="empty-state">No weight data for this period</div>'}
                    </div>
                </div>
            </div>
        `;
        
        // Initialize chart
        this.initWeightChart(data);
        
        // Add event listeners to add entry button
        document.querySelector('.add-entry-btn').addEventListener('click', () => {
            this.openAddEntryModal('weight');
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.entry-edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const type = btn.getAttribute('data-type');
                this.openEditEntryModal(type, id);
            });
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.entry-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const type = btn.getAttribute('data-type');
                this.deleteEntry(type, id);
            });
        });
    },
    
    // Render exercise view
    renderExerciseView: function() {
        // Get data for selected date range
        const data = this.getDataForDateRange('exercises');
        
        // Calculate stats
        const totalDuration = data.reduce((sum, item) => sum + item.duration, 0);
        const totalCalories = data.reduce((sum, item) => sum + item.calories, 0);
        const totalWorkouts = data.length;
        
        // Group exercises by type
        const exerciseTypes = {};
        data.forEach(exercise => {
            if (!exerciseTypes[exercise.name]) {
                exerciseTypes[exercise.name] = 0;
            }
            exerciseTypes[exercise.name]++;
        });
        
        // Sort exercise types by count
        const sortedTypes = Object.entries(exerciseTypes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        // Render view
        this.elements.healthContent.innerHTML = `
            <div class="health-view-container">
                <div class="view-header">
                    <h3>Exercise Tracker</h3>
                    <button class="add-entry-btn" data-type="exercise">Add Exercise</button>
                </div>
                
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-value">${totalWorkouts}</div>
                        <div class="stat-label">Workouts</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${totalDuration}</div>
                        <div class="stat-label">Minutes</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${totalCalories}</div>
                        <div class="stat-label">Calories</div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="exercise-chart"></canvas>
                </div>
                
                <div class="exercise-summary">
                    <h4>Most Common Exercises</h4>
                    <div class="exercise-types">
                        ${sortedTypes.length > 0 ? sortedTypes.map(([type, count]) => `
                            <div class="exercise-type-item">
                                <div class="exercise-type-name">${type}</div>
                                <div class="exercise-type-count">${count} times</div>
                            </div>
                        `).join('') : '<div class="empty-state">No exercise data for this period</div>'}
                    </div>
                </div>
                
                <div class="entries-container">
                    <h4>Exercise Entries</h4>
                    <div class="entries-list">
                        ${data.length > 0 ? data.map(entry => `
                            <div class="entry-item" data-id="${entry.id}">
                                <div class="entry-date">${Utils.formatDate(new Date(entry.date))}</div>
                                <div class="entry-details">
                                    <div class="entry-name">${entry.name}</div>
                                    <div class="entry-info">
                                        <span>${entry.duration} min</span>
                                        <span>${entry.calories} cal</span>
                                    </div>
                                </div>
                                <div class="entry-actions">
                                    <button class="entry-edit-btn" data-id="${entry.id}" data-type="exercise">Edit</button>
                                    <button class="entry-delete-btn" data-id="${entry.id}" data-type="exercise">Delete</button>
                                </div>
                            </div>
                        `).join('') : '<div class="empty-state">No exercise data for this period</div>'}
                    </div>
                </div>
            </div>
        `;
        
        // Initialize chart
        this.initExerciseChart(data);
        
        // Add event listeners to add entry button
        document.querySelector('.add-entry-btn').addEventListener('click', () => {
            this.openAddEntryModal('exercise');
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.entry-edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const type = btn.getAttribute('data-type');
                this.openEditEntryModal(type, id);
            });
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.entry-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const type = btn.getAttribute('data-type');
                this.deleteEntry(type, id);
            });
        });
    },
    
    // Get data for date range
    getDataForDateRange: function(type) {
        const today = new Date();
        let startDate;
        
        if (this.dateRange === 'day') {
            startDate = new Date(today);
            startDate.setHours(0, 0, 0, 0);
        } else if (this.dateRange === 'week') {
            startDate = new Date(today);
            startDate.setDate(startDate.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);
        } else if (this.dateRange === 'month') {
            startDate = new Date(today);
            startDate.setDate(startDate.getDate() - 29);
            startDate.setHours(0, 0, 0, 0);
        }
        
        // Filter data by date range
        return this.healthData[type].filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate && itemDate <= today;
        });
    },
    
    // Initialize progress circles
    initProgressCircles: function() {
        document.querySelectorAll('.progress-circle').forEach(circle => {
            const progress = parseInt(circle.getAttribute('data-progress'));
            
            // Calculate stroke-dashoffset
            const radius = 40;
            const circumference = 2 * Math.PI * radius;
            const dashoffset = circumference * (1 - progress / 100);
            
            // Create SVG
            circle.innerHTML = `
                <svg class="progress-ring" width="120" height="120">
                    <circle class="progress-ring-circle-bg" stroke="#e6e6e6" stroke-width="8" fill="transparent" r="${radius}" cx="60" cy="60"/>
                    <circle class="progress-ring-circle" stroke="var(--primary-color)" stroke-width="8" fill="transparent" r="${radius}" cx="60" cy="60"
                            stroke-dasharray="${circumference}" stroke-dashoffset="${dashoffset}"
                            transform="rotate(-90 60 60)"/>
                </svg>
                ${circle.innerHTML}
            `;
        });
    },
    
    // Initialize steps chart
    initStepsChart: function(data) {
        const ctx = document.getElementById('steps-chart').getContext('2d');
        
        // Prepare data
        const labels = data.map(item => Utils.formatShortDate(new Date(item.date)));
        const values = data.map(item => item.value);
        
        // Create chart
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Steps',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Steps'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    },
    
    // Initialize water chart
    initWaterChart: function(data) {
        const ctx = document.getElementById('water-chart').getContext('2d');
        
        // Prepare data
        const labels = data.map(item => Utils.formatShortDate(new Date(item.date)));
        const values = data.map(item => item.value);
        
        // Create chart
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Glasses of Water',
                    data: values,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Glasses'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    },
    
    // Initialize sleep chart
    initSleepChart: function(data) {
        const ctx = document.getElementById('sleep-chart').getContext('2d');
        
        // Prepare data
        const labels = data.map(item => Utils.formatShortDate(new Date(item.date)));
        const values = data.map(item => item.value);
        
        // Create chart
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sleep Hours',
                    data: values,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    },
    
    // Initialize meditation chart
    initMeditationChart: function(data) {
        const ctx = document.getElementById('meditation-chart').getContext('2d');
        
        // Prepare data
        const labels = data.map(item => Utils.formatShortDate(new Date(item.date)));
        const values = data.map(item => item.value);
        
        // Create chart
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Meditation Minutes',
                    data: values,
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Minutes'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    },
    
    // Initialize mood chart
    initMoodChart: function(data) {
        const ctx = document.getElementById('mood-chart').getContext('2d');
        
        // Prepare data
        const labels = data.map(item => Utils.formatShortDate(new Date(item.date)));
        const values = data.map(item => item.value);
        
        // Create chart
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Mood',
                    data: values,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        min: 1,
                        max: 5,
                        title: {
                            display: true,
                            text: 'Mood (1-5)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    },
    
    // Initialize mood calendar
    initMoodCalendar: function(data) {
        const calendarContainer = document.getElementById('mood-calendar');
        
        // Get current month and year
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Create calendar HTML
        let calendarHTML = `
            <div class="calendar-header">
                <h5>${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}</h5>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-header">Sun</div>
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
        `;
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const moodEntry = data.find(entry => entry.date === date);
            
            if (moodEntry) {
                calendarHTML += `
                    <div class="calendar-day">
                        <div class="calendar-date">${day}</div>
                        <div class="calendar-mood">${this.getMoodEmoji(moodEntry.value)}</div>
                    </div>
                `;
            } else {
                calendarHTML += `
                    <div class="calendar-day">
                        <div class="calendar-date">${day}</div>
                    </div>
                `;
            }
        }
        
        calendarHTML += '</div>';
        
        // Set calendar HTML
        calendarContainer.innerHTML = calendarHTML;
    },
    
    // Initialize weight chart
    initWeightChart: function(data) {
        const ctx = document.getElementById('weight-chart').getContext('2d');
        
        // Prepare data
        const labels = data.map(item => Utils.formatShortDate(new Date(item.date)));
        const values = data.map(item => item.value);
        
        // Create chart
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Weight (kg)',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Weight (kg)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    },
    
    // Initialize exercise chart
    initExerciseChart: function(data) {
        const ctx = document.getElementById('exercise-chart').getContext('2d');
        
        // Group data by date
        const groupedData = {};
        data.forEach(item => {
            if (!groupedData[item.date]) {
                groupedData[item.date] = {
                    duration: 0,
                    calories: 0
                };
            }
            groupedData[item.date].duration += item.duration;
            groupedData[item.date].calories += item.calories;
        });
        
        // Convert to arrays
        const dates = Object.keys(groupedData).sort();
        const durations = dates.map(date => groupedData[date].duration);
        const calories = dates.map(date => groupedData[date].calories);
        
        // Format dates
        const labels = dates.map(date => Utils.formatShortDate(new Date(date)));
        
        // Create chart
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Duration (min)',
                        data: durations,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Calories',
                        data: calories,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Duration (min)'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Calories'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    },
    
    // Open settings modal
    openSettingsModal: function() {
        // Set current values
        this.elements.stepsGoal.value = this.goals.steps;
        this.elements.waterGoal.value = this.goals.water;
        this.elements.sleepGoal.value = this.goals.sleep;
        this.elements.meditationGoal.value = this.goals.meditation;
        this.elements.weightGoal.value = this.goals.weight || '';
        
        // Show modal
        this.elements.healthSettingsModal.classList.add('active');
    },
    
    // Close settings modal
    closeSettingsModal: function() {
        this.elements.healthSettingsModal.classList.remove('active');
    },
    
    // Save settings
    saveSettings: async function() {
        try {
            // Get values
            const stepsGoal = parseInt(this.elements.stepsGoal.value);
            const waterGoal = parseInt(this.elements.waterGoal.value);
            const sleepGoal = parseFloat(this.elements.sleepGoal.value);
            const meditationGoal = parseInt(this.elements.meditationGoal.value);
            const weightGoal = this.elements.weightGoal.value ? parseFloat(this.elements.weightGoal.value) : null;
            
            // Update goals
            this.goals = {
                steps: stepsGoal,
                water: waterGoal,
                sleep: sleepGoal,
                meditation: meditationGoal,
                weight: weightGoal
            };
            
            // Save to database
            await window.PatelDB.put('settings', this.goals, 'health_goals');
            
            // Close modal
            this.closeSettingsModal();
            
            // Re-render current view
            this.setCurrentView(this.currentView);
            
            Utils.showNotification('Settings saved successfully', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            Utils.showNotification('Error saving settings', 'error');
        }
    },
    
    // Open add entry modal
    openAddEntryModal: function(type) {
        // Set entry type
        this.elements.entryType.value = type;
        
        // Set today's date
        this.elements.entryDate.value = new Date().toISOString().split('T')[0];
        
        // Set current time
        const now = new Date();
        this.elements.entryTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // Clear value
        this.elements.entryValue.value = '';
        
        // Clear notes
        this.elements.entryNotes.value = '';
        
        // Configure form based on type
        this.configureEntryForm(type);
        
        // Set title
        this.elements.addEntryTitle.textContent = `Add ${this.formatEntryType(type)}`;
        
        // Show modal
        this.elements.addEntryModal.classList.add('active');
    },
    
    // Open edit entry modal
    openEditEntryModal: function(type, id) {
        // Set entry type
        this.elements.entryType.value = type;
        
        // Get entry
        let entry;
        if (type === 'exercise') {
            entry = this.healthData.exercises.find(e => e.id === id);
        } else {
            entry = this.healthData[type].find(e => e.id === id);
        }
        
        if (!entry) {
            Utils.showNotification('Entry not found', 'error');
            return;
        }
        
        // Set values
        this.elements.entryDate.value = entry.date;
        this.elements.entryValue.value = entry.value;
        this.elements.entryNotes.value = entry.notes || '';
        
        // Configure form based on type
        this.configureEntryForm(type, entry);
        
        // Set title
        this.elements.addEntryTitle.textContent = `Edit ${this.formatEntryType(type)}`;
        
        // Set data-id attribute
        this.elements.addEntryForm.setAttribute('data-id', id);
        
        // Show modal
        this.elements.addEntryModal.classList.add('active');
    },
    
    // Configure entry form based on type
    configureEntryForm: function(type, entry = null) {
        // Reset form
        document.getElementById('entry-time-group').style.display = 'none';
        document.getElementById('entry-duration-group').style.display = 'none';
        document.getElementById('entry-mood-group').style.display = 'none';
        
        // Configure based on type
        switch (type) {
            case 'steps':
                this.elements.entryValueLabel.textContent = 'Steps';
                this.elements.entryValue.min = '0';
                this.elements.entryValue.step = '1';
                break;
            case 'water':
                this.elements.entryValueLabel.textContent = 'Glasses';
                this.elements.entryValue.min = '0';
                this.elements.entryValue.step = '1';
                break;
            case 'sleep':
                this.elements.entryValueLabel.textContent = 'Hours';
                this.elements.entryValue.min = '0';
                this.elements.entryValue.step = '0.5';
                break;
            case 'meditation':
                this.elements.entryValueLabel.textContent = 'Minutes';
                this.elements.entryValue.min = '0';
                this.elements.entryValue.step = '1';
                break;
            case 'mood':
                document.getElementById('entry-value-group').style.display = 'none';
                document.getElementById('entry-mood-group').style.display = 'block';
                
                // Reset mood buttons
                document.querySelectorAll('.mood-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Set mood value if editing
                if (entry && entry.value) {
                    document.querySelector(`.mood-btn[data-mood="${entry.value}"]`).classList.add('active');
                    this.elements.entryMoodValue.value = entry.value;
                } else {
                    this.elements.entryMoodValue.value = '';
                }
                break;
            case 'weight':
                this.elements.entryValueLabel.textContent = 'Weight (kg)';
                this.elements.entryValue.min = '0';
                this.elements.entryValue.step = '0.1';
                break;
            case 'exercise':
                this.elements.entryValueLabel.textContent = 'Calories';
                this.elements.entryValue.min = '0';
                this.elements.entryValue.step = '1';
                document.getElementById('entry-duration-group').style.display = 'block';
                
                // Set duration if editing
                if (entry && entry.duration) {
                    this.elements.entryDuration.value = entry.duration;
                } else {
                    this.elements.entryDuration.value = '';
                }
                break;
        }
    },
    
    // Close add entry modal
    closeAddEntryModal: function() {
        this.elements.addEntryModal.classList.remove('active');
        this.elements.addEntryForm.removeAttribute('data-id');
    },
    
    // Save entry
    saveEntry: async function() {
        try {
            const type = this.elements.entryType.value;
            const date = this.elements.entryDate.value;
            const notes = this.elements.entryNotes.value;
            
            // Get value based on type
            let value;
            if (type === 'mood') {
                value = parseInt(this.elements.entryMoodValue.value);
                if (!value || value < 1 || value > 5) {
                    Utils.showNotification('Please select a mood', 'error');
                    return;
                }
            } else {
                value = parseFloat(this.elements.entryValue.value);
                if (isNaN(value) || value < 0) {
                    Utils.showNotification('Please enter a valid value', 'error');
                    return;
                }
            }
            
            // Check if editing or adding
            const entryId = this.elements.addEntryForm.getAttribute('data-id');
            
            if (entryId) {
                // Editing existing entry
                if (type === 'exercise') {
                    const duration = parseInt(this.elements.entryDuration.value);
                    if (isNaN(duration) || duration <= 0) {
                        Utils.showNotification('Please enter a valid duration', 'error');
                        return;
                    }
                    
                    // Update exercise
                    const exercise = this.healthData.exercises.find(e => e.id === parseInt(entryId));
                    if (exercise) {
                        exercise.date = date;
                        exercise.calories = value;
                        exercise.duration = duration;
                        exercise.notes = notes;
                        
                        await window.PatelDB.update('health_exercises', exercise);
                    }
                } else {
                    // Update entry
                    const entry = this.healthData[type].find(e => e.id === parseInt(entryId));
                    if (entry) {
                        entry.date = date;
                        entry.value = value;
                        entry.notes = notes;
                        
                        await window.PatelDB.update(`health_${type}`, entry);
                    }
                }
                
                Utils.showNotification('Entry updated successfully', 'success');
            } else {
                // Adding new entry
                if (type === 'exercise') {
                    const duration = parseInt(this.elements.entryDuration.value);
                    if (isNaN(duration) || duration <= 0) {
                        Utils.showNotification('Please enter a valid duration', 'error');
                        return;
                    }
                    
                    // Create exercise object
                    const exercise = {
                        name: 'Exercise', // Default name, would be customizable in a real app
                        date: date,
                        duration: duration,
                        calories: value,
                        notes: notes
                    };
                    
                    // Save to database
                    const exerciseId = await window.PatelDB.add('health_exercises', exercise);
                    exercise.id = exerciseId;
                    
                    // Add to exercises array
                    this.healthData.exercises.push(exercise);
                } else {
                    // Create entry object
                    const entry = {
                        date: date,
                        value: value,
                        notes: notes
                    };
                    
                    // Save to database
                    const entryId = await window.PatelDB.add(`health_${type}`, entry);
                    entry.id = entryId;
                    
                    // Add to data array
                    this.healthData[type].push(entry);
                }
                
                Utils.showNotification('Entry added successfully', 'success');
            }
            
            // Close modal
            this.closeAddEntryModal();
            
            // Re-render current view
            this.setCurrentView(this.currentView);
        } catch (error) {
            console.error('Error saving entry:', error);
            Utils.showNotification('Error saving entry', 'error');
        }
    },
    
    // Delete entry
    deleteEntry: async function(type, id) {
        if (!confirm('Are you sure you want to delete this entry?')) {
            return;
        }
        
        try {
            // Delete from database
            if (type === 'exercise') {
                await window.PatelDB.delete('health_exercises', id);
                
                // Remove from exercises array
                this.healthData.exercises = this.healthData.exercises.filter(e => e.id !== id);
            } else {
                await window.PatelDB.delete(`health_${type}`, id);
                
                // Remove from data array
                this.healthData[type] = this.healthData[type].filter(e => e.id !== id);
            }
            
            // Re-render current view
            this.setCurrentView(this.currentView);
            
            Utils.showNotification('Entry deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting entry:', error);
            Utils.showNotification('Error deleting entry', 'error');
        }
    },
    
    // Open meditation timer modal
    openMeditationTimerModal: function() {
        // Reset timer
        this.elements.timerMinutes.textContent = '15';
        this.elements.timerSeconds.textContent = '00';
        this.elements.timerProgress.style.width = '0%';
        
        // Reset buttons
        this.elements.timerStartBtn.disabled = false;
        this.elements.timerPauseBtn.disabled = true;
        
        // Show modal
        this.elements.meditationTimerModal.classList.add('active');
    },
    
    // Close meditation timer modal
    closeMeditationTimerModal: function() {
        // Stop timer if running
        if (this.meditationTimer) {
            clearInterval(this.meditationTimer);
            this.meditationTimer = null;
        }
        
        // Stop ambient sound if playing
        if (this.ambientSound) {
            this.ambientSound.pause();
            this.ambientSound = null;
        }
        
        this.elements.meditationTimerModal.classList.remove('active');
    },
    
    // Decrease meditation time
    decreaseMeditationTime: function() {
        let minutes = parseInt(this.elements.timerMinutes.textContent);
        if (minutes > 5) {
            minutes -= 5;
            this.elements.timerMinutes.textContent = minutes.toString();
            this.elements.timerSeconds.textContent = '00';
        }
    },
    
    // Increase meditation time
    increaseMeditationTime: function() {
        let minutes = parseInt(this.elements.timerMinutes.textContent);
        if (minutes < 60) {
            minutes += 5;
            this.elements.timerMinutes.textContent = minutes.toString();
            this.elements.timerSeconds.textContent = '00';
        }
    },
    
    // Start meditation timer
    startMeditationTimer: function() {
        // Get total seconds
        const minutes = parseInt(this.elements.timerMinutes.textContent);
        const seconds = parseInt(this.elements.timerSeconds.textContent);
        let totalSeconds = minutes * 60 + seconds;
        const initialSeconds = totalSeconds;
        
        // Update buttons
        this.elements.timerStartBtn.disabled = true;
        this.elements.timerPauseBtn.disabled = false;
        this.elements.timerPauseBtn.textContent = 'Pause';
        
        // Start timer
        this.meditationTimer = setInterval(() => {
            totalSeconds--;
            
            if (totalSeconds <= 0) {
                // Timer complete
                clearInterval(this.meditationTimer);
                this.meditationTimer = null;
                
                // Update display
                this.elements.timerMinutes.textContent = '00';
                this.elements.timerSeconds.textContent = '00';
                this.elements.timerProgress.style.width = '100%';
                
                // Update buttons
                this.elements.timerStartBtn.disabled = false;
                this.elements.timerPauseBtn.disabled = true;
                
                // Show notification
                Utils.showNotification('Meditation complete!', 'success');
                
                // Add meditation entry
                this.addMeditationEntry(initialSeconds / 60);
                
                // Stop ambient sound if playing
                if (this.ambientSound) {
                    this.ambientSound.pause();
                    this.ambientSound = null;
                }
            } else {
                // Update display
                const min = Math.floor(totalSeconds / 60);
                const sec = totalSeconds % 60;
                this.elements.timerMinutes.textContent = min.toString().padStart(2, '0');
                this.elements.timerSeconds.textContent = sec.toString().padStart(2, '0');
                
                // Update progress
                const progress = ((initialSeconds - totalSeconds) / initialSeconds) * 100;
                this.elements.timerProgress.style.width = `${progress}%`;
                
                // Update guidance message
                this.updateGuidanceMessage(totalSeconds);
            }
        }, 1000);
    },
    
    // Pause meditation timer
    pauseMeditationTimer: function() {
        if (this.meditationTimer) {
            // If timer is running, pause it
            clearInterval(this.meditationTimer);
            this.meditationTimer = null;
            this.elements.timerPauseBtn.textContent = 'Resume';
        } else {
            // If timer is paused, resume it
            this.startMeditationTimer();
        }
    },
    
    // Update guidance message
    updateGuidanceMessage: function(seconds) {
        // Cycle through guidance messages
        const messages = [
            'Take a deep breath in... and slowly exhale.',
            'Focus on your breath. Notice the sensation of air entering and leaving your body.',
            'If your mind wanders, gently bring your attention back to your breath.',
            'Relax your shoulders and release any tension in your body.',
            'Observe your thoughts without judgment. Let them come and go like clouds in the sky.'
        ];
        
        const index = Math.floor((seconds / 30) % messages.length);
        this.elements.guidanceMessage.textContent = messages[index];
    },
    
    // Set ambience sound
    setAmbienceSound: function(sound) {
        // Stop current sound if playing
        if (this.ambientSound) {
            this.ambientSound.pause();
            this.ambientSound = null;
        }
        
        if (sound === 'none') {
            return;
        }
        
        // In a real implementation, we would play the selected ambient sound
        // For now, just show a notification
        Utils.showNotification(`${sound} sound selected`, 'info');
    },
    
    // Add meditation entry
    addMeditationEntry: async function(minutes) {
        try {
            // Create entry object
            const entry = {
                date: new Date().toISOString().split('T')[0],
                value: Math.round(minutes),
                notes: 'Added from meditation timer'
            };
            
            // Save to database
            const entryId = await window.PatelDB.add('health_meditation', entry);
            entry.id = entryId;
            
            // Add to data array
            this.healthData.meditation.push(entry);
            
            // Re-render current view if on meditation view
            if (this.currentView === 'meditation') {
                this.setCurrentView('meditation');
            }
        } catch (error) {
            console.error('Error adding meditation entry:', error);
        }
    },
    
    // Check for motion sensors
    checkMotionSensors: function() {
        if ('DeviceMotionEvent' in window) {
            console.log('Device motion is supported');
            
            // In a real implementation, we would set up step counting
            // using the device's motion sensors
        } else {
            console.log('Device motion is not supported');
        }
    },
    
    // Setup notifications
    setupNotifications: function() {
        // Check if notifications are supported
        if ('Notification' in window) {
            // Request permission
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                    
                    // Schedule notifications
                    this.scheduleNotifications();
                }
            });
        }
    },
    
    // Schedule notifications
    scheduleNotifications: function() {
        // In a real implementation, we would schedule notifications
        // for water, meditation, and sleep reminders
        
        // For now, just log to console
        console.log('Notifications scheduled');
    },
    
    // Get mood emoji
    getMoodEmoji: function(mood) {
        switch (mood) {
            case 1: return '😢';
            case 2: return '😕';
            case 3: return '😐';
            case 4: return '🙂';
            case 5: return '😄';
            default: return '❓';
        }
    },
    
    // Get mood label
    getMoodLabel: function(mood) {
        switch (mood) {
            case 1: return 'Very Bad';
            case 2: return 'Bad';
            case 3: return 'Neutral';
            case 4: return 'Good';
            case 5: return 'Very Good';
            default: return 'Unknown';
        }
    },
    
    // Format entry type
    formatEntryType: function(type) {
        switch (type) {
            case 'steps': return 'Steps';
            case 'water': return 'Water';
            case 'sleep': return 'Sleep';
            case 'meditation': return 'Meditation';
            case 'mood': return 'Mood';
            case 'weight': return 'Weight';
            case 'exercise': return 'Exercise';
            default: return type;
        }
    }
};

// Register module
window['healthModule'] = healthModule;
