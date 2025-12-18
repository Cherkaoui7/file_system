import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaSignInAlt } from 'react-icons/fa';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    // 👇 Use the Context we built!
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        // Call the login function from AuthContext
        const result = await login(email, password);

        if (result.success) {
            navigate('/'); // Redirect to Dashboard on success
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">

                <div className="text-center mb-8">
                    <FaSignInAlt className="text-cyan-400 text-4xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                    <p className="text-slate-400">Sign in to access your files.</p>
                </div>

                {error && <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-center text-sm border border-red-500/20">{error}</div>}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email" name="email" value={email} onChange={onChange} required
                            className="w-full p-3 bg-slate-900 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password" name="password" value={password} onChange={onChange} required
                            className="w-full p-3 bg-slate-900 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded transition-all">
                        Login
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-400 text-sm">
                    New to Aether? <Link to="/register" className="text-cyan-400 hover:text-cyan-300">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;