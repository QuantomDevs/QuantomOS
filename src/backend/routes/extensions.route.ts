import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';

import { extensionExists, getExtensionsMetadata, loadExtension } from '../services/extensionLoader.service';
import { githubService } from '../services/github.service';
import { validateExtension } from '../utils/extensionValidator';
import { CustomError } from '../types/custom-error';

const router = Router();

/**
 * GET /api/extensions
 * Returns metadata for all available extensions
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const metadata = await getExtensionsMetadata();
        res.json(metadata);
    } catch (error) {
        console.error('Error fetching extensions:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Failed to load extensions'
        });
    }
});

/**
 * GET /api/extensions/:id
 * Returns the complete extension data for a specific extension
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || typeof id !== 'string') {
            throw new CustomError('Invalid extension ID', StatusCodes.BAD_REQUEST);
        }

        const extension = await loadExtension(id);

        if (!extension) {
            throw new CustomError('Extension not found', StatusCodes.NOT_FOUND);
        }

        res.json(extension);
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            console.error('Error fetching extension:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Failed to load extension'
            });
        }
    }
});

/**
 * Configure multer for file uploads
 */
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'src', 'extensions', 'files');

        // Ensure the directory exists
        try {
            await fs.mkdir(uploadDir, { recursive: true });
        } catch (error) {
            console.error('Error creating upload directory:', error);
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate a unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, basename + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow images and some common file types
        const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'application/json',
            'text/plain'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images, JSON, and text files are allowed.'));
        }
    }
});

/**
 * POST /api/extensions/upload
 * Handles file uploads for extension settings
 */
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            throw new CustomError('No file uploaded', StatusCodes.BAD_REQUEST);
        }

        // Return the relative path that can be used in the extension
        const relativePath = `/api/extensions/files/${req.file.filename}`;

        res.json({
            success: true,
            filename: req.file.filename,
            path: relativePath,
            size: req.file.size
        });
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            console.error('Error uploading file:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: error instanceof Error ? error.message : 'Failed to upload file'
            });
        }
    }
});

/**
 * GET /api/extensions/files/:filename
 * Serves uploaded files
 */
router.get('/files/:filename', async (req: Request, res: Response) => {
    try {
        const { filename } = req.params;

        // Prevent directory traversal attacks
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            throw new CustomError('Invalid filename', StatusCodes.BAD_REQUEST);
        }

        const filePath = path.join(process.cwd(), 'src', 'extensions', 'files', filename);

        // Check if file exists
        try {
            await fs.access(filePath);
        } catch {
            throw new CustomError('File not found', StatusCodes.NOT_FOUND);
        }

        res.sendFile(filePath);
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            console.error('Error serving file:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Failed to serve file'
            });
        }
    }
});

/**
 * GET /api/extensions/marketplace
 * Returns list of all extensions available in the marketplace
 */
router.get('/marketplace/list', async (req: Request, res: Response) => {
    try {
        // Get marketplace extensions
        const marketplaceExtensions = await githubService.listExtensions();

        // Get locally installed extensions
        const localMetadata = await getExtensionsMetadata();
        const installedIds = new Set(localMetadata.map(ext => ext.id));

        // Add installed flag to marketplace extensions
        const extensionsWithStatus = marketplaceExtensions.map(ext => ({
            ...ext,
            installed: installedIds.has(ext.id)
        }));

        res.json(extensionsWithStatus);
    } catch (error) {
        console.error('Error fetching marketplace extensions:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error instanceof Error ? error.message : 'Failed to fetch marketplace extensions'
        });
    }
});

/**
 * POST /api/extensions/marketplace/install
 * Installs an extension from the marketplace
 */
router.post('/marketplace/install', async (req: Request, res: Response) => {
    try {
        const { extensionId } = req.body;

        if (!extensionId || typeof extensionId !== 'string') {
            throw new CustomError('Invalid extension ID', StatusCodes.BAD_REQUEST);
        }

        // Sanitize extension ID to prevent path traversal
        const sanitizedId = extensionId.replace(/[^a-zA-Z0-9-_]/g, '');
        if (sanitizedId !== extensionId) {
            throw new CustomError('Invalid extension ID format', StatusCodes.BAD_REQUEST);
        }

        // Check if already installed
        const alreadyInstalled = await extensionExists(sanitizedId);
        if (alreadyInstalled) {
            throw new CustomError('Extension is already installed', StatusCodes.CONFLICT);
        }

        // Fetch extension from GitHub
        const extensionData = await githubService.fetchExtension(sanitizedId);

        // Validate the extension
        const validationResult = validateExtension(extensionData);
        if (!validationResult.valid) {
            console.error(`Invalid extension from marketplace:`, validationResult.errors);
            throw new CustomError(
                `Invalid extension format: ${validationResult.errors?.join(', ')}`,
                StatusCodes.BAD_REQUEST
            );
        }

        // Ensure extensions directory exists
        const extensionsDir = path.join(process.cwd(), 'src', 'extensions');
        await fs.mkdir(extensionsDir, { recursive: true });

        // Save the extension
        const filePath = path.join(extensionsDir, `${sanitizedId}.json`);
        await fs.writeFile(filePath, JSON.stringify(extensionData, null, 2), 'utf-8');

        res.json({
            success: true,
            message: 'Extension installed successfully',
            extension: {
                id: extensionData.id,
                name: extensionData.name,
                version: extensionData.version
            }
        });
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            console.error('Error installing extension:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: error instanceof Error ? error.message : 'Failed to install extension'
            });
        }
    }
});

/**
 * DELETE /api/extensions/:id
 * Deletes a custom extension
 */
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || typeof id !== 'string') {
            throw new CustomError('Invalid extension ID', StatusCodes.BAD_REQUEST);
        }

        // Sanitize extension ID to prevent path traversal
        const sanitizedId = id.replace(/[^a-zA-Z0-9-_]/g, '');
        if (sanitizedId !== id) {
            throw new CustomError('Invalid extension ID format', StatusCodes.BAD_REQUEST);
        }

        // Check if extension exists
        const exists = await extensionExists(sanitizedId);
        if (!exists) {
            throw new CustomError('Extension not found', StatusCodes.NOT_FOUND);
        }

        // Delete the extension file
        const extensionsDir = path.join(process.cwd(), 'src', 'extensions');
        const filePath = path.join(extensionsDir, `${sanitizedId}.json`);
        await fs.unlink(filePath);

        res.json({
            success: true,
            message: 'Extension deleted successfully'
        });
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            console.error('Error deleting extension:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Failed to delete extension'
            });
        }
    }
});

export const extensionsRoute = router;
