import React from 'react';
import { motion } from 'framer-motion';

export default function LandingPage({ onEnter }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gradient-to-b from-slate-950 to-slate-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6 max-w-2xl"
            >
                <span className="text-tesla-red uppercase tracking-[0.2em] text-sm font-bold">Weekly Event</span>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
                    Open Mic <span className="text-slate-500">Night</span>
                </h1>

                <div className="h-px w-24 bg-tesla-red mx-auto my-8" />

                <p className="text-lg text-slate-300 leading-relaxed max-w-lg mx-auto">
                    Every Wednesday at <span className="text-white font-semibold">The Underground</span>.
                    Join us for a night of music, comedy, and poetry.
                </p>

                <div className="grid grid-cols-2 gap-4 text-left text-sm text-slate-400 bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur-sm">
                    <div>
                        <p className="uppercase tracking-wider text-xs mb-1 text-slate-500">Host</p>
                        <p className="text-white">Alex "The Mic" Morgan</p>
                    </div>
                    <div>
                        <p className="uppercase tracking-wider text-xs mb-1 text-slate-500">Time</p>
                        <p className="text-white">8:00 PM - 11:00 PM</p>
                    </div>
                    <div>
                        <p className="uppercase tracking-wider text-xs mb-1 text-slate-500">Location</p>
                        <p className="text-white">123 Main St, State College</p>
                    </div>
                    <div>
                        <p className="uppercase tracking-wider text-xs mb-1 text-slate-500">Equipment</p>
                        <p className="text-white">2 Mics, PA, Guitar Amp</p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onEnter}
                    className="bg-white text-slate-900 px-8 py-4 rounded font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors mt-8 w-full md:w-auto"
                >
                    Sign Up / View Schedule
                </motion.button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-6 text-xs text-slate-600 uppercase tracking-widest"
            >
                Free Parking behind the venue
            </motion.div>
        </div>
    );
}
