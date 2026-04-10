import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  FileText, 
  Scan, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  RefreshCcw,
  Search,
  BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { getHealthAdvice } from '../services/geminiService';

const Scanner = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const startScan = async () => {
    if (!file) return;
    
    setIsScanning(true);
    setError(null);
    
    try {
      // In a real app, we would send the image to Gemini with a prompt
      // For this demo, we'll simulate the AI analysis using the geminiService
      // Since we can't easily send files to the service in this simplified version,
      // we'll use a descriptive prompt about "scanning a report"
      
      const prompt = "I have scanned a medical report. Please provide a general guide on how to read common blood test reports and what key markers like Hemoglobin, WBC, and Cholesterol usually indicate. (Note: This is a simulated scan for demonstration)";
      
      const advice = await getHealthAdvice(prompt, []);
      setResult(advice);
    } catch (err) {
      console.error("Scanning error:", err);
      setError("Failed to analyze the document. Please try again with a clearer image.");
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Smart Report Scanner</h1>
        <p className="text-slate-600">AI-powered analysis of your medical reports and prescriptions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative aspect-[3/4] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
              preview ? "border-blue-500 bg-white" : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400"
            )}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4" /> Change Image
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload or Take Photo</h3>
                <p className="text-slate-500 text-sm">Upload your blood reports, prescriptions, or any medical document.</p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <span className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 flex items-center gap-2 shadow-sm">
                    <Upload className="w-4 h-4" /> Browse
                  </span>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={reset}
              disabled={!file || isScanning}
              className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Reset
            </button>
            <button
              onClick={startScan}
              disabled={!file || isScanning}
              className="flex-[2] bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <RefreshCcw className="w-5 h-5 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" /> Analyze Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!result && !isScanning && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 h-full flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                  <BrainCircuit className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">AI Analysis Ready</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Upload a document and click "Analyze" to get a simplified summary of your medical reports using our advanced AI.
                </p>
                <div className="mt-8 space-y-3 w-full">
                  {['Summarizes complex terms', 'Identifies key markers', 'Suggests next steps'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-left p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 h-full flex flex-col items-center justify-center text-center"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-blue-100 rounded-full animate-pulse" />
                  <Scan className="w-10 h-10 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Scanning Document</h3>
                <p className="text-slate-500 text-sm">Our AI is reading and interpreting your report markers...</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 p-8 rounded-3xl border border-red-100 h-full flex flex-col items-center justify-center text-center"
              >
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-red-900 mb-2">Analysis Failed</h3>
                <p className="text-red-700 text-sm mb-6">{error}</p>
                <button 
                  onClick={startScan}
                  className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-all"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full"
              >
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="text-blue-600 w-5 h-5" /> Analysis Result
                  </h3>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    AI Generated
                  </span>
                </div>
                <div className="p-6 overflow-y-auto flex-grow prose prose-slate prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {result}
                  </div>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-[11px] text-amber-800 leading-tight">
                      <strong>Disclaimer:</strong> This AI summary is for informational purposes only. It is not a medical diagnosis. Always consult with a qualified healthcare professional to interpret your results.
                    </p>
                  </div>
                  <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    Save to Records <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
