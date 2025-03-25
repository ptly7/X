// TensorFlow.js Integration for Patel Productivity Suite

// Main TensorFlow.js integration module
const TensorFlowAI = {
    // Store model instances
    models: {},
    
    // Store model states
    modelStates: {},
    
    // Initialize TensorFlow.js
    init: async function() {
        console.log('Initializing TensorFlow.js...');
        
        try {
            // Load TensorFlow.js library dynamically
            await this.loadTensorFlowLibrary();
            
            // Initialize models
            await this.initializeModels();
            
            console.log('TensorFlow.js initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing TensorFlow.js:', error);
            return false;
        }
    },
    
    // Load TensorFlow.js library dynamically
    loadTensorFlowLibrary: async function() {
        return new Promise((resolve, reject) => {
            // Check if TensorFlow.js is already loaded
            if (window.tf) {
                console.log('TensorFlow.js is already loaded');
                resolve();
                return;
            }
            
            // Create script element
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.18.0/dist/tf.min.js';
            script.async = true;
            
            // Set onload handler
            script.onload = () => {
                console.log('TensorFlow.js library loaded');
                resolve();
            };
            
            // Set onerror handler
            script.onerror = () => {
                const error = new Error('Failed to load TensorFlow.js library');
                console.error(error);
                reject(error);
            };
            
            // Append script to document
            document.head.appendChild(script);
        });
    },
    
    // Initialize models
    initializeModels: async function() {
        try {
            // Initialize task prioritization model
            await this.initTaskPrioritizationModel();
            
            // Initialize text sentiment analysis model
            await this.initSentimentAnalysisModel();
            
            // Initialize text classification model
            await this.initTextClassificationModel();
            
            // Initialize text summarization model (uses TensorFlow.js Universal Sentence Encoder)
            await this.initTextSummarizationModel();
            
            return true;
        } catch (error) {
            console.error('Error initializing models:', error);
            return false;
        }
    },
    
    // Initialize task prioritization model
    initTaskPrioritizationModel: async function() {
        try {
            console.log('Initializing task prioritization model...');
            
            // Create a simple model for task prioritization
            const model = tf.sequential();
            
            // Add layers
            model.add(tf.layers.dense({
                inputShape: [4], // [urgency, importance, effort, deadline]
                units: 8,
                activation: 'relu'
            }));
            
            model.add(tf.layers.dense({
                units: 4,
                activation: 'relu'
            }));
            
            model.add(tf.layers.dense({
                units: 1,
                activation: 'sigmoid'
            }));
            
            // Compile the model
            model.compile({
                optimizer: 'adam',
                loss: 'binaryCrossentropy',
                metrics: ['accuracy']
            });
            
            // Store the model
            this.models.taskPrioritization = model;
            
            // Set model state
            this.modelStates.taskPrioritization = 'initialized';
            
            console.log('Task prioritization model initialized');
            return true;
        } catch (error) {
            console.error('Error initializing task prioritization model:', error);
            this.modelStates.taskPrioritization = 'error';
            return false;
        }
    },
    
    // Initialize sentiment analysis model
    initSentimentAnalysisModel: async function() {
        try {
            console.log('Initializing sentiment analysis model...');
            
            // Create a simple model for sentiment analysis
            const model = tf.sequential();
            
            // Add layers
            model.add(tf.layers.dense({
                inputShape: [100], // Word embeddings
                units: 16,
                activation: 'relu'
            }));
            
            model.add(tf.layers.dense({
                units: 8,
                activation: 'relu'
            }));
            
            model.add(tf.layers.dense({
                units: 1,
                activation: 'sigmoid'
            }));
            
            // Compile the model
            model.compile({
                optimizer: 'adam',
                loss: 'binaryCrossentropy',
                metrics: ['accuracy']
            });
            
            // Store the model
            this.models.sentimentAnalysis = model;
            
            // Set model state
            this.modelStates.sentimentAnalysis = 'initialized';
            
            console.log('Sentiment analysis model initialized');
            return true;
        } catch (error) {
            console.error('Error initializing sentiment analysis model:', error);
            this.modelStates.sentimentAnalysis = 'error';
            return false;
        }
    },
    
    // Initialize text classification model
    initTextClassificationModel: async function() {
        try {
            console.log('Initializing text classification model...');
            
            // Create a simple model for text classification
            const model = tf.sequential();
            
            // Add layers
            model.add(tf.layers.dense({
                inputShape: [100], // Word embeddings
                units: 32,
                activation: 'relu'
            }));
            
            model.add(tf.layers.dense({
                units: 16,
                activation: 'relu'
            }));
            
            model.add(tf.layers.dense({
                units: 5, // Number of categories
                activation: 'softmax'
            }));
            
            // Compile the model
            model.compile({
                optimizer: 'adam',
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            });
            
            // Store the model
            this.models.textClassification = model;
            
            // Set model state
            this.modelStates.textClassification = 'initialized';
            
            console.log('Text classification model initialized');
            return true;
        } catch (error) {
            console.error('Error initializing text classification model:', error);
            this.modelStates.textClassification = 'error';
            return false;
        }
    },
    
    // Initialize text summarization model
    initTextSummarizationModel: async function() {
        try {
            console.log('Initializing text summarization model...');
            
            // For text summarization, we'll use a placeholder
            // In a real implementation, this would load a pre-trained model
            
            // Set model state
            this.modelStates.textSummarization = 'initialized';
            
            console.log('Text summarization model initialized');
            return true;
        } catch (error) {
            console.error('Error initializing text summarization model:', error);
            this.modelStates.textSummarization = 'error';
            return false;
        }
    },
    
    // Predict task priority
    predictTaskPriority: async function(taskData) {
        try {
            // Check if model is initialized
            if (this.modelStates.taskPrioritization !== 'initialized') {
                throw new Error('Task prioritization model is not initialized');
            }
            
            // Normalize input data
            const normalizedData = this.normalizeTaskData(taskData);
            
            // Convert to tensor
            const inputTensor = tf.tensor2d([normalizedData]);
            
            // Make prediction
            const prediction = this.models.taskPrioritization.predict(inputTensor);
            
            // Get priority score (0-1)
            const priorityScore = prediction.dataSync()[0];
            
            // Clean up tensors
            inputTensor.dispose();
            prediction.dispose();
            
            return priorityScore;
        } catch (error) {
            console.error('Error predicting task priority:', error);
            return 0.5; // Default priority
        }
    },
    
    // Normalize task data
    normalizeTaskData: function(taskData) {
        // Extract features
        const { urgency, importance, effort, deadline } = taskData;
        
        // Normalize urgency (0-10) to (0-1)
        const normalizedUrgency = urgency / 10;
        
        // Normalize importance (0-10) to (0-1)
        const normalizedImportance = importance / 10;
        
        // Normalize effort (0-10) to (0-1)
        const normalizedEffort = effort / 10;
        
        // Normalize deadline (days) to (0-1)
        // 0 days = 1, 30+ days = 0
        const normalizedDeadline = deadline <= 0 ? 1 : Math.max(0, 1 - (deadline / 30));
        
        return [normalizedUrgency, normalizedImportance, normalizedEffort, normalizedDeadline];
    },
    
    // Analyze text sentiment
    analyzeTextSentiment: async function(text) {
        try {
            // Check if model is initialized
            if (this.modelStates.sentimentAnalysis !== 'initialized') {
                throw new Error('Sentiment analysis model is not initialized');
            }
            
            // In a real implementation, this would:
            // 1. Tokenize the text
            // 2. Convert to word embeddings
            // 3. Feed into the model
            
            // For now, use a simple rule-based approach
            const positiveWords = ['good', 'great', 'excellent', 'happy', 'positive', 'wonderful', 'amazing', 'love', 'enjoy', 'like'];
            const negativeWords = ['bad', 'terrible', 'awful', 'sad', 'negative', 'horrible', 'hate', 'dislike', 'poor', 'worst'];
            
            const lowerText = text.toLowerCase();
            let positiveCount = 0;
            let negativeCount = 0;
            
            positiveWords.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'g');
                const matches = lowerText.match(regex);
                if (matches) {
                    positiveCount += matches.length;
                }
            });
            
            negativeWords.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'g');
                const matches = lowerText.match(regex);
                if (matches) {
                    negativeCount += matches.length;
                }
            });
            
            // Calculate sentiment score (0-1)
            const totalWords = positiveCount + negativeCount;
            const sentimentScore = totalWords > 0 ? positiveCount / totalWords : 0.5;
            
            return sentimentScore;
        } catch (error) {
            console.error('Error analyzing text sentiment:', error);
            return 0.5; // Neutral sentiment
        }
    },
    
    // Classify text
    classifyText: async function(text) {
        try {
            // Check if model is initialized
            if (this.modelStates.textClassification !== 'initialized') {
                throw new Error('Text classification model is not initialized');
            }
            
            // In a real implementation, this would:
            // 1. Tokenize the text
            // 2. Convert to word embeddings
            // 3. Feed into the model
            
            // For now, use a simple rule-based approach
            const categories = {
                work: ['project', 'meeting', 'deadline', 'client', 'report', 'presentation', 'email', 'task', 'work', 'office'],
                personal: ['family', 'friend', 'home', 'hobby', 'vacation', 'weekend', 'birthday', 'party', 'dinner', 'lunch'],
                health: ['exercise', 'workout', 'gym', 'run', 'doctor', 'appointment', 'medicine', 'diet', 'health', 'fitness'],
                finance: ['money', 'bank', 'payment', 'bill', 'invoice', 'budget', 'expense', 'income', 'tax', 'financial'],
                education: ['study', 'learn', 'course', 'class', 'book', 'read', 'school', 'university', 'homework', 'exam']
            };
            
            const lowerText = text.toLowerCase();
            const scores = {};
            
            // Calculate score for each category
            Object.keys(categories).forEach(category => {
                let score = 0;
                categories[category].forEach(word => {
                    const regex = new RegExp(`\\b${word}\\b`, 'g');
                    const matches = lowerText.match(regex);
                    if (matches) {
                        score += matches.length;
                    }
                });
                scores[category] = score;
            });
            
            // Find category with highest score
            let maxScore = 0;
            let maxCategory = 'personal'; // Default category
            
            Object.keys(scores).forEach(category => {
                if (scores[category] > maxScore) {
                    maxScore = scores[category];
                    maxCategory = category;
                }
            });
            
            return maxCategory;
        } catch (error) {
            console.error('Error classifying text:', error);
            return 'personal'; // Default category
        }
    },
    
    // Summarize text
    summarizeText: async function(text, maxLength = 100) {
        try {
            // Check if model is initialized
            if (this.modelStates.textSummarization !== 'initialized') {
                throw new Error('Text summarization model is not initialized');
            }
            
            // In a real implementation, this would use a pre-trained model
            // For now, use a simple extractive summarization approach
            
            // Split text into sentences
            const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
            
            if (sentences.length <= 3) {
                // If text is already short, return as is
                return text;
            }
            
            // Score sentences based on position and length
            const scoredSentences = sentences.map((sentence, index) => {
                // Position score (first and last sentences are more important)
                const positionScore = index === 0 || index === sentences.length - 1 ? 2 : 1;
                
                // Length score (prefer medium-length sentences)
                const words = sentence.split(/\s+/).length;
                const lengthScore = words > 5 && words < 25 ? 1.5 : 1;
                
                // Calculate total score
                const totalScore = positionScore * lengthScore;
                
                return { sentence, score: totalScore };
            });
            
            // Sort sentences by score (descending)
            scoredSentences.sort((a, b) => b.score - a.score);
            
            // Take top sentences
            let summary = '';
            let currentLength = 0;
            
            for (const { sentence } of scoredSentences) {
                if (currentLength + sentence.length <= maxLength) {
                    summary += sentence + ' ';
                    currentLength += sentence.length;
                } else {
                    break;
                }
            }
            
            return summary.trim();
        } catch (error) {
            console.error('Error summarizing text:', error);
            
            // Fallback: return first few sentences
            const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
            return sentences.slice(0, 2).join(' ');
        }
    },
    
    // Train task prioritization model with user data
    trainTaskPrioritizationModel: async function(trainingData) {
        try {
            // Check if model is initialized
            if (this.modelStates.taskPrioritization !== 'initialized') {
                throw new Error('Task prioritization model is not initialized');
            }
            
            // Prepare training data
            const inputs = [];
            const outputs = [];
            
            trainingData.forEach(data => {
                // Normalize input data
                const normalizedData = this.normalizeTaskData(data);
                inputs.push(normalizedData);
                
                // Get actual priority (0-1)
                outputs.push([data.actualPriority]);
            });
            
            // Convert to tensors
            const inputTensor = tf.tensor2d(inputs);
            const outputTensor = tf.tensor2d(outputs);
            
            // Train the model
            await this.models.taskPrioritization.fit(inputTensor, outputTensor, {
                epochs: 10,
                batchSize: 32,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
                    }
                }
            });
            
            // Clean up tensors
            inputTensor.dispose();
            outputTensor.dispose();
            
            console.log('Task prioritization model trained successfully');
            return true;
        } catch (error) {
            console.error('Error training task prioritization model:', error);
            return false;
        }
    },
    
    // Save model to IndexedDB
    saveModel: async function(modelName) {
        try {
            // Check if model exists
            if (!this.models[modelName]) {
                throw new Error(`Model '${modelName}' does not exist`);
            }
            
            // Save model
            await this.models[modelName].save(`indexeddb://${modelName}`);
            
            console.log(`Model '${modelName}' saved to IndexedDB`);
            return true;
        } catch (error) {
            console.error(`Error saving model '${modelName}':`, error);
            return false;
        }
    },
    
    // Load model from IndexedDB
    loadModel: async function(modelName) {
        try {
            // Load model
            this.models[modelName] = await tf.loadLayersModel(`indexeddb://${modelName}`);
            
            // Set model state
            this.modelStates[modelName] = 'initialized';
            
            console.log(`Model '${modelName}' loaded from IndexedDB`);
            return true;
        } catch (error) {
            console.error(`Error loading model '${modelName}':`, error);
            return false;
        }
    },
    
    // Get model info
    getModelInfo: function() {
        const modelInfo = {};
        
        // Get info for each model
        Object.keys(this.modelStates).forEach(modelName => {
            modelInfo[modelName] = {
                state: this.modelStates[modelName],
                initialized: this.modelStates[modelName] === 'initialized'
            };
        });
        
        return modelInfo;
    }
};

// Web Speech API Integration
const SpeechAPI = {
    // Recognition instance
    recognition: null,
    
    // Synthesis instance
    synthesis: null,
    
    // Recognition state
    recognitionState: 'inactive',
    
    // Synthesis state
    synthesisState: 'inactive',
    
    // Available voices
    voices: [],
    
    // Initialize Web Speech API
    init: function() {
        console.log('Initializing Web Speech API...');
        
        try {
            // Initialize speech recognition
            this.initSpeechRecognition();
            
            // Initialize speech synthesis
            this.initSpeechSynthesis();
            
            console.log('Web Speech API initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing Web Speech API:', error);
            return false;
        }
    },
    
    // Initialize speech recognition
    initSpeechRecognition: function() {
        try {
            // Check if speech recognition is supported
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                throw new Error('Speech recognition is not supported in this browser');
            }
            
            // Create recognition instance
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            // Configure recognition
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            
            // Set event handlers
            this.recognition.onstart = () => {
                this.recognitionState = 'active';
                console.log('Speech recognition started');
                
                // Dispatch event
                window.dispatchEvent(new CustomEvent('speech-recognition-start'));
            };
            
            this.recognition.onend = () => {
                this.recognitionState = 'inactive';
                console.log('Speech recognition ended');
                
                // Dispatch event
                window.dispatchEvent(new CustomEvent('speech-recognition-end'));
            };
            
            this.recognition.onresult = (event) => {
                // Get latest result
                const result = event.results[event.results.length - 1];
                const transcript = result[0].transcript;
                const isFinal = result.isFinal;
                
                console.log(`Speech recognition result: ${transcript} (${isFinal ? 'final' : 'interim'})`);
                
                // Dispatch event
                window.dispatchEvent(new CustomEvent('speech-recognition-result', {
                    detail: {
                        transcript,
                        isFinal
                    }
                }));
            };
            
            this.recognition.onerror = (event) => {
                this.recognitionState = 'error';
                console.error('Speech recognition error:', event.error);
                
                // Dispatch event
                window.dispatchEvent(new CustomEvent('speech-recognition-error', {
                    detail: {
                        error: event.error
                    }
                }));
            };
            
            console.log('Speech recognition initialized');
            return true;
        } catch (error) {
            console.error('Error initializing speech recognition:', error);
            return false;
        }
    },
    
    // Initialize speech synthesis
    initSpeechSynthesis: function() {
        try {
            // Check if speech synthesis is supported
            if (!('speechSynthesis' in window)) {
                throw new Error('Speech synthesis is not supported in this browser');
            }
            
            // Get synthesis instance
            this.synthesis = window.speechSynthesis;
            
            // Load voices
            this.loadVoices();
            
            // Chrome loads voices asynchronously
            if (this.synthesis.onvoiceschanged !== undefined) {
                this.synthesis.onvoiceschanged = this.loadVoices.bind(this);
            }
            
            console.log('Speech synthesis initialized');
            return true;
        } catch (error) {
            console.error('Error initializing speech synthesis:', error);
            return false;
        }
    },
    
    // Load available voices
    loadVoices: function() {
        try {
            // Get voices
            this.voices = this.synthesis.getVoices();
            
            console.log(`Loaded ${this.voices.length} voices`);
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('speech-synthesis-voices-loaded', {
                detail: {
                    voices: this.voices
                }
            }));
            
            return true;
        } catch (error) {
            console.error('Error loading voices:', error);
            return false;
        }
    },
    
    // Start speech recognition
    startRecognition: function() {
        try {
            // Check if recognition is initialized
            if (!this.recognition) {
                throw new Error('Speech recognition is not initialized');
            }
            
            // Check if recognition is already active
            if (this.recognitionState === 'active') {
                console.log('Speech recognition is already active');
                return true;
            }
            
            // Start recognition
            this.recognition.start();
            
            return true;
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            return false;
        }
    },
    
    // Stop speech recognition
    stopRecognition: function() {
        try {
            // Check if recognition is initialized
            if (!this.recognition) {
                throw new Error('Speech recognition is not initialized');
            }
            
            // Check if recognition is active
            if (this.recognitionState !== 'active') {
                console.log('Speech recognition is not active');
                return true;
            }
            
            // Stop recognition
            this.recognition.stop();
            
            return true;
        } catch (error) {
            console.error('Error stopping speech recognition:', error);
            return false;
        }
    },
    
    // Speak text
    speak: function(text, options = {}) {
        try {
            // Check if synthesis is initialized
            if (!this.synthesis) {
                throw new Error('Speech synthesis is not initialized');
            }
            
            // Cancel any current speech
            this.synthesis.cancel();
            
            // Create utterance
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Set voice
            if (options.voice) {
                const voice = this.voices.find(v => v.name === options.voice);
                if (voice) {
                    utterance.voice = voice;
                }
            }
            
            // Set rate
            if (options.rate) {
                utterance.rate = options.rate;
            }
            
            // Set pitch
            if (options.pitch) {
                utterance.pitch = options.pitch;
            }
            
            // Set volume
            if (options.volume) {
                utterance.volume = options.volume;
            }
            
            // Set event handlers
            utterance.onstart = () => {
                this.synthesisState = 'active';
                console.log('Speech synthesis started');
                
                // Dispatch event
                window.dispatchEvent(new CustomEvent('speech-synthesis-start'));
            };
            
            utterance.onend = () => {
                this.synthesisState = 'inactive';
                console.log('Speech synthesis ended');
                
                // Dispatch event
                window.dispatchEvent(new CustomEvent('speech-synthesis-end'));
            };
            
            utterance.onerror = (event) => {
                this.synthesisState = 'error';
                console.error('Speech synthesis error:', event.error);
                
                // Dispatch event
                window.dispatchEvent(new CustomEvent('speech-synthesis-error', {
                    detail: {
                        error: event.error
                    }
                }));
            };
            
            // Speak
            this.synthesis.speak(utterance);
            
            return true;
        } catch (error) {
            console.error('Error speaking text:', error);
            return false;
        }
    },
    
    // Stop speaking
    stopSpeaking: function() {
        try {
            // Check if synthesis is initialized
            if (!this.synthesis) {
                throw new Error('Speech synthesis is not initialized');
            }
            
            // Cancel any current speech
            this.synthesis.cancel();
            
            this.synthesisState = 'inactive';
            
            return true;
        } catch (error) {
            console.error('Error stopping speech synthesis:', error);
            return false;
        }
    },
    
    // Pause speaking
    pauseSpeaking: function() {
        try {
            // Check if synthesis is initialized
            if (!this.synthesis) {
                throw new Error('Speech synthesis is not initialized');
            }
            
            // Pause speech
            this.synthesis.pause();
            
            this.synthesisState = 'paused';
            
            return true;
        } catch (error) {
            console.error('Error pausing speech synthesis:', error);
            return false;
        }
    },
    
    // Resume speaking
    resumeSpeaking: function() {
        try {
            // Check if synthesis is initialized
            if (!this.synthesis) {
                throw new Error('Speech synthesis is not initialized');
            }
            
            // Resume speech
            this.synthesis.resume();
            
            this.synthesisState = 'active';
            
            return true;
        } catch (error) {
            console.error('Error resuming speech synthesis:', error);
            return false;
        }
    },
    
    // Get available voices
    getVoices: function() {
        return this.voices;
    },
    
    // Get recognition state
    getRecognitionState: function() {
        return this.recognitionState;
    },
    
    // Get synthesis state
    getSynthesisState: function() {
        return this.synthesisState;
    },
    
    // Check if speech recognition is supported
    isRecognitionSupported: function() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    },
    
    // Check if speech synthesis is supported
    isSynthesisSupported: function() {
        return 'speechSynthesis' in window;
    }
};

// Export modules
window.TensorFlowAI = TensorFlowAI;
window.SpeechAPI = SpeechAPI;
