import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import FloatingAssistant from './AiAssistant/FloatingAssistant';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-grow pt-24 px-4 sm:px-6lg:px-8 max-w-7xl mx-auto w-full"
            >
                {children}
            </motion.main>
            <FloatingAssistant />
            <footer className="mt-auto py-8 text-center text-gray-500 text-sm">
                © 2024 BhoomiAI. Empowering farmers with AI.
            </footer>
        </div>
    );
};

export default Layout;
