// Offline Support for Patel Productivity Suite

// This file implements additional offline support functionality
// to ensure the app works seamlessly without an internet connection

const OfflineSupport = {
  // Initialize offline support
  init: function() {
    console.log('Initializing offline support...');
    
    // Register service worker
    this.registerServiceWorker();
    
    // Setup offline detection
    this.setupOfflineDetection();
    
    // Setup background sync
    this.setupBackgroundSync();
    
    // Setup app installation prompt
    this.setupInstallPrompt();
    
    console.log('Offline support initialized');
  },
  
  // Register service worker
  registerServiceWorker: function() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker/sw.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              console.log('Service Worker update found!');
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is installed but waiting to activate
                  this.showUpdateNotification();
                }
              });
            });
          })
          .catch(error => {
            console.error('ServiceWorker registration failed: ', error);
          });
          
        // Handle service worker updates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service Worker controller changed');
        });
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', event => {
          console.log('Message from Service Worker: ', event.data);
          
          if (event.data && event.data.type === 'SYNC_COMPLETE') {
            console.log('Background sync completed at: ', event.data.timestamp);
            this.showSyncNotification();
          }
        });
      });
    } else {
      console.warn('Service workers are not supported in this browser');
    }
  },
  
  // Setup offline detection
  setupOfflineDetection: function() {
    // Update UI based on current online status
    this.updateOfflineStatus();
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('App is online');
      this.updateOfflineStatus();
      this.triggerBackgroundSync();
    });
    
    window.addEventListener('offline', () => {
      console.log('App is offline');
      this.updateOfflineStatus();
    });
  },
  
  // Update UI based on offline status
  updateOfflineStatus: function() {
    const isOnline = navigator.onLine;
    
    // Update status indicator
    const statusIndicator = document.getElementById('connection-status');
    if (statusIndicator) {
      statusIndicator.className = isOnline ? 'status-online' : 'status-offline';
      statusIndicator.textContent = isOnline ? 'Online' : 'Offline';
    }
    
    // Add/remove offline class from body
    if (isOnline) {
      document.body.classList.remove('offline-mode');
    } else {
      document.body.classList.add('offline-mode');
      this.showOfflineNotification();
    }
  },
  
  // Setup background sync
  setupBackgroundSync: function() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      console.log('Background Sync is supported');
      
      // Register sync event listener on database changes
      window.addEventListener('db-changed', () => {
        if (navigator.onLine) {
          console.log('Database changed while online, no need for background sync');
        } else {
          console.log('Database changed while offline, registering for background sync');
          this.registerBackgroundSync();
        }
      });
    } else {
      console.warn('Background Sync is not supported in this browser');
    }
  },
  
  // Register for background sync
  registerBackgroundSync: function() {
    navigator.serviceWorker.ready
      .then(registration => {
        return registration.sync.register('sync-data');
      })
      .then(() => {
        console.log('Background sync registered');
      })
      .catch(error => {
        console.error('Background sync registration failed: ', error);
      });
  },
  
  // Trigger background sync manually
  triggerBackgroundSync: function() {
    if (navigator.onLine) {
      navigator.serviceWorker.ready
        .then(registration => {
          return registration.sync.register('sync-data');
        })
        .then(() => {
          console.log('Manual background sync triggered');
        })
        .catch(error => {
          console.error('Manual background sync failed: ', error);
        });
    }
  },
  
  // Setup app installation prompt
  setupInstallPrompt: function() {
    // Store the install prompt event
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', event => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      event.preventDefault();
      
      // Store the event for later use
      deferredPrompt = event;
      
      // Show install button
      this.showInstallButton(deferredPrompt);
    });
    
    // Listen for app installed event
    window.addEventListener('appinstalled', event => {
      console.log('App was installed');
      this.hideInstallButton();
    });
  },
  
  // Show install button
  showInstallButton: function(deferredPrompt) {
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'block';
      
      installButton.addEventListener('click', () => {
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice
          .then(choiceResult => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
            } else {
              console.log('User dismissed the install prompt');
            }
            
            // Clear the deferred prompt
            deferredPrompt = null;
          });
      });
    }
  },
  
  // Hide install button
  hideInstallButton: function() {
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'none';
    }
  },
  
  // Show update notification
  showUpdateNotification: function() {
    const notification = document.getElementById('update-notification');
    if (notification) {
      notification.style.display = 'block';
      
      const updateButton = document.getElementById('update-button');
      if (updateButton) {
        updateButton.addEventListener('click', () => {
          // Send message to service worker to skip waiting
          navigator.serviceWorker.controller.postMessage({
            type: 'SKIP_WAITING'
          });
          
          // Hide notification
          notification.style.display = 'none';
        });
      }
      
      const dismissButton = document.getElementById('dismiss-update-button');
      if (dismissButton) {
        dismissButton.addEventListener('click', () => {
          notification.style.display = 'none';
        });
      }
    }
  },
  
  // Show offline notification
  showOfflineNotification: function() {
    const notification = document.createElement('div');
    notification.className = 'offline-notification';
    notification.textContent = 'You are currently offline. The app will continue to work, and changes will sync when you reconnect.';
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => {
      document.body.removeChild(notification);
    });
    
    notification.appendChild(closeButton);
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 5000);
  },
  
  // Show sync notification
  showSyncNotification: function() {
    const notification = document.createElement('div');
    notification.className = 'sync-notification';
    notification.textContent = 'Your changes have been synchronized.';
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => {
      document.body.removeChild(notification);
    });
    
    notification.appendChild(closeButton);
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  }
};

// Export module
window.OfflineSupport = OfflineSupport;
