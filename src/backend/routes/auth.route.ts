import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

import { authenticateToken } from '../middleware/auth.middleware';

export const authRoute = Router();
const USER_PATH = path.join(__dirname, '../config/user.json');
const PROFILE_PICTURE_DIR = path.join(process.cwd(), 'public', 'uploads', 'profile');
const JWT_SECRET = process.env.SECRET || '@jZCgtn^qg8So*^^6A2M';
const REFRESH_TOKEN_SECRET = process.env.SECRET || '@jZCgtn^qg8So*^^6A2M';
const ACCESS_TOKEN_EXPIRY = '3d';
const REFRESH_TOKEN_EXPIRY = '7d';

// Interface for single user data
interface User {
  username: string;
  passwordHash: string;
  profilePicture?: string;  // Path to profile picture
  refreshTokens?: string[];  // Store issued refresh tokens
}

// Ensure profile picture directory exists
if (!fs.existsSync(PROFILE_PICTURE_DIR)) {
    fs.mkdirSync(PROFILE_PICTURE_DIR, { recursive: true });
}

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, PROFILE_PICTURE_DIR);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `profile-picture${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: (_req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Only image files are allowed'));
            return;
        }
        cb(null, true);
    }
});

// Helper function to read user from JSON file
const readUser = (): User | null => {
    try {
        // Create directory if it doesn't exist
        const dir = path.dirname(USER_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Create file if it doesn't exist
        if (!fs.existsSync(USER_PATH)) {
            return null;
        }

        const data = fs.readFileSync(USER_PATH, 'utf8');
        if (!data.trim()) {
            return null;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading user:', error);
        return null;
    }
};

// Helper function to write user to JSON file
const writeUser = (user: User): void => {
    try {
        const dir = path.dirname(USER_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(USER_PATH, JSON.stringify(user, null, 2));
    } catch (error) {
        console.error('Error writing user:', error);
    }
};

// Generate access token
const generateAccessToken = (username: string): string => {
    return jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

// Generate refresh token
const generateRefreshToken = (username: string): string => {
    return jwt.sign({ username }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

// Helper to get refresh token expiration date
const getTokenExpiration = (token: string): Date | null => {
    try {
        const decoded = jwt.decode(token) as { exp: number } | null;
        if (decoded && decoded.exp) {
            return new Date(decoded.exp * 1000);
        }
        return null;
    } catch (err) {
        console.error('Failed to decode token for expiration check:', err);
        return null;
    }
};

// Check if system is initialized (user exists)
authRoute.get('/initialized', (_req: Request, res: Response) => {
    try {
        const user = readUser();
        res.json({ initialized: user !== null });
    } catch (error) {
        console.error('Error checking initialization:', error);
        res.status(500).json({ message: 'Failed to check initialization status' });
    }
});

// Setup route - Create initial user (only works if no user exists)
authRoute.post('/setup', upload.single('profilePicture'), async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = readUser();
        if (existingUser) {
            res.status(409).json({ message: 'User already exists' });
            return;
        }

        // Validate input
        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ message: 'Password must be at least 8 characters long' });
            return;
        }

        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user object
        const user: User = {
            username,
            passwordHash,
            refreshTokens: []
        };

        // Handle profile picture if uploaded
        if (req.file) {
            user.profilePicture = `/uploads/profile/${req.file.filename}`;
        }

        // Save user
        writeUser(user);

        // Generate tokens for automatic login
        const token = generateAccessToken(username);
        const refreshToken = generateRefreshToken(username);

        // Store refresh token
        user.refreshTokens = [refreshToken];
        writeUser(user);

        // Set secure HTTP-only cookies
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Return success
        res.status(201).json({
            success: true,
            message: 'Setup completed successfully',
            user: {
                username: user.username,
                profilePicture: user.profilePicture || null
            }
        });
    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route - Password only
authRoute.post('/login', async (req: Request, res: Response) => {
    try {
        const { password } = req.body;

        // Validate input
        if (!password) {
            res.status(400).json({ success: false, message: 'Password is required' });
            return;
        }

        // Get the user
        const user = readUser();
        if (!user) {
            res.status(401).json({ success: false, message: 'No user configured. Please run setup first.' });
            return;
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
            return;
        }

        // Generate tokens
        const token = generateAccessToken(user.username);
        const refreshToken = generateRefreshToken(user.username);

        // Store refresh token
        if (!user.refreshTokens) {
            user.refreshTokens = [];
        }
        user.refreshTokens.push(refreshToken);
        writeUser(user);

        // Set secure HTTP-only cookies
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Return success
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                username: user.username,
                profilePicture: user.profilePicture || null
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Authentication failed. Please try again later.' });
    }
});

// Get current user info (public route - no auth required)
authRoute.get('/user', (_req: Request, res: Response) => {
    try {
        const user = readUser();
        if (!user) {
            res.json({
                username: 'User',
                profilePicture: null
            });
            return;
        }

        res.json({
            username: user.username,
            profilePicture: user.profilePicture || null
        });
    } catch (error) {
        console.error('Error getting user info:', error);
        res.status(500).json({ message: 'Failed to get user information' });
    }
});

// Update profile (username) - requires authentication
authRoute.patch('/profile', [authenticateToken], async (req: Request, res: Response) => {
    try {
        const { username } = req.body;

        if (!username) {
            res.status(400).json({ message: 'Username is required' });
            return;
        }

        // Validate username
        if (username.length < 2 || username.length > 50) {
            res.status(400).json({ message: 'Username must be between 2 and 50 characters' });
            return;
        }

        // Get current user
        const user = readUser();
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Update username
        user.username = username;
        writeUser(user);

        res.json({
            success: true,
            message: 'Username updated successfully',
            username: user.username
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// Upload profile picture - requires authentication
authRoute.post('/profile-picture', [authenticateToken], upload.single('profilePicture'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        // Get current user
        const user = readUser();
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Delete old profile picture if it exists
        if (user.profilePicture) {
            const oldPicturePath = path.join(process.cwd(), 'public', user.profilePicture);
            if (fs.existsSync(oldPicturePath)) {
                try {
                    fs.unlinkSync(oldPicturePath);
                } catch (err) {
                    console.error('Error deleting old profile picture:', err);
                }
            }
        }

        // Update user with new profile picture path
        user.profilePicture = `/uploads/profile/${req.file.filename}`;
        writeUser(user);

        res.json({
            success: true,
            message: 'Profile picture uploaded successfully',
            profilePicture: user.profilePicture
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ message: 'Failed to upload profile picture' });
    }
});

// Refresh token route
authRoute.post('/refresh', async (req: Request, res: Response) => {
    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies?.refresh_token;

        if (!refreshToken) {
            res.status(204).end();
            return;
        }

        // Check token expiration date
        const expirationDate = getTokenExpiration(refreshToken);
        if (expirationDate) {
            const now = new Date();
            const timeLeft = expirationDate.getTime() - now.getTime();
            const minutesLeft = Math.floor(timeLeft / (1000 * 60));
            console.log(`Token expiration: ${expirationDate.toISOString()}, ${minutesLeft} minutes left`);
        }

        // Verify refresh token
        let decoded: any;
        let tokenExpired = false;

        try {
            decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { username: string };
        } catch (err: any) {
            tokenExpired = err.name === 'TokenExpiredError';

            if (tokenExpired) {
                // Clear cookies
                res.clearCookie('access_token', {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    path: '/'
                });

                res.clearCookie('refresh_token', {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    path: '/'
                });

                res.status(401).json({ message: 'Refresh token expired' });
            } else {
                res.status(401).json({ message: 'Invalid refresh token' });
            }
            return;
        }

        // Get user and verify refresh token
        const user = readUser();
        if (!user || !user.refreshTokens?.includes(refreshToken)) {
            // Clear cookies
            res.clearCookie('access_token', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/'
            });

            res.clearCookie('refresh_token', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/'
            });

            res.status(401).json({ message: 'Refresh token not found' });
            return;
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(user.username);

        // Set the new access token cookie
        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Generate and set new refresh token
        const newRefreshToken = generateRefreshToken(user.username);
        res.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Update user's refresh tokens
        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        user.refreshTokens.push(newRefreshToken);
        writeUser(user);

        res.json({
            message: 'Token refreshed successfully',
            isAdmin: true // Single user is always admin
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Logout route
authRoute.post('/logout', (req: Request, res: Response) => {
    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies?.refresh_token;

        if (refreshToken) {
            // Remove the refresh token from user
            const user = readUser();
            if (user && user.refreshTokens) {
                user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
                writeUser(user);
            }
        }

        // Clear cookies
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });

        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });

        // Additionally clear without httpOnly for client-side cookies
        res.clearCookie('access_token', {
            secure: false,
            path: '/'
        });

        res.clearCookie('refresh_token', {
            secure: false,
            path: '/'
        });

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Check if any users exist in the system (for backward compatibility)
authRoute.get('/check-users', (_req: Request, res: Response) => {
    try {
        const user = readUser();
        const hasUsers = user !== null;

        res.json({ hasUsers });
    } catch (error) {
        console.error('Error checking users:', error);
        res.status(500).json({ message: 'Failed to check if users exist' });
    }
});

// Check if the current user is an admin (always true for single user)
authRoute.get('/check-admin', [authenticateToken], (_req: Request, res: Response) => {
    try {
        res.json({ isAdmin: true });
    } catch (error) {
        console.error('Error checking admin status:', error);
        res.status(500).json({ message: 'Failed to check admin status' });
    }
});

// Check cookies (for debugging)
authRoute.get('/check-cookies', (req: Request, res: Response) => {
    res.json({
        cookies: req.cookies,
        hasAccessToken: !!req.cookies.access_token,
        hasRefreshToken: !!req.cookies.refresh_token
    });
});

// Change password route (requires authentication)
authRoute.post('/change-password', [authenticateToken], async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword || !confirmPassword) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        // Validate new password and confirm password match
        if (newPassword !== confirmPassword) {
            res.status(400).json({ message: 'New password and confirmation do not match' });
            return;
        }

        // Validate new password strength
        if (newPassword.length < 8) {
            res.status(400).json({ message: 'New password must be at least 8 characters long' });
            return;
        }

        // Get the user
        const user = readUser();
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Verify current password
        const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);

        if (!passwordMatch) {
            res.status(401).json({ message: 'Current password is incorrect' });
            return;
        }

        // Hash the new password
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update the password
        user.passwordHash = newPasswordHash;
        writeUser(user);

        console.log(`Password changed successfully for user: ${user.username}`);
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
