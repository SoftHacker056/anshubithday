// Law icons for memory game (8 unique icons, each appears twice = 16 cards total)
const uniqueIcons = ['⚖️', '📚', '🎓', '📜', '🔨', '⚖️', '📚', '🎓'];
const lawIcons = [...uniqueIcons, ...uniqueIcons]; // 8 pairs = 16 cards

let cards = [];
let flippedCards = [];
let moves = 0;
let matches = 0;
let lockBoard = false;

// Initialize game
function initGame() {
    moves = 0;
    matches = 0;
    flippedCards = [];
    lockBoard = false;
    
    // Shuffle icons
    const shuffledIcons = [...lawIcons].sort(() => Math.random() - 0.5);
    
    // Create cards
    cards = shuffledIcons.map((icon, index) => ({
        icon,
        id: index,
        flipped: false,
        matched: false
    }));
    
    renderCards();
    updateScore();
}

// Render cards on board
function renderCards() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        if (card.flipped) cardElement.classList.add('flipped');
        if (card.matched) cardElement.classList.add('matched');
        
        cardElement.innerHTML = `
            <div class="card-front">?</div>
            <div class="card-back">${card.icon}</div>
        `;
        
        cardElement.addEventListener('click', () => flipCard(card.id));
        gameBoard.appendChild(cardElement);
    });
}

// Flip card
function flipCard(cardId) {
    if (lockBoard) return;
    
    const card = cards[cardId];
    if (card.flipped || card.matched) return;
    
    // Flip the card
    card.flipped = true;
    flippedCards.push(card);
    
    moves++;
    updateScore();
    renderCards();
    
    // Check for match
    if (flippedCards.length === 2) {
        lockBoard = true;
        setTimeout(checkMatch, 1000);
    }
}

// Check if two flipped cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.icon === card2.icon) {
        // Match found!
        card1.matched = true;
        card2.matched = true;
        matches++;
        
        // Play success sound (if available)
        playSound('success');
        
        // Check if game is won
        if (matches === cards.length / 2) {
            setTimeout(showWinModal, 500);
        }
    } else {
        // No match, flip back
        card1.flipped = false;
        card2.flipped = false;
    }
    
    flippedCards = [];
    lockBoard = false;
    renderCards();
}

// Update score display
function updateScore() {
    document.getElementById('moves').textContent = moves;
    document.getElementById('matches').textContent = matches;
}

// Show win modal
function showWinModal() {
    document.getElementById('finalMoves').textContent = moves;
    document.getElementById('winModal').classList.add('show');
}

// Reset game
function resetGame() {
    document.getElementById('winModal').classList.remove('show');
    initGame();
}

// Play sound (placeholder - you can add actual sound files)
function playSound(type) {
    // You can add actual sound files here
    console.log(`Playing ${type} sound`);
}

// Initialize game on load
window.addEventListener('load', initGame);
