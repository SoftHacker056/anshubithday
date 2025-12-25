let clicks = 0;
let timer = 10;
let gameStarted = false;
let gameActive = false;
let timerInterval;
let startTime;

// Handle click
function handleClick() {
    if (!gameStarted) {
        startGame();
        return;
    }
    
    if (!gameActive) return;
    
    clicks++;
    document.getElementById('clicks').textContent = clicks;
    
    // Calculate CPS
    const elapsed = (Date.now() - startTime) / 1000;
    const cps = (clicks / elapsed).toFixed(1);
    document.getElementById('cps').textContent = cps;
    
    // Animate button
    const btn = document.getElementById('clickBtn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 100);
}

// Start game
function startGame() {
    gameStarted = true;
    gameActive = true;
    clicks = 0;
    timer = 10;
    startTime = Date.now();
    
    document.getElementById('instructions').textContent = 'Click as fast as you can!';
    document.getElementById('clickBtn').textContent = 'CLICK ME!';
    
    // Start timer
    timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timer').textContent = timer;
        
        if (timer <= 0) {
            endGame();
        }
    }, 1000);
}

// End game
function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    
    const elapsed = (Date.now() - startTime) / 1000;
    const cps = (clicks / elapsed).toFixed(1);
    
    document.getElementById('clickBtn').classList.add('disabled');
    document.getElementById('clickBtn').textContent = 'Time\'s Up!';
    
    // Show results
    setTimeout(() => {
        showResults(clicks, cps);
    }, 500);
}

// Show results
function showResults(totalClicks, avgCps) {
    document.getElementById('finalClicks').textContent = totalClicks;
    document.getElementById('finalCPS').textContent = avgCps;
    
    const message = document.getElementById('resultMessage');
    
    if (totalClicks >= 100) {
        message.textContent = 'Incredible! You\'re a clicking machine! 🚀';
    } else if (totalClicks >= 70) {
        message.textContent = 'Amazing speed! You\'re really fast! ⚡';
    } else if (totalClicks >= 50) {
        message.textContent = 'Good job! Keep practicing! 💪';
    } else if (totalClicks >= 30) {
        message.textContent = 'Not bad! Try to beat your record! 🎯';
    } else {
        message.textContent = 'Keep trying! You can do better! 💙';
    }
    
    document.getElementById('resultModal').classList.add('show');
}

// Reset game
function resetGame() {
    document.getElementById('resultModal').classList.remove('show');
    gameStarted = false;
    gameActive = false;
    clicks = 0;
    timer = 10;
    
    document.getElementById('timer').textContent = timer;
    document.getElementById('clicks').textContent = clicks;
    document.getElementById('cps').textContent = '0';
    document.getElementById('instructions').textContent = 'Click the button below to start';
    document.getElementById('clickBtn').textContent = 'START GAME';
    document.getElementById('clickBtn').classList.remove('disabled');
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}
