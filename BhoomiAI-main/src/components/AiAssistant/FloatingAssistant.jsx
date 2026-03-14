import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MicrophoneIcon, XMarkIcon, ChatBubbleLeftRightIcon, StopIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

const FloatingAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [aiReply, setAiReply] = useState("");
    const [lang, setLang] = useState("te");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const langConfig = {
        te: { code: "te-IN", label: "తె" },
        hi: { code: "hi-IN", label: "हि" },
        en: { code: "en-IN", label: "EN" }
    };

    const stopVoice = () => {
        window.speechSynthesis.cancel();
        setLoading(false);
    };

    const startAssistant = () => {
        window.speechSynthesis.cancel();
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice not supported.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = langConfig[lang].code;
        recognition.start();
        setLoading(true);
        setTranscript("Listening...");

        recognition.onresult = async (event) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);

            try {
                const response = await fetch('https://bhoomi-backend-7hlj.onrender.com/get-advice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text, lang: lang }),
                });

                const data = await response.json();
                setAiReply(data.answer);

                const utterance = new SpeechSynthesisUtterance(data.answer);
                utterance.lang = data.lang_code;
                utterance.onend = () => setLoading(false);
                window.speechSynthesis.speak(utterance);
            } catch (e) {
                setAiReply("⚠️ Err: Is backend running?");
                setLoading(false);
            }
        };

        recognition.onerror = () => {
            setLoading(false);
            setTranscript("Try again.");
        };
    };

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcript, aiReply]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-gray-900 w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden pointer-events-auto mb-4"
                    >
                        {/* Header */}
                        <div className="bg-green-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🤖</span>
                                <div>
                                    <h3 className="font-bold text-sm">Agri-Expert</h3>
                                    <p className="text-[10px] opacity-80">Online • Llama 3.2 AI</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="h-64 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800/50 flex flex-col gap-3">
                            {transcript && (
                                <div className="self-end bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-3 rounded-2xl rounded-tr-none text-sm max-w-[80%]">
                                    <p className="font-bold text-xs mb-1 opacity-50">YOU</p>
                                    {transcript}
                                </div>
                            )}

                            {aiReply && (
                                <div className="self-start bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-tl-none text-sm text-gray-700 dark:text-gray-200 shadow-sm max-w-[90%] border border-gray-100 dark:border-gray-600">
                                    <p className="font-bold text-xs mb-1 text-green-600 flex items-center gap-1">
                                        <SpeakerWaveIcon className="w-3 h-3" /> EXPERT
                                    </p>
                                    {aiReply}
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Controls */}
                        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center gap-3">
                            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                                {Object.keys(langConfig).map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLang(l)}
                                        className={`px-2 py-1 rounded-full text-xs font-bold transition-all ${lang === l ? 'bg-white dark:bg-gray-700 shadow text-green-600' : 'text-gray-400'}`}
                                    >
                                        {langConfig[l].label}
                                    </button>
                                ))}
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={loading ? stopVoice : startAssistant}
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${loading ? 'bg-red-500 animate-pulse' : 'bg-green-600 hover:bg-green-500'}`}
                            >
                                {loading ? <StopIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button (FAB) */}
            <motion.button
                layout
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-green-600 hover:bg-green-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center pointer-events-auto ring-4 ring-green-500/20"
            >
                {isOpen ? <XMarkIcon className="w-6 h-6" /> : <ChatBubbleLeftRightIcon className="w-6 h-6" />}
            </motion.button>
        </div>
    );
};

export default FloatingAssistant;

