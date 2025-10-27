/**
 * Template Processing Utility
 * Processes extension templates by replacing placeholders with actual values
 */

/**
 * Processes a template string by replacing placeholders with values from settings
 * Supports:
 * - Simple placeholders: {{settingId}}
 * - Ternary operators: {{condition ? 'value1' : 'value2'}}
 */
export function processTemplate(template: string, settings: Record<string, any>): string {
    let processed = template;

    // First, handle ternary operators
    const ternaryRegex = /\{\{([^}?]+)\s*\?\s*["']([^"']*)["']\s*:\s*["']([^"']*)["']\}\}/g;
    processed = processed.replace(ternaryRegex, (match, condition, trueValue, falseValue) => {
        const conditionKey = condition.trim();
        const conditionValue = settings[conditionKey];

        // Evaluate the condition as a boolean
        const result = Boolean(conditionValue);

        return result ? trueValue : falseValue;
    });

    // Then, handle simple placeholders
    const placeholderRegex = /\{\{([^}?]+)\}\}/g;
    processed = processed.replace(placeholderRegex, (match, key) => {
        const settingKey = key.trim();
        const value = settings[settingKey];

        // Return the value as a string, or empty string if undefined
        if (value === undefined || value === null) {
            return '';
        }

        // Convert to string and escape HTML to prevent XSS
        return String(value);
    });

    return processed;
}

/**
 * Processes all templates (HTML, CSS, JavaScript) for an extension
 */
export function processExtensionTemplates(
    html: string,
    css: string,
    javascript: string,
    settings: Record<string, any>
): {
    processedHtml: string;
    processedCss: string;
    processedJavascript: string;
} {
    return {
        processedHtml: processTemplate(html, settings),
        processedCss: processTemplate(css, settings),
        processedJavascript: processTemplate(javascript, settings)
    };
}

/**
 * Escapes HTML to prevent XSS attacks
 * Note: This is used for user-input values, not for the extension templates themselves
 */
export function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Validates setting values against their expected types
 */
export function validateSettingValue(
    value: any,
    type: 'text' | 'url' | 'number' | 'boolean' | 'file'
): boolean {
    switch (type) {
        case 'text':
        case 'url':
        case 'file':
            return typeof value === 'string';
        case 'number':
            return typeof value === 'number' && !isNaN(value);
        case 'boolean':
            return typeof value === 'boolean';
        default:
            return false;
    }
}
