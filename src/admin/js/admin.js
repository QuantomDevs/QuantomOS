// Admin Panel JavaScript

// API Configuration
const API_BASE_URL = 'http://localhost:3022/api';

// Server data (loaded from backend)
let servers = [];
let currentEditId = null;

// Fetch server configs from backend
async function fetchServerConfigs() {
    try {
        const response = await fetch(`${API_BASE_URL}/nginx/configs`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        servers = data.configs || [];
        console.log('Loaded server configs:', servers);
        return servers;
    } catch (error) {
        console.error('Error fetching server configs:', error);
        // Return empty array if backend is not available
        return [];
    }
}

// DOM Elements
const userDropdownToggle = document.getElementById('user-dropdown-toggle');
const userDropdownMenu = document.getElementById('user-dropdown-menu');
const navButtons = document.querySelectorAll('.nav-button');
const contentTabs = document.querySelectorAll('.content-tab');
const serverList = document.getElementById('server-list');
const addServerBtn = document.getElementById('add-server-btn');
const serverPopup = document.getElementById('server-popup');
const closeServerPopup = document.getElementById('close-server-popup');
const cancelServerBtn = document.getElementById('cancel-server-btn');
const serverConfigForm = document.getElementById('server-config-form');
const webmanagerSearchInput = document.getElementById('webmanager-search-input');
const webmanagerClearSearch = document.getElementById('webmanager-clear-search');

// User Dropdown Toggle
userDropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdownToggle.classList.toggle('active');
    userDropdownMenu.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-info-box')) {
        userDropdownToggle.classList.remove('active');
        userDropdownMenu.classList.remove('active');
    }
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', () => {
    // Implement logout logic here
    alert('Logout functionality will be implemented');
    window.location.href = 'index.html';
});

// Change password functionality
document.getElementById('change-password-btn').addEventListener('click', () => {
    // Implement change password logic here
    alert('Change password functionality will be implemented');
});

// Tab Switching
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and tabs
        navButtons.forEach(btn => btn.classList.remove('active'));
        contentTabs.forEach(tab => tab.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Show corresponding tab
        const tabName = button.getAttribute('data-tab');
        const activeTab = document.getElementById(`${tabName}-tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // If WebManager tab is active, load and render servers
        if (tabName === 'webmanager') {
            loadAndRenderServers();
        }
    });
});

// Load and render servers
async function loadAndRenderServers() {
    serverList.innerHTML = `
        <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
            </svg>
            <h2>Loading...</h2>
            <p>Fetching server configurations...</p>
        </div>
    `;

    await fetchServerConfigs();
    renderServers();
}

// Render Server List
function renderServers(filter = '') {
    serverList.innerHTML = '';

    const filteredServers = servers.filter(server =>
        server.name.toLowerCase().includes(filter.toLowerCase()) ||
        server.url.toLowerCase().includes(filter.toLowerCase()) ||
        server.description.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredServers.length === 0) {
        serverList.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <h2>No servers found</h2>
                <p>Try adjusting your search or add a new server</p>
            </div>
        `;
        return;
    }

    filteredServers.forEach(server => {
        const serverItem = document.createElement('div');
        serverItem.className = 'server-item';
        serverItem.innerHTML = `
            <div class="server-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            </div>
            <div class="server-info">
                <div class="server-url">${server.name}</div>
                <div class="server-description">↳ ${server.url}</div>
            </div>
            <div class="server-meta">
                <span class="server-badge">${server.description}</span>
                <span class="server-badge" style="background: var(--accent-color); color: white;">
                    <span style="display: inline-block; width: 8px; height: 8px; background: white; border-radius: 50%; margin-right: 5px;"></span>
                    ${server.clicks} clicks
                </span>
            </div>
            <div class="server-actions">
                <button class="server-action-btn" onclick="editServer(${server.id})">Edit</button>
                <button class="server-action-btn delete" onclick="deleteServer(${server.id})">Delete</button>
            </div>
        `;
        serverList.appendChild(serverItem);
    });
}

// Search functionality
webmanagerSearchInput.addEventListener('input', (e) => {
    const searchValue = e.target.value;
    webmanagerClearSearch.style.display = searchValue ? 'flex' : 'none';
    renderServers(searchValue);
});

webmanagerClearSearch.addEventListener('click', () => {
    webmanagerSearchInput.value = '';
    webmanagerClearSearch.style.display = 'none';
    renderServers();
});

// Add Server
addServerBtn.addEventListener('click', () => {
    currentEditId = null;
    document.getElementById('server-popup-title').textContent = 'Add Server Configuration';
    serverConfigForm.reset();
    serverPopup.classList.add('active');
});

// Close Popup
closeServerPopup.addEventListener('click', () => {
    serverPopup.classList.remove('active');
});

cancelServerBtn.addEventListener('click', () => {
    serverPopup.classList.remove('active');
});

// Close popup when clicking outside
serverPopup.addEventListener('click', (e) => {
    if (e.target === serverPopup) {
        serverPopup.classList.remove('active');
    }
});

// Edit Server
function editServer(id) {
    const server = servers.find(s => s.id === id);
    if (!server) return;

    currentEditId = id;
    document.getElementById('server-popup-title').textContent = 'Edit Server Configuration';
    document.getElementById('server-name').value = server.name;
    document.getElementById('server-type').value = server.type;
    document.getElementById('server-port').value = server.port;
    document.getElementById('server-root').value = server.root || '';
    document.getElementById('server-domain').value = server.url || '';
    document.getElementById('proxy-pass').value = server.proxy || '';
    document.getElementById('ssl-enabled').checked = server.ssl || false;

    serverPopup.classList.add('active');
}

// Delete Server
async function deleteServer(id) {
    const server = servers.find(s => s.id === id);
    if (!server) return;

    if (!confirm('Are you sure you want to delete this server configuration?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/nginx/configs/${server.name}?type=${server.type}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('Server configuration deleted successfully!');
        await loadAndRenderServers();
    } catch (error) {
        console.error('Error deleting server:', error);
        alert('Failed to delete server configuration. Check console for details.');
    }
}

// Save Server Configuration
serverConfigForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('server-name').value,
        type: document.getElementById('server-type').value,
        port: parseInt(document.getElementById('server-port').value),
        root: document.getElementById('server-root').value,
        domain: document.getElementById('server-domain').value,
        proxy: document.getElementById('proxy-pass').value,
        ssl: document.getElementById('ssl-enabled').checked
    };

    try {
        const response = await fetch(`${API_BASE_URL}/nginx/configs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save configuration');
        }

        alert('Server configuration saved successfully!');
        serverPopup.classList.remove('active');
        serverConfigForm.reset();
        await loadAndRenderServers();
    } catch (error) {
        console.error('Error saving server:', error);
        alert(`Failed to save server configuration: ${error.message}`);
    }
});

// Initial load - don't render automatically, wait for tab activation

// Escape key to close popup
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serverPopup.classList.contains('active')) {
        serverPopup.classList.remove('active');
    }
});
