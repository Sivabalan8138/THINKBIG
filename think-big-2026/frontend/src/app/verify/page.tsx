'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

function VerifyForm() {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const idFromUrl = searchParams?.get('id');
    if (idFromUrl) {
      setCertId(idFromUrl);
      verifyWithId(idFromUrl);
    }
  }, [searchParams]);

  const verifyWithId = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/certificates/verify/${id}`);
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setResult({ valid: false, message: data.message || 'Invalid Certificate' });
      }
    } catch (e) {
      setResult({ valid: false, message: 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    router.replace(`/verify?id=${certId}`);
    verifyWithId(certId);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 circuit-bg text-foreground flex items-center justify-center">
      <div className="container mx-auto max-w-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="glass p-8 rounded-3xl text-center relative overflow-hidden"
        >
          <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[80px]" />
          
          <h1 className="text-3xl font-bold neon-text mb-4">Certificate Verification</h1>
          <p className="text-muted-foreground mb-8">Enter the Certificate ID found at the bottom of the certificate.</p>
          
          <form onSubmit={handleVerify} className="space-y-4">
            <input 
              type="text" 
              placeholder="e.g. CERT-A1B2C3D4" 
              value={certId}
              onChange={(e) => setCertId(e.target.value.toUpperCase())}
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-center text-xl tracking-widest font-mono uppercase focus:border-primary focus:outline-none"
              required 
            />
            <button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Authenticity'}
            </button>
          </form>

          {result && result.valid && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-green-500/10 border border-green-500/30 rounded-xl text-left">
              <div className="flex items-center gap-2 text-green-400 font-bold text-xl mb-4">
                <span>✅</span> Valid Certificate
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Student Name:</span> <span className="font-semibold">{result.studentName}</span></p>
                <p><span className="text-muted-foreground">Team Name:</span> <span className="font-semibold">{result.teamName}</span></p>
                <p><span className="text-muted-foreground">Project Title:</span> <span className="font-semibold">{result.projectTitle}</span></p>
                <p><span className="text-muted-foreground">Event:</span> <span className="font-semibold">{result.eventName}</span></p>
                <p><span className="text-muted-foreground">Type:</span> <span className="font-semibold text-primary">{result.certificateType}</span></p>
              </div>
            </motion.div>
          )}

          {result && !result.valid && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 text-red-400 font-bold text-xl mb-2">
                <span>❌</span> Invalid Certificate
              </div>
              <p className="text-sm text-red-300">{result.message}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyCertificate() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 pb-20 px-6 circuit-bg text-foreground flex items-center justify-center">Loading...</div>}>
      <VerifyForm />
    </Suspense>
  );
}
