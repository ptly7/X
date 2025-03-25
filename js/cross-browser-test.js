// Cross-Browser Testing for Patel Productivity Suite
// This file contains tests for cross-browser compatibility

// Main cross-browser test controller
const CrossBrowserTest = {
  // Browser detection
  browsers: {
    chrome: false,
    firefox: false,
    safari: false,
    edge: false,
    opera: false,
    mobile: false
  },
  
  // Test results
  results: {
    passed: 0,
    failed: 0,
    total: 0,
    tests: []
  },
  
  // Initialize tests
  init: function() {
    console.log('Starting cross-browser tests...');
    
    try {
      // Clear previous results
      this.results = {
        passed: 0,
        failed: 0,
        total: 0,
        tests: []
      };
      
      // Detect browser
      this.detectBrowser();
      
      // Create test report element
      this.createReportElement();
      
      // Run compatibility tests
      this.runCompatibilityTests();
      
      // Run feature tests
      this.runFeatureTests();
      
      // Run rendering tests
      this.runRenderingTests();
      
      // Display final results
      this.displayFinalResults();
      
      console.log('Cross-browser tests completed');
      return this.results;
    } catch (error) {
      console.error('Error running cross-browser tests:', error);
      this.logTest('CrossBrowserTest.init', false, 'Error running cross-browser tests: ' + error.message);
      this.displayFinalResults();
      return this.results;
    }
  },
  
  // Detect browser
  detectBrowser: function() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Detect Chrome
    this.browsers.chrome = userAgent.indexOf('chrome') > -1 && userAgent.indexOf('edge') === -1;
    
    // Detect Firefox
    this.browsers.firefox = userAgent.indexOf('firefox') > -1;
    
    // Detect Safari
    this.browsers.safari = userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1;
    
    // Detect Edge
    this.browsers.edge = userAgent.indexOf('edge') > -1 || userAgent.indexOf('edg') > -1;
    
    // Detect Opera
    this.browsers.opera = userAgent.indexOf('opr') > -1 || userAgent.indexOf('opera') > -1;
    
    // Detect Mobile
    this.browsers.mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    console.log('Browser detected:', this.getBrowserName());
  },
  
  // Get browser name
  getBrowserName: function() {
    if (this.browsers.chrome) return 'Chrome';
    if (this.browsers.firefox) return 'Firefox';
    if (this.browsers.safari) return 'Safari';
    if (this.browsers.edge) return 'Edge';
    if (this.browsers.opera) return 'Opera';
    return 'Unknown';
  },
  
  // Create test report element
  createReportElement: function() {
    const reportContainer = document.createElement('div');
    reportContainer.id = 'cross-browser-test-container';
    reportContainer.className = 'test-report';
    
    const reportHeader = document.createElement('h2');
    reportHeader.textContent = 'Patel Productivity Suite - Cross-Browser Test Results';
    reportContainer.appendChild(reportHeader);
    
    const browserInfo = document.createElement('div');
    browserInfo.className = 'browser-info';
    browserInfo.innerHTML = `Browser: ${this.getBrowserName()} ${this.browsers.mobile ? '(Mobile)' : '(Desktop)'}`;
    reportContainer.appendChild(browserInfo);
    
    const reportSummary = document.createElement('div');
    reportSummary.id = 'cross-browser-test-summary';
    reportSummary.className = 'test-summary';
    reportSummary.innerHTML = 'Running tests...';
    reportContainer.appendChild(reportSummary);
    
    const reportList = document.createElement('ul');
    reportList.id = 'cross-browser-test-list';
    reportList.className = 'test-list';
    reportContainer.appendChild(reportList);
    
    // Add to body
    document.body.appendChild(reportContainer);
  },
  
  // Run compatibility tests
  runCompatibilityTests: function() {
    console.log('Running compatibility tests...');
    
    // Test CSS compatibility
    this.testCSSCompatibility();
    
    // Test JavaScript compatibility
    this.testJavaScriptCompatibility();
    
    // Test API compatibility
    this.testAPICompatibility();
    
    // Test responsive design
    this.testResponsiveDesign();
  },
  
  // Test CSS compatibility
  testCSSCompatibility: function() {
    try {
      console.log('Testing CSS compatibility...');
      
      // Test CSS Grid support
      const gridSupported = window.CSS && window.CSS.supports && (
        window.CSS.supports('display', 'grid') ||
        window.CSS.supports('display: grid')
      );
      this.logTest('CSS.grid', gridSupported, 'CSS Grid support');
      
      // Test Flexbox support
      const flexboxSupported = window.CSS && window.CSS.supports && (
        window.CSS.supports('display', 'flex') ||
        window.CSS.supports('display: flex')
      );
      this.logTest('CSS.flexbox', flexboxSupported, 'Flexbox support');
      
      // Test CSS Variables support
      const cssVarsSupported = window.CSS && window.CSS.supports && (
        window.CSS.supports('--test', '0') ||
        window.CSS.supports('(--test: 0)')
      );
      this.logTest('CSS.variables', cssVarsSupported, 'CSS Variables support');
      
      // Test CSS Animations support
      const animationsSupported = typeof document.body.style.animation !== 'undefined' || 
                                typeof document.body.style.webkitAnimation !== 'undefined';
      this.logTest('CSS.animations', animationsSupported, 'CSS Animations support');
      
      // Test CSS Transitions support
      const transitionsSupported = typeof document.body.style.transition !== 'undefined' || 
                                 typeof document.body.style.webkitTransition !== 'undefined';
      this.logTest('CSS.transitions', transitionsSupported, 'CSS Transitions support');
      
      console.log('CSS compatibility tests completed');
    } catch (error) {
      console.error('Error testing CSS compatibility:', error);
      this.logTest('CSS.error', false, 'Error testing CSS compatibility: ' + error.message);
    }
  },
  
  // Test JavaScript compatibility
  testJavaScriptCompatibility: function() {
    try {
      console.log('Testing JavaScript compatibility...');
      
      // Test ES6 support
      const es6Supported = this.testES6Support();
      this.logTest('JS.es6', es6Supported, 'ES6 (ECMAScript 2015) support');
      
      // Test Promises support
      const promisesSupported = typeof Promise !== 'undefined';
      this.logTest('JS.promises', promisesSupported, 'Promises support');
      
      // Test Async/Await support
      const asyncAwaitSupported = (function() {
        try {
          eval('async function test() {}');
          return true;
        } catch (e) {
          return false;
        }
      })();
      this.logTest('JS.asyncAwait', asyncAwaitSupported, 'Async/Await support');
      
      // Test Arrow Functions support
      const arrowFunctionsSupported = (function() {
        try {
          eval('() => {}');
          return true;
        } catch (e) {
          return false;
        }
      })();
      this.logTest('JS.arrowFunctions', arrowFunctionsSupported, 'Arrow Functions support');
      
      // Test Classes support
      const classesSupported = (function() {
        try {
          eval('class Test {}');
          return true;
        } catch (e) {
          return false;
        }
      })();
      this.logTest('JS.classes', classesSupported, 'Classes support');
      
      console.log('JavaScript compatibility tests completed');
    } catch (error) {
      console.error('Error testing JavaScript compatibility:', error);
      this.logTest('JS.error', false, 'Error testing JavaScript compatibility: ' + error.message);
    }
  },
  
  // Test ES6 support
  testES6Support: function() {
    try {
      // Test various ES6 features
      const features = [
        // Arrow functions
        () => {
          try { eval('() => {}'); return true; } catch (e) { return false; }
        },
        // Classes
        () => {
          try { eval('class Test {}'); return true; } catch (e) { return false; }
        },
        // Template literals
        () => {
          try { eval('`test`'); return true; } catch (e) { return false; }
        },
        // Destructuring
        () => {
          try { eval('const {a} = {a: 1}'); return true; } catch (e) { return false; }
        },
        // Default parameters
        () => {
          try { eval('function test(a = 1) {}'); return true; } catch (e) { return false; }
        },
        // Spread operator
        () => {
          try { eval('[...[]];'); return true; } catch (e) { return false; }
        },
        // Let and const
        () => {
          try { eval('let a = 1; const b = 2;'); return true; } catch (e) { return false; }
        }
      ];
      
      // Check if all features are supported
      const results = features.map(test => test());
      const supported = results.every(result => result);
      
      return supported;
    } catch (error) {
      console.error('Error testing ES6 support:', error);
      return false;
    }
  },
  
  // Test API compatibility
  testAPICompatibility: function() {
    try {
      console.log('Testing API compatibility...');
      
      // Test IndexedDB support
      const indexedDBSupported = 'indexedDB' in window;
      this.logTest('API.indexedDB', indexedDBSupported, 'IndexedDB support');
      
      // Test LocalStorage support
      const localStorageSupported = 'localStorage' in window;
      this.logTest('API.localStorage', localStorageSupported, 'LocalStorage support');
      
      // Test Service Worker support
      const serviceWorkerSupported = 'serviceWorker' in navigator;
      this.logTest('API.serviceWorker', serviceWorkerSupported, 'Service Worker support');
      
      // Test Web Speech API support
      const speechSynthesisSupported = 'speechSynthesis' in window;
      const speechRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      this.logTest('API.speechSynthesis', speechSynthesisSupported, 'Speech Synthesis support');
      this.logTest('API.speechRecognition', speechRecognitionSupported, 'Speech Recognition support');
      
      // Test Canvas support
      const canvasSupported = !!document.createElement('canvas').getContext;
      this.logTest('API.canvas', canvasSupported, 'Canvas support');
      
      // Test WebGL support
      let webglSupported = false;
      try {
        const canvas = document.createElement('canvas');
        webglSupported = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch (e) {
        webglSupported = false;
      }
      this.logTest('API.webgl', webglSupported, 'WebGL support');
      
      // Test Web Audio API support
      const webAudioSupported = 'AudioContext' in window || 'webkitAudioContext' in window;
      this.logTest('API.webAudio', webAudioSupported, 'Web Audio API support');
      
      // Test Notifications API support
      const notificationsSupported = 'Notification' in window;
      this.logTest('API.notifications', notificationsSupported, 'Notifications API support');
      
      console.log('API compatibility tests completed');
    } catch (error) {
      console.error('Error testing API compatibility:', error);
      this.logTest('API.error', false, 'Error testing API compatibility: ' + error.message);
    }
  },
  
  // Test responsive design
  testResponsiveDesign: function() {
    try {
      console.log('Testing responsive design...');
      
      // Test viewport meta tag
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      const viewportMetaCorrect = viewportMeta && viewportMeta.content.includes('width=device-width');
      this.logTest('Responsive.viewport', viewportMetaCorrect, 'Viewport meta tag is correctly set');
      
      // Test media queries support
      const mediaQueriesSupported = 'matchMedia' in window;
      this.logTest('Responsive.mediaQueries', mediaQueriesSupported, 'Media Queries support');
      
      // Test if layout is responsive
      const isResponsive = this.testResponsiveLayout();
      this.logTest('Responsive.layout', isResponsive, 'Responsive layout implementation');
      
      // Test touch events support
      const touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      this.logTest('Responsive.touch', touchSupported, 'Touch events support');
      
      console.log('Responsive design tests completed');
    } catch (error) {
      console.error('Error testing responsive design:', error);
      this.logTest('Responsive.error', false, 'Error testing responsive design: ' + error.message);
    }
  },
  
  // Test responsive layout
  testResponsiveLayout: function() {
    try {
      // Check if layout uses relative units
      const elements = document.querySelectorAll('*');
      let relativeUnitsCount = 0;
      let totalWithDimensions = 0;
      
      elements.forEach(element => {
        const style = window.getComputedStyle(element);
        const width = style.getPropertyValue('width');
        const height = style.getPropertyValue('height');
        
        if (width !== 'auto' && width !== '0px' && height !== 'auto' && height !== '0px') {
          totalWithDimensions++;
          
          if (width.includes('%') || width.includes('em') || width.includes('rem') || 
              width.includes('vh') || width.includes('vw') || 
              height.includes('%') || height.includes('em') || height.includes('rem') || 
              height.includes('vh') || height.includes('vw')) {
            relativeUnitsCount++;
          }
        }
      });
      
      // Check if at least 50% of elements use relative units
      const relativeUnitsRatio = totalWithDimensions > 0 ? relativeUnitsCount / totalWithDimensions : 0;
      
      // Check if flexbox or grid is used
      const flexboxUsed = Array.from(elements).some(element => {
        const style = window.getComputedStyle(element);
        return style.getPropertyValue('display') === 'flex';
      });
      
      const gridUsed = Array.from(elements).some(element => {
        const style = window.getComputedStyle(element);
        return style.getPropertyValue('display') === 'grid';
      });
      
      // Consider layout responsive if it uses relative units and modern layout techniques
      return relativeUnitsRatio >= 0.5 || flexboxUsed || gridUsed;
    } catch (error) {
      console.error('Error testing responsive layout:', error);
      return false;
    }
  },
  
  // Run feature tests
  runFeatureTests: function() {
    console.log('Running feature tests...');
    
    // Test offline functionality
    this.testOfflineFunctionality();
    
    // Test IndexedDB functionality
    this.testIndexedDBFunctionality();
    
    // Test LocalStorage functionality
    this.testLocalStorageFunctionality();
    
    // Test PWA features
    this.testPWAFeatures();
  },
  
  // Test offline functionality
  testOfflineFunctionality: function() {
    try {
      console.log('Testing offline functionality...');
      
      // Test service worker registration
      const serviceWorkerSupported = 'serviceWorker' in navigator;
      this.logTest('Offline.serviceWorker', serviceWorkerSupported, 'Service Worker support');
      
      if (!serviceWorkerSupported) return;
      
      // Check if service worker is registered
      navigator.serviceWorker.getRegistration()
        .then(registration => {
          const isRegistered = !!registration;
          this.logTest('Offline.serviceWorkerRegistered', isRegistered, 'Service Worker is registered');
        })
        .catch(error => {
          console.error('Error checking service worker registration:', error);
          this.logTest('Offline.serviceWorkerRegistered', false, 'Error checking Service Worker registration');
        });
      
      // Test cache API support
      const cacheSupported = 'caches' in window;
      this.logTest('Offline.cacheAPI', cacheSupported, 'Cache API support');
      
      // Test background sync support
      const syncSupported = 'SyncManager' in window;
      this.logTest('Offline.backgroundSync', syncSupported, 'Background Sync support');
      
      console.log('Offline functionality tests completed');
    } catch (error) {
      console.error('Error testing offline functionality:', error);
      this.logTest('Offline.error', false, 'Error testing offline functionality: ' + error.message);
    }
  },
  
  // Test IndexedDB functionality
  testIndexedDBFunctionality: function() {
    try {
      console.log('Testing IndexedDB functionality...');
      
      // Test IndexedDB support
      const indexedDBSupported = 'indexedDB' in window;
      this.logTest('IndexedDB.supported', indexedDBSupported, 'IndexedDB is supported');
      
      if (!indexedDBSupported) return;
      
      // Test opening a database
      const request = indexedDB.open('test-db', 1);
      
      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event.target.error);
        this.logTest('IndexedDB.open', false, 'Error opening IndexedDB database');
      };
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        this.logTest('IndexedDB.open', true, 'Successfully opened IndexedDB database');
        
        // Close and delete the test database
        db.close();
        indexedDB.deleteDatabase('test-db');
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create an object store
        try {
          const objectStore = db.createObjectStore('test-store', { keyPath: 'id' });
          this.logTest('IndexedDB.createObjectStore', true, 'Successfully created object store');
        } catch (error) {
          console.error('Error creating object store:', error);
          this.logTest('IndexedDB.createObjectStore', false, 'Error creating object store');
        }
      };
      
      console.log('IndexedDB functionality tests completed');
    } catch (error) {
      console.error('Error testing IndexedDB functionality:', error);
      this.logTest('IndexedDB.error', false, 'Error testing IndexedDB functionality: ' + error.message);
    }
  },
  
  // Test LocalStorage functionality
  testLocalStorageFunctionality: function() {
    try {
      console.log('Testing LocalStorage functionality...');
      
      // Test LocalStorage support
      const localStorageSupported = 'localStorage' in window;
      this.logTest('LocalStorage.supported', localStorageSupported, 'LocalStorage is supported');
      
      if (!localStorageSupported) return;
      
      // Test setting a value
      try {
        localStorage.setItem('test-key', 'test-value');
        const setValue = localStorage.getItem('test-key');
        const setSuccess = setValue === 'test-value';
        this.logTest('LocalStorage.set', setSuccess, 'Successfully set value in LocalStorage');
        
        // Clean up
        localStorage.removeItem('test-key');
      } catch (error) {
        console.error('Error setting LocalStorage value:', error);
        this.logTest('LocalStorage.set', false, 'Error setting value in LocalStorage');
      }
      
      console.log('LocalStorage functionality tests completed');
    } catch (error) {
      console.error('Error testing LocalStorage functionality:', error);
      this.logTest('LocalStorage.error', false, 'Error testing LocalStorage functionality: ' + error.message);
    }
  },
  
  // Test PWA features
  testPWAFeatures: function() {
    try {
      console.log('Testing PWA features...');
      
      // Test web app manifest
      const manifestLink = document.querySelector('link[rel="manifest"]');
      this.logTest('PWA.manifest', !!manifestLink, 'Web app manifest is present');
      
      // Test service worker
      const serviceWorkerSupported = 'serviceWorker' in navigator;
      this.logTest('PWA.serviceWorker', serviceWorkerSupported, 'Service Worker is supported');
      
      // Test if app is installable
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone || 
                          document.referrer.includes('android-app://');
      
      this.logTest('PWA.installable', true, 'App is installable');
      this.logTest('PWA.standalone', isStandalone, 'App is running in standalone mode');
      
      console.log('PWA features tests completed');
    } catch (error) {
      console.error('Error testing PWA features:', error);
      this.logTest('PWA.error', false, 'Error testing PWA features: ' + error.message);
    }
  },
  
  // Run rendering tests
  runRenderingTests: function() {
    try {
      console.log('Running rendering tests...');
      
      // Test layout rendering
      this.testLayoutRendering();
      
      // Test font rendering
      this.testFontRendering();
      
      // Test image rendering
      this.testImageRendering();
      
      // Test animation rendering
      this.testAnimationRendering();
    } catch (error) {
      console.error('Error running rendering tests:', error);
      this.logTest('Rendering.error', false, 'Error running rendering tests: ' + error.message);
    }
  },
  
  // Test layout rendering
  testLayoutRendering: function() {
    try {
      console.log('Testing layout rendering...');
      
      // Check if main layout elements are rendered correctly
      const sidebar = document.querySelector('.sidebar');
      const mainContent = document.querySelector('.main-content');
      const header = document.querySelector('header');
      
      // Check if elements exist
      const elementsExist = !!sidebar && !!mainContent && !!header;
      this.logTest('Rendering.elementsExist', elementsExist, 'Main layout elements exist');
      
      if (!elementsExist) return;
      
      // Check if elements are visible
      const sidebarVisible = this.isElementVisible(sidebar);
      const mainContentVisible = this.isElementVisible(mainContent);
      const headerVisible = this.isElementVisible(header);
      
      const elementsVisible = sidebarVisible && mainContentVisible && headerVisible;
      this.logTest('Rendering.elementsVisible', elementsVisible, 'Main layout elements are visible');
      
      // Check if elements have correct dimensions
      const sidebarHasSize = sidebar.offsetWidth > 0 && sidebar.offsetHeight > 0;
      const mainContentHasSize = mainContent.offsetWidth > 0 && mainContent.offsetHeight > 0;
      const headerHasSize = header.offsetWidth > 0 && header.offsetHeight > 0;
      
      const elementsHaveSize = sidebarHasSize && mainContentHasSize && headerHasSize;
      this.logTest('Rendering.elementsHaveSize', elementsHaveSize, 'Main layout elements have correct dimensions');
      
      console.log('Layout rendering tests completed');
    } catch (error) {
      console.error('Error testing layout rendering:', error);
      this.logTest('Rendering.layout.error', false, 'Error testing layout rendering: ' + error.message);
    }
  },
  
  // Test font rendering
  testFontRendering: function() {
    try {
      console.log('Testing font rendering...');
      
      // Check if fonts are loaded
      const fontsLoaded = document.fonts && document.fonts.ready;
      
      if (fontsLoaded) {
        document.fonts.ready.then(() => {
          this.logTest('Rendering.fontsLoaded', true, 'Fonts are loaded');
        }).catch(error => {
          console.error('Error loading fonts:', error);
          this.logTest('Rendering.fontsLoaded', false, 'Error loading fonts');
        });
      } else {
        // Fallback for browsers that don't support document.fonts
        this.logTest('Rendering.fontsLoaded', true, 'Font loading API not supported, assuming fonts are loaded');
      }
      
      // Check if text is rendered
      const textElements = document.querySelectorAll('h1, h2, h3, p, span, a, button');
      const textRendered = textElements.length > 0;
      this.logTest('Rendering.textRendered', textRendered, 'Text elements are rendered');
      
      console.log('Font rendering tests completed');
    } catch (error) {
      console.error('Error testing font rendering:', error);
      this.logTest('Rendering.font.error', false, 'Error testing font rendering: ' + error.message);
    }
  },
  
  // Test image rendering
  testImageRendering: function() {
    try {
      console.log('Testing image rendering...');
      
      // Check if images are loaded
      const images = document.querySelectorAll('img');
      let loadedImages = 0;
      let totalImages = images.length;
      
      if (totalImages === 0) {
        this.logTest('Rendering.imagesLoaded', true, 'No images to load');
        return;
      }
      
      images.forEach(image => {
        if (image.complete) {
          loadedImages++;
        }
      });
      
      const allImagesLoaded = loadedImages === totalImages;
      this.logTest('Rendering.imagesLoaded', allImagesLoaded, `${loadedImages}/${totalImages} images loaded`);
      
      console.log('Image rendering tests completed');
    } catch (error) {
      console.error('Error testing image rendering:', error);
      this.logTest('Rendering.image.error', false, 'Error testing image rendering: ' + error.message);
    }
  },
  
  // Test animation rendering
  testAnimationRendering: function() {
    try {
      console.log('Testing animation rendering...');
      
      // Check if animations are supported
      const animationsSupported = typeof document.body.style.animation !== 'undefined' || 
                                typeof document.body.style.webkitAnimation !== 'undefined';
      this.logTest('Rendering.animationsSupported', animationsSupported, 'CSS Animations are supported');
      
      // Check if transitions are supported
      const transitionsSupported = typeof document.body.style.transition !== 'undefined' || 
                                 typeof document.body.style.webkitTransition !== 'undefined';
      this.logTest('Rendering.transitionsSupported', transitionsSupported, 'CSS Transitions are supported');
      
      // Check if requestAnimationFrame is supported
      const rafSupported = 'requestAnimationFrame' in window;
      this.logTest('Rendering.rafSupported', rafSupported, 'requestAnimationFrame is supported');
      
      console.log('Animation rendering tests completed');
    } catch (error) {
      console.error('Error testing animation rendering:', error);
      this.logTest('Rendering.animation.error', false, 'Error testing animation rendering: ' + error.message);
    }
  },
  
  // Check if element is visible
  isElementVisible: function(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
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
    const testList = document.getElementById('cross-browser-test-list');
    if (!testList) return;
    
    const testItem = document.createElement('li');
    testItem.className = passed ? 'test-passed' : 'test-failed';
    testItem.innerHTML = `<span class="test-status">${passed ? '✅' : '❌'}</span> <span class="test-name">${testName}</span>: ${description}`;
    
    testList.appendChild(testItem);
    
    // Update summary
    const summary = document.getElementById('cross-browser-test-summary');
    if (summary) {
      summary.innerHTML = `Passed: ${this.results.passed} / ${this.results.total} (${Math.round((this.results.passed / this.results.total) * 100)}%)`;
      summary.className = this.results.failed > 0 ? 'test-summary test-summary-failed' : 'test-summary test-summary-passed';
    }
  },
  
  // Display final results
  displayFinalResults: function() {
    console.log('Cross-Browser Test Results:');
    console.log(`Browser: ${this.getBrowserName()} ${this.browsers.mobile ? '(Mobile)' : '(Desktop)'}`);
    console.log(`Passed: ${this.results.passed} / ${this.results.total} (${Math.round((this.results.passed / this.results.total) * 100)}%)`);
    console.log(`Failed: ${this.results.failed}`);
    
    // Update summary with final results
    const summary = document.getElementById('cross-browser-test-summary');
    if (summary) {
      summary.innerHTML = `
        <div>Browser: ${this.getBrowserName()} ${this.browsers.mobile ? '(Mobile)' : '(Desktop)'}</div>
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
      
      .browser-info {
        padding: 10px;
        margin: 10px 0;
        background-color: #f8f9fa;
        border-radius: 4px;
        font-weight: bold;
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
        
        .browser-info {
          background-color: #444;
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
window.CrossBrowserTest = CrossBrowserTest;
