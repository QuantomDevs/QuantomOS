
document.addEventListener('DOMContentLoaded', () => {
    // All DOM element declarations at the very top
    const greetingElement = document.getElementById('greeting');
    const timeDisplayElement = document.getElementById('time-display');
    const appGrid = document.getElementById('app-grid');
    // Add main-app-grid class for CSS targeting
    if (appGrid) appGrid.classList.add('main-app-grid');

    const homeButton = document.getElementById('home-button');
    const appStoreButton = document.getElementById('app-store-button');
    const settingsButton = document.getElementById('settings-button');
    const filesButton = document.getElementById('files-button');
    const airbusButton = document.getElementById('airbus-button');

    // Widget containers
    const greetingWidget = document.querySelector('.widget-container[data-widget-id="greeting"]');
    const clockWidget = document.querySelector('.widget-container[data-widget-id="clock"]');


    // Popups
    const settingsPopup = document.getElementById('settings-popup');
    const closeSettingsPopupButton = document.getElementById('close-settings-popup');
    const appStorePopup = document.getElementById('app-store-popup');
    const closeAppStorePopupButton = document.getElementById('close-app-store-popup');
    const airbusPopup = document.getElementById('airbus-popup');
    const closeAirbusPopupButton = document.getElementById('close-airbus-popup');
    const airbusAppGrid = document.getElementById('airbus-app-grid');

    // Create Link Popup elements
    const createLinkPopup = document.getElementById('create-link-popup');
    const closeCreateLinkPopupButton = document.getElementById('close-create-link-popup');
    const linkButton = document.getElementById('link-button');
    const createLinkFormView = document.getElementById('create-link-form-view');
    const allLinksListView = document.getElementById('all-links-list-view');
    const allLinksList = document.getElementById('all-links-list');
    const allLinksButton = document.getElementById('all-links-button');
    const backToCreateLinkButton = document.getElementById('back-to-create-link-button');
    const createLinkActionButton = document.getElementById('create-link-action-button');
    const saveLinkActionButton = document.getElementById('save-link-action-button');
    const linkNameInput = document.getElementById('link-name');
    const linkDestinationInput = document.getElementById('link-destination');
    const linkIdInput = document.getElementById('link-id');
    const linkFolderSelect = document.getElementById('link-folder');
    const createLinkTitle = document.getElementById('create-link-title');

    // Create Folder Form elements
    const createFolderButton = document.getElementById('create-folder-button');
    const createFolderFormView = document.getElementById('create-folder-form-view');
    const backFromFolderButton = document.getElementById('back-from-folder-button');
    const createFolderActionButton = document.getElementById('create-folder-action-button');
    const folderNameInput = document.getElementById('folder-name');
    const folderIdInput = document.getElementById('folder-id');
    const folderDisplayInDock = document.getElementById('folder-display-in-dock');
    const folderDisplayOnHome = document.getElementById('folder-display-on-home');
    const folderIconUploadArea = document.getElementById('folder-icon-upload-area');
    const folderIconPreview = document.getElementById('folder-icon-preview');
    const folderUploadPlaceholder = document.getElementById('folder-upload-placeholder');
    let selectedFolderIconFile = null;

    // Icon Upload elements
    const iconUploadArea = document.getElementById('icon-upload-area');
    const iconPreview = document.getElementById('icon-preview');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    let selectedIconFile = null; // To store the selected file for upload

    // Folder Popup elements
    const folderPopup = document.getElementById('folder-popup');
    const folderPopupTitle = document.getElementById('folder-popup-title');
    const folderPopupAppGrid = document.getElementById('folder-popup-app-grid');
    const closeFolderPopupButton = document.getElementById('close-folder-popup');

    // Settings Popup Elemente
    const wallpaperThumbnailsContainer = document.getElementById('wallpaper-thumbnails');
    const localIpElement = document.getElementById('local-ip');

    // Widget Toggles
    const toggleGreeting = document.getElementById('toggle-greeting');
    const toggleClock = document.getElementById('toggle-clock');
    const toggleWallpaperBlur = document.getElementById('toggle-wallpaper-blur');
    const toggleCreateLinkButton = document.getElementById('toggle-create-link-button');

    // Layout elements
    const layout2HeroSection = document.getElementById('layout-2-hero-section');
    const layout2GreetingElement = document.getElementById('layout-2-greeting'); // Changed from layout2WelcomeMessage
    const timeDisplayLayout2 = document.getElementById('time-display-layout-2');
    const layout3HeaderSection = document.getElementById('layout-3-header-section');
    const layout3GreetingElement = document.getElementById('layout-3-greeting');
    const layout3GreetingContainer = document.getElementById('layout-3-greeting-container');
    const layoutRadio1 = document.getElementById('layout-radio-1');
    const layoutRadio2 = document.getElementById('layout-radio-2');
    const layoutRadio3 = document.getElementById('layout-radio-3');
    // const appGridSizeSelect = document.getElementById('app-grid-size-select'); // Removed, now custom dropdown

    // Custom App Grid Size Dropdown elements
    const appGridSizeDropdown = document.getElementById('app-grid-size-dropdown');
    const selectedAppGridSize = document.getElementById('selected-app-grid-size');
    const appGridSizeOptions = document.getElementById('app-grid-size-options');

    // 2. Uhrzeit und Datum Anzeige
    const dateDisplayElement = document.getElementById('date-display');

    // Dock Button Logik
    const dockButtons = document.querySelectorAll('.dock-button');

    // Default widget visibility
    const WIDGET_DEFAULTS = {
        greeting: true,
        clock: true
    };

    // Default app grid size
    const APP_GRID_SIZE_DEFAULT = 6;

    // Default wallpaper blur setting
    const WALLPAPER_BLUR_DEFAULT = true;

    // Default create link button setting
    const CREATE_LINK_BUTTON_DEFAULT = false;

    // Create Link Button Management
    function getCreateLinkButtonEnabled() {
        const saved = localStorage.getItem('createLinkButtonEnabled');
        return saved ? JSON.parse(saved) : CREATE_LINK_BUTTON_DEFAULT;
    }

    function setCreateLinkButtonEnabled(enabled) {
        localStorage.setItem('createLinkButtonEnabled', JSON.stringify(enabled));
    }

    function createCreateLinkButton(apps) {
        const highestId = Math.max(...apps.map(app => app.id), 0);
        return {
            id: highestId + 1,
            name: "Create Link",
            icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E",
            link: "#create-link",
            isCreateLinkButton: true
        };
    }

    function addCreateLinkButtonToApps(apps) {
        if (getCreateLinkButtonEnabled()) {
            const createLinkBtn = createCreateLinkButton(apps);
            return [...apps, createLinkBtn];
        }
        return apps;
    }

    // Backend status elements
    const backendStatusBox = document.getElementById('backend-status-box');

    // Layout 3 Search elements
    const layout3SearchContainer = document.getElementById('layout-3-search-container');
    const layout3SearchInput = document.getElementById('layout-3-search-input');
    const layout3ClearSearch = document.getElementById('layout-3-clear-search');

    // Backend connectivity check
    let backendCheckInterval;
    const BACKEND_CHECK_INTERVAL = 30000; // 30 seconds

    // Search functionality
    let allAppsData = []; // Store all apps for search

    // Drag & Drop functionality
    let draggedElement = null;
    let draggedAppData = null;
    let dragPlaceholder = null;
    let isDragging = false;

    // Manual App Order Tracking (solves timing issues)
    let currentAppOrder = [];
    let pendingOrderUpdate = false;
    let orderUpdateDebounceTimer = null;

    // All function definitions
    function saveWidgetState(widgetId, isVisible) {
        localStorage.setItem(`widget-${widgetId}-visible`, isVisible);
    }

    // Manual App Order Tracking Functions
    function initializeAppOrder() {
        const appElements = Array.from(appGrid.querySelectorAll('.app-item[data-app-id]:not(.folder-item)'));
        currentAppOrder = appElements.map(element => ({
            id: parseInt(element.dataset.appId),
            element: element,
            name: element.querySelector('.title-label')?.textContent || 'Unknown'
        }));
        console.log('App order initialized:', currentAppOrder.map(app => ({ id: app.id, name: app.name })));
    }

    function updateAppOrderFromDOM() {
        const appElements = Array.from(appGrid.querySelectorAll('.app-item[data-app-id]:not(.folder-item)'));
        const newOrder = appElements.map(element => ({
            id: parseInt(element.dataset.appId),
            element: element,
            name: element.querySelector('.title-label')?.textContent || 'Unknown'
        }));

        // Check if order actually changed
        const orderChanged = !arraysEqual(
            currentAppOrder.map(app => app.id),
            newOrder.map(app => app.id)
        );

        if (orderChanged) {
            console.log('=== ORDER CHANGE DETECTED ===');
            console.log('Old order:', currentAppOrder.map(app => ({ id: app.id, name: app.name })));
            console.log('New order:', newOrder.map(app => ({ id: app.id, name: app.name })));
            currentAppOrder = newOrder;
            return true;
        }

        return false;
    }

    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    function manuallyReorderApp(draggedAppId, targetPosition) {
        console.log('Manual reorder: moving app', draggedAppId, 'to position', targetPosition);

        // Find the dragged app in current order
        const draggedIndex = currentAppOrder.findIndex(app => app.id === draggedAppId);
        if (draggedIndex === -1) {
            console.error('Dragged app not found in currentAppOrder:', draggedAppId);
            return;
        }

        // Remove from current position
        const [draggedApp] = currentAppOrder.splice(draggedIndex, 1);

        // Insert at new position
        const insertIndex = Math.min(targetPosition, currentAppOrder.length);
        currentAppOrder.splice(insertIndex, 0, draggedApp);

        console.log('Manual order after reorder:', currentAppOrder.map(app => ({ id: app.id, name: app.name })));
    }

    // Drag & Drop Functions
    function enableDragAndDrop() {
        const appItems = document.querySelectorAll('.app-item');
        console.log('Enabling drag and drop for app items:', appItems.length);

        let draggableCount = 0;
        appItems.forEach(appItem => {
            // Only make Haupt folder apps draggable (they have app IDs)
            if (appItem.dataset.appId && !appItem.classList.contains('folder-item')) {
                appItem.draggable = true;
                appItem.classList.add('draggable');
                setupDragListeners(appItem);
                draggableCount++;
                console.log('Made draggable:', appItem.dataset.appId, appItem.querySelector('.title-label')?.textContent);
            }
        });

        console.log('Total draggable apps:', draggableCount);
    }

    function setupDragListeners(element) {
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);
        element.addEventListener('dragover', handleDragOver);
        element.addEventListener('drop', handleDrop);
        element.addEventListener('dragenter', handleDragEnter);
        element.addEventListener('dragleave', handleDragLeave);
    }

    function handleDragStart(e) {
        if (e.target.closest('.app-context-menu-button')) {
            e.preventDefault();
            return;
        }

        draggedElement = e.target;
        draggedAppData = {
            id: parseInt(draggedElement.dataset.appId),
            element: draggedElement
        };
        isDragging = true;

        // Create placeholder element
        dragPlaceholder = draggedElement.cloneNode(true);
        dragPlaceholder.classList.add('drag-placeholder');
        dragPlaceholder.classList.remove('draggable');
        dragPlaceholder.removeAttribute('draggable');

        // Set drag effect and data
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', draggedElement.outerHTML);

        // Visual feedback
        setTimeout(() => {
            if (draggedElement) {
                draggedElement.classList.add('dragging');
                draggedElement.parentNode.insertBefore(dragPlaceholder, draggedElement.nextSibling);
            }
        }, 0);

        console.log('Drag started for app ID:', draggedAppData.id);
    }

    function handleDragEnd(e) {
        e.preventDefault();

        if (draggedElement) {
            draggedElement.classList.remove('dragging');
        }

        if (dragPlaceholder && dragPlaceholder.parentNode) {
            dragPlaceholder.parentNode.removeChild(dragPlaceholder);
        }

        // Clean up drop target indicators
        document.querySelectorAll('.app-item').forEach(item => {
            item.classList.remove('drop-target');
        });
        document.querySelectorAll('.app-grid').forEach(grid => {
            grid.classList.remove('drag-over');
        });

        // Reset variables
        draggedElement = null;
        draggedAppData = null;
        dragPlaceholder = null;
        isDragging = false;

        console.log('Drag ended');
    }

    function handleDragOver(e) {
        if (!isDragging) return;

        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // Clear previous drop targets
        document.querySelectorAll('.app-item').forEach(item => {
            item.classList.remove('drop-target', 'drop-before', 'drop-after');
        });

        const targetElement = e.target.closest('.app-item');
        if (targetElement && targetElement !== draggedElement && !targetElement.classList.contains('folder-item')) {
            // Calculate if we should drop before or after the target
            const rect = targetElement.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Get grid layout info
            const gridRect = appGrid.getBoundingClientRect();
            const gridStyles = window.getComputedStyle(appGrid);
            const columns = parseInt(gridStyles.getPropertyValue('--app-grid-columns')) || 6;

            // Calculate grid position
            const targetIndex = Array.from(appGrid.querySelectorAll('.app-item[data-app-id]:not(.folder-item)')).indexOf(targetElement);
            const targetRow = Math.floor(targetIndex / columns);
            const targetCol = targetIndex % columns;

            // Determine drop position based on mouse position
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            if (mouseX < centerX) {
                targetElement.classList.add('drop-before');
            } else {
                targetElement.classList.add('drop-after');
            }

            targetElement.classList.add('drop-target');
        }
    }

    function handleDragEnter(e) {
        if (!isDragging) return;

        e.preventDefault();
        const targetGrid = e.target.closest('.app-grid');
        if (targetGrid) {
            targetGrid.classList.add('drag-over');
        }
    }

    function handleDragLeave(e) {
        if (!isDragging) return;

        const targetElement = e.target.closest('.app-item');
        if (targetElement) {
            targetElement.classList.remove('drop-target');
        }

        const targetGrid = e.target.closest('.app-grid');
        if (targetGrid && !targetGrid.contains(e.relatedTarget)) {
            targetGrid.classList.remove('drag-over');
        }
    }

    function handleDrop(e) {
        if (!isDragging) return;

        e.preventDefault();
        e.stopPropagation();

        const targetElement = e.target.closest('.app-item');
        const targetGrid = e.target.closest('.app-grid');
        let hasReordered = false;

        // Get all current app items for position calculation
        const allAppItems = Array.from(appGrid.querySelectorAll('.app-item[data-app-id]:not(.folder-item)'));
        const draggedIndex = allAppItems.indexOf(draggedElement);

        console.log('=== DROP OPERATION DEBUG ===');
        console.log('Dragged element:', draggedElement.dataset.appId, draggedElement.querySelector('.title-label')?.textContent);
        console.log('Current position (draggedIndex):', draggedIndex);

        if (targetElement && targetElement !== draggedElement && !targetElement.classList.contains('folder-item')) {
            const targetIndex = allAppItems.indexOf(targetElement);
            console.log('Target element:', targetElement.dataset.appId, targetElement.querySelector('.title-label')?.textContent);
            console.log('Target position (targetIndex):', targetIndex);

            // Determine if we drop before or after the target
            const dropBefore = targetElement.classList.contains('drop-before');
            const dropAfter = targetElement.classList.contains('drop-after');

            let insertPosition = targetIndex;
            if (dropAfter) {
                insertPosition = targetIndex + 1;
            }

            console.log('Drop before:', dropBefore, 'Drop after:', dropAfter);
            console.log('Final insert position:', insertPosition);

            // Only reorder if positions are different
            if (draggedIndex !== insertPosition && draggedIndex !== insertPosition - 1) {
                // Find the element at insert position to insert before
                let insertBeforeElement = null;

                if (insertPosition < allAppItems.length) {
                    insertBeforeElement = allAppItems[insertPosition];
                } else {
                    // Insert at the end
                    insertBeforeElement = null;
                }

                console.log('Insert before element:', insertBeforeElement ? insertBeforeElement.dataset.appId : 'END');

                // Perform the insertion
                if (insertBeforeElement) {
                    appGrid.insertBefore(draggedElement, insertBeforeElement);
                } else {
                    appGrid.appendChild(draggedElement);
                }

                hasReordered = true;
                console.log('DOM reordered successfully');
            } else {
                console.log('No position change needed');
            }

        } else if (targetGrid && targetGrid === appGrid) {
            console.log('Dropped in empty grid space');

            // For empty space drops, calculate the position based on mouse coordinates
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const gridRect = appGrid.getBoundingClientRect();

            // Get grid layout info
            const gridStyles = window.getComputedStyle(appGrid);
            const columns = parseInt(gridStyles.getPropertyValue('--app-grid-columns')) || 6;

            // Calculate grid cell position
            const cellWidth = gridRect.width / columns;
            const cellHeight = 120; // Approximate app item height

            const col = Math.min(Math.floor((mouseX - gridRect.left) / cellWidth), columns - 1);
            const row = Math.floor((mouseY - gridRect.top) / cellHeight);
            const targetPosition = row * columns + col;

            console.log('Grid drop calculation:', { mouseX, mouseY, col, row, targetPosition });

            // Clamp target position to valid range
            const maxPosition = allAppItems.length;
            const finalPosition = Math.min(Math.max(0, targetPosition), maxPosition);

            console.log('Final calculated position:', finalPosition, 'vs current:', draggedIndex);

            if (finalPosition !== draggedIndex && finalPosition !== draggedIndex + 1) {
                let insertBeforeElement = null;

                if (finalPosition < allAppItems.length) {
                    // Find the element at the calculated position (excluding the dragged element)
                    const elementsExcludingDragged = allAppItems.filter(el => el !== draggedElement);
                    insertBeforeElement = elementsExcludingDragged[finalPosition] || null;
                }

                if (insertBeforeElement) {
                    appGrid.insertBefore(draggedElement, insertBeforeElement);
                } else {
                    appGrid.appendChild(draggedElement);
                }

                hasReordered = true;
                console.log('Grid position reordered');
            }
        }

        // Clean up visual indicators
        document.querySelectorAll('.app-item').forEach(item => {
            item.classList.remove('drop-target', 'drop-before', 'drop-after');
        });
        document.querySelectorAll('.app-grid').forEach(grid => {
            grid.classList.remove('drag-over');
        });

        console.log('Has reordered:', hasReordered);
        console.log('=== END DROP OPERATION DEBUG ===');

        // Only update server if something actually changed
        if (hasReordered) {
            // Use requestAnimationFrame to ensure DOM updates are complete
            // Then add additional delay to ensure browser has processed everything
            requestAnimationFrame(() => {
                setTimeout(() => {
                    updateAppOrderWithTiming();
                }, 50); // Small delay after requestAnimationFrame
            });
        }
    }

    // New timing-aware update function with debouncing
    async function updateAppOrderWithTiming() {
        // Debouncing: cancel previous pending update
        if (orderUpdateDebounceTimer) {
            clearTimeout(orderUpdateDebounceTimer);
        }

        // Set debounce timer
        orderUpdateDebounceTimer = setTimeout(async () => {
            await performAppOrderUpdate();
        }, 100); // 100ms debounce
    }

    async function performAppOrderUpdate() {
        if (pendingOrderUpdate) {
            console.log('Order update already in progress, skipping...');
            return;
        }

        pendingOrderUpdate = true;

        try {
            console.log('=== STARTING TIMED APP ORDER UPDATE ===');

            // Multiple validation attempts to ensure we get the correct order
            let validatedOrder = null;
            let attempts = 0;
            const maxAttempts = 3;

            while (attempts < maxAttempts && !validatedOrder) {
                attempts++;
                console.log(`Validation attempt ${attempts}/${maxAttempts}`);

                // Get current DOM order
                const domOrder = Array.from(appGrid.querySelectorAll('.app-item[data-app-id]:not(.folder-item)'))
                    .map((element, index) => ({
                        id: parseInt(element.dataset.appId),
                        order: index + 1,
                        name: element.querySelector('.title-label')?.textContent || 'Unknown'
                    }));

                // Update our manual tracking from DOM
                const orderChanged = updateAppOrderFromDOM();

                console.log('DOM order:', domOrder.map(app => ({ id: app.id, name: app.name })));
                console.log('Manual tracking order:', currentAppOrder.map(app => ({ id: app.id, name: app.name })));

                // Validate that both orders match
                if (arraysEqual(
                    domOrder.map(app => app.id),
                    currentAppOrder.map(app => app.id)
                )) {
                    validatedOrder = domOrder;
                    console.log('✅ Order validation successful on attempt', attempts);
                    break;
                } else {
                    console.log('❌ Order mismatch detected, retrying...');
                    if (attempts < maxAttempts) {
                        await new Promise(resolve => setTimeout(resolve, 50)); // Wait 50ms before retry
                    }
                }
            }

            if (!validatedOrder) {
                console.error('❌ Failed to validate order after', maxAttempts, 'attempts');
                console.log('Using manual tracking as fallback');
                validatedOrder = currentAppOrder.map((app, index) => ({
                    id: app.id,
                    order: index + 1,
                    name: app.name
                }));
            }

            // Validate that we have apps to reorder
            if (validatedOrder.length === 0) {
                console.error('No apps found to reorder!');
                try {
                    if (typeof showNotification === 'function') {
                        showNotification('Keine Apps zum Neuordnen gefunden', 'error');
                    }
                } catch (e) {
                    console.error('Notification error:', e);
                }
                return;
            }

            console.log('Final validated order being sent to server:', validatedOrder);

            // Send to server
            const response = await fetch(`http://${window.location.hostname}:3022/api/apps/reorder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apps: validatedOrder })
            });

            console.log('Server response status:', response.status);

            const responseData = await response.json();
            console.log('Server response data:', responseData);

            if (response.ok) {
                // Try to show notification, fallback to console if not available
                try {
                    if (typeof showNotification === 'function') {
                        showNotification('App-Reihenfolge erfolgreich aktualisiert!', 'success');
                    } else {
                        console.log('Notification: App-Reihenfolge erfolgreich aktualisiert!');
                    }
                } catch (e) {
                    console.log('Notification fallback: App-Reihenfolge erfolgreich aktualisiert!');
                }

                console.log('SUCCESS: New order from server:', responseData.newOrder);

                // Reload apps to reflect the new IDs assigned by the backend
                console.log('Reloading apps in 500ms...');
                setTimeout(() => {
                    console.log('Now reloading apps...');
                    loadApps();
                }, 500); // Small delay to ensure server has written the file
            } else {
                console.error('ERROR: Server responded with error:', responseData);

                // Try to show notification, fallback to console if not available
                try {
                    if (typeof showNotification === 'function') {
                        showNotification(`Fehler beim Aktualisieren der Reihenfolge: ${responseData.message}`, 'error');
                    } else {
                        console.error('Notification: Fehler beim Aktualisieren der Reihenfolge:', responseData.message);
                    }
                } catch (e) {
                    console.error('Notification fallback: Fehler beim Aktualisieren der Reihenfolge:', responseData.message);
                }

                // Reload apps to revert to server state
                loadApps();
            }
        } catch (error) {
            console.error('EXCEPTION: Failed to update app order:', error);
            try {
                if (typeof showNotification === 'function') {
                    showNotification('Fehler beim Aktualisieren der Reihenfolge', 'error');
                } else {
                    console.error('Notification fallback: Fehler beim Aktualisieren der Reihenfolge');
                }
            } catch (e) {
                console.error('Notification fallback: Fehler beim Aktualisieren der Reihenfolge');
            }
            // Reload apps to revert to server state
            loadApps();
        } finally {
            pendingOrderUpdate = false;
            console.log('=== END TIMED APP ORDER UPDATE ===');
        }
    }

    // Legacy function for backward compatibility
    async function updateAppOrder() {
        try {
            // Get current order of apps in the main grid
            const appElements = Array.from(appGrid.querySelectorAll('.app-item[data-app-id]:not(.folder-item)'));
            const newOrder = appElements.map((element, index) => ({
                id: parseInt(element.dataset.appId),
                order: index + 1
            }));

            console.log('=== DRAG & DROP DEBUG ===');
            console.log('Current app elements found:', appElements.length);
            console.log('App elements:', appElements.map(el => ({
                id: el.dataset.appId,
                name: el.querySelector('.title-label')?.textContent || 'Unknown'
            })));
            console.log('New order being sent to server:', newOrder);
            console.log('Server URL:', `http://${window.location.hostname}:3022/api/apps/reorder`);

            // Validate that we have apps to reorder
            if (newOrder.length === 0) {
                console.error('No apps found to reorder!');
                showNotification('Keine Apps zum Neuordnen gefunden', 'error');
                return;
            }

            // Send to server
            const response = await fetch(`http://${window.location.hostname}:3022/api/apps/reorder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apps: newOrder })
            });

            console.log('Server response status:', response.status);

            const responseData = await response.json();
            console.log('Server response data:', responseData);

            if (response.ok) {
                // Try to show notification, fallback to console if not available
                try {
                    if (typeof showNotification === 'function') {
                        showNotification('App-Reihenfolge erfolgreich aktualisiert!', 'success');
                    } else {
                        console.log('Notification: App-Reihenfolge erfolgreich aktualisiert!');
                    }
                } catch (e) {
                    console.log('Notification fallback: App-Reihenfolge erfolgreich aktualisiert!');
                }

                console.log('SUCCESS: New order from server:', responseData.newOrder);

                // Reload apps to reflect the new IDs assigned by the backend
                console.log('Reloading apps in 500ms...');
                setTimeout(() => {
                    console.log('Now reloading apps...');
                    loadApps();
                }, 500); // Small delay to ensure server has written the file
            } else {
                console.error('ERROR: Server responded with error:', responseData);

                // Try to show notification, fallback to console if not available
                try {
                    if (typeof showNotification === 'function') {
                        showNotification(`Fehler beim Aktualisieren der Reihenfolge: ${responseData.message}`, 'error');
                    } else {
                        console.error('Notification: Fehler beim Aktualisieren der Reihenfolge:', responseData.message);
                    }
                } catch (e) {
                    console.error('Notification fallback: Fehler beim Aktualisieren der Reihenfolge:', responseData.message);
                }

                // Reload apps to revert to server state
                loadApps();
            }
        } catch (error) {
            console.error('EXCEPTION: Failed to update app order:', error);
            showNotification('Fehler beim Aktualisieren der Reihenfolge', 'error');
            // Reload apps to revert to server state
            loadApps();
        }
        console.log('=== END DRAG & DROP DEBUG ===');
    }

    function loadWidgetState(widgetId) {
        const storedState = localStorage.getItem(`widget-${widgetId}-visible`);
        if (storedState === null) {
            return WIDGET_DEFAULTS[widgetId];
        }
        return storedState === 'true';
    }

    function applyWidgetVisibility() {
        const widgets = document.querySelectorAll('.widget-container');
        widgets.forEach(widget => {
            const widgetId = widget.dataset.widgetId;
            const isVisible = loadWidgetState(widgetId);
            widget.classList.toggle('hidden-widget', !isVisible);
        });
    }

    // App Grid Size Funktionalität
    function saveAppGridSize(size) {
        localStorage.setItem('appGridSize', size);
    }

    function loadAppGridSize() {
        return parseInt(localStorage.getItem('appGridSize')) || APP_GRID_SIZE_DEFAULT;
    }

    function applyAppGridSize(size) {
        appGrid.style.setProperty('--app-grid-columns', size);
    }

    // Wallpaper Blur Functionality
    function saveWallpaperBlurState(isBlurred) {
        localStorage.setItem('wallpaperBlur', isBlurred);
    }

    function loadWallpaperBlurState() {
        const storedState = localStorage.getItem('wallpaperBlur');
        if (storedState === null) {
            return WALLPAPER_BLUR_DEFAULT;
        }
        return storedState === 'true';
    }

    function applyWallpaperBlur(isBlurred) {
        const blurValue = isBlurred ? '5px' : '0px';
        document.documentElement.style.setProperty('--wallpaper-blur', blurValue);
    }

    // Layout Funktionalität
    const LAYOUT_DEFAULT = 'layout1';

    function saveLayoutState(layout) {
        localStorage.setItem('selectedLayout', layout);
    }

    function loadLayoutState() {
        return localStorage.getItem('selectedLayout') || LAYOUT_DEFAULT;
    }

    function applyLayout(layout) {
        const isLayout2 = layout === 'layout2';
        const isLayout3 = layout === 'layout3';

        // Check widget states for Layout 2
        const greetingWidgetEnabled = loadWidgetState('greeting');
        const clockWidgetEnabled = loadWidgetState('clock');

        if (isLayout2 && (!greetingWidgetEnabled || !clockWidgetEnabled)) {
            // If Layout 2 is selected but widgets are not enabled, revert to Layout 1
            saveLayoutState('layout1');
            layoutRadio1.checked = true;
            applyLayout('layout1'); // Recursively call to apply layout 1
            return;
        }

        // Toggle visibility of Layout 1 elements
        greetingWidget.classList.toggle('hidden-layout', isLayout2 || isLayout3);
        clockWidget.classList.toggle('hidden-layout', isLayout2 || isLayout3);
        document.querySelector('.header').classList.toggle('hidden-layout', isLayout2 || isLayout3); // Hide original header

        // Toggle visibility of Layout 2 elements
        layout2HeroSection.classList.toggle('hidden-layout', !isLayout2);

        // Toggle visibility of Layout 3 elements
        layout3HeaderSection.classList.toggle('hidden-layout', !isLayout3);

        // Handle greeting widget visibility for Layout 3
        if (isLayout3) {
            if (greetingWidgetEnabled) {
                layout3GreetingContainer.style.display = 'block';
            } else {
                layout3GreetingContainer.style.display = 'none';
            }
        }

        // Update body class for layout-specific styling
        document.body.classList.toggle('layout-2-active', isLayout2);
        document.body.classList.toggle('layout-3-active', isLayout3);

        // Update greeting and clock based on layout
        updateGreeting();
        updateClock();
    }

    // Duplicate function removed - defined later in the file

    function closeSettingsPopup() {
        settingsPopup.classList.remove('active');
        selectDockButton(homeButton); // Auswahl auf Home zurücksetzen
    }

    function openAppStorePopup() {
        appStorePopup.classList.add('active');
        closeSettingsPopup(); // Schließt Settings Popup, falls geöffnet
        selectDockButton(appStoreButton); // Wählt den App Store Button aus
        // Initialisiert die App Store Logik, wenn das Popup geöffnet wird
        if (typeof initializeAppStore === 'function') {
            initializeAppStore();
        }
    }

    function closeAppStorePopup() {
        appStorePopup.classList.remove('active');
        selectDockButton(homeButton); // Auswahl auf Home zurücksetzen
    }

    function openAirbusPopup() {
        airbusPopup.classList.add('active');
        closeSettingsPopup(); // Schließt Settings Popup, falls geöffnet
        closeAppStorePopup(); // Schließt App Store Popup, falls geöffnet
        selectDockButton(airbusButton); // Wählt den Airbus Button aus
        loadAirbusApps(); // Lädt die Airbus Apps beim Öffnen des Popups
    }

    function closeAirbusPopup() {
        airbusPopup.classList.remove('active');
        selectDockButton(homeButton); // Auswahl auf Home zurücksetzen
    }

    // Create Link Popup functionality
    let currentAppsData = null; // To cache the apps data
    let editingAppId = null; // To track which app is being edited

    async function openCreateLinkPopup(mode = 'create', appData = null) {
        createLinkPopup.classList.add('active');
        closeAllPopups(createLinkPopup);
        selectDockButton(linkButton);

        // Fetch the latest folder structure
        await fetchAppsData();

        // Populate folder dropdown
        linkFolderSelect.innerHTML = '';
        if (currentAppsData && currentAppsData.folders) {
            currentAppsData.folders.forEach(folder => {
                const option = document.createElement('option');
                option.value = folder.name;
                option.textContent = folder.name;
                linkFolderSelect.appendChild(option);
            });
        }

        if (mode === 'edit' && appData) {
            editingAppId = appData.id;
            createLinkTitle.textContent = 'Links > Edit Link';
            linkNameInput.value = appData.name;
            linkDestinationInput.value = appData.link;
            linkIdInput.value = appData.id;
            linkFolderSelect.value = appData.folderName; // We need to add folderName to appData when rendering
            createLinkActionButton.style.display = 'none';
            saveLinkActionButton.style.display = 'block';

            // Display existing icon if available with better handling
            if (appData.icon && appData.icon !== 'images/icons/template.svg') {
                // Handle both relative and absolute paths
                const iconSrc = appData.icon.startsWith('http') ? appData.icon : appData.icon;
                iconPreview.src = iconSrc;
                iconPreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';

                // Handle broken image links
                iconPreview.onerror = () => {
                    console.warn(`Failed to load existing icon: ${iconSrc}`);
                    iconPreview.style.display = 'none';
                    uploadPlaceholder.style.display = 'block';
                    iconPreview.src = '';
                };
            } else {
                resetIconUpload();
            }
        } else {
            editingAppId = null;
            createLinkTitle.textContent = 'Links > New Link';
            createLinkFormView.querySelector('form')?.reset(); // Reset form if it's a form element
            linkNameInput.value = '';
            linkDestinationInput.value = '';
            linkIdInput.value = '';
            resetIconUpload(); // Use the reset function for consistent cleanup
            createLinkActionButton.style.display = 'block';
            saveLinkActionButton.style.display = 'none';
        }

        showCreateLinkForm();
    }

    function closeCreateLinkPopup() {
        createLinkPopup.classList.remove('active');
        selectDockButton(homeButton);
    }

    function showCreateLinkForm() {
        createLinkTitle.textContent = 'Links > New Link'; // Update title when returning to create form
        allLinksListView.style.display = 'none';
        createFolderFormView.style.display = 'none'; // Hide create folder form
        createLinkFormView.style.display = 'flex';
    }

    async function showAllLinksList() {
        createLinkTitle.textContent = 'Links > All Links'; // Update title
        createLinkFormView.style.display = 'none';
        allLinksListView.style.display = 'flex';
        await renderAllLinksList();
    }
    
    async function fetchAppsData() {
        try {
            // The server.js now runs on port 3022
            const response = await fetch(`http://${window.location.hostname}:3022/api/apps`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            currentAppsData = await response.json();
        } catch (error) {
            console.error('Error fetching apps data:', error);
            allLinksList.innerHTML = '<p>Error loading links.</p>';
        }
    }

    async function renderAllLinksList() {
        await fetchAppsData();
        allLinksList.innerHTML = '';

        if (!currentAppsData || !currentAppsData.folders) {
            allLinksList.innerHTML = '<p>No links found.</p>';
            return;
        }

        currentAppsData.folders.forEach(folder => {
            folder.apps.forEach(app => {
                const listItem = document.createElement('div');
                listItem.classList.add('link-list-item');
                listItem.dataset.appId = app.id;
                listItem.dataset.folderName = folder.name;

                listItem.innerHTML = `
                    <img src="${app.icon || 'images/icons/template.svg'}" alt="${app.name} Icon" class="link-list-item-icon">
                    <span class="link-list-item-name">${app.name}</span>
                    <span class="link-list-item-folder">${folder.name}</span>
                    <span class="link-list-item-url">${app.link}</span>
                    <div class="link-list-item-actions">
                        <button class="link-action-btn edit-btn">Edit</button>
                        <button class="link-action-btn delete-btn">Delete</button>
                    </div>
                `;
                allLinksList.appendChild(listItem);
            });
        });
    }

    // Icon Upload Handling with improved validation
    function handleFileSelect(file) {
        if (!file) {
            resetIconUpload();
            return;
        }

        // Enhanced file type validation
        const allowedTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
        const allowedExtensions = ['.webp', '.jpeg', '.jpg', '.png'];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

        if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
            showNotification('Ungültiger Dateityp. Nur WebP, JPEG, JPG, PNG sind erlaubt.', 'error');
            resetIconUpload();
            return;
        }

        // File size validation (2MB limit for better performance)
        const maxSize = 2 * 1024 * 1024; // 2 MB
        if (file.size > maxSize) {
            showNotification(`Datei ist zu groß. Maximal ${maxSize / (1024 * 1024)}MB erlaubt.`, 'error');
            resetIconUpload();
            return;
        }

        // Basic image dimension check via FileReader
        selectedIconFile = file;
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Validate reasonable image dimensions
                if (img.width < 16 || img.height < 16 || img.width > 2048 || img.height > 2048) {
                    showNotification('Bildgröße sollte zwischen 16x16 und 2048x2048 Pixel liegen.', 'error');
                    resetIconUpload();
                    return;
                }

                // Display preview
                iconPreview.src = e.target.result;
                iconPreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
                console.log(`Icon selected: ${file.name} (${img.width}x${img.height})`);
            };

            img.onerror = () => {
                showNotification('Ungültige Bilddatei.', 'error');
                resetIconUpload();
            };

            img.src = e.target.result;
        };

        reader.onerror = () => {
            showNotification('Fehler beim Lesen der Datei.', 'error');
            resetIconUpload();
        };

        reader.readAsDataURL(file);
    }

    function resetIconUpload() {
        selectedIconFile = null;
        if (iconPreview) iconPreview.style.display = 'none';
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
        if (iconPreview) iconPreview.src = '';
    }

    iconUploadArea.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/webp, image/jpeg, image/jpg, image/png';
        input.onchange = (e) => {
            handleFileSelect(e.target.files[0]);
        };
        input.click();
    });

    iconUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        iconUploadArea.classList.add('drag-over');
    });

    iconUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        iconUploadArea.classList.remove('drag-over');
    });

    iconUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        iconUploadArea.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    // Input sanitization function
    function sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        // Basic XSS prevention - remove script tags and javascript: protocols
        return input
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '')
            .trim();
    }

    function validateLinkData(data) {
        const errors = [];

        // ID validation
        const id = parseInt(data.id);
        if (isNaN(id) || id <= 0 || id > 99999) {
            errors.push('ID muss eine gültige Zahl zwischen 1 und 99999 sein.');
        }

        // Name validation
        if (!data.name || data.name.length < 1 || data.name.length > 100) {
            errors.push('Name muss zwischen 1 und 100 Zeichen lang sein.');
        }

        // URL validation
        if (!data.link) {
            errors.push('Ziel-URL ist erforderlich.');
        } else {
            try {
                const url = new URL(data.link);
                const allowedProtocols = ['http:', 'https:'];
                if (!allowedProtocols.includes(url.protocol)) {
                    errors.push('Nur HTTP- und HTTPS-URLs sind erlaubt.');
                }
            } catch (e) {
                errors.push('Ungültige URL-Format.');
            }
        }

        // Folder validation
        if (!data.folder || data.folder.length < 1) {
            errors.push('Ordner ist erforderlich.');
        }

        return errors;
    }

    async function handleCreateLink() {
        const rawLinkData = {
            id: linkIdInput.value,
            name: linkNameInput.value,
            link: linkDestinationInput.value,
            folder: linkFolderSelect.value,
        };

        // Sanitize inputs
        const linkData = {
            id: rawLinkData.id,
            name: sanitizeInput(rawLinkData.name),
            link: sanitizeInput(rawLinkData.link),
            folder: sanitizeInput(rawLinkData.folder),
        };

        // Validate inputs
        const validationErrors = validateLinkData(linkData);
        if (validationErrors.length > 0) {
            showNotification(validationErrors.join(' '), 'error');
            return;
        }

        const formData = new FormData();
        for (const key in linkData) {
            formData.append(key, linkData[key]);
        }
        if (selectedIconFile) {
            formData.append('iconFile', selectedIconFile);
        }

        try {
            const response = await fetch(`http://${window.location.hostname}:3022/api/links`, {
                method: 'POST',
                body: formData // FormData automatically sets Content-Type
            });

            const responseData = await response.json();

            if (response.ok) {
                showNotification('Link erfolgreich erstellt!', 'success');
                loadApps(); // Refresh the main app grid
                openCreateLinkPopup(); // Reset the form
            } else {
                showNotification(`Fehler: ${responseData.message || 'Unbekannter Fehler'}`, 'error');
                console.error('Create link error:', responseData);
            }
        } catch (error) {
            console.error('Failed to create link:', error);
            showNotification('Fehler beim Erstellen des Links. Details in der Konsole.', 'error');
        }
    }

    async function handleSaveLink() {
        if (!editingAppId) {
            showNotification('Keine Bearbeitung aktiv.', 'error');
            return;
        }

        const rawLinkData = {
            id: linkIdInput.value,
            name: linkNameInput.value,
            link: linkDestinationInput.value,
            folder: linkFolderSelect.value,
        };

        // Sanitize inputs
        const linkData = {
            id: rawLinkData.id,
            name: sanitizeInput(rawLinkData.name),
            link: sanitizeInput(rawLinkData.link),
            folder: sanitizeInput(rawLinkData.folder),
        };

        // Validate inputs
        const validationErrors = validateLinkData(linkData);
        if (validationErrors.length > 0) {
            showNotification(validationErrors.join(' '), 'error');
            return;
        }

        const formData = new FormData();
        for (const key in linkData) {
            formData.append(key, linkData[key]);
        }
        if (selectedIconFile) {
            formData.append('iconFile', selectedIconFile);
        }
        // Also append the original appId to identify the link being updated
        formData.append('originalAppId', editingAppId);


        try {
            const response = await fetch(`http://${window.location.hostname}:3022/api/links/${editingAppId}`, {
                method: 'PUT',
                body: formData // FormData automatically sets Content-Type
            });

            const responseData = await response.json();

            if (response.ok) {
                showNotification('Link erfolgreich aktualisiert!', 'success');
                loadApps(); // Refresh the main app grid
                await showAllLinksList(); // Go back to the list view
            } else {
                showNotification(`Fehler: ${responseData.message || 'Unbekannter Fehler'}`, 'error');
                console.error('Update link error:', responseData);
            }
        } catch (error) {
            console.error('Failed to update link:', error);
            showNotification('Fehler beim Aktualisieren des Links. Details in der Konsole.', 'error');
        }
    }

    function handleDeleteLink(e) {
        if (!e.target.classList.contains('delete-btn')) return;

        const listItem = e.target.closest('.link-list-item');
        const appId = listItem.dataset.appId;
        const deleteBtn = e.target;

        if (deleteBtn.classList.contains('confirm')) {
            // Second click: perform deletion
            fetch(`http://${window.location.hostname}:3022/api/links/${appId}`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        listItem.remove();
                        loadApps(); // Refresh main grid
                        showNotification('Link erfolgreich gelöscht!', 'success');
                    } else {
                        showNotification('Fehler beim Löschen des Links.', 'error');
                    }
                });
        } else {
            // First click: start confirmation
            deleteBtn.classList.add('confirm');
            deleteBtn.textContent = 'Löschen bestätigen';
            setTimeout(() => {
                deleteBtn.classList.remove('confirm');
                deleteBtn.textContent = 'Löschen';
            }, 5000); // 5-second window
        }
    }

    function handleEditLink(e) {
        if (!e.target.classList.contains('edit-btn')) return;

        const listItem = e.target.closest('.link-list-item');
        const appId = parseInt(listItem.dataset.appId);
        const folderName = listItem.dataset.folderName;
        
        const folder = currentAppsData.folders.find(f => f.name === folderName);
        const app = folder.apps.find(a => a.id === appId);

        if (app) {
            openCreateLinkPopup('edit', { ...app, folderName });
        }
    }

    function closeAllPopups(except = null) {
        const popups = [settingsPopup, appStorePopup, airbusPopup, createLinkPopup, folderPopup];
        popups.forEach(popup => {
            if (popup !== except) {
                popup.classList.remove('active');
            }
        });
    }

    // Folder Popup Functionality
    function openFolderPopup(folder) {
        folderPopupTitle.textContent = folder.name;
        renderApps(folder.apps, folderPopupAppGrid); // Render apps into the folder popup grid

        // Set data-item-count for responsive grid optimization
        const itemCount = folder.apps ? folder.apps.length : 0;
        folderPopupAppGrid.setAttribute('data-item-count', itemCount.toString());

        folderPopup.classList.add('active');
        closeAllPopups(folderPopup);
    }

    function closeFolderPopup() {
        folderPopup.classList.remove('active');
        selectDockButton(homeButton);
    }

    // Create Folder Functionality
    function showCreateFolderForm() {
        createLinkTitle.textContent = 'Links > Create Folder';
        createLinkFormView.style.display = 'none';
        allLinksListView.style.display = 'none';
        createFolderFormView.style.display = 'flex';

        // Reset form
        folderNameInput.value = '';
        folderIdInput.value = '';
        folderDisplayInDock.checked = false;
        folderDisplayOnHome.checked = false;
        resetFolderIconUpload();

        // Set next available folder ID
        if (currentAppsData && currentAppsData.folders) {
            const maxId = Math.max(...currentAppsData.folders.map(f => f.id), 0);
            folderIdInput.value = maxId + 1;
        }
    }

    function resetFolderIconUpload() {
        selectedFolderIconFile = null;
        folderIconPreview.style.display = 'none';
        folderUploadPlaceholder.style.display = 'block';
        folderIconPreview.src = '';
    }

    async function handleCreateFolder() {
        const name = folderNameInput.value.trim();
        const id = parseInt(folderIdInput.value);
        const displayInDock = folderDisplayInDock.checked;
        const displayOnHome = folderDisplayOnHome.checked;

        if (!name || !id) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('id', id.toString());
            formData.append('displayInDock', displayInDock.toString());
            formData.append('displayOnHome', displayOnHome.toString());

            if (selectedFolderIconFile) {
                formData.append('iconFile', selectedFolderIconFile);
            }

            const response = await fetch(`http://${window.location.hostname}:3022/api/folders`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                showNotification(result.message, 'success');
                showCreateLinkForm(); // Return to create link form
                loadApps(); // Refresh the app grid to show new folder
            } else {
                showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Error creating folder:', error);
            showNotification('Failed to create folder. Please try again.', 'error');
        }
    }

    // Folder Icon Upload Functionality
    function handleFolderFileSelect(file) {
        if (file && file.type.startsWith('image/')) {
            // Validate file type
            const allowedTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                showNotification('Only WebP, JPEG, JPG, and PNG files are allowed.', 'error');
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('File size must be less than 5MB.', 'error');
                return;
            }

            selectedFolderIconFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                folderIconPreview.src = e.target.result;
                folderIconPreview.style.display = 'block';
                folderUploadPlaceholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            showNotification('Please select a valid image file.', 'error');
        }
    }

    // Folder Icon Upload Event Listeners
    if (folderIconUploadArea) {
        folderIconUploadArea.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/webp, image/jpeg, image/jpg, image/png';
            input.onchange = (e) => {
                handleFolderFileSelect(e.target.files[0]);
            };
            input.click();
        });

        folderIconUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            folderIconUploadArea.classList.add('drag-over');
        });

        folderIconUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            folderIconUploadArea.classList.remove('drag-over');
        });

        folderIconUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            folderIconUploadArea.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) {
                handleFolderFileSelect(e.dataTransfer.files[0]);
            }
        });
    }

    // Wallpaper Funktionalität
    const wallpapers = [
        '/main/images/wallpapers/generated-thumbs/1.jpg',
        '/main/images/wallpapers/generated-thumbs/2.jpg',
        '/main/images/wallpapers/generated-thumbs/3.jpg',
        '/main/images/wallpapers/generated-thumbs/4.jpg',
        '/main/images/wallpapers/generated-thumbs/5.jpg',
        '/main/images/wallpapers/generated-thumbs/6.jpg',
        '/main/images/wallpapers/generated-thumbs/7.jpg',
        '/main/images/wallpapers/generated-thumbs/8.jpg',
        '/main/images/wallpapers/generated-thumbs/9.jpg',
        '/main/images/wallpapers/generated-thumbs/10.jpg',
        '/main/images/wallpapers/generated-thumbs/11.jpg',
        '/main/images/wallpapers/generated-thumbs/12.jpg',
        '/main/images/wallpapers/generated-thumbs/13.jpg',
        '/main/images/wallpapers/generated-thumbs/14.jpg',
        '/main/images/wallpapers/generated-thumbs/15.jpg',
        '/main/images/wallpapers/generated-thumbs/16.jpg',
        '/main/images/wallpapers/generated-thumbs/17.jpg',
        '/main/images/wallpapers/generated-thumbs/18.jpg',
        '/main/images/wallpapers/generated-thumbs/19.jpg',
        '/main/images/wallpapers/generated-thumbs/20.jpg',
        '/main/images/wallpapers/generated-thumbs/21.jpg'
    ];

    function loadWallpapers() {
        wallpaperThumbnailsContainer.innerHTML = '';
        wallpapers.forEach(wallpaperPath => {
            const img = document.createElement('img');
            img.src = wallpaperPath;
            img.classList.add('wallpaper-thumbnail');
            img.alt = 'Wallpaper Thumbnail';
            img.dataset.fullPath = wallpaperPath.replace('generated-thumbs/', ''); // Speichert den Pfad zum großen Bild
            wallpaperThumbnailsContainer.appendChild(img);

            img.addEventListener('click', () => {
                setWallpaper(img.dataset.fullPath);
                updateSelectedWallpaperThumbnail(img);
            });
        });
    }

    function setWallpaper(wallpaperPath) {
        const fullPath = wallpaperPath.startsWith('/main/images/wallpapers/') ? wallpaperPath : `/main/images/wallpapers/${wallpaperPath}`;
        document.querySelector('.background-overlay').style.backgroundImage = `url('${fullPath}')`;
        localStorage.setItem('selectedWallpaper', fullPath);
    }

    function updateSelectedWallpaperThumbnail(selectedImg) {
        document.querySelectorAll('.wallpaper-thumbnail').forEach(img => {
            img.classList.remove('selected');
        });
        if (selectedImg) {
            selectedImg.classList.add('selected');
        }
    }

    // Lokale IP-Adresse anzeigen
    function displayLocalIp() {
        // Dies ist ein Platzhalter, da das direkte Abrufen der lokalen IP im Browser schwierig ist.
        // In einer echten Anwendung müsste dies serverseitig erfolgen oder über WebRTC-APIs,
        // die jedoch Berechtigungen erfordern und komplex sind.
        localIpElement.textContent = window.location.hostname || 'Nicht verfügbar';
    }

    // Funktion zum Kopieren des Textes der externen Domain
    const externalDomainText = document.getElementById('external-domain-text');
    if (externalDomainText) {
        externalDomainText.addEventListener('click', () => {
            const textToCopy = externalDomainText.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                console.log('Text erfolgreich kopiert:', textToCopy);
                // Optional: Visuelles Feedback für den Benutzer
                const originalText = externalDomainText.textContent;
                externalDomainText.textContent = 'Kopiert!';
                setTimeout(() => {
                    externalDomainText.textContent = originalText;
                }, 1500);
            }).catch(err => {
                console.error('Fehler beim Kopieren des Textes:', err);
            });
        });
    }

    function updateGreeting() {
        if (!loadWidgetState('greeting')) {
            return; // Do not update if widget is hidden
        }
        const now = new Date();
        const hour = now.getHours();
        let greeting;

        if (hour >= 5 && hour < 12) {
            greeting = 'Guten Morgen';
        } else if (hour >= 12 && hour < 18) {
            greeting = 'Guten Tag';
        } else if (hour >= 18 && hour < 22) {
            greeting = 'Guten Abend';
        } else {
            greeting = 'Gute Nacht';
        }

        const currentLayout = loadLayoutState();
        if (currentLayout === 'layout1') {
            greetingElement.textContent = `${greeting}, Niklas`;
        } else if (currentLayout === 'layout2') {
            // Layout 2 uses the dynamic greeting
            layout2GreetingElement.textContent = `${greeting}, Niklas`;
        } else if (currentLayout === 'layout3') {
            // Layout 3 uses the dynamic greeting
            layout3GreetingElement.textContent = `${greeting}, Niklas`;
        }
    }

    function openSettingsPopup() {
        settingsPopup.classList.add('active');
        closeAppStorePopup(); // Schließt App Store Popup, falls geöffnet
        selectDockButton(settingsButton); // Wählt den Settings Button aus

        // Set initial state of widget toggles
        toggleGreeting.checked = loadWidgetState('greeting');
        toggleClock.checked = loadWidgetState('clock');
        toggleWallpaperBlur.checked = loadWallpaperBlurState();

        // Set initial state of create link button toggle
        if (toggleCreateLinkButton) {
            toggleCreateLinkButton.checked = getCreateLinkButtonEnabled();
        }

        // Set initial state of layout radio buttons
        const currentLayout = loadLayoutState();
        if (currentLayout === 'layout1') {
            layoutRadio1.checked = true;
        } else if (currentLayout === 'layout2') {
            layoutRadio2.checked = true;
        } else if (currentLayout === 'layout3') {
            layoutRadio3.checked = true;
        }

        // Set initial state of app grid size dropdown
        selectedAppGridSize.textContent = loadAppGridSize();
    }

    function updateClock() {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        const timeString = now.toLocaleTimeString('de-DE', timeOptions);
        const dateString = now.toLocaleDateString('de-DE', dateOptions);

        if (loadLayoutState() === 'layout1') {
            if (!loadWidgetState('clock')) {
                return; // Do not update if widget is hidden
            }
            dateDisplayElement.textContent = dateString;
            timeDisplayElement.textContent = timeString;
        } else {
            // Layout 2 clock update
            timeDisplayLayout2.textContent = timeString;
        }
    }

    function selectDockButton(button) {
        dockButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    }

    // Backend connectivity check functions
    async function checkBackendStatus() {
        try {
            const response = await fetch(`http://${window.location.hostname}:3022/api/apps`, {
                method: 'HEAD', // Just check if server is reachable
                cache: 'no-cache'
            });

            if (response.ok) {
                hideBackendStatusBox();
                return true;
            } else {
                showBackendStatusBox();
                return false;
            }
        } catch (error) {
            console.log('Backend check failed:', error);
            showBackendStatusBox();
            return false;
        }
    }

    function showBackendStatusBox() {
        if (backendStatusBox) {
            backendStatusBox.style.display = 'flex';
        }
    }

    function hideBackendStatusBox() {
        if (backendStatusBox) {
            backendStatusBox.style.display = 'none';
        }
    }

    function startBackendMonitoring() {
        // Initial check
        checkBackendStatus();

        // Set up periodic checks
        backendCheckInterval = setInterval(checkBackendStatus, BACKEND_CHECK_INTERVAL);
    }

    function stopBackendMonitoring() {
        if (backendCheckInterval) {
            clearInterval(backendCheckInterval);
            backendCheckInterval = null;
        }
    }

    // Apps aus der neuen /api/apps Route laden
    async function loadApps() {
        try {
            const response = await fetch(`http://${window.location.hostname}:3022/api/apps`);
            const data = await response.json();
            currentAppsData = data; // Cache the data

            const currentHostname = window.location.hostname;

            // Clear existing content
            appGrid.innerHTML = '';
            const dockContent = document.querySelector('.dock-content');
            
            // Remove dynamically added folders from dock, but keep static buttons
            dockContent.querySelectorAll('.dynamic-folder').forEach(btn => btn.remove());
            // Also remove the static airbus button as it's now dynamic
            const staticAirbusButton = document.getElementById('airbus-button');
            if(staticAirbusButton) staticAirbusButton.remove();


            data.folders.forEach(folder => {
                // Process apps within each folder to replace placeholders
                folder.apps.forEach(app => {
                    if (app.link && app.link.includes('{localip}')) {
                        app.link = app.link.replace('{localip}', currentHostname);
                    }
                });

                // Render folder in dock if displayInDock is true
                if (folder.displayInDock) {
                    const folderButton = document.createElement('button');
                    folderButton.classList.add('dock-button', 'dynamic-folder');
                    folderButton.innerHTML = `
                        <img src="${folder.folderIconPath}" alt="${folder.name}">
                        <div class="selection-indicator"></div>
                    `;
                    folderButton.addEventListener('click', () => {
                        openFolderPopup(folder);
                        selectDockButton(folderButton);
                    });
                    if (linkButton) {
                        dockContent.insertBefore(folderButton, linkButton);
                    } else {
                        dockContent.appendChild(folderButton);
                    }
                }

                // Render folder on home screen if displayOnHome is true
                if (folder.displayOnHome) {
                    const folderItem = document.createElement('div');
                    folderItem.classList.add('app-item', 'folder-item');
                    folderItem.innerHTML = `
                        <div class="app-item-inner">
                            <img src="${folder.folderIconPath}" alt="${folder.name} Icon">
                        </div>
                        <span class="title-label">${folder.name}</span>
                    `;
                    folderItem.addEventListener('click', () => openFolderPopup(folder));
                    appGrid.appendChild(folderItem);
                }
                // Render apps from the "Haupt" folder directly to the grid as well
                    if (folder.name === "Haupt") {
                        const appsWithCreateLink = addCreateLinkButtonToApps(folder.apps);
                        renderApps(appsWithCreateLink, appGrid, false);
                    }
            });

            // Hide backend status box on successful load
            hideBackendStatusBox();

            // Update search data after loading apps
            updateAllAppsData();

            // Enable drag and drop for app items
            setTimeout(() => {
                enableDragAndDrop();
                // Initialize app order tracking after DOM is ready
                initializeAppOrder();
            }, 100); // Small delay to ensure DOM is ready

        } catch (error) {
            console.error('Fehler beim Laden der Apps:', error);
            appGrid.innerHTML = '<p>Fehler beim Laden der Apps.</p>';
            // Show backend status box on error
            showBackendStatusBox();
        }
    }

    async function loadAirbusApps() {
        try {
            const response = await fetch('./config/airbus.json');
            let apps = await response.json();

            const currentHostname = window.location.hostname;

            apps = apps.map(app => {
                if (app.link) {
                    // Replace {localip} if present
                    if (app.link.includes('{localip}')) {
                        app.link = app.link.replace('{localip}', currentHostname);
                    }
                    // Dynamically fetch favicon if a link is provided and loadFav is true
                    if (app.loadFav) {
                        try {
                            const url = new URL(app.link);
                            app.icon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
                        } catch (e) {
                            console.warn(`Invalid URL for app ${app.name}: ${app.link}, using default icon.`);
                            app.icon = app.icon || "images/icons/template.svg"; // Fallback to existing icon or template
                        }
                    } else {
                        app.icon = app.icon || "images/icons/template.svg"; // Ensure existing icon or template if loadFav is false
                    }
                } else {
                    app.icon = app.icon || "images/icons/template.svg"; // Ensure template icon if no link
                }
                return app;
            });

            renderAirbusApps(apps);
        } catch (error) {
            console.error('Fehler beim Laden der Airbus Apps:', error);
            airbusAppGrid.innerHTML = '<p>Fehler beim Laden der Airbus Apps.</p>';
        }
    }

    function renderAirbusApps(appsToRender) {
        airbusAppGrid.innerHTML = '';
        appsToRender.sort((a, b) => a.id - b.id);
        appsToRender.forEach(app => {
            const appItem = document.createElement('a');
            appItem.href = app.link;
            appItem.classList.add('app-item');
            appItem.innerHTML = `
                <div class="app-item-inner">
                    <img src="${app.icon}" alt="${app.name} Icon">
                </div>
                <span class="title-label">${app.name}</span>
            `;
            airbusAppGrid.appendChild(appItem);
        });
    }

    // Layout 3 Search functionality
    function updateAllAppsData() {
        allAppsData = [];
        if (currentAppsData && currentAppsData.folders) {
            currentAppsData.folders.forEach(folder => {
                if (folder.name === "Haupt") {
                    // Add apps from Haupt folder directly
                    allAppsData.push(...folder.apps.map(app => ({...app, folderName: folder.name})));
                }
                if (folder.displayOnHome) {
                    // Add folder as searchable item
                    allAppsData.push({
                        id: `folder-${folder.name}`,
                        name: folder.name,
                        icon: folder.folderIconPath,
                        type: 'folder',
                        folderData: folder
                    });
                }
            });
        }
    }

    function performSearch(searchTerm) {
        if (!searchTerm.trim()) {
            loadApps(); // Reload normal view
            return;
        }

        const searchTermLower = searchTerm.toLowerCase();
        const filteredApps = allAppsData.filter(app =>
            app.name.toLowerCase().includes(searchTermLower) ||
            (app.folderName && app.folderName.toLowerCase().includes(searchTermLower))
        );

        renderSearchResults(filteredApps);
    }

    function renderSearchResults(filteredApps) {
        appGrid.innerHTML = '';

        if (filteredApps.length === 0) {
            appGrid.innerHTML = '<p style="color: var(--secondary-text-color); text-align: center; padding: 40px;">Keine Apps gefunden</p>';
            return;
        }

        filteredApps.forEach(app => {
            if (app.type === 'folder') {
                const folderItem = document.createElement('div');
                folderItem.classList.add('app-item', 'folder-item');
                folderItem.innerHTML = `
                    <div class="app-item-inner">
                        <img src="${app.icon}" alt="${app.name} Icon">
                    </div>
                    <span class="title-label">${app.name}</span>
                `;
                folderItem.addEventListener('click', () => openFolderPopup(app.folderData));
                appGrid.appendChild(folderItem);
            } else {
                const appItem = document.createElement('a');
                if (app.link) {
                    appItem.href = app.link;
                } else {
                    appItem.href = '#';
                    appItem.addEventListener('click', e => e.preventDefault());
                }
                appItem.classList.add('app-item');
                appItem.dataset.appId = app.id; // Add app ID for context menu functionality
                appItem.innerHTML = `
                    <div class="app-item-inner">
                        <img src="${app.icon}" alt="${app.name} Icon">
                    </div>
                    <span class="title-label">${app.name}</span>
                    <div class="app-context-menu-button" data-app-id="${app.id}">
                        <svg class="context-menu-icon" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="1.5"></circle>
                            <circle cx="12" cy="12" r="1.5"></circle>
                            <circle cx="12" cy="19" r="1.5"></circle>
                        </svg>
                        <div class="app-context-dropdown">
                            <div class="context-menu-item" data-action="edit">Edit</div>
                            <div class="context-menu-divider"></div>
                            <div class="context-menu-item" data-action="open">Open</div>
                            <div class="context-menu-item" data-action="open-new">Open in new window</div>
                        </div>
                    </div>
                `;
                appGrid.appendChild(appItem);
            }
        });
    }

    function renderApps(appsToRender, gridElement, shouldClear = true) {
        if (shouldClear) {
            gridElement.innerHTML = '';
        }
        appsToRender.sort((a, b) => a.id - b.id);
        appsToRender.forEach(app => {
            const appItem = document.createElement('a');

            // Special handling for Create Link Button
            if (app.isCreateLinkButton) {
                appItem.href = '#';
                appItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    openCreateLinkPopup();
                });
            } else {
                // Normal app handling
                if (app.link) {
                    appItem.href = app.link;
                } else {
                    appItem.href = '#';
                    appItem.addEventListener('click', e => e.preventDefault());
                }
            }

            appItem.classList.add('app-item');
            appItem.dataset.appId = app.id; // Add app ID for context menu functionality

            // Create different HTML for Create Link Button (no context menu)
            if (app.isCreateLinkButton) {
                appItem.innerHTML = `
                    <div class="app-item-inner">
                        <img src="${app.icon}" alt="${app.name} Icon">
                    </div>
                    <span class="title-label">${app.name}</span>
                `;
            } else {
                appItem.innerHTML = `
                    <div class="app-item-inner">
                        <img src="${app.icon}" alt="${app.name} Icon">
                    </div>
                    <span class="title-label">${app.name}</span>
                    <div class="app-context-menu-button" data-app-id="${app.id}">
                        <svg class="context-menu-icon" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="1.5"></circle>
                            <circle cx="12" cy="12" r="1.5"></circle>
                            <circle cx="12" cy="19" r="1.5"></circle>
                        </svg>
                        <div class="app-context-dropdown">
                            <div class="context-menu-item" data-action="edit">Edit</div>
                            <div class="context-menu-divider"></div>
                            <div class="context-menu-item" data-action="open">Open</div>
                            <div class="context-menu-item" data-action="open-new">Open in new window</div>
                        </div>
                    </div>
                `;
            }
            gridElement.appendChild(appItem);
        });

        // Enable drag and drop if this is the main app grid
        if (gridElement === appGrid) {
            setTimeout(() => {
                enableDragAndDrop();
                // Reinitialize app order tracking after rendering
                initializeAppOrder();
            }, 50);
        }
    }

    // All execution logic and event listeners
    // Initialisierung beim Laden der Seite
    // Theme is now always dark, no need for theme logic

    // Apply initial app grid size and set custom dropdown
    const initialAppGridSize = loadAppGridSize();
    applyAppGridSize(initialAppGridSize);
    selectedAppGridSize.textContent = initialAppGridSize; // Set initial display value

    // Event listener for custom app grid size dropdown
    appGridSizeDropdown.addEventListener('click', (event) => {
        appGridSizeOptions.classList.toggle('show');
        event.stopPropagation(); // Prevent immediate closing
    });

    appGridSizeOptions.addEventListener('click', (event) => {
        if (event.target.classList.contains('dropdown-option')) {
            const newSize = parseInt(event.target.dataset.value);
            selectedAppGridSize.textContent = newSize;
            saveAppGridSize(newSize);
            applyAppGridSize(newSize);
            appGridSizeOptions.classList.remove('show');
        }
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', (event) => {
        if (!appGridSizeDropdown.contains(event.target)) {
            appGridSizeOptions.classList.remove('show');
        }
    });



    const savedWallpaper = localStorage.getItem('selectedWallpaper');
    if (savedWallpaper) {
        setWallpaper(savedWallpaper);
        // Markiere das ausgewählte Thumbnail
        const selectedThumbnail = document.querySelector(`.wallpaper-thumbnail[data-full-path="${savedWallpaper.replace('/main/images/wallpapers/', '')}"]`);
        if (selectedThumbnail) {
            updateSelectedWallpaperThumbnail(selectedThumbnail);
        }

        // Set initial state of custom app grid size dropdown
        selectedAppGridSize.textContent = loadAppGridSize();
    }

    // Event Listener für das Settings Popup
    settingsButton.addEventListener('click', () => {
        selectDockButton(settingsButton);
        openSettingsPopup();
    });

    closeSettingsPopupButton.addEventListener('click', closeSettingsPopup);

    loadWallpapers();
    displayLocalIp();
    applyWidgetVisibility(); // Apply initial widget visibility

    // Apply initial wallpaper blur state
    applyWallpaperBlur(loadWallpaperBlurState());

    // Apply initial layout
    applyLayout(loadLayoutState());

    // Layout radio button event listeners
    layoutRadio1.addEventListener('change', () => {
        saveLayoutState('layout1');
        applyLayout('layout1');
    });

    layoutRadio2.addEventListener('change', () => {
        saveLayoutState('layout2');
        applyLayout('layout2');
    });

    layoutRadio3.addEventListener('change', () => {
        saveLayoutState('layout3');
        applyLayout('layout3');
    });

    // Widget toggle event listeners
    toggleGreeting.addEventListener('change', (event) => {
        saveWidgetState('greeting', event.target.checked);
        applyWidgetVisibility();
        applyLayout(loadLayoutState()); // Re-apply layout to check conditions
    });

    toggleClock.addEventListener('change', (event) => {
        saveWidgetState('clock', event.target.checked);
        applyWidgetVisibility();
        applyLayout(loadLayoutState()); // Re-apply layout to check conditions
    });

    toggleWallpaperBlur.addEventListener('change', (event) => {
        saveWallpaperBlurState(event.target.checked);
        applyWallpaperBlur(event.target.checked);
    });

    // Create Link Button Toggle Event Listener
    if (toggleCreateLinkButton) {
        toggleCreateLinkButton.addEventListener('change', (event) => {
            setCreateLinkButtonEnabled(event.target.checked);
            loadApps(); // Reload apps to show/hide the create link button
        });
    }

    // Layout 3 Search Event Listener
    if (layout3SearchInput) {
        let searchTimeout;

        // Input event for real-time app filtering
        layout3SearchInput.addEventListener('input', (event) => {
            const query = event.target.value;
            const currentLayout = loadLayoutState();

            // Show/hide clear button
            if (layout3ClearSearch) {
                layout3ClearSearch.style.display = query ? 'flex' : 'none';
            }

            if (currentLayout === 'layout3') {
                // Debounce search to avoid too many calls
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 300);
            }
        });

        // Enter key for Google search
        layout3SearchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const query = event.target.value.trim();
                if (query) {
                    // Open Google search in current window
                    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                    window.location.href = googleSearchUrl;
                }
            } else if (event.key === 'Escape') {
                event.target.value = '';
                if (layout3ClearSearch) {
                    layout3ClearSearch.style.display = 'none';
                }
                loadApps(); // Reset to normal view
            }
        });

        // Clear button functionality
        if (layout3ClearSearch) {
            layout3ClearSearch.addEventListener('click', () => {
                layout3SearchInput.value = '';
                layout3ClearSearch.style.display = 'none';
                loadApps(); // Reset to normal view
            });
        }
    }

    // App Context Menu Event Listeners
    document.addEventListener('click', (event) => {
        // Handle context menu button clicks
        if (event.target.closest('.app-context-menu-button')) {
            event.preventDefault();
            event.stopPropagation();

            const button = event.target.closest('.app-context-menu-button');
            const dropdown = button.querySelector('.app-context-dropdown');

            console.log('Context menu button clicked', button, dropdown); // Debug log

            // Close all other dropdowns first
            document.querySelectorAll('.app-context-dropdown').forEach(dd => {
                if (dd !== dropdown) {
                    dd.classList.remove('show');
                }
            });

            // Toggle current dropdown
            const isVisible = dropdown.classList.contains('show');

            if (!isVisible) {
                // Show dropdown
                showContextMenu(button, dropdown);
            } else {
                // Hide dropdown
                hideContextMenu(dropdown);
            }
        }
        // Handle context menu item clicks
        else if (event.target.closest('.context-menu-item')) {
            event.preventDefault();
            event.stopPropagation();

            const menuItem = event.target.closest('.context-menu-item');
            const action = menuItem.dataset.action;
            const dropdown = menuItem.closest('.app-context-dropdown');
            const button = dropdown.parentElement;
            const appItem = button.closest('.app-item');
            const appId = parseInt(appItem.dataset.appId);

            console.log('Context menu action triggered:', action, 'for app ID:', appId); // Debug log

            // Close the dropdown
            hideContextMenu(dropdown);

            // Handle the action
            handleContextMenuAction(action, appId);
        }
        // Close all dropdowns when clicking outside
        else {
            document.querySelectorAll('.app-context-dropdown').forEach(dd => {
                hideContextMenu(dd);
            });
        }
    });

    // Function to show context menu
    function showContextMenu(button, dropdown) {
        // Reset positioning for fixed elements
        dropdown.style.position = 'fixed';
        dropdown.style.zIndex = '3000';

        // Use fixed margin positioning instead of calculated left/top
        dropdown.style.left = '';
        dropdown.style.top = '';
        dropdown.style.marginTop = '150px';
        dropdown.style.marginLeft = '180px';

        // Add show class with slight delay for animation
        setTimeout(() => {
            dropdown.classList.add('show');
        }, 10);

        console.log('Context menu positioned with fixed margins: margin-top: 150px, margin-left: 180px');
    }

    // Function to hide context menu
    function hideContextMenu(dropdown) {
        dropdown.classList.remove('show');
        // No need to set display: none since we use visibility
    }

    // Prevent app item click when interacting with context menu
    document.addEventListener('click', (event) => {
        if (event.target.closest('.app-context-menu-button') || event.target.closest('.app-context-dropdown')) {
            const appItem = event.target.closest('.app-item');
            if (appItem && appItem.tagName === 'A') {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    });

    // Prevent context menu from triggering on right-click
    document.addEventListener('contextmenu', (event) => {
        if (event.target.closest('.app-item')) {
            event.preventDefault();
        }
    });

    function handleContextMenuAction(action, appId) {
        console.log('handleContextMenuAction called with:', action, appId);
        const appElement = document.querySelector(`[data-app-id="${appId}"]`);
        console.log('Found app element:', appElement);
        if (!appElement) {
            console.error('App element not found for ID:', appId);
            return;
        }

        switch (action) {
            case 'edit':
                // Find the app data and open edit popup
                console.log('Edit action triggered for app ID:', appId);
                console.log('Current apps data:', currentAppsData);
                if (currentAppsData && currentAppsData.folders) {
                    for (const folder of currentAppsData.folders) {
                        const app = folder.apps.find(a => a.id === appId);
                        if (app) {
                            console.log('Found app for editing:', app);
                            openCreateLinkPopup('edit', { ...app, folderName: folder.name });
                            return;
                        }
                    }
                }
                console.error('App not found for editing with ID:', appId);
                showNotification('App not found for editing', 'error');
                break;

            case 'open':
                // Simulate regular app click
                console.log('Opening link for app element:', appElement);
                if (appElement && appElement.href && appElement.href !== '#') {
                    console.log('Navigating to:', appElement.href);
                    window.location.href = appElement.href;
                } else {
                    console.log('No valid link found:', appElement.href);
                    showNotification('No link available for this app', 'info');
                }
                break;

            case 'open-new':
                // Open in new window
                console.log('Opening link in new tab for app element:', appElement);
                if (appElement && appElement.href && appElement.href !== '#') {
                    console.log('Opening in new tab:', appElement.href);
                    window.open(appElement.href, '_blank');
                } else {
                    console.log('No valid link found for new tab:', appElement.href);
                    showNotification('No link available for this app', 'info');
                }
                break;
        }
    }

    updateGreeting();
    setInterval(updateGreeting, 60 * 60 * 1000); // Aktualisiert stündlich

    updateClock();
    setInterval(updateClock, 1000); // Aktualisiert jede Sekunde

    homeButton.addEventListener('click', () => {
        selectDockButton(homeButton);
        // Home-Funktionalität (z.B. Scrollen nach oben oder Anzeigen der Hauptseite)
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeSettingsPopup(); // Pop-up schließen, wenn Home gedrückt wird
    });

    appStoreButton.addEventListener('click', () => {
        selectDockButton(appStoreButton);
        openAppStorePopup();
    });

    closeAppStorePopupButton.addEventListener('click', closeAppStorePopup);

    // Remove static airbus button logic as it's now dynamic
    // airbusButton.addEventListener('click', () => {
    //     selectDockButton(airbusButton);
    //     openAirbusPopup();
    // });

    closeAirbusPopupButton.addEventListener('click', closeAirbusPopup);

    // Folder Popup Event Listener
    closeFolderPopupButton.addEventListener('click', closeFolderPopup);

    // Create Link Popup Event Listeners
    linkButton.addEventListener('click', () => openCreateLinkPopup());
    closeCreateLinkPopupButton.addEventListener('click', closeCreateLinkPopup);
    allLinksButton.addEventListener('click', showAllLinksList);
    backToCreateLinkButton.addEventListener('click', () => openCreateLinkPopup());
    createLinkActionButton.addEventListener('click', handleCreateLink);
    saveLinkActionButton.addEventListener('click', handleSaveLink);
    allLinksList.addEventListener('click', handleDeleteLink);
    allLinksList.addEventListener('click', handleEditLink);

    // Create Folder Event Listeners
    if (createFolderButton) {
        createFolderButton.addEventListener('click', showCreateFolderForm);
    }
    if (backFromFolderButton) {
        backFromFolderButton.addEventListener('click', showCreateLinkForm);
    }
    if (createFolderActionButton) {
        createFolderActionButton.addEventListener('click', handleCreateFolder);
    }


    filesButton.addEventListener('click', () => {
        // Ensure all popups are closed before redirecting
        closeAllPopups();
        window.location.href = 'https://8s8982nmzl16zprp.myfritz.net:3670';
        closeAllPopups();
    });

    // Standardmäßig den Home-Button auswählen
    selectDockButton(homeButton);

    loadApps();

    // Start backend monitoring
    startBackendMonitoring();

    // Service Worker registrieren
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/js/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
});
