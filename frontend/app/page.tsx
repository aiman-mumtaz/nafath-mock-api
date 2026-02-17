'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, Smartphone, CheckCircle2, XCircle, ChevronRight, AlertCircle } from 'lucide-react';

export default function NafathLoginPage() {
  const [nationalId, setNationalId] = useState('');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [randomCode, setRandomCode] = useState<number | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'WAITING' | 'COMPLETED' | 'EXPIRED' | 'REJECTED'>('IDLE');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_BASE = "http://localhost:8080/nafath/api/v1";

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const res = await fetch(`${API_BASE}/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to initiate request");
      }

      const data = await res.json();
      setRequestId(data.id);
      setRandomCode(data.randomCode);
      setStatus('WAITING');
    } catch (err: any) {
      setErrorMessage(err.message || "Connection failed. Is Spring Boot running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== 'WAITING' || !requestId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/status/${requestId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status !== 'PENDING') {
            setStatus(data.status);
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [status, requestId]);

  const simulateAction = async (newStatus: string) => {
    try {
      await fetch(`${API_BASE}/mock-callback/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Simulation failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="bg-[#00a651] p-8 text-center text-white">
          <ShieldCheck className="w-12 h-12 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Nafath SSO</h1>
          <p className="text-emerald-100 text-sm">National Single Sign-On</p>
        </div>

        <div className="p-8">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          {status === 'IDLE' && (
            <form onSubmit={handleInitiate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">National ID / Iqama</label>
                <input
                  required
                  type="text"
                  maxLength={10}
                  className="w-full px-4 py-4 border-2 border-gray-100 rounded-xl focus:border-[#00a651] outline-none transition-all text-lg"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="e.g. 1023456789"
                />
              </div>
              <button 
                disabled={loading}
                className="w-full bg-[#00a651] hover:bg-[#008c44] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                {!loading && <ChevronRight size={20} />}
              </button>
            </form>
          )}

          {status === 'WAITING' && (
            <div className="text-center space-y-6">
              <div className="relative flex justify-center">
                <Smartphone className="w-20 h-20 text-gray-100" />
                <Loader2 className="absolute top-7 w-8 h-8 text-[#00a651] animate-spin" />
              </div>
              <div>
                <p className="text-gray-500 font-medium">Open Nafath App and select:</p>
                <div className="text-7xl font-black text-[#00a651] my-4">{randomCode}</div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-wider">
                  Waiting for Biometric
                </span>
              </div>
            </div>
          )}

          {status === 'COMPLETED' && (
            <div className="text-center py-6">
              <CheckCircle2 className="w-20 h-20 text-[#00a651] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">Verified!</h2>
              <p className="text-gray-500">Welcome to your dashboard.</p>
              <button onClick={() => window.location.reload()} className="mt-6 text-[#00a651] font-bold underline">Logout</button>
            </div>
          )}

          {status === 'REJECTED' && (
            <div className="text-center py-6">
              <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">Rejected</h2>
              <p className="text-gray-500">The request was denied on the device.</p>
              <button onClick={() => setStatus('IDLE')} className="mt-6 text-gray-500 underline">Try Again</button>
            </div>
          )}
        </div>
      </div>

      {status === 'WAITING' && (
        <div className="mt-8 bg-slate-900 text-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Mobile App Simulator</p>
          <div className="flex gap-4">
            <button onClick={() => simulateAction('COMPLETED')} className="flex-1 bg-emerald-600 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-colors">Approve</button>
            <button onClick={() => simulateAction('REJECTED')} className="flex-1 bg-rose-600 py-3 rounded-xl font-bold hover:bg-rose-500 transition-colors">Reject</button>
          </div>
        </div>
      )}
    </div>
  );
}