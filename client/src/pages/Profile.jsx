import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { uploadFiles } from '../api/files'; // Reuse your upload logic!
import { FaUserCircle, FaCamera, FaSave, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, token, updateUser } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || '');
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }

    // Hidden file input ref
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // 1. Handle Avatar Upload
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create FormData for the existing upload API
        const formData = new FormData();
        formData.append('files', file);

        try {
            setIsUploading(true);
            setMessage({ type: 'info', text: 'Uploading image...' });

            // A. Upload to Cloud Storage
            const res = await uploadFiles(formData, token);
            const uploadedFileId = res.files[0].gridFsId; // Get the ID

            // B. Link ID to User Profile
            const updateRes = await updateUser(name, uploadedFileId);

            if (updateRes.success) {
                setMessage({ type: 'success', text: 'Avatar updated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile.' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Upload failed.' });
        } finally {
            setIsUploading(false);
        }
    };

    // 2. Handle Name Save
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const res = await updateUser(name, user.avatar);
        if (res.success) {
            setMessage({ type: 'success', text: 'Profile saved!' });
            setTimeout(() => navigate('/'), 1500); // Go back to dashboard
        } else {
            setMessage({ type: 'error', text: res.error });
        }
    };

    // Helper: Build Avatar URL
    const avatarUrl = user?.avatar
        ? `http://localhost:5000/api/files/${user.avatar}` // Use the file ID
        : null;

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
            <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700 relative">

                {/* Back Button */}
                <Link to="/" className="absolute top-6 left-6 text-slate-400 hover:text-white transition">
                    <FaArrowLeft /> Back
                </Link>

                <div className="text-center mt-6">
                    <h2 className="text-2xl font-bold">Edit Profile</h2>
                    <p className="text-slate-400 text-sm">Customize your Operator identity</p>
                </div>

                {/* Avatar Section */}
                <div className="flex flex-col items-center mt-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700 shadow-xl bg-slate-900">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <FaUserCircle className="w-full h-full text-slate-600" />
                            )}
                        </div>

                        {/* Hover Overlay with Camera Icon */}
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all"
                        >
                            <FaCamera className="text-white text-2xl" />
                        </div>
                    </div>

                    {/* Hidden Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        className="hidden"
                        accept="image/*"
                    />

                    <p className="mt-2 text-xs text-slate-500">Click image to change</p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSaveProfile} className="mt-8 space-y-6">
                    <div>
                        <label className="block text-slate-300 text-sm font-bold mb-2">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 bg-slate-900 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded text-sm text-center ${message.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isUploading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded transition-all disabled:opacity-50"
                    >
                        {isUploading ? 'Uploading...' : <><FaSave /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;