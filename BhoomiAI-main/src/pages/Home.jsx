import React from 'react';
import Hero from '../components/Hero';
import FeatureGrid from '../components/FeatureGrid';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
    const { t } = useLanguage();
    return (
        <div className="pb-20 relative">
            <Link to="/digital-twin" state={{ open3d: true }} className="absolute top-4 right-4 z-40 hidden md:block">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                    </svg>
                    {t('watch3D')}
                </button>
            </Link>
            <Hero />
            <FeatureGrid />

            {/* Bottom CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-16 mx-auto max-w-4xl p-12 rounded-3xl bg-farm-green-dark/5 dark:bg-farm-green-light/10 border border-green-100 dark:border-green-800 text-center relative overflow-hidden"
            >
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{t('readyToTransform')}</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                        {t('joinFarmers')}
                    </p>
                    <Link to="/digital-twin">
                        <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2 mx-auto">
                            <SparklesIcon className="w-5 h-5" /> {t('tryDigitalTwin')}
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
