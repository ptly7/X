// AI Integration for Patel Productivity Suite Modules

// This file integrates the TensorFlow.js and Web Speech API functionality
// with each module of the Patel Productivity Suite

const AIIntegration = {
    // Initialize AI integration
    init: async function() {
        console.log('Initializing AI integration...');
        
        try {
            // Initialize TensorFlow.js
            const tfInitialized = await window.TensorFlowAI.init();
            
            // Initialize Web Speech API
            const speechInitialized = window.SpeechAPI.init();
            
            if (tfInitialized && speechInitialized) {
                console.log('AI integration initialized successfully');
                
                // Integrate AI with modules
                this.integrateWithTaskManager();
                this.integrateWithCalendar();
                this.integrateWithNotes();
                this.integrateWithFinance();
                this.integrateWithHabits();
                this.integrateWithFocus();
                this.integrateWithResearch();
                this.integrateWithNetworking();
                this.integrateWithFileManager();
                this.integrateWithHealth();
                this.integrateWithPatelBot();
                
                return true;
            } else {
                console.error('Failed to initialize AI integration');
                return false;
            }
        } catch (error) {
            console.error('Error initializing AI integration:', error);
            return false;
        }
    },
    
    // Integrate AI with Task Manager module
    integrateWithTaskManager: function() {
        console.log('Integrating AI with Task Manager module...');
        
        // Add AI-powered task prioritization
        if (window.taskManagerModule) {
            // Original addTask method
            const originalAddTask = window.taskManagerModule.addTask;
            
            // Override addTask method with AI prioritization
            window.taskManagerModule.addTask = async function(taskData) {
                try {
                    // Extract task data for AI prioritization
                    const aiTaskData = {
                        urgency: taskData.urgency || 5,
                        importance: taskData.importance || 5,
                        effort: taskData.effort || 5,
                        deadline: taskData.deadline ? this.calculateDaysUntilDeadline(taskData.deadline) : 30
                    };
                    
                    // Get AI-suggested priority
                    const priorityScore = await window.TensorFlowAI.predictTaskPriority(aiTaskData);
                    
                    // Convert priority score to 1-10 scale
                    const aiPriority = Math.round(priorityScore * 10);
                    
                    // Use AI priority if not explicitly set by user
                    if (!taskData.priority) {
                        taskData.priority = aiPriority;
                        taskData.aiSuggested = true;
                    }
                    
                    // Add AI category suggestion
                    if (taskData.title && !taskData.category) {
                        const category = await window.TensorFlowAI.classifyText(taskData.title);
                        taskData.category = category;
                        taskData.aiCategorized = true;
                    }
                    
                    // Call original method
                    return originalAddTask.call(this, taskData);
                } catch (error) {
                    console.error('Error in AI task prioritization:', error);
                    return originalAddTask.call(this, taskData);
                }
            };
            
            // Add helper method to calculate days until deadline
            window.taskManagerModule.calculateDaysUntilDeadline = function(deadlineDate) {
                const today = new Date();
                const deadline = new Date(deadlineDate);
                const diffTime = deadline - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return Math.max(0, diffDays);
            };
            
            // Add voice command support
            window.addEventListener('speech-recognition-result', (event) => {
                if (event.detail.isFinal && window.currentModule === 'task-manager') {
                    const transcript = event.detail.transcript.toLowerCase();
                    
                    // Check for task creation commands
                    if (transcript.includes('add task') || transcript.includes('create task')) {
                        const taskTitle = transcript.replace(/add task|create task/i, '').trim();
                        if (taskTitle) {
                            window.taskManagerModule.openAddTaskModal();
                            document.getElementById('task-title').value = taskTitle;
                        }
                    }
                    
                    // Check for task filtering commands
                    if (transcript.includes('show all tasks')) {
                        window.taskManagerModule.filterTasks('all');
                    } else if (transcript.includes('show today')) {
                        window.taskManagerModule.filterTasks('today');
                    } else if (transcript.includes('show upcoming')) {
                        window.taskManagerModule.filterTasks('upcoming');
                    } else if (transcript.includes('show completed')) {
                        window.taskManagerModule.filterTasks('completed');
                    }
                }
            });
            
            console.log('AI integration with Task Manager completed');
        } else {
            console.warn('Task Manager module not found');
        }
    },
    
    // Integrate AI with Calendar module
    integrateWithCalendar: function() {
        console.log('Integrating AI with Calendar module...');
        
        if (window.calendarModule) {
            // Original addEvent method
            const originalAddEvent = window.calendarModule.addEvent;
            
            // Override addEvent method with AI categorization
            window.calendarModule.addEvent = async function(eventData) {
                try {
                    // Add AI category suggestion if not set
                    if (eventData.title && !eventData.category) {
                        const category = await window.TensorFlowAI.classifyText(eventData.title);
                        eventData.category = category;
                        eventData.aiCategorized = true;
                    }
                    
                    // Call original method
                    return originalAddEvent.call(this, eventData);
                } catch (error) {
                    console.error('Error in AI event categorization:', error);
                    return originalAddEvent.call(this, eventData);
                }
            };
            
            // Add smart event suggestion
            window.calendarModule.suggestEvents = async function() {
                try {
                    // Get tasks from task manager
                    const tasks = await window.PatelDB.getAll('tasks');
                    
                    // Filter tasks with deadlines that don't have corresponding events
                    const tasksWithDeadlines = tasks.filter(task => 
                        task.deadline && !task.completed && !task.eventCreated
                    );
                    
                    // Get existing events
                    const events = await window.PatelDB.getAll('events');
                    
                    // Create suggested events
                    const suggestedEvents = [];
                    
                    for (const task of tasksWithDeadlines) {
                        // Check if event already exists for this task
                        const eventExists = events.some(event => 
                            event.linkedTaskId === task.id
                        );
                        
                        if (!eventExists) {
                            // Create suggested event
                            const suggestedEvent = {
                                title: `Work on: ${task.title}`,
                                start: this.suggestEventTime(task),
                                end: this.suggestEventEndTime(task),
                                category: task.category || 'work',
                                description: `Suggested time to work on task: ${task.title}`,
                                linkedTaskId: task.id,
                                aiSuggested: true
                            };
                            
                            suggestedEvents.push(suggestedEvent);
                        }
                    }
                    
                    return suggestedEvents;
                } catch (error) {
                    console.error('Error suggesting events:', error);
                    return [];
                }
            };
            
            // Helper method to suggest event time
            window.calendarModule.suggestEventTime = function(task) {
                const deadline = new Date(task.deadline);
                const today = new Date();
                
                // If deadline is today, suggest current time + 1 hour
                if (deadline.toDateString() === today.toDateString()) {
                    const suggestedTime = new Date();
                    suggestedTime.setHours(suggestedTime.getHours() + 1);
                    return suggestedTime.toISOString();
                }
                
                // If deadline is tomorrow, suggest 10 AM
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                if (deadline.toDateString() === tomorrow.toDateString()) {
                    const suggestedTime = new Date(tomorrow);
                    suggestedTime.setHours(10, 0, 0, 0);
                    return suggestedTime.toISOString();
                }
                
                // Otherwise, suggest 1 day before deadline at 10 AM
                const suggestedTime = new Date(deadline);
                suggestedTime.setDate(suggestedTime.getDate() - 1);
                suggestedTime.setHours(10, 0, 0, 0);
                return suggestedTime.toISOString();
            };
            
            // Helper method to suggest event end time (1 hour after start)
            window.calendarModule.suggestEventEndTime = function(task) {
                const startTime = new Date(this.suggestEventTime(task));
                const endTime = new Date(startTime);
                endTime.setHours(endTime.getHours() + 1);
                return endTime.toISOString();
            };
            
            // Add voice command support
            window.addEventListener('speech-recognition-result', (event) => {
                if (event.detail.isFinal && window.currentModule === 'calendar') {
                    const transcript = event.detail.transcript.toLowerCase();
                    
                    // Check for event creation commands
                    if (transcript.includes('add event') || transcript.includes('create event')) {
                        const eventTitle = transcript.replace(/add event|create event/i, '').trim();
                        if (eventTitle) {
                            window.calendarModule.openAddEventModal();
                            document.getElementById('event-title').value = eventTitle;
                        }
                    }
                    
                    // Check for view changing commands
                    if (transcript.includes('show month')) {
                        window.calendarModule.changeView('month');
                    } else if (transcript.includes('show week')) {
                        window.calendarModule.changeView('week');
                    } else if (transcript.includes('show day')) {
                        window.calendarModule.changeView('day');
                    } else if (transcript.includes('show agenda')) {
                        window.calendarModule.changeView('agenda');
                    }
                }
            });
            
            console.log('AI integration with Calendar completed');
        } else {
            console.warn('Calendar module not found');
        }
    },
    
    // Integrate AI with Notes module
    integrateWithNotes: function() {
        console.log('Integrating AI with Notes module...');
        
        if (window.notesModule) {
            // Add AI-powered note tagging
            window.notesModule.generateTags = async function(noteContent) {
                try {
                    // Simple keyword extraction (in a real app, would use TensorFlow.js)
                    const words = noteContent.toLowerCase().split(/\s+/);
                    const commonWords = ['the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
                    const filteredWords = words.filter(word => 
                        word.length > 3 && !commonWords.includes(word)
                    );
                    
                    // Count word frequency
                    const wordCounts = {};
                    filteredWords.forEach(word => {
                        wordCounts[word] = (wordCounts[word] || 0) + 1;
                    });
                    
                    // Sort by frequency
                    const sortedWords = Object.entries(wordCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(entry => entry[0]);
                    
                    // Take top 5 words as tags
                    const tags = sortedWords.slice(0, 5);
                    
                    // Classify note content
                    const category = await window.TensorFlowAI.classifyText(noteContent);
                    if (category && !tags.includes(category)) {
                        tags.unshift(category);
                    }
                    
                    return tags;
                } catch (error) {
                    console.error('Error generating tags:', error);
                    return [];
                }
            };
            
            // Add AI-powered note summarization
            window.notesModule.summarizeNote = async function(noteContent) {
                try {
                    const summary = await window.TensorFlowAI.summarizeText(noteContent, 200);
                    return summary;
                } catch (error) {
                    console.error('Error summarizing note:', error);
                    return noteContent.substring(0, 100) + '...';
                }
            };
            
            // Original saveNote method
            const originalSaveNote = window.notesModule.saveNote;
            
            // Override saveNote method with AI tagging
            window.notesModule.saveNote = async function(noteData) {
                try {
                    // Generate tags if not provided
                    if (noteData.content && (!noteData.tags || noteData.tags.length === 0)) {
                        const tags = await this.generateTags(noteData.content);
                        noteData.tags = tags;
                        noteData.aiTagged = true;
                    }
                    
                    // Generate summary if not provided
                    if (noteData.content && !noteData.summary) {
                        const summary = await this.summarizeNote(noteData.content);
                        noteData.summary = summary;
                        noteData.aiSummarized = true;
                    }
                    
                    // Call original method
                    return originalSaveNote.call(this, noteData);
                } catch (error) {
                    console.error('Error in AI note processing:', error);
                    return originalSaveNote.call(this, noteData);
                }
            };
            
            // Enhance voice-to-text functionality
            window.notesModule.enhanceVoiceRecognition = function() {
                // Add continuous recognition option
                const toggleButton = document.createElement('button');
                toggleButton.id = 'continuous-recognition-toggle';
                toggleButton.className = 'btn';
                toggleButton.textContent = 'Continuous Recognition: Off';
                toggleButton.addEventListener('click', () => {
                    this.toggleContinuousRecognition();
                });
                
                // Add to voice controls
                const voiceControls = document.querySelector('.voice-controls');
                if (voiceControls) {
                    voiceControls.appendChild(toggleButton);
                }
                
                // Initialize continuous recognition state
                this.continuousRecognition = false;
            };
            
            // Toggle continuous recognition
            window.notesModule.toggleContinuousRecognition = function() {
                this.continuousRecognition = !this.continuousRecognition;
                
                // Update button text
                const toggleButton = document.getElementById('continuous-recognition-toggle');
                if (toggleButton) {
                    toggleButton.textContent = `Continuous Recognition: ${this.continuousRecognition ? 'On' : 'Off'}`;
                }
                
                // Configure recognition
                if (window.SpeechAPI.recognition) {
                    window.SpeechAPI.recognition.continuous = this.continuousRecognition;
                }
            };
            
            // Add voice command support
            window.addEventListener('speech-recognition-result', (event) => {
                if (event.detail.isFinal && window.currentModule === 'notes') {
                    const transcript = event.detail.transcript.toLowerCase();
                    
                    // Check for note creation commands
                    if (transcript.includes('new note') || transcript.includes('create note')) {
                        window.notesModule.openAddNoteModal();
                    }
                    
                    // Check for formatting commands
                    if (transcript.includes('bold') || transcript.includes('make bold')) {
                        document.execCommand('bold', false, null);
                    } else if (transcript.includes('italic') || transcript.includes('make italic')) {
                        document.execCommand('italic', false, null);
                    } else if (transcript.includes('underline')) {
                        document.execCommand('underline', false, null);
                    }
                }
            });
            
            console.log('AI integration with Notes completed');
        } else {
            console.warn('Notes module not found');
        }
    },
    
    // Integrate AI with Finance module
    integrateWithFinance: function() {
        console.log('Integrating AI with Finance module...');
        
        if (window.financeModule) {
            // Add AI-powered transaction categorization
            window.financeModule.categorizeTransaction = async function(transaction) {
                try {
                    if (!transaction.category && transaction.description) {
                        // Use text classification to categorize transaction
                        const category = await window.TensorFlowAI.classifyText(transaction.description);
                        
                        // Map general categories to finance-specific categories
                        const categoryMap = {
                            work: 'income',
                            personal: 'personal',
                            health: 'healthcare',
                            finance: 'bills',
                            education: 'education'
                        };
                        
                        return categoryMap[category] || 'other';
                    }
                    
                    return transaction.category || 'other';
                } catch (error) {
                    console.error('Error categorizing transaction:', error);
                    return transaction.category || 'other';
                }
            };
            
            // Original addTransaction method
            const originalAddTransaction = window.financeModule.addTransaction;
            
            // Override addTransaction method with AI categorization
            window.financeModule.addTransaction = async function(transactionData) {
                try {
                    // Categorize transaction if category not provided
                    if (!transactionData.category && transactionData.description) {
                        const category = await this.categorizeTransaction(transactionData);
                        transactionData.category = category;
                        transactionData.aiCategorized = true;
                    }
                    
                    // Call original method
                    return originalAddTransaction.call(this, transactionData);
                } catch (error) {
                    console.error('Error in AI transaction categorization:', error);
                    return originalAddTransaction.call(this, transactionData);
                }
            };
            
            // Add budget recommendations
            window.financeModule.recommendBudget = async function() {
                try {
                    // Get transactions for the past 3 months
                    const threeMonthsAgo = new Date();
                    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                    
                    const transactions = await window.PatelDB.getAll('transactions');
                    const recentTransactions = transactions.filter(transaction => 
                        new Date(transaction.date) >= threeMonthsAgo
                    );
                    
                    // Group by category and calculate average monthly spending
                    const categoryTotals = {};
                    const categoryCount = {};
                    
                    recentTransactions.forEach(transaction => {
                        if (transaction.type === 'expense') {
                            const category = transaction.category || 'other';
                            categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
                            categoryCount[category] = (categoryCount[category] || 0) + 1;
                        }
                    });
                    
                    // Calculate average monthly spending per category
                    const monthlyAverages = {};
                    Object.keys(categoryTotals).forEach(category => {
                        monthlyAverages[category] = categoryTotals[category] / 3; // 3 months
                    });
                    
                    // Recommend budget (10% buffer over average)
                    const recommendedBudget = {};
                    Object.keys(monthlyAverages).forEach(category => {
                        recommendedBudget[category] = Math.ceil(monthlyAverages[category] * 1.1);
                    });
                    
                    return recommendedBudget;
                } catch (error) {
                    console.error('Error recommending budget:', error);
                    return {};
                }
            };
            
            // Add voice command support
            window.addEventListener('speech-recognition-result', (event) => {
                if (event.detail.isFinal && window.currentModule === 'finance') {
                    const transcript = event.detail.transcript.toLowerCase();
                    
                    // Check for transaction commands
                    if (transcript.includes('add expense') || transcript.includes('add income')) {
                        const type = transcript.includes('expense') ? 'expense' : 'income';
                        window.financeModule.openAddTransactionModal(type);
                        
                        // Try to extract amount
                        const amountMatch = transcript.match(/\$?(\d+(\.\d{1,2})?)/);
                        if (amountMatch && document.getElementById('transaction-amount')) {
                            document.getElementById('transaction-amount').value = amountMatch[1];
                        }
                        
                        // Try to extract description
                        const descriptionMatch = transcript.match(/for (.*?)( \$|$)/i);
                        if (descriptionMatch && document.getElementById('transaction-description')) {
                            document.getElementById('transaction-description').value = descriptionMatch[1].trim();
                        }
                    }
                    
                    // Check for view changing commands
                    if (transcript.includes('show transactions')) {
                        window.financeModule.setView('transactions');
                    } else if (transcript.includes('show budget')) {
                        window.financeModule.setView('budget');
                    } else if (transcript.includes('show reports')) {
                        window.financeModule.setView('reports');
                    }
                }
            });
            
            console.log('AI integration with Finance completed');
        } else {
            console.warn('Finance module not found');
        }
    },
    
    // Integrate AI with Habits module
    integrateWithHabits: function() {
        console.log('Integrating AI with Habits module...');
        
        if (window.habitsModule) {
            // Add AI-powered habit recommendations
            window.habitsModule.recommendHabits = async function() {
                try {
                    // Get existing habits
                    const habits = await window.PatelDB.getAll('habits');
                    
                    // Get tasks from task manager
                    const tasks = await window.PatelDB.getAll('tasks');
                    
                    // Get notes
                    const notes = await window.PatelDB.getAll('notes');
                    
                    // Extract keywords from tasks and notes
                    const keywords = [];
                    
                    tasks.forEach(task => {
                        if (task.title) keywords.push(task.title.toLowerCase());
                        if (task.description) keywords.push(task.description.toLowerCase());
                    });
                    
                    notes.forEach(note => {
                        if (note.title) keywords.push(note.title.toLowerCase());
                        if (note.content) keywords.push(note.content.toLowerCase());
                    });
                    
                    // Define habit categories and related keywords
                    const habitCategories = {
                        health: ['exercise', 'workout', 'gym', 'run', 'jog', 'walk', 'fitness', 'health', 'diet', 'nutrition', 'water', 'hydration', 'sleep'],
                        productivity: ['work', 'study', 'read', 'learn', 'focus', 'productivity', 'pomodoro', 'time', 'management'],
                        mindfulness: ['meditate', 'meditation', 'mindfulness', 'journal', 'gratitude', 'reflect', 'breathe', 'calm', 'stress'],
                        social: ['call', 'contact', 'friend', 'family', 'social', 'network', 'connect', 'relationship'],
                        creativity: ['write', 'draw', 'paint', 'create', 'art', 'music', 'play', 'hobby', 'creative']
                    };
                    
                    // Count keyword matches for each category
                    const categoryScores = {};
                    Object.keys(habitCategories).forEach(category => {
                        categoryScores[category] = 0;
                        habitCategories[category].forEach(keyword => {
                            keywords.forEach(text => {
                                if (text.includes(keyword)) {
                                    categoryScores[category]++;
                                }
                            });
                        });
                    });
                    
                    // Sort categories by score
                    const sortedCategories = Object.entries(categoryScores)
                        .sort((a, b) => b[1] - a[1])
                        .map(entry => entry[0]);
                    
                    // Define habit suggestions for each category
                    const habitSuggestions = {
                        health: [
                            { name: 'Drink 8 glasses of water', frequency: 'daily', icon: '💧' },
                            { name: 'Exercise for 30 minutes', frequency: 'daily', icon: '🏃' },
                            { name: 'Sleep 8 hours', frequency: 'daily', icon: '😴' },
                            { name: 'Take a walking break', frequency: 'daily', icon: '🚶' },
                            { name: 'Eat a healthy meal', frequency: 'daily', icon: '🥗' }
                        ],
                        productivity: [
                            { name: 'Complete a Pomodoro session', frequency: 'daily', icon: '🍅' },
                            { name: 'Plan tomorrow\'s tasks', frequency: 'daily', icon: '📝' },
                            { name: 'Read for 30 minutes', frequency: 'daily', icon: '📚' },
                            { name: 'Clear email inbox', frequency: 'daily', icon: '📧' },
                            { name: 'Learn something new', frequency: 'daily', icon: '🧠' }
                        ],
                        mindfulness: [
                            { name: 'Meditate for 10 minutes', frequency: 'daily', icon: '🧘' },
                            { name: 'Write in journal', frequency: 'daily', icon: '📓' },
                            { name: 'Practice gratitude', frequency: 'daily', icon: '🙏' },
                            { name: 'Deep breathing exercise', frequency: 'daily', icon: '🌬️' },
                            { name: 'Digital detox hour', frequency: 'daily', icon: '📵' }
                        ],
                        social: [
                            { name: 'Call a friend or family member', frequency: 'weekly', icon: '📞' },
                            { name: 'Send a message to someone', frequency: 'daily', icon: '💬' },
                            { name: 'Schedule social activity', frequency: 'weekly', icon: '👥' },
                            { name: 'Give a compliment', frequency: 'daily', icon: '👏' },
                            { name: 'Network with a colleague', frequency: 'weekly', icon: '🤝' }
                        ],
                        creativity: [
                            { name: 'Write creatively', frequency: 'daily', icon: '✍️' },
                            { name: 'Draw or sketch', frequency: 'weekly', icon: '🎨' },
                            { name: 'Play an instrument', frequency: 'weekly', icon: '🎵' },
                            { name: 'Try a new recipe', frequency: 'weekly', icon: '👨‍🍳' },
                            { name: 'Work on a hobby project', frequency: 'weekly', icon: '🛠️' }
                        ]
                    };
                    
                    // Get top 2 categories
                    const topCategories = sortedCategories.slice(0, 2);
                    
                    // Get existing habit names
                    const existingHabitNames = habits.map(habit => habit.name.toLowerCase());
                    
                    // Get suggestions from top categories that don't already exist
                    const suggestions = [];
                    topCategories.forEach(category => {
                        habitSuggestions[category].forEach(habit => {
                            if (!existingHabitNames.includes(habit.name.toLowerCase())) {
                                suggestions.push({
                                    ...habit,
                                    category,
                                    aiSuggested: true
                                });
                            }
                        });
                    });
                    
                    // Return top 5 suggestions
                    return suggestions.slice(0, 5);
                } catch (error) {
                    console.error('Error recommending habits:', error);
                    return [];
                }
            };
            
            // Add streak prediction
            window.habitsModule.predictStreakCompletion = async function(habitId) {
                try {
                    // Get habit
                    const habit = await window.PatelDB.get('habits', habitId);
                    if (!habit) return 0.5; // Default 50% chance
                    
                    // Get habit completions
                    const completions = habit.completions || [];
                    
                    // If no completions, return default
                    if (completions.length === 0) return 0.5;
                    
                    // Calculate completion rate
                    const today = new Date();
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                    
                    // Filter completions from the past month
                    const recentCompletions = completions.filter(completion => 
                        new Date(completion.date) >= oneMonthAgo
                    );
                    
                    // Calculate days in period
                    const daysInPeriod = Math.ceil((today - oneMonthAgo) / (1000 * 60 * 60 * 24));
                    
                    // Calculate completion rate
                    const completionRate = recentCompletions.length / daysInPeriod;
                    
                    // Calculate streak momentum (higher for longer current streaks)
                    const currentStreak = habit.currentStreak || 0;
                    const streakMomentum = Math.min(0.3, currentStreak * 0.03); // Max 0.3 bonus
                    
                    // Calculate time of day factor
                    // If user typically completes habit at this time of day, increase probability
                    const hourOfDay = today.getHours();
                    const completionsByHour = {};
                    
                    recentCompletions.forEach(completion => {
                        const completionHour = new Date(completion.date).getHours();
                        completionsByHour[completionHour] = (completionsByHour[completionHour] || 0) + 1;
                    });
                    
                    const hourFactor = completionsByHour[hourOfDay] 
                        ? (completionsByHour[hourOfDay] / recentCompletions.length) * 0.2 // Max 0.2 bonus
                        : 0;
                    
                    // Calculate final probability
                    const probability = Math.min(0.95, completionRate + streakMomentum + hourFactor);
                    
                    return probability;
                } catch (error) {
                    console.error('Error predicting streak completion:', error);
                    return 0.5; // Default 50% chance
                }
            };
            
            // Add voice command support
            window.addEventListener('speech-recognition-result', (event) => {
                if (event.detail.isFinal && window.currentModule === 'habits') {
                    const transcript = event.detail.transcript.toLowerCase();
                    
                    // Check for habit commands
                    if (transcript.includes('add habit') || transcript.includes('create habit')) {
                        const habitName = transcript.replace(/add habit|create habit/i, '').trim();
                        if (habitName) {
                            window.habitsModule.openAddHabitModal();
                            document.getElementById('habit-name').value = habitName;
                        }
                    }
                    
                    // Check for completion commands
                    if (transcript.includes('complete') || transcript.includes('mark complete')) {
                        // Extract habit name
                        const habitMatch = transcript.match(/complete (.*?)$|mark complete (.*?)$/i);
                        if (habitMatch) {
                            const habitName = (habitMatch[1] || habitMatch[2]).trim();
                            window.habitsModule.completeHabitByName(habitName);
                        }
                    }
                }
            });
            
            console.log('AI integration with Habits completed');
        } else {
            console.warn('Habits module not found');
        }
    },
    
    // Integrate AI with Focus module
    integrateWithFocus: function() {
        console.log('Integrating AI with Focus module...');
        
        if (window.focusModule) {
            // Add AI-powered focus session recommendations
            window.focusModule.recommendFocusSession = async function() {
                try {
                    // Get tasks from task manager
                    const tasks = await window.PatelDB.getAll('tasks');
                    
                    // Filter incomplete tasks
                    const incompleteTasks = tasks.filter(task => !task.completed);
                    
                    // Sort by priority and deadline
                    incompleteTasks.sort((a, b) => {
                        // First by priority (higher first)
                        if (a.priority !== b.priority) {
                            return b.priority - a.priority;
                        }
                        
                        // Then by deadline (sooner first)
                        if (a.deadline && b.deadline) {
                            return new Date(a.deadline) - new Date(b.deadline);
                        }
                        
                        // Tasks with deadlines come before tasks without deadlines
                        if (a.deadline) return -1;
                        if (b.deadline) return 1;
                        
                        return 0;
                    });
                    
                    // Get top task
                    const topTask = incompleteTasks[0];
                    
                    if (!topTask) {
                        return null;
                    }
                    
                    // Recommend focus session
                    const recommendation = {
                        taskId: topTask.id,
                        taskTitle: topTask.title,
                        duration: this.recommendSessionDuration(topTask),
                        breakDuration: 5, // Default 5-minute break
                        aiRecommended: true
                    };
                    
                    return recommendation;
                } catch (error) {
                    console.error('Error recommending focus session:', error);
                    return null;
                }
            };
            
            // Helper method to recommend session duration
            window.focusModule.recommendSessionDuration = function(task) {
                // Base duration on task priority and complexity
                const priority = task.priority || 5;
                const complexity = task.complexity || 5;
                
                // Higher priority and complexity = longer session
                const baseDuration = Math.min(50, Math.max(25, (priority + complexity) * 2.5));
                
                // Round to nearest 5 minutes
                return Math.round(baseDuration / 5) * 5;
            };
            
            // Add voice command support
            window.addEventListener('speech-recognition-result', (event) => {
                if (event.detail.isFinal && window.currentModule === 'focus') {
                    const transcript = event.detail.transcript.toLowerCase();
                    
                    // Check for timer commands
                    if (transcript.includes('start timer') || transcript.includes('start pomodoro')) {
                        window.focusModule.startTimer();
                    } else if (transcript.includes('pause timer') || transcript.includes('pause pomodoro')) {
                        window.focusModule.pauseTimer();
                    } else if (transcript.includes('resume timer') || transcript.includes('resume pomodoro')) {
                        window.focusModule.resumeTimer();
                    } else if (transcript.includes('stop timer') || transcript.includes('stop pomodoro')) {
                        window.focusModule.stopTimer();
                    }
                    
                    // Check for duration commands
                    const durationMatch = transcript.match(/set timer (?:for )?(\d+)(?: minutes?)?/i);
                    if (durationMatch) {
                        const duration = parseInt(durationMatch[1]);
                        if (duration > 0 && duration <= 120) {
                            window.focusModule.setDuration(duration);
                        }
                    }
                }
            });
            
            console.log('AI integration with Focus completed');
        } else {
            console.warn('Focus module not found');
        }
    },
    
    // Integrate AI with Research module
    integrateWithResearch: function() {
        console.log('Integrating AI with Research module...');
        
        if (window.researchModule) {
            // Add AI-powered text summarization
            window.researchModule.summarizeText = async function(text, maxLength = 200) {
                try {
                    const summary = await window.TensorFlowAI.summarizeText(text, maxLength);
                    return summary;
                } catch (error) {
                    console.error('Error summarizing text:', error);
                    
                    // Fallback: return first few sentences
                    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
                    return sentences.slice(0, 2).join(' ');
                }
            };
            
            // Add AI-powered keyword extraction
            window.researchModule.extractKeywords = async function(text) {
                try {
                    // Simple keyword extraction (in a real app, would use TensorFlow.js)
                    const words = text.toLowerCase().split(/\s+/);
                    const commonWords = ['the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
                    const filteredWords = words.filter(word => 
                        word.length > 3 && !commonWords.includes(word)
                    );
                    
                    // Count word frequency
                    const wordCounts = {};
                    filteredWords.forEach(word => {
                        wordCounts[word] = (wordCounts[word] || 0) + 1;
                    });
                    
                    // Sort by frequency
                    const sortedWords = Object.entries(wordCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(entry => entry[0]);
                    
                    // Take top 10 words as keywords
                    return sortedWords.slice(0, 10);
                } catch (error) {
                    console.error('Error extracting keywords:', error);
                    return [];
                }
            };
            
            // Add voice command support
            window.addEventListener('speech-recognition-result', (event) => {
                if (event.detail.isFinal && window.currentModule === 'research') {
                    const transcript = event.detail.transcript.toLowerCase();
                    
                    // Check for summarization commands
                    if (transcript.includes('summarize text') || transcript.includes('summarize this')) {
                        window.researchModule.summarizeCurrentText();
                    }
                    
                    // Check for keyword extraction commands
                    if (transcript.includes('extract keywords') || transcript.includes('find keywords')) {
                        window.researchModule.extractKeywordsFromCurrentText();
                    }
                }
            });
            
            console.log('AI integration with Research completed');
        } else {
            console.warn('Research module not found');
        }
    },
    
    // Integrate AI with Networking module
    integrateWithNetworking: function() {
        console.log('Integrating AI with Networking module...');
        
        if (window.networkingModule) {
            // Add AI-powered contact categorization
            window.networkingModule.categorizeContact = async function(contact) {
                try {
                    if (!contact.category && contact.notes) {
                        // Use text classification to categorize contact
                        const category = await window.TensorFlowAI.classifyText(contact.notes);
                        
                        // Map general categories to networking-specific categories
                        const categoryMap = {
                            work: 'professional',
                            personal: 'personal',
                            health: 'service',
                            finance: 'business',
                            education: 'academic'
                        };
                        
                        return categoryMap[category] || 'other';
                    }
                    
                    return contact.category || 'other';
                } catch (error) {
                    console.error('Error categorizing contact:', error);
                    return contact.category || 'other';
                }
            };
            
            // Add AI-powered follow-up recommendations
            window.networkingModule.recommendFollowUps = async function() {
                try {
                    // Get contacts
                    const contacts = await window.PatelDB.getAll('contacts');
                    
                    // Get current date
                    const now = new Date();
                    
                    // Filter contacts that need follow-up
                    const needFollowUp = contacts.filter(contact => {
                        // Skip contacts with scheduled follow-ups
                        if (contact.followUpScheduled) return false;
                        
                        // Check last interaction date
                        if (!contact.lastInteraction) return true;
                        
                        const lastInteraction = new Date(contact.lastInteraction);
                        const daysSinceInteraction = Math.floor((now - lastInteraction) / (1000 * 60 * 60 * 24));
                        
                        // Recommend follow-up based on contact importance and days since last interaction
                        const importance = contact.importance || 3; // 1-5 scale
                        const followUpThreshold = this.getFollowUpThreshold(importance);
                        
                        return daysSinceInteraction >= followUpThreshold;
                    });
                    
                    // Sort by importance and days since last interaction
                    needFollowUp.sort((a, b) => {
                        // First by importance (higher first)
                        const importanceA = a.importance || 3;
                        const importanceB = b.importance || 3;
                        
                        if (importanceA !== importanceB) {
                            return importanceB - importanceA;
                        }
                        
                        // Then by days since last interaction (longer first)
                        const lastA = a.lastInteraction ? new Date(a.lastInteraction) : new Date(0);
                        const lastB = b.lastInteraction ? new Date(b.lastInteraction) : new Date(0);
                        
                        return lastA - lastB;
                    });
                    
                    return needFollowUp;
                } catch (error) {
                    console.error('Error recommending follow-ups:', error);
                    return [];
                }
            };
            
            // Helper method to get follow-up threshold based on importance
            window.networkingModule.getFollowUpThreshold = function(importance) {
                switch (importance) {
                    case 5: return 7; // Very important: 1 week
                    case 4: return 14; // Important: 2 weeks
                    case 3: return 30; // Medium: 1 month
                    case 2: return 60; // Less important: 2 months
                    case 1: return 90; // Least important: 3 months
                    default: return 30; // Default: 1 month
                }
            };
            
            // Original addContact method
            const originalAddContact = window.networkingModule.addContact;
            
            // Override addContact method with AI categorization
            window.networkingModule.addContact = async function(contactData) {
                try {
                    // Categorize contact if category not provided
                    if (!contactData.category && contactData.notes) {
                        const category = await this.categorizeContact(contactData);
                        contactData.category = category;
                        contactData.aiCategorized = true;
                    }
                    
                    // Call original method
                    return originalAddContact.call(this, contactData);
                } catch (error) {
                    console.error('Error in AI contact categorization:', error);
                    return originalAddContact.call(this, contactData);
                }
            };
            
            // Add voice command support
            window.addEventListener('speech-recognition-result', (event) => {
                if (event.detail.isFinal && window.currentModule === 'networking') {
                    const transcript = event.detail.transcript.toLowerCase();
                    
                    // Check for contact commands
                    if (transcript.includes('add contact') || transcript.includes('create contact')) {
                        window.networkingModule.openAddContactModal();
                        
                        // Try to extract name
                        const nameMatch = transcript.match(/add contact (.*?)( with|$)/i);
                        if (nameMatch && document.getElementById('contact-name')) {
                            document.getElementById('contact-name').value = nameMatch[1].trim();
                        }
                    }
                    
                    // Check for follow-up commands
                    if (transcript.includes('show follow-ups') || transcript.includes('show follow ups')) {
                        window.networkingModule.showFollowUps();
                    }
                }
            });
            
            console.log('AI integration with Networking completed');
        } else {
            console.warn('Networking module not found');
        }
    },
    
    // Integrate AI with File Manager module
    integrateWithFileManager: function() {
        console.log('Integrating AI with File Manager module...');
        
        if (window.fileManagerModule) {
            // Add AI-powered file categorization
            window.fileManagerModule.categorizeFile = async function(file) {
                try {
                    if (!file.category && file.name) {
                        // Extract file extension
                        const extension = file.name.split('.').pop().toLowerCase();
                        
                        // Categorize based on extension
                        let category;
                        
                        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
                        const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'md'];
                        const spreadsheetExtensions = ['xls', 'xlsx', 'csv', 'ods'];
                        const presentationExtensions = ['ppt', 'pptx', 'odp'];
                        const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'm4a'];
                        const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm'];
                        const codeExtensions = ['js', 'html', 'css', 'py', 'java', 'c', 'cpp', 'php', 'rb'];
                        
                        if (imageExtensions.includes(extension)) {
                            category = 'images';
                        } else if (documentExtensions.includes(extension)) {
                            category = 'documents';
                        } else if (spreadsheetExtensions.includes(extension)) {
                            category = 'spreadsheets';
                        } else if (presentationExtensions.includes(extension)) {
                            category = 'presentations';
                        } else if (audioExtensions.includes(extension)) {
                            category = 'audio';
                        } else if (videoExtensions.includes(extension)) {
                            category = 'video';
                        } else if (codeExtensions.includes(extension)) {
                            category = 'code';
                        } else {
                            // Use text classification for file name
                            category = await window.TensorFlowAI.classifyText(file.name);
                        }
                        
                        return category;
                    }
                    
                    return file.category || 'other';
                } catch (error) {
                    console.error('Error categorizing file:', error);
                    return file.category || 'other';
                }
            };
            
            // Original addFile method
            const originalAddFile = window.fileManagerModule.addFile;
            
            // Override addFile method with AI categorization
            window.fileManagerModule.addFile = async function(fileData) {
                try {
                    // Categorize file if category not provided
                    if (!fileData.category) {
                        const category = await this.categorizeFile(fileData);
                        fileData.category = category;
                        fileData.aiCategorized = true;
                    }
                    
                    // Call original method
                    return originalAddFile.call(this, fileData);
                } catch (error) {
                    console.error('Error in AI file categorization:', error);
                    return originalAddFile.call(this, fileData);
                }
            };
            
            // Add voice command support
            window.addEventListener('speech-recognition-result', (event) => {
                if (event.detail.isFinal && window.currentModule === 'file-manager') {
                    const transcript = event.detail.transcript.toLowerCase();
                    
                    // Check for file commands
                    if (transcript.includes('upload file') || transcript.includes('add file')) {
                        window.fileManagerModule.openUploadFileModal();
                    }
                    
                    // Check for folder commands
                    if (transcript.includes('create folder') || transcript.includes('add folder')) {
                        const folderMatch = transcript.match(/create folder (.*?)$|add folder (.*?)$/i);
                        if (folderMatch) {
                            const folderName = (folderMatch[1] || folderMatch[2]).trim();
                            window.fileManagerModule.createFolder(folderName);
                        } else {
                            window.fileManagerModule.openCreateFolderModal();
                        }
                    }
                    
                    // Check for navigation commands
                    if (transcript.includes('go to') || transcript.includes('open')) {
                        const locationMatch = transcript.match(/go to (.*?)$|open (.*?)$/i);
                        if (locationMatch) {
                            const location = (locationMatch[1] || locationMatch[2]).trim();
                            window.fileManagerModule.navigateToLocation(location);
                        }
                    }
                }
            });
            
            console.log('AI integration with File Manager completed');
        } else {
            console.warn('File Manager module not found');
        }
    },
    
    // Integrate AI with Health module
    integrateWithHealth: function() {
        console.log('Integrating AI with Health module...');
        
        if (window.healthModule) {
            // Add AI-powered health insights
            window.healthModule.generateHealthInsights = async function() {
                try {
                    // Get health data
                    const steps = await window.PatelDB.getAll('health_steps');
                    const water = await window.PatelDB.getAll('health_water');
                    const sleep = await window.PatelDB.getAll('health_sleep');
                    const meditation = await window.PatelDB.getAll('health_meditation');
                    const mood = await window.PatelDB.getAll('health_mood');
                    const weight = await window.PatelDB.getAll('health_weight');
                    const exercises = await window.PatelDB.getAll('health_exercises');
                    
                    // Get last 30 days of data
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    
                    const recentSteps = steps.filter(item => new Date(item.date) >= thirtyDaysAgo);
                    const recentWater = water.filter(item => new Date(item.date) >= thirtyDaysAgo);
                    const recentSleep = sleep.filter(item => new Date(item.date) >= thirtyDaysAgo);
                    const recentMeditation = meditation.filter(item => new Date(item.date) >= thirtyDaysAgo);
                    const recentMood = mood.filter(item => new Date(item.date) >= thirtyDaysAgo);
                    
                    // Calculate averages
                    const avgSteps = recentSteps.length > 0 
                        ? recentSteps.reduce((sum, item) => sum + item.value, 0) / recentSteps.length 
                        : 0;
                    
                    const avgWater = recentWater.length > 0 
                        ? recentWater.reduce((sum, item) => sum + item.value, 0) / recentWater.length 
                        : 0;
                    
                    const avgSleep = recentSleep.length > 0 
                        ? recentSleep.reduce((sum, item) => sum + item.value, 0) / recentSleep.length 
                        : 0;
                    
                    const avgMeditation = recentMeditation.length > 0 
                        ? recentMeditation.reduce((sum, item) => sum + item.value, 0) / recentMeditation.length 
                        : 0;
                    
                    const avgMood = recentMood.length > 0 
                        ? recentMood.reduce((sum, item) => sum + item.value, 0) / recentMood.length 
                        : 0;
                    
                    // Generate insights
                    const insights = [];
                    
                    // Steps insights
                    if (recentSteps.length > 0) {
                        if (avgSteps < 5000) {
                            insights.push({
                                type: 'steps',
                                title: 'Increase Daily Steps',
                                description: 'Your average of ' + Math.round(avgSteps) + ' steps is below the recommended 10,000 steps per day. Try to incorporate more walking into your daily routine.',
                                priority: 'high'
                            });
                        } else if (avgSteps >= 10000) {
                            insights.push({
                                type: 'steps',
                                title: 'Great Step Count',
                                description: 'You\'re averaging ' + Math.round(avgSteps) + ' steps per day, which meets or exceeds the recommended amount. Keep up the good work!',
                                priority: 'low'
                            });
                        }
                    }
                    
                    // Water insights
                    if (recentWater.length > 0) {
                        if (avgWater < 6) {
                            insights.push({
                                type: 'water',
                                title: 'Increase Water Intake',
                                description: 'You\'re averaging ' + avgWater.toFixed(1) + ' glasses of water per day. Try to increase to at least 8 glasses for optimal hydration.',
                                priority: 'medium'
                            });
                        }
                    }
                    
                    // Sleep insights
                    if (recentSleep.length > 0) {
                        if (avgSleep < 7) {
                            insights.push({
                                type: 'sleep',
                                title: 'Improve Sleep Duration',
                                description: 'You\'re averaging ' + avgSleep.toFixed(1) + ' hours of sleep per night, which is below the recommended 7-9 hours. Consider adjusting your sleep schedule.',
                                priority: 'high'
                            });
                        } else if (avgSleep > 9) {
                            insights.push({
                                type: 'sleep',
                                title: 'Excessive Sleep',
                                description: 'You\'re averaging ' + avgSleep.toFixed(1) + ' hours of sleep per night, which is above the recommended range. Too much sleep can sometimes indicate other health issues.',
                                priority: 'medium'
                            });
                        }
                    }
                    
                    // Meditation insights
                    if (recentMeditation.length > 0) {
                        const meditationDays = new Set(recentMeditation.map(item => item.date)).size;
                        const totalDays = Math.min(30, Math.ceil((new Date() - thirtyDaysAgo) / (1000 * 60 * 60 * 24)));
                        const meditationFrequency = meditationDays / totalDays;
                        
                        if (meditationFrequency < 0.5) {
                            insights.push({
                                type: 'meditation',
                                title: 'Increase Meditation Frequency',
                                description: 'You\'ve meditated on ' + meditationDays + ' of the last ' + totalDays + ' days. Consider making meditation a more regular practice for better mental health.',
                                priority: 'medium'
                            });
                        }
                    }
                    
                    // Mood insights
                    if (recentMood.length > 0) {
                        if (avgMood < 3) {
                            insights.push({
                                type: 'mood',
                                title: 'Mood Improvement',
                                description: 'Your average mood rating is ' + avgMood.toFixed(1) + ' out of 5. Consider activities that boost your mood, such as exercise, social interaction, or hobbies you enjoy.',
                                priority: 'high'
                            });
                        }
                    }
                    
                    // Weight insights
                    if (weight.length >= 2) {
                        // Sort by date
                        weight.sort((a, b) => new Date(a.date) - new Date(b.date));
                        
                        const firstWeight = weight[0].value;
                        const lastWeight = weight[weight.length - 1].value;
                        const weightChange = lastWeight - firstWeight;
                        
                        if (Math.abs(weightChange) > 5) {
                            insights.push({
                                type: 'weight',
                                title: weightChange > 0 ? 'Significant Weight Gain' : 'Significant Weight Loss',
                                description: 'You\'ve ' + (weightChange > 0 ? 'gained' : 'lost') + ' ' + Math.abs(weightChange).toFixed(1) + ' kg since your first recorded weight. ' + 
                                    (Math.abs(weightChange) > 10 ? 'This is a substantial change that may warrant attention.' : 'Monitor this trend and adjust your diet and exercise as needed.'),
                                priority: 'medium'
                            });
                        }
                    }
                    
                    // Exercise insights
                    if (exercises.length > 0) {
                        const exerciseDays = new Set(exercises.map(item => item.date)).size;
                        const totalDays = Math.min(30, Math.ceil((new Date() - thirtyDaysAgo) / (1000 * 60 * 60 * 24)));
                        const exerciseFrequency = exerciseDays / totalDays;
                        
                        if (exerciseFrequency < 0.3) {
                            insights.push({
                                type: 'exercise',
                                title: 'Increase Exercise Frequency',
                                description: 'You\'ve exercised on ' + exerciseDays + ' of the last ' + totalDays + ' days. Aim for at least 3-5 days of exercise per week for optimal health.',
                                priority: 'high'
                            });
                        }
                    }
                    
                    // Correlation insights
                    if (recentSleep.length > 0 && recentMood.length > 0) {
                        // Check if sleep and mood are recorded on the same days
                        const sleepDates = new Set(recentSleep.map(item => item.date));
                        const moodWithSleep = recentMood.filter(item => sleepDates.has(item.date));
                        
                        if (moodWithSleep.length >= 5) {
                            // Calculate correlation
                            const sleepByDate = {};
                            recentSleep.forEach(item => {
                                sleepByDate[item.date] = item.value;
                            });
                            
                            const sleepValues = [];
                            const moodValues = [];
                            
                            moodWithSleep.forEach(item => {
                                sleepValues.push(sleepByDate[item.date]);
                                moodValues.push(item.value);
                            });
                            
                            const correlation = this.calculateCorrelation(sleepValues, moodValues);
                            
                            if (correlation > 0.5) {
                                insights.push({
                                    type: 'correlation',
                                    title: 'Sleep Affects Your Mood',
                                    description: 'There appears to be a positive correlation between your sleep duration and mood. Getting more sleep may help improve your mood.',
                                    priority: 'medium'
                                });
                            } else if (correlation < -0.5) {
                                insights.push({
                                    type: 'correlation',
                                    title: 'Unusual Sleep-Mood Pattern',
                                    description: 'There appears to be a negative correlation between your sleep duration and mood. This is unusual and might warrant further investigation.',
                                    priority: 'medium'
                                });
                            }
                        }
                    }
                    
                    // Sort insights by priority
                    insights.sort((a, b) => {
                        const priorityMap = { high: 0, medium: 1, low: 2 };
                        return priorityMap[a.priority] - priorityMap[b.priority];
                    });
                    
                    return insights;
                } catch (error) {
                    console.error('Error generating health insights:', error);
                    return [];
                }
            };
            
            // Helper method to calculate correlation
            window.healthModule.calculateCorrelation = function(x, y) {
                const n = x.length;
                let sumX = 0;
                let sumY = 0;
                let sumXY = 0;
                let sumX2 = 0;
                let sumY2 = 0;
                
                for (let i = 0; i < n; i++) {
                    sumX += x[i];
                    sumY += y[i];
                    sumXY += x[i] * y[i];
                    sumX2 += x[i] * x[i];
                    sumY2 += y[i] * y[i];
                }
                
                const numerator = n * sumXY - sumX * sumY;
                const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
                
                return denominator === 0 ? 0 : numerator / denominator;
            };
            
            // Add voice command support
            window.addEventListener('speech-recognition-result', (event) => {
                if (event.detail.isFinal && window.currentModule === 'health') {
                    const transcript = event.detail.transcript.toLowerCase();
                    
                    // Check for entry commands
                    if (transcript.includes('add steps')) {
                        window.healthModule.openAddEntryModal('steps');
                        
                        // Try to extract value
                        const valueMatch = transcript.match(/add steps (\d+)/i);
                        if (valueMatch && document.getElementById('entry-value')) {
                            document.getElementById('entry-value').value = valueMatch[1];
                        }
                    } else if (transcript.includes('add water')) {
                        window.healthModule.openAddEntryModal('water');
                        
                        // Try to extract value
                        const valueMatch = transcript.match(/add water (\d+)/i);
                        if (valueMatch && document.getElementById('entry-value')) {
                            document.getElementById('entry-value').value = valueMatch[1];
                        }
                    } else if (transcript.includes('add sleep')) {
                        window.healthModule.openAddEntryModal('sleep');
                        
                        // Try to extract value
                        const valueMatch = transcript.match(/add sleep (\d+(\.\d+)?)/i);
                        if (valueMatch && document.getElementById('entry-value')) {
                            document.getElementById('entry-value').value = valueMatch[1];
                        }
                    } else if (transcript.includes('start meditation')) {
                        window.healthModule.openMeditationTimerModal();
                    }
                    
                    // Check for view commands
                    if (transcript.includes('show dashboard')) {
                        window.healthModule.setCurrentView('dashboard');
                    } else if (transcript.includes('show steps')) {
                        window.healthModule.setCurrentView('steps');
                    } else if (transcript.includes('show water')) {
                        window.healthModule.setCurrentView('water');
                    } else if (transcript.includes('show sleep')) {
                        window.healthModule.setCurrentView('sleep');
                    } else if (transcript.includes('show meditation')) {
                        window.healthModule.setCurrentView('meditation');
                    } else if (transcript.includes('show mood')) {
                        window.healthModule.setCurrentView('mood');
                    } else if (transcript.includes('show weight')) {
                        window.healthModule.setCurrentView('weight');
                    } else if (transcript.includes('show exercise')) {
                        window.healthModule.setCurrentView('exercise');
                    }
                }
            });
            
            console.log('AI integration with Health completed');
        } else {
            console.warn('Health module not found');
        }
    },
    
    // Integrate AI with PatelBot module
    integrateWithPatelBot: function() {
        console.log('Integrating AI with PatelBot module...');
        
        if (window.patelbotModule) {
            // Add AI-powered message processing
            window.patelbotModule.processMessageWithAI = async function(message) {
                try {
                    // Analyze sentiment
                    const sentimentScore = await window.TensorFlowAI.analyzeTextSentiment(message);
                    
                    // Classify message
                    const category = await window.TensorFlowAI.classifyText(message);
                    
                    // Process based on sentiment and category
                    if (sentimentScore < 0.3) {
                        // Negative sentiment
                        this.addBotMessage("I notice you seem a bit down. Remember that taking small steps forward is still progress. Would you like a motivational quote to help lift your spirits?");
                        
                        // Schedule a quote after a short delay
                        setTimeout(() => {
                            this.showRandomQuote();
                        }, 5000);
                    } else if (sentimentScore > 0.7) {
                        // Positive sentiment
                        this.addBotMessage("I love your positive energy! It's great to see you in good spirits. Keep up that momentum!");
                    }
                    
                    // Process based on category
                    switch (category) {
                        case 'work':
                            this.addBotMessage("It sounds like you're focused on work. Would you like me to help you set up a focus session or suggest a productivity tip?");
                            break;
                        case 'health':
                            this.addBotMessage("Health is wealth! Would you like to track your health metrics or set up a meditation session?");
                            break;
                        case 'finance':
                            this.addBotMessage("Financial planning is important. Have you checked your budget recently or tracked your expenses?");
                            break;
                        case 'education':
                            this.addBotMessage("Learning is a lifelong journey! Would you like me to help you organize your study materials or set up a focus timer for studying?");
                            break;
                    }
                    
                    return { sentimentScore, category };
                } catch (error) {
                    console.error('Error processing message with AI:', error);
                    return { sentimentScore: 0.5, category: 'personal' };
                }
            };
            
            // Original processMessage method
            const originalProcessMessage = window.patelbotModule.processMessage;
            
            // Override processMessage method with AI processing
            window.patelbotModule.processMessage = async function(message) {
                try {
                    // Check for keywords first
                    const lowerMessage = message.toLowerCase();
                    
                    if (this.containsAny(lowerMessage, ['hello', 'hi', 'hey', 'greetings'])) {
                        this.respondWithGreeting();
                    } else if (this.containsAny(lowerMessage, ['bye', 'goodbye', 'see you', 'farewell'])) {
                        this.respondWithGoodbye();
                    } else if (this.containsAny(lowerMessage, ['thank', 'thanks', 'appreciate'])) {
                        this.respondWithThanks();
                    } else if (this.containsAny(lowerMessage, ['help', 'assist', 'what can you do', 'capabilities'])) {
                        this.showHelp();
                    } else if (this.containsAny(lowerMessage, ['quote', 'quotes', 'inspiration', 'motivate', 'motivation'])) {
                        this.showRandomQuote();
                    } else if (this.containsAny(lowerMessage, ['joke', 'jokes', 'funny', 'laugh', 'humor'])) {
                        this.showRandomJoke();
                    } else if (this.containsAny(lowerMessage, ['tip', 'tips', 'advice', 'productivity', 'suggestion'])) {
                        this.showRandomTip();
                    } else {
                        // Process with AI for more complex messages
                        await this.processMessageWithAI(message);
                    }
                } catch (error) {
                    console.error('Error in AI message processing:', error);
                    
                    // Fall back to original method
                    originalProcessMessage.call(this, message);
                }
            };
            
            console.log('AI integration with PatelBot completed');
        } else {
            console.warn('PatelBot module not found');
        }
    }
};

// Export module
window.AIIntegration = AIIntegration;
