import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserPlus, FaRocket } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            // Call the Register API directly
            await axios.post('http://localhost:5000/api/auth/register', formData);
            // On success, go to login
            navigate('/login');
        } catch (err) {
            // 👇 Fix: Read the 'error' field, not 'message'
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">

                <div className="text-center mb-8">
                    <FaRocket className="text-cyan-400 text-4xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white">Join Aether Cloud</h2>
                    <p className="text-slate-400">Create your account to start uploading.</p>
                </div>

                {error && <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-center text-sm border border-red-500/20">{error}</div>}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 text-sm font-bold mb-2">Full Name</label>
                        <input
                            type="text" name="name" value={name} onChange={onChange} required
                            className="w-full p-3 bg-slate-900 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-500"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-bold mb-2">Email Address</label>
                        <input
                            type="email" name="email" value={email} onChange={onChange} required
                            className="w-full p-3 bg-slate-900 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-500"
                            placeholder="user@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password" name="password" value={password} onChange={onChange} required
                            className="w-full p-3 bg-slate-900 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded transition-all">
                        Register Account
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-400 text-sm">
                    Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;