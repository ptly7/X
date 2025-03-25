/**
 * Database Management for Patel Productivity Suite
 * Handles all IndexedDB operations for data storage
 */

class Database {
    constructor() {
        this.dbName = 'patel_productivity_suite';
        this.dbVersion = 1;
        this.db = null;
        this.stores = [
            { name: 'tasks', keyPath: 'id', indices: [
                { name: 'priority', keyPath: 'priority', options: { unique: false } },
                { name: 'dueDate', keyPath: 'dueDate', options: { unique: false } },
                { name: 'completed', keyPath: 'completed', options: { unique: false } }
            ]},
            { name: 'events', keyPath: 'id', indices: [
                { name: 'startDate', keyPath: 'startDate', options: { unique: false } },
                { name: 'endDate', keyPath: 'endDate', options: { unique: false } },
                { name: 'category', keyPath: 'category', options: { unique: false } }
            ]},
            { name: 'notes', keyPath: 'id', indices: [
                { name: 'createdAt', keyPath: 'createdAt', options: { unique: false } },
                { name: 'updatedAt', keyPath: 'updatedAt', options: { unique: false } },
                { name: 'tags', keyPath: 'tags', options: { unique: false, multiEntry: true } }
            ]},
            { name: 'finances', keyPath: 'id', indices: [
                { name: 'date', keyPath: 'date', options: { unique: false } },
                { name: 'category', keyPath: 'category', options: { unique: false } },
                { name: 'type', keyPath: 'type', options: { unique: false } }
            ]},
            { name: 'habits', keyPath: 'id', indices: [
                { name: 'frequency', keyPath: 'frequency', options: { unique: false } },
                { name: 'category', keyPath: 'category', options: { unique: false } }
            ]},
            { name: 'habitLogs', keyPath: 'id', indices: [
                { name: 'habitId', keyPath: 'habitId', options: { unique: false } },
                { name: 'date', keyPath: 'date', options: { unique: false } }
            ]},
            { name: 'focusSessions', keyPath: 'id', indices: [
                { name: 'startTime', keyPath: 'startTime', options: { unique: false } },
                { name: 'endTime', keyPath: 'endTime', options: { unique: false } }
            ]},
            { name: 'contacts', keyPath: 'id', indices: [
                { name: 'name', keyPath: 'name', options: { unique: false } },
                { name: 'lastContact', keyPath: 'lastContact', options: { unique: false } }
            ]},
            { name: 'files', keyPath: 'id', indices: [
                { name: 'name', keyPath: 'name', options: { unique: false } },
                { name: 'type', keyPath: 'type', options: { unique: false } },
                { name: 'createdAt', keyPath: 'createdAt', options: { unique: false } }
            ]},
            { name: 'health', keyPath: 'id', indices: [
                { name: 'date', keyPath: 'date', options: { unique: false } },
                { name: 'type', keyPath: 'type', options: { unique: false } }
            ]},
            { name: 'settings', keyPath: 'id' }
        ];
    }

    /**
     * Initialize the database
     * @returns {Promise} Promise that resolves when DB is ready
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores and indices
                this.stores.forEach(store => {
                    if (!db.objectStoreNames.contains(store.name)) {
                        const objectStore = db.createObjectStore(store.name, { keyPath: store.keyPath, autoIncrement: true });
                        
                        // Create indices if defined
                        if (store.indices) {
                            store.indices.forEach(index => {
                                objectStore.createIndex(index.name, index.keyPath, index.options);
                            });
                        }
                    }
                });
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Database initialized successfully');
                resolve(this.db);
            };
            
            request.onerror = (event) => {
                console.error('Database initialization error:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    /**
     * Add an item to a store
     * @param {string} storeName - Name of the store
     * @param {Object} item - Item to add
     * @returns {Promise} Promise that resolves with the ID of the added item
     */
    async add(storeName, item) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            // Add timestamps if not present
            if (!item.createdAt) {
                item.createdAt = new Date().toISOString();
            }
            if (!item.updatedAt) {
                item.updatedAt = new Date().toISOString();
            }
            
            const request = store.add(item);
            
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            request.onerror = (event) => {
                console.error(`Error adding item to ${storeName}:`, event.target.error);
                reject(event.target.error);
            };
        });
    }

    /**
     * Get an item from a store by ID
     * @param {string} storeName - Name of the store
     * @param {number|string} id - ID of the item
     * @returns {Promise} Promise that resolves with the item
     */
    async get(storeName, id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            request.onerror = (event) => {
                console.error(`Error getting item from ${storeName}:`, event.target.error);
                reject(event.target.error);
            };
        });
    }

    /**
     * Get all items from a store
     * @param {string} storeName - Name of the store
     * @returns {Promise} Promise that resolves with an array of items
     */
    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            request.onerror = (event) => {
                console.error(`Error getting all items from ${storeName}:`, event.target.error);
                reject(event.target.error);
            };
        });
    }

    /**
     * Update an item in a store
     * @param {string} storeName - Name of the store
     * @param {Object} item - Item to update (must include ID)
     * @returns {Promise} Promise that resolves when the item is updated
     */
    async update(storeName, item) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            // Update timestamp
            item.updatedAt = new Date().toISOString();
            
            const request = store.put(item);
            
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            request.onerror = (event) => {
                console.error(`Error updating item in ${storeName}:`, event.target.error);
                reject(event.target.error);
            };
        });
    }

    /**
     * Delete an item from a store
     * @param {string} storeName - Name of the store
     * @param {number|string} id - ID of the item
     * @returns {Promise} Promise that resolves when the item is deleted
     */
    async delete(storeName, id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            request.onsuccess = (event) => {
                resolve();
            };
            
            request.onerror = (event) => {
                console.error(`Error deleting item from ${storeName}:`, event.target.error);
                reject(event.target.error);
            };
        });
    }

    /**
     * Query items from a store using an index
     * @param {string} storeName - Name of the store
     * @param {string} indexName - Name of the index
     * @param {*} value - Value to query
     * @returns {Promise} Promise that resolves with an array of matching items
     */
    async query(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);
            
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            request.onerror = (event) => {
                console.error(`Error querying ${storeName} by ${indexName}:`, event.target.error);
                reject(event.target.error);
            };
        });
    }

    /**
     * Query items from a store using an index with a range
     * @param {string} storeName - Name of the store
     * @param {string} indexName - Name of the index
     * @param {IDBKeyRange} range - Range to query
     * @returns {Promise} Promise that resolves with an array of matching items
     */
    async queryRange(storeName, indexName, range) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(range);
            
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            request.onerror = (event) => {
                console.error(`Error range querying ${storeName} by ${indexName}:`, event.target.error);
                reject(event.target.error);
            };
        });
    }

    /**
     * Clear all data from a store
     * @param {string} storeName - Name of the store
     * @returns {Promise} Promise that resolves when the store is cleared
     */
    async clear(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();
            
            request.onsuccess = (event) => {
                resolve();
            };
            
            request.onerror = (event) => {
                console.error(`Error clearing ${storeName}:`, event.target.error);
                reject(event.target.error);
            };
        });
    }

    /**
     * Export all data from the database
     * @returns {Promise} Promise that resolves with all database data
     */
    async exportData() {
        const data = {};
        
        for (const store of this.stores) {
            data[store.name] = await this.getAll(store.name);
        }
        
        return data;
    }

    /**
     * Import data into the database
     * @param {Object} data - Data to import
     * @returns {Promise} Promise that resolves when import is complete
     */
    async importData(data) {
        for (const storeName in data) {
            if (data.hasOwnProperty(storeName)) {
                await this.clear(storeName);
                
                for (const item of data[storeName]) {
                    await this.add(storeName, item);
                }
            }
        }
    }
}

// Create and export database instance
const db = new Database();
window.PatelDB = db; // Make available globally
