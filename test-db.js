// ============================================
// NEON DATABASE TEST - FRONTEND
// ============================================

// Show loading state
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('statusCard').style.display = 'none';
    document.getElementById('tableContainer').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
}

// Hide loading state
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Show error
function showError(message, details = null) {
    hideLoading();
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    let errorMessage = message;
    if (details) {
        errorMessage += `\n\nDetails: ${details}`;
    }
    
    errorText.textContent = errorMessage;
    errorText.style.whiteSpace = 'pre-wrap';
    errorDiv.style.display = 'block';
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Test database connection
async function testDatabase() {
    showLoading();
    
    // Disable button during request
    const btn = document.getElementById('testDbBtn');
    btn.disabled = true;
    
    try {
        console.log('Testing database connection...');
        const response = await fetch('/api/test-db');
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        // Check if response is OK before parsing JSON
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            
            let errorData;
            try {
                errorData = JSON.parse(errorText);
                console.error('Parsed error data:', errorData);
            } catch (parseError) {
                console.error('Failed to parse error as JSON:', parseError);
                errorData = { error: 'Unknown error', message: errorText };
            }
            throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: Connection failed`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid response format - expected JSON');
        }
        
        const data = await response.json();
        
        hideLoading();
        btn.disabled = false;
        
        if (data.success) {
            // Show success status
            const statusCard = document.getElementById('statusCard');
            const statusContent = document.getElementById('statusContent');
            
            statusContent.innerHTML = `
                <p><strong>Status:</strong> <span style="color: #10b981;">${data.status}</span></p>
                <p><strong>Message:</strong> ${data.message}</p>
                <p><strong>Database:</strong> <code>${data.database || 'N/A'}</code></p>
                <p><strong>User:</strong> <code>${data.user || 'N/A'}</code></p>
                <p><strong>PostgreSQL Version:</strong></p>
                <code>${data.version}</code>
            `;
            
            statusCard.style.display = 'block';
        } else {
            showError(`Error: ${data.error} - ${data.message || data.details || ''}`);
        }
        
    } catch (error) {
        hideLoading();
        btn.disabled = false;
        const errorDetails = error.stack || error.toString();
        showError(`Connection error: ${error.message}`, errorDetails);
        console.error('Full error:', error);
        console.error('Error stack:', error.stack);
    }
}

// Load users from database
async function loadUsers() {
    showLoading();
    
    // Disable button during request
    const btn = document.getElementById('loadUsersBtn');
    btn.disabled = true;
    
    try {
        const response = await fetch('/api/get-users');
        
        // Check if response is OK before parsing JSON
        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { error: 'Unknown error', message: errorText };
            }
            throw new Error(errorData.message || errorData.error || 'Failed to load users');
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid response format - expected JSON');
        }
        
        const data = await response.json();
        
        hideLoading();
        btn.disabled = false;
        
        if (data.success) {
            const tableContainer = document.getElementById('tableContainer');
            const tableBody = document.getElementById('usersTableBody');
            const noData = document.getElementById('noData');
            
            if (data.users && data.users.length > 0) {
                // Clear existing rows
                tableBody.innerHTML = '';
                
                // Add user rows
                data.users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td><strong>${user.name || 'N/A'}</strong></td>
                        <td>${user.device || 'N/A'}</td>
                        <td>${user.latitude ? parseFloat(user.latitude).toFixed(4) : 'N/A'}</td>
                        <td>${user.longitude ? parseFloat(user.longitude).toFixed(4) : 'N/A'}</td>
                        <td>${user.visit_time ? new Date(user.visit_time).toLocaleString() : 'N/A'}</td>
                    `;
                    tableBody.appendChild(row);
                });
                
                // Update table header count
                const h2 = tableContainer.querySelector('h2');
                h2.textContent = `Users Data (${data.count} users)`;
                
                noData.style.display = 'none';
                tableContainer.style.display = 'block';
            } else {
                noData.style.display = 'block';
                tableContainer.style.display = 'block';
                tableBody.innerHTML = '';
                
                // Update table header
                const h2 = tableContainer.querySelector('h2');
                h2.textContent = `Users Data${data.message ? ' - ' + data.message : ''}`;
            }
        } else {
            showError(`Error: ${data.error} - ${data.message || ''}`);
        }
        
    } catch (error) {
        hideLoading();
        btn.disabled = false;
        const errorDetails = error.stack || error.toString();
        showError(`Connection error: ${error.message}`, errorDetails);
        console.error('Full error:', error);
        console.error('Error stack:', error.stack);
    }
}

// Save demo user
async function saveDemoUser() {
    showLoading();
    
    // Disable button during request
    const btn = document.getElementById('saveDemoBtn');
    btn.disabled = true;
    
    // Generate demo data
    const demoData = {
        name: `Demo User ${Math.floor(Math.random() * 1000)}`,
        device: navigator.userAgent.substring(0, 50),
        latitude: (Math.random() * 180 - 90).toFixed(6),
        longitude: (Math.random() * 360 - 180).toFixed(6),
        visit_time: new Date().toISOString()
    };
    
    try {
        console.log('Saving demo user...', demoData);
        const response = await fetch('/api/save-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(demoData)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        // Get response text first to check what we're dealing with
        const responseText = await response.text();
        console.log('Response text (first 500 chars):', responseText.substring(0, 500));
        
        // Check if response is OK before parsing JSON
        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText);
                console.error('Parsed error data:', errorData);
            } catch (parseError) {
                console.error('Failed to parse error as JSON:', parseError);
                console.error('Raw error response:', responseText);
                errorData = { 
                    error: 'Unknown error', 
                    message: responseText || `HTTP ${response.status}: ${response.statusText}`,
                    details: `Response was not valid JSON. Status: ${response.status}`
                };
            }
            throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: Failed to save user`);
        }
        
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Non-JSON response received:', responseText.substring(0, 200));
            throw new Error(`Invalid response format - expected JSON, got ${contentType || 'unknown'}. Response: ${responseText.substring(0, 100)}`);
        }
        
        let data;
        try {
            data = JSON.parse(responseText);
            console.log('Parsed response data:', data);
        } catch (parseError) {
            console.error('Failed to parse response as JSON:', parseError);
            throw new Error(`Failed to parse JSON response: ${parseError.message}. Response: ${responseText.substring(0, 200)}`);
        }
        
        hideLoading();
        btn.disabled = false;
        
        if (data.success && data.user) {
            // Show success message
            const statusCard = document.getElementById('statusCard');
            const statusContent = document.getElementById('statusContent');
            
            statusContent.innerHTML = `
                <p style="color: #10b981;"><strong>✅ User saved successfully!</strong></p>
                <p><strong>Name:</strong> ${data.user.name}</p>
                <p><strong>ID:</strong> ${data.user.id}</p>
                <p><strong>Message:</strong> ${data.message}</p>
                <p>Click "Load Users" to see all users.</p>
            `;
            
            statusCard.style.display = 'block';
            
            // Auto-load users after 1 second
            setTimeout(() => {
                loadUsers();
            }, 1000);
        } else {
            showError(`Error: ${data.error || 'Unknown error'} - ${data.message || ''}`);
        }
        
    } catch (error) {
        hideLoading();
        btn.disabled = false;
        const errorDetails = error.stack || error.toString();
        showError(`Connection error: ${error.message}`, errorDetails);
        console.error('Full error:', error);
        console.error('Error stack:', error.stack);
    }
}
