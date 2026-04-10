import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const symptomsList = [
  'Fever', 'Cough', 'Fatigue', 'Shortness of breath', 'Headache', 
  'Body ache', 'Loss of taste/smell', 'Sore throat', 'Runny nose', 
  'Nausea', 'Diarrhea', 'Chest pain', 'Dizziness'
];

const RiskDetection = () => {
  const { user } = useAuth();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<{ score: number; level: 'low' | 'medium' | 'high'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const calculateRisk = async () => {
    setLoading(true);
    // Simple logic for demo
    const score = (selectedSymptoms.length * 10) + (severity * 5);
    let level: 'low' | 'medium' | 'high' = 'low';
    let message = "Your risk level appears to be low. Continue monitoring your health.";

    if (score > 60 || selectedSymptoms.includes('Chest pain') || selectedSymptoms.includes('Shortness of breath')) {
      level = 'high';
      message = "URGENT: Your symptoms indicate a high risk level. Please consult a doctor immediately or visit the nearest emergency room.";
    } else if (score > 30) {
      level = 'medium';
      message = "Your risk level is moderate. We recommend scheduling a consultation with a healthcare professional soon.";
    }

    const riskData = {
      uid: user?.uid,
      symptoms: selectedSymptoms,
      severity,
      notes,
      timestamp: serverTimestamp(),
      riskLevel: level,
      score
    };

    try {
      const symptomsPath = 'symptoms';
      await addDoc(collection(db, symptomsPath), riskData).catch(err => handleFirestoreError(err, OperationType.CREATE, symptomsPath));
      setResult({ score, level, message });
    } catch (error) {
      console.error("Error saving risk assessment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Risk Assessment</h1>
        <p className="text-slate-600">Analyze your symptoms for early risk detection.</p>
      </div>

      {!result ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Symptoms Selection */}
            <div>
              <label className="block text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="text-blue-600" /> Select Your Symptoms
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {symptomsList.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={cn(
                      "px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left",
                      selectedSymptoms.includes(symptom)
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                        : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                    )}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Slider */}
            <div>
              <label className="block text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="text-amber-500" /> Overall Severity
                </span>
                <span className="text-blue-600">{severity}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                <span>MILD</span>
                <span>MODERATE</span>
                <span>SEVERE</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-lg font-bold text-slate-900 mb-4">Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe how you're feeling..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
              />
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Info className="w-4 h-4" />
              <span>Your data is securely stored for timeline tracking.</span>
            </div>
            <button
              onClick={calculateRisk}
              disabled={selectedSymptoms.length === 0 || loading}
              className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Analyzing...' : 'Run Risk Analysis'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
        >
          <div className={cn(
            "p-12 text-center",
            result.level === 'high' ? 'bg-red-50' : 
            result.level === 'medium' ? 'bg-amber-50' : 'bg-green-50'
          )}>
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
              result.level === 'high' ? 'bg-red-100 text-red-600' : 
              result.level === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
            )}>
              {result.level === 'high' ? <AlertTriangle className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {result.level.toUpperCase()} RISK DETECTED
            </h2>
            <p className="text-lg text-slate-700 max-w-xl mx-auto leading-relaxed">
              {result.message}
            </p>
          </div>

          <div className="p-8 bg-white border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setResult(null)}
              className="px-8 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 border border-slate-200"
            >
              Start New Assessment
            </button>
            <Link
              to="/chatbot"
              className="px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 text-center"
            >
              Talk to AI Assistant
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RiskDetection;
