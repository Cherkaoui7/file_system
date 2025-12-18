import axios from 'axios';

// 👇 DEFINED HERE (At the top) so everyone can use it
const API_URL = 'http://localhost:5000/api/files';

// 1. Upload Function
export const uploadFiles = async (formData, token, onProgress) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (data) => {
            const progress = Math.round((data.loaded / data.total) * 100);
            if (onProgress) onProgress(progress);
        },
    };

    // Uses API_URL here
    const response = await axios.post(`${API_URL}/upload`, formData, config);
    return response.data;
};

// 2. Get All Files Function
export const getUserFiles = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    // Uses API_URL here
    const response = await axios.get(`${API_URL}`, config);
    return response.data;
};

// 3. Delete File Function
export const deleteFile = async (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    // Uses API_URL here
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
};