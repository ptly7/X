/* Habit Hero Module for Patel Productivity Suite */

const habitsModule = {
    // Store DOM elements
    elements: {},
    
    // Habits data
    habits: [],
    habitLogs: [],
    currentDate: new Date(),
    
    // Initialize the module
    init: async function(container) {
        console.log('Initializing Habits module');
        
        // Render the module UI
        this.render(container);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load habits and logs
        await this.loadHabits();
        await this.loadHabitLogs();
        
        // Render habits
        this.renderHabits();
        
        // Initialize calendar
        this.renderCalendar();
    },
    
    // Render the module UI
    render: function(container) {
        container.innerHTML = `
            <div class="module-header">
                <h2>Habit Hero</h2>
                <div class="module-actions">
                    <button id="add-habit-btn" class="btn primary">Add Habit</button>
                    <select id="habit-filter">
                        <option value="all">All Habits</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>
            
            <div class="habits-container">
                <div class="habits-list-container">
                    <h3>Your Habits</h3>
                    <div id="habits-list" class="habits-list">
                        <div class="loading">Loading habits...</div>
                    </div>
                </div>
                
                <div class="habits-calendar-container">
                    <div class="calendar-header">
                        <button id="prev-month-btn" class="btn">❮</button>
                        <h3 id="current-month"></h3>
                        <button id="next-month-btn" class="btn">❯</button>
                    </div>
                    <div class="calendar-weekdays">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div id="calendar-days" class="calendar-days"></div>
                </div>
                
                <div class="habits-stats-container">
                    <h3>Statistics</h3>
                    <div class="stats-cards">
                        <div class="stats-card">
                            <div class="stats-title">Current Streaks</div>
                            <div id="current-streaks" class="stats-content">
                                <div class="loading">Loading stats...</div>
                            </div>
                        </div>
                        <div class="stats-card">
                            <div class="stats-title">Completion Rate</div>
                            <div id="completion-rate" class="stats-content">
                                <div class="loading">Loading stats...</div>
                            </div>
                        </div>
                    </div>
                    <div class="stats-chart-container">
                        <canvas id="habits-chart"></canvas>
                    </div>
                </div>
            </div>
            
            <!-- Habit Form Modal -->
            <div id="habit-form-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3 id="habit-form-title">Add New Habit</h3>
                    <form id="habit-form">
                        <input type="hidden" id="habit-id">
                        <div class="form-group">
                            <label for="habit-title">Title</label>
                            <input type="text" id="habit-title" required>
                        </div>
                        <div class="form-group">
                            <label for="habit-description">Description</label>
                            <textarea id="habit-description"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="habit-frequency">Frequency</label>
                            <select id="habit-frequency" required>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div class="form-group" id="weekdays-group" style="display: none;">
                            <label>Days of Week</label>
                            <div class="weekdays-selector">
                                <div class="weekday-checkbox">
                                    <input type="checkbox" id="weekday-0" value="0">
                                    <label for="weekday-0">Sun</label>
                                </div>
                                <div class="weekday-checkbox">
                                    <input type="checkbox" id="weekday-1" value="1">
                                    <label for="weekday-1">Mon</label>
                                </div>
                                <div class="weekday-checkbox">
                                    <input type="checkbox" id="weekday-2" value="2">
                                    <label for="weekday-2">Tue</label>
                                </div>
                                <div class="weekday-checkbox">
                                    <input type="checkbox" id="weekday-3" value="3">
                                    <label for="weekday-3">Wed</label>
                                </div>
                                <div class="weekday-checkbox">
                                    <input type="checkbox" id="weekday-4" value="4">
                                    <label for="weekday-4">Thu</label>
                                </div>
                                <div class="weekday-checkbox">
                                    <input type="checkbox" id="weekday-5" value="5">
                                    <label for="weekday-5">Fri</label>
                                </div>
                                <div class="weekday-checkbox">
                                    <input type="checkbox" id="weekday-6" value="6">
                                    <label for="weekday-6">Sat</label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" id="monthday-group" style="display: none;">
                            <label for="habit-monthday">Day of Month</label>
                            <select id="habit-monthday">
                                <option value="1">1st</option>
                                <option value="2">2nd</option>
                                <option value="3">3rd</option>
                                <option value="4">4th</option>
                                <option value="5">5th</option>
                                <option value="6">6th</option>
                                <option value="7">7th</option>
                                <option value="8">8th</option>
                                <option value="9">9th</option>
                                <option value="10">10th</option>
                                <option value="11">11th</option>
                                <option value="12">12th</option>
                                <option value="13">13th</option>
                                <option value="14">14th</option>
                                <option value="15">15th</option>
                                <option value="16">16th</option>
                                <option value="17">17th</option>
                                <option value="18">18th</option>
                                <option value="19">19th</option>
                                <option value="20">20th</option>
                                <option value="21">21st</option>
                                <option value="22">22nd</option>
                                <option value="23">23rd</option>
                                <option value="24">24th</option>
                                <option value="25">25th</option>
                                <option value="26">26th</option>
                                <option value="27">27th</option>
                                <option value="28">28th</option>
                                <option value="last">Last day</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="habit-category">Category</label>
                            <select id="habit-category">
                                <option value="health">Health</option>
                                <option value="fitness">Fitness</option>
                                <option value="productivity">Productivity</option>
                                <option value="learning">Learning</option>
                                <option value="mindfulness">Mindfulness</option>
                                <option value="social">Social</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="habit-start-date">Start Date</label>
                            <input type="date" id="habit-start-date" required>
                        </div>
                        <div class="form-group">
                            <label for="habit-reminder">Reminder</label>
                            <select id="habit-reminder">
                                <option value="none">None</option>
                                <option value="morning">Morning (8:00 AM)</option>
                                <option value="afternoon">Afternoon (1:00 PM)</option>
                                <option value="evening">Evening (6:00 PM)</option>
                                <option value="night">Night (9:00 PM)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="habit-color">Color</label>
                            <input type="color" id="habit-color" value="#4a90e2">
                        </div>
                        <div class="form-actions">
                            <button type="button" id="habit-cancel-btn" class="btn">Cancel</button>
                            <button type="submit" id="habit-save-btn" class="btn primary">Save Habit</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Store DOM elements
        this.elements = {
            habitsList: document.getElementById('habits-list'),
            addHabitBtn: document.getElementById('add-habit-btn'),
            habitFilter: document.getElementById('habit-filter'),
            calendarDays: document.getElementById('calendar-days'),
            currentMonth: document.getElementById('current-month'),
            prevMonthBtn: document.getElementById('prev-month-btn'),
            nextMonthBtn: document.getElementById('next-month-btn'),
            currentStreaks: document.getElementById('current-streaks'),
            completionRate: document.getElementById('completion-rate'),
            habitsChart: document.getElementById('habits-chart'),
            habitFormModal: document.getElementById('habit-form-modal'),
            habitForm: document.getElementById('habit-form'),
            habitFormTitle: document.getElementById('habit-form-title'),
            habitId: document.getElementById('habit-id'),
            habitTitle: document.getElementById('habit-title'),
            habitDescription: document.getElementById('habit-description'),
            habitFrequency: document.getElementById('habit-frequency'),
            weekdaysGroup: document.getElementById('weekdays-group'),
            monthdayGroup: document.getElementById('monthday-group'),
            habitMonthday: document.getElementById('habit-monthday'),
            habitCategory: document.getElementById('habit-category'),
            habitStartDate: document.getElementById('habit-start-date'),
            habitReminder: document.getElementById('habit-reminder'),
            habitColor: document.getElementById('habit-color'),
            habitCancelBtn: document.getElementById('habit-cancel-btn'),
            habitSaveBtn: document.getElementById('habit-save-btn'),
            closeModal: document.querySelector('#habit-form-modal .close-modal')
        };
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Add habit button
        this.elements.addHabitBtn.addEventListener('click', () => {
            this.openHabitForm();
        });
        
        // Habit filter
        this.elements.habitFilter.addEventListener('change', () => {
            this.renderHabits();
        });
        
        // Previous month button
        this.elements.prevMonthBtn.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        // Next month button
        this.elements.nextMonthBtn.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
        
        // Close modal
        this.elements.closeModal.addEventListener('click', () => {
            this.closeHabitForm();
        });
        
        // Cancel button
        this.elements.habitCancelBtn.addEventListener('click', () => {
            this.closeHabitForm();
        });
        
        // Habit form submission
        this.elements.habitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveHabit();
        });
        
        // Frequency change
        this.elements.habitFrequency.addEventListener('change', () => {
            this.updateFrequencyFields();
        });
    },
    
    // Load habits from database
    loadHabits: async function() {
        try {
            this.habits = await window.PatelDB.getAll('habits');
        } catch (error) {
            console.error('Error loading habits:', error);
            this.habits = [];
        }
    },
    
    // Load habit logs from database
    loadHabitLogs: async function() {
        try {
            this.habitLogs = await window.PatelDB.getAll('habitLogs');
        } catch (error) {
            console.error('Error loading habit logs:', error);
            this.habitLogs = [];
        }
    },
    
    // Render habits list
    renderHabits: function() {
        const filter = this.elements.habitFilter.value;
        
        // Filter habits
        let filteredHabits = [...this.habits];
        
        if (filter !== 'all') {
            filteredHabits = filteredHabits.filter(habit => {
                if (filter === 'daily' || filter === 'weekly' || filter === 'monthly') {
                    return habit.frequency === filter;
                } else if (filter === 'active') {
                    return !habit.archived;
                } else if (filter === 'archived') {
                    return habit.archived;
                }
                return true;
            });
        }
        
        if (filteredHabits.length === 0) {
            this.elements.habitsList.innerHTML = '<div class="empty-state">No habits found</div>';
            return;
        }
        
        let html = '';
        
        filteredHabits.forEach(habit => {
            const isCompleted = this.isHabitCompletedToday(habit);
            const streak = this.calculateStreak(habit);
            
            html += `
                <div class="habit-item ${habit.archived ? 'archived' : ''}" data-id="${habit.id}">
                    <div class="habit-check">
                        <input type="checkbox" id="habit-check-${habit.id}" ${isCompleted ? 'checked' : ''}>
                        <label for="habit-check-${habit.id}" style="border-color: ${habit.color}; background-color: ${isCompleted ? habit.color : 'transparent'};"></label>
                    </div>
                    <div class="habit-content">
                        <div class="habit-title">${habit.title}</div>
                        <div class="habit-meta">
                            <span class="habit-frequency">${this.formatFrequency(habit)}</span>
                            <span class="habit-streak">${streak} day streak</span>
                        </div>
                    </div>
                    <div class="habit-actions">
                        <button class="habit-edit-btn" title="Edit Habit">✏️</button>
                        <button class="habit-archive-btn" title="${habit.archived ? 'Unarchive Habit' : 'Archive Habit'}">${habit.archived ? '📂' : '📁'}</button>
                    </div>
                </div>
            `;
        });
        
        this.elements.habitsList.innerHTML = html;
        
        // Add event listeners to habit items
        document.querySelectorAll('.habit-item').forEach(item => {
            const habitId = parseInt(item.getAttribute('data-id'));
            
            // Checkbox
            const checkbox = item.querySelector(`#habit-check-${habitId}`);
            checkbox.addEventListener('change', () => {
                this.toggleHabitCompletion(habitId, checkbox.checked);
            });
            
            // Edit button
            const editBtn = item.querySelector('.habit-edit-btn');
            editBtn.addEventListener('click', () => {
                this.editHabit(habitId);
            });
            
            // Archive button
            const archiveBtn = item.querySelector('.habit-archive-btn');
            archiveBtn.addEventListener('click', () => {
                this.toggleHabitArchived(habitId);
            });
        });
        
        // Update statistics
        this.updateStatistics();
    },
    
    // Render calendar
    renderCalendar: function() {
        // Update current month display
        const monthYear = `${Utils.getMonthName(this.currentDate)} ${this.currentDate.getFullYear()}`;
        this.elements.currentMonth.textContent = monthYear;
        
        // Get first day of month and number of days in month
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Clear calendar days
        this.elements.calendarDays.innerHTML = '';
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            this.elements.calendarDays.appendChild(emptyCell);
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            // Check if this day is today
            const today = new Date();
            if (date.getDate() === today.getDate() && 
                date.getMonth() === today.getMonth() && 
                date.getFullYear() === today.getFullYear()) {
                dayCell.classList.add('today');
            }
            
            // Add day number
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);
            
            // Add habit completions for this day
            const completions = this.getCompletionsForDay(date);
            if (completions.length > 0) {
                const completionIndicator = document.createElement('div');
                completionIndicator.className = 'completion-indicator';
                
                // Group completions by habit
                const habitCompletions = {};
                completions.forEach(completion => {
                    habitCompletions[completion.habitId] = true;
                });
                
                // Get habits for these completions
                Object.keys(habitCompletions).forEach(habitId => {
                    const habit = this.getHabitById(parseInt(habitId));
                    if (habit) {
                        const completionDot = document.createElement('div');
                        completionDot.className = 'completion-dot';
                        completionDot.style.backgroundColor = habit.color;
                        completionIndicator.appendChild(completionDot);
                    }
                });
                
                dayCell.appendChild(completionIndicator);
            }
            
            this.elements.calendarDays.appendChild(dayCell);
        }
    },
    
    // Update statistics
    updateStatistics: function() {
        this.updateStreaks();
        this.updateCompletionRate();
        this.updateChart();
    },
    
    // Update streaks display
    updateStreaks: function() {
        // Sort habits by streak (highest first)
        const sortedHabits = [...this.habits]
            .filter(habit => !habit.archived)
            .map(habit => ({
                ...habit,
                streak: this.calculateStreak(habit)
            }))
            .sort((a, b) => b.streak - a.streak);
        
        // Take top 5
        const topStreaks = sortedHabits.slice(0, 5);
        
        if (topStreaks.length === 0) {
            this.elements.currentStreaks.innerHTML = '<div class="empty-state">No active habits</div>';
            return;
        }
        
        let html = '<ul class="streaks-list">';
        
        topStreaks.forEach(habit => {
            html += `
                <li>
                    <span class="streak-title">${habit.title}</span>
                    <span class="streak-count">${habit.streak} days</span>
                </li>
            `;
        });
        
        html += '</ul>';
        
        this.elements.currentStreaks.innerHTML = html;
    },
    
    // Update completion rate display
    updateCompletionRate: function() {
        // Calculate completion rate for last 30 days
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        // Get active habits
        const activeHabits = this.habits.filter(habit => !habit.archived);
        
        if (activeHabits.length === 0) {
            this.elements.completionRate.innerHTML = '<div class="empty-state">No active habits</div>';
            return;
        }
        
        // Calculate total possible completions and actual completions
        let totalPossible = 0;
        let totalCompleted = 0;
        
        activeHabits.forEach(habit => {
            // Get start date (or thirty days ago, whichever is later)
            const startDate = new Date(habit.startDate);
            const habitStartDate = startDate > thirtyDaysAgo ? startDate : thirtyDaysAgo;
            
            // Loop through each day
            for (let d = new Date(habitStartDate); d <= today; d.setDate(d.getDate() + 1)) {
                if (this.shouldHabitBeCompletedOnDate(habit, d)) {
                    totalPossible++;
                    
                    // Check if completed
                    if (this.isHabitCompletedOnDate(habit, d)) {
                        totalCompleted++;
                    }
                }
            }
        });
        
        // Calculate rate
        const completionRate = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
        
        // Create progress bar
        const html = `
            <div class="completion-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${completionRate}%"></div>
                </div>
                <div class="progress-text">${completionRate.toFixed(1)}%</div>
            </div>
            <div class="completion-details">
                ${totalCompleted} of ${totalPossible} habits completed in the last 30 days
            </div>
        `;
        
        this.elements.completionRate.innerHTML = html;
    },
    
    // Update chart
    updateChart: function() {
        // Load Chart.js dynamically if not already loaded
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => {
                this.createChart();
            };
            document.head.appendChild(script);
        } else {
            this.createChart();
        }
    },
    
    // Create habits chart
    createChart: function() {
        // Get data for last 7 days
        const labels = [];
        const data = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Format date as day name
            const dayName = Utils.getDayOfWeek(date).substr(0, 3);
            labels.push(dayName);
            
            // Count completions for this day
            const completions = this.getCompletionsForDay(date);
            data.push(completions.length);
        }
        
        // Create or update chart
        if (this.chart) {
            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = data;
            this.chart.update();
        } else {
            this.chart = new Chart(this.elements.habitsChart, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Habits Completed',
                        data: data,
                        backgroundColor: 'rgba(74, 144, 226, 0.7)',
                        borderColor: 'rgba(74, 144, 226, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
    },
    
    // Open habit form
    openHabitForm: function(habit = null) {
        // Reset form
        this.elements.habitForm.reset();
        this.elements.habitId.value = '';
        
        // Set default start date to today
        const today = new Date();
        this.elements.habitStartDate.value = Utils.formatDate(today);
        
        // If editing a habit, populate form
        if (habit) {
            this.elements.habitFormTitle.textContent = 'Edit Habit';
            this.elements.habitId.value = habit.id;
            this.elements.habitTitle.value = habit.title;
            this.elements.habitDescription.value = habit.description || '';
            this.elements.habitFrequency.value = habit.frequency;
            this.elements.habitCategory.value = habit.category || 'other';
            this.elements.habitStartDate.value = Utils.formatDate(new Date(habit.startDate));
            this.elements.habitReminder.value = habit.reminder || 'none';
            this.elements.habitColor.value = habit.color || '#4a90e2';
            
            // Set frequency-specific fields
            if (habit.frequency === 'weekly' && habit.weekdays) {
                habit.weekdays.forEach(day => {
                    document.getElementById(`weekday-${day}`).checked = true;
                });
            } else if (habit.frequency === 'monthly' && habit.monthday) {
                this.elements.habitMonthday.value = habit.monthday;
            }
        } else {
            this.elements.habitFormTitle.textContent = 'Add New Habit';
        }
        
        // Update frequency fields
        this.updateFrequencyFields();
        
        // Open modal
        this.elements.habitFormModal.classList.add('active');
        this.elements.habitTitle.focus();
    },
    
    // Close habit form
    closeHabitForm: function() {
        this.elements.habitFormModal.classList.remove('active');
    },
    
    // Update frequency fields based on selected frequency
    updateFrequencyFields: function() {
        const frequency = this.elements.habitFrequency.value;
        
        if (frequency === 'weekly') {
            this.elements.weekdaysGroup.style.display = 'block';
            this.elements.monthdayGroup.style.display = 'none';
        } else if (frequency === 'monthly') {
            this.elements.weekdaysGroup.style.display = 'none';
            this.elements.monthdayGroup.style.display = 'block';
        } else {
            this.elements.weekdaysGroup.style.display = 'none';
            this.elements.monthdayGroup.style.display = 'none';
        }
    },
    
    // Save habit
    saveHabit: async function() {
        try {
            const habitId = this.elements.habitId.value;
            const title = this.elements.habitTitle.value.trim();
            const description = this.elements.habitDescription.value.trim();
            const frequency = this.elements.habitFrequency.value;
            const category = this.elements.habitCategory.value;
            const startDate = this.elements.habitStartDate.value;
            const reminder = this.elements.habitReminder.value;
            const color = this.elements.habitColor.value;
            
            // Validate title
            if (!title) {
                Utils.showNotification('Habit title is required', 'error');
                return;
            }
            
            // Create habit object
            const habit = {
                title,
                description,
                frequency,
                category,
                startDate,
                reminder,
                color,
                archived: false
            };
            
            // Add frequency-specific fields
            if (frequency === 'weekly') {
                const weekdays = [];
                for (let i = 0; i < 7; i++) {
                    if (document.getElementById(`weekday-${i}`).checked) {
                        weekdays.push(i);
                    }
                }
                
                if (weekdays.length === 0) {
                    Utils.showNotification('Please select at least one day of the week', 'error');
                    return;
                }
                
                habit.weekdays = weekdays;
            } else if (frequency === 'monthly') {
                habit.monthday = this.elements.habitMonthday.value;
            }
            
            // If editing, update habit
            if (habitId) {
                habit.id = parseInt(habitId);
                await window.PatelDB.update('habits', habit);
                Utils.showNotification('Habit updated successfully', 'success');
            } else {
                // Otherwise, add new habit
                await window.PatelDB.add('habits', habit);
                Utils.showNotification('Habit added successfully', 'success');
            }
            
            // Close form and reload habits
            this.closeHabitForm();
            await this.loadHabits();
            this.renderHabits();
            this.renderCalendar();
            
            // Schedule reminder if needed
            if (reminder !== 'none') {
                this.scheduleReminder(habit);
            }
        } catch (error) {
            console.error('Error saving habit:', error);
            Utils.showNotification('Error saving habit', 'error');
        }
    },
    
    // Edit habit
    editHabit: async function(habitId) {
        try {
            const habit = await window.PatelDB.get('habits', habitId);
            if (habit) {
                this.openHabitForm(habit);
            } else {
                Utils.showNotification('Habit not found', 'error');
            }
        } catch (error) {
            console.error('Error editing habit:', error);
            Utils.showNotification('Error editing habit', 'error');
        }
    },
    
    // Toggle habit archived status
    toggleHabitArchived: async function(habitId) {
        try {
            const habit = await window.PatelDB.get('habits', habitId);
            if (habit) {
                habit.archived = !habit.archived;
                await window.PatelDB.update('habits', habit);
                Utils.showNotification(`Habit ${habit.archived ? 'archived' : 'unarchived'} successfully`, 'success');
                await this.loadHabits();
                this.renderHabits();
            } else {
                Utils.showNotification('Habit not found', 'error');
            }
        } catch (error) {
            console.error('Error toggling habit archived status:', error);
            Utils.showNotification('Error updating habit', 'error');
        }
    },
    
    // Toggle habit completion
    toggleHabitCompletion: async function(habitId, completed) {
        try {
            const habit = await window.PatelDB.get('habits', habitId);
            if (!habit) {
                Utils.showNotification('Habit not found', 'error');
                return;
            }
            
            const today = new Date();
            const dateStr = Utils.formatDate(today);
            
            // Check if log already exists for today
            const existingLog = this.habitLogs.find(log => 
                log.habitId === habitId && Utils.formatDate(new Date(log.date)) === dateStr
            );
            
            if (completed) {
                // Add completion log if it doesn't exist
                if (!existingLog) {
                    const log = {
                        habitId,
                        date: today.toISOString()
                    };
                    
                    const logId = await window.PatelDB.add('habitLogs', log);
                    this.habitLogs.push({ ...log, id: logId });
                    
                    Utils.showNotification('Habit marked as completed', 'success');
                }
            } else {
                // Remove completion log if it exists
                if (existingLog) {
                    await window.PatelDB.delete('habitLogs', existingLog.id);
                    this.habitLogs = this.habitLogs.filter(log => log.id !== existingLog.id);
                    
                    Utils.showNotification('Habit marked as incomplete', 'success');
                }
            }
            
            // Update UI
            this.renderHabits();
            this.renderCalendar();
        } catch (error) {
            console.error('Error toggling habit completion:', error);
            Utils.showNotification('Error updating habit', 'error');
        }
    },
    
    // Check if habit is completed today
    isHabitCompletedToday: function(habit) {
        const today = new Date();
        return this.isHabitCompletedOnDate(habit, today);
    },
    
    // Check if habit is completed on a specific date
    isHabitCompletedOnDate: function(habit, date) {
        const dateStr = Utils.formatDate(date);
        
        return this.habitLogs.some(log => 
            log.habitId === habit.id && Utils.formatDate(new Date(log.date)) === dateStr
        );
    },
    
    // Check if habit should be completed on a specific date
    shouldHabitBeCompletedOnDate: function(habit, date) {
        // Check if date is after start date
        const startDate = new Date(habit.startDate);
        startDate.setHours(0, 0, 0, 0);
        
        if (date < startDate) {
            return false;
        }
        
        // Check based on frequency
        if (habit.frequency === 'daily') {
            return true;
        } else if (habit.frequency === 'weekly' && habit.weekdays) {
            const dayOfWeek = date.getDay();
            return habit.weekdays.includes(dayOfWeek);
        } else if (habit.frequency === 'monthly' && habit.monthday) {
            const dayOfMonth = date.getDate();
            
            if (habit.monthday === 'last') {
                // Check if it's the last day of the month
                const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                return dayOfMonth === lastDay;
            } else {
                return dayOfMonth === parseInt(habit.monthday);
            }
        }
        
        return false;
    },
    
    // Calculate current streak for a habit
    calculateStreak: function(habit) {
        let streak = 0;
        let currentDate = new Date();
        
        // Start from today and go backwards
        while (true) {
            // Check if habit should be completed on this date
            if (this.shouldHabitBeCompletedOnDate(habit, currentDate)) {
                // Check if it was completed
                if (this.isHabitCompletedOnDate(habit, currentDate)) {
                    streak++;
                } else {
                    // Streak broken
                    break;
                }
            }
            
            // Move to previous day
            currentDate.setDate(currentDate.getDate() - 1);
            
            // Stop if we reach the start date
            const startDate = new Date(habit.startDate);
            startDate.setHours(0, 0, 0, 0);
            if (currentDate < startDate) {
                break;
            }
        }
        
        return streak;
    },
    
    // Get completions for a specific day
    getCompletionsForDay: function(date) {
        const dateStr = Utils.formatDate(date);
        
        return this.habitLogs.filter(log => 
            Utils.formatDate(new Date(log.date)) === dateStr
        );
    },
    
    // Get habit by ID
    getHabitById: function(habitId) {
        return this.habits.find(habit => habit.id === habitId);
    },
    
    // Format frequency for display
    formatFrequency: function(habit) {
        if (habit.frequency === 'daily') {
            return 'Daily';
        } else if (habit.frequency === 'weekly' && habit.weekdays) {
            if (habit.weekdays.length === 7) {
                return 'Every day';
            } else if (habit.weekdays.length === 5 && 
                       habit.weekdays.includes(1) && 
                       habit.weekdays.includes(2) && 
                       habit.weekdays.includes(3) && 
                       habit.weekdays.includes(4) && 
                       habit.weekdays.includes(5)) {
                return 'Weekdays';
            } else if (habit.weekdays.length === 2 && 
                       habit.weekdays.includes(0) && 
                       habit.weekdays.includes(6)) {
                return 'Weekends';
            } else {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return habit.weekdays.map(day => days[day]).join(', ');
            }
        } else if (habit.frequency === 'monthly' && habit.monthday) {
            if (habit.monthday === 'last') {
                return 'Last day of month';
            } else {
                const day = parseInt(habit.monthday);
                const suffix = this.getDaySuffix(day);
                return `${day}${suffix} of month`;
            }
        }
        
        return habit.frequency;
    },
    
    // Get day suffix (st, nd, rd, th)
    getDaySuffix: function(day) {
        if (day >= 11 && day <= 13) {
            return 'th';
        }
        
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    },
    
    // Schedule reminder
    scheduleReminder: function(habit) {
        if (!Utils.isFeatureSupported('notifications')) {
            console.log('Notifications not supported');
            return;
        }
        
        // Request notification permission if needed
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
        
        // Get reminder time
        let reminderHour;
        switch (habit.reminder) {
            case 'morning': reminderHour = 8; break;
            case 'afternoon': reminderHour = 13; break;
            case 'evening': reminderHour = 18; break;
            case 'night': reminderHour = 21; break;
            default: return; // No reminder
        }
        
        // Schedule reminder for today if not already completed
        const today = new Date();
        if (this.shouldHabitBeCompletedOnDate(habit, today) && !this.isHabitCompletedOnDate(habit, today)) {
            const now = new Date();
            const reminderTime = new Date();
            reminderTime.setHours(reminderHour, 0, 0, 0);
            
            // If reminder time is in the future today, schedule it
            if (reminderTime > now) {
                const delay = reminderTime.getTime() - now.getTime();
                
                setTimeout(() => {
                    if (Notification.permission === 'granted') {
                        // Check again if habit is completed
                        if (!this.isHabitCompletedToday(habit)) {
                            const notification = new Notification(`Habit Reminder: ${habit.title}`, {
                                body: `Don't forget to complete your habit today!`,
                                icon: '/assets/logo.svg'
                            });
                            
                            // Vibrate if supported
                            if (Utils.isFeatureSupported('vibration')) {
                                navigator.vibrate([200, 100, 200]);
                            }
                        }
                    }
                }, delay);
            }
        }
    }
};

// Register module
window['habitsModule'] = habitsModule;
