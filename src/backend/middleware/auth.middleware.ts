import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';

const JWT_SECRET = process.env.SECRET || '@jZCgtn^qg8So*^^6A2M'; // Same secret used in auth.route.ts
const CONFIG_FILE = path.join(__dirname, '../config/config.json');

// Define custom Request interface with user property

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            username: string;
            role: string;
            [key: string]: any;
        };
    }
}

// Helper function to check if public access is enabled
const isPublicAccessEnabled = (): boolean => {
    try {
        if (!fs.existsSync(CONFIG_FILE)) {
            return false;
        }
        const data = fs.readFileSync(CONFIG_FILE, 'utf8');
        if (!data.trim()) {
            return false;
        }
        const config = JSON.parse(data);
        return config.publicAccess === true;
    } catch (error) {
        console.error('Error checking public access:', error);
        return false;
    }
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    // Check for token in cookies first (for login/logout/refresh routes)
    // console.log('#### req', req);
    const tokenFromCookie = req.cookies?.access_token;
    // console.log('#### req.token', req.cookies);

    // Then check Authorization header (for API routes that don't use cookies)
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.split(' ')[1];

    // Use cookie token if available, otherwise use header token
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }

        // Add user to request
        req.user = user;
        next();
    });
};

// Middleware to check if user is an admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    // authenticateToken must be called before this middleware
    // console.log('#### req', req);

    if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }

    if (req.user.role !== 'admin') {
        res.status(403).json({ message: 'Admin access required' });
        return;
    }

    next();
};

// Middleware for routes that support public access
// Allows GET requests when public access is enabled, requires auth for all other methods
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
    // Check if public access is enabled
    const publicAccessEnabled = isPublicAccessEnabled();

    // If public access is enabled and this is a GET request, allow it
    if (publicAccessEnabled && req.method === 'GET') {
        // Try to authenticate if token exists (for admin-only content)
        const tokenFromCookie = req.cookies?.access_token;
        const authHeader = req.headers.authorization;
        const tokenFromHeader = authHeader && authHeader.split(' ')[1];
        const token = tokenFromCookie || tokenFromHeader;

        if (token) {
            // Token exists, verify it
            jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
                if (!err) {
                    req.user = user;
                }
                // Continue regardless of verification result
                next();
            });
        } else {
            // No token, but public access is allowed
            next();
        }
        return;
    }

    // For all other cases (public access disabled or non-GET request), require authentication
    authenticateToken(req, res, next);
};
