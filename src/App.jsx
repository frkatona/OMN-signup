import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import SignUpSheet from './components/SignUpSheet';
import MessageBoard from './components/MessageBoard';
import PerformanceMode from './components/PerformanceMode';
import HamburgerMenu from './components/HamburgerMenu';
import { Toaster } from 'react-hot-toast';
import { useSlots } from './hooks/useSlots';

function App() {
  const [view, setView] = React.useState('landing'); // 'landing', 'signup', 'performance'
  const { slots, updateSlot, loading } = useSlots();

  if (loading && view !== 'landing') {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading schedule...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden selection:bg-tesla-red selection:text-white">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#334155',
          color: '#fff',
        },
      }} />

      {view === 'landing' && <LandingPage onEnter={() => setView('signup')} />}
      {view === 'signup' && (
        <div className="container mx-auto p-4 space-y-8 pb-20">
          <header className="flex justify-between items-center py-6 border-b border-slate-800">
            <h1 className="text-2xl font-bold tracking-wider uppercase text-slate-200">Open Mic Night</h1>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setView('performance')}
                className="text-slate-400 hover:text-tesla-red transition-colors text-sm uppercase tracking-widest font-semibold mr-4 hidden md:block"
              >
                Performer Mode
              </button>
              <HamburgerMenu />
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SignUpSheet slots={slots} updateSlot={updateSlot} />
            </div>
            <div className="lg:col-span-1">
              <MessageBoard />
            </div>
          </div>
        </div>
      )}

      {view === 'performance' && (
        <PerformanceMode slots={slots} onClose={() => setView('signup')} />
      )}

    </div>
  );
}

export default App;
