import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const BatchUpload = ({ userToken, onUploadSuccess }) => {
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState(null);
    const fileInputRef = useRef();

    const handleUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) return;

        setUploading(true);
        setMessage(null);
        setProgress(0);

        // SPEED BOOST: Convert FileList to array and upload in parallel
        const filesArray = Array.from(selectedFiles);
        let completedCount = 0;

        const uploadTasks = filesArray.map(async (file) => {
            const formData = new FormData();
            formData.append('files', file);

            try {
                await axios.post('http://localhost:5000/api/files', formData, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                completedCount++;
                // Update overall progress bar
                setProgress(Math.round((completedCount / filesArray.length) * 100));
            } catch (err) {
                console.error("Individual file upload failed", err);
            }
        });

        try {
            await Promise.all(uploadTasks);
            setMessage({ type: 'success', text: 'All assets synced successfully.' });
            setSelectedFiles(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            setMessage({ type: 'error', text: 'Upload Interrupted.' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl max-w-2xl mx-auto text-center">
            <div className="flex flex-col items-center mb-6">
                <FaCloudUploadAlt className="text-cyan-400 text-5xl mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-white">High-Speed Upload</h2>
            </div>

            <div className="relative group">
                <input type="file" multiple onChange={(e) => setSelectedFiles(e.target.files)} ref={fileInputRef} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="bg-slate-900 border-2 border-dashed border-slate-600 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-slate-400">{selectedFiles ? `${selectedFiles.length} files selected` : "Drag & drop files"}</span>
                    <span className="bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded">BROWSE</span>
                </div>
            </div>

            {uploading && (
                <div className="mt-6">
                    <div className="flex justify-between text-xs text-cyan-400 mb-1 font-mono">
                        <span>PARALLEL_SYNC_ACTIVE...</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}

            <button onClick={handleUpload} disabled={!selectedFiles || uploading} className={`w-full mt-6 py-3 rounded-lg font-bold text-white ${!selectedFiles || uploading ? 'bg-slate-700' : 'bg-cyan-600 shadow-lg shadow-cyan-500/20'}`}>
                {uploading ? 'UPLOADING...' : 'INITIATE FAST UPLOAD'}
            </button>

            {message && <div className={`mt-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{message.text}</div>}
        </div>
    );
};

export default BatchUpload;