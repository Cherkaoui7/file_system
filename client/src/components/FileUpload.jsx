import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaCloudUploadAlt, FaCheckCircle, FaFileCode, FaLayerGroup, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0); // Track REAL progress
    const [uploadedCount, setUploadedCount] = useState(0);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            setFiles((prev) => [...prev, ...acceptedFiles]);
            setUploadedCount(0);
            setProgress(0);
        }
    }, []);

    const removeFile = (indexToRemove) => {
        setFiles(files.filter((_, index) => index !== indexToRemove));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true
    });

    const handleUpload = async (e) => {
        e.preventDefault();
        if (files.length === 0) return toast.warning("⚠️ No data packets detected.");

        setLoading(true);
        setProgress(0);
        setUploadedCount(0);

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            // ⚡ NO DELAY: Pure speed.
            const res = await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },

                // 👇 REAL-TIME TRACKING: Calculates actual upload speed
                onUploadProgress: (data) => {
                    const percent = Math.round((100 * data.loaded) / data.total);
                    setProgress(percent);
                },
            });

            toast.success(`🚀 Upload Complete: ${res.data.count} Files!`);
            setUploadedCount(res.data.count);
            setFiles([]);
        } catch (err) {
            console.error(err);
            toast.error("❌ Upload Failed");
        } finally {
            setLoading(false);
            // Reset progress bar after a short moment so it looks clean
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="relative group">

                {/* Background Glow */}
                <div className={`absolute -inset-1 rounded-2xl blur opacity-25 transition duration-1000 
          ${isDragActive ? 'bg-green-500 opacity-75' : 'bg-gradient-to-r from-cyan-600 to-blue-600 group-hover:opacity-75'}`}>
                </div>

                <div className="relative bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl">
                    <div className="text-center">

                        {/* Drop Zone */}
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4
                ${isDragActive
                                    ? 'border-green-400 bg-green-500/10 scale-105'
                                    : 'border-slate-600 hover:border-cyan-400 hover:bg-slate-700/50'
                                }
              `}
                        >
                            <input {...getInputProps()} />

                            <motion.div
                                animate={isDragActive ? { scale: 1.2 } : { scale: 1 }}
                                className="text-6xl"
                            >
                                {files.length > 0 ? <FaLayerGroup className="text-yellow-400" /> : <FaCloudUploadAlt className={isDragActive ? "text-green-400" : "text-cyan-400"} />}
                            </motion.div>

                            <div className="space-y-2">
                                {files.length > 0 ? (
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Batch Ready</h3>
                                        <p className="text-yellow-400 font-mono text-sm">{files.length} Data Packets Selected</p>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            {isDragActive ? "Drop Batch Here" : "Upload Data Packets"}
                                        </h3>
                                        <p className="text-slate-400">Drag & drop multiple files (Images, Zip, RAR, Videos)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* File List Preview */}
                        {files.length > 0 && !loading && (
                            <div className="mt-4 max-h-40 overflow-y-auto bg-slate-900/50 rounded-lg p-2 text-left border border-slate-700 custom-scrollbar">
                                {files.map((file, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 hover:bg-slate-800 rounded group">
                                        <div className="flex items-center gap-2 truncate">
                                            <FaFileCode className="text-cyan-500 text-xs" />
                                            <span className="text-slate-300 text-xs truncate w-48">{file.name}</span>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                            className="text-red-500 hover:text-red-400"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Progress Bar Section */}
                        <AnimatePresence>
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6"
                                >
                                    <div className="flex justify-between text-xs text-cyan-400 mb-1 font-mono">
                                        <span className="animate-pulse">TRANSMITTING...</span>
                                        <span>{progress}%</span>
                                    </div>

                                    <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden border border-slate-600">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_#06b6d4]"
                                            initial={{ width: "0%" }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Launch Button */}
                        {!loading && files.length > 0 && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleUpload}
                                className="mt-6 w-full py-3 px-6 rounded-lg font-bold uppercase tracking-wider bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/30 transition-all"
                            >
                                Initiate Batch Upload ({files.length})
                            </motion.button>
                        )}

                    </div>

                    {/* Success Message */}
                    <AnimatePresence>
                        {uploadedCount > 0 && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-4"
                            >
                                <FaCheckCircle className="text-green-400 text-2xl" />
                                <div>
                                    <h4 className="font-bold text-green-300">Batch Secured</h4>
                                    <p className="text-sm text-green-400/80">{uploadedCount} files indexed successfully.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;