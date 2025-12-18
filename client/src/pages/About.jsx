import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaShieldAlt, FaBolt, FaGlobe } from 'react-icons/fa';

const About = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500 selection:text-black flex flex-col">

            {/* Navbar */}
            <nav className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <FaRocket className="text-cyan-400 text-3xl" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        AETHER CLOUD
                    </h1>
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="px-4 py-2 text-slate-300 hover:text-white transition">Login</Link>
                    <Link to="/register" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold transition">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow flex flex-col items-center justify-center text-center p-8 mt-10">
                <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                    Your Data. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Elevated.</span>
                </h2>
                <p className="text-slate-400 text-xl max-w-2xl mb-10 leading-relaxed">
                    The next generation of cloud storage is here. Secure, fast, and built for the modern web.
                    Experience the Aether difference today.
                </p>

                <div className="flex gap-6">
                    <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg text-lg font-bold shadow-lg shadow-cyan-500/30 transition-all transform hover:scale-105">
                        Start Uploading
                    </Link>
                    <Link to="/login" className="px-8 py-4 border border-slate-600 hover:border-slate-400 rounded-lg text-lg font-semibold transition-colors">
                        Access Account
                    </Link>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full">
                    <FeatureCard
                        icon={<FaShieldAlt />}
                        title="Military-Grade Security"
                        desc="Your files are encrypted and protected by advanced authentication protocols."
                    />
                    <FeatureCard
                        icon={<FaBolt />}
                        title="Lightning Fast"
                        desc="Powered by Node.js streams for instant uploads and zero-latency downloads."
                    />
                    <FeatureCard
                        icon={<FaGlobe />}
                        title="Access Anywhere"
                        desc="Your gallery travels with you. Access your data from any device, anytime."
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="p-8 text-center text-slate-500 text-sm border-t border-slate-800 mt-20">
                &copy; {new Date().getFullYear()} Aether Cloud Technologies. Built by Mr. Cherkaoui.
            </footer>
        </div>
    );
};

// Helper Component for Features
const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all hover:-translate-y-2">
        <div className="text-cyan-400 text-4xl mb-4 flex justify-center">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400">{desc}</p>
    </div>
);

export default About;