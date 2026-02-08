import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaImage, FaSearch } from 'react-icons/fa';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { useMessages } from '../hooks/useMessages';

const MOCK_GIFS = [
    // "https://giphy.com/gifs/tophermcgee3-thumbs-up-1P8E2CLWXqpOXyzCSd",
    // "https://media.giphy.com/media/3o7TKr3nzbh5WgCFxe/giphy.gif",
    // "https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif",
    // "https://media.giphy.com/media/l2Je66zG6mAAZxgqI/giphy.gif",
    // "https://media.giphy.com/media/3o6ZxpCmFhR8Gk7U7C/giphy.gif"
    "src/assets/anger.gif",
    "src/assets/bravo.gif",
    "src/assets/insult.gif",
    "src/assets/surprise.gif",
    "src/assets/thumbs-up.gif",
    "src/assets/excited.gif"
];

export default function MessageBoard() {
    const { messages, sendMessage } = useMessages();
    const [inputText, setInputText] = useState('');
    const [showGifPicker, setShowGifPicker] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        sendMessage(inputText, 'text');
        setInputText('');
    };

    const handleGifSend = (url) => {
        sendMessage(url, 'gif');
        setShowGifPicker(false);
    };

    return (
        <div className="bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-md flex flex-col h-[600px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-20" />

            <div className="p-4 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-slate-200">Live Stage Chat</h2>
                <p className="text-xs text-slate-500">Public message board</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-start"
                    >
                        <div className={cn(
                            "max-w-[85%] rounded-2xl p-3 text-sm shadow-lg",
                            msg.type === 'text' ? "bg-slate-800 text-slate-200" : "bg-transparent p-0 overflow-hidden"
                        )}>
                            {msg.type === 'text' ? (
                                <p>{msg.text}</p>
                            ) : (
                                <img src={msg.text} alt="gif" className="rounded-xl w-48 h-auto object-cover" />
                            )}
                        </div>
                        <span className="text-[10px] text-slate-600 mt-1 ml-2">
                            {format(new Date(msg.timestamp), 'h:mm aa')}
                        </span>
                    </motion.div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm">
                {showGifPicker && (
                    <div className="absolute bottom-20 left-4 right-4 bg-slate-800 rounded-xl border border-slate-700 shadow-xl p-2 z-10">
                        <div className="grid grid-cols-3 gap-2">
                            {MOCK_GIFS.map((gif, i) => (
                                <button key={i} onClick={() => handleGifSend(gif)} className="hover:opacity-80 transition-opacity">
                                    <img src={gif} alt="gif" className="w-full h-20 object-cover rounded-lg" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowGifPicker(!showGifPicker)}
                        className={cn(
                            "p-3 rounded-lg transition-colors",
                            showGifPicker ? "bg-slate-700 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                        )}
                    >
                        <FaImage />
                    </button>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Say something..."
                        className="flex-1 bg-slate-800 border-none rounded-lg px-4 text-white focus:ring-1 focus:ring-slate-600 placeholder:text-slate-600"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className="p-3 bg-tesla-red rounded-lg text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    );
}
