import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom'; // 👈 Essential for navigation
import { AuthContext } from '../context/AuthContext';
import BatchUpload from '../components/BatchUpload';
import FileList from '../components/FileList';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaRocket, FaUserCircle, FaInfoCircle } from 'react-icons/fa'; // 👈 Added Info Icon
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleUploadSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800/50 backdrop-blur-md sticky top-0 z-50 shadow-lg"
            >
                <div className="flex items-center gap-3">
                    <FaRocket className="text-cyan-400 text-3xl" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        AETHER CLOUD
                    </h1>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    {/* 👇 NEW ABOUT LINK */}
                    <Link
                        to="/about"
                        className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                        <FaInfoCircle /> About
                    </Link>

                    <Link to="/profile" className="flex items-center gap-3 group">
                        <span className="hidden md:inline text-slate-300 text-sm">
                            Operator: <span className="text-cyan-300 font-bold">{user?.name}</span>
                        </span>
                        <div className="w-10 h-10 rounded-full border-2 border-slate-600 group-hover:border-cyan-400 overflow-hidden bg-slate-800 flex items-center justify-center">
                            {user?.avatar ? (
                                <img
                                    src={`http://localhost:5000/api/files/${user.avatar}`}
                                    className="w-full h-full object-cover"
                                    alt="User"
                                />
                            ) : <FaUserCircle className="text-2xl text-slate-500" />}
                        </div>
                    </Link>

                    <button onClick={logout} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                        <FaSignOutAlt />
                    </button>
                </div>
            </motion.header>
            <main className="max-w-7xl mx-auto p-6 space-y-12">
                <ErrorBoundary>
                    <BatchUpload userToken={token} onUploadSuccess={handleUploadSuccess} />
                </ErrorBoundary>

                <div className="h-px bg-slate-800" />

                <ErrorBoundary>
                    <FileList token={token} refreshTrigger={refreshKey} />
                </ErrorBoundary>
            </main>

            <main className="max-w-7xl mx-auto p-6 space-y-12">
                <BatchUpload userToken={localStorage.getItem('token')} onUploadSuccess={handleUploadSuccess} />
                <div className="h-px bg-slate-800" />
                <FileList token={localStorage.getItem('token')} refreshTrigger={refreshKey} />
            </main>
        </div>
    );
};

export default Dashboard;