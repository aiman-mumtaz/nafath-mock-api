"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, BrainCircuit, Smartphone, Loader2, CheckCircle2, AlertTriangle, MapPin } from 'lucide-react';

const API_BASE = "http://localhost:8080/nafath/api/v1";

export default function NafathPage() {
  // State Machine
  const [step, setStep] = useState<'IDLE' | 'SCANNING' | 'CHALLENGE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [nationalId, setNationalId] = useState('');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [randomCode, setRandomCode] = useState<number | null>(null);
  const [aiInsight, setAiInsight] = useState<{ score: number; verdict: string; reason: string } | null>(null);
  const [error, setError] = useState('');

  const handleStartAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalId.length !== 10) return setError("National ID must be 10 digits");

    setStep('SCANNING');
    setError('');

    try {
      const res = await fetch(`${API_BASE}/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStep('ERROR');
        setError(data.reason || "AI Security Block: Request rejected.");
        return;
      }

      setAiInsight(data.aiInsight);
      setRequestId(data.nafath.id);
      setRandomCode(data.nafath.randomCode);
      setTimeout(() => setStep('CHALLENGE'), 1500);
    } catch (err) {
      setStep('ERROR');
      setError("Failed to connect to Security Gateway.");
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'CHALLENGE' && requestId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/status/${requestId}`);
          const data = await res.json();
          if (data.status === 'COMPLETED') setStep('SUCCESS');
          if (data.status === 'REJECTED') {
            setStep('ERROR');
            setError("Request rejected via mobile app.");
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [step, requestId]);

  const simulateMobileAppApproval = async () => {
    if (!requestId) return;
    try {
      await fetch(`${API_BASE}/mock-callback/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });
    } catch (err) {
      console.error("Simulation failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 mb-4 border border-emerald-500/20">
            <ShieldCheck className="text-emerald-500 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Nafath Secure Access</h1>
          <p className="text-slate-500 text-sm mt-2">National Single Sign-On Simulation</p>
        </div>

        {step === 'IDLE' && (
          <form onSubmit={handleStartAuth} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase ml-1">National ID / Iqama</label>
              <input
                type="text"
                maxLength={10}
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="1XXXXXXXXX"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-lg focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
              />
            </div>
            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2">
              Sign In
            </button>
          </form>
        )}

        {step === 'SCANNING' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 text-center space-y-6">
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Risk Assessment</h3>
              <p className="text-slate-400 text-sm mt-1">Analyzing behavioral patterns & location integrity...</p>
            </div>
          </div>
        )}

        {step === 'CHALLENGE' && (
          <div className="space-y-6 animate-in zoom-in-95">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 flex gap-4 items-start">
              <BrainCircuit className="text-blue-400 shrink-0 mt-1" />
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-tighter">AI Analysis Verdict</p>
                <p className="text-sm text-blue-100/80 leading-snug mt-1">{aiInsight?.reason}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Smartphone size={120} />
              </div>
              <p className="text-slate-500 font-medium mb-2">Open the Nafath app and select</p>
              <div className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums">
                {randomCode}
              </div>
              <div className="mt-8 flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-2 px-4 rounded-full w-fit mx-auto">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-bold uppercase">Waiting for mobile approval</span>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
               <button 
                onClick={simulateMobileAppApproval}
                className="w-full flex items-center justify-between group hover:bg-slate-800 p-2 rounded-lg transition-colors"
               >
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                      <Smartphone className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">Dev Simulator</p>
                      <p className="text-[10px] text-slate-500">Trigger Mobile Approval</p>
                    </div>
                 </div>
                 <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-md">APPROVE</div>
               </button>
            </div>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="text-center space-y-6 animate-in fade-in scale-95">
            <div className="inline-flex p-6 rounded-full bg-emerald-500/20 text-emerald-500 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]">
              <CheckCircle2 size={64} />
            </div>
            <h2 className="text-3xl font-bold text-white">Verified Successfully</h2>
            <p className="text-slate-400">Welcome back. Your identity has been confirmed.</p>
            <button 
              onClick={() => setStep('IDLE')}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold transition-all"
            >
              Back to Home
            </button>
          </div>
        )}

        {step === 'ERROR' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center space-y-4">
             <AlertTriangle className="mx-auto text-red-500 w-10 h-10" />
             <p className="text-red-200 font-medium">{error}</p>
             <button onClick={() => setStep('IDLE')} className="text-sm text-red-400 font-bold underline">Try again with a different ID</button>
          </div>
        )}

      </div>
    </div>
  );
}