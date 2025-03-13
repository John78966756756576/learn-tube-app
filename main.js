// Mock data for videos with enhanced context
const videos = {
    cs: [
        { 
            title: 'Data Structures & Algorithms',
            duration: 300,
            description: 'Learn fundamental data structures and algorithms concepts',
            prerequisites: ['Basic Programming', 'JavaScript Basics'],
            nextSteps: ['Advanced Algorithms', 'System Design'],
            relatedTopics: ['Binary Trees', 'Graph Algorithms', 'Dynamic Programming']
        },
        { 
            title: 'Introduction to Python',
            duration: 240,
            description: 'Get started with Python programming language',
            prerequisites: ['None'],
            nextSteps: ['Python Libraries', 'Web Development with Python'],
            relatedTopics: ['Variables', 'Functions', 'Object-Oriented Programming']
        },
        { 
            title: 'Web Development Basics',
            duration: 360,
            description: 'Learn the fundamentals of web development',
            prerequisites: ['HTML Basics', 'CSS Fundamentals'],
            nextSteps: ['JavaScript', 'React Framework'],
            relatedTopics: ['HTML5', 'CSS3', 'Responsive Design']
        }
    ],
    math: [
        { 
            title: 'Calculus Fundamentals',
            duration: 280,
            description: 'Master the basics of calculus',
            prerequisites: ['Algebra', 'Trigonometry'],
            nextSteps: ['Advanced Calculus', 'Differential Equations'],
            relatedTopics: ['Limits', 'Derivatives', 'Integrals']
        },
        { 
            title: 'Linear Algebra',
            duration: 320,
            description: 'Understanding linear algebra concepts',
            prerequisites: ['Basic Algebra'],
            nextSteps: ['Matrix Theory', 'Vector Calculus'],
            relatedTopics: ['Matrices', 'Vector Spaces', 'Linear Transformations']
        }
    ],
    physics: [
        { 
            title: 'Classical Mechanics',
            duration: 400,
            description: 'Learn the principles of classical mechanics',
            prerequisites: ['Basic Physics', 'Calculus'],
            nextSteps: ['Advanced Mechanics', 'Quantum Mechanics'],
            relatedTopics: ['Newton Laws', 'Energy', 'Momentum']
        },
        { 
            title: 'Quantum Physics Intro',
            duration: 350,
            description: 'Introduction to quantum physics concepts',
            prerequisites: ['Classical Mechanics', 'Linear Algebra'],
            nextSteps: ['Advanced Quantum Theory', 'Particle Physics'],
            relatedTopics: ['Wave Functions', 'Uncertainty Principle', 'Quantum States']
        }
    ],
    lang: [
        { 
            title: 'JavaScript Essentials',
            duration: 290,
            description: 'Master JavaScript programming language',
            prerequisites: ['Basic Programming Concepts'],
            nextSteps: ['Advanced JavaScript', 'Frontend Frameworks'],
            relatedTopics: ['ES6+', 'Async Programming', 'DOM Manipulation']
        },
        { 
            title: 'Python Programming',
            duration: 310,
            description: 'Learn Python programming fundamentals',
            prerequisites: ['None'],
            nextSteps: ['Python Libraries', 'Data Science'],
            relatedTopics: ['Basic Syntax', 'Data Types', 'Functions']
        }
    ]
};

// DOM Elements
const searchInput = document.getElementById('searchInput');
const playlistGrid = document.getElementById('playlistGrid');
const playlistCards = document.querySelectorAll('.playlist-card');
const videoTitle = document.getElementById('videoTitle');
const videoDescription = document.getElementById('videoDescription');
const contextInfo = document.getElementById('contextInfo');
const playBtn = document.getElementById('playBtn');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const nextBtn = document.getElementById('nextBtn');
const navButtons = document.querySelectorAll('nav button');

let currentCategory = null;
let currentVideoIndex = 0;
let isPlaying = false;
let progressInterval;

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    playlistCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            card.classList.remove('hidden');
        } else {
            card.classList.remove('active');
            card.classList.add('hidden');
        }
    });
});

// Playlist selection
playlistCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove active class from all cards
        playlistCards.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked card
        card.classList.add('active');
        
        // Update current category and load first video
        currentCategory = card.dataset.category;
        currentVideoIndex = 0;
        loadVideo();
    });
});

// Video controls
playBtn.addEventListener('click', togglePlay);
progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setProgress(pos * 100);
    if (currentCategory) {
        simulateVideoSeek(pos * videos[currentCategory][currentVideoIndex].duration);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentCategory && currentVideoIndex < videos[currentCategory].length - 1) {
        currentVideoIndex++;
        loadVideo();
    }
});

// Navigation
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
    });
});

// Helper functions
function loadVideo() {
    if (!currentCategory) return;
    
    const video = videos[currentCategory][currentVideoIndex];
    videoTitle.textContent = video.title;
    videoDescription.textContent = video.description;
    
    // Update context information
    updateContextInfo(video);
    
    resetProgress();
    
    // Reset play button and progress
    isPlaying = false;
    playBtn.textContent = '▶';
    clearInterval(progressInterval);
}

function updateContextInfo(video) {
    contextInfo.innerHTML = `
        <div class="context-section">
            <h4>Prerequisites</h4>
            <ul>${video.prerequisites.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="context-section">
            <h4>Next Steps</h4>
            <ul>${video.nextSteps.map(n => `<li>${n}</li>`).join('')}</ul>
        </div>
        <div class="context-section">
            <h4>Related Topics</h4>
            <ul>${video.relatedTopics.map(t => `<li>${t}</li>`).join('')}</ul>
        </div>
    `;
}

function togglePlay() {
    if (!currentCategory) return;
    
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '⏸' : '▶';
    
    if (isPlaying) {
        simulateVideoProgress();
    } else {
        clearInterval(progressInterval);
    }
}

function simulateVideoProgress() {
    clearInterval(progressInterval);
    const video = videos[currentCategory][currentVideoIndex];
    const startTime = Date.now();
    const startProgress = parseFloat(progress.style.width) || 0;
    
    progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = startProgress + (elapsed / (video.duration * 10));
        
        if (newProgress >= 100) {
            clearInterval(progressInterval);
            isPlaying = false;
            playBtn.textContent = '▶';
            return;
        }
        
        setProgress(newProgress);
    }, 100);
}

function simulateVideoSeek(seconds) {
    clearInterval(progressInterval);
    if (isPlaying) {
        simulateVideoProgress();
    }
}

function setProgress(value) {
    progress.style.width = `${Math.min(100, Math.max(0, value))}%`;
}

function resetProgress() {
    clearInterval(progressInterval);
    setProgress(0);
}

// Initialize with first video
loadVideo();