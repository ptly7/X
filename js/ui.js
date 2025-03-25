/**
 * UI Management for Patel Productivity Suite
 * Handles UI interactions and module loading
 */

class UI {
    constructor() {
        this.currentModule = 'dashboard';
        this.modules = {};
        this.moduleLoaded = {};
        this.themeToggle = document.getElementById('theme-toggle');
        this.menuToggle = document.getElementById('menu-toggle');
        this.sidebar = document.getElementById('sidebar');
        this.settingsBtn = document.getElementById('settings-btn');
        this.settingsModal = document.getElementById('settings-modal');
        this.themeSelect = document.getElementById('theme-select');
        this.exportDataBtn = document.getElementById('export-data-btn');
        this.importDataBtn = document.getElementById('import-data-btn');
        this.clearDataBtn = document.getElementById('clear-data-btn');
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        this.navLinks = document.querySelectorAll('.main-nav a');
        
        // PatelBot elements
        this.patelBotModal = document.getElementById('patelbot-modal');
        this.assistantTextInput = document.getElementById('assistant-text-input');
        this.assistantVoiceBtn = document.getElementById('assistant-voice-btn');
        this.assistantSendBtn = document.getElementById('assistant-send-btn');
        this.assistantMessages = document.querySelector('.assistant-messages');
        
        this.init();
    }
    
    /**
     * Initialize UI
     */
    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.loadModule('dashboard');
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Theme toggle
        this.themeToggle.addEventListener('click', () => {
            const currentTheme = Utils.getCurrentTheme();
            Utils.setTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
        
        // Menu toggle (mobile)
        this.menuToggle.addEventListener('click', () => {
            this.sidebar.classList.toggle('active');
        });
        
        // Settings button
        this.settingsBtn.addEventListener('click', () => {
            this.openModal(this.settingsModal);
        });
        
        // Theme select
        this.themeSelect.addEventListener('change', () => {
            Utils.setTheme(this.themeSelect.value);
        });
        
        // Export data
        this.exportDataBtn.addEventListener('click', async () => {
            try {
                const data = await window.PatelDB.exportData();
                Utils.downloadData(data, 'patel-productivity-suite-backup.json');
                Utils.showNotification('Data exported successfully', 'success');
            } catch (error) {
                console.error('Error exporting data:', error);
                Utils.showNotification('Error exporting data', 'error');
            }
        });
        
        // Import data
        this.importDataBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            
            input.addEventListener('change', async (event) => {
                try {
                    const file = event.target.files[0];
                    const content = await Utils.readFileAsText(file);
                    const data = JSON.parse(content);
                    await window.PatelDB.importData(data);
                    Utils.showNotification('Data imported successfully', 'success');
                    
                    // Reload current module
                    this.loadModule(this.currentModule);
                } catch (error) {
                    console.error('Error importing data:', error);
                    Utils.showNotification('Error importing data', 'error');
                }
            });
            
            input.click();
        });
        
        // Clear data
        this.clearDataBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                try {
                    // Clear each store
                    window.PatelDB.stores.forEach(async (store) => {
                        await window.PatelDB.clear(store.name);
                    });
                    
                    Utils.showNotification('All data cleared successfully', 'success');
                    
                    // Reload current module
                    this.loadModule(this.currentModule);
                } catch (error) {
                    console.error('Error clearing data:', error);
                    Utils.showNotification('Error clearing data', 'error');
                }
            }
        });
        
        // Close modals
        this.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                this.closeModal(modal);
            });
        });
        
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                
                // Close sidebar on mobile
                if (window.innerWidth <= 768) {
                    this.sidebar.classList.remove('active');
                }
                
                const module = link.getAttribute('data-module');
                this.loadModule(module);
            });
        });
        
        // PatelBot
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.closeModal(activeModal);
                }
            }
        });
        
        // PatelBot voice button
        this.assistantVoiceBtn.addEventListener('click', () => {
            this.startSpeechRecognition();
        });
        
        // PatelBot send button
        this.assistantSendBtn.addEventListener('click', () => {
            this.sendAssistantMessage();
        });
        
        // PatelBot text input
        this.assistantTextInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.sendAssistantMessage();
            }
        });
    }
    
    /**
     * Load theme from localStorage
     */
    loadTheme() {
        const savedTheme = Utils.loadFromLocalStorage('theme', 'light');
        Utils.setTheme(savedTheme);
        this.themeSelect.value = savedTheme;
    }
    
    /**
     * Load a module
     * @param {string} moduleName - Name of the module to load
     */
    async loadModule(moduleName) {
        // Update active link
        this.navLinks.forEach(link => {
            if (link.getAttribute('data-module') === moduleName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Hide all modules
        document.querySelectorAll('.module').forEach(module => {
            module.classList.remove('active');
        });
        
        // Show selected module
        const moduleElement = document.getElementById(moduleName);
        moduleElement.classList.add('active');
        
        // Set current module
        this.currentModule = moduleName;
        
        // Load module content if not already loaded
        if (!this.moduleLoaded[moduleName] && moduleName !== 'dashboard') {
            moduleElement.innerHTML = '<div class="loading">Loading module...</div>';
            
            try {
                // Load module script if not already loaded
                if (!this.modules[moduleName]) {
                    await this.loadModuleScript(moduleName);
                }
                
                // Initialize module
                if (this.modules[moduleName] && typeof this.modules[moduleName].init === 'function') {
                    await this.modules[moduleName].init(moduleElement);
                }
                
                this.moduleLoaded[moduleName] = true;
            } catch (error) {
                console.error(`Error loading module ${moduleName}:`, error);
                moduleElement.innerHTML = `<div class="error">Error loading module: ${error.message}</div>`;
            }
        }
        
        // Update dashboard widgets if on dashboard
        if (moduleName === 'dashboard') {
            this.updateDashboardWidgets();
        }
    }
    
    /**
     * Load a module script
     * @param {string} moduleName - Name of the module to load
     * @returns {Promise} Promise that resolves when the script is loaded
     */
    loadModuleScript(moduleName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `modules/${moduleName}/index.js`;
            script.onload = () => {
                if (window[`${moduleName}Module`]) {
                    this.modules[moduleName] = window[`${moduleName}Module`];
                    resolve();
                } else {
                    reject(new Error(`Module ${moduleName} not found`));
                }
            };
            script.onerror = () => {
                reject(new Error(`Failed to load module script for ${moduleName}`));
            };
            document.body.appendChild(script);
        });
    }
    
    /**
     * Update dashboard widgets
     */
    async updateDashboardWidgets() {
        try {
            // Tasks widget
            const tasksWidget = document.getElementById('tasks-widget');
            const tasksContent = tasksWidget.querySelector('.widget-content');
            
            const tasks = await window.PatelDB.getAll('tasks');
            if (tasks.length > 0) {
                const incompleteTasks = tasks.filter(task => !task.completed);
                const sortedTasks = incompleteTasks.sort((a, b) => {
                    if (a.priority !== b.priority) {
                        return b.priority - a.priority; // Higher priority first
                    }
                    return new Date(a.dueDate) - new Date(b.dueDate); // Earlier due date first
                }).slice(0, 5); // Get top 5
                
                let tasksHtml = '<ul class="dashboard-list">';
                sortedTasks.forEach(task => {
                    const isPastDue = Utils.isPast(task.dueDate) && !Utils.isToday(task.dueDate);
                    tasksHtml += `
                        <li class="${isPastDue ? 'past-due' : ''}">
                            <span class="priority priority-${task.priority}"></span>
                            <span class="task-title">${task.title}</span>
                            <span class="task-due">${Utils.isToday(task.dueDate) ? 'Today' : Utils.formatDate(task.dueDate)}</span>
                        </li>
                    `;
                });
                tasksHtml += '</ul>';
                
                tasksContent.innerHTML = tasksHtml;
            } else {
                tasksContent.innerHTML = '<p>No tasks yet. Add some in the Task Manager.</p>';
            }
            
            // Calendar widget
            const calendarWidget = document.getElementById('calendar-widget');
            const calendarContent = calendarWidget.querySelector('.widget-content');
            
            const today = new Date();
            const events = await window.PatelDB.getAll('events');
            
            if (events.length > 0) {
                // Get events for today and upcoming days (up to 5 events)
                const upcomingEvents = events
                    .filter(event => new Date(event.startDate) >= today)
                    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                    .slice(0, 5);
                
                if (upcomingEvents.length > 0) {
                    let eventsHtml = '<ul class="dashboard-list">';
                    upcomingEvents.forEach(event => {
                        eventsHtml += `
                            <li>
                                <span class="event-title">${event.title}</span>
                                <span class="event-date">${Utils.formatDate(event.startDate)}</span>
                            </li>
                        `;
                    });
                    eventsHtml += '</ul>';
                    
                    calendarContent.innerHTML = eventsHtml;
                } else {
                    calendarContent.innerHTML = '<p>No upcoming events.</p>';
                }
            } else {
                calendarContent.innerHTML = '<p>No events yet. Add some in the Calendar.</p>';
            }
            
            // Notes widget
            const notesWidget = document.getElementById('notes-widget');
            const notesContent = notesWidget.querySelector('.widget-content');
            
            const notes = await window.PatelDB.getAll('notes');
            if (notes.length > 0) {
                const recentNotes = notes
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .slice(0, 3);
                
                let notesHtml = '<ul class="dashboard-list">';
                recentNotes.forEach(note => {
                    notesHtml += `
                        <li>
                            <span class="note-title">${note.title}</span>
                            <span class="note-date">${Utils.formatRelativeTime(note.updatedAt)}</span>
                        </li>
                    `;
                });
                notesHtml += '</ul>';
                
                notesContent.innerHTML = notesHtml;
            } else {
                notesContent.innerHTML = '<p>No notes yet. Add some in Note Ninja.</p>';
            }
            
            // Habits widget
            const habitsWidget = document.getElementById('habits-widget');
            const habitsContent = habitsWidget.querySelector('.widget-content');
            
            const habits = await window.PatelDB.getAll('habits');
            if (habits.length > 0) {
                const habitLogs = await window.PatelDB.getAll('habitLogs');
                
                // Get today's date in YYYY-MM-DD format
                const todayStr = Utils.formatDate(today);
                
                let habitsHtml = '<ul class="dashboard-list">';
                habits.slice(0, 5).forEach(habit => {
                    const completedToday = habitLogs.some(log => 
                        log.habitId === habit.id && Utils.formatDate(log.date) === todayStr
                    );
                    
                    habitsHtml += `
                        <li class="${completedToday ? 'completed' : ''}">
                            <span class="habit-check">${completedToday ? '✓' : '○'}</span>
                            <span class="habit-title">${habit.title}</span>
                        </li>
                    `;
                });
                habitsHtml += '</ul>';
                
                habitsContent.innerHTML = habitsHtml;
            } else {
                habitsContent.innerHTML = '<p>No habits yet. Add some in Habit Hero.</p>';
            }
        } catch (error) {
            console.error('Error updating dashboard widgets:', error);
        }
    }
    
    /**
     * Open a modal
     * @param {HTMLElement} modal - Modal to open
     */
    openModal(modal) {
        modal.classList.add('active');
    }
    
    /**
     * Close a modal
     * @param {HTMLElement} modal - Modal to close
     */
    closeModal(modal) {
        modal.classList.remove('active');
    }
    
    /**
     * Start speech recognition
     */
    startSpeechRecognition() {
        if (!Utils.isFeatureSupported('webSpeech')) {
            Utils.showNotification('Speech recognition is not supported in your browser', 'error');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        
        recognition.onstart = () => {
            this.assistantVoiceBtn.textContent = '🔴';
            Utils.showNotification('Listening...', 'info');
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.assistantTextInput.value = transcript;
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            Utils.showNotification(`Speech recognition error: ${event.error}`, 'error');
            this.assistantVoiceBtn.textContent = '🎤';
        };
        
        recognition.onend = () => {
            this.assistantVoiceBtn.textContent = '🎤';
        };
        
        recognition.start();
    }
    
    /**
     * Send a message to PatelBot
     */
    sendAssistantMessage() {
        const message = this.assistantTextInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        this.addMessageToChat(message, 'user');
        
        // Clear input
        this.assistantTextInput.value = '';
        
        // Process message and get response
        this.processAssistantMessage(message);
    }
    
    /**
     * Add a message to the chat
     * @param {string} message - Message text
     * @param {string} sender - Message sender ('user' or 'assistant')
     */
    addMessageToChat(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.innerHTML = `<p>${message}</p>`;
        
        this.assistantMessages.appendChild(messageElement);
        
        // Scroll to bottom
        this.assistantMessages.scrollTop = this.assistantMessages.scrollHeight;
    }
    
    /**
     * Process a message and get a response from PatelBot
     * @param {string} message - User message
     */
    processAssistantMessage(message) {
        // Simple responses for demonstration
        let response;
        
        // Convert message to lowercase for easier matching
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            response = "Hello! How can I help you today?";
        } else if (lowerMessage.includes('how are you')) {
            response = "I'm just a local AI assistant, but I'm functioning perfectly! How can I assist you?";
        } else if (lowerMessage.includes('thank')) {
            response = "You're welcome! Is there anything else I can help with?";
        } else if (lowerMessage.includes('joke')) {
            const jokes = [
                "Why don't scientists trust atoms? Because they make up everything!",
                "Why did the scarecrow win an award? Because he was outstanding in his field!",
                "Why don't skeletons fight each other? They don't have the guts!",
                "What do you call a fake noodle? An impasta!",
                "How does a penguin build its house? Igloos it together!"
            ];
            response = jokes[Math.floor(Math.random() * jokes.length)];
        } else if (lowerMessage.includes('motivat')) {
            const quotes = [
                "The only way to do great work is to love what you do. - Steve Jobs",
                "Believe you can and you're halfway there. - Theodore Roosevelt",
                "It does not matter how slowly you go as long as you do not stop. - Confucius",
                "Quality is not an act, it is a habit. - Aristotle",
                "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"
            ];
            response = quotes[Math.floor(Math.random() * quotes.length)];
        } else if (lowerMessage.includes('productivity') || lowerMessage.includes('tip')) {
            const tips = [
                "Try the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break.",
                "Use the 2-minute rule: If a task takes less than 2 minutes, do it immediately.",
                "Plan your day the night before to hit the ground running.",
                "Batch similar tasks together to minimize context switching.",
                "Take regular breaks to maintain high productivity throughout the day."
            ];
            response = tips[Math.floor(Math.random() * tips.length)];
        } else {
            response = "I'm a simple offline assistant. I can tell jokes, provide motivation, or share productivity tips. How can I help you?";
        }
        
        // Add assistant response after a short delay
        setTimeout(() => {
            this.addMessageToChat(response, 'assistant');
        }, 500);
    }
}

window.UI = new UI(); // Initialize and make available globally
