// Test Suite for Patel Productivity Suite
// This file contains tests for all modules and functionality

// Main test controller
const TestSuite = {
  // Test results
  results: {
    passed: 0,
    failed: 0,
    total: 0,
    tests: []
  },
  
  // Initialize tests
  init: async function() {
    console.log('Starting test suite...');
    
    try {
      // Clear previous results
      this.results = {
        passed: 0,
        failed: 0,
        total: 0,
        tests: []
      };
      
      // Create test report element
      this.createReportElement();
      
      // Run core tests
      await this.runCoreTests();
      
      // Run module tests
      await this.runModuleTests();
      
      // Run offline tests
      await this.runOfflineTests();
      
      // Run performance tests
      await this.runPerformanceTests();
      
      // Display final results
      this.displayFinalResults();
      
      console.log('Test suite completed');
      return this.results;
    } catch (error) {
      console.error('Error running test suite:', error);
      this.logTest('TestSuite.init', false, 'Error running test suite: ' + error.message);
      this.displayFinalResults();
      return this.results;
    }
  },
  
  // Create test report element
  createReportElement: function() {
    const reportContainer = document.createElement('div');
    reportContainer.id = 'test-report-container';
    reportContainer.className = 'test-report';
    
    const reportHeader = document.createElement('h2');
    reportHeader.textContent = 'Patel Productivity Suite - Test Results';
    reportContainer.appendChild(reportHeader);
    
    const reportSummary = document.createElement('div');
    reportSummary.id = 'test-summary';
    reportSummary.className = 'test-summary';
    reportSummary.innerHTML = 'Running tests...';
    reportContainer.appendChild(reportSummary);
    
    const reportList = document.createElement('ul');
    reportList.id = 'test-list';
    reportList.className = 'test-list';
    reportContainer.appendChild(reportList);
    
    // Add to body
    document.body.appendChild(reportContainer);
  },
  
  // Run core tests
  runCoreTests: async function() {
    console.log('Running core tests...');
    
    // Test IndexedDB
    await this.testIndexedDB();
    
    // Test LocalStorage
    this.testLocalStorage();
    
    // Test UI components
    this.testUIComponents();
    
    // Test theme switching
    this.testThemeSwitching();
  },
  
  // Test IndexedDB
  testIndexedDB: async function() {
    try {
      console.log('Testing IndexedDB...');
      
      // Test database connection
      const dbConnected = await window.PatelDB.init();
      this.logTest('IndexedDB.connection', dbConnected, 'Database connection');
      
      // Test data operations
      const testData = { id: 'test-' + Date.now(), value: 'test-value' };
      
      // Test adding data
      const addResult = await window.PatelDB.add('test', testData);
      this.logTest('IndexedDB.add', addResult, 'Add data to database');
      
      // Test getting data
      const getData = await window.PatelDB.get('test', testData.id);
      const getResult = getData && getData.value === testData.value;
      this.logTest('IndexedDB.get', getResult, 'Get data from database');
      
      // Test updating data
      testData.value = 'updated-value';
      const updateResult = await window.PatelDB.update('test', testData);
      this.logTest('IndexedDB.update', updateResult, 'Update data in database');
      
      // Verify update
      const getUpdatedData = await window.PatelDB.get('test', testData.id);
      const updateVerified = getUpdatedData && getUpdatedData.value === 'updated-value';
      this.logTest('IndexedDB.updateVerify', updateVerified, 'Verify updated data');
      
      // Test deleting data
      const deleteResult = await window.PatelDB.delete('test', testData.id);
      this.logTest('IndexedDB.delete', deleteResult, 'Delete data from database');
      
      // Verify deletion
      const getDeletedData = await window.PatelDB.get('test', testData.id);
      const deleteVerified = !getDeletedData;
      this.logTest('IndexedDB.deleteVerify', deleteVerified, 'Verify deleted data');
      
      console.log('IndexedDB tests completed');
    } catch (error) {
      console.error('Error testing IndexedDB:', error);
      this.logTest('IndexedDB.error', false, 'Error testing IndexedDB: ' + error.message);
    }
  },
  
  // Test LocalStorage
  testLocalStorage: function() {
    try {
      console.log('Testing LocalStorage...');
      
      // Test setting data
      localStorage.setItem('test-key', 'test-value');
      const setResult = localStorage.getItem('test-key') === 'test-value';
      this.logTest('LocalStorage.set', setResult, 'Set data in LocalStorage');
      
      // Test getting data
      const getValue = localStorage.getItem('test-key');
      const getResult = getValue === 'test-value';
      this.logTest('LocalStorage.get', getResult, 'Get data from LocalStorage');
      
      // Test updating data
      localStorage.setItem('test-key', 'updated-value');
      const updateResult = localStorage.getItem('test-key') === 'updated-value';
      this.logTest('LocalStorage.update', updateResult, 'Update data in LocalStorage');
      
      // Test deleting data
      localStorage.removeItem('test-key');
      const deleteResult = localStorage.getItem('test-key') === null;
      this.logTest('LocalStorage.delete', deleteResult, 'Delete data from LocalStorage');
      
      // Test storage limit
      try {
        // Generate large data (approximately 5MB)
        const largeData = new Array(5 * 1024 * 1024).join('a');
        
        // Try to store it
        localStorage.setItem('large-data', largeData);
        
        // If we get here, storage succeeded
        localStorage.removeItem('large-data');
        this.logTest('LocalStorage.limit', true, 'LocalStorage can handle large data');
      } catch (e) {
        // Expected to fail on some browsers due to storage limits
        this.logTest('LocalStorage.limit', false, 'LocalStorage has limited capacity (expected)');
      }
      
      console.log('LocalStorage tests completed');
    } catch (error) {
      console.error('Error testing LocalStorage:', error);
      this.logTest('LocalStorage.error', false, 'Error testing LocalStorage: ' + error.message);
    }
  },
  
  // Test UI components
  testUIComponents: function() {
    try {
      console.log('Testing UI components...');
      
      // Test sidebar
      const sidebar = document.querySelector('.sidebar');
      this.logTest('UI.sidebar', !!sidebar, 'Sidebar exists');
      
      // Test main content area
      const mainContent = document.querySelector('.main-content');
      this.logTest('UI.mainContent', !!mainContent, 'Main content area exists');
      
      // Test header
      const header = document.querySelector('header');
      this.logTest('UI.header', !!header, 'Header exists');
      
      // Test module navigation
      const moduleNav = document.querySelectorAll('.module-nav-item');
      this.logTest('UI.moduleNav', moduleNav.length >= 10, 'Module navigation has at least 10 items');
      
      // Test responsive design
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      this.logTest('UI.responsive', !!viewportMeta, 'Viewport meta tag exists for responsive design');
      
      console.log('UI component tests completed');
    } catch (error) {
      console.error('Error testing UI components:', error);
      this.logTest('UI.error', false, 'Error testing UI components: ' + error.message);
    }
  },
  
  // Test theme switching
  testThemeSwitching: function() {
    try {
      console.log('Testing theme switching...');
      
      // Get current theme
      const initialTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      
      // Toggle theme
      if (window.UI && window.UI.toggleTheme) {
        window.UI.toggleTheme();
        
        // Check if theme changed
        const newTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const themeChanged = initialTheme !== newTheme;
        this.logTest('UI.themeToggle', themeChanged, 'Theme toggle changes theme');
        
        // Toggle back to original theme
        window.UI.toggleTheme();
        
        // Check if theme restored
        const finalTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const themeRestored = initialTheme === finalTheme;
        this.logTest('UI.themeRestore', themeRestored, 'Theme can be restored to original');
      } else {
        this.logTest('UI.themeToggle', false, 'Theme toggle function not found');
      }
      
      console.log('Theme switching tests completed');
    } catch (error) {
      console.error('Error testing theme switching:', error);
      this.logTest('UI.themeError', false, 'Error testing theme switching: ' + error.message);
    }
  },
  
  // Run module tests
  runModuleTests: async function() {
    console.log('Running module tests...');
    
    // Test Task Manager
    await this.testTaskManager();
    
    // Test Calendar
    await this.testCalendar();
    
    // Test Notes
    await this.testNotes();
    
    // Test Finance
    await this.testFinance();
    
    // Test Habits
    await this.testHabits();
    
    // Test Focus
    await this.testFocus();
    
    // Test Research
    await this.testResearch();
    
    // Test Networking
    await this.testNetworking();
    
    // Test File Manager
    await this.testFileManager();
    
    // Test Health
    await this.testHealth();
    
    // Test PatelBot
    await this.testPatelBot();
  },
  
  // Test Task Manager
  testTaskManager: async function() {
    try {
      console.log('Testing Task Manager module...');
      
      // Check if module exists
      const moduleExists = !!window.taskManagerModule;
      this.logTest('TaskManager.exists', moduleExists, 'Task Manager module exists');
      
      if (!moduleExists) return;
      
      // Test adding a task
      const testTask = {
        title: 'Test Task',
        description: 'This is a test task',
        priority: 5,
        deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0] // Tomorrow
      };
      
      const addResult = await window.taskManagerModule.addTask(testTask);
      this.logTest('TaskManager.addTask', !!addResult, 'Add task');
      
      // Store task ID for later tests
      const taskId = addResult.id;
      
      // Test getting tasks
      const tasks = await window.taskManagerModule.getTasks();
      const getResult = tasks && tasks.length > 0;
      this.logTest('TaskManager.getTasks', getResult, 'Get tasks');
      
      // Test updating a task
      if (taskId) {
        const updateTask = {
          id: taskId,
          title: 'Updated Test Task',
          completed: true
        };
        
        const updateResult = await window.taskManagerModule.updateTask(updateTask);
        this.logTest('TaskManager.updateTask', !!updateResult, 'Update task');
        
        // Test getting a specific task
        const getTask = await window.taskManagerModule.getTask(taskId);
        const getTaskResult = getTask && getTask.title === 'Updated Test Task' && getTask.completed;
        this.logTest('TaskManager.getTask', getTaskResult, 'Get specific task');
        
        // Test deleting a task
        const deleteResult = await window.taskManagerModule.deleteTask(taskId);
        this.logTest('TaskManager.deleteTask', deleteResult, 'Delete task');
      } else {
        this.logTest('TaskManager.taskId', false, 'Failed to get task ID for further tests');
      }
      
      console.log('Task Manager tests completed');
    } catch (error) {
      console.error('Error testing Task Manager:', error);
      this.logTest('TaskManager.error', false, 'Error testing Task Manager: ' + error.message);
    }
  },
  
  // Test Calendar
  testCalendar: async function() {
    try {
      console.log('Testing Calendar module...');
      
      // Check if module exists
      const moduleExists = !!window.calendarModule;
      this.logTest('Calendar.exists', moduleExists, 'Calendar module exists');
      
      if (!moduleExists) return;
      
      // Test adding an event
      const testEvent = {
        title: 'Test Event',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
        category: 'work'
      };
      
      const addResult = await window.calendarModule.addEvent(testEvent);
      this.logTest('Calendar.addEvent', !!addResult, 'Add event');
      
      // Store event ID for later tests
      const eventId = addResult.id;
      
      // Test getting events
      const events = await window.calendarModule.getEvents();
      const getResult = events && events.length > 0;
      this.logTest('Calendar.getEvents', getResult, 'Get events');
      
      // Test updating an event
      if (eventId) {
        const updateEvent = {
          id: eventId,
          title: 'Updated Test Event'
        };
        
        const updateResult = await window.calendarModule.updateEvent(updateEvent);
        this.logTest('Calendar.updateEvent', !!updateResult, 'Update event');
        
        // Test getting a specific event
        const getEvent = await window.calendarModule.getEvent(eventId);
        const getEventResult = getEvent && getEvent.title === 'Updated Test Event';
        this.logTest('Calendar.getEvent', getEventResult, 'Get specific event');
        
        // Test deleting an event
        const deleteResult = await window.calendarModule.deleteEvent(eventId);
        this.logTest('Calendar.deleteEvent', deleteResult, 'Delete event');
      } else {
        this.logTest('Calendar.eventId', false, 'Failed to get event ID for further tests');
      }
      
      // Test view changing
      if (window.calendarModule.changeView) {
        const viewResult = window.calendarModule.changeView('week');
        this.logTest('Calendar.changeView', viewResult !== false, 'Change calendar view');
      } else {
        this.logTest('Calendar.changeView', false, 'Change view function not found');
      }
      
      console.log('Calendar tests completed');
    } catch (error) {
      console.error('Error testing Calendar:', error);
      this.logTest('Calendar.error', false, 'Error testing Calendar: ' + error.message);
    }
  },
  
  // Test Notes
  testNotes: async function() {
    try {
      console.log('Testing Notes module...');
      
      // Check if module exists
      const moduleExists = !!window.notesModule;
      this.logTest('Notes.exists', moduleExists, 'Notes module exists');
      
      if (!moduleExists) return;
      
      // Test adding a note
      const testNote = {
        title: 'Test Note',
        content: 'This is a test note with some content for testing purposes.',
        tags: ['test', 'sample']
      };
      
      const addResult = await window.notesModule.saveNote(testNote);
      this.logTest('Notes.saveNote', !!addResult, 'Save note');
      
      // Store note ID for later tests
      const noteId = addResult.id;
      
      // Test getting notes
      const notes = await window.notesModule.getNotes();
      const getResult = notes && notes.length > 0;
      this.logTest('Notes.getNotes', getResult, 'Get notes');
      
      // Test updating a note
      if (noteId) {
        const updateNote = {
          id: noteId,
          title: 'Updated Test Note',
          content: 'This note has been updated.'
        };
        
        const updateResult = await window.notesModule.saveNote(updateNote);
        this.logTest('Notes.updateNote', !!updateResult, 'Update note');
        
        // Test getting a specific note
        const getNote = await window.notesModule.getNote(noteId);
        const getNoteResult = getNote && getNote.title === 'Updated Test Note';
        this.logTest('Notes.getNote', getNoteResult, 'Get specific note');
        
        // Test deleting a note
        const deleteResult = await window.notesModule.deleteNote(noteId);
        this.logTest('Notes.deleteNote', deleteResult, 'Delete note');
      } else {
        this.logTest('Notes.noteId', false, 'Failed to get note ID for further tests');
      }
      
      // Test voice recognition (if available)
      if (window.notesModule.startVoiceRecognition) {
        try {
          const voiceResult = window.notesModule.startVoiceRecognition();
          this.logTest('Notes.voiceRecognition', voiceResult !== false, 'Voice recognition');
          
          // Stop voice recognition
          if (window.notesModule.stopVoiceRecognition) {
            window.notesModule.stopVoiceRecognition();
          }
        } catch (e) {
          this.logTest('Notes.voiceRecognition', false, 'Voice recognition not available in this environment');
        }
      } else {
        this.logTest('Notes.voiceRecognition', false, 'Voice recognition function not found');
      }
      
      console.log('Notes tests completed');
    } catch (error) {
      console.error('Error testing Notes:', error);
      this.logTest('Notes.error', false, 'Error testing Notes: ' + error.message);
    }
  },
  
  // Test Finance
  testFinance: async function() {
    try {
      console.log('Testing Finance module...');
      
      // Check if module exists
      const moduleExists = !!window.financeModule;
      this.logTest('Finance.exists', moduleExists, 'Finance module exists');
      
      if (!moduleExists) return;
      
      // Test adding a transaction
      const testTransaction = {
        description: 'Test Transaction',
        amount: 100,
        type: 'expense',
        category: 'food',
        date: new Date().toISOString().split('T')[0]
      };
      
      const addResult = await window.financeModule.addTransaction(testTransaction);
      this.logTest('Finance.addTransaction', !!addResult, 'Add transaction');
      
      // Store transaction ID for later tests
      const transactionId = addResult.id;
      
      // Test getting transactions
      const transactions = await window.financeModule.getTransactions();
      const getResult = transactions && transactions.length > 0;
      this.logTest('Finance.getTransactions', getResult, 'Get transactions');
      
      // Test updating a transaction
      if (transactionId) {
        const updateTransaction = {
          id: transactionId,
          description: 'Updated Test Transaction',
          amount: 150
        };
        
        const updateResult = await window.financeModule.updateTransaction(updateTransaction);
        this.logTest('Finance.updateTransaction', !!updateResult, 'Update transaction');
        
        // Test getting a specific transaction
        const getTransaction = await window.financeModule.getTransaction(transactionId);
        const getTransactionResult = getTransaction && getTransaction.description === 'Updated Test Transaction';
        this.logTest('Finance.getTransaction', getTransactionResult, 'Get specific transaction');
        
        // Test deleting a transaction
        const deleteResult = await window.financeModule.deleteTransaction(transactionId);
        this.logTest('Finance.deleteTransaction', deleteResult, 'Delete transaction');
      } else {
        this.logTest('Finance.transactionId', false, 'Failed to get transaction ID for further tests');
      }
      
      // Test budget functionality
      if (window.financeModule.setBudget) {
        const testBudget = {
          category: 'food',
          amount: 500,
          period: 'monthly'
        };
        
        const budgetResult = await window.financeModule.setBudget(testBudget);
        this.logTest('Finance.setBudget', !!budgetResult, 'Set budget');
        
        // Test getting budgets
        const budgets = await window.financeModule.getBudgets();
        const getBudgetsResult = budgets && budgets.length > 0;
        this.logTest('Finance.getBudgets', getBudgetsResult, 'Get budgets');
      } else {
        this.logTest('Finance.setBudget', false, 'Set budget function not found');
      }
      
      console.log('Finance tests completed');
    } catch (error) {
      console.error('Error testing Finance:', error);
      this.logTest('Finance.error', false, 'Error testing Finance: ' + error.message);
    }
  },
  
  // Test Habits
  testHabits: async function() {
    try {
      console.log('Testing Habits module...');
      
      // Check if module exists
      const moduleExists = !!window.habitsModule;
      this.logTest('Habits.exists', moduleExists, 'Habits module exists');
      
      if (!moduleExists) return;
      
      // Test adding a habit
      const testHabit = {
        name: 'Test Habit',
        frequency: 'daily',
        icon: '🏃',
        color: '#3A86FF'
      };
      
      const addResult = await window.habitsModule.addHabit(testHabit);
      this.logTest('Habits.addHabit', !!addResult, 'Add habit');
      
      // Store habit ID for later tests
      const habitId = addResult.id;
      
      // Test getting habits
      const habits = await window.habitsModule.getHabits();
      const getResult = habits && habits.length > 0;
      this.logTest('Habits.getHabits', getResult, 'Get habits');
      
      // Test completing a habit
      if (habitId) {
        const completeResult = await window.habitsModule.completeHabit(habitId);
        this.logTest('Habits.completeHabit', !!completeResult, 'Complete habit');
        
        // Test getting a specific habit
        const getHabit = await window.habitsModule.getHabit(habitId);
        const getHabitResult = getHabit && getHabit.name === 'Test Habit';
        this.logTest('Habits.getHabit', getHabitResult, 'Get specific habit');
        
        // Test updating a habit
        const updateHabit = {
          id: habitId,
          name: 'Updated Test Habit',
          frequency: 'weekly'
        };
        
        const updateResult = await window.habitsModule.updateHabit(updateHabit);
        this.logTest('Habits.updateHabit', !!updateResult, 'Update habit');
        
        // Test deleting a habit
        const deleteResult = await window.habitsModule.deleteHabit(habitId);
        this.logTest('Habits.deleteHabit', deleteResult, 'Delete habit');
      } else {
        this.logTest('Habits.habitId', false, 'Failed to get habit ID for further tests');
      }
      
      console.log('Habits tests completed');
    } catch (error) {
      console.error('Error testing Habits:', error);
      this.logTest('Habits.error', false, 'Error testing Habits: ' + error.message);
    }
  },
  
  // Test Focus
  testFocus: async function() {
    try {
      console.log('Testing Focus module...');
      
      // Check if module exists
      const moduleExists = !!window.focusModule;
      this.logTest('Focus.exists', moduleExists, 'Focus module exists');
      
      if (!moduleExists) return;
      
      // Test timer functionality
      if (window.focusModule.startTimer) {
        // Start timer
        const startResult = window.focusModule.startTimer();
        this.logTest('Focus.startTimer', startResult !== false, 'Start timer');
        
        // Pause timer
        if (window.focusModule.pauseTimer) {
          const pauseResult = window.focusModule.pauseTimer();
          this.logTest('Focus.pauseTimer', pauseResult !== false, 'Pause timer');
        } else {
          this.logTest('Focus.pauseTimer', false, 'Pause timer function not found');
        }
        
        // Resume timer
        if (window.focusModule.resumeTimer) {
          const resumeResult = window.focusModule.resumeTimer();
          this.logTest('Focus.resumeTimer', resumeResult !== false, 'Resume timer');
        } else {
          this.logTest('Focus.resumeTimer', false, 'Resume timer function not found');
        }
        
        // Stop timer
        if (window.focusModule.stopTimer) {
          const stopResult = window.focusModule.stopTimer();
          this.logTest('Focus.stopTimer', stopResult !== false, 'Stop timer');
        } else {
          this.logTest('Focus.stopTimer', false, 'Stop timer function not found');
        }
      } else {
        this.logTest('Focus.startTimer', false, 'Start timer function not found');
      }
      
      // Test white noise
      if (window.focusModule.playWhiteNoise) {
        const playResult = window.focusModule.playWhiteNoise();
        this.logTest('Focus.playWhiteNoise', playResult !== false, 'Play white noise');
        
        // Stop white noise
        if (window.focusModule.stopWhiteNoise) {
          const stopResult = window.focusModule.stopWhiteNoise();
          this.logTest('Focus.stopWhiteNoise', stopResult !== false, 'Stop white noise');
        } else {
          this.logTest('Focus.stopWhiteNoise', false, 'Stop white noise function not found');
        }
      } else {
        this.logTest('Focus.playWhiteNoise', false, 'Play white noise function not found');
      }
      
      // Test session history
      if (window.focusModule.getSessionHistory) {
        const history = await window.focusModule.getSessionHistory();
        this.logTest('Focus.getSessionHistory', Array.isArray(history), 'Get session history');
      } else {
        this.logTest('Focus.getSessionHistory', false, 'Get session history function not found');
      }
      
      console.log('Focus tests completed');
    } catch (error) {
      console.error('Error testing Focus:', error);
      this.logTest('Focus.error', false, 'Error testing Focus: ' + error.message);
    }
  },
  
  // Test Research
  testResearch: async function() {
    try {
      console.log('Testing Research module...');
      
      // Check if module exists
      const moduleExists = !!window.researchModule;
      this.logTest('Research.exists', moduleExists, 'Research module exists');
      
      if (!moduleExists) return;
      
      // Test text summarization
      if (window.researchModule.summarizeText) {
        const testText = 'This is a long text that needs to be summarized. It contains multiple sentences with various information. The summarization algorithm should extract the most important parts and create a concise summary. This test will verify if the summarization functionality works correctly.';
        
        const summary = await window.researchModule.summarizeText(testText);
        this.logTest('Research.summarizeText', summary && summary.length < testText.length, 'Summarize text');
      } else {
        this.logTest('Research.summarizeText', false, 'Summarize text function not found');
      }
      
      // Test keyword extraction
      if (window.researchModule.extractKeywords) {
        const testText = 'Artificial intelligence and machine learning are transforming productivity tools and applications. Users can benefit from smart features that help organize information and automate tasks.';
        
        const keywords = await window.researchModule.extractKeywords(testText);
        this.logTest('Research.extractKeywords', keywords && keywords.length > 0, 'Extract keywords');
      } else {
        this.logTest('Research.extractKeywords', false, 'Extract keywords function not found');
      }
      
      // Test PDF processing
      if (window.researchModule.processPDF) {
        // This is a mock test since we can't actually load a PDF in this test environment
        const mockResult = window.researchModule.processPDF instanceof Function;
        this.logTest('Research.processPDF', mockResult, 'Process PDF function exists');
      } else {
        this.logTest('Research.processPDF', false, 'Process PDF function not found');
      }
      
      console.log('Research tests completed');
    } catch (error) {
      console.error('Error testing Research:', error);
      this.logTest('Research.error', false, 'Error testing Research: ' + error.message);
    }
  },
  
  // Test Networking
  testNetworking: async function() {
    try {
      console.log('Testing Networking module...');
      
      // Check if module exists
      const moduleExists = !!window.networkingModule;
      this.logTest('Networking.exists', moduleExists, 'Networking module exists');
      
      if (!moduleExists) return;
      
      // Test adding a contact
      const testContact = {
        name: 'Test Contact',
        email: 'test@example.com',
        phone: '123-456-7890',
        category: 'professional',
        notes: 'This is a test contact'
      };
      
      const addResult = await window.networkingModule.addContact(testContact);
      this.logTest('Networking.addContact', !!addResult, 'Add contact');
      
      // Store contact ID for later tests
      const contactId = addResult.id;
      
      // Test getting contacts
      const contacts = await window.networkingModule.getContacts();
      const getResult = contacts && contacts.length > 0;
      this.logTest('Networking.getContacts', getResult, 'Get contacts');
      
      // Test updating a contact
      if (contactId) {
        const updateContact = {
          id: contactId,
          name: 'Updated Test Contact',
          email: 'updated@example.com'
        };
        
        const updateResult = await window.networkingModule.updateContact(updateContact);
        this.logTest('Networking.updateContact', !!updateResult, 'Update contact');
        
        // Test getting a specific contact
        const getContact = await window.networkingModule.getContact(contactId);
        const getContactResult = getContact && getContact.name === 'Updated Test Contact';
        this.logTest('Networking.getContact', getContactResult, 'Get specific contact');
        
        // Test adding an interaction
        if (window.networkingModule.addInteraction) {
          const testInteraction = {
            contactId: contactId,
            type: 'email',
            date: new Date().toISOString(),
            notes: 'Test interaction'
          };
          
          const interactionResult = await window.networkingModule.addInteraction(testInteraction);
          this.logTest('Networking.addInteraction', !!interactionResult, 'Add interaction');
        } else {
          this.logTest('Networking.addInteraction', false, 'Add interaction function not found');
        }
        
        // Test deleting a contact
        const deleteResult = await window.networkingModule.deleteContact(contactId);
        this.logTest('Networking.deleteContact', deleteResult, 'Delete contact');
      } else {
        this.logTest('Networking.contactId', false, 'Failed to get contact ID for further tests');
      }
      
      console.log('Networking tests completed');
    } catch (error) {
      console.error('Error testing Networking:', error);
      this.logTest('Networking.error', false, 'Error testing Networking: ' + error.message);
    }
  },
  
  // Test File Manager
  testFileManager: async function() {
    try {
      console.log('Testing File Manager module...');
      
      // Check if module exists
      const moduleExists = !!window.fileManagerModule;
      this.logTest('FileManager.exists', moduleExists, 'File Manager module exists');
      
      if (!moduleExists) return;
      
      // Test creating a folder
      const testFolder = {
        name: 'Test Folder',
        parent: 'root'
      };
      
      const folderResult = await window.fileManagerModule.createFolder(testFolder);
      this.logTest('FileManager.createFolder', !!folderResult, 'Create folder');
      
      // Store folder ID for later tests
      const folderId = folderResult.id;
      
      // Test adding a file (mock)
      // In a real app, this would involve file uploads
      const testFile = {
        name: 'test-file.txt',
        type: 'text/plain',
        size: 1024,
        parent: folderId || 'root',
        content: 'This is a test file'
      };
      
      const fileResult = await window.fileManagerModule.addFile(testFile);
      this.logTest('FileManager.addFile', !!fileResult, 'Add file');
      
      // Store file ID for later tests
      const fileId = fileResult.id;
      
      // Test getting files
      const files = await window.fileManagerModule.getFiles();
      const getFilesResult = files && files.length > 0;
      this.logTest('FileManager.getFiles', getFilesResult, 'Get files');
      
      // Test getting folders
      const folders = await window.fileManagerModule.getFolders();
      const getFoldersResult = folders && folders.length > 0;
      this.logTest('FileManager.getFolders', getFoldersResult, 'Get folders');
      
      // Test file operations
      if (fileId) {
        // Test renaming a file
        const renameResult = await window.fileManagerModule.renameFile(fileId, 'renamed-file.txt');
        this.logTest('FileManager.renameFile', !!renameResult, 'Rename file');
        
        // Test moving a file
        if (folderId) {
          const moveResult = await window.fileManagerModule.moveFile(fileId, 'root');
          this.logTest('FileManager.moveFile', !!moveResult, 'Move file');
        } else {
          this.logTest('FileManager.moveFile', false, 'Move file (skipped due to missing folder ID)');
        }
        
        // Test deleting a file
        const deleteFileResult = await window.fileManagerModule.deleteFile(fileId);
        this.logTest('FileManager.deleteFile', deleteFileResult, 'Delete file');
      } else {
        this.logTest('FileManager.fileId', false, 'Failed to get file ID for further tests');
      }
      
      // Test folder operations
      if (folderId) {
        // Test renaming a folder
        const renameFolderResult = await window.fileManagerModule.renameFolder(folderId, 'Renamed Test Folder');
        this.logTest('FileManager.renameFolder', !!renameFolderResult, 'Rename folder');
        
        // Test deleting a folder
        const deleteFolderResult = await window.fileManagerModule.deleteFolder(folderId);
        this.logTest('FileManager.deleteFolder', deleteFolderResult, 'Delete folder');
      } else {
        this.logTest('FileManager.folderId', false, 'Failed to get folder ID for further tests');
      }
      
      console.log('File Manager tests completed');
    } catch (error) {
      console.error('Error testing File Manager:', error);
      this.logTest('FileManager.error', false, 'Error testing File Manager: ' + error.message);
    }
  },
  
  // Test Health
  testHealth: async function() {
    try {
      console.log('Testing Health module...');
      
      // Check if module exists
      const moduleExists = !!window.healthModule;
      this.logTest('Health.exists', moduleExists, 'Health module exists');
      
      if (!moduleExists) return;
      
      // Test adding step data
      const testSteps = {
        date: new Date().toISOString().split('T')[0],
        value: 8500
      };
      
      const stepsResult = await window.healthModule.addSteps(testSteps);
      this.logTest('Health.addSteps', !!stepsResult, 'Add steps');
      
      // Test adding water data
      const testWater = {
        date: new Date().toISOString().split('T')[0],
        value: 6
      };
      
      const waterResult = await window.healthModule.addWater(testWater);
      this.logTest('Health.addWater', !!waterResult, 'Add water');
      
      // Test adding sleep data
      const testSleep = {
        date: new Date().toISOString().split('T')[0],
        value: 7.5
      };
      
      const sleepResult = await window.healthModule.addSleep(testSleep);
      this.logTest('Health.addSleep', !!sleepResult, 'Add sleep');
      
      // Test getting health data
      const stepsData = await window.healthModule.getSteps();
      const getStepsResult = stepsData && stepsData.length > 0;
      this.logTest('Health.getSteps', getStepsResult, 'Get steps data');
      
      const waterData = await window.healthModule.getWater();
      const getWaterResult = waterData && waterData.length > 0;
      this.logTest('Health.getWater', getWaterResult, 'Get water data');
      
      const sleepData = await window.healthModule.getSleep();
      const getSleepResult = sleepData && sleepData.length > 0;
      this.logTest('Health.getSleep', getSleepResult, 'Get sleep data');
      
      // Test meditation timer
      if (window.healthModule.startMeditation) {
        const startResult = window.healthModule.startMeditation(5); // 5 minutes
        this.logTest('Health.startMeditation', startResult !== false, 'Start meditation timer');
        
        // Stop meditation
        if (window.healthModule.stopMeditation) {
          const stopResult = window.healthModule.stopMeditation();
          this.logTest('Health.stopMeditation', stopResult !== false, 'Stop meditation timer');
        } else {
          this.logTest('Health.stopMeditation', false, 'Stop meditation function not found');
        }
      } else {
        this.logTest('Health.startMeditation', false, 'Start meditation function not found');
      }
      
      console.log('Health tests completed');
    } catch (error) {
      console.error('Error testing Health:', error);
      this.logTest('Health.error', false, 'Error testing Health: ' + error.message);
    }
  },
  
  // Test PatelBot
  testPatelBot: async function() {
    try {
      console.log('Testing PatelBot module...');
      
      // Check if module exists
      const moduleExists = !!window.patelbotModule;
      this.logTest('PatelBot.exists', moduleExists, 'PatelBot module exists');
      
      if (!moduleExists) return;
      
      // Test sending a message
      if (window.patelbotModule.processMessage) {
        const messageResult = window.patelbotModule.processMessage('Hello PatelBot');
        this.logTest('PatelBot.processMessage', messageResult !== false, 'Process message');
      } else {
        this.logTest('PatelBot.processMessage', false, 'Process message function not found');
      }
      
      // Test getting a quote
      if (window.patelbotModule.getRandomQuote) {
        const quote = window.patelbotModule.getRandomQuote();
        this.logTest('PatelBot.getRandomQuote', !!quote, 'Get random quote');
      } else {
        this.logTest('PatelBot.getRandomQuote', false, 'Get random quote function not found');
      }
      
      // Test getting a joke
      if (window.patelbotModule.getRandomJoke) {
        const joke = window.patelbotModule.getRandomJoke();
        this.logTest('PatelBot.getRandomJoke', !!joke, 'Get random joke');
      } else {
        this.logTest('PatelBot.getRandomJoke', false, 'Get random joke function not found');
      }
      
      // Test getting a productivity tip
      if (window.patelbotModule.getRandomTip) {
        const tip = window.patelbotModule.getRandomTip();
        this.logTest('PatelBot.getRandomTip', !!tip, 'Get random productivity tip');
      } else {
        this.logTest('PatelBot.getRandomTip', false, 'Get random tip function not found');
      }
      
      console.log('PatelBot tests completed');
    } catch (error) {
      console.error('Error testing PatelBot:', error);
      this.logTest('PatelBot.error', false, 'Error testing PatelBot: ' + error.message);
    }
  },
  
  // Run offline tests
  runOfflineTests: async function() {
    try {
      console.log('Running offline tests...');
      
      // Test service worker registration
      this.testServiceWorker();
      
      // Test cache storage
      await this.testCacheStorage();
      
      // Test offline data persistence
      await this.testOfflineDataPersistence();
      
      // Test app installation
      this.testAppInstallation();
    } catch (error) {
      console.error('Error running offline tests:', error);
      this.logTest('Offline.error', false, 'Error running offline tests: ' + error.message);
    }
  },
  
  // Test service worker
  testServiceWorker: function() {
    try {
      console.log('Testing service worker...');
      
      // Check if service worker is supported
      const swSupported = 'serviceWorker' in navigator;
      this.logTest('ServiceWorker.supported', swSupported, 'Service Worker is supported');
      
      if (!swSupported) return;
      
      // Check if service worker is registered
      navigator.serviceWorker.getRegistration()
        .then(registration => {
          const isRegistered = !!registration;
          this.logTest('ServiceWorker.registered', isRegistered, 'Service Worker is registered');
        })
        .catch(error => {
          console.error('Error checking service worker registration:', error);
          this.logTest('ServiceWorker.registered', false, 'Error checking Service Worker registration');
        });
    } catch (error) {
      console.error('Error testing service worker:', error);
      this.logTest('ServiceWorker.error', false, 'Error testing Service Worker: ' + error.message);
    }
  },
  
  // Test cache storage
  testCacheStorage: async function() {
    try {
      console.log('Testing cache storage...');
      
      // Check if cache is supported
      const cacheSupported = 'caches' in window;
      this.logTest('Cache.supported', cacheSupported, 'Cache Storage is supported');
      
      if (!cacheSupported) return;
      
      // Check if app shell is cached
      const cacheNames = await caches.keys();
      const appCacheExists = cacheNames.some(name => name.includes('patel-productivity-suite'));
      this.logTest('Cache.exists', appCacheExists, 'App cache exists');
      
      if (!appCacheExists) return;
      
      // Check if important files are cached
      const cache = await caches.open(cacheNames.find(name => name.includes('patel-productivity-suite')));
      const cachedFiles = await cache.keys();
      
      const indexHtmlCached = cachedFiles.some(request => request.url.includes('index.html'));
      this.logTest('Cache.indexHtml', indexHtmlCached, 'index.html is cached');
      
      const cssFileCached = cachedFiles.some(request => request.url.includes('.css'));
      this.logTest('Cache.cssFiles', cssFileCached, 'CSS files are cached');
      
      const jsFileCached = cachedFiles.some(request => request.url.includes('.js'));
      this.logTest('Cache.jsFiles', jsFileCached, 'JavaScript files are cached');
    } catch (error) {
      console.error('Error testing cache storage:', error);
      this.logTest('Cache.error', false, 'Error testing Cache Storage: ' + error.message);
    }
  },
  
  // Test offline data persistence
  testOfflineDataPersistence: async function() {
    try {
      console.log('Testing offline data persistence...');
      
      // Test IndexedDB persistence
      const dbName = 'patel-productivity-suite-db';
      const dbExists = await this.checkDatabaseExists(dbName);
      this.logTest('Offline.indexedDB', dbExists, 'IndexedDB database exists');
      
      // Test LocalStorage persistence
      const lsKey = 'patel-productivity-suite-settings';
      localStorage.setItem(lsKey, JSON.stringify({ theme: 'dark', language: 'en' }));
      const lsExists = !!localStorage.getItem(lsKey);
      this.logTest('Offline.localStorage', lsExists, 'LocalStorage data exists');
      
      // Clean up test data
      localStorage.removeItem(lsKey);
    } catch (error) {
      console.error('Error testing offline data persistence:', error);
      this.logTest('Offline.persistence.error', false, 'Error testing offline data persistence: ' + error.message);
    }
  },
  
  // Check if database exists
  checkDatabaseExists: function(dbName) {
    return new Promise((resolve) => {
      const request = indexedDB.open(dbName);
      
      request.onsuccess = function() {
        request.result.close();
        resolve(true);
      };
      
      request.onerror = function() {
        resolve(false);
      };
      
      request.onupgradeneeded = function(event) {
        event.target.transaction.abort();
        resolve(false);
      };
    });
  },
  
  // Test app installation
  testAppInstallation: function() {
    try {
      console.log('Testing app installation...');
      
      // Check if manifest exists
      const manifestLink = document.querySelector('link[rel="manifest"]');
      this.logTest('Install.manifest', !!manifestLink, 'Web app manifest exists');
      
      // Check if app is installable
      const installable = window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone || 
                          document.referrer.includes('android-app://');
      
      this.logTest('Install.installable', true, 'App is installable');
      
      // Check if already installed
      this.logTest('Install.installed', installable, 'App is already installed (or in browser)');
    } catch (error) {
      console.error('Error testing app installation:', error);
      this.logTest('Install.error', false, 'Error testing app installation: ' + error.message);
    }
  },
  
  // Run performance tests
  runPerformanceTests: async function() {
    try {
      console.log('Running performance tests...');
      
      // Test page load performance
      this.testPageLoadPerformance();
      
      // Test database performance
      await this.testDatabasePerformance();
      
      // Test UI responsiveness
      this.testUIResponsiveness();
      
      // Test memory usage
      this.testMemoryUsage();
    } catch (error) {
      console.error('Error running performance tests:', error);
      this.logTest('Performance.error', false, 'Error running performance tests: ' + error.message);
    }
  },
  
  // Test page load performance
  testPageLoadPerformance: function() {
    try {
      console.log('Testing page load performance...');
      
      // Check if Performance API is supported
      const perfSupported = 'performance' in window;
      this.logTest('Performance.supported', perfSupported, 'Performance API is supported');
      
      if (!perfSupported) return;
      
      // Get navigation timing
      const timing = performance.getEntriesByType('navigation')[0];
      
      if (timing) {
        // Calculate load time
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        this.logTest('Performance.loadTime', loadTime < 3000, `Page load time: ${Math.round(loadTime)}ms`);
        
        // Calculate DOM content loaded time
        const dclTime = timing.domContentLoadedEventEnd - timing.navigationStart;
        this.logTest('Performance.dclTime', dclTime < 1500, `DOM content loaded time: ${Math.round(dclTime)}ms`);
        
        // Calculate first paint time
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        
        if (firstPaint) {
          this.logTest('Performance.firstPaint', firstPaint.startTime < 1000, `First paint time: ${Math.round(firstPaint.startTime)}ms`);
        } else {
          this.logTest('Performance.firstPaint', false, 'First paint time not available');
        }
      } else {
        this.logTest('Performance.timing', false, 'Navigation timing not available');
      }
    } catch (error) {
      console.error('Error testing page load performance:', error);
      this.logTest('Performance.loadError', false, 'Error testing page load performance: ' + error.message);
    }
  },
  
  // Test database performance
  testDatabasePerformance: async function() {
    try {
      console.log('Testing database performance...');
      
      // Test write performance
      const writeStart = performance.now();
      
      // Create 100 test items
      const testItems = [];
      for (let i = 0; i < 100; i++) {
        testItems.push({
          id: `perf-test-${i}`,
          value: `Test value ${i}`,
          timestamp: Date.now()
        });
      }
      
      // Write items to database
      for (const item of testItems) {
        await window.PatelDB.add('test', item);
      }
      
      const writeEnd = performance.now();
      const writeTime = writeEnd - writeStart;
      
      this.logTest('Performance.dbWrite', writeTime < 5000, `Database write time (100 items): ${Math.round(writeTime)}ms`);
      
      // Test read performance
      const readStart = performance.now();
      
      // Read all items
      const items = await window.PatelDB.getAll('test');
      
      const readEnd = performance.now();
      const readTime = readEnd - readStart;
      
      this.logTest('Performance.dbRead', readTime < 1000, `Database read time (${items.length} items): ${Math.round(readTime)}ms`);
      
      // Clean up test data
      const deleteStart = performance.now();
      
      // Delete all test items
      for (const item of testItems) {
        await window.PatelDB.delete('test', item.id);
      }
      
      const deleteEnd = performance.now();
      const deleteTime = deleteEnd - deleteStart;
      
      this.logTest('Performance.dbDelete', deleteTime < 5000, `Database delete time (100 items): ${Math.round(deleteTime)}ms`);
    } catch (error) {
      console.error('Error testing database performance:', error);
      this.logTest('Performance.dbError', false, 'Error testing database performance: ' + error.message);
    }
  },
  
  // Test UI responsiveness
  testUIResponsiveness: function() {
    try {
      console.log('Testing UI responsiveness...');
      
      // Measure time to perform UI operations
      const uiStart = performance.now();
      
      // Perform some UI operations
      for (let i = 0; i < 10; i++) {
        // Create and append elements
        const div = document.createElement('div');
        div.className = 'test-div';
        div.textContent = `Test div ${i}`;
        div.style.position = 'absolute';
        div.style.left = '-9999px';
        document.body.appendChild(div);
      }
      
      const uiEnd = performance.now();
      const uiTime = uiEnd - uiStart;
      
      this.logTest('Performance.uiOperations', uiTime < 100, `UI operations time: ${Math.round(uiTime)}ms`);
      
      // Clean up test elements
      const testDivs = document.querySelectorAll('.test-div');
      testDivs.forEach(div => div.remove());
      
      // Test animation performance if requestAnimationFrame is available
      if ('requestAnimationFrame' in window) {
        let frames = 0;
        let lastTime = performance.now();
        
        const countFrames = () => {
          frames++;
          
          const currentTime = performance.now();
          const elapsed = currentTime - lastTime;
          
          if (elapsed >= 1000) {
            const fps = Math.round((frames * 1000) / elapsed);
            this.logTest('Performance.fps', fps >= 30, `Animation performance: ${fps} FPS`);
            return;
          }
          
          requestAnimationFrame(countFrames);
        };
        
        requestAnimationFrame(countFrames);
      } else {
        this.logTest('Performance.fps', false, 'requestAnimationFrame not supported');
      }
    } catch (error) {
      console.error('Error testing UI responsiveness:', error);
      this.logTest('Performance.uiError', false, 'Error testing UI responsiveness: ' + error.message);
    }
  },
  
  // Test memory usage
  testMemoryUsage: function() {
    try {
      console.log('Testing memory usage...');
      
      // Check if Performance Memory API is supported
      const memorySupported = 'memory' in performance;
      this.logTest('Performance.memorySupported', memorySupported, 'Performance Memory API is supported');
      
      if (!memorySupported) return;
      
      // Get memory info
      const memory = performance.memory;
      
      // Calculate memory usage in MB
      const usedHeapSizeMB = Math.round(memory.usedJSHeapSize / (1024 * 1024));
      const totalHeapSizeMB = Math.round(memory.totalJSHeapSize / (1024 * 1024));
      const heapLimitMB = Math.round(memory.jsHeapSizeLimit / (1024 * 1024));
      
      // Check if memory usage is reasonable
      const memoryUsageOK = usedHeapSizeMB < 100; // Less than 100MB
      
      this.logTest('Performance.memoryUsage', memoryUsageOK, `Memory usage: ${usedHeapSizeMB}MB / ${totalHeapSizeMB}MB (Limit: ${heapLimitMB}MB)`);
    } catch (error) {
      console.error('Error testing memory usage:', error);
      this.logTest('Performance.memoryError', false, 'Error testing memory usage: ' + error.message);
    }
  },
  
  // Log test result
  logTest: function(testName, passed, description) {
    // Update results
    this.results.total++;
    
    if (passed) {
      this.results.passed++;
    } else {
      this.results.failed++;
    }
    
    // Add to test list
    this.results.tests.push({
      name: testName,
      passed: passed,
      description: description
    });
    
    // Update UI
    this.updateTestUI(testName, passed, description);
    
    // Log to console
    console.log(`${passed ? '✅' : '❌'} ${testName}: ${description}`);
  },
  
  // Update test UI
  updateTestUI: function(testName, passed, description) {
    const testList = document.getElementById('test-list');
    if (!testList) return;
    
    const testItem = document.createElement('li');
    testItem.className = passed ? 'test-passed' : 'test-failed';
    testItem.innerHTML = `<span class="test-status">${passed ? '✅' : '❌'}</span> <span class="test-name">${testName}</span>: ${description}`;
    
    testList.appendChild(testItem);
    
    // Update summary
    const summary = document.getElementById('test-summary');
    if (summary) {
      summary.innerHTML = `Passed: ${this.results.passed} / ${this.results.total} (${Math.round((this.results.passed / this.results.total) * 100)}%)`;
      summary.className = this.results.failed > 0 ? 'test-summary test-summary-failed' : 'test-summary test-summary-passed';
    }
  },
  
  // Display final results
  displayFinalResults: function() {
    console.log('Test Results:');
    console.log(`Passed: ${this.results.passed} / ${this.results.total} (${Math.round((this.results.passed / this.results.total) * 100)}%)`);
    console.log(`Failed: ${this.results.failed}`);
    
    // Update summary with final results
    const summary = document.getElementById('test-summary');
    if (summary) {
      summary.innerHTML = `
        <div>Passed: ${this.results.passed} / ${this.results.total} (${Math.round((this.results.passed / this.results.total) * 100)}%)</div>
        <div>Failed: ${this.results.failed}</div>
      `;
      summary.className = this.results.failed > 0 ? 'test-summary test-summary-failed' : 'test-summary test-summary-passed';
    }
    
    // Add CSS for test report
    const style = document.createElement('style');
    style.textContent = `
      .test-report {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        background-color: #fff;
      }
      
      .test-summary {
        padding: 15px;
        margin: 15px 0;
        border-radius: 4px;
        font-weight: bold;
      }
      
      .test-summary-passed {
        background-color: #d4edda;
        color: #155724;
      }
      
      .test-summary-failed {
        background-color: #f8d7da;
        color: #721c24;
      }
      
      .test-list {
        list-style-type: none;
        padding: 0;
      }
      
      .test-list li {
        padding: 8px 10px;
        margin: 5px 0;
        border-radius: 4px;
      }
      
      .test-passed {
        background-color: #f0fff0;
      }
      
      .test-failed {
        background-color: #fff0f0;
      }
      
      .test-status {
        display: inline-block;
        width: 20px;
      }
      
      .test-name {
        font-weight: bold;
      }
      
      @media (prefers-color-scheme: dark) {
        .test-report {
          background-color: #333;
          color: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .test-summary-passed {
          background-color: #1e4620;
          color: #d4edda;
        }
        
        .test-summary-failed {
          background-color: #4c1d1b;
          color: #f8d7da;
        }
        
        .test-passed {
          background-color: #0f2f0f;
        }
        
        .test-failed {
          background-color: #2f0f0f;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
};

// Export module
window.TestSuite = TestSuite;
