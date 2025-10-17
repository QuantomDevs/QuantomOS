const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer'); // Import multer

const app = express();
const PORT = 3022;

// Security middleware
app.use((req, res, next) => {
    // Content Security Policy
    res.setHeader('Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https: http:; " +
        "connect-src 'self' http://localhost:* http://127.0.0.1:*;"
    );

    // Other security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    next();
});

// CORS and body parsing middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ?
        ['https://your-domain.com'] :
        true, // Allow all origins in development
    credentials: true
}));
app.use(express.json({ limit: '10mb' })); // For parsing application/json with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // For parsing application/x-www-form-urlencoded

// Serve static files from new directory structure
app.use('/shared', express.static(path.join(__dirname, 'src/shared')));
app.use('/main', express.static(path.join(__dirname, 'src/main')));
app.use('/admin', express.static(path.join(__dirname, 'src/admin')));

const appsFilePath = path.join(__dirname, 'src', 'shared', 'config', 'apps.json');
const iconsDirPath = path.join(__dirname, 'src', 'shared', 'images', 'icons'); // Path to store icons

// Ensure the icons directory exists
fs.mkdir(iconsDirPath, { recursive: true }).catch(console.error);

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, iconsDirPath);
    },
    filename: (req, file, cb) => {
        // Use the link name from the request body for the filename
        // Sanitize the name to be filesystem-friendly
        const linkName = req.body.name || 'untitled-link';
        const sanitizedLinkName = linkName.replace(/[^a-z0-9-]/gi, '_').toLowerCase();
        const fileExtension = path.extname(file.originalname).toLowerCase();
        // Add timestamp to avoid naming conflicts
        const timestamp = Date.now();
        cb(null, `${sanitizedLinkName}_${timestamp}${fileExtension}`);
    }
});

// Magic number validation for better security
const validateFileType = (buffer) => {
    const signatures = {
        'image/jpeg': [0xFF, 0xD8, 0xFF],
        'image/png': [0x89, 0x50, 0x4E, 0x47],
        'image/webp': [0x52, 0x49, 0x46, 0x46]
    };

    for (const [mimeType, signature] of Object.entries(signatures)) {
        if (signature.every((byte, index) => buffer[index] === byte)) {
            return mimeType;
        }
    }
    return null;
};

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only WebP, JPEG, JPG, PNG are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// Helper function to read data
const readAppsData = async () => {
    const fileContent = await fs.readFile(appsFilePath, 'utf8');
    return JSON.parse(fileContent);
};

// Helper function to write data
const writeAppsData = async (data) => {
    await fs.writeFile(appsFilePath, JSON.stringify(data, null, 2), 'utf8');
};

/**
 * @route GET /api/apps
 * @description Fetches the entire apps.json structure.
 */
app.get('/api/apps', async (req, res) => {
    try {
        const appsData = await readAppsData();
        res.status(200).json(appsData);
    } catch (error) {
        console.error('Error fetching apps:', error);
        res.status(500).json({ message: 'Failed to fetch apps.' });
    }
});

/**
 * @route POST /api/links
 * @description Adds a new link/app to the specified folder in apps.json.
 */
app.post('/api/links', upload.single('iconFile'), async (req, res) => {
    const { id, name, link, folder: folderName } = req.body; // Removed description

    if (!name || !link || !folderName || !id) {
        // If file upload failed, req.file will not be set, but an error might be in req.fileValidationError
        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError });
        }
        return res.status(400).json({ message: 'ID, Name, Link, and Folder are required.' });
    }

    try {
        const appsData = await readAppsData();
        const folder = appsData.folders.find(f => f.name === folderName);

        if (!folder) {
            return res.status(400).json({ message: `Folder '${folderName}' does not exist.` });
        }

        // For new apps in Haupt folder, find the next available ID sequentially
        let finalId = parseInt(id);
        if (folderName === 'Haupt') {
            // Get all existing IDs in Haupt folder, sorted
            const existingIds = folder.apps.map(app => app.id).sort((a, b) => a - b);

            // Find the next sequential ID
            finalId = 1;
            for (const existingId of existingIds) {
                if (finalId === existingId) {
                    finalId++;
                } else {
                    break;
                }
            }

            console.log(`Assigning new sequential ID ${finalId} for app in Haupt folder`);
        } else {
            // For other folders, check if ID exists
            const idExists = appsData.folders.some(f => f.apps.some(app => app.id === parseInt(id)));
            if (idExists) {
                // If an icon was uploaded, delete it since the link creation failed
                if (req.file) {
                    await fs.unlink(req.file.path).catch(err => console.error('Error deleting uploaded file:', err));
                }
                return res.status(409).json({ message: `An app with ID ${id} already exists.` });
            }
        }

        let iconPath = 'src/shared/images/icons/template.svg'; // Default icon
        if (req.file) {
            try {
                // Additional file validation using magic numbers
                const fileBuffer = await fs.readFile(req.file.path);
                const detectedType = validateFileType(fileBuffer);
                if (!detectedType) {
                    await fs.unlink(req.file.path).catch(console.error);
                    return res.status(400).json({ message: 'Invalid file format detected.' });
                }
                iconPath = `src/shared/images/icons/${req.file.filename}`;
                console.log(`New icon uploaded: ${iconPath}`);
            } catch (error) {
                console.error('Error processing uploaded icon:', error);
                if (req.file) {
                    await fs.unlink(req.file.path).catch(console.error);
                }
                return res.status(500).json({ message: 'Error processing uploaded icon.' });
            }
        }

        const newApp = {
            id: finalId,
            name,
            icon: iconPath,
            link
        };

        folder.apps.push(newApp);
        // Sort apps by ID within the folder
        folder.apps.sort((a, b) => a.id - b.id);

        await writeAppsData(appsData);

        res.status(201).json({ message: 'Link created successfully!', app: newApp });

    } catch (error) {
        console.error('Error creating link:', error);
        // If an icon was uploaded and an error occurred during link creation, delete the file
        if (req.file) {
            await fs.unlink(req.file.path).catch(err => console.error('Error deleting uploaded file:', err));
        }
        res.status(500).json({
            message: 'Failed to create link.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route PUT /api/links/:appId
 * @description Updates an existing link/app.
 */
app.put('/api/links/:appId', upload.single('iconFile'), async (req, res) => {
    const { appId } = req.params;
    const { id: newId, name, link, folder: folderName, originalAppId } = req.body; // Removed description, added originalAppId

    if (!name || !link || !folderName || !newId) {
        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError });
        }
        return res.status(400).json({ message: 'ID, Name, Link, and Folder are required.' });
    }

    try {
        const appsData = await readAppsData();
        let originalApp = null;
        let originalFolder = null;

        // Find the app and its folder using originalAppId if provided, otherwise appId
        const searchId = parseInt(originalAppId || appId);
        for (const folder of appsData.folders) {
            const appIndex = folder.apps.findIndex(app => app.id === searchId);
            if (appIndex !== -1) {
                originalApp = folder.apps[appIndex];
                originalFolder = folder;
                break;
            }
        }

        if (!originalApp) {
            if (req.file) {
                await fs.unlink(req.file.path).catch(err => console.error('Error deleting uploaded file:', err));
            }
            return res.status(404).json({ message: `App with ID ${searchId} not found.` });
        }

        // Check if newId already exists and is different from originalAppId
        if (parseInt(newId) !== searchId) {
            const idExists = appsData.folders.some(f => f.apps.some(app => app.id === parseInt(newId)));
            if (idExists) {
                if (req.file) {
                    await fs.unlink(req.file.path).catch(err => console.error('Error deleting uploaded file:', err));
                }
                return res.status(409).json({ message: `An app with ID ${newId} already exists.` });
            }
        }

        // Handle icon file with improved validation
        let newIconPath = originalApp.icon;
        const isCustomIcon = originalApp.icon.startsWith('src/shared/images/icons/');
        const oldIconFilename = isCustomIcon ? path.basename(originalApp.icon) : null;
        const oldIconFullPath = oldIconFilename ? path.join(iconsDirPath, oldIconFilename) : null;

        if (req.file) {
            try {
                // Additional file validation using magic numbers
                const fileBuffer = await fs.readFile(req.file.path);
                const detectedType = validateFileType(fileBuffer);
                if (!detectedType) {
                    await fs.unlink(req.file.path).catch(console.error);
                    return res.status(400).json({ message: 'Invalid file format detected.' });
                }

                // Delete old custom icon if exists
                if (oldIconFullPath && isCustomIcon) {
                    try {
                        await fs.access(oldIconFullPath);
                        await fs.unlink(oldIconFullPath);
                        console.log(`Deleted old icon: ${oldIconFullPath}`);
                    } catch (err) {
                        console.warn(`Could not delete old icon: ${err.message}`);
                    }
                }

                newIconPath = `src/shared/images/icons/${req.file.filename}`;
                console.log(`New icon saved: ${newIconPath}`);
            } catch (error) {
                console.error('Error processing icon file:', error);
                if (req.file) {
                    await fs.unlink(req.file.path).catch(console.error);
                }
                return res.status(500).json({ message: 'Error processing icon file.' });
            }
        } else if (name !== originalApp.name && oldIconFilename && isCustomIcon) {
            // No new icon, but name changed: rename existing icon file
            try {
                const oldExtension = path.extname(oldIconFilename);
                const sanitizedNewName = name.replace(/[^a-z0-9-]/gi, '_').toLowerCase();
                const timestamp = Date.now();
                const newIconFilename = `${sanitizedNewName}_${timestamp}${oldExtension}`;
                const newIconFullPath = path.join(iconsDirPath, newIconFilename);

                if (oldIconFullPath) {
                    await fs.access(oldIconFullPath); // Check if file exists
                    await fs.rename(oldIconFullPath, newIconFullPath);
                    newIconPath = `src/shared/images/icons/${newIconFilename}`;
                    console.log(`Icon renamed from ${oldIconFilename} to ${newIconFilename}`);
                }
            } catch (error) {
                console.warn(`Could not rename icon file: ${error.message}`);
                // Keep the original icon path if renaming fails
            }
        }

        // Remove the app from its original folder
        originalFolder.apps = originalFolder.apps.filter(app => app.id !== searchId);

        // Find the new target folder
        const targetFolder = appsData.folders.find(f => f.name === folderName);
        if (!targetFolder) {
            // If the folder doesn't exist, we should put the app back and return an error.
            originalFolder.apps.push(originalApp);
            if (req.file) { // If a new file was uploaded, delete it
                await fs.unlink(req.file.path).catch(err => console.error('Error deleting uploaded file:', err));
            }
            return res.status(400).json({ message: `Target folder '${folderName}' does not exist.` });
        }

        // Update app details
        const updatedApp = {
            ...originalApp,
            id: parseInt(newId),
            name,
            link,
            icon: newIconPath, // Use the new icon path
        };

        // Add the updated app to the target folder and sort
        targetFolder.apps.push(updatedApp);
        targetFolder.apps.sort((a, b) => a.id - b.id);

        await writeAppsData(appsData);

        res.status(200).json({ message: 'Link updated successfully!', app: updatedApp });

    } catch (error) {
        console.error('Error updating link:', error);
        if (req.file) { // If a new file was uploaded and an error occurred, delete it
            await fs.unlink(req.file.path).catch(err => console.error('Error deleting uploaded file:', err));
        }
        res.status(500).json({
            message: 'Failed to update link.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


/**
 * @route DELETE /api/links/:appId
 * @description Deletes a link/app by its ID.
 */
app.delete('/api/links/:appId', async (req, res) => {
    const { appId } = req.params;

    try {
        const appsData = await readAppsData();
        let appFound = false;
        let iconToDeletePath = null;

        // Find and remove the app from the correct folder
        for (const folder of appsData.folders) {
            const appIndex = folder.apps.findIndex(app => app.id === parseInt(appId));
            if (appIndex !== -1) {
                const app = folder.apps[appIndex];
                if (app.icon && app.icon.startsWith('src/shared/images/icons/')) {
                    iconToDeletePath = path.join(__dirname, app.icon);
                }
                folder.apps.splice(appIndex, 1); // Remove the app
                appFound = true;
                break;
            }
        }

        if (!appFound) {
            return res.status(404).json({ message: `App with ID ${appId} not found.` });
        }

        await writeAppsData(appsData);

        // Delete the associated icon file if it exists and is a custom upload
        if (iconToDeletePath) {
            await fs.unlink(iconToDeletePath).catch(err => console.error('Error deleting icon file:', err));
        }

        res.status(200).json({ message: 'Link deleted successfully!' });

    } catch (error) {
        console.error('Error deleting link:', error);
        res.status(500).json({ message: 'Failed to delete link.' });
    }
});

/**
 * @route POST /api/folders
 * @description Creates a new folder in apps.json.
 */
app.post('/api/folders', upload.single('iconFile'), async (req, res) => {
    const { id, name, displayInDock, displayOnHome } = req.body;

    if (!name || !id) {
        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError });
        }
        return res.status(400).json({ message: 'ID and Name are required.' });
    }

    try {
        const appsData = await readAppsData();

        // Check if folder ID already exists
        const idExists = appsData.folders.some(folder => folder.id === parseInt(id));
        if (idExists) {
            // If an icon was uploaded, delete it since the folder creation failed
            if (req.file) {
                await fs.unlink(req.file.path).catch(err => console.error('Error deleting uploaded file:', err));
            }
            return res.status(409).json({ message: `A folder with ID ${id} already exists.` });
        }

        let iconPath = 'src/shared/images/icons/template.svg'; // Default icon
        if (req.file) {
            try {
                // Additional file validation using magic numbers
                const fileBuffer = await fs.readFile(req.file.path);
                const detectedType = validateFileType(fileBuffer);
                if (!detectedType) {
                    await fs.unlink(req.file.path).catch(console.error);
                    return res.status(400).json({ message: 'Invalid file format detected.' });
                }
                iconPath = `src/shared/images/icons/${req.file.filename}`;
                console.log(`New folder icon uploaded: ${iconPath}`);
            } catch (error) {
                console.error('Error processing uploaded folder icon:', error);
                if (req.file) {
                    await fs.unlink(req.file.path).catch(console.error);
                }
                return res.status(500).json({ message: 'Error processing uploaded folder icon.' });
            }
        }

        const newFolder = {
            id: parseInt(id),
            name,
            folderIconPath: iconPath,
            displayInDock: displayInDock === 'true',
            displayOnHome: displayOnHome === 'true',
            apps: []
        };

        appsData.folders.push(newFolder);
        // Sort folders by ID
        appsData.folders.sort((a, b) => a.id - b.id);

        await writeAppsData(appsData);

        res.status(201).json({ message: 'Folder created successfully!', folder: newFolder });

    } catch (error) {
        console.error('Error creating folder:', error);
        // If an icon was uploaded and an error occurred during folder creation, delete the file
        if (req.file) {
            await fs.unlink(req.file.path).catch(err => console.error('Error deleting uploaded file:', err));
        }
        res.status(500).json({
            message: 'Failed to create folder.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route POST /api/apps/reorder
 * @description Reorders apps within the Haupt folder and reassigns sequential IDs based on new positions.
 */
app.post('/api/apps/reorder', async (req, res) => {
    console.log('=== REORDER API CALLED ===');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);

    const { apps } = req.body;

    if (!apps || !Array.isArray(apps)) {
        console.log('ERROR: Apps array is missing or invalid');
        return res.status(400).json({ message: 'Apps array is required.' });
    }

    console.log('Apps to reorder:', apps);

    try {
        const appsData = await readAppsData();
        const hauptFolder = appsData.folders.find(f => f.name === 'Haupt');

        if (!hauptFolder) {
            return res.status(404).json({ message: 'Haupt folder not found.' });
        }

        // Create a map of the desired order
        const orderMap = new Map();
        apps.forEach(appOrder => {
            if (appOrder.id && typeof appOrder.order === 'number') {
                orderMap.set(parseInt(appOrder.id), appOrder.order);
            }
        });

        // Validate that all provided app IDs exist in the Haupt folder
        const hauptAppIds = new Set(hauptFolder.apps.map(app => app.id));
        const providedIds = new Set(apps.map(app => parseInt(app.id)));

        for (const id of providedIds) {
            if (!hauptAppIds.has(id)) {
                return res.status(400).json({
                    message: `App with ID ${id} not found in Haupt folder.`
                });
            }
        }

        // Sort apps based on the new order
        hauptFolder.apps.sort((a, b) => {
            const orderA = orderMap.get(a.id) ?? 999999; // Apps not in reorder list go to end
            const orderB = orderMap.get(b.id) ?? 999999;
            return orderA - orderB;
        });

        // Reassign sequential IDs starting from 1 based on the new order
        console.log('Before ID reassignment:', hauptFolder.apps.map(app => ({ id: app.id, name: app.name })));
        hauptFolder.apps.forEach((app, index) => {
            app.id = index + 1;
        });
        console.log('After ID reassignment:', hauptFolder.apps.map(app => ({ id: app.id, name: app.name })));

        await writeAppsData(appsData);
        console.log('Apps data written to file successfully');

        const result = {
            message: 'Apps reordered successfully with new IDs!',
            newOrder: hauptFolder.apps.map(app => ({ id: app.id, name: app.name }))
        };
        console.log('Sending response:', result);

        res.status(200).json(result);

    } catch (error) {
        console.error('Error reordering apps:', error);
        res.status(500).json({
            message: 'Failed to reorder apps.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route GET /api/nginx/configs
 * @description Fetches all nginx server configurations from /etc/nginx/sites-enabled
 */
app.get('/api/nginx/configs', async (req, res) => {
    const nginxPath = '/etc/nginx/sites-enabled';
    const apache2Path = '/etc/apache2/sites-enabled';

    try {
        const configs = [];

        // Try to read nginx configs
        try {
            const nginxFiles = await fs.readdir(nginxPath);
            for (const file of nginxFiles) {
                if (file === 'default' || file.startsWith('.')) continue;

                const filePath = path.join(nginxPath, file);
                const content = await fs.readFile(filePath, 'utf8');

                // Parse basic nginx config
                const serverName = content.match(/server_name\s+([^;]+);/)?.[1]?.trim() || file;
                const port = content.match(/listen\s+(\d+)/)?.[1] || '80';
                const root = content.match(/root\s+([^;]+);/)?.[1]?.trim() || '';
                const proxyPass = content.match(/proxy_pass\s+([^;]+);/)?.[1]?.trim() || '';
                const ssl = content.includes('ssl') || content.includes('443');

                configs.push({
                    id: configs.length + 1,
                    name: file,
                    url: serverName,
                    description: `Nginx Server Config`,
                    type: 'nginx',
                    port: parseInt(port),
                    root: root,
                    proxy: proxyPass,
                    ssl: ssl,
                    filePath: filePath,
                    clicks: Math.floor(Math.random() * 100) // Placeholder
                });
            }
        } catch (nginxError) {
            console.log('Nginx configs not accessible:', nginxError.message);
        }

        // Try to read apache2 configs
        try {
            const apache2Files = await fs.readdir(apache2Path);
            for (const file of apache2Files) {
                if (file === '000-default.conf' || file.startsWith('.')) continue;

                const filePath = path.join(apache2Path, file);
                const content = await fs.readFile(filePath, 'utf8');

                // Parse basic apache2 config
                const serverName = content.match(/ServerName\s+([^\s]+)/)?.[1]?.trim() || file;
                const port = content.match(/VirtualHost\s+\*:(\d+)/)?.[1] || '80';
                const documentRoot = content.match(/DocumentRoot\s+([^\s]+)/)?.[1]?.trim() || '';
                const proxyPass = content.match(/ProxyPass\s+\/\s+([^\s]+)/)?.[1]?.trim() || '';
                const ssl = content.includes('SSLEngine') || content.includes(':443');

                configs.push({
                    id: configs.length + 1,
                    name: file,
                    url: serverName,
                    description: `Apache2 Server Config`,
                    type: 'apache2',
                    port: parseInt(port),
                    root: documentRoot,
                    proxy: proxyPass,
                    ssl: ssl,
                    filePath: filePath,
                    clicks: Math.floor(Math.random() * 100) // Placeholder
                });
            }
        } catch (apache2Error) {
            console.log('Apache2 configs not accessible:', apache2Error.message);
        }

        res.status(200).json({ configs });

    } catch (error) {
        console.error('Error reading server configs:', error);
        res.status(500).json({
            message: 'Failed to read server configurations.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route POST /api/nginx/configs
 * @description Creates a new nginx server configuration
 */
app.post('/api/nginx/configs', async (req, res) => {
    const { name, type, port, root, domain, proxy, ssl } = req.body;

    if (!name || !type) {
        return res.status(400).json({ message: 'Name and type are required.' });
    }

    try {
        const basePath = type === 'nginx' ? '/etc/nginx/sites-enabled' : '/etc/apache2/sites-enabled';
        const filePath = path.join(basePath, name);

        let configContent = '';

        if (type === 'nginx') {
            configContent = `server {
    listen ${port || 80};
    server_name ${domain || name};

    ${root ? `root ${root};` : ''}
    ${proxy ? `
    location / {
        proxy_pass ${proxy};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }` : ''}

    ${ssl ? `
    listen 443 ssl;
    ssl_certificate /etc/ssl/certs/${name}.crt;
    ssl_certificate_key /etc/ssl/private/${name}.key;` : ''}
}`;
        } else {
            configContent = `<VirtualHost *:${port || 80}>
    ServerName ${domain || name}
    ${root ? `DocumentRoot ${root}` : ''}

    ${proxy ? `ProxyPass / ${proxy}
    ProxyPassReverse / ${proxy}` : ''}

    ${ssl ? `SSLEngine on
    SSLCertificateFile /etc/ssl/certs/${name}.crt
    SSLCertificateKeyFile /etc/ssl/private/${name}.key` : ''}
</VirtualHost>`;
        }

        await fs.writeFile(filePath, configContent, 'utf8');

        res.status(201).json({
            message: 'Server configuration created successfully!',
            filePath: filePath
        });

    } catch (error) {
        console.error('Error creating server config:', error);
        res.status(500).json({
            message: 'Failed to create server configuration. Check permissions.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route DELETE /api/nginx/configs/:filename
 * @description Deletes a server configuration file
 */
app.delete('/api/nginx/configs/:filename', async (req, res) => {
    const { filename } = req.params;
    const { type } = req.query;

    try {
        const basePath = type === 'nginx' ? '/etc/nginx/sites-enabled' : '/etc/apache2/sites-enabled';
        const filePath = path.join(basePath, filename);

        await fs.unlink(filePath);

        res.status(200).json({ message: 'Server configuration deleted successfully!' });

    } catch (error) {
        console.error('Error deleting server config:', error);
        res.status(500).json({
            message: 'Failed to delete server configuration.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Serve static icon files (kept for backward compatibility)
app.use('/images/icons', express.static(iconsDirPath));

// ==================== Clean URL Routes ====================

/**
 * Root redirect to main page
 * @route GET /
 * @description Redirects root path to /main for clean URLs
 */
app.get('/', (req, res) => {
    res.redirect('/main');
});

/**
 * Main section routes (without .html extension)
 * @route GET /main
 * @description Serves the main landing page
 */
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'main', 'index.html'));
});

/**
 * Admin panel route
 * @route GET /admin
 * @description Serves the admin dashboard
 */
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'admin', 'admin.html'));
});

/**
 * 404 handler for all unmatched routes
 * @description Serves custom 404 page for invalid routes
 */
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Page Not Found</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                .container {
                    text-align: center;
                    padding: 2rem;
                }
                h1 { font-size: 8rem; margin-bottom: 1rem; }
                h2 { font-size: 2rem; margin-bottom: 1rem; }
                p { font-size: 1.2rem; margin-bottom: 2rem; }
                a {
                    display: inline-block;
                    background: white;
                    color: #667eea;
                    padding: 1rem 2rem;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: 600;
                    transition: transform 0.2s;
                }
                a:hover { transform: scale(1.05); }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/main">Go to Homepage</a>
            </div>
        </body>
        </html>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
