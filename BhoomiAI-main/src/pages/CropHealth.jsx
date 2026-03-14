import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CloudArrowUpIcon,
    BeakerIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const CropHealth = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    // State
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle File Selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
            setError("");
        }
    };

    // Call Backend API
    const detectDisease = async () => {
        if (!image) {
            setError("Please select an image first");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        const formData = new FormData();
        formData.append("image", image);

        try {
            // Using updated port 5000 as per updated app.py
            const response = await fetch("https://bhoomi-backend-7hlj.onrender.com/detect", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                setError(data.error || "Failed to analyze crop.");
            }

        } catch (err) {
            console.error("Fetch error:", err);
            setError("Could not connect to the detection server. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    // Reset Function
    const resetAnalysis = () => {
        setImage(null);
        setPreview(null);
        setResult(null);
        setError("");
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <BeakerIcon className="w-8 h-8 text-green-500" />
                        {t('cropHealth') || "Crop Health Analysis"}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        AI-powered disease detection for better yield protection.
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 h-full">

                {/* Left Panel: Upload */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/50 dark:border-white/10 shadow-xl flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden group">

                        {!preview ? (
                            <>
                                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                                    <CloudArrowUpIcon className="w-12 h-12" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                    Upload Crop Image
                                </h3>
                                <p className="text-gray-500 text-sm max-w-xs mb-8">
                                    Select a clear photo of the affected leaf or plant part for diagnosis.
                                </p>
                                <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-600/30 transition-all active:scale-95">
                                    Browse Files
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </>
                        ) : (
                            <div className="relative w-full h-full flex flex-col items-center justify-center">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-h-[300px] w-auto rounded-2xl shadow-md mb-6 object-contain"
                                />
                                <div className="flex gap-4">
                                    <button
                                        onClick={resetAnalysis}
                                        className="px-6 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Retake
                                    </button>
                                    <button
                                        onClick={detectDisease}
                                        disabled={loading}
                                        className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <BeakerIcon className="w-5 h-5" />}
                                        {loading ? "Analyzing..." : "Analyze Disease"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute bottom-4 left-4 right-4 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 p-4 rounded-xl text-sm font-medium flex items-center gap-2"
                                >
                                    <XCircleIcon className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Panel: Results */}
                <div className="w-full lg:w-1/2">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/50 dark:border-white/10 shadow-xl overflow-y-auto"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Analysis Complete</h2>
                                </div>

                                <div className="bg-white dark:bg-black/20 rounded-2xl p-6 mb-6 border border-gray-100 dark:border-white/5">
                                    <div className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Detected Issue</div>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {result.disease}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 transition-all duration-1000"
                                                style={{ width: `${result.confidence * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-green-600">
                                            {(result.confidence * 100).toFixed(1)}% Confidence
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recommended Actions</h3>
                                <ul className="space-y-3">
                                    {result.recommendations && result.recommendations.map((rec, idx) => (
                                        <motion.li
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-start gap-3 bg-white/50 dark:bg-white/5 p-4 rounded-xl"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-xs font-bold text-green-600 dark:text-green-400">{idx + 1}</span>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                                        </motion.li>
                                    ))}
                                </ul>

                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
                                    <p className="text-sm text-gray-500">
                                        *AI analysis is advisory only. Please consult an agronomist for critical decisions.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-3xl"
                            >
                                <BeakerIcon className="w-16 h-16 mb-4 opacity-20" />
                                <h3 className="text-xl font-bold text-gray-500 mb-2">No Analysis Yet</h3>
                                <p className="text-sm max-w-xs mx-auto">
                                    Upload an image and run the analysis to see disease detection results and recommendations.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CropHealth;

