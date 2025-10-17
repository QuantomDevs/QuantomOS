// Common JavaScript functionalities and header/footer injection
let flattenedDocs = [];

// Authentication helper functions
// Use window.location for API base URL to work with any port/host
const API_BASE_URL = `${window.location.origin}/api`;

const checkAuthToken = () => {
    const authCode = localStorage.getItem('quantomAuthCode');
    return authCode !== null && authCode !== undefined && authCode.trim() !== '';
};

const handleLogout = async () => {
    // Clear local storage
    localStorage.removeItem('quantomAuthCode');
    localStorage.removeItem('quantomUserData');

    // Refresh page to update UI
    window.location.reload();
};

const getAuthHeaders = () => {
    const authCode = localStorage.getItem('quantomAuthCode');
    return authCode ? { 'Authorization': `Bearer ${authCode}` } : {};
};

const isUserLoggedIn = () => {
    return checkAuthToken();
};

// Server Status Functions
let serverStatus = 'checking';
let statusCheckInterval = null;

const checkServerStatus = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            timeout: 5000
        });

        if (response.ok) {
            setServerStatus('online');
        } else {
            setServerStatus('offline');
        }
    } catch (error) {
        setServerStatus('offline');
        console.error('Server status check failed:', error);
    }
};

const setServerStatus = (status) => {
    serverStatus = status;
    updateServerStatusDisplay();

    // If server is offline and we're not on main or docs, redirect
    if (status === 'offline' && !window.location.pathname.includes('/main') && !window.location.pathname.includes('/docs')) {
        setTimeout(() => {
            window.location.href = '/main';
        }, 3000);
    }
};

const updateServerStatusDisplay = () => {
    // Update any server status indicators on the page
    const statusIndicators = document.querySelectorAll('.server-status-indicator');
    statusIndicators.forEach(indicator => {
        indicator.className = `server-status-indicator ${serverStatus}`;
        const statusText = indicator.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = getServerStatusText();
        }
    });

    // Show warning on index page if server is offline
    if (window.location.pathname.includes('/main') && serverStatus === 'offline') {
        showServerOfflineWarning();
    } else {
        hideServerOfflineWarning();
    }
};

const getServerStatusText = () => {
    switch (serverStatus) {
        case 'online':
            return 'Server Online';
        case 'offline':
            return 'Server Offline';
        case 'checking':
        default:
            return 'Checking Server...';
    }
};

const showServerOfflineWarning = () => {
    let warningBox = document.getElementById('server-offline-warning');

    if (!warningBox) {
        warningBox = document.createElement('div');
        warningBox.id = 'server-offline-warning';
        warningBox.className = 'server-offline-warning';
        warningBox.innerHTML = `
            <div class="warning-content">
                <i class="fas fa-exclamation-triangle"></i>
                <div class="warning-text">
                    <strong>Server-Probleme</strong>
                    <span>Der Backend-Server ist derzeit nicht erreichbar. Einige Funktionen sind möglicherweise nicht verfügbar.</span>
                </div>
                <button onclick="hideServerOfflineWarning()" class="warning-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Insert after header
        const main = document.querySelector('main');
        if (main) {
            main.insertBefore(warningBox, main.firstChild);
        }
    }

    warningBox.style.display = 'block';
};

const hideServerOfflineWarning = () => {
    const warningBox = document.getElementById('server-offline-warning');
    if (warningBox) {
        warningBox.style.display = 'none';
    }
};

const initServerStatusChecking = () => {
    // Initial check
    checkServerStatus();

    // Set up periodic checks every 30 seconds
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
    }

    statusCheckInterval = setInterval(checkServerStatus, 30000);
};

const stopServerStatusChecking = () => {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        statusCheckInterval = null;
    }
};

// Theme Toggle Function
const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update icon in header
    const themeBtn = document.querySelector('#theme-toggle-btn');
    if (themeBtn) {
        if (newTheme === 'light') {
            // Sun icon for light mode
            themeBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 1.11133V2.00022 M12.8711 3.12891L12.2427 3.75735 M14.8889 8H14 M12.8711 12.8711L12.2427 12.2427 M8 14.8889V14 M3.12891 12.8711L3.75735 12.2427 M1.11133 8H2.00022 M3.12891 3.12891L3.75735 3.75735 M8.00043 11.7782C10.0868 11.7782 11.7782 10.0868 11.7782 8.00043C11.7782 5.91402 10.0868 4.22266 8.00043 4.22266C5.91402 4.22266 4.22266 5.91402 4.22266 8.00043C4.22266 10.0868 5.91402 11.7782 8.00043 11.7782Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        } else {
            // Moon icon for dark mode
            themeBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.5556 10.4445C8.48717 10.4445 6.00005 7.95743 6.00005 4.88899C6.00005 3.68721 6.38494 2.57877 7.03294 1.66943C4.04272 2.22766 1.77783 4.84721 1.77783 8.0001C1.77783 11.5592 4.66317 14.4445 8.22228 14.4445C11.2196 14.4445 13.7316 12.3948 14.4525 9.62321C13.6081 10.1414 12.6187 10.4445 11.5556 10.4445Z" fill="currentColor"/>
                </svg>
            `;
        }
    }

    // Update icon in mobile menu
    const mobileThemeIcon = document.querySelector('#mobile-theme-toggle-btn i');
    if (mobileThemeIcon) {
        if (newTheme === 'light') {
            mobileThemeIcon.className = 'fas fa-sun';
        } else {
            mobileThemeIcon.className = 'fas fa-moon';
        }
    }
};

// Initialize theme on page load
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Update icon in header based on current theme
    const themeBtn = document.querySelector('#theme-toggle-btn');
    if (themeBtn) {
        if (savedTheme === 'light') {
            // Sun icon for light mode
            themeBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 1.11133V2.00022 M12.8711 3.12891L12.2427 3.75735 M14.8889 8H14 M12.8711 12.8711L12.2427 12.2427 M8 14.8889V14 M3.12891 12.8711L3.75735 12.2427 M1.11133 8H2.00022 M3.12891 3.12891L3.75735 3.75735 M8.00043 11.7782C10.0868 11.7782 11.7782 10.0868 11.7782 8.00043C11.7782 5.91402 10.0868 4.22266 8.00043 4.22266C5.91402 4.22266 4.22266 5.91402 4.22266 8.00043C4.22266 10.0868 5.91402 11.7782 8.00043 11.7782Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        } else {
            // Moon icon for dark mode
            themeBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.5556 10.4445C8.48717 10.4445 6.00005 7.95743 6.00005 4.88899C6.00005 3.68721 6.38494 2.57877 7.03294 1.66943C4.04272 2.22766 1.77783 4.84721 1.77783 8.0001C1.77783 11.5592 4.66317 14.4445 8.22228 14.4445C11.2196 14.4445 13.7316 12.3948 14.4525 9.62321C13.6081 10.1414 12.6187 10.4445 11.5556 10.4445Z" fill="currentColor"/>
                </svg>
            `;
        }
    }

    // Update icon in mobile menu based on current theme
    const mobileThemeIcon = document.querySelector('#mobile-theme-toggle-btn i');
    if (mobileThemeIcon) {
        if (savedTheme === 'light') {
            mobileThemeIcon.className = 'fas fa-sun';
        } else {
            mobileThemeIcon.className = 'fas fa-moon';
        }
    }
};

// Header and Footer Injection System
const injectHeader = async () => {
    // Check if we're on the docs page to show search bar and adjust logo text
    const isDocsPage = window.location.pathname.includes('/docs');

    // Load product buttons if on docs page
    let productButtonsHTML = '';
    if (isDocsPage) {
        try {
            const response = await fetch('/docs/config/docs-config.json');
            const config = await response.json();
            const products = config.products.filter(p => p.showInDocs);

            // Get current product from URL
            const pathParts = window.location.pathname.split('/').filter(p => p);
            const currentProduct = pathParts.length > 1 ? pathParts[1] : null;

            productButtonsHTML = `
                ${products.map(product => `
                            <button class="product-nav-btn ${currentProduct === product.id ? 'active' : ''}"
                                    data-product-id="${product.id}"
                                    onclick="navigateToProduct('${product.id}')">
                                ${product.name}
                            </button>
                        `).join('')}
            `;
        } catch (error) {
            console.error('Failed to load products for header:', error);
        }
    }

    let mainButtonsHTML = '';
    if (!isDocsPage) {
        mainButtonsHTML = `
                <a href="/main" class="nav-link">Home</a>
                <a href="/downloads" class="nav-link">Download</a>
                <a href="/docs" class="nav-link">Documentation</a>
                <a href="https://discord.gg/f46gXT69Fd" class="nav-link" target="_blank">Discord</a>
        `;
    }

    // Search button is now in the sidebar on docs pages, so we don't show it in the header
    const searchBarHTML = '';

    // Change logo text based on page
    const logoText = isDocsPage ? 'Quantom Docs' : 'Quantom';

    // Add docs menu button for mobile (only on docs page)
    const docsMenuButtonHTML = isDocsPage ? `
        <button id="docsMenuToggle" class="docs-menu-toggle-btn" title="Open navigation menu">
            <i class="fas fa-bars"></i>
        </button>
    ` : '';

    // Add normal mobile menu button (NOT on docs page)
    const mobileMenuButtonHTML = !isDocsPage ? `
        <button id="mobileMenuToggle" class="mobile-menu-toggle-btn"><i class="fas fa-bars"></i></button>
    ` : '';

    const headerHTML = `
        <div class="header-content">
            ${docsMenuButtonHTML}
            <a href="/main" class="logo-container">
                <img src="/shared/images/favicon/favicon.png" alt="Quantom Logo" class="logo-img">
                <span class="logo-text"><strong>${logoText}</strong></span>
            </a>
            ${mobileMenuButtonHTML}
            ${searchBarHTML}
            <nav id="mainNav">
                ${mainButtonsHTML}
                ${productButtonsHTML}
                <div class="icon-links">
                    <a href="/settings" class="special-button">Sign Up</a>
                    <button id="theme-toggle-btn" class="icon-link theme-toggle" title="Toggle dark/light mode">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.5556 10.4445C8.48717 10.4445 6.00005 7.95743 6.00005 4.88899C6.00005 3.68721 6.38494 2.57877 7.03294 1.66943C4.04272 2.22766 1.77783 4.84721 1.77783 8.0001C1.77783 11.5592 4.66317 14.4445 8.22228 14.4445C11.2196 14.4445 13.7316 12.3948 14.4525 9.62321C13.6081 10.1414 12.6187 10.4445 11.5556 10.4445Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
            </nav>
        </div>
    `;

    const header = document.querySelector('header');
    if (header) {
        header.innerHTML = headerHTML;
        setActiveNavLink();

        // Add theme toggle event listener
        const themeToggle = document.getElementById('theme-toggle-btn');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        // Dispatch event to notify docs.js that header is ready
        if (isDocsPage) {
            window.dispatchEvent(new Event('headerInjected'));
        }
    }
};

// Navigate to product function
window.navigateToProduct = (productId) => {
    window.location.href = `/docs/${productId}`;
};

const injectFooter = () => {
    const footerHTML = `
        <div class="footer-content">
            <div class="footer-bottom">
                <div class="footer-left">
                    <img src="/shared/images/favicon/favicon.png" alt="Quantom Logo" class="footer-logo-img">
                    <span class="footer-brand">Quantom Systems</span>
                </div>
                <div class="footer-center">
                    <a href="/legal" class="footer-legal-link">Legal</a>
                </div>
                <div class="footer-right">
                    <a href="https://instagram.com/Snenjih" class="social-icon" title="Instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="https://x.com/Snenjih" class="social-icon" title="Twitter/X">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="https://github.com/Snenjih" class="social-icon" title="GitHub">
                        <i class="fab fa-github"></i>
                    </a>
                    <a href="https://discord.gg/5gdthYHqSv" class="social-icon" title="Discord">
                        <i class="fab fa-discord"></i>
                    </a>
                </div>
            </div>
        </div>
    `;

    const footer = document.querySelector('footer');
    if (footer) {
        footer.innerHTML = footerHTML;
    }
};

const injectMobileMenu = () => {
    const mobileMenuHTML = `
        <button id="mobileMenuCloseBtn" class="close-btn"><i class="fas fa-times"></i></button>
        <nav>
            <a href="/main" class="nav-link">Home</a>
            <a href="/downloads" class="nav-link">Download</a>
            <a href="/docs" class="nav-link">Docs</a>
            <div class="language-dropdown">
                <a href="#" class="icon-link"><i class="fas fa-language"></i> English <i class="fas fa-chevron-down"></i></a>
                <div class="dropdown-content">
                    <a href="#">English</a>
                    <a href="#">Deutsch</a>
                </div>
            </div>
        </nav>
        <div class="icon-links">
            <button id="mobile-theme-toggle-btn" class="icon-link theme-toggle" title="Toggle dark/light mode">
                <i class="fas fa-moon"></i>
                <span>Theme</span>
            </button>
        </div>
    `;

    const mobileMenu = document.getElementById('mobile-overlay-menu');
    if (mobileMenu) {
        mobileMenu.innerHTML = mobileMenuHTML;

        // Add mobile theme toggle event listener
        const mobileThemeToggle = document.getElementById('mobile-theme-toggle-btn');
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', toggleTheme);
        }
    }
};

const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'main';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'main')) {
            link.classList.add('active');
        }
    });
};

// NEUE FUNKTION 1: Flacht die Konfiguration ab
// Diese Funktion wandelt die verschachtelte Struktur aus docsConfig in eine einzelne, flache Liste um.
// Das ist entscheidend, um eine einfache, lineare "vorher/nächstes" Logik zu ermöglichen.
const flattenDocsConfig = (config) => {
    return config.flatMap(category => category.items);
};

// NEUE FUNKTION 2: Generiert und rendert die Navigations-Buttons
// Dies ist die Kernfunktion. Sie nimmt das aktuell angezeigte Item entgegen.
const renderPageNavigation = (currentItem, allItems) => {
    const navigationWrapper = document.getElementById('page-navigation-wrapper');
    if (!navigationWrapper) return; // Sicherheits-Check

    navigationWrapper.innerHTML = ''; // Vorherige Buttons löschen

    // Finde den Index des aktuellen Items in der flachen Liste
    const currentIndex = allItems.findIndex(item => 
        (item.id && item.id === currentItem.id) || (item.file && item.file === currentItem.file)
    );

    if (currentIndex === -1) return; // Item nicht gefunden, keine Buttons anzeigen

    // Ermittle das vorherige und nächste Item
    const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
    const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

    // Erstelle den "Previous Page" Button, wenn prevItem existiert
    if (prevItem) {
        const prevLink = document.createElement('a');
        prevLink.href = '#'; // Verhindert Neuladen der Seite
        prevLink.className = 'nav-page-link prev';
        prevLink.innerHTML = `
            <span class="nav-label">Previous page</span>
            <span class="nav-title">${prevItem.name}</span>
        `;
        prevLink.addEventListener('click', (e) => {
            e.preventDefault();
            loadContent(prevItem); // Ruft die existierende Ladefunktion auf
        });
        navigationWrapper.appendChild(prevLink);
    }

    // Erstelle den "Next Page" Button, wenn nextItem existiert
    if (nextItem) {
        const nextLink = document.createElement('a');
        nextLink.href = '#';
        nextLink.className = 'nav-page-link next';
        nextLink.innerHTML = `
            <span class="nav-label">Next page</span>
            <span class="nav-title">${nextItem.name}</span>
        `;
        nextLink.addEventListener('click', (e) => {
            e.preventDefault();
            loadContent(nextItem); // Ruft die existierende Ladefunktion auf
        });
        navigationWrapper.appendChild(nextLink);
    }
};

const staticContentArea = document.getElementById('static-getting-started');
const dynamicContentArea = document.getElementById('dynamic-content-area');
const sidebarLeft = document.querySelector('.sidebar-left');
const sidebarRight = document.querySelector('.sidebar-right');
const header = document.querySelector('header');
const headerHeight = header ? header.offsetHeight : 0;

let docsConfig = [];

// Function to load content based on config item
const loadContent = async (item) => {
    // Update active class in left sidebar
    document.querySelectorAll('.sidebar-left ul li a').forEach(link => {
        link.classList.remove('active');
    });
    const currentLink = sidebarLeft.querySelector(`[data-file="${item.file}"]`) || sidebarLeft.querySelector(`[data-id="${item.id}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }

    if (item.type === 'html' && item.id) {
        staticContentArea.style.display = 'block';
        dynamicContentArea.style.display = 'none';
        updateRightSidebar(staticContentArea);
    } else if (item.type === 'md' && item.file) {
        staticContentArea.style.display = 'none';
        dynamicContentArea.style.display = 'block';
        try {
            const response = await fetch(`docs/${item.file}`);
            if (!response.ok) {
                throw new Error(`Could not load Markdown file: ${item.file}`);
            }
            const markdownText = await response.text();
            dynamicContentArea.innerHTML = marked.parse(markdownText);
            updateRightSidebar(dynamicContentArea);
            addCopyButtonListeners(); // Re-add listeners for new content
        } catch (error) {
            console.error(error);
            dynamicContentArea.innerHTML = `<p style="color: red;">Error loading content: ${error.message}</p>`;
            sidebarRight.innerHTML = '<h4>On this page</h4><ul></ul>'; // Clear right sidebar on error
        }
    }

    // FÜGE DIESEN AUFRUF AM ENDE HINZU
    // Dadurch werden die Navigations-Buttons jedes Mal neu generiert, wenn eine Seite geladen wird.
    renderPageNavigation(item, flattenedDocs);
};

// Function to update the right sidebar (On this page)
const updateRightSidebar = (contentElement) => {
    sidebarRight.innerHTML = '<h4>On this page</h4><ul></ul>';
    const ul = sidebarRight.querySelector('ul');
    const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headings.forEach(heading => {
        const id = heading.id || heading.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        heading.id = id; // Ensure heading has an ID
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = heading.textContent;
        li.appendChild(a);
        ul.appendChild(li);

        // Add click listener to update active state immediately
        a.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default jump
            const targetId = a.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Trigger scroll-spy update after smooth scroll completes
                setTimeout(() => {
                    onScroll(); // Re-evaluate scroll position and update active state
                }, 300); // Adjust delay if needed to match scroll animation
            }
        });
    });

    // Re-apply scroll-spy logic for new headings
    setupScrollSpy(contentElement);
};

// Scroll-Spy functionality
let activeHeadingId = null;
const setupScrollSpy = (contentElement) => {
    const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const navLinks = sidebarRight.querySelectorAll('ul li a');

    const onScroll = () => {
        let closestHeading = null;
        let minDistance = Infinity;

        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const headingCenter = rect.top + rect.height / 2;
            const distance = Math.abs(headingCenter - viewportCenter);

            // Consider headings that are at least partially in view
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                if (distance < minDistance) {
                    minDistance = distance;
                    closestHeading = heading;
                }
            }
        });

        if (closestHeading && closestHeading.id && closestHeading.id !== activeHeadingId) {
            activeHeadingId = closestHeading.id;
            navLinks.forEach(link => {
                link.parentElement.classList.remove('active');
                if (link.getAttribute('href') === `#${activeHeadingId}`) {
                    link.parentElement.classList.add('active');
                }
            });
        } else if (!closestHeading && window.scrollY < (headings[0] ? headings[0].offsetTop - headerHeight - 20 : 0)) {
            // If scrolled above the first heading, deactivate all
            activeHeadingId = null;
            navLinks.forEach(link => link.parentElement.classList.remove('active'));
        }
    };

    window.removeEventListener('scroll', onScroll); // Remove old listener
    window.addEventListener('scroll', onScroll); // Add new listener
    onScroll(); // Initial check
};

// Add copy button listeners
const addCopyButtonListeners = () => {
    document.querySelectorAll('.copy-code-btn').forEach(button => {
        button.addEventListener('click', () => {
            const code = decodeURIComponent(button.dataset.code);
            navigator.clipboard.writeText(code).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });
};


document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme first
    initTheme();

    // Inject common header, footer, and mobile menu on all pages
    injectHeader();
    injectFooter();
    injectMobileMenu();

    // Initialize theme again after header injection to update icon
    setTimeout(initTheme, 50);

    // Initialize server status checking
    initServerStatusChecking();

    // Initialize Docs Page
    const initDocsPage = async () => {
        try {
            const response = await fetch('config/docs-config.json');
            if (!response.ok) {
                throw new Error('Could not load docs-config.json');
            }
            docsConfig = await response.json();
            flattenedDocs = flattenDocsConfig(docsConfig); // HIER DIE NEUE ZEILE EINFÜGEN

            // Generate left sidebar navigation
            sidebarLeft.innerHTML = `
                <div class="logo-section">
                    <img src="/shared/images/favicon/favicon.png" alt="Quantom Logo">
                    <span>Quantom</span>
                </div>
            `;
            docsConfig.forEach(category => {
                const navBlock = document.createElement('div');
                navBlock.classList.add('nav-block');
                navBlock.innerHTML = `<h4>${category.category}</h4><ul></ul>`;
                const ul = navBlock.querySelector('ul');

                category.items.forEach(item => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = '#'; // Prevent default navigation
                    a.textContent = item.name;
                    a.dataset.type = item.type;
                    if (item.type === 'html') {
                        a.dataset.id = item.id;
                    } else if (item.type === 'md') {
                        a.dataset.file = item.file;
                    }

                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        loadContent(item);
                    });
                    li.appendChild(a);
                    ul.appendChild(li);
                });
                sidebarLeft.appendChild(navBlock);
                sidebarLeft.appendChild(document.createElement('hr'));
            });
            // Remove the last hr
            if (sidebarLeft.lastElementChild.tagName === 'HR') {
                sidebarLeft.removeChild(sidebarLeft.lastElementChild);
            }


            // Load default content
            const defaultItem = docsConfig.flatMap(cat => cat.items).find(item => item.default);
            if (defaultItem) {
                loadContent(defaultItem);
            } else {
                // Fallback: show static content if no default is set
                staticContentArea.style.display = 'block';
                dynamicContentArea.style.display = 'none';
                updateRightSidebar(staticContentArea);
            }

        } catch (error) {
            console.error('Error initializing docs page:', error);
            sidebarLeft.innerHTML = `<p style="color: red;">Error loading navigation: ${error.message}</p>`;
        }
    };

    // Only initialize docs page if on /docs
    // NOTE: initDocsPage is now handled by docs-products.js for the new product-based architecture
    // The old initDocsPage() function below is deprecated and should not be called
    /*
    if (window.location.pathname.includes('/docs')) {
        initDocsPage();
    }
    */

    // Service Worker Registration
    registerServiceWorker();
});

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================

/**
 * Registers the service worker for offline functionality and caching
 */
function registerServiceWorker() {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('[SW] Service Worker registered successfully:', registration.scope);

                    // Check for updates periodically
                    setInterval(() => {
                        registration.update();
                    }, 60000 * 60); // Check every hour

                    // Listen for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;

                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker available
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('[SW] Service Worker registration failed:', error);
                });
        });

        // Listen for controller change (new service worker activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[SW] New Service Worker activated');
        });
    } else {
        console.log('[SW] Service Workers are not supported in this browser');
    }
}

/**
 * Shows notification when a new version is available
 */
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-notification-content">
            <i class="fas fa-info-circle"></i>
            <span>A new version is available!</span>
            <button onclick="reloadPage()" class="update-btn">Reload</button>
            <button onclick="dismissUpdateNotification()" class="dismiss-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    document.body.appendChild(notification);

    // Auto-show with animation
    setTimeout(() => notification.classList.add('show'), 100);
}

/**
 * Reloads the page to activate the new service worker
 */
function reloadPage() {
    window.location.reload();
}

/**
 * Dismisses the update notification
 */
function dismissUpdateNotification() {
    const notification = document.querySelector('.update-notification');
    if (notification) {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }
}

/**
 * Copy text to clipboard
 * Cross-platform compatible (iOS, Android, Mac, Windows, Linux)
 * @param {string} text - Text to copy
 */
async function copyToClipboard(text) {
  // Method 1: Try modern Clipboard API (works on HTTPS and modern browsers)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Copied to clipboard!', 'success');
      return;
    } catch (err) {
      console.log('Clipboard API failed, trying fallback method');
    }
  }

  // Method 2: Fallback for older browsers and non-HTTPS
  try {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;

    // Make it invisible but still selectable
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    textarea.style.opacity = '0';
    textarea.setAttribute('readonly', '');

    document.body.appendChild(textarea);

    // Handle iOS devices specifically
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textarea);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textarea.setSelectionRange(0, 999999);
    } else {
      textarea.select();
    }

    // Execute copy command
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (successful) {
      showNotification('Copied to clipboard!', 'success');
    } else {
      throw new Error('Copy command failed');
    }
  } catch (err) {
    console.error('Failed to copy:', err);

    // Method 3: Final fallback - show text in a prompt
    showCopyFallbackModal(text);
  }
}


// ============================================
// OFFLINE INDICATOR
// ============================================

/**
 * Shows offline indicator when connection is lost
 */
function showOfflineIndicator() {
    // Check if indicator already exists
    let indicator = document.querySelector('.offline-indicator');

    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'offline-indicator';
        indicator.innerHTML = `
            <i class="fas fa-wifi-slash"></i>
            <span>You are offline. Viewing cached version.</span>
        `;
        document.body.appendChild(indicator);
    }

    // Show with animation
    setTimeout(() => indicator.classList.add('show'), 100);
}

/**
 * Hides offline indicator when connection is restored
 */
function hideOfflineIndicator() {
    const indicator = document.querySelector('.offline-indicator');
    if (indicator) {
        indicator.classList.remove('show');
        setTimeout(() => indicator.remove(), 300);
    }
}

/**
 * Initialize offline/online detection
 */
function initOfflineDetection() {
    // Show indicator if already offline
    if (!navigator.onLine) {
        showOfflineIndicator();
    }

    // Listen for offline event
    window.addEventListener('offline', () => {
        console.log('[Offline] Connection lost');
        showOfflineIndicator();
    });

    // Listen for online event
    window.addEventListener('online', () => {
        console.log('[Online] Connection restored');
        hideOfflineIndicator();

        // Optional: Show brief notification that we're back online
        const onlineNotification = document.createElement('div');
        onlineNotification.className = 'lazy-loading-indicator';
        onlineNotification.innerHTML = `
            <div class="loading-content">
                <i class="fas fa-check-circle" style="color: var(--text-success);"></i>
                <span>Back online!</span>
            </div>
        `;
        document.body.appendChild(onlineNotification);

        setTimeout(() => {
            onlineNotification.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => onlineNotification.remove(), 500);
        }, 2000);
    });
}

// Initialize offline detection on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOfflineDetection);
} else {
    initOfflineDetection();
}
