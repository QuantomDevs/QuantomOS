/**
 * Extension System Types - Frontend
 * Defines the structure and types for the custom extensions system
 */

/**
 * Valid setting types for extension configuration
 */
export type ExtensionSettingType = 'text' | 'url' | 'number' | 'boolean' | 'file';

/**
 * Setting definition for extension configuration
 */
export interface ExtensionSetting {
    id: string;
    name: string;
    type: ExtensionSettingType;
    defaultValue: string | number | boolean;
    description?: string;
}

/**
 * Full extension schema
 */
export interface Extension {
    id: string;
    name: string;
    title: string;
    version: string;
    author: string;
    description: string;
    settings?: ExtensionSetting[];
    html: string;
    css?: string;
    javascript?: string;
}

/**
 * Extension metadata (without full HTML/CSS/JS - used for listing)
 */
export interface ExtensionMetadata {
    id: string;
    name: string;
    title: string;
    version: string;
    author: string;
    description: string;
    settings?: ExtensionSetting[];
}

/**
 * Extension instance with user-configured settings
 */
export interface ExtensionInstance {
    extensionId: string;
    instanceId: string;
    version: string;
    configuredSettings: Record<string, any>;
}

/**
 * Configured extension widget data
 */
export interface ConfiguredExtension {
    extensionId: string;
    extensionName: string;
    version: string;
    settings: Record<string, any>;
    processedHtml: string;
    processedCss: string;
    processedJavascript: string;
}
