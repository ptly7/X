/* Finance Tracker Module for Patel Productivity Suite */

const financeModule = {
    // Store DOM elements
    elements: {},
    
    // Finance data
    transactions: [],
    categories: [
        { id: 'income', name: 'Income', type: 'income', color: '#4caf50' },
        { id: 'salary', name: 'Salary', type: 'income', color: '#8bc34a' },
        { id: 'investment', name: 'Investment', type: 'income', color: '#cddc39' },
        { id: 'gift', name: 'Gift', type: 'income', color: '#ffeb3b' },
        { id: 'other_income', name: 'Other Income', type: 'income', color: '#ffc107' },
        
        { id: 'housing', name: 'Housing', type: 'expense', color: '#f44336' },
        { id: 'food', name: 'Food', type: 'expense', color: '#e91e63' },
        { id: 'transportation', name: 'Transportation', type: 'expense', color: '#9c27b0' },
        { id: 'utilities', name: 'Utilities', type: 'expense', color: '#673ab7' },
        { id: 'healthcare', name: 'Healthcare', type: 'expense', color: '#3f51b5' },
        { id: 'entertainment', name: 'Entertainment', type: 'expense', color: '#2196f3' },
        { id: 'shopping', name: 'Shopping', type: 'expense', color: '#03a9f4' },
        { id: 'education', name: 'Education', type: 'expense', color: '#00bcd4' },
        { id: 'personal', name: 'Personal', type: 'expense', color: '#009688' },
        { id: 'other_expense', name: 'Other Expense', type: 'expense', color: '#ff9800' }
    ],
    currentPeriod: {
        year: new Date().getFullYear(),
        month: new Date().getMonth()
    },
    
    // Initialize the module
    init: async function(container) {
        console.log('Initializing Finance module');
        
        // Render the module UI
        this.render(container);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load transactions
        await this.loadTransactions();
        
        // Initialize charts
        this.initCharts();
    },
    
    // Render the module UI
    render: function(container) {
        container.innerHTML = `
            <div class="module-header">
                <h2>Finance Tracker</h2>
                <div class="module-actions">
                    <button id="add-transaction-btn" class="btn primary">Add Transaction</button>
                    <select id="period-select">
                        <option value="current">Current Month</option>
                        <option value="last">Last Month</option>
                        <option value="year">This Year</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>
            
            <div class="finance-container">
                <div class="finance-summary">
                    <div class="summary-card income">
                        <h3>Income</h3>
                        <div id="total-income" class="summary-amount">$0.00</div>
                    </div>
                    <div class="summary-card expense">
                        <h3>Expenses</h3>
                        <div id="total-expense" class="summary-amount">$0.00</div>
                    </div>
                    <div class="summary-card balance">
                        <h3>Balance</h3>
                        <div id="total-balance" class="summary-amount">$0.00</div>
                    </div>
                </div>
                
                <div class="finance-charts">
                    <div class="chart-container">
                        <h3>Expense Breakdown</h3>
                        <canvas id="expense-chart"></canvas>
                    </div>
                    <div class="chart-container">
                        <h3>Monthly Trend</h3>
                        <canvas id="trend-chart"></canvas>
                    </div>
                </div>
                
                <div class="finance-transactions">
                    <h3>Transactions</h3>
                    <div class="transactions-header">
                        <div class="transaction-date">Date</div>
                        <div class="transaction-description">Description</div>
                        <div class="transaction-category">Category</div>
                        <div class="transaction-amount">Amount</div>
                        <div class="transaction-actions">Actions</div>
                    </div>
                    <div id="transactions-list" class="transactions-list">
                        <div class="loading">Loading transactions...</div>
                    </div>
                </div>
            </div>
            
            <!-- Transaction Form Modal -->
            <div id="transaction-form-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3 id="transaction-form-title">Add New Transaction</h3>
                    <form id="transaction-form">
                        <input type="hidden" id="transaction-id">
                        <div class="form-group">
                            <label for="transaction-type">Type</label>
                            <select id="transaction-type" required>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="transaction-amount">Amount</label>
                            <input type="number" id="transaction-amount" step="0.01" min="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="transaction-date">Date</label>
                            <input type="date" id="transaction-date" required>
                        </div>
                        <div class="form-group">
                            <label for="transaction-description">Description</label>
                            <input type="text" id="transaction-description" required>
                        </div>
                        <div class="form-group">
                            <label for="transaction-category">Category</label>
                            <select id="transaction-category" required>
                                <option value="">Select Category</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="transaction-notes">Notes</label>
                            <textarea id="transaction-notes"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" id="transaction-cancel-btn" class="btn">Cancel</button>
                            <button type="submit" id="transaction-save-btn" class="btn primary">Save Transaction</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Store DOM elements
        this.elements = {
            addTransactionBtn: document.getElementById('add-transaction-btn'),
            periodSelect: document.getElementById('period-select'),
            totalIncome: document.getElementById('total-income'),
            totalExpense: document.getElementById('total-expense'),
            totalBalance: document.getElementById('total-balance'),
            transactionsList: document.getElementById('transactions-list'),
            expenseChart: document.getElementById('expense-chart'),
            trendChart: document.getElementById('trend-chart'),
            transactionFormModal: document.getElementById('transaction-form-modal'),
            transactionForm: document.getElementById('transaction-form'),
            transactionFormTitle: document.getElementById('transaction-form-title'),
            transactionId: document.getElementById('transaction-id'),
            transactionType: document.getElementById('transaction-type'),
            transactionAmount: document.getElementById('transaction-amount'),
            transactionDate: document.getElementById('transaction-date'),
            transactionDescription: document.getElementById('transaction-description'),
            transactionCategory: document.getElementById('transaction-category'),
            transactionNotes: document.getElementById('transaction-notes'),
            transactionCancelBtn: document.getElementById('transaction-cancel-btn'),
            transactionSaveBtn: document.getElementById('transaction-save-btn'),
            closeModal: document.querySelector('#transaction-form-modal .close-modal')
        };
        
        // Populate category select
        this.populateCategorySelect();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Add transaction button
        this.elements.addTransactionBtn.addEventListener('click', () => {
            this.openTransactionForm();
        });
        
        // Period select
        this.elements.periodSelect.addEventListener('change', () => {
            this.updatePeriod();
            this.updateUI();
        });
        
        // Close modal
        this.elements.closeModal.addEventListener('click', () => {
            this.closeTransactionForm();
        });
        
        // Cancel button
        this.elements.transactionCancelBtn.addEventListener('click', () => {
            this.closeTransactionForm();
        });
        
        // Transaction form submission
        this.elements.transactionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTransaction();
        });
        
        // Transaction type change
        this.elements.transactionType.addEventListener('change', () => {
            this.populateCategorySelect();
        });
    },
    
    // Load transactions from database
    loadTransactions: async function() {
        try {
            this.transactions = await window.PatelDB.getAll('finances');
            this.updateUI();
        } catch (error) {
            console.error('Error loading transactions:', error);
            this.elements.transactionsList.innerHTML = '<div class="error">Error loading transactions</div>';
        }
    },
    
    // Update UI with current data
    updateUI: function() {
        this.updateSummary();
        this.renderTransactionsList();
        this.updateCharts();
    },
    
    // Update period based on selection
    updatePeriod: function() {
        const now = new Date();
        const periodValue = this.elements.periodSelect.value;
        
        switch (periodValue) {
            case 'current':
                this.currentPeriod = {
                    year: now.getFullYear(),
                    month: now.getMonth()
                };
                break;
            case 'last':
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
                this.currentPeriod = {
                    year: lastMonth.getFullYear(),
                    month: lastMonth.getMonth()
                };
                break;
            case 'year':
                this.currentPeriod = {
                    year: now.getFullYear(),
                    month: null // All months in current year
                };
                break;
            case 'all':
                this.currentPeriod = {
                    year: null, // All years
                    month: null // All months
                };
                break;
        }
    },
    
    // Get filtered transactions for current period
    getFilteredTransactions: function() {
        if (this.currentPeriod.year === null) {
            // All time
            return this.transactions;
        }
        
        return this.transactions.filter(transaction => {
            const date = new Date(transaction.date);
            
            if (this.currentPeriod.month === null) {
                // All months in specific year
                return date.getFullYear() === this.currentPeriod.year;
            } else {
                // Specific month in specific year
                return date.getFullYear() === this.currentPeriod.year && 
                       date.getMonth() === this.currentPeriod.month;
            }
        });
    },
    
    // Update summary with current data
    updateSummary: function() {
        const filteredTransactions = this.getFilteredTransactions();
        
        // Calculate totals
        let totalIncome = 0;
        let totalExpense = 0;
        
        filteredTransactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else {
                totalExpense += transaction.amount;
            }
        });
        
        const balance = totalIncome - totalExpense;
        
        // Update UI
        this.elements.totalIncome.textContent = this.formatCurrency(totalIncome);
        this.elements.totalExpense.textContent = this.formatCurrency(totalExpense);
        this.elements.totalBalance.textContent = this.formatCurrency(balance);
        
        // Add class based on balance
        if (balance >= 0) {
            this.elements.totalBalance.classList.remove('negative');
            this.elements.totalBalance.classList.add('positive');
        } else {
            this.elements.totalBalance.classList.remove('positive');
            this.elements.totalBalance.classList.add('negative');
        }
    },
    
    // Render transactions list
    renderTransactionsList: function() {
        const filteredTransactions = this.getFilteredTransactions();
        
        if (filteredTransactions.length === 0) {
            this.elements.transactionsList.innerHTML = '<div class="empty-state">No transactions for this period</div>';
            return;
        }
        
        // Sort transactions by date (newest first)
        filteredTransactions.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        let html = '';
        
        filteredTransactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const formattedDate = Utils.formatDate(date);
            const category = this.getCategoryById(transaction.category);
            
            html += `
                <div class="transaction-item ${transaction.type}" data-id="${transaction.id}">
                    <div class="transaction-date">${formattedDate}</div>
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-category">
                        <span class="category-dot" style="background-color: ${category ? category.color : '#ccc'}"></span>
                        ${category ? category.name : 'Unknown'}
                    </div>
                    <div class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                    </div>
                    <div class="transaction-actions">
                        <button class="transaction-edit-btn" title="Edit Transaction">✏️</button>
                        <button class="transaction-delete-btn" title="Delete Transaction">🗑️</button>
                    </div>
                </div>
            `;
        });
        
        this.elements.transactionsList.innerHTML = html;
        
        // Add event listeners to transaction items
        document.querySelectorAll('.transaction-item').forEach(item => {
            const transactionId = parseInt(item.getAttribute('data-id'));
            
            // Edit button
            const editBtn = item.querySelector('.transaction-edit-btn');
            editBtn.addEventListener('click', () => {
                this.editTransaction(transactionId);
            });
            
            // Delete button
            const deleteBtn = item.querySelector('.transaction-delete-btn');
            deleteBtn.addEventListener('click', () => {
                this.deleteTransaction(transactionId);
            });
        });
    },
    
    // Initialize charts
    initCharts: function() {
        // Load Chart.js dynamically
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            this.updateCharts();
        };
        document.head.appendChild(script);
    },
    
    // Update charts with current data
    updateCharts: function() {
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.log('Chart.js not loaded yet');
            return;
        }
        
        this.updateExpenseChart();
        this.updateTrendChart();
    },
    
    // Update expense breakdown chart
    updateExpenseChart: function() {
        const filteredTransactions = this.getFilteredTransactions();
        
        // Get expense transactions
        const expenseTransactions = filteredTransactions.filter(transaction => transaction.type === 'expense');
        
        // Group by category
        const expensesByCategory = {};
        
        expenseTransactions.forEach(transaction => {
            const categoryId = transaction.category;
            
            if (!expensesByCategory[categoryId]) {
                expensesByCategory[categoryId] = 0;
            }
            
            expensesByCategory[categoryId] += transaction.amount;
        });
        
        // Prepare chart data
        const labels = [];
        const data = [];
        const backgroundColor = [];
        
        Object.keys(expensesByCategory).forEach(categoryId => {
            const category = this.getCategoryById(categoryId);
            
            if (category) {
                labels.push(category.name);
                data.push(expensesByCategory[categoryId]);
                backgroundColor.push(category.color);
            }
        });
        
        // Create or update chart
        if (this.expenseChart) {
            this.expenseChart.data.labels = labels;
            this.expenseChart.data.datasets[0].data = data;
            this.expenseChart.data.datasets[0].backgroundColor = backgroundColor;
            this.expenseChart.update();
        } else {
            this.expenseChart = new Chart(this.elements.expenseChart, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColor,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right'
                        }
                    }
                }
            });
        }
    },
    
    // Update monthly trend chart
    updateTrendChart: function() {
        // Get all transactions
        const allTransactions = this.transactions;
        
        // Get unique months
        const months = {};
        
        allTransactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            
            if (!months[monthKey]) {
                months[monthKey] = {
                    label: `${Utils.getMonthName(date).substr(0, 3)} ${date.getFullYear()}`,
                    income: 0,
                    expense: 0,
                    timestamp: date.getTime()
                };
            }
            
            if (transaction.type === 'income') {
                months[monthKey].income += transaction.amount;
            } else {
                months[monthKey].expense += transaction.amount;
            }
        });
        
        // Sort months by date
        const sortedMonths = Object.values(months).sort((a, b) => a.timestamp - b.timestamp);
        
        // Limit to last 12 months
        const recentMonths = sortedMonths.slice(-12);
        
        // Prepare chart data
        const labels = recentMonths.map(month => month.label);
        const incomeData = recentMonths.map(month => month.income);
        const expenseData = recentMonths.map(month => month.expense);
        
        // Create or update chart
        if (this.trendChart) {
            this.trendChart.data.labels = labels;
            this.trendChart.data.datasets[0].data = incomeData;
            this.trendChart.data.datasets[1].data = expenseData;
            this.trendChart.update();
        } else {
            this.trendChart = new Chart(this.elements.trendChart, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Income',
                            data: incomeData,
                            backgroundColor: 'rgba(76, 175, 80, 0.7)',
                            borderColor: 'rgba(76, 175, 80, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Expenses',
                            data: expenseData,
                            backgroundColor: 'rgba(244, 67, 54, 0.7)',
                            borderColor: 'rgba(244, 67, 54, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    },
    
    // Populate category select based on transaction type
    populateCategorySelect: function() {
        const type = this.elements.transactionType.value;
        const categories = this.categories.filter(category => category.type === type);
        
        let html = '<option value="">Select Category</option>';
        
        categories.forEach(category => {
            html += `<option value="${category.id}">${category.name}</option>`;
        });
        
        this.elements.transactionCategory.innerHTML = html;
    },
    
    // Open transaction form
    openTransactionForm: function(transaction = null) {
        // Reset form
        this.elements.transactionForm.reset();
        this.elements.transactionId.value = '';
        
        // Set default date to today
        const today = new Date();
        this.elements.transactionDate.value = Utils.formatDate(today);
        
        // If editing a transaction, populate form
        if (transaction) {
            this.elements.transactionFormTitle.textContent = 'Edit Transaction';
            this.elements.transactionId.value = transaction.id;
            this.elements.transactionType.value = transaction.type;
            this.elements.transactionAmount.value = transaction.amount;
            this.elements.transactionDate.value = Utils.formatDate(new Date(transaction.date));
            this.elements.transactionDescription.value = transaction.description;
            
            // Populate category select based on type
            this.populateCategorySelect();
            this.elements.transactionCategory.value = transaction.category;
            
            this.elements.transactionNotes.value = transaction.notes || '';
        } else {
            this.elements.transactionFormTitle.textContent = 'Add New Transaction';
            this.elements.transactionType.value = 'expense'; // Default to expense
            this.populateCategorySelect();
        }
        
        // Open modal
        this.elements.transactionFormModal.classList.add('active');
        this.elements.transactionDescription.focus();
    },
    
    // Close transaction form
    closeTransactionForm: function() {
        this.elements.transactionFormModal.classList.remove('active');
    },
    
    // Save transaction
    saveTransaction: async function() {
        try {
            const transactionId = this.elements.transactionId.value;
            const type = this.elements.transactionType.value;
            const amount = parseFloat(this.elements.transactionAmount.value);
            const date = this.elements.transactionDate.value;
            const description = this.elements.transactionDescription.value.trim();
            const category = this.elements.transactionCategory.value;
            const notes = this.elements.transactionNotes.value.trim();
            
            // Validate inputs
            if (!type || !amount || !date || !description || !category) {
                Utils.showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Create transaction object
            const transaction = {
                type,
                amount,
                date,
                description,
                category,
                notes
            };
            
            // If editing, update transaction
            if (transactionId) {
                transaction.id = parseInt(transactionId);
                await window.PatelDB.update('finances', transaction);
                Utils.showNotification('Transaction updated successfully', 'success');
            } else {
                // Otherwise, add new transaction
                await window.PatelDB.add('finances', transaction);
                Utils.showNotification('Transaction added successfully', 'success');
            }
            
            // Close form and reload transactions
            this.closeTransactionForm();
            await this.loadTransactions();
        } catch (error) {
            console.error('Error saving transaction:', error);
            Utils.showNotification('Error saving transaction', 'error');
        }
    },
    
    // Edit transaction
    editTransaction: async function(transactionId) {
        try {
            const transaction = await window.PatelDB.get('finances', transactionId);
            if (transaction) {
                this.openTransactionForm(transaction);
            } else {
                Utils.showNotification('Transaction not found', 'error');
            }
        } catch (error) {
            console.error('Error editing transaction:', error);
            Utils.showNotification('Error editing transaction', 'error');
        }
    },
    
    // Delete transaction
    deleteTransaction: async function(transactionId) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            try {
                await window.PatelDB.delete('finances', transactionId);
                Utils.showNotification('Transaction deleted successfully', 'success');
                await this.loadTransactions();
            } catch (error) {
                console.error('Error deleting transaction:', error);
                Utils.showNotification('Error deleting transaction', 'error');
            }
        }
    },
    
    // Get category by ID
    getCategoryById: function(categoryId) {
        return this.categories.find(category => category.id === categoryId);
    },
    
    // Format currency
    formatCurrency: function(amount) {
        return '$' + amount.toFixed(2);
    }
};

// Register module
window['financeModule'] = financeModule;
