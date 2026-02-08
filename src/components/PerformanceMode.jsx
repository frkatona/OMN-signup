import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInSeconds, addMinutes, isWithinInterval, parse } from 'date-fns';
import { FaTimes, FaClock } from 'react-icons/fa';
import { cn } from '../lib/utils';

export default function PerformanceMode({ slots, onClose }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentSlot, setCurrentSlot] = useState(null);
    const [nextSlot, setNextSlot] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);

            // Find current slot
            // Logic assumes slots are sequential and 15 mins long.
            // We parse the time string back to a date for comparison or use rawTime if available
            // In App.jsx, I added rawTime to the slot object.

            const foundSlot = slots.find(slot => {
                const start = new Date(slot.rawTime);
                // Make sure the date part matches 'now' (handle recurring weekly issue by just using time)
                start.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());

                const end = addMinutes(start, 15);
                return isWithinInterval(now, { start, end });
            });

            setCurrentSlot(foundSlot);

            if (foundSlot) {
                const start = new Date(foundSlot.rawTime);
                start.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
                const end = addMinutes(start, 15);
                const diff = differenceInSeconds(end, now);
                setTimeLeft(diff);

                // Find next slot
                const index = slots.findIndex(s => s.id === foundSlot.id);
                if (index >= 0 && index < slots.length - 1) {
                    setNextSlot(slots[index + 1]);
                } else {
                    setNextSlot(null);
                }
            } else {
                setTimeLeft(null);
                setNextSlot(null);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [slots]);

    const formatTimeLeft = (seconds) => {
        if (seconds === null || seconds < 0) return "--:--";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-8"
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-4 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800"
            >
                <FaTimes size={24} />
            </button>

            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Col: Clock & Timer */}
                <div className="flex flex-col items-center lg:items-start space-y-12">
                    <div className="bg-slate-900/50 p-12 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-sm w-full text-center lg:text-left">
                        <span className="text-slate-500 uppercase tracking-widest font-semibold text-lg flex items-center gap-2 mb-4 justify-center lg:justify-start">
                            <FaClock /> Current Time
                        </span>
                        <h1 className="text-8xl md:text-9xl font-mono font-bold tracking-tighter text-white tabular-nums">
                            {format(currentTime, 'h:mm')}
                            <span className="text-4xl text-slate-500 ml-4">{format(currentTime, 'ss')}</span>
                        </h1>
                    </div>

                    {currentSlot && (
                        <div className={cn(
                            "w-full p-12 rounded-3xl border shadow-2xl transition-all duration-500",
                            timeLeft < 60 ? "bg-red-900/20 border-red-500/50 animate-pulse" : "bg-slate-900/30 border-slate-800"
                        )}>
                            <span className={cn(
                                "uppercase tracking-widest font-semibold text-lg mb-4 block",
                                timeLeft < 60 ? "text-red-500" : "text-tesla-red"
                            )}>
                                Time Remaining
                            </span>
                            <h2 className={cn(
                                "text-7xl md:text-9xl font-mono font-bold tracking-tighter tabular-nums",
                                timeLeft < 60 ? "text-red-500" : "text-white"
                            )}>
                                {formatTimeLeft(timeLeft)}
                            </h2>
                        </div>
                    )}
                </div>

                {/* Right Col: Slot Info */}
                <div className="space-y-8">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-tesla-red to-purple-600 rounded-2xl blur opacity-20"></div>
                        <div className="relative bg-slate-900 p-10 rounded-2xl border border-slate-700 shadow-xl">
                            <span className="text-slate-400 uppercase tracking-widest text-sm font-bold mb-2 block">
                                Now Performing
                            </span>
                            <h3 className="text-5xl md:text-6xl font-bold text-white mb-2 leading-tight">
                                {currentSlot?.performer || "Open Stage"}
                            </h3>
                            <p className="text-xl text-slate-500 font-mono mt-4">
                                {currentSlot ? `${currentSlot.time} Slot` : "Waiting for next slot..."}
                            </p>
                        </div>
                    </div>

                    {nextSlot && (
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 opacity-60">
                            <span className="text-slate-500 uppercase tracking-widest text-xs font-bold mb-2 block">
                                Up Next
                            </span>
                            <h4 className="text-3xl font-bold text-slate-300">
                                {nextSlot.performer || "Open Slot"}
                            </h4>
                            <p className="text-sm text-slate-600 font-mono mt-2">
                                {nextSlot.time}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
