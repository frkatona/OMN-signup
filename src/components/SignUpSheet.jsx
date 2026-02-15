import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTimes, FaMicrophoneAlt } from 'react-icons/fa';
import { cn } from '../lib/utils';

export default function SignUpSheet({ slots, updateSlot }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [performerName, setPerformerName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [actionType, setActionType] = useState('add');
    const [isUpdating, setIsUpdating] = useState(false);

    const closeModal = () => {
        setModalOpen(false);
        setSelectedSlot(null);
        setPerformerName('');
        setContactInfo('');
        setIsUpdating(false);
    };

    const handleSlotClick = (slot, e) => {
        if (e) e.stopPropagation();
        setSelectedSlot(slot);
        if (slot.performer) {
            setActionType('remove');
            setPerformerName(slot.performer);
            setContactInfo(slot.contact || '');
        } else {
            setActionType('add');
            setPerformerName('');
            setContactInfo('');
        }
        setModalOpen(true);
    };

    const confirmAction = async (e) => {
        if (e) e.stopPropagation();
        if (isUpdating || !selectedSlot) return;

        if (actionType === 'add') {
            if (!performerName.trim()) {
                toast.error('Please enter a name');
                return;
            }

            // Duplicate check
            const isDuplicate = slots.some(s => s.performer && s.performer.toLowerCase() === performerName.trim().toLowerCase());
            if (isDuplicate) {
                if (!window.confirm(`"${performerName}" is already on the list. Are you sure you want to add another slot?`)) {
                    return;
                }
            }

            setIsUpdating(true);
            setModalOpen(false); // Optimistically close

            try {
                await updateSlot(selectedSlot.id, {
                    performer: performerName.trim(),
                    contact: contactInfo.trim()
                });
                toast.success('Slot reserved!');
                setSelectedSlot(null);
                setPerformerName('');
                setContactInfo('');
            } catch (error) {
                console.error('Failed to reserve slot:', error);
                toast.error('Failed to reserve slot. Please try again.');
                setModalOpen(true); // Re-open on error
            } finally {
                setIsUpdating(false);
            }
        } else {
            if (!window.confirm(`Are you sure you want to cancel the slot for ${selectedSlot.performer}?`)) {
                return;
            }
            setIsUpdating(true);
            setModalOpen(false); // Optimistically close

            try {
                await updateSlot(selectedSlot.id, { performer: null, contact: null });
                toast.success('Slot cleared');
                setSelectedSlot(null);
            } catch (error) {
                console.error('Failed to clear slot:', error);
                toast.error('Failed to clear slot.');
                setModalOpen(true); // Re-open on error
            } finally {
                setIsUpdating(false);
            }
        }
    };

    return (
        <div className="bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-md p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tesla-red to-transparent opacity-50" />

            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-100">
                <FaMicrophoneAlt className="text-tesla-red" />
                <span>Performance Schedule</span>
            </h2>

            <div className="space-y-3">
                {slots.map((slot, index) => (
                    <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={(e) => handleSlotClick(slot, e)}
                        className={cn(
                            "group relative flex items-center justify-between p-4 rounded-lg border transition-all duration-300",
                            slot.performer
                                ? "bg-slate-800/80 border-slate-700 hover:border-slate-600"
                                : "bg-transparent border-slate-800 hover:border-slate-600 hover:bg-white/5 cursor-pointer"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <span className={cn(
                                "text-sm font-mono tracking-wider",
                                slot.performer ? "text-slate-500" : "text-tesla-red font-bold"
                            )}>
                                {slot.time}
                            </span>
                            <span className={cn(
                                "text-lg font-medium",
                                slot.performer ? "text-white" : "text-slate-600 group-hover:text-slate-400"
                            )}>
                                {slot.performer || "Open Slot"}
                            </span>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            {slot.performer ? (
                                <button
                                    onClick={(e) => handleSlotClick(slot, e)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => handleSlotClick(slot, e)}
                                    className="p-2 text-tesla-red hover:text-white transition-colors"
                                >
                                    <FaPlus />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white"
                        >
                            <FaTimes />
                        </button>
                        <h3 className="text-2xl font-bold mb-4 text-white">
                            {actionType === 'add' ? 'Reserve Slot' : 'Cancel Slot'}
                        </h3>

                        <div className="mb-6">
                            <p className="text-tesla-red text-sm font-bold uppercase tracking-widest mb-2">Time</p>
                            <p className="text-3xl text-white font-mono">{selectedSlot?.time}</p>
                        </div>

                        {actionType === 'add' && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-slate-400 text-sm mb-2">Performer Name</label>
                                    <input
                                        type="text"
                                        value={performerName}
                                        onChange={(e) => setPerformerName(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded p-4 text-white focus:outline-none focus:border-tesla-red transition-colors"
                                        placeholder="Enter stage name..."
                                        autoFocus
                                    />
                                    {slots.some(s => s.performer && s.performer.toLowerCase() === performerName.toLowerCase() && performerName.trim() !== '') && (
                                        <p className="mt-2 text-yellow-500 text-xs">
                                            Note: This name is already registered for another slot.
                                        </p>
                                    )}
                                </div>
                                <div className="mb-6">
                                    <label className="block text-slate-400 text-sm mb-2">
                                        Contact Info <span className="text-xs text-slate-600">(Optional for reminders)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={contactInfo}
                                        onChange={(e) => setContactInfo(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded p-4 text-white focus:outline-none focus:border-tesla-red transition-colors"
                                        placeholder="Phone or Email..."
                                    />
                                </div>
                            </>
                        )}

                        {actionType === 'remove' && (
                            <p className="mb-6 text-slate-300">
                                Are you sure you want to remove <span className="text-white font-bold">{selectedSlot?.performer}</span> from this slot?
                            </p>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => !isUpdating && setModalOpen(false)}
                                disabled={isUpdating}
                                className="flex-1 py-3 rounded border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors uppercase tracking-wider text-sm font-semibold disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAction}
                                disabled={isUpdating}
                                className={cn(
                                    "flex-1 py-3 rounded text-white uppercase tracking-wider text-sm font-semibold transition-colors flex items-center justify-center gap-2",
                                    actionType === 'add' ? "bg-tesla-red hover:bg-red-700" : "bg-red-900/50 text-red-200 border border-red-900 hover:bg-red-900",
                                    isUpdating && "opacity-70 cursor-not-allowed"
                                )}
                            >
                                {isUpdating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    actionType === 'add' ? 'Confirm' : 'Remove'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
