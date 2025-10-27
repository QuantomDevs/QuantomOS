import { Extension, ExtensionSetting, ValidationResult } from '../types/extension.types';

/**
 * Validates an extension JSON structure
 */
export function validateExtension(data: any): ValidationResult {
    const errors: string[] = [];

    // Check required fields
    if (!data.id || typeof data.id !== 'string') {
        errors.push('Extension must have a valid "id" field (string)');
    } else if (data.id.includes(' ')) {
        errors.push('Extension "id" must not contain spaces');
    }

    if (!data.name || typeof data.name !== 'string') {
        errors.push('Extension must have a valid "name" field (string)');
    }

    if (!data.title || typeof data.title !== 'string') {
        errors.push('Extension must have a valid "title" field (string)');
    }

    if (!data.version || typeof data.version !== 'string') {
        errors.push('Extension must have a valid "version" field (string)');
    }

    if (!data.author || typeof data.author !== 'string') {
        errors.push('Extension must have a valid "author" field (string)');
    }

    if (!data.description || typeof data.description !== 'string') {
        errors.push('Extension must have a valid "description" field (string)');
    }

    if (!data.html || typeof data.html !== 'string') {
        errors.push('Extension must have a valid "html" field (string)');
    }

    // Validate optional CSS field
    if (data.css !== undefined && data.css !== null && typeof data.css !== 'string') {
        errors.push('Extension "css" field must be a string if provided');
    }

    // Validate optional JavaScript field
    if (data.javascript !== undefined && data.javascript !== null && typeof data.javascript !== 'string') {
        errors.push('Extension "javascript" field must be a string if provided');
    }

    // Validate settings array if present
    if (data.settings !== undefined) {
        if (!Array.isArray(data.settings)) {
            errors.push('Extension "settings" must be an array if provided');
        } else {
            data.settings.forEach((setting: any, index: number) => {
                const settingErrors = validateSetting(setting);
                if (settingErrors.length > 0) {
                    errors.push(`Setting at index ${index}: ${settingErrors.join(', ')}`);
                }
            });
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validates a single extension setting
 */
function validateSetting(setting: any): string[] {
    const errors: string[] = [];
    const validTypes = ['text', 'url', 'number', 'boolean', 'file'];

    if (!setting.id || typeof setting.id !== 'string') {
        errors.push('Setting must have a valid "id" field (string)');
    }

    if (!setting.name || typeof setting.name !== 'string') {
        errors.push('Setting must have a valid "name" field (string)');
    }

    if (!setting.type || !validTypes.includes(setting.type)) {
        errors.push(`Setting must have a valid "type" field (one of: ${validTypes.join(', ')})`);
    }

    if (setting.defaultValue === undefined || setting.defaultValue === null) {
        errors.push('Setting must have a "defaultValue" field');
    } else {
        // Validate defaultValue matches type
        const type = setting.type;
        const value = setting.defaultValue;

        if (type === 'text' || type === 'url' || type === 'file') {
            if (typeof value !== 'string') {
                errors.push(`Setting with type "${type}" must have a string defaultValue`);
            }
        } else if (type === 'number') {
            if (typeof value !== 'number') {
                errors.push('Setting with type "number" must have a number defaultValue');
            }
        } else if (type === 'boolean') {
            if (typeof value !== 'boolean') {
                errors.push('Setting with type "boolean" must have a boolean defaultValue');
            }
        }
    }

    if (setting.description !== undefined && typeof setting.description !== 'string') {
        errors.push('Setting "description" must be a string if provided');
    }

    return errors;
}

/**
 * Sanitizes extension data to ensure it's safe to use
 */
export function sanitizeExtension(extension: Extension): Extension {
    return {
        ...extension,
        // Ensure strings are properly trimmed
        id: extension.id.trim(),
        name: extension.name.trim(),
        title: extension.title.trim(),
        version: extension.version.trim(),
        author: extension.author.trim(),
        description: extension.description.trim(),
        html: extension.html,
        css: extension.css || '',
        javascript: extension.javascript || '',
        settings: extension.settings || []
    };
}
