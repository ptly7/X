/* Networking Hub Module for Patel Productivity Suite */

const networkingModule = {
    // Store DOM elements
    elements: {},
    
    // Contacts data
    contacts: [],
    currentContact: null,
    
    // Initialize the module
    init: async function(container) {
        console.log('Initializing Networking Hub module');
        
        // Render the module UI
        this.render(container);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load contacts
        await this.loadContacts();
    },
    
    // Render the module UI
    render: function(container) {
        container.innerHTML = `
            <div class="module-header">
                <h2>Networking Hub</h2>
                <div class="module-actions">
                    <button id="add-contact-btn" class="btn primary">Add Contact</button>
                    <div class="search-container">
                        <input type="text" id="contact-search" placeholder="Search contacts...">
                    </div>
                </div>
            </div>
            
            <div class="networking-container">
                <div class="contacts-sidebar">
                    <div class="contacts-filter">
                        <select id="contacts-filter">
                            <option value="all">All Contacts</option>
                            <option value="recent">Recent Interactions</option>
                            <option value="followup">Need Follow-up</option>
                            <option value="favorites">Favorites</option>
                        </select>
                    </div>
                    <div id="contacts-list" class="contacts-list">
                        <div class="loading">Loading contacts...</div>
                    </div>
                </div>
                
                <div class="contact-details">
                    <div id="contact-view" class="contact-view">
                        <div class="empty-state">
                            <h3>No Contact Selected</h3>
                            <p>Select a contact from the sidebar or add a new one.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Contact Form Modal -->
            <div id="contact-form-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3 id="contact-form-title">Add New Contact</h3>
                    <form id="contact-form">
                        <input type="hidden" id="contact-id">
                        <div class="form-group">
                            <label for="contact-name">Name</label>
                            <input type="text" id="contact-name" required>
                        </div>
                        <div class="form-group">
                            <label for="contact-company">Company</label>
                            <input type="text" id="contact-company">
                        </div>
                        <div class="form-group">
                            <label for="contact-title">Job Title</label>
                            <input type="text" id="contact-title">
                        </div>
                        <div class="form-group">
                            <label for="contact-email">Email</label>
                            <input type="email" id="contact-email">
                        </div>
                        <div class="form-group">
                            <label for="contact-phone">Phone</label>
                            <input type="tel" id="contact-phone">
                        </div>
                        <div class="form-group">
                            <label for="contact-category">Category</label>
                            <select id="contact-category">
                                <option value="professional">Professional</option>
                                <option value="personal">Personal</option>
                                <option value="client">Client</option>
                                <option value="vendor">Vendor</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="contact-notes">Notes</label>
                            <textarea id="contact-notes"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="contact-favorite">Favorite</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="contact-favorite">
                                <span class="toggle-slider"></span>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" id="contact-cancel-btn" class="btn">Cancel</button>
                            <button type="submit" id="contact-save-btn" class="btn primary">Save Contact</button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Interaction Form Modal -->
            <div id="interaction-form-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Add Interaction</h3>
                    <form id="interaction-form">
                        <input type="hidden" id="interaction-contact-id">
                        <div class="form-group">
                            <label for="interaction-type">Type</label>
                            <select id="interaction-type" required>
                                <option value="meeting">Meeting</option>
                                <option value="call">Call</option>
                                <option value="email">Email</option>
                                <option value="message">Message</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="interaction-date">Date</label>
                            <input type="date" id="interaction-date" required>
                        </div>
                        <div class="form-group">
                            <label for="interaction-notes">Notes</label>
                            <textarea id="interaction-notes" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="interaction-followup">Follow-up Needed</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="interaction-followup">
                                <span class="toggle-slider"></span>
                            </div>
                        </div>
                        <div class="form-group" id="followup-date-group" style="display: none;">
                            <label for="interaction-followup-date">Follow-up Date</label>
                            <input type="date" id="interaction-followup-date">
                        </div>
                        <div class="form-actions">
                            <button type="button" id="interaction-cancel-btn" class="btn">Cancel</button>
                            <button type="submit" id="interaction-save-btn" class="btn primary">Save Interaction</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Store DOM elements
        this.elements = {
            addContactBtn: document.getElementById('add-contact-btn'),
            contactSearch: document.getElementById('contact-search'),
            contactsFilter: document.getElementById('contacts-filter'),
            contactsList: document.getElementById('contacts-list'),
            contactView: document.getElementById('contact-view'),
            contactFormModal: document.getElementById('contact-form-modal'),
            contactForm: document.getElementById('contact-form'),
            contactFormTitle: document.getElementById('contact-form-title'),
            contactId: document.getElementById('contact-id'),
            contactName: document.getElementById('contact-name'),
            contactCompany: document.getElementById('contact-company'),
            contactTitle: document.getElementById('contact-title'),
            contactEmail: document.getElementById('contact-email'),
            contactPhone: document.getElementById('contact-phone'),
            contactCategory: document.getElementById('contact-category'),
            contactNotes: document.getElementById('contact-notes'),
            contactFavorite: document.getElementById('contact-favorite'),
            contactCancelBtn: document.getElementById('contact-cancel-btn'),
            contactSaveBtn: document.getElementById('contact-save-btn'),
            contactFormCloseModal: document.querySelector('#contact-form-modal .close-modal'),
            interactionFormModal: document.getElementById('interaction-form-modal'),
            interactionForm: document.getElementById('interaction-form'),
            interactionContactId: document.getElementById('interaction-contact-id'),
            interactionType: document.getElementById('interaction-type'),
            interactionDate: document.getElementById('interaction-date'),
            interactionNotes: document.getElementById('interaction-notes'),
            interactionFollowup: document.getElementById('interaction-followup'),
            followupDateGroup: document.getElementById('followup-date-group'),
            interactionFollowupDate: document.getElementById('interaction-followup-date'),
            interactionCancelBtn: document.getElementById('interaction-cancel-btn'),
            interactionSaveBtn: document.getElementById('interaction-save-btn'),
            interactionFormCloseModal: document.querySelector('#interaction-form-modal .close-modal')
        };
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Add contact button
        this.elements.addContactBtn.addEventListener('click', () => {
            this.openContactForm();
        });
        
        // Contact search
        this.elements.contactSearch.addEventListener('input', Utils.debounce(() => {
            this.searchContacts(this.elements.contactSearch.value.trim());
        }, 300));
        
        // Contacts filter
        this.elements.contactsFilter.addEventListener('change', () => {
            this.filterContacts();
        });
        
        // Close contact form modal
        this.elements.contactFormCloseModal.addEventListener('click', () => {
            this.closeContactForm();
        });
        
        // Cancel contact button
        this.elements.contactCancelBtn.addEventListener('click', () => {
            this.closeContactForm();
        });
        
        // Contact form submission
        this.elements.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContact();
        });
        
        // Close interaction form modal
        this.elements.interactionFormCloseModal.addEventListener('click', () => {
            this.closeInteractionForm();
        });
        
        // Cancel interaction button
        this.elements.interactionCancelBtn.addEventListener('click', () => {
            this.closeInteractionForm();
        });
        
        // Interaction form submission
        this.elements.interactionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveInteraction();
        });
        
        // Follow-up toggle
        this.elements.interactionFollowup.addEventListener('change', () => {
            this.toggleFollowupDate();
        });
    },
    
    // Load contacts from database
    loadContacts: async function() {
        try {
            this.contacts = await window.PatelDB.getAll('contacts');
            this.renderContactsList();
        } catch (error) {
            console.error('Error loading contacts:', error);
            this.elements.contactsList.innerHTML = '<div class="error">Error loading contacts</div>';
        }
    },
    
    // Render contacts list
    renderContactsList: function() {
        // Apply filter
        const filteredContacts = this.filterContactsByType();
        
        if (filteredContacts.length === 0) {
            this.elements.contactsList.innerHTML = '<div class="empty-state">No contacts found</div>';
            return;
        }
        
        // Sort contacts by name
        filteredContacts.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        
        let html = '';
        
        filteredContacts.forEach(contact => {
            const needsFollowup = this.contactNeedsFollowup(contact);
            
            html += `
                <div class="contact-item ${this.currentContact && this.currentContact.id === contact.id ? 'active' : ''}" data-id="${contact.id}">
                    <div class="contact-avatar">
                        ${this.getInitials(contact.name)}
                    </div>
                    <div class="contact-info">
                        <div class="contact-name">
                            ${contact.name}
                            ${contact.favorite ? '<span class="favorite-star">★</span>' : ''}
                        </div>
                        <div class="contact-meta">
                            ${contact.company ? `<span class="contact-company">${contact.company}</span>` : ''}
                            ${contact.title ? `<span class="contact-title">${contact.title}</span>` : ''}
                        </div>
                    </div>
                    ${needsFollowup ? '<div class="followup-indicator">⏰</div>' : ''}
                </div>
            `;
        });
        
        this.elements.contactsList.innerHTML = html;
        
        // Add click event to contact items
        document.querySelectorAll('.contact-item').forEach(item => {
            const contactId = parseInt(item.getAttribute('data-id'));
            
            item.addEventListener('click', () => {
                this.openContact(contactId);
            });
        });
    },
    
    // Filter contacts by type
    filterContactsByType: function() {
        const filterType = this.elements.contactsFilter.value;
        
        if (filterType === 'all') {
            return this.contacts;
        }
        
        return this.contacts.filter(contact => {
            if (filterType === 'favorites') {
                return contact.favorite;
            } else if (filterType === 'followup') {
                return this.contactNeedsFollowup(contact);
            } else if (filterType === 'recent') {
                // Check if there's an interaction in the last 30 days
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                
                return contact.interactions && contact.interactions.some(interaction => {
                    return new Date(interaction.date) >= thirtyDaysAgo;
                });
            }
            
            return true;
        });
    },
    
    // Filter contacts (triggered by filter change)
    filterContacts: function() {
        this.renderContactsList();
    },
    
    // Search contacts
    searchContacts: function(query) {
        if (!query) {
            // If query is empty, show all contacts
            this.renderContactsList();
            return;
        }
        
        // Filter contacts by name, company, title, email, or notes
        const filteredContacts = this.contacts.filter(contact => {
            const searchFields = [
                contact.name,
                contact.company,
                contact.title,
                contact.email,
                contact.notes
            ].filter(field => field); // Remove undefined/null fields
            
            const searchText = searchFields.join(' ').toLowerCase();
            return searchText.includes(query.toLowerCase());
        });
        
        if (filteredContacts.length === 0) {
            this.elements.contactsList.innerHTML = '<div class="empty-state">No matching contacts</div>';
            return;
        }
        
        // Store original contacts
        const originalContacts = this.contacts;
        
        // Set filtered contacts and render
        this.contacts = filteredContacts;
        this.renderContactsList();
        
        // Restore original contacts
        this.contacts = originalContacts;
    },
    
    // Open contact form
    openContactForm: function(contact = null) {
        // Reset form
        this.elements.contactForm.reset();
        this.elements.contactId.value = '';
        
        // If editing a contact, populate form
        if (contact) {
            this.elements.contactFormTitle.textContent = 'Edit Contact';
            this.elements.contactId.value = contact.id;
            this.elements.contactName.value = contact.name;
            this.elements.contactCompany.value = contact.company || '';
            this.elements.contactTitle.value = contact.title || '';
            this.elements.contactEmail.value = contact.email || '';
            this.elements.contactPhone.value = contact.phone || '';
            this.elements.contactCategory.value = contact.category || 'professional';
            this.elements.contactNotes.value = contact.notes || '';
            this.elements.contactFavorite.checked = contact.favorite || false;
        } else {
            this.elements.contactFormTitle.textContent = 'Add New Contact';
        }
        
        // Open modal
        this.elements.contactFormModal.classList.add('active');
        this.elements.contactName.focus();
    },
    
    // Close contact form
    closeContactForm: function() {
        this.elements.contactFormModal.classList.remove('active');
    },
    
    // Save contact
    saveContact: async function() {
        try {
            const contactId = this.elements.contactId.value;
            const name = this.elements.contactName.value.trim();
            const company = this.elements.contactCompany.value.trim();
            const title = this.elements.contactTitle.value.trim();
            const email = this.elements.contactEmail.value.trim();
            const phone = this.elements.contactPhone.value.trim();
            const category = this.elements.contactCategory.value;
            const notes = this.elements.contactNotes.value.trim();
            const favorite = this.elements.contactFavorite.checked;
            
            // Validate name
            if (!name) {
                Utils.showNotification('Contact name is required', 'error');
                return;
            }
            
            // Create contact object
            const contact = {
                name,
                company,
                title,
                email,
                phone,
                category,
                notes,
                favorite,
                interactions: []
            };
            
            // If editing, update contact
            if (contactId) {
                contact.id = parseInt(contactId);
                
                // Preserve existing interactions
                const existingContact = this.contacts.find(c => c.id === contact.id);
                if (existingContact && existingContact.interactions) {
                    contact.interactions = existingContact.interactions;
                }
                
                await window.PatelDB.update('contacts', contact);
                Utils.showNotification('Contact updated successfully', 'success');
                
                // Update current contact if it was edited
                if (this.currentContact && this.currentContact.id === contact.id) {
                    this.currentContact = contact;
                    this.renderContactDetails();
                }
            } else {
                // Otherwise, add new contact
                const id = await window.PatelDB.add('contacts', contact);
                contact.id = id;
                Utils.showNotification('Contact added successfully', 'success');
            }
            
            // Close form and reload contacts
            this.closeContactForm();
            await this.loadContacts();
        } catch (error) {
            console.error('Error saving contact:', error);
            Utils.showNotification('Error saving contact', 'error');
        }
    },
    
    // Open contact
    openContact: function(contactId) {
        const contact = this.contacts.find(c => c.id === contactId);
        
        if (!contact) {
            Utils.showNotification('Contact not found', 'error');
            return;
        }
        
        this.currentContact = contact;
        
        // Update active contact in list
        document.querySelectorAll('.contact-item').forEach(item => {
            if (parseInt(item.getAttribute('data-id')) === contactId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Render contact details
        this.renderContactDetails();
    },
    
    // Render contact details
    renderContactDetails: function() {
        if (!this.currentContact) {
            this.elements.contactView.innerHTML = `
                <div class="empty-state">
                    <h3>No Contact Selected</h3>
                    <p>Select a contact from the sidebar or add a new one.</p>
                </div>
            `;
            return;
        }
        
        const contact = this.currentContact;
        
        let html = `
            <div class="contact-header">
                <div class="contact-avatar large">
                    ${this.getInitials(contact.name)}
                </div>
                <div class="contact-header-info">
                    <h3 class="contact-name">
                        ${contact.name}
                        ${contact.favorite ? '<span class="favorite-star">★</span>' : ''}
                    </h3>
                    <div class="contact-meta">
                        ${contact.title ? `<div class="contact-title">${contact.title}</div>` : ''}
                        ${contact.company ? `<div class="contact-company">${contact.company}</div>` : ''}
                    </div>
                </div>
                <div class="contact-actions">
                    <button id="edit-contact-btn" class="btn">Edit</button>
                    <button id="delete-contact-btn" class="btn danger">Delete</button>
                </div>
            </div>
            
            <div class="contact-body">
                <div class="contact-info-section">
                    <h4>Contact Information</h4>
                    <div class="contact-info-grid">
                        ${contact.email ? `
                            <div class="info-label">Email</div>
                            <div class="info-value">
                                <a href="mailto:${contact.email}" class="contact-link">${contact.email}</a>
                            </div>
                        ` : ''}
                        
                        ${contact.phone ? `
                            <div class="info-label">Phone</div>
                            <div class="info-value">
                                <a href="tel:${contact.phone}" class="contact-link">${contact.phone}</a>
                            </div>
                        ` : ''}
                        
                        ${contact.category ? `
                            <div class="info-label">Category</div>
                            <div class="info-value">${this.formatCategory(contact.category)}</div>
                        ` : ''}
                    </div>
                </div>
                
                ${contact.notes ? `
                    <div class="contact-notes-section">
                        <h4>Notes</h4>
                        <div class="contact-notes">${contact.notes.replace(/\n/g, '<br>')}</div>
                    </div>
                ` : ''}
                
                <div class="contact-interactions-section">
                    <div class="interactions-header">
                        <h4>Interactions</h4>
                        <button id="add-interaction-btn" class="btn">Add Interaction</button>
                    </div>
                    
                    <div id="interactions-list" class="interactions-list">
                        ${this.renderInteractionsList(contact)}
                    </div>
                </div>
            </div>
        `;
        
        this.elements.contactView.innerHTML = html;
        
        // Add event listeners
        document.getElementById('edit-contact-btn').addEventListener('click', () => {
            this.openContactForm(contact);
        });
        
        document.getElementById('delete-contact-btn').addEventListener('click', () => {
            this.deleteContact(contact.id);
        });
        
        document.getElementById('add-interaction-btn').addEventListener('click', () => {
            this.openInteractionForm(contact.id);
        });
        
        // Add event listeners to interaction items
        document.querySelectorAll('.interaction-item').forEach(item => {
            const interactionIndex = parseInt(item.getAttribute('data-index'));
            
            // Delete button
            const deleteBtn = item.querySelector('.interaction-delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.deleteInteraction(contact.id, interactionIndex);
                });
            }
            
            // Toggle follow-up button
            const followupBtn = item.querySelector('.interaction-followup-btn');
            if (followupBtn) {
                followupBtn.addEventListener('click', () => {
                    this.toggleInteractionFollowup(contact.id, interactionIndex);
                });
            }
        });
    },
    
    // Render interactions list
    renderInteractionsList: function(contact) {
        if (!contact.interactions || contact.interactions.length === 0) {
            return '<div class="empty-state">No interactions recorded</div>';
        }
        
        // Sort interactions by date (newest first)
        const sortedInteractions = [...contact.interactions].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        let html = '';
        
        sortedInteractions.forEach((interaction, index) => {
            const date = new Date(interaction.date);
            const formattedDate = Utils.formatDate(date);
            const followupDate = interaction.followupDate ? new Date(interaction.followupDate) : null;
            const followupNeeded = interaction.followup && followupDate && followupDate >= new Date();
            
            html += `
                <div class="interaction-item ${followupNeeded ? 'needs-followup' : ''}" data-index="${index}">
                    <div class="interaction-header">
                        <div class="interaction-type">${this.formatInteractionType(interaction.type)}</div>
                        <div class="interaction-date">${formattedDate}</div>
                        <div class="interaction-actions">
                            <button class="interaction-followup-btn" title="${followupNeeded ? 'Mark Follow-up Complete' : 'Add Follow-up'}">
                                ${followupNeeded ? '⏰' : '⏱️'}
                            </button>
                            <button class="interaction-delete-btn" title="Delete Interaction">🗑️</button>
                        </div>
                    </div>
                    <div class="interaction-notes">${interaction.notes.replace(/\n/g, '<br>')}</div>
                    ${followupNeeded ? `
                        <div class="interaction-followup">
                            <span class="followup-label">Follow-up:</span>
                            <span class="followup-date">${Utils.formatDate(followupDate)}</span>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        return html;
    },
    
    // Open interaction form
    openInteractionForm: function(contactId) {
        // Reset form
        this.elements.interactionForm.reset();
        this.elements.interactionContactId.value = contactId;
        
        // Set default date to today
        const today = new Date();
        this.elements.interactionDate.value = Utils.formatDate(today);
        
        // Set default follow-up date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.elements.interactionFollowupDate.value = Utils.formatDate(tomorrow);
        
        // Hide follow-up date field
        this.elements.followupDateGroup.style.display = 'none';
        
        // Open modal
        this.elements.interactionFormModal.classList.add('active');
        this.elements.interactionType.focus();
    },
    
    // Close interaction form
    closeInteractionForm: function() {
        this.elements.interactionFormModal.classList.remove('active');
    },
    
    // Toggle follow-up date field
    toggleFollowupDate: function() {
        const showFollowupDate = this.elements.interactionFollowup.checked;
        this.elements.followupDateGroup.style.display = showFollowupDate ? 'block' : 'none';
    },
    
    // Save interaction
    saveInteraction: async function() {
        try {
            const contactId = parseInt(this.elements.interactionContactId.value);
            const type = this.elements.interactionType.value;
            const date = this.elements.interactionDate.value;
            const notes = this.elements.interactionNotes.value.trim();
            const followup = this.elements.interactionFollowup.checked;
            const followupDate = followup ? this.elements.interactionFollowupDate.value : null;
            
            // Validate inputs
            if (!type || !date || !notes) {
                Utils.showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Create interaction object
            const interaction = {
                type,
                date,
                notes,
                followup,
                followupDate
            };
            
            // Find contact
            const contact = this.contacts.find(c => c.id === contactId);
            
            if (!contact) {
                Utils.showNotification('Contact not found', 'error');
                return;
            }
            
            // Add interaction to contact
            if (!contact.interactions) {
                contact.interactions = [];
            }
            
            contact.interactions.push(interaction);
            
            // Update contact in database
            await window.PatelDB.update('contacts', contact);
            
            // Update current contact if it was edited
            if (this.currentContact && this.currentContact.id === contactId) {
                this.currentContact = contact;
                this.renderContactDetails();
            }
            
            // Close form and reload contacts
            this.closeInteractionForm();
            await this.loadContacts();
            
            Utils.showNotification('Interaction added successfully', 'success');
        } catch (error) {
            console.error('Error saving interaction:', error);
            Utils.showNotification('Error saving interaction', 'error');
        }
    },
    
    // Delete contact
    deleteContact: async function(contactId) {
        if (confirm('Are you sure you want to delete this contact?')) {
            try {
                await window.PatelDB.delete('contacts', contactId);
                
                // Reset current contact if it was deleted
                if (this.currentContact && this.currentContact.id === contactId) {
                    this.currentContact = null;
                    this.renderContactDetails();
                }
                
                // Reload contacts
                await this.loadContacts();
                
                Utils.showNotification('Contact deleted successfully', 'success');
            } catch (error) {
                console.error('Error deleting contact:', error);
                Utils.showNotification('Error deleting contact', 'error');
            }
        }
    },
    
    // Delete interaction
    deleteInteraction: async function(contactId, interactionIndex) {
        if (confirm('Are you sure you want to delete this interaction?')) {
            try {
                // Find contact
                const contact = this.contacts.find(c => c.id === contactId);
                
                if (!contact || !contact.interactions) {
                    Utils.showNotification('Interaction not found', 'error');
                    return;
                }
                
                // Remove interaction
                contact.interactions.splice(interactionIndex, 1);
                
                // Update contact in database
                await window.PatelDB.update('contacts', contact);
                
                // Update current contact if it was edited
                if (this.currentContact && this.currentContact.id === contactId) {
                    this.currentContact = contact;
                    this.renderContactDetails();
                }
                
                // Reload contacts
                await this.loadContacts();
                
                Utils.showNotification('Interaction deleted successfully', 'success');
            } catch (error) {
                console.error('Error deleting interaction:', error);
                Utils.showNotification('Error deleting interaction', 'error');
            }
        }
    },
    
    // Toggle interaction follow-up
    toggleInteractionFollowup: async function(contactId, interactionIndex) {
        try {
            // Find contact
            const contact = this.contacts.find(c => c.id === contactId);
            
            if (!contact || !contact.interactions) {
                Utils.showNotification('Interaction not found', 'error');
                return;
            }
            
            // Get interaction
            const interaction = contact.interactions[interactionIndex];
            
            if (!interaction) {
                Utils.showNotification('Interaction not found', 'error');
                return;
            }
            
            // Toggle follow-up
            if (interaction.followup) {
                // If follow-up is already set, mark it as complete
                interaction.followup = false;
                interaction.followupDate = null;
                Utils.showNotification('Follow-up marked as complete', 'success');
            } else {
                // If no follow-up, set one for tomorrow
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                
                interaction.followup = true;
                interaction.followupDate = Utils.formatDate(tomorrow);
                Utils.showNotification('Follow-up added', 'success');
            }
            
            // Update contact in database
            await window.PatelDB.update('contacts', contact);
            
            // Update current contact if it was edited
            if (this.currentContact && this.currentContact.id === contactId) {
                this.currentContact = contact;
                this.renderContactDetails();
            }
            
            // Reload contacts
            await this.loadContacts();
        } catch (error) {
            console.error('Error toggling follow-up:', error);
            Utils.showNotification('Error updating follow-up', 'error');
        }
    },
    
    // Check if contact needs follow-up
    contactNeedsFollowup: function(contact) {
        if (!contact.interactions) return false;
        
        const now = new Date();
        
        return contact.interactions.some(interaction => {
            return interaction.followup && 
                   interaction.followupDate && 
                   new Date(interaction.followupDate) >= now;
        });
    },
    
    // Get initials from name
    getInitials: function(name) {
        if (!name) return '?';
        
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    },
    
    // Format category
    formatCategory: function(category) {
        const categories = {
            professional: 'Professional',
            personal: 'Personal',
            client: 'Client',
            vendor: 'Vendor',
            other: 'Other'
        };
        
        return categories[category] || category;
    },
    
    // Format interaction type
    formatInteractionType: function(type) {
        const types = {
            meeting: 'Meeting',
            call: 'Call',
            email: 'Email',
            message: 'Message',
            other: 'Other'
        };
        
        return types[type] || type;
    }
};

// Register module
window['networkingModule'] = networkingModule;
