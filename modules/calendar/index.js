/* Calendar Module for Patel Productivity Suite */

const calendarModule = {
    // Store DOM elements
    elements: {},
    
    // Calendar data
    currentDate: new Date(),
    selectedDate: new Date(),
    events: [],
    
    // Initialize the module
    init: async function(container) {
        console.log('Initializing Calendar module');
        
        // Render the module UI
        this.render(container);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load events
        await this.loadEvents();
        
        // Render calendar
        this.renderCalendar();
    },
    
    // Render the module UI
    render: function(container) {
        container.innerHTML = `
            <div class="module-header">
                <h2>Calendar Sync Pro</h2>
                <div class="module-actions">
                    <button id="add-event-btn" class="btn primary">Add Event</button>
                    <select id="calendar-view">
                        <option value="month">Month</option>
                        <option value="week">Week</option>
                        <option value="day">Day</option>
                        <option value="agenda">Agenda</option>
                    </select>
                </div>
            </div>
            
            <div class="calendar-container">
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
                
                <div id="event-list" class="event-list"></div>
            </div>
            
            <!-- Event Form Modal -->
            <div id="event-form-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3 id="event-form-title">Add New Event</h3>
                    <form id="event-form">
                        <input type="hidden" id="event-id">
                        <div class="form-group">
                            <label for="event-title">Title</label>
                            <input type="text" id="event-title" required>
                        </div>
                        <div class="form-group">
                            <label for="event-description">Description</label>
                            <textarea id="event-description"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="event-start-date">Start Date</label>
                            <input type="date" id="event-start-date" required>
                        </div>
                        <div class="form-group">
                            <label for="event-start-time">Start Time</label>
                            <input type="time" id="event-start-time">
                        </div>
                        <div class="form-group">
                            <label for="event-end-date">End Date</label>
                            <input type="date" id="event-end-date" required>
                        </div>
                        <div class="form-group">
                            <label for="event-end-time">End Time</label>
                            <input type="time" id="event-end-time">
                        </div>
                        <div class="form-group">
                            <label for="event-category">Category</label>
                            <select id="event-category">
                                <option value="work">Work</option>
                                <option value="personal">Personal</option>
                                <option value="family">Family</option>
                                <option value="health">Health</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="event-location">Location</label>
                            <input type="text" id="event-location">
                        </div>
                        <div class="form-group">
                            <label for="event-reminder">Reminder</label>
                            <select id="event-reminder">
                                <option value="none">None</option>
                                <option value="5">5 minutes before</option>
                                <option value="15">15 minutes before</option>
                                <option value="30">30 minutes before</option>
                                <option value="60">1 hour before</option>
                                <option value="1440">1 day before</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="button" id="event-cancel-btn" class="btn">Cancel</button>
                            <button type="submit" id="event-save-btn" class="btn primary">Save Event</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Store DOM elements
        this.elements = {
            calendarDays: document.getElementById('calendar-days'),
            currentMonth: document.getElementById('current-month'),
            prevMonthBtn: document.getElementById('prev-month-btn'),
            nextMonthBtn: document.getElementById('next-month-btn'),
            addEventBtn: document.getElementById('add-event-btn'),
            calendarView: document.getElementById('calendar-view'),
            eventList: document.getElementById('event-list'),
            eventFormModal: document.getElementById('event-form-modal'),
            eventForm: document.getElementById('event-form'),
            eventFormTitle: document.getElementById('event-form-title'),
            eventId: document.getElementById('event-id'),
            eventTitle: document.getElementById('event-title'),
            eventDescription: document.getElementById('event-description'),
            eventStartDate: document.getElementById('event-start-date'),
            eventStartTime: document.getElementById('event-start-time'),
            eventEndDate: document.getElementById('event-end-date'),
            eventEndTime: document.getElementById('event-end-time'),
            eventCategory: document.getElementById('event-category'),
            eventLocation: document.getElementById('event-location'),
            eventReminder: document.getElementById('event-reminder'),
            eventCancelBtn: document.getElementById('event-cancel-btn'),
            eventSaveBtn: document.getElementById('event-save-btn'),
            closeModal: document.querySelector('#event-form-modal .close-modal')
        };
    },
    
    // Setup event listeners
    setupEventListeners: function() {
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
        
        // Add event button
        this.elements.addEventBtn.addEventListener('click', () => {
            this.openEventForm();
        });
        
        // Calendar view change
        this.elements.calendarView.addEventListener('change', () => {
            this.renderCalendar();
        });
        
        // Close modal
        this.elements.closeModal.addEventListener('click', () => {
            this.closeEventForm();
        });
        
        // Cancel button
        this.elements.eventCancelBtn.addEventListener('click', () => {
            this.closeEventForm();
        });
        
        // Event form submission
        this.elements.eventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });
    },
    
    // Load events from database
    loadEvents: async function() {
        try {
            this.events = await window.PatelDB.getAll('events');
        } catch (error) {
            console.error('Error loading events:', error);
            this.events = [];
        }
    },
    
    // Render calendar
    renderCalendar: function() {
        const view = this.elements.calendarView.value;
        
        switch (view) {
            case 'month':
                this.renderMonthView();
                break;
            case 'week':
                this.renderWeekView();
                break;
            case 'day':
                this.renderDayView();
                break;
            case 'agenda':
                this.renderAgendaView();
                break;
            default:
                this.renderMonthView();
        }
    },
    
    // Render month view
    renderMonthView: function() {
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
            
            // Check if this day is selected
            if (date.getDate() === this.selectedDate.getDate() && 
                date.getMonth() === this.selectedDate.getMonth() && 
                date.getFullYear() === this.selectedDate.getFullYear()) {
                dayCell.classList.add('selected');
            }
            
            // Add day number
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);
            
            // Add events for this day
            const dayEvents = this.getEventsForDay(date);
            if (dayEvents.length > 0) {
                const eventIndicator = document.createElement('div');
                eventIndicator.className = 'event-indicator';
                
                // Show up to 3 events
                const eventsToShow = dayEvents.slice(0, 3);
                eventsToShow.forEach(event => {
                    const eventDot = document.createElement('div');
                    eventDot.className = `event-dot ${event.category}`;
                    eventIndicator.appendChild(eventDot);
                });
                
                // If there are more events, add a "more" indicator
                if (dayEvents.length > 3) {
                    const moreDot = document.createElement('div');
                    moreDot.className = 'event-dot more';
                    moreDot.textContent = '+' + (dayEvents.length - 3);
                    eventIndicator.appendChild(moreDot);
                }
                
                dayCell.appendChild(eventIndicator);
            }
            
            // Add click event to select day
            dayCell.addEventListener('click', () => {
                this.selectedDate = new Date(date);
                this.renderCalendar();
                this.renderEventList(dayEvents);
            });
            
            this.elements.calendarDays.appendChild(dayCell);
        }
        
        // Render event list for selected day
        const selectedDayEvents = this.getEventsForDay(this.selectedDate);
        this.renderEventList(selectedDayEvents);
    },
    
    // Render week view
    renderWeekView: function() {
        // Get first day of week (Sunday) and last day of week (Saturday)
        const currentDay = this.selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const firstDayOfWeek = new Date(this.selectedDate);
        firstDayOfWeek.setDate(this.selectedDate.getDate() - currentDay);
        
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        
        // Update current month display
        const dateRange = `${Utils.formatDate(firstDayOfWeek)} - ${Utils.formatDate(lastDayOfWeek)}`;
        this.elements.currentMonth.textContent = dateRange;
        
        // Clear calendar days
        this.elements.calendarDays.innerHTML = '';
        
        // Create week header
        const weekHeader = document.createElement('div');
        weekHeader.className = 'week-header';
        
        // Add time column
        const timeColumn = document.createElement('div');
        timeColumn.className = 'time-column';
        timeColumn.innerHTML = '<div class="time-header"></div>';
        
        // Add hour rows
        for (let hour = 0; hour < 24; hour++) {
            const hourRow = document.createElement('div');
            hourRow.className = 'hour-row';
            hourRow.textContent = `${hour}:00`;
            timeColumn.appendChild(hourRow);
        }
        
        weekHeader.appendChild(timeColumn);
        
        // Add day columns
        for (let i = 0; i < 7; i++) {
            const day = new Date(firstDayOfWeek);
            day.setDate(firstDayOfWeek.getDate() + i);
            
            const dayColumn = document.createElement('div');
            dayColumn.className = 'day-column';
            
            // Add day header
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            
            // Check if this day is today
            const today = new Date();
            if (day.getDate() === today.getDate() && 
                day.getMonth() === today.getMonth() && 
                day.getFullYear() === today.getFullYear()) {
                dayHeader.classList.add('today');
            }
            
            dayHeader.textContent = `${Utils.getDayOfWeek(day).substr(0, 3)} ${day.getDate()}`;
            dayColumn.appendChild(dayHeader);
            
            // Add hour cells
            for (let hour = 0; hour < 24; hour++) {
                const hourCell = document.createElement('div');
                hourCell.className = 'hour-cell';
                hourCell.setAttribute('data-hour', hour);
                
                // Add click event to add event at this time
                hourCell.addEventListener('click', () => {
                    const eventDate = new Date(day);
                    eventDate.setHours(hour, 0, 0, 0);
                    this.openEventForm(null, eventDate);
                });
                
                dayColumn.appendChild(hourCell);
            }
            
            weekHeader.appendChild(dayColumn);
        }
        
        this.elements.calendarDays.appendChild(weekHeader);
        
        // Add events to week view
        this.events.forEach(event => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            
            // Check if event is in current week
            if (startDate <= lastDayOfWeek && endDate >= firstDayOfWeek) {
                // Calculate event position
                const eventStartDay = Math.max(0, Math.floor((startDate - firstDayOfWeek) / (24 * 60 * 60 * 1000)));
                const eventEndDay = Math.min(6, Math.floor((endDate - firstDayOfWeek) / (24 * 60 * 60 * 1000)));
                
                const startHour = startDate.getHours() + (startDate.getMinutes() / 60);
                const endHour = endDate.getHours() + (endDate.getMinutes() / 60);
                
                // Create event element
                for (let day = eventStartDay; day <= eventEndDay; day++) {
                    const dayColumn = weekHeader.children[day + 1]; // +1 for time column
                    
                    const eventElement = document.createElement('div');
                    eventElement.className = `calendar-event ${event.category}`;
                    eventElement.innerHTML = `
                        <div class="event-title">${event.title}</div>
                        <div class="event-time">${Utils.formatTime(startDate)} - ${Utils.formatTime(endDate)}</div>
                    `;
                    
                    // Position event
                    const dayStart = day === eventStartDay ? startHour : 0;
                    const dayEnd = day === eventEndDay ? endHour : 24;
                    
                    eventElement.style.top = `${dayStart * 60}px`;
                    eventElement.style.height = `${(dayEnd - dayStart) * 60}px`;
                    
                    // Add click event to edit
                    eventElement.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.editEvent(event.id);
                    });
                    
                    dayColumn.appendChild(eventElement);
                }
            }
        });
    },
    
    // Render day view
    renderDayView: function() {
        // Update current month display
        const dateStr = `${Utils.getDayOfWeek(this.selectedDate)}, ${Utils.getMonthName(this.selectedDate)} ${this.selectedDate.getDate()}, ${this.selectedDate.getFullYear()}`;
        this.elements.currentMonth.textContent = dateStr;
        
        // Clear calendar days
        this.elements.calendarDays.innerHTML = '';
        
        // Create day view container
        const dayView = document.createElement('div');
        dayView.className = 'day-view';
        
        // Add time column
        const timeColumn = document.createElement('div');
        timeColumn.className = 'time-column';
        
        // Add hour rows
        for (let hour = 0; hour < 24; hour++) {
            const hourRow = document.createElement('div');
            hourRow.className = 'hour-row';
            hourRow.textContent = `${hour}:00`;
            timeColumn.appendChild(hourRow);
        }
        
        dayView.appendChild(timeColumn);
        
        // Add event column
        const eventColumn = document.createElement('div');
        eventColumn.className = 'event-column';
        
        // Add hour cells
        for (let hour = 0; hour < 24; hour++) {
            const hourCell = document.createElement('div');
            hourCell.className = 'hour-cell';
            hourCell.setAttribute('data-hour', hour);
            
            // Add click event to add event at this time
            hourCell.addEventListener('click', () => {
                const eventDate = new Date(this.selectedDate);
                eventDate.setHours(hour, 0, 0, 0);
                this.openEventForm(null, eventDate);
            });
            
            eventColumn.appendChild(hourCell);
        }
        
        dayView.appendChild(eventColumn);
        this.elements.calendarDays.appendChild(dayView);
        
        // Add events to day view
        const dayEvents = this.getEventsForDay(this.selectedDate);
        dayEvents.forEach(event => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            
            const startHour = startDate.getHours() + (startDate.getMinutes() / 60);
            const endHour = endDate.getHours() + (endDate.getMinutes() / 60);
            
            // Create event element
            const eventElement = document.createElement('div');
            eventElement.className = `calendar-event ${event.category}`;
            eventElement.innerHTML = `
                <div class="event-title">${event.title}</div>
                <div class="event-time">${Utils.formatTime(startDate)} - ${Utils.formatTime(endDate)}</div>
                ${event.location ? `<div class="event-location">📍 ${event.location}</div>` : ''}
            `;
            
            // Position event
            eventElement.style.top = `${startHour * 60}px`;
            eventElement.style.height = `${(endHour - startHour) * 60}px`;
            
            // Add click event to edit
            eventElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editEvent(event.id);
            });
            
            eventColumn.appendChild(eventElement);
        });
    },
    
    // Render agenda view
    renderAgendaView: function() {
        // Update current month display
        this.elements.currentMonth.textContent = 'Upcoming Events';
        
        // Clear calendar days
        this.elements.calendarDays.innerHTML = '';
        
        // Create agenda view container
        const agendaView = document.createElement('div');
        agendaView.className = 'agenda-view';
        
        // Sort events by start date
        const sortedEvents = [...this.events].sort((a, b) => {
            return new Date(a.startDate) - new Date(b.startDate);
        });
        
        // Group events by date
        const eventsByDate = {};
        sortedEvents.forEach(event => {
            const startDate = new Date(event.startDate);
            const dateStr = Utils.formatDate(startDate);
            
            if (!eventsByDate[dateStr]) {
                eventsByDate[dateStr] = [];
            }
            
            eventsByDate[dateStr].push(event);
        });
        
        // Add events to agenda view
        Object.keys(eventsByDate).forEach(dateStr => {
            const date = new Date(dateStr);
            const dateHeader = document.createElement('div');
            dateHeader.className = 'date-header';
            dateHeader.textContent = `${Utils.getDayOfWeek(date)}, ${Utils.getMonthName(date)} ${date.getDate()}, ${date.getFullYear()}`;
            agendaView.appendChild(dateHeader);
            
            const events = eventsByDate[dateStr];
            events.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = `agenda-event ${event.category}`;
                eventElement.innerHTML = `
                    <div class="event-time">${Utils.formatTime(new Date(event.startDate))} - ${Utils.formatTime(new Date(event.endDate))}</div>
                    <div class="event-title">${event.title}</div>
                    ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
                    ${event.location ? `<div class="event-location">📍 ${event.location}</div>` : ''}
                `;
                
                // Add click event to edit
                eventElement.addEventListener('click', () => {
                    this.editEvent(event.id);
                });
                
                agendaView.appendChild(eventElement);
            });
        });
        
        this.elements.calendarDays.appendChild(agendaView);
    },
    
    // Render event list for a specific day
    renderEventList: function(events) {
        if (events.length === 0) {
            this.elements.eventList.innerHTML = '<div class="empty-state">No events for this day</div>';
            return;
        }
        
        // Sort events by start time
        events.sort((a, b) => {
            return new Date(a.startDate) - new Date(b.startDate);
        });
        
        let html = '<h4>Events for ' + Utils.formatDate(this.selectedDate) + '</h4>';
        
        events.forEach(event => {
            const startTime = Utils.formatTime(new Date(event.startDate));
            const endTime = Utils.formatTime(new Date(event.endDate));
            
            html += `
                <div class="event-item ${event.category}" data-id="${event.id}">
                    <div class="event-time">${startTime} - ${endTime}</div>
                    <div class="event-content">
                        <div class="event-title">${event.title}</div>
                        ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
                        ${event.location ? `<div class="event-location">📍 ${event.location}</div>` : ''}
                    </div>
                    <div class="event-actions">
                        <button class="event-edit-btn" title="Edit Event">✏️</button>
                        <button class="event-delete-btn" title="Delete Event">🗑️</button>
                    </div>
                </div>
            `;
        });
        
        this.elements.eventList.innerHTML = html;
        
        // Add event listeners to event items
        document.querySelectorAll('.event-item').forEach(item => {
            const eventId = parseInt(item.getAttribute('data-id'));
            
            // Edit button
            const editBtn = item.querySelector('.event-edit-btn');
            editBtn.addEventListener('click', () => {
                this.editEvent(eventId);
            });
            
            // Delete button
            const deleteBtn = item.querySelector('.event-delete-btn');
            deleteBtn.addEventListener('click', () => {
                this.deleteEvent(eventId);
            });
        });
    },
    
    // Get events for a specific day
    getEventsForDay: function(date) {
        const dateStr = Utils.formatDate(date);
        
        return this.events.filter(event => {
            const startDate = Utils.formatDate(new Date(event.startDate));
            const endDate = Utils.formatDate(new Date(event.endDate));
            
            // Check if event starts, ends, or spans this day
            return (startDate <= dateStr && endDate >= dateStr);
        });
    },
    
    // Open event form
    openEventForm: function(event = null, defaultDate = null) {
        // Reset form
        this.elements.eventForm.reset();
        this.elements.eventId.value = '';
        
        // Set default dates
        const now = defaultDate || new Date();
        const startDate = Utils.formatDate(now);
        const endDate = Utils.formatDate(now);
        
        // Set default times
        const startTime = Utils.formatTime(now);
        let endTime = new Date(now);
        endTime.setHours(endTime.getHours() + 1);
        endTime = Utils.formatTime(endTime);
        
        this.elements.eventStartDate.value = startDate;
        this.elements.eventStartTime.value = startTime;
        this.elements.eventEndDate.value = endDate;
        this.elements.eventEndTime.value = endTime;
        
        // If editing an event, populate form
        if (event) {
            this.elements.eventFormTitle.textContent = 'Edit Event';
            this.elements.eventId.value = event.id;
            this.elements.eventTitle.value = event.title;
            this.elements.eventDescription.value = event.description || '';
            
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            
            this.elements.eventStartDate.value = Utils.formatDate(startDate);
            this.elements.eventStartTime.value = Utils.formatTime(startDate);
            this.elements.eventEndDate.value = Utils.formatDate(endDate);
            this.elements.eventEndTime.value = Utils.formatTime(endDate);
            
            this.elements.eventCategory.value = event.category || 'other';
            this.elements.eventLocation.value = event.location || '';
            this.elements.eventReminder.value = event.reminder || 'none';
        } else {
            this.elements.eventFormTitle.textContent = 'Add New Event';
        }
        
        // Open modal
        this.elements.eventFormModal.classList.add('active');
        this.elements.eventTitle.focus();
    },
    
    // Close event form
    closeEventForm: function() {
        this.elements.eventFormModal.classList.remove('active');
    },
    
    // Save event
    saveEvent: async function() {
        try {
            const eventId = this.elements.eventId.value;
            const title = this.elements.eventTitle.value.trim();
            const description = this.elements.eventDescription.value.trim();
            const startDate = this.elements.eventStartDate.value;
            const startTime = this.elements.eventStartTime.value || '00:00';
            const endDate = this.elements.eventEndDate.value;
            const endTime = this.elements.eventEndTime.value || '00:00';
            const category = this.elements.eventCategory.value;
            const location = this.elements.eventLocation.value.trim();
            const reminder = this.elements.eventReminder.value;
            
            // Validate title
            if (!title) {
                Utils.showNotification('Event title is required', 'error');
                return;
            }
            
            // Validate dates
            if (!startDate || !endDate) {
                Utils.showNotification('Start and end dates are required', 'error');
                return;
            }
            
            // Create start and end date objects
            const startDateTime = new Date(`${startDate}T${startTime}`);
            const endDateTime = new Date(`${endDate}T${endTime}`);
            
            // Validate date range
            if (endDateTime < startDateTime) {
                Utils.showNotification('End date must be after start date', 'error');
                return;
            }
            
            // Create event object
            const event = {
                title,
                description,
                startDate: startDateTime.toISOString(),
                endDate: endDateTime.toISOString(),
                category,
                location,
                reminder
            };
            
            // If editing, update event
            if (eventId) {
                event.id = parseInt(eventId);
                await window.PatelDB.update('events', event);
                Utils.showNotification('Event updated successfully', 'success');
            } else {
                // Otherwise, add new event
                await window.PatelDB.add('events', event);
                Utils.showNotification('Event added successfully', 'success');
            }
            
            // Close form and reload events
            this.closeEventForm();
            await this.loadEvents();
            this.renderCalendar();
            
            // Schedule reminder if needed
            if (reminder !== 'none') {
                this.scheduleReminder(event);
            }
        } catch (error) {
            console.error('Error saving event:', error);
            Utils.showNotification('Error saving event', 'error');
        }
    },
    
    // Edit event
    editEvent: async function(eventId) {
        try {
            const event = await window.PatelDB.get('events', eventId);
            if (event) {
                this.openEventForm(event);
            } else {
                Utils.showNotification('Event not found', 'error');
            }
        } catch (error) {
            console.error('Error editing event:', error);
            Utils.showNotification('Error editing event', 'error');
        }
    },
    
    // Delete event
    deleteEvent: async function(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            try {
                await window.PatelDB.delete('events', eventId);
                Utils.showNotification('Event deleted successfully', 'success');
                await this.loadEvents();
                this.renderCalendar();
            } catch (error) {
                console.error('Error deleting event:', error);
                Utils.showNotification('Error deleting event', 'error');
            }
        }
    },
    
    // Schedule reminder
    scheduleReminder: function(event) {
        if (!Utils.isFeatureSupported('notifications')) {
            console.log('Notifications not supported');
            return;
        }
        
        // Request notification permission if needed
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
        
        // Calculate reminder time
        const reminderMinutes = parseInt(event.reminder);
        if (isNaN(reminderMinutes) || reminderMinutes <= 0) {
            return;
        }
        
        const eventTime = new Date(event.startDate);
        const reminderTime = new Date(eventTime.getTime() - (reminderMinutes * 60 * 1000));
        
        // If reminder time is in the past, don't schedule
        if (reminderTime < new Date()) {
            return;
        }
        
        // Calculate delay in milliseconds
        const delay = reminderTime.getTime() - new Date().getTime();
        
        // Schedule reminder
        setTimeout(() => {
            if (Notification.permission === 'granted') {
                const notification = new Notification(`Event Reminder: ${event.title}`, {
                    body: `Starting in ${reminderMinutes === 60 ? '1 hour' : `${reminderMinutes} minutes`} at ${Utils.formatTime(eventTime)}`,
                    icon: '/assets/logo.svg'
                });
                
                // Vibrate if supported
                if (Utils.isFeatureSupported('vibration')) {
                    navigator.vibrate([200, 100, 200]);
                }
                
                // Play sound
                const audio = new Audio('/assets/notification.mp3');
                audio.play().catch(e => console.log('Error playing notification sound:', e));
            }
        }, delay);
    }
};

// Register module
window['calendarModule'] = calendarModule;
