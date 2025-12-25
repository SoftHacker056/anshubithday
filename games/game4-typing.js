// Law-themed sentences for typing practice
const sentences = [
    "Justice delayed is justice denied, but she will make sure justice is served!",
    "The future advocate is studying hard to fight for what is right in the courtroom.",
    "From school arguments to legal arguments, the journey of justice begins now!",
    "Every case needs evidence, every argument needs facts, and every lawyer needs determination.",
    "The black robe awaits, the gavel is ready, and the courtroom is calling her name!"
];

let currentSentence = '';
let currentWordIndex = 0;
let words = [];
let timer = 60;
let gameActive = false;
let timerInterval;
let startTime;
let totalChars = 0;
let correctChars = 0;
let errors = 0;

// Initialize game
function initGame() {
    // Pick random sentence
    currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
    words = currentSentence.split(' ');
    currentWordIndex = 0;
    timer = 60;
    totalChars = 0;
    correctChars = 0;
    errors = 0;
    
    displayText();
    updateStats();
}

// Display text
function displayText() {
    const display = document.getElementById('textDisplay');
    display.innerHTML = '';
    
    words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        if (index === currentWordIndex) {
            wordSpan.classList.add('current');
        }
        wordSpan.textContent = word + ' ';
        display.appendChild(wordSpan);
    });
}

// Start game
function startGame() {
    gameActive = true;
    startTime = Date.now();
    document.getElementById('startBtn').disabled = true;
    document.getElementById('typingInput').disabled = false;
    document.getElementById('typingInput').focus();
    
    // Start timer
    timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timer').textContent = timer;
        
        if (timer <= 0) {
            endGame();
        }
    }, 1000);
    
    // Listen for input
    document.getElementById('typingInput').addEventListener('input', handleInput);
}

// Handle input
function handleInput(e) {
    if (!gameActive) return;
    
    const input = e.target.value.trim();
    const currentWord = words[currentWordIndex];
    
    totalChars++;
    
    // Check if word is complete
    if (input === currentWord) {
        // Word is correct
        words[currentWordIndex] = `<span class="word correct">${currentWord}</span>`;
        currentWordIndex++;
        correctChars += currentWord.length;
        
        // Clear input
        e.target.value = '';
        
        // Check if all words are done
        if (currentWordIndex >= words.length) {
            // New sentence
            initGame();
        } else {
            displayText();
        }
    } else if (input.length > 0 && !currentWord.startsWith(input)) {
        // Error detected
        errors++;
    }
    
    updateStats();
}

// Update stats
function updateStats() {
    const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const wpm = elapsed > 0 ? Math.round((correctChars / 5) / elapsed) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    
    document.getElementById('wpm').textContent = wpm;
    document.getElementById('accuracy').textContent = accuracy;
}

// End game
function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    document.getElementById('typingInput').disabled = true;
    
    const elapsed = (Date.now() - startTime) / 1000 / 60;
    const wpm = elapsed > 0 ? Math.round((correctChars / 5) / elapsed) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    
    showResults(wpm, accuracy, correctChars / 5);
}

// Show results
function showResults(wpm, accuracy, words) {
    document.getElementById('finalWPM').textContent = wpm;
    document.getElementById('finalAccuracy').textContent = accuracy;
    document.getElementById('finalWords').textContent = Math.round(words);
    
    const message = document.getElementById('resultMessage');
    
    if (wpm >= 60 && accuracy >= 95) {
        message.textContent = 'Outstanding! You\'re a typing master! 🚀';
    } else if (wpm >= 40 && accuracy >= 90) {
        message.textContent = 'Great job! Your typing skills are impressive! ⚡';
    } else if (wpm >= 30 && accuracy >= 85) {
        message.textContent = 'Good effort! Keep practicing! 💪';
    } else {
        message.textContent = 'Keep trying! Practice makes perfect! 🎯';
    }
    
    document.getElementById('resultModal').classList.add('show');
}

// Reset game
function resetGame() {
    document.getElementById('resultModal').classList.remove('show');
    document.getElementById('typingInput').value = '';
    document.getElementById('typingInput').removeEventListener('input', handleInput);
    document.getElementById('startBtn').disabled = false;
    document.getElementById('typingInput').disabled = true;
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    initGame();
}

// Initialize on load
window.addEventListener('load', () => {
    initGame();
    document.getElementById('typingInput').disabled = true;
});
