import { promises as fs } from 'fs';
import path from 'path';

import { Extension, ExtensionMetadata } from '../types/extension.types';
import { sanitizeExtension, validateExtension } from '../utils/extensionValidator';

/**
 * Path to the extensions directory
 */
const EXTENSIONS_DIR = path.join(process.cwd(), 'src', 'extensions');

/**
 * Loads all extensions from the extensions directory
 */
export async function loadAllExtensions(): Promise<Extension[]> {
    try {
        const files = await fs.readdir(EXTENSIONS_DIR);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        const extensions: Extension[] = [];

        for (const file of jsonFiles) {
            try {
                const extension = await loadExtension(file.replace('.json', ''));
                if (extension) {
                    extensions.push(extension);
                }
            } catch (error) {
                console.error(`Error loading extension ${file}:`, error);
                // Continue loading other extensions
            }
        }

        return extensions;
    } catch (error) {
        console.error('Error reading extensions directory:', error);
        return [];
    }
}

/**
 * Loads a single extension by ID
 */
export async function loadExtension(id: string): Promise<Extension | null> {
    try {
        const filePath = path.join(EXTENSIONS_DIR, `${id}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        // Validate the extension
        const validationResult = validateExtension(data);
        if (!validationResult.valid) {
            console.error(`Invalid extension ${id}:`, validationResult.errors);
            return null;
        }

        // Sanitize and return
        return sanitizeExtension(data as Extension);
    } catch (error) {
        console.error(`Error loading extension ${id}:`, error);
        return null;
    }
}

/**
 * Gets metadata for all extensions (without full HTML/CSS/JS)
 */
export async function getExtensionsMetadata(): Promise<ExtensionMetadata[]> {
    const extensions = await loadAllExtensions();

    return extensions.map(ext => ({
        id: ext.id,
        name: ext.name,
        title: ext.title,
        version: ext.version,
        author: ext.author,
        description: ext.description,
        settings: ext.settings
    }));
}

/**
 * Checks if an extension exists
 */
export async function extensionExists(id: string): Promise<boolean> {
    try {
        const filePath = path.join(EXTENSIONS_DIR, `${id}.json`);
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}
