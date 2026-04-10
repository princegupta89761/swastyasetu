import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  History, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  CheckCircle2,
  Zap,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

const Timeline = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'symptoms'),
          where('uid', '==', user.uid),
          orderBy('timestamp', 'asc')
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            date: d.timestamp?.toDate ? format(d.timestamp.toDate(), 'MMM dd') : 'N/A',
            fullDate: d.timestamp?.toDate ? d.timestamp.toDate() : new Date(),
            score: d.score || 0
          };
        });
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user]);

  // Prediction Logic (Demo)
  const getPrediction = () => {
    if (logs.length < 2) return null;
    const lastTwo = logs.slice(-2);
    const trend = lastTwo[1].score - lastTwo[0].score;
    
    if (trend > 15 && lastTwo[1].riskLevel === 'medium') {
      return {
        level: 'high',
        warning: 'Pre-Emergency Warning: Rapid symptom escalation detected.',
        action: 'We recommend immediate medical consultation to prevent further deterioration.'
      };
    } else if (trend > 5) {
      return {
        level: 'medium',
        warning: 'Upward risk trend detected.',
        action: 'Monitor your symptoms closely and maintain rest.'
      };
    }
    return {
      level: 'low',
      warning: 'Stable health pattern detected.',
      action: 'Continue your current health routine.'
    };
  };

  const prediction = getPrediction();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Smart Health Timeline</h1>
        <p className="text-slate-600">Visualizing your health journey and predicting future risks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <TrendingUp className="text-blue-600" /> Risk Score Trend
            </h2>
            <div className="h-[400px] w-full">
              {logs.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={logs}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        padding: '12px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#2563EB" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                  <Calendar className="w-12 h-12 opacity-20" />
                  <p>Not enough data to show trend. Start logging your symptoms!</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <History className="text-slate-400" /> Log History
            </h2>
            {logs.slice().reverse().map((log) => (
              <div key={log.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  log.riskLevel === 'high' ? 'bg-red-100 text-red-600' : 
                  log.riskLevel === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                )}>
                  <Activity className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {log.riskLevel.toUpperCase()} RISK LOG
                      </h3>
                      <p className="text-xs text-slate-500">
                        {log.fullDate.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-slate-400">#{log.score}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {log.symptoms.map((s: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                  {log.notes && (
                    <p className="mt-3 text-sm text-slate-600 italic">"{log.notes}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Zap className="text-amber-500" /> Smart Prediction
            </h2>
            
            {prediction ? (
              <div className="space-y-6">
                <div className={cn(
                  "p-6 rounded-xl border",
                  prediction.level === 'high' ? 'bg-red-50 border-red-100' : 
                  prediction.level === 'medium' ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100'
                )}>
                  <div className="flex items-center gap-3 mb-4">
                    {prediction.level === 'high' ? (
                      <ShieldAlert className="text-red-600 w-6 h-6" />
                    ) : (
                      <CheckCircle2 className={cn("w-6 h-6", prediction.level === 'medium' ? 'text-amber-600' : 'text-green-600')} />
                    )}
                    <span className={cn(
                      "font-bold",
                      prediction.level === 'high' ? 'text-red-700' : 
                      prediction.level === 'medium' ? 'text-amber-700' : 'text-green-700'
                    )}>
                      {prediction.warning}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {prediction.action}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">Suggested Actions:</h3>
                  <ul className="space-y-3">
                    {[
                      'Maintain hydration (2-3L water)',
                      'Monitor temperature every 4 hours',
                      'Avoid strenuous physical activity',
                      'Ensure 8 hours of quality sleep'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 text-sm">
                  Log at least 2 entries to see health predictions and trends.
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl text-white">
            <h3 className="font-bold text-lg mb-4">Emergency Prediction</h3>
            <p className="text-slate-400 text-sm mb-6">
              Our AI analyzes your symptom velocity. If we detect a rapid decline, we'll trigger a pre-emergency warning.
            </p>
            <div className="flex items-center gap-3 text-xs font-bold text-blue-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
              SYSTEM MONITORING ACTIVE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
