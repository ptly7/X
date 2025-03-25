/* AI Research Assistant Module for Patel Productivity Suite */

const researchModule = {
    // Store DOM elements
    elements: {},
    
    // Research data
    documents: [],
    currentDocument: null,
    
    // Initialize the module
    init: async function(container) {
        console.log('Initializing Research Assistant module');
        
        // Render the module UI
        this.render(container);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load documents
        await this.loadDocuments();
        
        // Initialize TensorFlow.js
        this.initTensorFlow();
    },
    
    // Render the module UI
    render: function(container) {
        container.innerHTML = `
            <div class="module-header">
                <h2>AI Research Assistant</h2>
                <div class="module-actions">
                    <button id="upload-document-btn" class="btn primary">Upload Document</button>
                    <input type="file" id="document-file-input" accept=".txt,.pdf,.docx,.md" style="display: none;">
                </div>
            </div>
            
            <div class="research-container">
                <div class="documents-sidebar">
                    <div class="documents-header">
                        <h3>Documents</h3>
                        <div class="search-container">
                            <input type="text" id="document-search" placeholder="Search documents...">
                        </div>
                    </div>
                    <div id="documents-list" class="documents-list">
                        <div class="loading">Loading documents...</div>
                    </div>
                </div>
                
                <div class="document-content">
                    <div id="document-view" class="document-view">
                        <div class="empty-state">
                            <h3>No Document Selected</h3>
                            <p>Select a document from the sidebar or upload a new one.</p>
                        </div>
                    </div>
                    
                    <div class="ai-tools">
                        <h3>AI Tools</h3>
                        <div class="ai-tools-container">
                            <div class="ai-tool">
                                <h4>Summarize</h4>
                                <p>Generate a concise summary of the document.</p>
                                <button id="summarize-btn" class="btn" disabled>Summarize</button>
                            </div>
                            <div class="ai-tool">
                                <h4>Extract Key Points</h4>
                                <p>Extract the most important points from the document.</p>
                                <button id="extract-btn" class="btn" disabled>Extract</button>
                            </div>
                            <div class="ai-tool">
                                <h4>Generate Questions</h4>
                                <p>Generate questions based on the document content.</p>
                                <button id="questions-btn" class="btn" disabled>Generate</button>
                            </div>
                        </div>
                        
                        <div class="ai-output-container">
                            <h4>AI Output</h4>
                            <div id="ai-output" class="ai-output">
                                <div class="empty-state">
                                    <p>Use the AI tools to analyze your document.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Processing Modal -->
            <div id="processing-modal" class="modal">
                <div class="modal-content">
                    <h3>Processing Document</h3>
                    <div class="processing-animation">
                        <div class="spinner"></div>
                    </div>
                    <p id="processing-message">Please wait while we process your document...</p>
                </div>
            </div>
        `;
        
        // Store DOM elements
        this.elements = {
            uploadBtn: document.getElementById('upload-document-btn'),
            fileInput: document.getElementById('document-file-input'),
            documentSearch: document.getElementById('document-search'),
            documentsList: document.getElementById('documents-list'),
            documentView: document.getElementById('document-view'),
            summarizeBtn: document.getElementById('summarize-btn'),
            extractBtn: document.getElementById('extract-btn'),
            questionsBtn: document.getElementById('questions-btn'),
            aiOutput: document.getElementById('ai-output'),
            processingModal: document.getElementById('processing-modal'),
            processingMessage: document.getElementById('processing-message')
        };
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Upload button
        this.elements.uploadBtn.addEventListener('click', () => {
            this.elements.fileInput.click();
        });
        
        // File input
        this.elements.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.uploadDocument(e.target.files[0]);
            }
        });
        
        // Document search
        this.elements.documentSearch.addEventListener('input', Utils.debounce(() => {
            this.searchDocuments(this.elements.documentSearch.value.trim());
        }, 300));
        
        // AI tool buttons
        this.elements.summarizeBtn.addEventListener('click', () => {
            this.summarizeDocument();
        });
        
        this.elements.extractBtn.addEventListener('click', () => {
            this.extractKeyPoints();
        });
        
        this.elements.questionsBtn.addEventListener('click', () => {
            this.generateQuestions();
        });
    },
    
    // Load documents from database
    loadDocuments: async function() {
        try {
            this.documents = await window.PatelDB.getAll('documents');
            this.renderDocumentsList();
        } catch (error) {
            console.error('Error loading documents:', error);
            this.elements.documentsList.innerHTML = '<div class="error">Error loading documents</div>';
        }
    },
    
    // Render documents list
    renderDocumentsList: function() {
        if (this.documents.length === 0) {
            this.elements.documentsList.innerHTML = '<div class="empty-state">No documents yet</div>';
            return;
        }
        
        // Sort documents by date (newest first)
        this.documents.sort((a, b) => {
            return new Date(b.uploadDate) - new Date(a.uploadDate);
        });
        
        let html = '';
        
        this.documents.forEach(doc => {
            const date = new Date(doc.uploadDate);
            const formattedDate = Utils.formatDate(date);
            
            html += `
                <div class="document-item ${this.currentDocument && this.currentDocument.id === doc.id ? 'active' : ''}" data-id="${doc.id}">
                    <div class="document-icon">${this.getDocumentIcon(doc.type)}</div>
                    <div class="document-info">
                        <div class="document-title">${doc.title}</div>
                        <div class="document-meta">
                            <span class="document-date">${formattedDate}</span>
                            <span class="document-size">${this.formatFileSize(doc.size)}</span>
                        </div>
                    </div>
                    <div class="document-actions">
                        <button class="document-delete-btn" title="Delete Document">🗑️</button>
                    </div>
                </div>
            `;
        });
        
        this.elements.documentsList.innerHTML = html;
        
        // Add click event to document items
        document.querySelectorAll('.document-item').forEach(item => {
            const docId = parseInt(item.getAttribute('data-id'));
            
            item.addEventListener('click', (e) => {
                // Ignore if clicked on delete button
                if (e.target.classList.contains('document-delete-btn')) {
                    return;
                }
                
                this.openDocument(docId);
            });
            
            // Delete button
            const deleteBtn = item.querySelector('.document-delete-btn');
            deleteBtn.addEventListener('click', () => {
                this.deleteDocument(docId);
            });
        });
    },
    
    // Upload document
    uploadDocument: async function(file) {
        try {
            // Show processing modal
            this.showProcessingModal('Reading document...');
            
            // Get file type
            const fileType = this.getFileType(file.name);
            
            // Read file content
            const content = await this.readFileContent(file, fileType);
            
            // Create document object
            const document = {
                title: file.name,
                content: content,
                type: fileType,
                size: file.size,
                uploadDate: new Date().toISOString()
            };
            
            // Process document with AI
            this.updateProcessingMessage('Processing with AI...');
            
            // Extract metadata
            document.metadata = await this.extractMetadata(content);
            
            // Save to database
            const docId = await window.PatelDB.add('documents', document);
            document.id = docId;
            
            // Add to documents array
            this.documents.push(document);
            
            // Render documents list
            this.renderDocumentsList();
            
            // Open the document
            this.openDocument(docId);
            
            // Hide processing modal
            this.hideProcessingModal();
            
            Utils.showNotification('Document uploaded successfully', 'success');
        } catch (error) {
            console.error('Error uploading document:', error);
            this.hideProcessingModal();
            Utils.showNotification('Error uploading document', 'error');
        }
    },
    
    // Read file content
    readFileContent: function(file, fileType) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                let content = e.target.result;
                
                // For PDF files, we would need a PDF.js library to extract text
                // For simplicity, we'll just handle text files in this example
                if (fileType === 'pdf') {
                    content = "PDF content extraction requires PDF.js library. This is a placeholder for the extracted content.";
                }
                
                resolve(content);
            };
            
            reader.onerror = (e) => {
                reject(new Error('Error reading file'));
            };
            
            reader.readAsText(file);
        });
    },
    
    // Extract metadata from document content
    extractMetadata: async function(content) {
        // In a real implementation, this would use TensorFlow.js to extract metadata
        // For now, we'll just create some simple metadata
        
        // Get word count
        const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
        
        // Get estimated read time (average reading speed: 200 words per minute)
        const readTimeMinutes = Math.ceil(wordCount / 200);
        
        // Extract keywords (simple implementation)
        const words = content.toLowerCase().split(/\W+/).filter(word => word.length > 3);
        const wordFrequency = {};
        
        words.forEach(word => {
            // Skip common words
            const commonWords = ['this', 'that', 'these', 'those', 'with', 'from', 'have', 'will'];
            if (commonWords.includes(word)) return;
            
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });
        
        // Sort by frequency
        const sortedWords = Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(entry => entry[0]);
        
        return {
            wordCount,
            readTimeMinutes,
            keywords: sortedWords
        };
    },
    
    // Open document
    openDocument: async function(docId) {
        try {
            const document = this.documents.find(doc => doc.id === docId);
            
            if (!document) {
                Utils.showNotification('Document not found', 'error');
                return;
            }
            
            this.currentDocument = document;
            
            // Update active document in list
            document.querySelectorAll('.document-item').forEach(item => {
                if (parseInt(item.getAttribute('data-id')) === docId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
            // Render document content
            this.renderDocumentContent();
            
            // Enable AI tools
            this.elements.summarizeBtn.disabled = false;
            this.elements.extractBtn.disabled = false;
            this.elements.questionsBtn.disabled = false;
        } catch (error) {
            console.error('Error opening document:', error);
            Utils.showNotification('Error opening document', 'error');
        }
    },
    
    // Render document content
    renderDocumentContent: function() {
        if (!this.currentDocument) {
            this.elements.documentView.innerHTML = `
                <div class="empty-state">
                    <h3>No Document Selected</h3>
                    <p>Select a document from the sidebar or upload a new one.</p>
                </div>
            `;
            return;
        }
        
        const doc = this.currentDocument;
        const metadata = doc.metadata || {};
        
        let html = `
            <div class="document-header">
                <h3>${doc.title}</h3>
                <div class="document-meta">
                    <span class="document-type">${this.getDocumentIcon(doc.type)} ${doc.type.toUpperCase()}</span>
                    <span class="document-size">${this.formatFileSize(doc.size)}</span>
                    <span class="document-date">Uploaded: ${Utils.formatDate(new Date(doc.uploadDate))}</span>
                </div>
                <div class="document-stats">
                    <span class="document-word-count">${metadata.wordCount || 0} words</span>
                    <span class="document-read-time">${metadata.readTimeMinutes || 0} min read</span>
                </div>
                ${metadata.keywords && metadata.keywords.length > 0 ? `
                    <div class="document-keywords">
                        ${metadata.keywords.map(keyword => `<span class="keyword">${keyword}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="document-body">
                ${this.formatDocumentContent(doc.content)}
            </div>
        `;
        
        this.elements.documentView.innerHTML = html;
    },
    
    // Format document content for display
    formatDocumentContent: function(content) {
        // Convert line breaks to paragraphs
        return content.split('\n\n')
            .filter(para => para.trim().length > 0)
            .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
            .join('');
    },
    
    // Delete document
    deleteDocument: async function(docId) {
        if (confirm('Are you sure you want to delete this document?')) {
            try {
                await window.PatelDB.delete('documents', docId);
                
                // Remove from documents array
                this.documents = this.documents.filter(doc => doc.id !== docId);
                
                // Reset current document if it was deleted
                if (this.currentDocument && this.currentDocument.id === docId) {
                    this.currentDocument = null;
                    this.renderDocumentContent();
                    
                    // Disable AI tools
                    this.elements.summarizeBtn.disabled = true;
                    this.elements.extractBtn.disabled = true;
                    this.elements.questionsBtn.disabled = true;
                }
                
                // Render documents list
                this.renderDocumentsList();
                
                Utils.showNotification('Document deleted successfully', 'success');
            } catch (error) {
                console.error('Error deleting document:', error);
                Utils.showNotification('Error deleting document', 'error');
            }
        }
    },
    
    // Search documents
    searchDocuments: function(query) {
        if (!query) {
            // If query is empty, show all documents
            this.renderDocumentsList();
            return;
        }
        
        // Filter documents by title and content
        const filteredDocs = this.documents.filter(doc => {
            const title = doc.title.toLowerCase();
            const content = doc.content.toLowerCase();
            const q = query.toLowerCase();
            
            return title.includes(q) || content.includes(q);
        });
        
        if (filteredDocs.length === 0) {
            this.elements.documentsList.innerHTML = '<div class="empty-state">No matching documents</div>';
            return;
        }
        
        // Store original documents
        const originalDocs = this.documents;
        
        // Set filtered documents and render
        this.documents = filteredDocs;
        this.renderDocumentsList();
        
        // Restore original documents
        this.documents = originalDocs;
    },
    
    // Initialize TensorFlow.js
    initTensorFlow: function() {
        // In a real implementation, this would load TensorFlow.js and necessary models
        console.log('Initializing TensorFlow.js...');
        
        // Simulate loading TensorFlow.js
        setTimeout(() => {
            console.log('TensorFlow.js initialized');
        }, 1000);
    },
    
    // Summarize document
    summarizeDocument: async function() {
        if (!this.currentDocument) return;
        
        try {
            this.showProcessingModal('Generating summary...');
            
            // In a real implementation, this would use TensorFlow.js to generate a summary
            // For now, we'll just create a simple summary
            
            // Get first few sentences
            const sentences = this.currentDocument.content
                .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
                .split("|");
            
            // Take first 3 sentences or 20% of the document, whichever is greater
            const numSentences = Math.max(3, Math.ceil(sentences.length * 0.2));
            const summary = sentences.slice(0, numSentences).join(' ');
            
            // Add a small delay to simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Display summary
            this.elements.aiOutput.innerHTML = `
                <div class="ai-result">
                    <h4>Summary</h4>
                    <p>${summary}</p>
                </div>
            `;
            
            this.hideProcessingModal();
        } catch (error) {
            console.error('Error summarizing document:', error);
            this.hideProcessingModal();
            Utils.showNotification('Error generating summary', 'error');
        }
    },
    
    // Extract key points
    extractKeyPoints: async function() {
        if (!this.currentDocument) return;
        
        try {
            this.showProcessingModal('Extracting key points...');
            
            // In a real implementation, this would use TensorFlow.js to extract key points
            // For now, we'll just create some simple key points
            
            // Split into paragraphs
            const paragraphs = this.currentDocument.content.split('\n\n').filter(p => p.trim().length > 0);
            
            // Take first sentence from each paragraph
            const keyPoints = paragraphs.map(para => {
                const firstSentence = para.split(/[.!?]/).filter(s => s.trim().length > 0)[0];
                return firstSentence ? firstSentence.trim() + '.' : '';
            }).filter(point => point.length > 0);
            
            // Add a small delay to simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Display key points
            this.elements.aiOutput.innerHTML = `
                <div class="ai-result">
                    <h4>Key Points</h4>
                    <ul>
                        ${keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
            `;
            
            this.hideProcessingModal();
        } catch (error) {
            console.error('Error extracting key points:', error);
            this.hideProcessingModal();
            Utils.showNotification('Error extracting key points', 'error');
        }
    },
    
    // Generate questions
    generateQuestions: async function() {
        if (!this.currentDocument) return;
        
        try {
            this.showProcessingModal('Generating questions...');
            
            // In a real implementation, this would use TensorFlow.js to generate questions
            // For now, we'll just create some simple questions
            
            // Get keywords
            const keywords = this.currentDocument.metadata?.keywords || [];
            
            // Generate questions based on keywords
            const questions = keywords.slice(0, 5).map(keyword => {
                return `What is the significance of "${keyword}" in this document?`;
            });
            
            // Add some generic questions
            questions.push('What are the main arguments presented in this document?');
            questions.push('How does this document relate to the broader context?');
            questions.push('What evidence is provided to support the claims?');
            
            // Add a small delay to simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Display questions
            this.elements.aiOutput.innerHTML = `
                <div class="ai-result">
                    <h4>Questions</h4>
                    <ul>
                        ${questions.map(question => `<li>${question}</li>`).join('')}
                    </ul>
                </div>
            `;
            
            this.hideProcessingModal();
        } catch (error) {
            console.error('Error generating questions:', error);
            this.hideProcessingModal();
            Utils.showNotification('Error generating questions', 'error');
        }
    },
    
    // Show processing modal
    showProcessingModal: function(message) {
        this.elements.processingMessage.textContent = message;
        this.elements.processingModal.classList.add('active');
    },
    
    // Update processing message
    updateProcessingMessage: function(message) {
        this.elements.processingMessage.textContent = message;
    },
    
    // Hide processing modal
    hideProcessingModal: function() {
        this.elements.processingModal.classList.remove('active');
    },
    
    // Get file type from filename
    getFileType: function(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        
        switch (extension) {
            case 'pdf': return 'pdf';
            case 'docx': return 'docx';
            case 'md': return 'markdown';
            default: return 'text';
        }
    },
    
    // Get document icon based on type
    getDocumentIcon: function(type) {
        switch (type) {
            case 'pdf': return '📄';
            case 'docx': return '📝';
            case 'markdown': return '📑';
            default: return '📄';
        }
    },
    
    // Format file size
    formatFileSize: function(bytes) {
        if (bytes < 1024) {
            return bytes + ' B';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }
    }
};

// Register module
window['researchModule'] = researchModule;
