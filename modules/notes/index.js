/* Note Ninja Module for Patel Productivity Suite */

const notesModule = {
    // Store DOM elements
    elements: {},
    
    // Notes data
    notes: [],
    currentNote: null,
    
    // Initialize the module
    init: async function(container) {
        console.log('Initializing Notes module');
        
        // Render the module UI
        this.render(container);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load notes
        await this.loadNotes();
    },
    
    // Render the module UI
    render: function(container) {
        container.innerHTML = `
            <div class="notes-container">
                <div class="notes-sidebar">
                    <div class="notes-header">
                        <h3>Notes</h3>
                        <button id="new-note-btn" class="btn primary">New Note</button>
                    </div>
                    <div class="notes-search">
                        <input type="text" id="notes-search" placeholder="Search notes...">
                    </div>
                    <div id="notes-list" class="notes-list">
                        <div class="loading">Loading notes...</div>
                    </div>
                </div>
                <div class="notes-content">
                    <div id="note-editor-container" class="note-editor-container">
                        <div class="note-toolbar">
                            <div class="note-info">
                                <span id="note-date" class="note-date"></span>
                            </div>
                            <div class="note-actions">
                                <button id="voice-note-btn" title="Voice Note" class="btn">🎤</button>
                                <button id="save-note-btn" title="Save Note" class="btn primary">Save</button>
                                <button id="delete-note-btn" title="Delete Note" class="btn danger">Delete</button>
                            </div>
                        </div>
                        <input type="text" id="note-title" placeholder="Note Title" class="note-title-input">
                        <div class="note-tags-container">
                            <input type="text" id="note-tags" placeholder="Add tags (comma separated)" class="note-tags-input">
                        </div>
                        <textarea id="note-content" placeholder="Start typing your note here..." class="note-content-input"></textarea>
                    </div>
                    <div id="empty-state" class="empty-state">
                        <div class="empty-state-content">
                            <h3>No Note Selected</h3>
                            <p>Select a note from the sidebar or create a new one.</p>
                            <button id="empty-new-note-btn" class="btn primary">Create New Note</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Store DOM elements
        this.elements = {
            notesList: document.getElementById('notes-list'),
            newNoteBtn: document.getElementById('new-note-btn'),
            emptyNewNoteBtn: document.getElementById('empty-new-note-btn'),
            notesSearch: document.getElementById('notes-search'),
            noteEditorContainer: document.getElementById('note-editor-container'),
            emptyState: document.getElementById('empty-state'),
            noteTitle: document.getElementById('note-title'),
            noteTags: document.getElementById('note-tags'),
            noteContent: document.getElementById('note-content'),
            noteDate: document.getElementById('note-date'),
            voiceNoteBtn: document.getElementById('voice-note-btn'),
            saveNoteBtn: document.getElementById('save-note-btn'),
            deleteNoteBtn: document.getElementById('delete-note-btn')
        };
        
        // Hide editor initially
        this.elements.noteEditorContainer.style.display = 'none';
        this.elements.emptyState.style.display = 'flex';
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // New note button
        this.elements.newNoteBtn.addEventListener('click', () => {
            this.createNewNote();
        });
        
        // Empty state new note button
        this.elements.emptyNewNoteBtn.addEventListener('click', () => {
            this.createNewNote();
        });
        
        // Search notes
        this.elements.notesSearch.addEventListener('input', Utils.debounce(() => {
            this.searchNotes(this.elements.notesSearch.value.trim());
        }, 300));
        
        // Save note button
        this.elements.saveNoteBtn.addEventListener('click', () => {
            this.saveCurrentNote();
        });
        
        // Delete note button
        this.elements.deleteNoteBtn.addEventListener('click', () => {
            this.deleteCurrentNote();
        });
        
        // Voice note button
        this.elements.voiceNoteBtn.addEventListener('click', () => {
            this.startVoiceRecognition();
        });
        
        // Auto-save on input
        this.elements.noteTitle.addEventListener('input', Utils.debounce(() => {
            this.saveCurrentNote();
        }, 1000));
        
        this.elements.noteContent.addEventListener('input', Utils.debounce(() => {
            this.saveCurrentNote();
        }, 1000));
        
        this.elements.noteTags.addEventListener('input', Utils.debounce(() => {
            this.saveCurrentNote();
        }, 1000));
    },
    
    // Load notes from database
    loadNotes: async function() {
        try {
            this.notes = await window.PatelDB.getAll('notes');
            
            // Sort notes by updated date (newest first)
            this.notes.sort((a, b) => {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            });
            
            this.renderNotesList();
        } catch (error) {
            console.error('Error loading notes:', error);
            this.elements.notesList.innerHTML = '<div class="error">Error loading notes</div>';
        }
    },
    
    // Render notes list
    renderNotesList: function() {
        if (this.notes.length === 0) {
            this.elements.notesList.innerHTML = '<div class="empty-state">No notes yet</div>';
            return;
        }
        
        let html = '';
        
        this.notes.forEach(note => {
            const updatedDate = new Date(note.updatedAt);
            const relativeTime = Utils.formatRelativeTime(updatedDate);
            
            html += `
                <div class="note-item ${this.currentNote && this.currentNote.id === note.id ? 'active' : ''}" data-id="${note.id}">
                    <div class="note-item-title">${note.title || 'Untitled Note'}</div>
                    <div class="note-item-preview">${this.getPreview(note.content)}</div>
                    <div class="note-item-meta">
                        <span class="note-item-date">${relativeTime}</span>
                        ${note.tags && note.tags.length > 0 ? `
                            <div class="note-item-tags">
                                ${note.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                                ${note.tags.length > 2 ? `<span class="tag more">+${note.tags.length - 2}</span>` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        this.elements.notesList.innerHTML = html;
        
        // Add click event to note items
        document.querySelectorAll('.note-item').forEach(item => {
            item.addEventListener('click', () => {
                const noteId = parseInt(item.getAttribute('data-id'));
                this.openNote(noteId);
            });
        });
    },
    
    // Get preview of note content
    getPreview: function(content) {
        if (!content) return '';
        
        // Remove HTML tags and limit to 100 characters
        const plainText = content.replace(/<[^>]*>/g, '');
        return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
    },
    
    // Create new note
    createNewNote: function() {
        // Create empty note
        this.currentNote = {
            title: '',
            content: '',
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Show editor
        this.showNoteEditor();
        
        // Clear inputs
        this.elements.noteTitle.value = '';
        this.elements.noteTags.value = '';
        this.elements.noteContent.value = '';
        this.elements.noteDate.textContent = 'Just now';
        
        // Focus title input
        this.elements.noteTitle.focus();
    },
    
    // Open note
    openNote: function(noteId) {
        const note = this.notes.find(note => note.id === noteId);
        
        if (note) {
            this.currentNote = note;
            
            // Show editor
            this.showNoteEditor();
            
            // Populate inputs
            this.elements.noteTitle.value = note.title || '';
            this.elements.noteTags.value = note.tags ? note.tags.join(', ') : '';
            this.elements.noteContent.value = note.content || '';
            this.elements.noteDate.textContent = Utils.formatRelativeTime(new Date(note.updatedAt));
            
            // Update active note in list
            document.querySelectorAll('.note-item').forEach(item => {
                if (parseInt(item.getAttribute('data-id')) === noteId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    },
    
    // Show note editor
    showNoteEditor: function() {
        this.elements.noteEditorContainer.style.display = 'flex';
        this.elements.emptyState.style.display = 'none';
    },
    
    // Save current note
    saveCurrentNote: async function() {
        if (!this.currentNote) return;
        
        try {
            // Get values from inputs
            const title = this.elements.noteTitle.value.trim();
            const content = this.elements.noteContent.value;
            const tagsInput = this.elements.noteTags.value.trim();
            const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];
            
            // Update note object
            this.currentNote.title = title;
            this.currentNote.content = content;
            this.currentNote.tags = tags;
            this.currentNote.updatedAt = new Date().toISOString();
            
            // Save to database
            if (this.currentNote.id) {
                // Update existing note
                await window.PatelDB.update('notes', this.currentNote);
            } else {
                // Add new note
                const id = await window.PatelDB.add('notes', this.currentNote);
                this.currentNote.id = id;
            }
            
            // Update date display
            this.elements.noteDate.textContent = 'Just now';
            
            // Reload notes list
            await this.loadNotes();
            
            // No notification for auto-save
        } catch (error) {
            console.error('Error saving note:', error);
            Utils.showNotification('Error saving note', 'error');
        }
    },
    
    // Delete current note
    deleteCurrentNote: async function() {
        if (!this.currentNote || !this.currentNote.id) return;
        
        if (confirm('Are you sure you want to delete this note?')) {
            try {
                await window.PatelDB.delete('notes', this.currentNote.id);
                Utils.showNotification('Note deleted successfully', 'success');
                
                // Reset current note
                this.currentNote = null;
                
                // Hide editor
                this.elements.noteEditorContainer.style.display = 'none';
                this.elements.emptyState.style.display = 'flex';
                
                // Reload notes list
                await this.loadNotes();
            } catch (error) {
                console.error('Error deleting note:', error);
                Utils.showNotification('Error deleting note', 'error');
            }
        }
    },
    
    // Search notes
    searchNotes: function(query) {
        if (!query) {
            // If query is empty, show all notes
            this.renderNotesList();
            return;
        }
        
        // Filter notes by title, content, and tags
        const filteredNotes = this.notes.filter(note => {
            const title = note.title || '';
            const content = note.content || '';
            const tags = note.tags || [];
            
            // Check if query matches title, content, or tags
            return title.toLowerCase().includes(query.toLowerCase()) ||
                   content.toLowerCase().includes(query.toLowerCase()) ||
                   tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
        });
        
        // Update notes list with filtered notes
        if (filteredNotes.length === 0) {
            this.elements.notesList.innerHTML = '<div class="empty-state">No matching notes</div>';
        } else {
            // Store original notes
            const originalNotes = this.notes;
            
            // Set filtered notes and render
            this.notes = filteredNotes;
            this.renderNotesList();
            
            // Restore original notes
            this.notes = originalNotes;
        }
    },
    
    // Start voice recognition
    startVoiceRecognition: function() {
        if (!Utils.isFeatureSupported('webSpeech')) {
            Utils.showNotification('Speech recognition is not supported in your browser', 'error');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;
        
        recognition.onstart = () => {
            this.elements.voiceNoteBtn.textContent = '🔴';
            Utils.showNotification('Voice recognition started. Speak now...', 'info');
        };
        
        let finalTranscript = '';
        
        recognition.onresult = (event) => {
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Append to current content
            const currentContent = this.elements.noteContent.value;
            this.elements.noteContent.value = currentContent + finalTranscript + interimTranscript;
            
            // Reset final transcript when it's added to content
            if (finalTranscript) {
                finalTranscript = '';
                
                // Auto-save after adding final transcript
                this.saveCurrentNote();
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            Utils.showNotification(`Speech recognition error: ${event.error}`, 'error');
            this.elements.voiceNoteBtn.textContent = '🎤';
        };
        
        recognition.onend = () => {
            this.elements.voiceNoteBtn.textContent = '🎤';
            Utils.showNotification('Voice recognition ended', 'info');
        };
        
        // Start recognition
        recognition.start();
        
        // Stop after 30 seconds
        setTimeout(() => {
            recognition.stop();
        }, 30000);
    }
};

// Register module
window['notesModule'] = notesModule;
