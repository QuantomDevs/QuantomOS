import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// GitHub repository configuration
const GITHUB_OWNER = 'QuantomDevs';
const GITHUB_REPO = 'QuantomOS';
const GITHUB_EXTENSIONS_PATH = 'extensions';
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';

// Local extensions directory
const LOCAL_EXTENSIONS_DIR = path.join(process.cwd(), 'extensions');

// Cache configuration
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

interface GitHubFileResponse {
    name: string;
    path: string;
    type: 'file' | 'dir';
    download_url?: string;
}

interface ExtensionMetadata {
    id: string;
    name: string;
    title: string;
    description: string;
    author: string;
    version: string;
}

class GitHubService {
    private cache: Map<string, CacheEntry<any>> = new Map();

    /**
     * Check if cache entry is still valid
     */
    private isCacheValid<T>(entry: CacheEntry<T> | undefined): boolean {
        if (!entry) return false;
        return Date.now() - entry.timestamp < CACHE_DURATION;
    }

    /**
     * Get data from cache or fetch if expired
     */
    private getCached<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (entry && this.isCacheValid(entry)) {
            return entry.data as T;
        }
        return null;
    }

    /**
     * Store data in cache
     */
    private setCache<T>(key: string, data: T): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Fetch the list of extension directories from local filesystem
     */
    async listExtensions(): Promise<ExtensionMetadata[]> {
        const cacheKey = 'marketplace_extensions';

        // Check cache first
        const cached = this.getCached<ExtensionMetadata[]>(cacheKey);
        if (cached) {
            console.log('Returning cached marketplace extensions');
            return cached;
        }

        try {
            console.log('Loading marketplace extensions from local filesystem...');

            // Check if extensions directory exists
            if (!fs.existsSync(LOCAL_EXTENSIONS_DIR)) {
                console.warn(`Extensions directory not found: ${LOCAL_EXTENSIONS_DIR}`);
                return [];
            }

            // Read all directories in the extensions folder
            const items = fs.readdirSync(LOCAL_EXTENSIONS_DIR, { withFileTypes: true });
            const extensionDirs = items.filter(item => item.isDirectory());

            // Fetch metadata for each extension
            const extensions: ExtensionMetadata[] = [];
            for (const dir of extensionDirs) {
                try {
                    const metadata = await this.fetchExtensionMetadata(dir.name);
                    if (metadata) {
                        extensions.push(metadata);
                    }
                } catch (error) {
                    console.error(`Failed to fetch metadata for ${dir.name}:`, error);
                    // Continue with other extensions
                }
            }

            // Cache the results
            this.setCache(cacheKey, extensions);

            return extensions;
        } catch (error: any) {
            console.error('Failed to load extensions from local filesystem:', error.message);
            throw new Error('Failed to fetch marketplace extensions');
        }
    }

    /**
     * Fetch metadata for a specific extension from local filesystem
     */
    private async fetchExtensionMetadata(extensionId: string): Promise<ExtensionMetadata | null> {
        try {
            const extensionDir = path.join(LOCAL_EXTENSIONS_DIR, extensionId);

            // Check if extension directory exists
            if (!fs.existsSync(extensionDir)) {
                console.warn(`Extension directory not found: ${extensionDir}`);
                return null;
            }

            // Try to find JSON file - first with same name as folder, then extension.json
            let jsonFilePath = path.join(extensionDir, `${extensionId}.json`);

            if (!fs.existsSync(jsonFilePath)) {
                jsonFilePath = path.join(extensionDir, 'extension.json');
            }

            if (!fs.existsSync(jsonFilePath)) {
                console.warn(`No JSON file found for extension: ${extensionId}`);
                return null;
            }

            // Read and parse the JSON file
            const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
            const data = JSON.parse(fileContent);

            // Return only metadata (not full extension content)
            return {
                id: data.id || extensionId,
                name: data.name || extensionId,
                title: data.title || data.name || extensionId,
                description: data.description || 'No description available',
                author: data.author || 'Unknown',
                version: data.version || '1.0.0'
            };
        } catch (error) {
            console.error(`Failed to fetch metadata for ${extensionId}:`, error);
            return null;
        }
    }

    /**
     * Fetch full extension data from local filesystem
     */
    async fetchExtension(extensionId: string): Promise<any> {
        try {
            // Sanitize extension ID to prevent path traversal
            const sanitizedId = extensionId.replace(/[^a-zA-Z0-9-_]/g, '');

            if (sanitizedId !== extensionId) {
                throw new Error('Invalid extension ID');
            }

            const extensionDir = path.join(LOCAL_EXTENSIONS_DIR, sanitizedId);

            // Check if extension directory exists
            if (!fs.existsSync(extensionDir)) {
                console.error(`Extension directory not found: ${extensionDir}`);
                throw new Error('Extension not found on marketplace');
            }

            // Try to find JSON file - first with same name as folder, then extension.json
            let jsonFilePath = path.join(extensionDir, `${sanitizedId}.json`);

            if (!fs.existsSync(jsonFilePath)) {
                jsonFilePath = path.join(extensionDir, 'extension.json');
            }

            if (!fs.existsSync(jsonFilePath)) {
                console.error(`No JSON file found for extension: ${sanitizedId}`);
                throw new Error('Extension not found on marketplace');
            }

            console.log(`Loading extension from: ${jsonFilePath}`);

            // Read and parse the JSON file
            const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
            const data = JSON.parse(fileContent);

            return data;
        } catch (error: any) {
            console.error(`Failed to fetch extension ${extensionId}:`, error.message);

            if (error.message.includes('not found')) {
                throw new Error('Extension not found on marketplace');
            }

            throw new Error('Failed to fetch extension from marketplace');
        }
    }

    /**
     * Clear the cache (useful for testing or forcing refresh)
     */
    clearCache(): void {
        this.cache.clear();
        console.log('GitHub service cache cleared');
    }
}

// Export singleton instance
export const githubService = new GitHubService();
