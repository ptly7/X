/* PatelBot Module for Patel Productivity Suite */

const patelbotModule = {
    // Store DOM elements
    elements: {},
    
    // Bot state
    state: {
        isActive: false,
        isSpeaking: false,
        messages: [],
        suggestions: [],
        currentSuggestion: null,
        lastInteraction: null
    },
    
    // Bot data
    data: {
        quotes: [],
        jokes: [],
        tips: [],
        greetings: [],
        responses: {}
    },
    
    // Initialize the module
    init: async function(container) {
        console.log('Initializing PatelBot module');
        
        // Render the module UI
        this.render(container);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load bot data
        await this.loadBotData();
        
        // Initialize speech recognition if available
        this.initSpeechRecognition();
        
        // Initialize speech synthesis
        this.initSpeechSynthesis();
        
        // Show welcome message
        this.showWelcomeMessage();
        
        // Start suggestion timer
        this.startSuggestionTimer();
    },
    
    // Render the module UI
    render: function(container) {
        container.innerHTML = `
            <div class="module-header">
                <h2>PatelBot</h2>
                <div class="module-actions">
                    <button id="patelbot-settings-btn" class="btn">Settings</button>
                </div>
            </div>
            
            <div class="patelbot-container">
                <div class="patelbot-sidebar">
                    <div class="patelbot-avatar">
                        <img src="assets/patelbot-avatar.svg" alt="PatelBot Avatar">
                        <div class="patelbot-status" id="patelbot-status"></div>
                    </div>
                    <div class="patelbot-controls">
                        <button id="patelbot-quote-btn" class="patelbot-action-btn">
                            <span class="icon">💬</span>
                            <span class="label">Quote</span>
                        </button>
                        <button id="patelbot-joke-btn" class="patelbot-action-btn">
                            <span class="icon">😂</span>
                            <span class="label">Joke</span>
                        </button>
                        <button id="patelbot-tip-btn" class="patelbot-action-btn">
                            <span class="icon">💡</span>
                            <span class="label">Tip</span>
                        </button>
                        <button id="patelbot-help-btn" class="patelbot-action-btn">
                            <span class="icon">❓</span>
                            <span class="label">Help</span>
                        </button>
                    </div>
                    <div class="patelbot-voice-controls">
                        <button id="patelbot-mic-btn" class="patelbot-voice-btn">
                            <span class="icon">🎤</span>
                        </button>
                        <button id="patelbot-speak-btn" class="patelbot-voice-btn">
                            <span class="icon">🔊</span>
                        </button>
                    </div>
                </div>
                
                <div class="patelbot-main">
                    <div class="patelbot-chat" id="patelbot-chat">
                        <!-- Chat messages will be displayed here -->
                    </div>
                    
                    <div class="patelbot-input">
                        <input type="text" id="patelbot-message-input" placeholder="Ask PatelBot anything...">
                        <button id="patelbot-send-btn">Send</button>
                    </div>
                    
                    <div class="patelbot-suggestions" id="patelbot-suggestions">
                        <!-- Suggestions will be displayed here -->
                    </div>
                </div>
            </div>
            
            <!-- Settings Modal -->
            <div id="patelbot-settings-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>PatelBot Settings</h3>
                    <form id="patelbot-settings-form">
                        <div class="form-group">
                            <label for="patelbot-name">Bot Name</label>
                            <input type="text" id="patelbot-name" value="PatelBot">
                        </div>
                        <div class="form-group">
                            <label for="patelbot-voice">Voice</label>
                            <select id="patelbot-voice">
                                <!-- Voice options will be populated dynamically -->
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="patelbot-speech-rate">Speech Rate</label>
                            <input type="range" id="patelbot-speech-rate" min="0.5" max="2" step="0.1" value="1">
                            <div class="range-value" id="speech-rate-value">1</div>
                        </div>
                        <div class="form-group">
                            <label for="patelbot-speech-pitch">Speech Pitch</label>
                            <input type="range" id="patelbot-speech-pitch" min="0.5" max="2" step="0.1" value="1">
                            <div class="range-value" id="speech-pitch-value">1</div>
                        </div>
                        <div class="form-group">
                            <label>Features</label>
                            <div class="checkbox-group">
                                <label>
                                    <input type="checkbox" id="patelbot-auto-suggestions" checked>
                                    Auto Suggestions
                                </label>
                                <label>
                                    <input type="checkbox" id="patelbot-voice-response" checked>
                                    Voice Responses
                                </label>
                                <label>
                                    <input type="checkbox" id="patelbot-idle-messages" checked>
                                    Idle Messages
                                </label>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" id="patelbot-settings-cancel-btn" class="btn">Cancel</button>
                            <button type="submit" id="patelbot-settings-save-btn" class="btn primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Store DOM elements
        this.elements = {
            patelbotChat: document.getElementById('patelbot-chat'),
            patelbotStatus: document.getElementById('patelbot-status'),
            patelbotMessageInput: document.getElementById('patelbot-message-input'),
            patelbotSendBtn: document.getElementById('patelbot-send-btn'),
            patelbotMicBtn: document.getElementById('patelbot-mic-btn'),
            patelbotSpeakBtn: document.getElementById('patelbot-speak-btn'),
            patelbotQuoteBtn: document.getElementById('patelbot-quote-btn'),
            patelbotJokeBtn: document.getElementById('patelbot-joke-btn'),
            patelbotTipBtn: document.getElementById('patelbot-tip-btn'),
            patelbotHelpBtn: document.getElementById('patelbot-help-btn'),
            patelbotSuggestions: document.getElementById('patelbot-suggestions'),
            patelbotSettingsBtn: document.getElementById('patelbot-settings-btn'),
            patelbotSettingsModal: document.getElementById('patelbot-settings-modal'),
            patelbotSettingsForm: document.getElementById('patelbot-settings-form'),
            patelbotName: document.getElementById('patelbot-name'),
            patelbotVoice: document.getElementById('patelbot-voice'),
            patelbotSpeechRate: document.getElementById('patelbot-speech-rate'),
            patelbotSpeechPitch: document.getElementById('patelbot-speech-pitch'),
            speechRateValue: document.getElementById('speech-rate-value'),
            speechPitchValue: document.getElementById('speech-pitch-value'),
            patelbotAutoSuggestions: document.getElementById('patelbot-auto-suggestions'),
            patelbotVoiceResponse: document.getElementById('patelbot-voice-response'),
            patelbotIdleMessages: document.getElementById('patelbot-idle-messages'),
            patelbotSettingsCancelBtn: document.getElementById('patelbot-settings-cancel-btn'),
            patelbotSettingsSaveBtn: document.getElementById('patelbot-settings-save-btn'),
            settingsCloseModal: document.querySelector('#patelbot-settings-modal .close-modal')
        };
        
        // Set initial status
        this.updateStatus('active');
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Send message
        this.elements.patelbotSendBtn.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Send message on Enter key
        this.elements.patelbotMessageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Microphone button
        this.elements.patelbotMicBtn.addEventListener('click', () => {
            this.toggleSpeechRecognition();
        });
        
        // Speak button
        this.elements.patelbotSpeakBtn.addEventListener('click', () => {
            this.toggleSpeech();
        });
        
        // Quote button
        this.elements.patelbotQuoteBtn.addEventListener('click', () => {
            this.showRandomQuote();
        });
        
        // Joke button
        this.elements.patelbotJokeBtn.addEventListener('click', () => {
            this.showRandomJoke();
        });
        
        // Tip button
        this.elements.patelbotTipBtn.addEventListener('click', () => {
            this.showRandomTip();
        });
        
        // Help button
        this.elements.patelbotHelpBtn.addEventListener('click', () => {
            this.showHelp();
        });
        
        // Settings button
        this.elements.patelbotSettingsBtn.addEventListener('click', () => {
            this.openSettingsModal();
        });
        
        // Settings modal
        this.elements.settingsCloseModal.addEventListener('click', () => {
            this.closeSettingsModal();
        });
        
        this.elements.patelbotSettingsCancelBtn.addEventListener('click', () => {
            this.closeSettingsModal();
        });
        
        this.elements.patelbotSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
        
        // Speech rate slider
        this.elements.patelbotSpeechRate.addEventListener('input', () => {
            this.elements.speechRateValue.textContent = this.elements.patelbotSpeechRate.value;
        });
        
        // Speech pitch slider
        this.elements.patelbotSpeechPitch.addEventListener('input', () => {
            this.elements.speechPitchValue.textContent = this.elements.patelbotSpeechPitch.value;
        });
    },
    
    // Load bot data
    loadBotData: async function() {
        try {
            // Load data from database
            const botData = await window.PatelDB.get('settings', 'patelbot_data');
            
            if (botData) {
                this.data = botData;
            } else {
                // Load default data
                await this.loadDefaultData();
            }
            
            // Load settings
            const settings = await window.PatelDB.get('settings', 'patelbot_settings');
            
            if (settings) {
                this.elements.patelbotName.value = settings.name;
                this.elements.patelbotSpeechRate.value = settings.speechRate;
                this.elements.speechRateValue.textContent = settings.speechRate;
                this.elements.patelbotSpeechPitch.value = settings.speechPitch;
                this.elements.speechPitchValue.textContent = settings.speechPitch;
                this.elements.patelbotAutoSuggestions.checked = settings.autoSuggestions;
                this.elements.patelbotVoiceResponse.checked = settings.voiceResponse;
                this.elements.patelbotIdleMessages.checked = settings.idleMessages;
                
                // Set selected voice (will be applied when voices are loaded)
                if (settings.voice) {
                    this.selectedVoice = settings.voice;
                }
            }
        } catch (error) {
            console.error('Error loading bot data:', error);
            
            // Load default data
            await this.loadDefaultData();
        }
    },
    
    // Load default data
    loadDefaultData: async function() {
        // Default quotes
        this.data.quotes = [
            "The best way to predict the future is to create it. - Abraham Lincoln",
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Believe you can and you're halfway there. - Theodore Roosevelt",
            "It does not matter how slowly you go as long as you do not stop. - Confucius",
            "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
            "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
            "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
            "The secret of getting ahead is getting started. - Mark Twain",
            "Quality is not an act, it is a habit. - Aristotle",
            "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
            "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
            "The way to get started is to quit talking and begin doing. - Walt Disney",
            "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
            "The harder you work for something, the greater you'll feel when you achieve it. - Unknown",
            "If you want to achieve greatness stop asking for permission. - Unknown",
            "The only place where success comes before work is in the dictionary. - Vidal Sassoon",
            "Don't be afraid to give up the good to go for the great. - John D. Rockefeller",
            "The difference between ordinary and extraordinary is that little extra. - Jimmy Johnson",
            "The best revenge is massive success. - Frank Sinatra",
            "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson"
        ];
        
        // Default jokes
        this.data.jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            "I told my wife she was drawing her eyebrows too high. She looked surprised.",
            "What do you call a fake noodle? An impasta!",
            "How does a penguin build its house? Igloos it together!",
            "Why don't eggs tell jokes? They'd crack each other up!",
            "I'm reading a book about anti-gravity. It's impossible to put down!",
            "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them!",
            "Why don't skeletons fight each other? They don't have the guts!",
            "What do you call a bear with no teeth? A gummy bear!",
            "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
            "Why did the bicycle fall over? Because it was two-tired!",
            "How do you organize a space party? You planet!",
            "What do you call a parade of rabbits hopping backwards? A receding hare-line!",
            "Why did the tomato turn red? Because it saw the salad dressing!",
            "What's orange and sounds like a parrot? A carrot!",
            "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
            "What do you call a fish with no eyes? Fsh!",
            "Why did the invisible man turn down the job offer? He couldn't see himself doing it!",
            "What do you get when you cross a snowman and a vampire? Frostbite!"
        ];
        
        // Default productivity tips
        this.data.tips = [
            "Use the Pomodoro Technique: Work for 25 minutes, then take a 5-minute break.",
            "Plan your day the night before to hit the ground running in the morning.",
            "Tackle your most challenging task first thing in the morning when your energy is highest.",
            "Use the 2-minute rule: If a task takes less than 2 minutes, do it immediately.",
            "Block distracting websites during your work hours to maintain focus.",
            "Keep a clean and organized workspace to reduce mental clutter.",
            "Use the Eisenhower Matrix to prioritize tasks by urgency and importance.",
            "Practice time-blocking: Schedule specific time slots for different types of work.",
            "Take regular breaks to maintain mental freshness and prevent burnout.",
            "Use the 5-second rule: Count down from 5 and then take immediate action.",
            "Set SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound.",
            "Practice single-tasking instead of multitasking for better focus and quality.",
            "Use the 80/20 rule: Focus on the 20% of tasks that produce 80% of results.",
            "Keep a distraction list: Note down random thoughts to address later.",
            "Try the 'touch it once' principle: Deal with emails and messages immediately.",
            "Use the 'if-then' planning technique to build new habits.",
            "Schedule regular review sessions to evaluate your progress and adjust your approach.",
            "Use the 'Swiss cheese' method: Break large tasks into smaller, manageable holes.",
            "Practice the 'one more task' rule before ending your workday.",
            "End each day by writing down three things you accomplished and three priorities for tomorrow."
        ];
        
        // Default greetings
        this.data.greetings = [
            "Hello! How can I assist you today?",
            "Hi there! What can I help you with?",
            "Greetings! How may I be of service?",
            "Good day! How can I make your day more productive?",
            "Hey! Ready to boost your productivity?",
            "Welcome back! What's on your agenda today?",
            "Hello! I'm here to help you stay productive and motivated!",
            "Hi! Need some assistance or motivation today?",
            "Greetings! Let's make today a productive day!",
            "Hello! I'm your productivity assistant. How can I help?"
        ];
        
        // Default responses
        this.data.responses = {
            unknown: [
                "I'm not sure I understand. Could you rephrase that?",
                "I'm still learning. Could you try asking in a different way?",
                "I don't have an answer for that yet. Is there something else I can help with?",
                "I'm not programmed to respond to that. Can I help you with something else?",
                "I'm afraid I don't have information on that. Would you like a productivity tip instead?"
            ],
            thanks: [
                "You're welcome! Happy to help!",
                "Anytime! That's what I'm here for!",
                "My pleasure! Need anything else?",
                "Glad I could assist! Let me know if you need more help!",
                "You're welcome! Have a productive day!"
            ],
            greeting: [
                "Hello! How can I assist you today?",
                "Hi there! What can I help you with?",
                "Greetings! How may I be of service?",
                "Good day! How can I make your day more productive?",
                "Hey! Ready to boost your productivity?"
            ],
            goodbye: [
                "Goodbye! Have a productive day!",
                "See you later! Stay motivated!",
                "Farewell! Don't forget to take breaks!",
                "Bye for now! Remember to celebrate your wins, no matter how small!",
                "Until next time! Keep up the great work!"
            ],
            help: [
                "I can provide motivational quotes, jokes, and productivity tips. Just ask!",
                "Need help? I can offer quotes, jokes, productivity tips, or just chat!",
                "I'm here to motivate and assist you. Try asking for a quote, joke, or tip!",
                "I can help with motivation, entertainment, and productivity advice. What do you need?",
                "Ask me for a quote, joke, or productivity tip. Or just chat with me for a break!"
            ]
        };
        
        // Save to database
        await window.PatelDB.put('settings', this.data, 'patelbot_data');
    },
    
    // Initialize speech recognition
    initSpeechRecognition: function() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            
            this.recognition.onstart = () => {
                this.updateStatus('listening');
                this.elements.patelbotMicBtn.classList.add('active');
            };
            
            this.recognition.onend = () => {
                this.updateStatus('active');
                this.elements.patelbotMicBtn.classList.remove('active');
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.elements.patelbotMessageInput.value = transcript;
                this.sendMessage();
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateStatus('active');
                this.elements.patelbotMicBtn.classList.remove('active');
                
                if (event.error === 'not-allowed') {
                    this.addBotMessage("I need microphone permission to use voice recognition. Please enable it in your browser settings.");
                }
            };
        } else {
            console.log('Speech recognition not supported');
            this.elements.patelbotMicBtn.disabled = true;
            this.elements.patelbotMicBtn.title = 'Speech recognition not supported in this browser';
        }
    },
    
    // Initialize speech synthesis
    initSpeechSynthesis: function() {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
            
            // Get available voices
            this.loadVoices();
            
            // Chrome loads voices asynchronously
            if (this.synthesis.onvoiceschanged !== undefined) {
                this.synthesis.onvoiceschanged = this.loadVoices.bind(this);
            }
        } else {
            console.log('Speech synthesis not supported');
            this.elements.patelbotSpeakBtn.disabled = true;
            this.elements.patelbotSpeakBtn.title = 'Speech synthesis not supported in this browser';
        }
    },
    
    // Load available voices
    loadVoices: function() {
        if (!this.synthesis) return;
        
        // Get voices
        const voices = this.synthesis.getVoices();
        
        // Clear select options
        this.elements.patelbotVoice.innerHTML = '';
        
        // Add voices to select
        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            
            // Set selected voice
            if (this.selectedVoice && voice.name === this.selectedVoice) {
                option.selected = true;
            }
            
            this.elements.patelbotVoice.appendChild(option);
        });
        
        // If no voice is selected, select the first one
        if (this.elements.patelbotVoice.selectedIndex === -1 && voices.length > 0) {
            this.elements.patelbotVoice.selectedIndex = 0;
        }
    },
    
    // Show welcome message
    showWelcomeMessage: function() {
        // Get random greeting
        const greeting = this.getRandomItem(this.data.greetings);
        
        // Add bot message
        this.addBotMessage(greeting);
        
        // Speak greeting if voice response is enabled
        if (this.elements.patelbotVoiceResponse.checked) {
            this.speak(greeting);
        }
    },
    
    // Start suggestion timer
    startSuggestionTimer: function() {
        // Clear existing timer
        if (this.suggestionTimer) {
            clearInterval(this.suggestionTimer);
        }
        
        // Set timer to show suggestions every 5 minutes
        this.suggestionTimer = setInterval(() => {
            if (this.elements.patelbotAutoSuggestions.checked) {
                this.showSuggestions();
            }
        }, 5 * 60 * 1000); // 5 minutes
        
        // Show initial suggestions
        this.showSuggestions();
    },
    
    // Show suggestions
    showSuggestions: function() {
        // Clear existing suggestions
        this.elements.patelbotSuggestions.innerHTML = '';
        
        // Generate random suggestions
        const suggestions = [
            { type: 'quote', text: 'Get a motivational quote' },
            { type: 'joke', text: 'Hear a joke' },
            { type: 'tip', text: 'Get a productivity tip' },
            { type: 'help', text: 'See what I can do' }
        ];
        
        // Shuffle suggestions
        this.shuffleArray(suggestions);
        
        // Take first 3 suggestions
        this.state.suggestions = suggestions.slice(0, 3);
        
        // Add suggestions to UI
        this.state.suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-item';
            suggestionElement.textContent = suggestion.text;
            suggestionElement.addEventListener('click', () => {
                this.handleSuggestion(suggestion.type);
            });
            
            this.elements.patelbotSuggestions.appendChild(suggestionElement);
        });
    },
    
    // Handle suggestion click
    handleSuggestion: function(type) {
        switch (type) {
            case 'quote':
                this.showRandomQuote();
                break;
            case 'joke':
                this.showRandomJoke();
                break;
            case 'tip':
                this.showRandomTip();
                break;
            case 'help':
                this.showHelp();
                break;
        }
    },
    
    // Send message
    sendMessage: function() {
        const message = this.elements.patelbotMessageInput.value.trim();
        
        if (message === '') return;
        
        // Add user message
        this.addUserMessage(message);
        
        // Clear input
        this.elements.patelbotMessageInput.value = '';
        
        // Process message
        this.processMessage(message);
        
        // Update last interaction time
        this.state.lastInteraction = new Date();
    },
    
    // Process message
    processMessage: function(message) {
        // Convert to lowercase for easier matching
        const lowerMessage = message.toLowerCase();
        
        // Check for keywords
        if (this.containsAny(lowerMessage, ['hello', 'hi', 'hey', 'greetings'])) {
            this.respondWithGreeting();
        } else if (this.containsAny(lowerMessage, ['bye', 'goodbye', 'see you', 'farewell'])) {
            this.respondWithGoodbye();
        } else if (this.containsAny(lowerMessage, ['thank', 'thanks', 'appreciate'])) {
            this.respondWithThanks();
        } else if (this.containsAny(lowerMessage, ['help', 'assist', 'what can you do', 'capabilities'])) {
            this.showHelp();
        } else if (this.containsAny(lowerMessage, ['quote', 'quotes', 'inspiration', 'motivate', 'motivation'])) {
            this.showRandomQuote();
        } else if (this.containsAny(lowerMessage, ['joke', 'jokes', 'funny', 'laugh', 'humor'])) {
            this.showRandomJoke();
        } else if (this.containsAny(lowerMessage, ['tip', 'tips', 'advice', 'productivity', 'suggestion'])) {
            this.showRandomTip();
        } else {
            // Unknown command
            this.respondWithUnknown();
        }
    },
    
    // Add user message
    addUserMessage: function(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message user-message';
        messageElement.innerHTML = `
            <div class="message-content">${this.escapeHTML(message)}</div>
            <div class="message-time">${this.formatTime(new Date())}</div>
        `;
        
        this.elements.patelbotChat.appendChild(messageElement);
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Add to messages array
        this.state.messages.push({
            sender: 'user',
            content: message,
            timestamp: new Date()
        });
    },
    
    // Add bot message
    addBotMessage: function(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message bot-message';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <img src="assets/patelbot-avatar.svg" alt="PatelBot">
            </div>
            <div class="message-bubble">
                <div class="message-content">${message}</div>
                <div class="message-time">${this.formatTime(new Date())}</div>
            </div>
        `;
        
        this.elements.patelbotChat.appendChild(messageElement);
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Add to messages array
        this.state.messages.push({
            sender: 'bot',
            content: message,
            timestamp: new Date()
        });
        
        // Update last interaction time
        this.state.lastInteraction = new Date();
    },
    
    // Scroll chat to bottom
    scrollToBottom: function() {
        this.elements.patelbotChat.scrollTop = this.elements.patelbotChat.scrollHeight;
    },
    
    // Respond with greeting
    respondWithGreeting: function() {
        const greeting = this.getRandomItem(this.data.responses.greeting);
        this.addBotMessage(greeting);
        
        if (this.elements.patelbotVoiceResponse.checked) {
            this.speak(greeting);
        }
    },
    
    // Respond with goodbye
    respondWithGoodbye: function() {
        const goodbye = this.getRandomItem(this.data.responses.goodbye);
        this.addBotMessage(goodbye);
        
        if (this.elements.patelbotVoiceResponse.checked) {
            this.speak(goodbye);
        }
    },
    
    // Respond with thanks
    respondWithThanks: function() {
        const thanks = this.getRandomItem(this.data.responses.thanks);
        this.addBotMessage(thanks);
        
        if (this.elements.patelbotVoiceResponse.checked) {
            this.speak(thanks);
        }
    },
    
    // Respond with unknown
    respondWithUnknown: function() {
        const unknown = this.getRandomItem(this.data.responses.unknown);
        this.addBotMessage(unknown);
        
        if (this.elements.patelbotVoiceResponse.checked) {
            this.speak(unknown);
        }
    },
    
    // Show random quote
    showRandomQuote: function() {
        const quote = this.getRandomItem(this.data.quotes);
        this.addBotMessage(`<strong>Quote:</strong> ${quote}`);
        
        if (this.elements.patelbotVoiceResponse.checked) {
            this.speak(quote);
        }
    },
    
    // Show random joke
    showRandomJoke: function() {
        const joke = this.getRandomItem(this.data.jokes);
        this.addBotMessage(`<strong>Joke:</strong> ${joke}`);
        
        if (this.elements.patelbotVoiceResponse.checked) {
            this.speak(joke);
        }
    },
    
    // Show random tip
    showRandomTip: function() {
        const tip = this.getRandomItem(this.data.tips);
        this.addBotMessage(`<strong>Productivity Tip:</strong> ${tip}`);
        
        if (this.elements.patelbotVoiceResponse.checked) {
            this.speak(tip);
        }
    },
    
    // Show help
    showHelp: function() {
        const help = `
            <strong>PatelBot Help</strong>
            <p>I'm your AI assistant for the Patel Productivity Suite. Here's what I can do:</p>
            <ul>
                <li>Provide motivational quotes to inspire you</li>
                <li>Tell jokes to brighten your day</li>
                <li>Share productivity tips to help you work more efficiently</li>
                <li>Chat with you when you need a break</li>
            </ul>
            <p>You can interact with me by:</p>
            <ul>
                <li>Typing in the chat box</li>
                <li>Using voice commands (click the microphone button)</li>
                <li>Clicking the quick action buttons</li>
            </ul>
            <p>Try asking me for a "quote", "joke", or "productivity tip"!</p>
        `;
        
        this.addBotMessage(help);
        
        if (this.elements.patelbotVoiceResponse.checked) {
            this.speak("I'm your AI assistant for the Patel Productivity Suite. I can provide motivational quotes, tell jokes, share productivity tips, and chat with you when you need a break. Try asking me for a quote, joke, or productivity tip!");
        }
    },
    
    // Toggle speech recognition
    toggleSpeechRecognition: function() {
        if (!this.recognition) return;
        
        if (this.elements.patelbotMicBtn.classList.contains('active')) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    },
    
    // Toggle speech
    toggleSpeech: function() {
        if (this.state.isSpeaking) {
            this.stopSpeaking();
        } else {
            // Get last bot message
            const lastBotMessage = this.state.messages
                .filter(msg => msg.sender === 'bot')
                .pop();
            
            if (lastBotMessage) {
                this.speak(this.stripHTML(lastBotMessage.content));
            }
        }
    },
    
    // Speak text
    speak: function(text) {
        if (!this.synthesis) return;
        
        // Stop any current speech
        this.stopSpeaking();
        
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        const voices = this.synthesis.getVoices();
        const voiceIndex = this.elements.patelbotVoice.selectedIndex;
        
        if (voices.length > 0 && voiceIndex >= 0) {
            utterance.voice = voices[voiceIndex];
        }
        
        // Set rate and pitch
        utterance.rate = parseFloat(this.elements.patelbotSpeechRate.value);
        utterance.pitch = parseFloat(this.elements.patelbotSpeechPitch.value);
        
        // Set events
        utterance.onstart = () => {
            this.state.isSpeaking = true;
            this.elements.patelbotSpeakBtn.classList.add('active');
            this.updateStatus('speaking');
        };
        
        utterance.onend = () => {
            this.state.isSpeaking = false;
            this.elements.patelbotSpeakBtn.classList.remove('active');
            this.updateStatus('active');
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.state.isSpeaking = false;
            this.elements.patelbotSpeakBtn.classList.remove('active');
            this.updateStatus('active');
        };
        
        // Speak
        this.synthesis.speak(utterance);
    },
    
    // Stop speaking
    stopSpeaking: function() {
        if (!this.synthesis) return;
        
        this.synthesis.cancel();
        this.state.isSpeaking = false;
        this.elements.patelbotSpeakBtn.classList.remove('active');
        this.updateStatus('active');
    },
    
    // Update status
    updateStatus: function(status) {
        this.elements.patelbotStatus.className = 'patelbot-status';
        this.elements.patelbotStatus.classList.add(status);
        
        switch (status) {
            case 'active':
                this.state.isActive = true;
                break;
            case 'inactive':
                this.state.isActive = false;
                break;
            case 'speaking':
                this.state.isActive = true;
                this.state.isSpeaking = true;
                break;
            case 'listening':
                this.state.isActive = true;
                break;
        }
    },
    
    // Open settings modal
    openSettingsModal: function() {
        this.elements.patelbotSettingsModal.classList.add('active');
    },
    
    // Close settings modal
    closeSettingsModal: function() {
        this.elements.patelbotSettingsModal.classList.remove('active');
    },
    
    // Save settings
    saveSettings: async function() {
        try {
            // Get settings
            const name = this.elements.patelbotName.value;
            const voiceIndex = this.elements.patelbotVoice.selectedIndex;
            const speechRate = parseFloat(this.elements.patelbotSpeechRate.value);
            const speechPitch = parseFloat(this.elements.patelbotSpeechPitch.value);
            const autoSuggestions = this.elements.patelbotAutoSuggestions.checked;
            const voiceResponse = this.elements.patelbotVoiceResponse.checked;
            const idleMessages = this.elements.patelbotIdleMessages.checked;
            
            // Get selected voice name
            let voice = null;
            if (this.synthesis) {
                const voices = this.synthesis.getVoices();
                if (voices.length > 0 && voiceIndex >= 0) {
                    voice = voices[voiceIndex].name;
                }
            }
            
            // Create settings object
            const settings = {
                name,
                voice,
                speechRate,
                speechPitch,
                autoSuggestions,
                voiceResponse,
                idleMessages
            };
            
            // Save to database
            await window.PatelDB.put('settings', settings, 'patelbot_settings');
            
            // Close modal
            this.closeSettingsModal();
            
            // Show notification
            Utils.showNotification('PatelBot settings saved', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            Utils.showNotification('Error saving settings', 'error');
        }
    },
    
    // Helper: Get random item from array
    getRandomItem: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    // Helper: Check if string contains any of the keywords
    containsAny: function(str, keywords) {
        return keywords.some(keyword => str.includes(keyword));
    },
    
    // Helper: Format time
    formatTime: function(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    
    // Helper: Shuffle array
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },
    
    // Helper: Escape HTML
    escapeHTML: function(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },
    
    // Helper: Strip HTML
    stripHTML: function(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    }
};

// Register module
window['patelbotModule'] = patelbotModule;
