import axios from 'axios';

// GitHub repository configuration
const GITHUB_OWNER = 'QuantomDevs';
const GITHUB_REPO = 'QuantomOS';
const GITHUB_EXTENSIONS_PATH = 'extensions';
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';

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
     * Fetch the list of extension directories from GitHub
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
            console.log('Fetching marketplace extensions from GitHub...');

            // Fetch the contents of the extensions directory
            const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_EXTENSIONS_PATH}`;
            const response = await axios.get<GitHubFileResponse[]>(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'QuantomOS-Marketplace'
                }
            });

            // Filter for directories only
            const extensionDirs = response.data.filter(item => item.type === 'dir');

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
            console.error('Failed to fetch extensions from GitHub:', error.message);

            // If it's a rate limit error, inform the user
            if (error.response?.status === 403) {
                throw new Error('GitHub API rate limit exceeded. Please try again later.');
            }

            throw new Error('Failed to fetch marketplace extensions');
        }
    }

    /**
     * Fetch metadata for a specific extension
     */
    private async fetchExtensionMetadata(extensionId: string): Promise<ExtensionMetadata | null> {
        try {
            const url = `${GITHUB_RAW_BASE}/${GITHUB_OWNER}/${GITHUB_REPO}/main/${GITHUB_EXTENSIONS_PATH}/${extensionId}/extension.json`;

            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'QuantomOS-Marketplace'
                }
            });

            const data = response.data;

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
     * Fetch full extension data from GitHub
     */
    async fetchExtension(extensionId: string): Promise<any> {
        try {
            // Sanitize extension ID to prevent path traversal
            const sanitizedId = extensionId.replace(/[^a-zA-Z0-9-_]/g, '');

            if (sanitizedId !== extensionId) {
                throw new Error('Invalid extension ID');
            }

            const url = `${GITHUB_RAW_BASE}/${GITHUB_OWNER}/${GITHUB_REPO}/main/${GITHUB_EXTENSIONS_PATH}/${sanitizedId}/extension.json`;

            console.log(`Fetching extension from: ${url}`);

            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'QuantomOS-Marketplace'
                }
            });

            return response.data;
        } catch (error: any) {
            console.error(`Failed to fetch extension ${extensionId}:`, error.message);

            if (error.response?.status === 404) {
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
