class AIInfiniteScroll {
    constructor() {
        this.chatContainer = document.getElementById('chatContainer');
        this.loading = document.getElementById('loading');
        this.scrollIndicator = document.getElementById('scrollIndicator');
        this.scrollToTop = document.getElementById('scrollToTop');
        this.currentModeSpan = document.getElementById('currentMode');
        
        this.currentMode = 'jokes';
        this.currentPage = 1;
        this.itemsPerResponse = 1;
        this.isLoading = false;
        this.hasMoreContent = true;
        this.isTyping = false;
        
        // API configuration - using real Gemini API
        this.useRealAPI = true;
        this.apiKey = 'AIzaSyDKQl7HE-5Dq2M9UPAb4RgLkdNz7VcIzCw';
        
        this.init();
    }

    init() {
        // Setup mode selection
        this.setupModeSelection();
        
        // Add scroll event listener
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Setup scroll to top button
        this.setupScrollToTop();
        
        // Show scroll indicator after initial delay
        setTimeout(() => {
            this.scrollIndicator.classList.add('show');
        }, 3000);
        
        // Load initial content after a short delay
        setTimeout(() => {
            this.loadContent();
        }, 1000);
    }

    setupModeSelection() {
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                modeButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update current mode
                this.currentMode = button.dataset.mode;
                this.currentModeSpan.textContent = this.getModeDisplayName(this.currentMode);
                
                // Reset pagination
                this.currentPage = 1;
                this.hasMoreContent = true;
                
                // Show mode change message
                this.showModeChangeMessage();
            });
        });
    }



    setupScrollToTop() {
        this.scrollToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.scrollToTop.classList.add('show');
            } else {
                this.scrollToTop.classList.remove('show');
            }
        });
    }

    handleScroll() {
        if (this.isLoading || !this.hasMoreContent || this.isTyping) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Load more content when user is near bottom
        if (scrollTop + windowHeight >= documentHeight - 200) {
            this.loadContent();
        }
    }

    async loadContent() {
        if (this.isLoading || this.isTyping) return;
        
        this.isLoading = true;
        this.showLoading();

        // Simulate API delay
        await this.delay(Math.random() * 2000 + 1500);

        let response;
        if (this.useRealAPI && this.apiKey) {
            response = await this.fetchRealAIResponse();
        } else {
            response = this.generateMockResponse();
        }
        
        if (response) {
            await this.displayResponseWithTyping(response);
        }

        this.currentPage++;
        this.hideLoading();
        this.isLoading = false;
    }

    generateMockResponse() {
        const responses = {
            jokes: [
                "Why don't scientists trust atoms? Because they make up everything! 😄",
                "I told my wife she was drawing her eyebrows too high. She looked surprised! 😆",
                "Why did the coffee file a police report? It got mugged! ☕",
                "What do you call a fish wearing a bowtie? Sofishticated! 🐟",
                "Why don't eggs tell jokes? They'd crack each other up! 🥚",
                "What did the ocean say to the beach? Nothing, it just waved! 🌊",
                "Why did the scarecrow win an award? He was outstanding in his field! 🏆",
                "What do you call a bear with no teeth? A gummy bear! 🐻",
                "Why don't some couples go to the gym? Because some relationships don't work out! 💪",
                "What's orange and sounds like a parrot? A carrot! 🥕"
            ],
            coding: [
                "Here's a useful JavaScript tip: Use `const` for values that won't change, `let` for variables that will. Avoid `var` in modern code!\n\n```javascript\nconst API_URL = 'https://api.example.com';\nlet counter = 0;\ncounter++;\n```",
                "Want to remove duplicates from an array? Use Set!\n\n```javascript\nconst numbers = [1, 2, 2, 3, 4, 4, 5];\nconst unique = [...new Set(numbers)];\nconsole.log(unique); // [1, 2, 3, 4, 5]\n```",
                "Pro tip: Use optional chaining to safely access nested properties:\n\n```javascript\nconst user = { profile: { name: 'John' } };\nconst name = user?.profile?.name ?? 'Unknown';\n```",
                "Debugging tip: Use `console.table()` for better array/object visualization!\n\n```javascript\nconst users = [{name: 'Alice', age: 25}, {name: 'Bob', age: 30}];\nconsole.table(users);\n```",
                "Want to shuffle an array? Here's a clean way:\n\n```javascript\nconst shuffle = arr => arr.sort(() => Math.random() - 0.5);\nconst numbers = [1, 2, 3, 4, 5];\nconsole.log(shuffle(numbers));\n```",
                "CSS Grid tip: Use `fr` units for flexible layouts!\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: 1fr 2fr 1fr;\n  gap: 20px;\n}\n```",
                "React performance tip: Use `React.memo()` to prevent unnecessary re-renders!\n\n```jsx\nconst ExpensiveComponent = React.memo(({ data }) => {\n  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>;\n});\n```",
                "Python one-liner: Find the most common element in a list!\n\n```python\nfrom collections import Counter\nnumbers = [1, 2, 2, 3, 2, 4]\nmost_common = Counter(numbers).most_common(1)[0][0]\nprint(most_common)  # 2\n```"
            ],
            facts: [
                "🧠 Fun Fact: Your brain uses about 20% of your body's total energy, even though it only weighs about 3 pounds!",
                "🐙 Amazing: Octopuses have three hearts and blue blood! Two hearts pump blood to the gills, while the third pumps to the rest of the body.",
                "🍯 Sweet fact: Honey never spoils! Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.",
                "🌍 Mind-blowing: If the Earth were the size of a grain of sand, the Sun would be the size of an orange, and the nearest star would be 1,300 miles away!",
                "🦋 Incredible: Butterflies taste with their feet and smell with their antennae! They have taste receptors on their feet to identify suitable plants for laying eggs.",
                "🐧 Cool fact: Penguins can jump up to 6 feet out of water! This ability helps them escape predators and get onto ice floes.",
                "🧬 Scientific wonder: Your DNA is 99.9% identical to every other human's, but that 0.1% difference accounts for all the diversity we see!",
                "🌙 Space fact: The Moon is moving away from Earth at a rate of about 1.5 inches per year, which is roughly the same rate your fingernails grow!",
                "🐝 Buzzing fact: Bees communicate through dance! They perform a 'waggle dance' to tell other bees the direction and distance to flowers.",
                "⚡ Electric fact: Lightning is about 5 times hotter than the surface of the Sun, reaching temperatures of around 30,000 Kelvin!"
            ],
            motivation: [
                "💪 Remember: Every expert was once a beginner. Your journey starts with a single step, and every step forward is progress worth celebrating!",
                "🌟 You have within you right now, everything you need to deal with whatever the world can throw at you. Trust yourself!",
                "🎯 Success isn't about being perfect. It's about being persistent. Keep showing up, keep trying, and keep growing!",
                "🌱 Growth happens outside your comfort zone. Embrace the challenges today - they're building tomorrow's stronger you!",
                "🏆 The only person you should compete with is who you were yesterday. Focus on your own journey and celebrate your progress!",
                "✨ Your potential is endless. Don't let fear of failure stop you from discovering what amazing things you're capable of!",
                "🔥 Difficult roads often lead to beautiful destinations. Keep going - you're stronger than you think!",
                "🌈 Every setback is a setup for a comeback. Use your challenges as stepping stones, not stumbling blocks!",
                "💎 Pressure makes diamonds. What you're going through today is shaping you into something extraordinary!",
                "🚀 Dream big, start small, but most importantly - start! Your future self will thank you for the action you take today!"
            ]
        };

        const modeResponses = responses[this.currentMode];
        if (!modeResponses || modeResponses.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * modeResponses.length);
        return modeResponses[randomIndex];
    }

    async fetchRealAIResponse() {
        try {
            const prompt = this.buildPromptForMode(this.currentMode);
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{ 
                        parts: [{ text: prompt }] 
                    }]
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid API response format');
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            // Fallback to mock response if API fails
            return this.generateMockResponse();
        }
    }

    buildPromptForMode(mode) {
        const prompts = {
            jokes: "Generate a funny, clean joke that would make someone smile. Keep it under 100 words.",
            coding: "Share a useful programming tip, code snippet, or best practice. Include a brief explanation and example code if applicable.",
            facts: "Share an interesting, surprising, or little-known fact about science, nature, history, or the world. Make it engaging and educational.",
            motivation: "Share an inspiring and motivational message that would encourage someone to keep pursuing their goals. Be positive and uplifting."
        };
        return prompts[mode] || prompts.jokes;
    }

    async displayResponseWithTyping(content) {
        this.isTyping = true;
        
        const messageDiv = this.createMessageElement();
        const contentArea = messageDiv.querySelector('.message-content p');
        
        this.chatContainer.appendChild(messageDiv);
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Typing effect
        await this.typeWriter(contentArea, content);
        
        // Add message metadata after typing is complete
        this.addMessageMetadata(messageDiv);
        
        this.isTyping = false;
    }

    createMessageElement() {
        const div = document.createElement('div');
        div.className = 'ai-message';
        div.innerHTML = `
            <div class="ai-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p></p>
            </div>
        `;
        return div;
    }

    async typeWriter(element, text) {
        element.innerHTML = '';
        element.classList.add('typing-text');
        
        // Handle code blocks and regular text differently
        if (text.includes('```')) {
            await this.typeCodeContent(element, text);
        } else {
            await this.typeRegularText(element, text);
        }
        
        element.classList.remove('typing-text');
    }

    async typeRegularText(element, text) {
        for (let i = 0; i < text.length; i++) {
            element.innerHTML += text.charAt(i);
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await this.delay(Math.random() * 50 + 20); // Variable typing speed
        }
    }

    async typeCodeContent(element, text) {
        const parts = text.split('```');
        
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // Regular text
                await this.typeRegularText(element, parts[i]);
            } else {
                // Code block
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                element.appendChild(pre);
                pre.appendChild(code);
                
                const lines = parts[i].split('\n');
                for (const line of lines) {
                    for (let j = 0; j < line.length; j++) {
                        code.innerHTML += line.charAt(j);
                        await this.delay(20);
                    }
                    if (line !== lines[lines.length - 1]) {
                        code.innerHTML += '\n';
                        await this.delay(100);
                    }
                }
            }
        }
    }

    addMessageMetadata(messageDiv) {
        const metaDiv = document.createElement('div');
        metaDiv.className = 'message-meta';
        metaDiv.innerHTML = `
            <span class="message-number">#${this.currentPage}</span>
            <span>${this.getModeDisplayName(this.currentMode)} • ${this.getCurrentTime()}</span>
        `;
        messageDiv.querySelector('.message-content').appendChild(metaDiv);
    }

    showModeChangeMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message';
        messageDiv.innerHTML = `
            <div class="ai-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>Great! I've switched to <strong>${this.getModeDisplayName(this.currentMode)}</strong> mode. Scroll down to get some ${this.getModeDisplayName(this.currentMode).toLowerCase()}! 🎉</p>
                <div class="message-meta">
                    <span class="message-number">Mode Switch</span>
                    <span>${this.getCurrentTime()}</span>
                </div>
            </div>
        `;
        this.chatContainer.appendChild(messageDiv);
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    getModeDisplayName(mode) {
        const names = {
            jokes: 'jokes',
            coding: 'coding help',
            facts: 'fun facts',
            motivation: 'motivation'
        };
        return names[mode] || mode;
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        });
    }

    showLoading() {
        this.loading.classList.add('show');
        this.loading.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    hideLoading() {
        this.loading.classList.remove('show');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize AI Infinite Scroll when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIInfiniteScroll();
});

// Add some easter eggs and interactions
document.addEventListener('keydown', (e) => {
    // Konami code easter egg: ↑ ↑ ↓ ↓ ← → ← → B A
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        const easter = document.createElement('div');
        easter.innerHTML = '🎉 Easter egg activated! AI mode: SUPER CREATIVE! 🚀';
        easter.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea, #764ba2); color: white;
            padding: 20px; border-radius: 15px; z-index: 10000;
            font-weight: bold; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(easter);
        setTimeout(() => easter.remove(), 3000);
    }
}); 