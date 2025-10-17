// This file now handles the logic for the App Store POP-UP within index.html
// It is no longer tied to app-store.html

let allCommands = [];
let selectedCommands = new Set(); // Stores IDs of selected commands
let currentCategory = 'All'; // Default category
let currentSearchTerm = ''; // Current search term

// DOM Elements for the App Store Popup
const appStorePopup = document.getElementById('app-store-popup');
const appStoreCategoryButtonsContainer = document.getElementById('app-store-category-buttons');
const appStoreSelectAllToggleBtn = document.getElementById('app-store-select-all-toggle-btn');
const appStoreCommandList = document.getElementById('app-store-command-list');
const appStoreLivePreview = document.getElementById('app-store-live-preview');
const appStoreCopyButton = document.getElementById('app-store-copy-button');
const appStoreDownloadButton = document.getElementById('app-store-download-button');

// Search Elements
const appStoreSearchInput = document.getElementById('app-store-search-input');
const appStoreClearSearch = document.getElementById('app-store-clear-search');

// Function to display toast notifications (assuming it's globally available or imported)
// If not, a placeholder function will be used.
if (typeof showNotification !== 'function') {
    window.showNotification = (message, type) => {
        console.log(`Notification (${type}): ${message}`);
        // Implement actual toast notification logic here if needed
    };
}

// Function to fetch commands from app-store.json
const fetchCommands = async () => {
    try {
        const response = await fetch('./config/app-store.json');
        const data = await response.json();

        // Data now has a categories structure, so extract commands from all categories
        allCommands = [];
        data.categories.forEach(category => {
            // Add category field to each command for backward compatibility
            category.commands.forEach(cmd => {
                allCommands.push({
                    ...cmd,
                    category: category.name
                });
            });
        });

        // Extract category names from the data structure
        const categories = data.categories.map(cat => cat.name);
        renderCategories(categories);
        filterAndRenderCommands();
    } catch (error) {
        console.error('Error fetching commands:', error);
        appStoreCommandList.innerHTML = '<p>Error loading commands. Please try again later.</p>';
        showNotification('Error loading commands for App Store.', 'error');
    }
};

// Function to get category icon
const getCategoryIcon = (categoryName) => {
    const icons = {
        'System & Utilities': '⚙️',
        'Development & Programming': '💻',
        'Server & Infrastructure': '🖥️',
        'Network & Security': '🔒',
        'File Management & Processing': '📁'
    };
    return icons[categoryName] || '📦';
};

// Function to count commands in category
const getCommandCount = (categoryName) => {
    if (categoryName === 'All') {
        return allCommands.length;
    }
    return allCommands.filter(cmd => cmd.category === categoryName).length;
};

// Function to render category buttons
const renderCategories = (categories) => {
    appStoreCategoryButtonsContainer.innerHTML = '';

    // Add "All" category button
    const allButton = document.createElement('button');
    allButton.classList.add('app-store-category-button');
    const allCount = getCommandCount('All');
    allButton.innerHTML = `📦 All (${allCount})`;
    allButton.dataset.category = 'All';
    if (currentCategory === 'All') {
        allButton.classList.add('active');
    }
    allButton.addEventListener('click', () => {
        currentCategory = 'All';
        filterAndRenderCommands();
        updateCategoryButtons();
    });
    appStoreCategoryButtonsContainer.appendChild(allButton);

    // Add dynamic category buttons
    categories.sort().forEach(categoryName => {
        const button = document.createElement('button');
        button.classList.add('app-store-category-button');
        const icon = getCategoryIcon(categoryName);
        const count = getCommandCount(categoryName);
        button.innerHTML = `${icon} ${categoryName} (${count})`;
        button.dataset.category = categoryName;
        if (currentCategory === categoryName) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentCategory = categoryName;
            filterAndRenderCommands();
            updateCategoryButtons();
        });
        appStoreCategoryButtonsContainer.appendChild(button);
    });
};

// Function to update active state of category buttons
const updateCategoryButtons = () => {
    document.querySelectorAll('.app-store-category-button').forEach(button => {
        if (button.dataset.category === currentCategory) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
};

// Function to filter and render commands based on current category and search term
const filterAndRenderCommands = () => {
    let filteredCommands = allCommands;

    // Apply search filter
    if (currentSearchTerm) {
        filteredCommands = filteredCommands.filter(cmd =>
            cmd.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            cmd.category.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            cmd.command.toLowerCase().includes(currentSearchTerm.toLowerCase())
        );
        // When searching, show all categories
        currentCategory = 'All';
        updateCategoryButtons();
    } else if (currentCategory !== 'All') {
        // Apply category filter only when not searching
        filteredCommands = filteredCommands.filter(cmd => cmd.category === currentCategory);
    }

    renderCommandList(filteredCommands);
    updateScriptPreview();
};

// Function to render command list checkboxes
const renderCommandList = (commandsToRender) => {
    appStoreCommandList.innerHTML = ''; // Clear previous content

    if (commandsToRender.length === 0) {
        appStoreCommandList.innerHTML = '<p>No commands found.</p>';
        return;
    }

    commandsToRender.sort((a, b) => a.name.localeCompare(b.name)).forEach(cmd => {
        const commandItemDiv = document.createElement('div');
        commandItemDiv.classList.add('app-store-command-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `app-store-cmd-${cmd.id}`;
        checkbox.value = cmd.id;
        checkbox.checked = selectedCommands.has(cmd.id); // Maintain state from localStorage

        const label = document.createElement('label');
        label.htmlFor = `app-store-cmd-${cmd.id}`;
        label.textContent = cmd.name;

        commandItemDiv.appendChild(checkbox);
        commandItemDiv.appendChild(label);
        appStoreCommandList.appendChild(commandItemDiv);

        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                selectedCommands.add(cmd.id);
            } else {
                selectedCommands.delete(cmd.id);
            }
            saveSelectedCommands();
            updateScriptPreview();
        });
    });
};

// Function to update the live script preview
const updateScriptPreview = () => {
    let scriptContent = '#!/bin/bash\n\n';
    scriptContent += '# This script was generated by Quantom Cloud App Store.\n';
    scriptContent += '# For more information, visit your website.\n\n';

    const sortedSelectedCommands = Array.from(selectedCommands)
        .map(id => allCommands.find(cmd => cmd.id === id))
        .filter(cmd => cmd !== undefined)
        .sort((a, b) => a.id - b.id);

    if (sortedSelectedCommands.length === 0) {
        scriptContent += '# No commands selected yet. Select commands from the left panel to generate your script.\n';
    } else {
        sortedSelectedCommands.forEach(cmd => {
            scriptContent += `# ${cmd.name}\n`;
            scriptContent += `${cmd.command}\n\n`;
        });
    }
    appStoreLivePreview.textContent = scriptContent.trim();
};

// Save selected commands to localStorage
const saveSelectedCommands = () => {
    localStorage.setItem('appStoreSelectedCommands', JSON.stringify(Array.from(selectedCommands)));
};

// Load selected commands from localStorage
const loadSelectedCommands = () => {
    const savedCommands = localStorage.getItem('appStoreSelectedCommands');
    if (savedCommands) {
        selectedCommands = new Set(JSON.parse(savedCommands));
    }
};

// Toggle select all/deselect all commands in the current filtered view
appStoreSelectAllToggleBtn.addEventListener('click', () => {
    const checkboxes = appStoreCommandList.querySelectorAll('input[type="checkbox"]');
    const allCurrentlySelected = Array.from(checkboxes).every(cb => cb.checked);

    checkboxes.forEach(checkbox => {
        checkbox.checked = !allCurrentlySelected;
        const cmdId = parseInt(checkbox.value);
        if (checkbox.checked) {
            selectedCommands.add(cmdId);
        } else {
            selectedCommands.delete(cmdId);
        }
    });
    saveSelectedCommands();
    updateScriptPreview();
});


// Copy Script functionality
appStoreCopyButton.addEventListener('click', async () => {
    const textToCopy = appStoreLivePreview.textContent;
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
            showNotification('Script copied to clipboard!', 'success');
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand('copy');
                showNotification('Script copied to clipboard (fallback)!', 'success');
            } catch (err) {
                console.error('Fallback copy failed: ', err);
                showNotification('Failed to copy script. Please copy manually.', 'error');
            } finally {
                document.body.removeChild(textarea);
            }
        }
    } catch (err) {
        console.error('Failed to copy script: ', err);
        showNotification('Failed to copy script. Please copy manually.', 'error');
    }
});

// Download Script functionality
appStoreDownloadButton.addEventListener('click', () => {
    const scriptContent = appStoreLivePreview.textContent;
    if (scriptContent.trim() === '#!/bin/bash\n\n# This script was generated by Quantom Cloud App Store.\n# For more information, visit your website.\n\n# No commands selected yet. Select commands from the left panel to generate your script.') {
        showNotification('No commands selected to download.', 'error');
        return;
    }
    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'generated_script.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    showNotification('Script downloaded successfully!', 'success');
});

// Search functionality
const setupSearchFunctionality = () => {
    if (appStoreSearchInput) {
        let searchTimeout;

        // Input event for real-time command filtering
        appStoreSearchInput.addEventListener('input', (event) => {
            const query = event.target.value.trim();

            // Show/hide clear button
            if (appStoreClearSearch) {
                appStoreClearSearch.style.display = query ? 'flex' : 'none';
            }

            // Debounce search to avoid too many calls
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentSearchTerm = query;
                filterAndRenderCommands();
            }, 300);
        });

        // Clear button functionality
        if (appStoreClearSearch) {
            appStoreClearSearch.addEventListener('click', () => {
                appStoreSearchInput.value = '';
                appStoreClearSearch.style.display = 'none';
                currentSearchTerm = '';
                filterAndRenderCommands();
            });
        }

        // Escape key to clear search
        appStoreSearchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                appStoreSearchInput.value = '';
                if (appStoreClearSearch) {
                    appStoreClearSearch.style.display = 'none';
                }
                currentSearchTerm = '';
                filterAndRenderCommands();
            }
        });
    }
};

// Initialization function for the App Store
window.initializeAppStore = () => {
    loadSelectedCommands(); // Load previously selected commands
    fetchCommands(); // Fetch commands and render UI
    updateCategoryButtons(); // Ensure category buttons are correctly styled on open
    filterAndRenderCommands(); // Initial render based on default category and search
    setupSearchFunctionality(); // Initialize search functionality
};

// Initial call to fetch commands and set up UI when the script loads
// This will only run if the app-store.js is loaded directly,
// but the primary entry point will be initializeAppStore() from index.js
// when the popup is opened.
// fetchCommands();
