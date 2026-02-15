import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, setDoc, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const generateSlots = () => {
    const slots = [];
    let startTime = new Date();
    startTime.setHours(20, 0, 0, 0); // 8:00 PM

    for (let i = 0; i < 12; i++) {
        slots.push({
            id: `slot-${i}`,
            time: format(startTime, 'h:mm aa'),
            rawTime: new Date(startTime).toISOString(),
            performer: null,
        });
        startTime.setMinutes(startTime.getMinutes() + 15);
    }
    return slots;
};

export function useSlots() {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize with default slots immediately to avoid slow loading
        const defaults = generateSlots();

        if (!db) {
            // Local Storage Fallback
            const stored = localStorage.getItem('openmic_slots');
            if (stored) {
                setSlots(JSON.parse(stored));
            } else {
                setSlots(defaults);
                localStorage.setItem('openmic_slots', JSON.stringify(defaults));
            }
            setLoading(false);
            return;
        }

        // Set defaults immediately for fast initial render
        setSlots(defaults);
        setLoading(false);

        // Firebase - Subscribe to real-time updates
        const slotsRef = collection(db, 'slots');

        const unsubscribe = onSnapshot(slotsRef, async (snapshot) => {
            if (snapshot.empty) {
                // Seed if empty (only happens once)
                try {
                    for (const slot of defaults) {
                        await setDoc(doc(db, 'slots', slot.id), slot);
                    }
                } catch (error) {
                    console.error("Failed to seed slots:", error);
                }
                return;
            }

            const data = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

            setSlots(data);
        }, (error) => {
            console.error("Firestore error:", error);
            toast.error("Live data connection failed. Using offline mode.");
        });

        return () => unsubscribe();
    }, []);

    const updateSlot = async (id, data) => {
        if (!db) {
            const newSlots = slots.map(s => s.id === id ? { ...s, ...data } : s);
            setSlots(newSlots);
            localStorage.setItem('openmic_slots', JSON.stringify(newSlots));
            return;
        }

        const slotRef = doc(db, 'slots', id);
        try {
            await updateDoc(slotRef, data);
        } catch (err) {
            console.error("Update failed", err);
            toast.error("Failed to update slot");
            throw err;
        }
    };

    return { slots, loading, updateSlot };
}
