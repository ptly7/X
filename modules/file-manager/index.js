/* Cloud Hub (Local File Manager) Module for Patel Productivity Suite */

const fileManagerModule = {
    // Store DOM elements
    elements: {},
    
    // File system data
    files: [],
    folders: [],
    currentPath: '/',
    selectedItems: [],
    
    // Initialize the module
    init: async function(container) {
        console.log('Initializing Cloud Hub module');
        
        // Render the module UI
        this.render(container);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load files and folders
        await this.loadFilesAndFolders();
        
        // Request file system access if supported
        this.checkFileSystemAccess();
    },
    
    // Render the module UI
    render: function(container) {
        container.innerHTML = `
            <div class="module-header">
                <h2>Cloud Hub</h2>
                <div class="module-actions">
                    <button id="upload-file-btn" class="btn primary">Upload</button>
                    <button id="new-folder-btn" class="btn">New Folder</button>
                    <input type="file" id="file-input" multiple style="display: none;">
                </div>
            </div>
            
            <div class="file-manager-container">
                <div class="file-manager-sidebar">
                    <div class="sidebar-section">
                        <h3>Storage</h3>
                        <div class="storage-info">
                            <div class="storage-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" id="storage-progress"></div>
                                </div>
                            </div>
                            <div class="storage-text" id="storage-text">0 MB / 50 MB</div>
                        </div>
                    </div>
                    
                    <div class="sidebar-section">
                        <h3>Locations</h3>
                        <ul class="locations-list">
                            <li class="location-item active" data-path="/">
                                <span class="location-icon">📁</span>
                                <span class="location-name">My Files</span>
                            </li>
                            <li class="location-item" data-path="/recent">
                                <span class="location-icon">🕒</span>
                                <span class="location-name">Recent</span>
                            </li>
                            <li class="location-item" data-path="/favorites">
                                <span class="location-icon">⭐</span>
                                <span class="location-name">Favorites</span>
                            </li>
                            <li class="location-item" data-path="/trash">
                                <span class="location-icon">🗑️</span>
                                <span class="location-name">Trash</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="sidebar-section">
                        <h3>File Types</h3>
                        <ul class="file-types-list">
                            <li class="file-type-item" data-type="image">
                                <span class="file-type-icon">🖼️</span>
                                <span class="file-type-name">Images</span>
                            </li>
                            <li class="file-type-item" data-type="document">
                                <span class="file-type-icon">📄</span>
                                <span class="file-type-name">Documents</span>
                            </li>
                            <li class="file-type-item" data-type="audio">
                                <span class="file-type-icon">🎵</span>
                                <span class="file-type-name">Audio</span>
                            </li>
                            <li class="file-type-item" data-type="video">
                                <span class="file-type-icon">🎬</span>
                                <span class="file-type-name">Videos</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div class="file-manager-content">
                    <div class="file-manager-toolbar">
                        <div class="breadcrumb" id="breadcrumb">
                            <span class="breadcrumb-item" data-path="/">My Files</span>
                        </div>
                        <div class="toolbar-actions">
                            <div class="search-container">
                                <input type="text" id="file-search" placeholder="Search files...">
                            </div>
                            <div class="view-options">
                                <button id="grid-view-btn" class="view-btn active" title="Grid View">
                                    <span class="view-icon">▦</span>
                                </button>
                                <button id="list-view-btn" class="view-btn" title="List View">
                                    <span class="view-icon">☰</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="file-manager-selection-bar" id="selection-bar">
                        <div class="selection-info">
                            <span id="selection-count">0 items selected</span>
                        </div>
                        <div class="selection-actions">
                            <button id="download-selected-btn" class="btn" disabled>Download</button>
                            <button id="share-selected-btn" class="btn" disabled>Share</button>
                            <button id="move-selected-btn" class="btn" disabled>Move</button>
                            <button id="delete-selected-btn" class="btn danger" disabled>Delete</button>
                            <button id="cancel-selection-btn" class="btn">Cancel</button>
                        </div>
                    </div>
                    
                    <div class="file-manager-items" id="file-items">
                        <div class="loading">Loading files...</div>
                    </div>
                </div>
                
                <div class="file-manager-preview" id="file-preview">
                    <div class="empty-preview">
                        <div class="empty-preview-icon">👆</div>
                        <div class="empty-preview-text">Select a file to preview</div>
                    </div>
                </div>
            </div>
            
            <!-- New Folder Modal -->
            <div id="new-folder-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Create New Folder</h3>
                    <form id="new-folder-form">
                        <div class="form-group">
                            <label for="folder-name">Folder Name</label>
                            <input type="text" id="folder-name" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" id="folder-cancel-btn" class="btn">Cancel</button>
                            <button type="submit" id="folder-create-btn" class="btn primary">Create</button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Share Modal -->
            <div id="share-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Share Files</h3>
                    <div class="share-options">
                        <div class="share-option">
                            <button id="copy-link-btn" class="btn">Copy Link</button>
                            <p>Generate a shareable link</p>
                        </div>
                        <div class="share-option">
                            <button id="export-files-btn" class="btn">Export Files</button>
                            <p>Export selected files</p>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" id="share-close-btn" class="btn">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        // Store DOM elements
        this.elements = {
            uploadBtn: document.getElementById('upload-file-btn'),
            newFolderBtn: document.getElementById('new-folder-btn'),
            fileInput: document.getElementById('file-input'),
            fileSearch: document.getElementById('file-search'),
            gridViewBtn: document.getElementById('grid-view-btn'),
            listViewBtn: document.getElementById('list-view-btn'),
            fileItems: document.getElementById('file-items'),
            breadcrumb: document.getElementById('breadcrumb'),
            filePreview: document.getElementById('file-preview'),
            storageProgress: document.getElementById('storage-progress'),
            storageText: document.getElementById('storage-text'),
            selectionBar: document.getElementById('selection-bar'),
            selectionCount: document.getElementById('selection-count'),
            downloadSelectedBtn: document.getElementById('download-selected-btn'),
            shareSelectedBtn: document.getElementById('share-selected-btn'),
            moveSelectedBtn: document.getElementById('move-selected-btn'),
            deleteSelectedBtn: document.getElementById('delete-selected-btn'),
            cancelSelectionBtn: document.getElementById('cancel-selection-btn'),
            newFolderModal: document.getElementById('new-folder-modal'),
            newFolderForm: document.getElementById('new-folder-form'),
            folderName: document.getElementById('folder-name'),
            folderCancelBtn: document.getElementById('folder-cancel-btn'),
            folderCreateBtn: document.getElementById('folder-create-btn'),
            newFolderCloseModal: document.querySelector('#new-folder-modal .close-modal'),
            shareModal: document.getElementById('share-modal'),
            copyLinkBtn: document.getElementById('copy-link-btn'),
            exportFilesBtn: document.getElementById('export-files-btn'),
            shareCloseBtn: document.getElementById('share-close-btn'),
            shareCloseModal: document.querySelector('#share-modal .close-modal')
        };
        
        // Hide selection bar initially
        this.elements.selectionBar.style.display = 'none';
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
                this.uploadFiles(e.target.files);
            }
        });
        
        // New folder button
        this.elements.newFolderBtn.addEventListener('click', () => {
            this.openNewFolderModal();
        });
        
        // File search
        this.elements.fileSearch.addEventListener('input', Utils.debounce(() => {
            this.searchFiles(this.elements.fileSearch.value.trim());
        }, 300));
        
        // View buttons
        this.elements.gridViewBtn.addEventListener('click', () => {
            this.setViewMode('grid');
        });
        
        this.elements.listViewBtn.addEventListener('click', () => {
            this.setViewMode('list');
        });
        
        // Selection actions
        this.elements.downloadSelectedBtn.addEventListener('click', () => {
            this.downloadSelectedFiles();
        });
        
        this.elements.shareSelectedBtn.addEventListener('click', () => {
            this.openShareModal();
        });
        
        this.elements.moveSelectedBtn.addEventListener('click', () => {
            // TODO: Implement move functionality
            Utils.showNotification('Move functionality coming soon', 'info');
        });
        
        this.elements.deleteSelectedBtn.addEventListener('click', () => {
            this.deleteSelectedFiles();
        });
        
        this.elements.cancelSelectionBtn.addEventListener('click', () => {
            this.clearSelection();
        });
        
        // Location items
        document.querySelectorAll('.location-item').forEach(item => {
            item.addEventListener('click', () => {
                const path = item.getAttribute('data-path');
                this.navigateTo(path);
                
                // Update active location
                document.querySelectorAll('.location-item').forEach(i => {
                    i.classList.remove('active');
                });
                item.classList.add('active');
            });
        });
        
        // File type items
        document.querySelectorAll('.file-type-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.getAttribute('data-type');
                this.filterByType(type);
            });
        });
        
        // New folder modal
        this.elements.newFolderCloseModal.addEventListener('click', () => {
            this.closeNewFolderModal();
        });
        
        this.elements.folderCancelBtn.addEventListener('click', () => {
            this.closeNewFolderModal();
        });
        
        this.elements.newFolderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createNewFolder();
        });
        
        // Share modal
        this.elements.shareCloseModal.addEventListener('click', () => {
            this.closeShareModal();
        });
        
        this.elements.shareCloseBtn.addEventListener('click', () => {
            this.closeShareModal();
        });
        
        this.elements.copyLinkBtn.addEventListener('click', () => {
            this.copyShareLink();
        });
        
        this.elements.exportFilesBtn.addEventListener('click', () => {
            this.exportSelectedFiles();
        });
    },
    
    // Load files and folders from database
    loadFilesAndFolders: async function() {
        try {
            // Load files
            this.files = await window.PatelDB.getAll('files');
            
            // Load folders
            this.folders = await window.PatelDB.getAll('folders');
            
            // If no root folder, create it
            if (!this.folders.find(folder => folder.path === '/')) {
                const rootFolder = {
                    name: 'My Files',
                    path: '/',
                    parent: null,
                    createdAt: new Date().toISOString()
                };
                
                const rootId = await window.PatelDB.add('folders', rootFolder);
                rootFolder.id = rootId;
                this.folders.push(rootFolder);
            }
            
            // Render files and folders
            this.renderFilesAndFolders();
            
            // Update storage info
            this.updateStorageInfo();
        } catch (error) {
            console.error('Error loading files and folders:', error);
            this.elements.fileItems.innerHTML = '<div class="error">Error loading files</div>';
        }
    },
    
    // Render files and folders
    renderFilesAndFolders: function() {
        // Special paths
        if (this.currentPath === '/recent') {
            this.renderRecentFiles();
            return;
        } else if (this.currentPath === '/favorites') {
            this.renderFavoriteFiles();
            return;
        } else if (this.currentPath === '/trash') {
            this.renderTrashFiles();
            return;
        }
        
        // Get files and folders in current path
        const currentFolders = this.folders.filter(folder => 
            folder.parent === this.currentPath && !folder.deleted
        );
        
        const currentFiles = this.files.filter(file => 
            file.path === this.currentPath && !file.deleted
        );
        
        if (currentFolders.length === 0 && currentFiles.length === 0) {
            this.elements.fileItems.innerHTML = '<div class="empty-state">This folder is empty</div>';
            return;
        }
        
        // Sort folders and files (folders first, then files by name)
        currentFolders.sort((a, b) => a.name.localeCompare(b.name));
        currentFiles.sort((a, b) => a.name.localeCompare(b.name));
        
        // Get view mode
        const viewMode = this.elements.gridViewBtn.classList.contains('active') ? 'grid' : 'list';
        
        // Render items
        let html = `<div class="file-items-container ${viewMode}-view">`;
        
        // Add parent folder if not in root
        if (this.currentPath !== '/') {
            const parentPath = this.getParentPath(this.currentPath);
            html += this.renderFolderItem({ 
                name: '..', 
                path: parentPath, 
                isParent: true 
            }, viewMode);
        }
        
        // Add folders
        currentFolders.forEach(folder => {
            html += this.renderFolderItem(folder, viewMode);
        });
        
        // Add files
        currentFiles.forEach(file => {
            html += this.renderFileItem(file, viewMode);
        });
        
        html += '</div>';
        
        this.elements.fileItems.innerHTML = html;
        
        // Add event listeners to items
        this.addItemEventListeners();
        
        // Update breadcrumb
        this.updateBreadcrumb();
    },
    
    // Render recent files
    renderRecentFiles: function() {
        // Get recent files (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentFiles = this.files
            .filter(file => !file.deleted && new Date(file.uploadedAt) >= thirtyDaysAgo)
            .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        
        if (recentFiles.length === 0) {
            this.elements.fileItems.innerHTML = '<div class="empty-state">No recent files</div>';
            return;
        }
        
        // Get view mode
        const viewMode = this.elements.gridViewBtn.classList.contains('active') ? 'grid' : 'list';
        
        // Render items
        let html = `<div class="file-items-container ${viewMode}-view">`;
        
        recentFiles.forEach(file => {
            html += this.renderFileItem(file, viewMode);
        });
        
        html += '</div>';
        
        this.elements.fileItems.innerHTML = html;
        
        // Add event listeners to items
        this.addItemEventListeners();
        
        // Update breadcrumb
        this.updateBreadcrumb();
    },
    
    // Render favorite files
    renderFavoriteFiles: function() {
        // Get favorite files
        const favoriteFiles = this.files.filter(file => file.favorite && !file.deleted);
        
        if (favoriteFiles.length === 0) {
            this.elements.fileItems.innerHTML = '<div class="empty-state">No favorite files</div>';
            return;
        }
        
        // Get view mode
        const viewMode = this.elements.gridViewBtn.classList.contains('active') ? 'grid' : 'list';
        
        // Render items
        let html = `<div class="file-items-container ${viewMode}-view">`;
        
        favoriteFiles.forEach(file => {
            html += this.renderFileItem(file, viewMode);
        });
        
        html += '</div>';
        
        this.elements.fileItems.innerHTML = html;
        
        // Add event listeners to items
        this.addItemEventListeners();
        
        // Update breadcrumb
        this.updateBreadcrumb();
    },
    
    // Render trash files
    renderTrashFiles: function() {
        // Get deleted files and folders
        const deletedFiles = this.files.filter(file => file.deleted);
        const deletedFolders = this.folders.filter(folder => folder.deleted);
        
        if (deletedFiles.length === 0 && deletedFolders.length === 0) {
            this.elements.fileItems.innerHTML = '<div class="empty-state">Trash is empty</div>';
            return;
        }
        
        // Get view mode
        const viewMode = this.elements.gridViewBtn.classList.contains('active') ? 'grid' : 'list';
        
        // Render items
        let html = `<div class="file-items-container ${viewMode}-view">`;
        
        // Add folders
        deletedFolders.forEach(folder => {
            html += this.renderFolderItem(folder, viewMode, true);
        });
        
        // Add files
        deletedFiles.forEach(file => {
            html += this.renderFileItem(file, viewMode, true);
        });
        
        html += '</div>';
        
        this.elements.fileItems.innerHTML = html;
        
        // Add event listeners to items
        this.addItemEventListeners();
        
        // Update breadcrumb
        this.updateBreadcrumb();
    },
    
    // Render folder item
    renderFolderItem: function(folder, viewMode, isTrash = false) {
        const isSelected = this.selectedItems.some(item => 
            item.type === 'folder' && item.id === folder.id
        );
        
        if (viewMode === 'grid') {
            return `
                <div class="file-item folder ${isSelected ? 'selected' : ''}" 
                     data-id="${folder.id || ''}" 
                     data-type="folder" 
                     data-path="${folder.path || ''}">
                    <div class="file-icon">📁</div>
                    <div class="file-name">${folder.name}</div>
                    ${!folder.isParent && !isTrash ? `
                        <div class="file-actions">
                            <button class="file-action-btn rename-btn" title="Rename">✏️</button>
                            <button class="file-action-btn delete-btn" title="Delete">🗑️</button>
                        </div>
                    ` : ''}
                    ${isTrash ? `
                        <div class="file-actions">
                            <button class="file-action-btn restore-btn" title="Restore">♻️</button>
                            <button class="file-action-btn permanent-delete-btn" title="Delete Permanently">❌</button>
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            return `
                <div class="file-item folder ${isSelected ? 'selected' : ''}" 
                     data-id="${folder.id || ''}" 
                     data-type="folder" 
                     data-path="${folder.path || ''}">
                    <div class="file-icon">📁</div>
                    <div class="file-name">${folder.name}</div>
                    <div class="file-info">
                        <span class="file-date">${folder.createdAt ? Utils.formatDate(new Date(folder.createdAt)) : ''}</span>
                    </div>
                    ${!folder.isParent && !isTrash ? `
                        <div class="file-actions">
                            <button class="file-action-btn rename-btn" title="Rename">✏️</button>
                            <button class="file-action-btn delete-btn" title="Delete">🗑️</button>
                        </div>
                    ` : ''}
                    ${isTrash ? `
                        <div class="file-actions">
                            <button class="file-action-btn restore-btn" title="Restore">♻️</button>
                            <button class="file-action-btn permanent-delete-btn" title="Delete Permanently">❌</button>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    },
    
    // Render file item
    renderFileItem: function(file, viewMode, isTrash = false) {
        const isSelected = this.selectedItems.some(item => 
            item.type === 'file' && item.id === file.id
        );
        
        const fileIcon = this.getFileIcon(file.type);
        
        if (viewMode === 'grid') {
            return `
                <div class="file-item ${isSelected ? 'selected' : ''}" 
                     data-id="${file.id}" 
                     data-type="file">
                    <div class="file-icon">${fileIcon}</div>
                    <div class="file-name">${file.name}</div>
                    ${!isTrash ? `
                        <div class="file-actions">
                            <button class="file-action-btn favorite-btn" title="${file.favorite ? 'Remove from Favorites' : 'Add to Favorites'}">
                                ${file.favorite ? '★' : '☆'}
                            </button>
                            <button class="file-action-btn download-btn" title="Download">⬇️</button>
                            <button class="file-action-btn delete-btn" title="Delete">🗑️</button>
                        </div>
                    ` : ''}
                    ${isTrash ? `
                        <div class="file-actions">
                            <button class="file-action-btn restore-btn" title="Restore">♻️</button>
                            <button class="file-action-btn permanent-delete-btn" title="Delete Permanently">❌</button>
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            return `
                <div class="file-item ${isSelected ? 'selected' : ''}" 
                     data-id="${file.id}" 
                     data-type="file">
                    <div class="file-icon">${fileIcon}</div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-info">
                        <span class="file-size">${this.formatFileSize(file.size)}</span>
                        <span class="file-date">${Utils.formatDate(new Date(file.uploadedAt))}</span>
                    </div>
                    ${!isTrash ? `
                        <div class="file-actions">
                            <button class="file-action-btn favorite-btn" title="${file.favorite ? 'Remove from Favorites' : 'Add to Favorites'}">
                                ${file.favorite ? '★' : '☆'}
                            </button>
                            <button class="file-action-btn download-btn" title="Download">⬇️</button>
                            <button class="file-action-btn delete-btn" title="Delete">🗑️</button>
                        </div>
                    ` : ''}
                    ${isTrash ? `
                        <div class="file-actions">
                            <button class="file-action-btn restore-btn" title="Restore">♻️</button>
                            <button class="file-action-btn permanent-delete-btn" title="Delete Permanently">❌</button>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    },
    
    // Add event listeners to file and folder items
    addItemEventListeners: function() {
        // File and folder items
        document.querySelectorAll('.file-item').forEach(item => {
            const itemId = parseInt(item.getAttribute('data-id'));
            const itemType = item.getAttribute('data-type');
            
            // Click event (select/open)
            item.addEventListener('click', (e) => {
                // Ignore if clicked on action button
                if (e.target.closest('.file-action-btn')) {
                    return;
                }
                
                // If folder, navigate to it
                if (itemType === 'folder') {
                    const folderPath = item.getAttribute('data-path');
                    if (folderPath) {
                        this.navigateTo(folderPath);
                    } else {
                        const folder = this.folders.find(f => f.id === itemId);
                        if (folder) {
                            this.navigateTo(folder.path + folder.name + '/');
                        }
                    }
                } else {
                    // If file, toggle selection
                    this.toggleItemSelection(itemId, itemType);
                    
                    // Preview file
                    if (itemType === 'file') {
                        this.previewFile(itemId);
                    }
                }
            });
            
            // Action buttons
            if (itemType === 'folder') {
                // Rename button
                const renameBtn = item.querySelector('.rename-btn');
                if (renameBtn) {
                    renameBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.renameFolder(itemId);
                    });
                }
                
                // Delete button
                const deleteBtn = item.querySelector('.delete-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.deleteFolder(itemId);
                    });
                }
                
                // Restore button
                const restoreBtn = item.querySelector('.restore-btn');
                if (restoreBtn) {
                    restoreBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.restoreFolder(itemId);
                    });
                }
                
                // Permanent delete button
                const permanentDeleteBtn = item.querySelector('.permanent-delete-btn');
                if (permanentDeleteBtn) {
                    permanentDeleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.permanentDeleteFolder(itemId);
                    });
                }
            } else if (itemType === 'file') {
                // Favorite button
                const favoriteBtn = item.querySelector('.favorite-btn');
                if (favoriteBtn) {
                    favoriteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.toggleFileFavorite(itemId);
                    });
                }
                
                // Download button
                const downloadBtn = item.querySelector('.download-btn');
                if (downloadBtn) {
                    downloadBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.downloadFile(itemId);
                    });
                }
                
                // Delete button
                const deleteBtn = item.querySelector('.delete-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.deleteFile(itemId);
                    });
                }
                
                // Restore button
                const restoreBtn = item.querySelector('.restore-btn');
                if (restoreBtn) {
                    restoreBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.restoreFile(itemId);
                    });
                }
                
                // Permanent delete button
                const permanentDeleteBtn = item.querySelector('.permanent-delete-btn');
                if (permanentDeleteBtn) {
                    permanentDeleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.permanentDeleteFile(itemId);
                    });
                }
            }
        });
        
        // Breadcrumb items
        document.querySelectorAll('.breadcrumb-item').forEach(item => {
            item.addEventListener('click', () => {
                const path = item.getAttribute('data-path');
                this.navigateTo(path);
            });
        });
    },
    
    // Update breadcrumb
    updateBreadcrumb: function() {
        let html = '';
        
        if (this.currentPath === '/recent') {
            html = '<span class="breadcrumb-item" data-path="/">My Files</span> &gt; <span class="breadcrumb-item active">Recent</span>';
        } else if (this.currentPath === '/favorites') {
            html = '<span class="breadcrumb-item" data-path="/">My Files</span> &gt; <span class="breadcrumb-item active">Favorites</span>';
        } else if (this.currentPath === '/trash') {
            html = '<span class="breadcrumb-item" data-path="/">My Files</span> &gt; <span class="breadcrumb-item active">Trash</span>';
        } else {
            // Split path into parts
            const parts = this.currentPath.split('/').filter(part => part);
            
            // Add root
            html = '<span class="breadcrumb-item" data-path="/">My Files</span>';
            
            // Add path parts
            let currentPath = '/';
            parts.forEach((part, index) => {
                currentPath += part + '/';
                
                if (index === parts.length - 1) {
                    html += ` &gt; <span class="breadcrumb-item active">${part}</span>`;
                } else {
                    html += ` &gt; <span class="breadcrumb-item" data-path="${currentPath}">${part}</span>`;
                }
            });
        }
        
        this.elements.breadcrumb.innerHTML = html;
    },
    
    // Navigate to path
    navigateTo: function(path) {
        this.currentPath = path;
        this.clearSelection();
        this.renderFilesAndFolders();
    },
    
    // Get parent path
    getParentPath: function(path) {
        // Remove trailing slash if present
        if (path.endsWith('/') && path !== '/') {
            path = path.slice(0, -1);
        }
        
        // Get parent path
        const lastSlashIndex = path.lastIndexOf('/');
        if (lastSlashIndex === 0) {
            return '/';
        }
        
        return path.substring(0, lastSlashIndex + 1);
    },
    
    // Toggle item selection
    toggleItemSelection: function(itemId, itemType) {
        const index = this.selectedItems.findIndex(item => 
            item.type === itemType && item.id === itemId
        );
        
        if (index === -1) {
            // Add to selection
            this.selectedItems.push({ id: itemId, type: itemType });
        } else {
            // Remove from selection
            this.selectedItems.splice(index, 1);
        }
        
        // Update UI
        this.updateSelectionUI();
    },
    
    // Clear selection
    clearSelection: function() {
        this.selectedItems = [];
        this.updateSelectionUI();
    },
    
    // Update selection UI
    updateSelectionUI: function() {
        // Update selected items
        document.querySelectorAll('.file-item').forEach(item => {
            const itemId = parseInt(item.getAttribute('data-id'));
            const itemType = item.getAttribute('data-type');
            
            const isSelected = this.selectedItems.some(selectedItem => 
                selectedItem.type === itemType && selectedItem.id === itemId
            );
            
            if (isSelected) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        // Update selection bar
        if (this.selectedItems.length > 0) {
            this.elements.selectionBar.style.display = 'flex';
            this.elements.selectionCount.textContent = `${this.selectedItems.length} item${this.selectedItems.length > 1 ? 's' : ''} selected`;
            
            // Enable/disable buttons
            this.elements.downloadSelectedBtn.disabled = false;
            this.elements.shareSelectedBtn.disabled = false;
            this.elements.moveSelectedBtn.disabled = false;
            this.elements.deleteSelectedBtn.disabled = false;
        } else {
            this.elements.selectionBar.style.display = 'none';
        }
    },
    
    // Set view mode
    setViewMode: function(mode) {
        if (mode === 'grid') {
            this.elements.gridViewBtn.classList.add('active');
            this.elements.listViewBtn.classList.remove('active');
        } else {
            this.elements.gridViewBtn.classList.remove('active');
            this.elements.listViewBtn.classList.add('active');
        }
        
        // Re-render files and folders
        this.renderFilesAndFolders();
    },
    
    // Search files
    searchFiles: function(query) {
        if (!query) {
            // If query is empty, show current path
            this.renderFilesAndFolders();
            return;
        }
        
        // Search in all files and folders
        const matchingFiles = this.files.filter(file => 
            !file.deleted && file.name.toLowerCase().includes(query.toLowerCase())
        );
        
        const matchingFolders = this.folders.filter(folder => 
            !folder.deleted && folder.name.toLowerCase().includes(query.toLowerCase())
        );
        
        if (matchingFiles.length === 0 && matchingFolders.length === 0) {
            this.elements.fileItems.innerHTML = '<div class="empty-state">No matching files or folders</div>';
            return;
        }
        
        // Get view mode
        const viewMode = this.elements.gridViewBtn.classList.contains('active') ? 'grid' : 'list';
        
        // Render items
        let html = `<div class="file-items-container ${viewMode}-view">`;
        
        // Add folders
        matchingFolders.forEach(folder => {
            html += this.renderFolderItem(folder, viewMode);
        });
        
        // Add files
        matchingFiles.forEach(file => {
            html += this.renderFileItem(file, viewMode);
        });
        
        html += '</div>';
        
        this.elements.fileItems.innerHTML = html;
        
        // Add event listeners to items
        this.addItemEventListeners();
    },
    
    // Filter by type
    filterByType: function(type) {
        // Filter files by type
        const filteredFiles = this.files.filter(file => 
            !file.deleted && file.type.startsWith(type)
        );
        
        if (filteredFiles.length === 0) {
            this.elements.fileItems.innerHTML = `<div class="empty-state">No ${type} files found</div>`;
            return;
        }
        
        // Get view mode
        const viewMode = this.elements.gridViewBtn.classList.contains('active') ? 'grid' : 'list';
        
        // Render items
        let html = `<div class="file-items-container ${viewMode}-view">`;
        
        // Add files
        filteredFiles.forEach(file => {
            html += this.renderFileItem(file, viewMode);
        });
        
        html += '</div>';
        
        this.elements.fileItems.innerHTML = html;
        
        // Add event listeners to items
        this.addItemEventListeners();
        
        // Update breadcrumb
        this.elements.breadcrumb.innerHTML = `
            <span class="breadcrumb-item" data-path="/">My Files</span> &gt; 
            <span class="breadcrumb-item active">${this.formatFileType(type)}</span>
        `;
    },
    
    // Upload files
    uploadFiles: async function(fileList) {
        try {
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                
                // Read file as data URL
                const dataUrl = await this.readFileAsDataURL(file);
                
                // Get file type
                const fileType = this.getFileType(file.name);
                
                // Create file object
                const fileObj = {
                    name: file.name,
                    type: fileType,
                    size: file.size,
                    data: dataUrl,
                    path: this.currentPath,
                    uploadedAt: new Date().toISOString(),
                    favorite: false,
                    deleted: false
                };
                
                // Save to database
                const fileId = await window.PatelDB.add('files', fileObj);
                fileObj.id = fileId;
                
                // Add to files array
                this.files.push(fileObj);
            }
            
            // Re-render files and folders
            this.renderFilesAndFolders();
            
            // Update storage info
            this.updateStorageInfo();
            
            Utils.showNotification(`${fileList.length} file${fileList.length > 1 ? 's' : ''} uploaded successfully`, 'success');
        } catch (error) {
            console.error('Error uploading files:', error);
            Utils.showNotification('Error uploading files', 'error');
        }
    },
    
    // Read file as data URL
    readFileAsDataURL: function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = (e) => {
                reject(new Error('Error reading file'));
            };
            
            reader.readAsDataURL(file);
        });
    },
    
    // Open new folder modal
    openNewFolderModal: function() {
        this.elements.folderName.value = '';
        this.elements.newFolderModal.classList.add('active');
        this.elements.folderName.focus();
    },
    
    // Close new folder modal
    closeNewFolderModal: function() {
        this.elements.newFolderModal.classList.remove('active');
    },
    
    // Create new folder
    createNewFolder: async function() {
        try {
            const folderName = this.elements.folderName.value.trim();
            
            if (!folderName) {
                Utils.showNotification('Folder name is required', 'error');
                return;
            }
            
            // Check if folder already exists
            const folderPath = this.currentPath + folderName + '/';
            const existingFolder = this.folders.find(folder => 
                folder.path === folderPath && !folder.deleted
            );
            
            if (existingFolder) {
                Utils.showNotification('Folder already exists', 'error');
                return;
            }
            
            // Create folder object
            const folder = {
                name: folderName,
                path: folderPath,
                parent: this.currentPath,
                createdAt: new Date().toISOString(),
                deleted: false
            };
            
            // Save to database
            const folderId = await window.PatelDB.add('folders', folder);
            folder.id = folderId;
            
            // Add to folders array
            this.folders.push(folder);
            
            // Close modal
            this.closeNewFolderModal();
            
            // Re-render files and folders
            this.renderFilesAndFolders();
            
            Utils.showNotification('Folder created successfully', 'success');
        } catch (error) {
            console.error('Error creating folder:', error);
            Utils.showNotification('Error creating folder', 'error');
        }
    },
    
    // Rename folder
    renameFolder: async function(folderId) {
        const folder = this.folders.find(f => f.id === folderId);
        
        if (!folder) {
            Utils.showNotification('Folder not found', 'error');
            return;
        }
        
        const newName = prompt('Enter new folder name:', folder.name);
        
        if (!newName || newName === folder.name) {
            return;
        }
        
        try {
            // Update folder
            folder.name = newName;
            
            // Update path
            const oldPath = folder.path;
            folder.path = folder.parent + newName + '/';
            
            // Update in database
            await window.PatelDB.update('folders', folder);
            
            // Update child folders and files
            await this.updateChildPaths(oldPath, folder.path);
            
            // Re-render files and folders
            this.renderFilesAndFolders();
            
            Utils.showNotification('Folder renamed successfully', 'success');
        } catch (error) {
            console.error('Error renaming folder:', error);
            Utils.showNotification('Error renaming folder', 'error');
        }
    },
    
    // Update child paths when a folder is renamed
    updateChildPaths: async function(oldPath, newPath) {
        // Update child folders
        for (const folder of this.folders) {
            if (folder.path.startsWith(oldPath) && folder.path !== oldPath) {
                folder.path = folder.path.replace(oldPath, newPath);
                folder.parent = folder.parent.replace(oldPath, newPath);
                await window.PatelDB.update('folders', folder);
            }
        }
        
        // Update files
        for (const file of this.files) {
            if (file.path.startsWith(oldPath)) {
                file.path = file.path.replace(oldPath, newPath);
                await window.PatelDB.update('files', file);
            }
        }
    },
    
    // Delete folder
    deleteFolder: async function(folderId) {
        if (!confirm('Are you sure you want to delete this folder?')) {
            return;
        }
        
        try {
            const folder = this.folders.find(f => f.id === folderId);
            
            if (!folder) {
                Utils.showNotification('Folder not found', 'error');
                return;
            }
            
            // Mark folder as deleted
            folder.deleted = true;
            
            // Update in database
            await window.PatelDB.update('folders', folder);
            
            // Mark child folders and files as deleted
            await this.markChildrenAsDeleted(folder.path);
            
            // Re-render files and folders
            this.renderFilesAndFolders();
            
            Utils.showNotification('Folder moved to trash', 'success');
        } catch (error) {
            console.error('Error deleting folder:', error);
            Utils.showNotification('Error deleting folder', 'error');
        }
    },
    
    // Mark child folders and files as deleted
    markChildrenAsDeleted: async function(path) {
        // Mark child folders as deleted
        for (const folder of this.folders) {
            if (folder.path.startsWith(path) && folder.path !== path) {
                folder.deleted = true;
                await window.PatelDB.update('folders', folder);
            }
        }
        
        // Mark files as deleted
        for (const file of this.files) {
            if (file.path.startsWith(path)) {
                file.deleted = true;
                await window.PatelDB.update('files', file);
            }
        }
    },
    
    // Restore folder
    restoreFolder: async function(folderId) {
        try {
            const folder = this.folders.find(f => f.id === folderId);
            
            if (!folder) {
                Utils.showNotification('Folder not found', 'error');
                return;
            }
            
            // Mark folder as not deleted
            folder.deleted = false;
            
            // Update in database
            await window.PatelDB.update('folders', folder);
            
            // Mark child folders and files as not deleted
            await this.markChildrenAsNotDeleted(folder.path);
            
            // Re-render files and folders
            this.renderFilesAndFolders();
            
            Utils.showNotification('Folder restored successfully', 'success');
        } catch (error) {
            console.error('Error restoring folder:', error);
            Utils.showNotification('Error restoring folder', 'error');
        }
    },
    
    // Mark child folders and files as not deleted
    markChildrenAsNotDeleted: async function(path) {
        // Mark child folders as not deleted
        for (const folder of this.folders) {
            if (folder.path.startsWith(path) && folder.path !== path) {
                folder.deleted = false;
                await window.PatelDB.update('folders', folder);
            }
        }
        
        // Mark files as not deleted
        for (const file of this.files) {
            if (file.path.startsWith(path)) {
                file.deleted = false;
                await window.PatelDB.update('files', file);
            }
        }
    },
    
    // Permanently delete folder
    permanentDeleteFolder: async function(folderId) {
        if (!confirm('Are you sure you want to permanently delete this folder? This action cannot be undone.')) {
            return;
        }
        
        try {
            const folder = this.folders.find(f => f.id === folderId);
            
            if (!folder) {
                Utils.showNotification('Folder not found', 'error');
                return;
            }
            
            // Delete folder from database
            await window.PatelDB.delete('folders', folderId);
            
            // Remove from folders array
            this.folders = this.folders.filter(f => f.id !== folderId);
            
            // Delete child folders and files
            await this.deleteChildrenPermanently(folder.path);
            
            // Re-render files and folders
            this.renderFilesAndFolders();
            
            // Update storage info
            this.updateStorageInfo();
            
            Utils.showNotification('Folder permanently deleted', 'success');
        } catch (error) {
            console.error('Error permanently deleting folder:', error);
            Utils.showNotification('Error permanently deleting folder', 'error');
        }
    },
    
    // Delete child folders and files permanently
    deleteChildrenPermanently: async function(path) {
        // Delete child folders
        for (const folder of [...this.folders]) {
            if (folder.path.startsWith(path) && folder.path !== path) {
                await window.PatelDB.delete('folders', folder.id);
                this.folders = this.folders.filter(f => f.id !== folder.id);
            }
        }
        
        // Delete files
        for (const file of [...this.files]) {
            if (file.path.startsWith(path)) {
                await window.PatelDB.delete('files', file.id);
                this.files = this.files.filter(f => f.id !== file.id);
            }
        }
    },
    
    // Toggle file favorite
    toggleFileFavorite: async function(fileId) {
        try {
            const file = this.files.find(f => f.id === fileId);
            
            if (!file) {
                Utils.showNotification('File not found', 'error');
                return;
            }
            
            // Toggle favorite
            file.favorite = !file.favorite;
            
            // Update in database
            await window.PatelDB.update('files', file);
            
            // Re-render files and folders
            this.renderFilesAndFolders();
            
            Utils.showNotification(`File ${file.favorite ? 'added to' : 'removed from'} favorites`, 'success');
        } catch (error) {
            console.error('Error toggling file favorite:', error);
            Utils.showNotification('Error updating file', 'error');
        }
    },
    
    // Download file
    downloadFile: function(fileId) {
        const file = this.files.find(f => f.id === fileId);
        
        if (!file) {
            Utils.showNotification('File not found', 'error');
            return;
        }
        
        // Create download link
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    // Delete file
    deleteFile: async function(fileId) {
        if (!confirm('Are you sure you want to delete this file?')) {
            return;
        }
        
        try {
            const file = this.files.find(f => f.id === fileId);
            
            if (!file) {
                Utils.showNotification('File not found', 'error');
                return;
            }
            
            // Mark file as deleted
            file.deleted = true;
            
            // Update in database
            await window.PatelDB.update('files', file);
            
            // Re-render files and folders
            this.renderFilesAndFolders();
            
            Utils.showNotification('File moved to trash', 'success');
        } catch (error) {
            console.error('Error deleting file:', error);
            Utils.showNotification('Error deleting file', 'error');
        }
    },
    
    // Restore file
    restoreFile: async function(fileId) {
        try {
            const file = this.files.find(f => f.id === fileId);
            
            if (!file) {
                Utils.showNotification('File not found', 'error');
                return;
            }
            
            // Mark file as not deleted
            file.deleted = false;
            
            // Update in database
            await window.PatelDB.update('files', file);
            
            // Re-render files and folders
            this.renderFilesAndFolders();
            
            Utils.showNotification('File restored successfully', 'success');
        } catch (error) {
            console.error('Error restoring file:', error);
            Utils.showNotification('Error restoring file', 'error');
        }
    },
    
    // Permanently delete file
    permanentDeleteFile: async function(fileId) {
        if (!confirm('Are you sure you want to permanently delete this file? This action cannot be undone.')) {
            return;
        }
        
        try {
            const file = this.files.find(f => f.id === fileId);
            
            if (!file) {
                Utils.showNotification('File not found', 'error');
                return;
            }
            
            // Delete file from database
            await window.PatelDB.delete('files', fileId);
            
            // Remove from files array
            this.files = this.files.filter(f => f.id !== fileId);
            
            // Re-render files and folders
            this.renderFilesAndFolders();
            
            // Update storage info
            this.updateStorageInfo();
            
            Utils.showNotification('File permanently deleted', 'success');
        } catch (error) {
            console.error('Error permanently deleting file:', error);
            Utils.showNotification('Error permanently deleting file', 'error');
        }
    },
    
    // Download selected files
    downloadSelectedFiles: function() {
        // Get selected files
        const selectedFiles = this.selectedItems
            .filter(item => item.type === 'file')
            .map(item => this.files.find(file => file.id === item.id))
            .filter(file => file);
        
        if (selectedFiles.length === 0) {
            Utils.showNotification('No files selected', 'error');
            return;
        }
        
        // If only one file, download it directly
        if (selectedFiles.length === 1) {
            this.downloadFile(selectedFiles[0].id);
            return;
        }
        
        // For multiple files, create a zip file
        Utils.showNotification('Multiple file download coming soon', 'info');
        
        // In a real implementation, we would use JSZip to create a zip file
        // and then download it
    },
    
    // Delete selected files
    deleteSelectedFiles: async function() {
        if (!confirm('Are you sure you want to delete the selected items?')) {
            return;
        }
        
        try {
            // Process files
            const selectedFiles = this.selectedItems
                .filter(item => item.type === 'file')
                .map(item => this.files.find(file => file.id === item.id))
                .filter(file => file);
            
            for (const file of selectedFiles) {
                file.deleted = true;
                await window.PatelDB.update('files', file);
            }
            
            // Process folders
            const selectedFolders = this.selectedItems
                .filter(item => item.type === 'folder')
                .map(item => this.folders.find(folder => folder.id === item.id))
                .filter(folder => folder);
            
            for (const folder of selectedFolders) {
                folder.deleted = true;
                await window.PatelDB.update('folders', folder);
                await this.markChildrenAsDeleted(folder.path);
            }
            
            // Clear selection
            this.clearSelection();
            
            // Re-render files and folders
            this.renderFilesAndFolders();
            
            Utils.showNotification('Items moved to trash', 'success');
        } catch (error) {
            console.error('Error deleting items:', error);
            Utils.showNotification('Error deleting items', 'error');
        }
    },
    
    // Open share modal
    openShareModal: function() {
        this.elements.shareModal.classList.add('active');
    },
    
    // Close share modal
    closeShareModal: function() {
        this.elements.shareModal.classList.remove('active');
    },
    
    // Copy share link
    copyShareLink: function() {
        // In a real implementation, this would generate a shareable link
        // For now, just show a notification
        Utils.showNotification('Share link copied to clipboard', 'success');
        this.closeShareModal();
    },
    
    // Export selected files
    exportSelectedFiles: function() {
        // In a real implementation, this would export the selected files
        // For now, just download them
        this.downloadSelectedFiles();
        this.closeShareModal();
    },
    
    // Preview file
    previewFile: function(fileId) {
        const file = this.files.find(f => f.id === fileId);
        
        if (!file) {
            this.elements.filePreview.innerHTML = `
                <div class="empty-preview">
                    <div class="empty-preview-icon">👆</div>
                    <div class="empty-preview-text">Select a file to preview</div>
                </div>
            `;
            return;
        }
        
        let previewHtml = '';
        
        if (file.type.startsWith('image')) {
            // Image preview
            previewHtml = `
                <div class="file-preview-header">
                    <h3>${file.name}</h3>
                </div>
                <div class="file-preview-content">
                    <img src="${file.data}" alt="${file.name}" class="preview-image">
                </div>
                <div class="file-preview-info">
                    <div class="preview-info-item">
                        <span class="info-label">Type:</span>
                        <span class="info-value">${file.type}</span>
                    </div>
                    <div class="preview-info-item">
                        <span class="info-label">Size:</span>
                        <span class="info-value">${this.formatFileSize(file.size)}</span>
                    </div>
                    <div class="preview-info-item">
                        <span class="info-label">Uploaded:</span>
                        <span class="info-value">${Utils.formatDate(new Date(file.uploadedAt))}</span>
                    </div>
                </div>
            `;
        } else if (file.type.startsWith('text')) {
            // Text preview
            // Extract text content from data URL
            const base64 = file.data.split(',')[1];
            const text = atob(base64);
            
            previewHtml = `
                <div class="file-preview-header">
                    <h3>${file.name}</h3>
                </div>
                <div class="file-preview-content">
                    <pre class="preview-text">${text}</pre>
                </div>
                <div class="file-preview-info">
                    <div class="preview-info-item">
                        <span class="info-label">Type:</span>
                        <span class="info-value">${file.type}</span>
                    </div>
                    <div class="preview-info-item">
                        <span class="info-label">Size:</span>
                        <span class="info-value">${this.formatFileSize(file.size)}</span>
                    </div>
                    <div class="preview-info-item">
                        <span class="info-label">Uploaded:</span>
                        <span class="info-value">${Utils.formatDate(new Date(file.uploadedAt))}</span>
                    </div>
                </div>
            `;
        } else {
            // Generic preview
            previewHtml = `
                <div class="file-preview-header">
                    <h3>${file.name}</h3>
                </div>
                <div class="file-preview-content">
                    <div class="preview-icon">${this.getFileIcon(file.type)}</div>
                    <div class="preview-message">Preview not available</div>
                </div>
                <div class="file-preview-info">
                    <div class="preview-info-item">
                        <span class="info-label">Type:</span>
                        <span class="info-value">${file.type}</span>
                    </div>
                    <div class="preview-info-item">
                        <span class="info-label">Size:</span>
                        <span class="info-value">${this.formatFileSize(file.size)}</span>
                    </div>
                    <div class="preview-info-item">
                        <span class="info-label">Uploaded:</span>
                        <span class="info-value">${Utils.formatDate(new Date(file.uploadedAt))}</span>
                    </div>
                </div>
                <div class="preview-actions">
                    <button id="preview-download-btn" class="btn">Download</button>
                </div>
            `;
        }
        
        this.elements.filePreview.innerHTML = previewHtml;
        
        // Add event listeners to preview actions
        const downloadBtn = document.getElementById('preview-download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadFile(fileId);
            });
        }
    },
    
    // Update storage info
    updateStorageInfo: function() {
        // Calculate total storage used
        const totalSize = this.files.reduce((total, file) => total + file.size, 0);
        
        // Convert to MB
        const usedMB = totalSize / (1024 * 1024);
        const totalMB = 50; // 50 MB limit
        
        // Update progress bar
        const percentage = Math.min(100, (usedMB / totalMB) * 100);
        this.elements.storageProgress.style.width = `${percentage}%`;
        
        // Update text
        this.elements.storageText.textContent = `${usedMB.toFixed(2)} MB / ${totalMB} MB`;
    },
    
    // Check if File System Access API is supported
    checkFileSystemAccess: function() {
        if ('showDirectoryPicker' in window) {
            console.log('File System Access API is supported');
            
            // In a real implementation, we would add a button to access the file system
            // and implement the necessary functionality
        } else {
            console.log('File System Access API is not supported');
        }
    },
    
    // Get file type from filename
    getFileType: function(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        
        // Image types
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
            return `image/${extension === 'jpg' ? 'jpeg' : extension}`;
        }
        
        // Text types
        if (['txt', 'md', 'csv', 'json', 'xml', 'html', 'css', 'js'].includes(extension)) {
            return `text/${extension === 'js' ? 'javascript' : extension}`;
        }
        
        // Document types
        if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
            return `document/${extension}`;
        }
        
        // Audio types
        if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(extension)) {
            return `audio/${extension}`;
        }
        
        // Video types
        if (['mp4', 'webm', 'avi', 'mov', 'wmv'].includes(extension)) {
            return `video/${extension}`;
        }
        
        // Default
        return 'application/octet-stream';
    },
    
    // Get file icon based on type
    getFileIcon: function(type) {
        if (type.startsWith('image')) {
            return '🖼️';
        } else if (type.startsWith('text')) {
            return '📄';
        } else if (type.startsWith('document')) {
            if (type.includes('pdf')) {
                return '📕';
            } else if (type.includes('doc')) {
                return '📝';
            } else if (type.includes('xls')) {
                return '📊';
            } else if (type.includes('ppt')) {
                return '📑';
            }
            return '📄';
        } else if (type.startsWith('audio')) {
            return '🎵';
        } else if (type.startsWith('video')) {
            return '🎬';
        }
        return '📄';
    },
    
    // Format file size
    formatFileSize: function(bytes) {
        if (bytes < 1024) {
            return bytes + ' B';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + ' KB';
        } else if (bytes < 1024 * 1024 * 1024) {
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        } else {
            return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
        }
    },
    
    // Format file type
    formatFileType: function(type) {
        switch (type) {
            case 'image': return 'Images';
            case 'document': return 'Documents';
            case 'audio': return 'Audio';
            case 'video': return 'Videos';
            default: return type;
        }
    }
};

// Register module
window['fileManagerModule'] = fileManagerModule;
