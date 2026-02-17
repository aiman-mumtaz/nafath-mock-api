'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, Smartphone, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

export default function NafathLoginPage() {
  const [nationalId, setNationalId] = useState('');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [randomCode, setRandomCode] = useState<number | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'WAITING' | 'COMPLETED' | 'EXPIRED' | 'REJECTED'>('IDLE');
  const [loading, setLoading] = useState(false);


  const API_BASE = "http://localhost:8080/api/v1/nafath";

  // 1. Start the Nafath Request
  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId }),
      });
      const data = await res.json();
      setRequestId(data.id);
      setRandomCode(data.randomCode);
      setStatus('WAITING');
    } catch (err) {
      alert("Backend is offline. Make sure Spring Boot is running on port 8080!");
    } finally {
      setLoading(false);
    }
  };

  // 2. Polling Logic: Check status every 2 seconds
  useEffect(() => {
    if (status !== 'WAITING' || !requestId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/status/${requestId}`);
        const data = await res.json();
        if (data.status !== 'PENDING') {
          setStatus(data.status);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [status, requestId]);

  // 3. Mock Simulator (Helper for Testing)
  const simulateAction = async (newStatus: string) => {
    await fetch(`${API_BASE}/mock-callback/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center p-4 font-sans">
      {/* Main Container */}
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl overflow-hidden">
        
        {/* Header - Brand Colors */}
        <div className="bg-[#00a651] p-8 text-center text-white">
          <ShieldCheck className="w-12 h-12 mx-auto mb-2 opacity-90" />
          <h1 className="text-2xl font-bold tracking-tight">Nafath SSO</h1>
          <p className="text-emerald-100 text-sm">National Single Sign-On</p>
        </div>

        <div className="p-8">
          {status === 'IDLE' && (
            <form onSubmit={handleInitiate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">National ID / Iqama</label>
                <input
                  required
                  type="text"
                  maxLength={10}
                  placeholder="1XXXXXXXXX"
                  className="w-full px-4 py-4 border-2 border-gray-100 rounded-xl focus:border-[#00a651] focus:ring-0 transition-all text-lg"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                />
              </div>
              <button 
                disabled={loading}
                className="w-full bg-[#00a651] hover:bg-[#008c44] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Login"}
                {!loading && <ChevronRight size={20} />}
              </button>
            </form>
          )}

          {status === 'WAITING' && (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-center">
                <div className="relative">
                  <Smartphone className="w-20 h-20 text-gray-200" />
                  <div className="absolute inset-0 flex items-center justify-center pt-2">
                    <Loader2 className="w-8 h-8 text-[#00a651] animate-spin" />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Open Nafath App and select number:</p>
                <div className="text-7xl font-black text-[#00a651] mt-2 mb-4 drop-shadow-sm">
                  {randomCode}
                </div>
                <div className="bg-emerald-50 text-emerald-700 text-xs font-bold py-1 px-3 rounded-full inline-block">
                  AWAITING BIOMETRIC APPPROVAL
                </div>
              </div>
            </div>
          )}

          {status === 'COMPLETED' && (
            <div className="text-center py-6 animate-in bounce-in duration-500">
              <CheckCircle2 className="w-20 h-20 text-[#00a651] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">Verification Successful</h2>
              <p className="text-gray-500">You are now securely logged in.</p>
              <button onClick={() => window.location.reload()} className="mt-6 text-sm text-[#00a651] font-bold">Start Over</button>
            </div>
          )}

          {status === 'REJECTED' && (
            <div className="text-center py-6">
              <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">Request Rejected</h2>
              <p className="text-gray-500">The login was denied from the app.</p>
              <button onClick={() => setStatus('IDLE')} className="mt-6 text-sm text-gray-500 underline">Try Again</button>
            </div>
          )}
        </div>
      </div>

      {/* Simulator Tools - ONLY FOR TESTING */}
      {status === 'WAITING' && (
        <div className="mt-8 bg-gray-800 text-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Dev Simulator: Simulate Nafath Mobile App</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => simulateAction('COMPLETED')}
              className="bg-emerald-600 hover:bg-emerald-500 py-2 rounded-lg font-bold text-sm"
            >
              ✅ Approve Request
            </button>
            <button 
              onClick={() => simulateAction('REJECTED')}
              className="bg-red-600 hover:bg-red-500 py-2 rounded-lg font-bold text-sm"
            >
              ❌ Reject Request
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mt-4 text-center italic">
            Normally, these actions would happen inside the user's mobile app.
          </p>
        </div>
      )}
    </div>
  );
}
