import React, { useState, useEffect } from 'react';
import { MicrophoneIcon, SpeakerWaveIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { useFarmStore } from '../../store/useFarmStore';
import { classifyIntent, INTENTS, getActionFeedback } from '../../utils/intentParser';

import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
    { code: 'en-US', name: 'English', label: 'EN' },
    { code: 'hi-IN', name: 'Hindi', label: 'हि' },
    { code: 'te-IN', name: 'Telugu', label: 'తె' }
];

const VoiceControl = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState('');
    const [selectedLang, setSelectedLang] = useState('en-US');
    const performAction = useFarmStore((state) => state.performAction);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setFeedback('Voice not supported.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.lang = selectedLang;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            processCommand(text);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error(event.error);
            setIsListening(false);
            setFeedback('Try again');
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        const processCommand = (text) => {
            const { intent, lang } = classifyIntent(text);

            if (intent !== INTENTS.UNKNOWN) {
                performAction(intent);
                const response = getActionFeedback(intent, lang);
                speak(response, lang);
            } else {
                setFeedback(`Unknown: "${text}"`);
                const errorText = lang === 'hi' ? "क्षमा करें, मुझे समझ नहीं आया।" :
                    lang === 'te' ? "క్షమించండి, నాకు అర్థం కాలేదు." :
                        "Sorry, I didn't verify that command.";
                speak(errorText, lang || selectedLang);
            }
        };

        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }

        return () => {
            recognition.stop();
        };
    }, [isListening, performAction, selectedLang]);

    const speak = (text, langCode = 'en-US') => {
        // Cancel existing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Map short code to full locale
        let locale = langCode;
        if (langCode === 'hi') locale = 'hi-IN';
        if (langCode === 'te') locale = 'te-IN';
        if (langCode === 'en') locale = 'en-US';

        utterance.lang = locale;

        // Explicitly finding the voice
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang === locale) || voices.find(v => v.lang.includes(locale.split('-')[0]));

        if (voice) {
            utterance.voice = voice;
        }

        window.speechSynthesis.speak(utterance);

        setFeedback(text);
        setTimeout(() => setFeedback(''), 3000);
    };

    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-4">
            <AnimatePresence>
                {(transcript || feedback) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="px-6 py-2 bg-black/80 text-white rounded-full text-sm font-medium backdrop-blur-md border border-white/10"
                    >
                        {feedback || `"${transcript}"`}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
                {/* Language Selector */}
                <div className="relative group">
                    <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <GlobeAltIcon className="w-5 h-5" />
                    </button>
                    {/* Dropdown */}
                    <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden hidden group-hover:block min-w-[100px]">
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => setSelectedLang(lang.code)}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-green-50 dark:hover:bg-green-900/30 ${selectedLang === lang.code ? 'text-green-600 font-bold' : 'text-gray-600 dark:text-gray-300'}`}
                            >
                                {lang.name}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.button
                    onClick={() => setIsListening(!isListening)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-4 rounded-full shadow-2xl transition-all ${isListening
                        ? 'bg-red-500 animate-pulse ring-4 ring-red-200'
                        : 'bg-green-600 hover:bg-green-500'
                        }`}
                >
                    {isListening ? (
                        <SpeakerWaveIcon className="w-8 h-8 text-white" />
                    ) : (
                        <MicrophoneIcon className="w-8 h-8 text-white" />
                    )}
                </motion.button>
            </div>

            {!isListening && (
                <span className="text-[10px] font-bold text-white/80 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                    {LANGUAGES.find(l => l.code === selectedLang)?.label} • Tap to Speak
                </span>
            )}
        </div>
    );
};

export default VoiceControl;
