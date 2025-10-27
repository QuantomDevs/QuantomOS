import axios from 'axios';

import { Extension, ExtensionMetadata } from '../types/extension.types';

const API_BASE_URL = '/api';

/**
 * Fetches all available extensions metadata
 */
export async function fetchExtensions(): Promise<ExtensionMetadata[]> {
    try {
        const response = await axios.get(`${API_BASE_URL}/extensions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching extensions:', error);
        throw error;
    }
}

/**
 * Fetches a single extension by ID with full data
 */
export async function fetchExtension(id: string): Promise<Extension> {
    try {
        const response = await axios.get(`${API_BASE_URL}/extensions/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching extension ${id}:`, error);
        throw error;
    }
}

/**
 * Uploads a file for extension settings
 */
export async function uploadExtensionFile(file: File): Promise<{
    success: boolean;
    filename: string;
    path: string;
    size: number;
}> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_BASE_URL}/extensions/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}
