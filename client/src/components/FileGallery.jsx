import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FaFileAlt, FaDownload, FaTrash, FaRegClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const FileGallery = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFiles = async () => {
        try {
            const res = await api.get('/files');
            setFiles(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("⚠️ CONFIRM DELETION: This action cannot be undone.")) return;
        try {
            await api.delete(`/files/${id}`);
            setFiles(files.filter(file => file._id !== id));
            toast.info("🗑️ File purged from system.");
        } catch (err) {
            toast.error("Deletion Failed.");
        }
    };

    // Helper for file sizes
    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading) return <div className="text-center text-cyan-400 animate-pulse mt-10">System Scanning...</div>;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
                    Data Archives
                    <span className="text-sm font-normal text-slate-500 ml-2">({files.length} items)</span>
                </h3>
                <button onClick={fetchFiles} className="text-sm text-cyan-400 hover:text-cyan-300 underline">Refresh Stream</button>
            </div>

            {files.length === 0 ? (
                <div className="text-center p-10 border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
                    No data packets found in this sector.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {files.map((file, index) => (
                        <motion.div
                            key={file._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all group"
                        >

                            {/* Preview Box */}
                            <div className="h-40 bg-slate-900/50 flex items-center justify-center relative overflow-hidden">
                                {file.mimetype.startsWith('image') ? (
                                    <img
                                        src={`http://localhost:5000/api/files/${file._id}`}
                                        alt={file.originalName}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    <FaFileAlt className="text-5xl text-slate-600 group-hover:text-cyan-500 transition-colors" />
                                )}

                                {/* Overlay on Hover */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                    <a
                                        href={`http://localhost:5000/api/files/${file._id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-3 bg-cyan-600 rounded-full text-white hover:bg-cyan-500 shadow-lg hover:scale-110 transition-transform"
                                        title="Download"
                                    >
                                        <FaDownload />
                                    </a>
                                    <button
                                        onClick={() => handleDelete(file._id)}
                                        className="p-3 bg-red-600 rounded-full text-white hover:bg-red-500 shadow-lg hover:scale-110 transition-transform"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="p-4">
                                <h4 className="text-white font-medium truncate" title={file.originalName}>
                                    {file.originalName}
                                </h4>
                                <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                                    <span className="bg-slate-700 px-2 py-1 rounded">{formatSize(file.size)}</span>
                                    <span className="flex items-center gap-1">
                                        <FaRegClock /> {new Date(file.uploadDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileGallery;