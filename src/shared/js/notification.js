// js/notification.js
function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notification-container');
    if (!container) {
        console.error('Notification container not found!');
        return;
    }

    const notification = document.createElement('div');
    notification.classList.add('notification', type);

    let icon = '';
    if (type === 'success') {
        icon = '✔'; // Checkmark
    } else if (type === 'error') {
        icon = '✖'; // Cross
    } else if (type === 'info') {
        icon = 'ℹ'; // Info icon
    }

    notification.innerHTML = `
        ${icon ? `<span class="notification-icon">${icon}</span>` : ''}
        <span class="notification-message">${message}</span>
    `;

    container.appendChild(notification);

    // Automatically remove after duration
    setTimeout(() => {
        notification.classList.add('fade-out');
        notification.addEventListener('animationend', () => {
            notification.remove();
        }, { once: true });
    }, duration);
}

// Make showNotification globally accessible
window.showNotification = showNotification;
