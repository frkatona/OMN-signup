import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, orderBy, query, limit, serverTimestamp } from 'firebase/firestore';

export function useMessages() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!db) {
            const stored = localStorage.getItem('openmic_messages');
            if (stored) {
                // Parse dates
                const parsed = JSON.parse(stored).map(m => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                }));
                setMessages(parsed);
            } else {
                setMessages([
                    { id: 1, text: "Welcome to Open Mic Night!", type: 'text', timestamp: new Date() }
                ]);
            }
            return;
        }

        const q = query(
            collection(db, 'messages'),
            orderBy('timestamp', 'asc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
            setMessages(data);
        });

        return () => unsubscribe();
    }, []);

    const sendMessage = async (text, type = 'text') => {
        const newMessage = {
            text,
            type,
            timestamp: new Date(), // Local fallback timestamp
        };

        if (!db) {
            const updated = [...messages, { ...newMessage, id: Date.now() }];
            setMessages(updated);
            localStorage.setItem('openmic_messages', JSON.stringify(updated));
            return;
        }

        await addDoc(collection(db, 'messages'), {
            ...newMessage,
            timestamp: serverTimestamp()
        });
    };

    return { messages, sendMessage };
}
