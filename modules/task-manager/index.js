/* Task Manager Module for Patel Productivity Suite */

const taskManagerModule = {
    // Store DOM elements
    elements: {},
    
    // Initialize the module
    init: async function(container) {
        console.log('Initializing Task Manager module');
        
        // Render the module UI
        this.render(container);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load tasks
        await this.loadTasks();
    },
    
    // Render the module UI
    render: function(container) {
        container.innerHTML = `
            <div class="module-header">
                <h2>Smart Task Manager</h2>
                <div class="module-actions">
                    <button id="add-task-btn" class="btn primary">Add Task</button>
                    <select id="task-filter">
                        <option value="all">All Tasks</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="today">Due Today</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
            </div>
            
            <div class="task-container">
                <div id="tasks-list" class="tasks-list">
                    <div class="loading">Loading tasks...</div>
                </div>
            </div>
            
            <!-- Task Form Modal -->
            <div id="task-form-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3 id="task-form-title">Add New Task</h3>
                    <form id="task-form">
                        <input type="hidden" id="task-id">
                        <div class="form-group">
                            <label for="task-title">Title</label>
                            <input type="text" id="task-title" required>
                        </div>
                        <div class="form-group">
                            <label for="task-description">Description</label>
                            <textarea id="task-description"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="task-due-date">Due Date</label>
                            <input type="date" id="task-due-date">
                        </div>
                        <div class="form-group">
                            <label for="task-priority">Priority</label>
                            <select id="task-priority">
                                <option value="3">High</option>
                                <option value="2" selected>Medium</option>
                                <option value="1">Low</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="task-tags">Tags (comma separated)</label>
                            <input type="text" id="task-tags">
                        </div>
                        <div class="form-actions">
                            <button type="button" id="task-cancel-btn" class="btn">Cancel</button>
                            <button type="submit" id="task-save-btn" class="btn primary">Save Task</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Store DOM elements
        this.elements = {
            tasksList: document.getElementById('tasks-list'),
            addTaskBtn: document.getElementById('add-task-btn'),
            taskFilter: document.getElementById('task-filter'),
            taskFormModal: document.getElementById('task-form-modal'),
            taskForm: document.getElementById('task-form'),
            taskFormTitle: document.getElementById('task-form-title'),
            taskId: document.getElementById('task-id'),
            taskTitle: document.getElementById('task-title'),
            taskDescription: document.getElementById('task-description'),
            taskDueDate: document.getElementById('task-due-date'),
            taskPriority: document.getElementById('task-priority'),
            taskTags: document.getElementById('task-tags'),
            taskCancelBtn: document.getElementById('task-cancel-btn'),
            taskSaveBtn: document.getElementById('task-save-btn'),
            closeModal: document.querySelector('#task-form-modal .close-modal')
        };
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Add task button
        this.elements.addTaskBtn.addEventListener('click', () => {
            this.openTaskForm();
        });
        
        // Task filter
        this.elements.taskFilter.addEventListener('change', () => {
            this.loadTasks();
        });
        
        // Close modal
        this.elements.closeModal.addEventListener('click', () => {
            this.closeTaskForm();
        });
        
        // Cancel button
        this.elements.taskCancelBtn.addEventListener('click', () => {
            this.closeTaskForm();
        });
        
        // Task form submission
        this.elements.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });
    },
    
    // Load tasks from database
    loadTasks: async function() {
        try {
            // Get all tasks
            let tasks = await window.PatelDB.getAll('tasks');
            
            // Apply filter
            const filter = this.elements.taskFilter.value;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (filter !== 'all') {
                tasks = tasks.filter(task => {
                    const dueDate = new Date(task.dueDate);
                    dueDate.setHours(0, 0, 0, 0);
                    
                    switch (filter) {
                        case 'active':
                            return !task.completed;
                        case 'completed':
                            return task.completed;
                        case 'today':
                            return dueDate.getTime() === today.getTime() && !task.completed;
                        case 'upcoming':
                            return dueDate > today && !task.completed;
                        case 'overdue':
                            return dueDate < today && !task.completed;
                        default:
                            return true;
                    }
                });
            }
            
            // Sort tasks by priority (high to low) and due date (earliest first)
            tasks.sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1; // Incomplete tasks first
                }
                if (a.priority !== b.priority) {
                    return b.priority - a.priority; // Higher priority first
                }
                return new Date(a.dueDate) - new Date(b.dueDate); // Earlier due date first
            });
            
            // Render tasks
            this.renderTasks(tasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.elements.tasksList.innerHTML = '<div class="error">Error loading tasks</div>';
        }
    },
    
    // Render tasks
    renderTasks: function(tasks) {
        if (tasks.length === 0) {
            this.elements.tasksList.innerHTML = '<div class="empty-state">No tasks found</div>';
            return;
        }
        
        let html = '';
        
        tasks.forEach(task => {
            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            const isPastDue = dueDate && Utils.isPast(dueDate) && !Utils.isToday(dueDate) && !task.completed;
            const isToday = dueDate && Utils.isToday(dueDate);
            
            html += `
                <div class="task-item ${task.completed ? 'completed' : ''} ${isPastDue ? 'past-due' : ''}" data-id="${task.id}">
                    <div class="task-checkbox">
                        <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                        <label for="task-${task.id}"></label>
                    </div>
                    <div class="task-content">
                        <div class="task-title">${task.title}</div>
                        ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                        <div class="task-meta">
                            ${dueDate ? `<span class="task-due-date ${isPastDue ? 'past-due' : ''} ${isToday ? 'today' : ''}">
                                ${isToday ? 'Today' : Utils.formatDate(dueDate)}
                            </span>` : ''}
                            ${task.tags && task.tags.length > 0 ? `
                                <div class="task-tags">
                                    ${task.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="task-priority priority-${task.priority}"></div>
                    <div class="task-actions">
                        <button class="task-edit-btn" title="Edit Task">✏️</button>
                        <button class="task-delete-btn" title="Delete Task">🗑️</button>
                    </div>
                </div>
            `;
        });
        
        this.elements.tasksList.innerHTML = html;
        
        // Add event listeners to task items
        document.querySelectorAll('.task-item').forEach(item => {
            const taskId = parseInt(item.getAttribute('data-id'));
            
            // Checkbox
            const checkbox = item.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                this.toggleTaskCompletion(taskId, checkbox.checked);
            });
            
            // Edit button
            const editBtn = item.querySelector('.task-edit-btn');
            editBtn.addEventListener('click', () => {
                this.editTask(taskId);
            });
            
            // Delete button
            const deleteBtn = item.querySelector('.task-delete-btn');
            deleteBtn.addEventListener('click', () => {
                this.deleteTask(taskId);
            });
        });
    },
    
    // Open task form
    openTaskForm: function(task = null) {
        // Reset form
        this.elements.taskForm.reset();
        this.elements.taskId.value = '';
        
        // Set default due date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.elements.taskDueDate.value = Utils.formatDate(tomorrow);
        
        // If editing a task, populate form
        if (task) {
            this.elements.taskFormTitle.textContent = 'Edit Task';
            this.elements.taskId.value = task.id;
            this.elements.taskTitle.value = task.title;
            this.elements.taskDescription.value = task.description || '';
            this.elements.taskDueDate.value = task.dueDate ? Utils.formatDate(new Date(task.dueDate)) : '';
            this.elements.taskPriority.value = task.priority;
            this.elements.taskTags.value = task.tags ? task.tags.join(', ') : '';
        } else {
            this.elements.taskFormTitle.textContent = 'Add New Task';
        }
        
        // Open modal
        this.elements.taskFormModal.classList.add('active');
        this.elements.taskTitle.focus();
    },
    
    // Close task form
    closeTaskForm: function() {
        this.elements.taskFormModal.classList.remove('active');
    },
    
    // Save task
    saveTask: async function() {
        try {
            const taskId = this.elements.taskId.value;
            const title = this.elements.taskTitle.value.trim();
            const description = this.elements.taskDescription.value.trim();
            const dueDate = this.elements.taskDueDate.value;
            const priority = parseInt(this.elements.taskPriority.value);
            const tagsInput = this.elements.taskTags.value.trim();
            const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];
            
            // Validate title
            if (!title) {
                Utils.showNotification('Task title is required', 'error');
                return;
            }
            
            // Create task object
            const task = {
                title,
                description,
                dueDate,
                priority,
                tags,
                completed: false
            };
            
            // If editing, update task
            if (taskId) {
                task.id = parseInt(taskId);
                task.completed = (await window.PatelDB.get('tasks', task.id)).completed;
                await window.PatelDB.update('tasks', task);
                Utils.showNotification('Task updated successfully', 'success');
            } else {
                // Otherwise, add new task
                await window.PatelDB.add('tasks', task);
                Utils.showNotification('Task added successfully', 'success');
            }
            
            // Close form and reload tasks
            this.closeTaskForm();
            await this.loadTasks();
        } catch (error) {
            console.error('Error saving task:', error);
            Utils.showNotification('Error saving task', 'error');
        }
    },
    
    // Edit task
    editTask: async function(taskId) {
        try {
            const task = await window.PatelDB.get('tasks', taskId);
            if (task) {
                this.openTaskForm(task);
            } else {
                Utils.showNotification('Task not found', 'error');
            }
        } catch (error) {
            console.error('Error editing task:', error);
            Utils.showNotification('Error editing task', 'error');
        }
    },
    
    // Delete task
    deleteTask: async function(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await window.PatelDB.delete('tasks', taskId);
                Utils.showNotification('Task deleted successfully', 'success');
                await this.loadTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
                Utils.showNotification('Error deleting task', 'error');
            }
        }
    },
    
    // Toggle task completion
    toggleTaskCompletion: async function(taskId, completed) {
        try {
            const task = await window.PatelDB.get('tasks', taskId);
            if (task) {
                task.completed = completed;
                await window.PatelDB.update('tasks', task);
                Utils.showNotification(`Task marked as ${completed ? 'completed' : 'incomplete'}`, 'success');
                await this.loadTasks();
            } else {
                Utils.showNotification('Task not found', 'error');
            }
        } catch (error) {
            console.error('Error updating task completion:', error);
            Utils.showNotification('Error updating task', 'error');
        }
    }
};

// Register module
window['task-managerModule'] = taskManagerModule;
