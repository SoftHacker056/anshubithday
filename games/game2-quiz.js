// Quiz questions - mix of law and fun questions
const questions = [
    {
        question: "What does 'Habeas Corpus' mean?",
        options: ["You have the body", "You have the case", "You have the right", "You have the evidence"],
        correct: 0
    },
    {
        question: "In which year did she start her law journey?",
        options: ["2023", "2024", "2025", "2026"],
        correct: 2
    },
    {
        question: "What is the symbol of justice?",
        options: ["⚖️ Scales", "🔨 Hammer", "📚 Book", "🎓 Cap"],
        correct: 0
    },
    {
        question: "What's the best way to win an argument?",
        options: ["Yell louder", "Present evidence", "Walk away", "Agree to disagree"],
        correct: 1
    },
    {
        question: "What does 'Pro Bono' mean?",
        options: ["For free", "For money", "For fun", "For justice"],
        correct: 0
    },
    {
        question: "How many years of law school typically?",
        options: ["3 years", "4 years", "5 years", "6 years"],
        correct: 0
    },
    {
        question: "What's her dream profession?",
        options: ["Doctor", "Engineer", "Advocate", "Teacher"],
        correct: 2
    },
    {
        question: "What is 'Stare Decisis'?",
        options: ["Stand by decision", "New decision", "Appeal decision", "Ignore decision"],
        correct: 0
    },
    {
        question: "Best study snack for law students?",
        options: ["Pizza", "Coffee", "Books", "All of the above"],
        correct: 3
    },
    {
        question: "What color is the advocate's robe?",
        options: ["Black", "White", "Blue", "Red"],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;
let totalQuestions = questions.length;

// Initialize quiz
function initQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('totalQuestions').textContent = totalQuestions;
    loadQuestion();
}

// Load question
function loadQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('questionNum').textContent = currentQuestion + 1;
    document.getElementById('score').textContent = score;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionElement);
    });
}

// Select option
function selectOption(selectedIndex) {
    const question = questions[currentQuestion];
    const options = document.querySelectorAll('.option');
    
    // Disable all options
    options.forEach(opt => {
        opt.classList.add('disabled');
    });
    
    // Show correct/incorrect
    if (selectedIndex === question.correct) {
        options[selectedIndex].classList.add('correct');
        score++;
        showResult(true);
    } else {
        options[selectedIndex].classList.add('wrong');
        options[question.correct].classList.add('correct');
        showResult(false);
    }
    
    document.getElementById('score').textContent = score;
}

// Show result modal
function showResult(isCorrect) {
    const modal = document.getElementById('resultModal');
    const title = document.getElementById('resultTitle');
    const text = document.getElementById('resultText');
    
    if (isCorrect) {
        title.textContent = '🎉 Correct!';
        text.textContent = 'Great job! You got it right!';
    } else {
        title.textContent = '❌ Wrong!';
        text.textContent = `The correct answer was: ${questions[currentQuestion].options[questions[currentQuestion].correct]}`;
    }
    
    modal.classList.add('show');
}

// Next question
function nextQuestion() {
    document.getElementById('resultModal').classList.remove('show');
    currentQuestion++;
    
    if (currentQuestion < totalQuestions) {
        loadQuestion();
    } else {
        showFinalModal();
    }
}

// Show final modal
function showFinalModal() {
    const modal = document.getElementById('finalModal');
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalTotal').textContent = totalQuestions;
    
    const message = document.getElementById('finalMessage');
    const percentage = (score / totalQuestions) * 100;
    
    if (percentage === 100) {
        message.textContent = 'Perfect score! You\'re a legal genius! ⚖️';
    } else if (percentage >= 70) {
        message.textContent = 'Great job! You know your law! 📚';
    } else if (percentage >= 50) {
        message.textContent = 'Good effort! Keep studying! 🎓';
    } else {
        message.textContent = 'Keep practicing! You\'ll get there! 💪';
    }
    
    modal.classList.add('show');
}

// Reset quiz
function resetQuiz() {
    document.getElementById('finalModal').classList.remove('show');
    initQuiz();
}

// Initialize on load
window.addEventListener('load', initQuiz);
