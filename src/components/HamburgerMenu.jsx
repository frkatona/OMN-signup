import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaHistory, FaInfoCircle, FaEnvelope } from 'react-icons/fa';

export default function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-slate-300 hover:text-white transition-colors"
            >
                <FaBars size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 20 }}
                            className="fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                                <span className="text-lg font-bold text-tesla-red uppercase tracking-widest">Menu</span>
                                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <div className="space-y-2 flex-1">
                                <button className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-slate-800 transition-colors text-left text-slate-300 hover:text-white group">
                                    <FaHistory className="group-hover:text-tesla-red transition-colors" />
                                    <span>Previous Weeks</span>
                                </button>
                                <button className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-slate-800 transition-colors text-left text-slate-300 hover:text-white group">
                                    <FaInfoCircle className="group-hover:text-tesla-red transition-colors" />
                                    <span>Venue Info / Rules</span>
                                </button>
                                <button className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-slate-800 transition-colors text-left text-slate-300 hover:text-white group">
                                    <FaEnvelope className="group-hover:text-tesla-red transition-colors" />
                                    <span>Contact Host</span>
                                </button>
                            </div>

                            <div className="mt-auto pt-6 border-t border-slate-800 text-xs text-slate-500 text-center">
                                <p>Open Mic Manager v1.0</p>
                                <p>&copy; 2026</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
