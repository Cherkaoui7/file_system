import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BatchUpload from '../components/BatchUpload';
import FileList from '../components/FileList';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaRocket, FaUserCircle } from 'react-icons/fa';

const Dashboard = () => {
    const { user, token: ctxToken, logout } = useContext(AuthContext);
    const token = ctxToken || localStorage.getItem('token');
    const [refreshKey, setRefreshKey] = useState(0);

    const handleUploadSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500">
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

                <div className="flex items-center gap-6">
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
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : null}
                            <FaUserCircle className="text-2xl text-slate-500 absolute -z-10" />
                        </div>
                    </Link>
                    <button onClick={logout} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                        <FaSignOutAlt />
                    </button>
                </div>
            </motion.header>

            <main className="max-w-7xl mx-auto p-6 space-y-12">
                <BatchUpload userToken={token} onUploadSuccess={handleUploadSuccess} />
                <div className="h-px bg-slate-800" />
                <FileList token={token} refreshTrigger={refreshKey} />
            </main>
        </div>
    );
};

export default Dashboard;