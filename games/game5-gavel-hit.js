let score = 0;
let missed = 0;
let timer = 30;
let gameActive = false;
let timerInterval;
let gavelInterval;
let gavelElement;

// Start game
function startGame() {
    gameActive = true;
    score = 0;
    missed = 0;
    timer = 30;
    
    document.getElementById('startBtn').disabled = true;
    document.getElementById('startBtn').textContent = 'Game Active!';
    
    updateScore();
    
    // Start timer
    timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timer').textContent = timer;
        
        if (timer <= 0) {
            endGame();
        }
    }, 1000);
    
    // Start spawning gavels
    spawnGavel();
    gavelInterval = setInterval(spawnGavel, 1500);
}

// Spawn gavel at random position
function spawnGavel() {
    if (!gameActive) return;
    
    const playArea = document.getElementById('playArea');
    const gavel = document.createElement('div');
    gavel.className = 'gavel';
    gavel.textContent = '🔨';
    gavel.onclick = hitGavel;
    gavelElement = gavel;
    
    // Random position
    const maxX = playArea.offsetWidth - 80;
    const maxY = playArea.offsetHeight - 80;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    
    gavel.style.left = x + 'px';
    gavel.style.top = y + 'px';
    
    playArea.appendChild(gavel);
    
    // Remove gavel after 1.5 seconds if not hit
    setTimeout(() => {
        if (gavel.parentNode && gameActive) {
            gavel.classList.add('missed');
            missed++;
            updateScore();
            setTimeout(() => {
                if (gavel.parentNode) {
                    gavel.remove();
                }
            }, 500);
        }
    }, 1500);
}

// Hit gavel
function hitGavel() {
    if (!gameActive) return;
    
    const gavel = event.target;
    if (gavel.classList.contains('hit') || gavel.classList.contains('missed')) return;
    
    gavel.classList.add('hit');
    score++;
    updateScore();
    
    // Play hit sound effect (visual feedback)
    gavel.style.transform = 'scale(1.5) rotate(30deg)';
    
    setTimeout(() => {
        if (gavel.parentNode) {
            gavel.remove();
        }
    }, 300);
}

// Update score
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('missed').textContent = missed;
}

// End game
function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    clearInterval(gavelInterval);
    
    // Remove all gavels
    const gavels = document.querySelectorAll('.gavel');
    gavels.forEach(gavel => gavel.remove());
    
    document.getElementById('startBtn').disabled = false;
    document.getElementById('startBtn').textContent = 'Start Game';
    
    // Calculate accuracy
    const total = score + missed;
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
    
    showResults(score, missed, accuracy);
}

// Show results
function showResults(finalScore, finalMissed, accuracy) {
    document.getElementById('finalScore').textContent = finalScore;
    document.getElementById('finalMissed').textContent = finalMissed;
    document.getElementById('accuracy').textContent = accuracy;
    
    const message = document.getElementById('resultMessage');
    
    if (finalScore >= 20 && accuracy >= 80) {
        message.textContent = 'Incredible! You\'re a gavel master! 🔨⚖️';
    } else if (finalScore >= 15 && accuracy >= 70) {
        message.textContent = 'Great job! Your reflexes are amazing! ⚡';
    } else if (finalScore >= 10) {
        message.textContent = 'Good effort! Keep practicing! 💪';
    } else {
        message.textContent = 'Keep trying! You\'ll get better! 🎯';
    }
    
    document.getElementById('resultModal').classList.add('show');
}

// Reset game
function resetGame() {
    document.getElementById('resultModal').classList.remove('show');
    score = 0;
    missed = 0;
    timer = 30;
    
    document.getElementById('timer').textContent = timer;
    updateScore();
    
    // Remove all gavels
    const gavels = document.querySelectorAll('.gavel');
    gavels.forEach(gavel => gavel.remove());
    
    if (timerInterval) clearInterval(timerInterval);
    if (gavelInterval) clearInterval(gavelInterval);
}
