import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    FaTrash, FaDownload, FaFileAlt, FaVideo,
    FaFilePdf, FaSearch, FaTimesCircle, FaPlayCircle, FaTimes
} from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

const FileList = ({ token, refreshTrigger }) => {
    const [files, setFiles] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null); // 👈 Track file for Lightbox

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/files', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFiles(res.data);
            } catch (err) {
                console.error("Gallery sync failed:", err);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchFiles();
    }, [token, refreshTrigger]);

    const getFileCategory = (file) => {
        const mime = (file.mimetype || file.contentType || '').toLowerCase();
        const name = (file.originalName || file.filename || '').toLowerCase();
        if (mime.startsWith('image/') || name.match(/\.(jpg|jpeg|png|gif|webp)$/)) return 'image';
        if (mime.startsWith('video/') || name.match(/\.(mp4|mov|avi)$/)) return 'video';
        if (mime.includes('pdf') || name.endsWith('.pdf')) return 'document';
        return 'other';
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete asset permanently?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/files/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFiles(files.filter(f => f._id !== id));
        } catch (e) { alert("Access denied or server error."); }
    };

    const filteredFiles = files.filter(f => {
        const matchesTab = filter === 'all' || getFileCategory(f) === filter;
        const fileName = (f.originalName || f.filename || '').toLowerCase();
        const matchesSearch = fileName.includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    if (loading) return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-48 bg-slate-800 animate-pulse rounded-xl border border-slate-700"></div>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Utility Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
                <div className="relative w-full lg:max-w-md">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide w-full lg:w-auto">
                    {['all', 'image', 'video', 'document', 'other'].map(t => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-5 py-2 rounded-lg text-xs font-bold border transition-all ${filter === t ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                                }`}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredFiles.map(file => {
                    const category = getFileCategory(file);
                    const isImage = category === 'image';
                    const isVideo = category === 'video';

                    return (
                        <div key={file._id} className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-500 shadow-xl transition-all duration-300">
                            <div
                                className="h-40 bg-slate-950 flex items-center justify-center relative overflow-hidden cursor-pointer"
                                onClick={() => (isImage || isVideo) && setSelectedFile(file)}
                            >
                                {isImage ? (
                                    <img
                                        src={`http://localhost:5000/api/files/${file._id}`}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        alt="asset"
                                        loading="lazy"
                                    />
                                ) : isVideo ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <FaPlayCircle className="text-5xl text-cyan-500/60 group-hover:text-cyan-400 transition-colors" />
                                        <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Video Stream</span>
                                    </div>
                                ) : (
                                    <FaFileAlt className="text-4xl text-slate-700" />
                                )}

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(file._id); }} className="p-2 bg-red-600 rounded-full text-white hover:bg-red-500 shadow-lg"><FaTrash /></button>
                                    <a href={`http://localhost:5000/api/files/${file._id}`} download onClick={(e) => e.stopPropagation()} className="p-2 bg-cyan-600 rounded-full text-white hover:bg-cyan-500 shadow-lg"><FaDownload /></a>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-800/80 border-t border-slate-700">
                                <p className="text-xs font-medium truncate text-slate-200">{file.originalName || file.filename}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- LIGHTBOX MODAL --- */}
            <AnimatePresence>
                {selectedFile && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                        onClick={() => setSelectedFile(null)}
                    >
                        <button className="absolute top-8 right-8 text-white text-3xl hover:rotate-90 transition-transform"><FaTimes /></button>

                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="max-w-5xl w-full flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {getFileCategory(selectedFile) === 'image' ? (
                                <img
                                    src={`http://localhost:5000/api/files/${selectedFile._id}`}
                                    className="max-w-full max-h-[80vh] rounded-lg shadow-2xl border border-slate-800"
                                    alt="full asset"
                                />
                            ) : (
                                <video
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-[80vh] rounded-lg shadow-2xl border border-slate-800"
                                >
                                    <source src={`http://localhost:5000/api/files/${selectedFile._id}`} type={selectedFile.contentType || selectedFile.mimetype} />
                                    Your browser does not support the video tag.
                                </video>
                            )}

                            <div className="mt-4 text-center">
                                <h4 className="text-white font-bold">{selectedFile.originalName || selectedFile.filename}</h4>
                                <p className="text-xs text-slate-500 uppercase font-mono mt-1">{selectedFile.contentType || selectedFile.mimetype}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FileList;