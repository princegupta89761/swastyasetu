import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  AlertCircle, 
  MapPin, 
  Phone, 
  ShieldAlert, 
  CheckCircle2,
  Loader2,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const SOS = () => {
  const { user, profile } = useAuth();
  const [isTriggered, setIsTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const triggerSOS = async () => {
    setLoading(true);
    
    // Try to get location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(loc);
          await saveAlert(loc);
        },
        async (error) => {
          console.error("Geolocation error:", error);
          await saveAlert();
        }
      );
    } else {
      await saveAlert();
    }
  };

  const saveAlert = async (loc?: { lat: number; lng: number }) => {
    try {
      await addDoc(collection(db, 'alerts'), {
        uid: user?.uid,
        location: loc || null,
        timestamp: serverTimestamp(),
        status: 'active'
      });
      setIsTriggered(true);
    } catch (error) {
      console.error("Error triggering SOS:", error);
      alert("Failed to trigger SOS. Please call emergency services directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[calc(100vh-120px)] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {!isTriggered ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold text-slate-900">Emergency SOS</h1>
              <p className="text-slate-600 max-w-md mx-auto">
                Press the button below to trigger an emergency alert. We will notify your emergency contacts and log your location.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl group-hover:bg-red-500/30 transition-all animate-pulse" />
              <button
                onClick={triggerSOS}
                disabled={loading}
                className="relative w-64 h-64 bg-red-600 rounded-full flex flex-col items-center justify-center text-white shadow-2xl shadow-red-200 hover:bg-red-700 active:scale-95 transition-all border-8 border-red-500/50"
              >
                {loading ? (
                  <Loader2 className="w-16 h-16 animate-spin" />
                ) : (
                  <>
                    <AlertCircle className="w-20 h-20 mb-2" />
                    <span className="text-3xl font-black tracking-tighter">SOS</span>
                    <span className="text-xs font-bold mt-2 opacity-80">PRESS TO ALERT</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Emergency Services</p>
                  <p className="text-xl font-black text-slate-900">112 / 102</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Blood Group</p>
                  <p className="text-xl font-black text-slate-900">{profile?.bloodGroup || 'Not Set'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="triggered"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl text-center space-y-8"
          >
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900">Alert Sent!</h2>
              <p className="text-slate-600">
                Your emergency alert has been logged and your location has been shared. Help is on the way.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location Status:
                </span>
                <span className="text-green-600 font-bold">{location ? 'Shared' : 'Unavailable'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <Navigation className="w-4 h-4" /> Coordinates:
                </span>
                <span className="text-slate-900 font-mono">
                  {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'N/A'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsTriggered(false)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
            >
              I am Safe Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SOS;
