import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, limit, getDocs, orderBy } from 'firebase/firestore';
import { 
  Activity, 
  Clock, 
  FileText, 
  AlertCircle, 
  ChevronRight,
  Plus,
  Heart,
  TrendingUp,
  ShieldAlert,
  Scan,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'motion/react';
import { HealthRecord, SymptomLog } from '../types';
import { cn } from '../lib/utils';

const Dashboard = () => {
  const { profile, user } = useAuth();
  const [recentRecords, setRecentRecords] = useState<HealthRecord[]>([]);
  const [recentSymptoms, setRecentSymptoms] = useState<SymptomLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // Fetch recent records
        const recordsPath = 'records';
        const recordsQuery = query(
          collection(db, recordsPath),
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const recordsSnap = await getDocs(recordsQuery).catch(err => {
          handleFirestoreError(err, OperationType.LIST, recordsPath);
          throw err; // Ensure TS knows this path throws
        });
        setRecentRecords(recordsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as HealthRecord)));

        // Fetch recent symptoms
        const symptomsPath = 'symptoms';
        const symptomsQuery = query(
          collection(db, symptomsPath),
          where('uid', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(3)
        );
        const symptomsSnap = await getDocs(symptomsQuery).catch(err => {
          handleFirestoreError(err, OperationType.LIST, symptomsPath);
          throw err; // Ensure TS knows this path throws
        });
        setRecentSymptoms(symptomsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SymptomLog)));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const quickActions = [
    { name: 'Scan Report', path: '/scanner', icon: Scan, color: 'bg-purple-100 text-purple-600' },
    { name: 'Pharmacy', path: '/pharmacy', icon: ShoppingBag, color: 'bg-amber-100 text-amber-600' },
    { name: 'Log Symptoms', path: '/timeline', icon: Clock, color: 'bg-blue-100 text-blue-600' },
    { name: 'Risk Check', path: '/risk-detection', icon: Activity, color: 'bg-green-100 text-green-600' },
    { name: 'Add Record', path: '/records', icon: Plus, color: 'bg-indigo-100 text-indigo-600' },
    { name: 'Emergency SOS', path: '/sos', icon: AlertCircle, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Hello, {profile?.displayName || 'User'}</h1>
        <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">Here's your health overview for today.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, idx) => (
          <Link
            key={idx}
            to={action.path}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-3"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", action.color)}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">{action.name}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Health Status Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="text-red-500" /> Health Summary
              </h2>
              <Link to="/timeline" className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center">
                View Timeline <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Recent Risk Level</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className={cn(
                    "text-3xl font-bold",
                    recentSymptoms[0]?.riskLevel === 'high' ? 'text-red-600 dark:text-red-400' : 
                    recentSymptoms[0]?.riskLevel === 'medium' ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'
                  )}>
                    {recentSymptoms[0]?.riskLevel?.toUpperCase() || 'LOW'}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm mb-1">Based on last log</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldAlert className="text-amber-600 dark:text-amber-400 w-5 h-5" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Medical Alerts</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {profile?.allergies ? `Allergies: ${profile.allergies}` : 'No active alerts found.'}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Symptoms */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="text-blue-600 dark:text-blue-400" /> Recent Symptom Logs
            </h2>
            <div className="space-y-4">
              {recentSymptoms.length > 0 ? (
                recentSymptoms.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                    <div>
                      <div className="flex gap-2 mb-1">
                        {log.symptoms.map((s, i) => (
                          <span key={i} className="text-xs bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleDateString() : 'Just now'}
                      </p>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold",
                      log.riskLevel === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 
                      log.riskLevel === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    )}>
                      {log.riskLevel.toUpperCase()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-center py-4">No symptom logs yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Recent Records */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="text-indigo-600 dark:text-indigo-400" /> Records
              </h2>
              <Link to="/records" className="text-blue-600 dark:text-blue-400 text-sm font-bold">View All</Link>
            </div>
            <div className="space-y-4">
              {recentRecords.length > 0 ? (
                recentRecords.map((record) => (
                  <div key={record.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{record.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{record.type.toUpperCase()}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{record.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-center py-4">No records uploaded.</p>
              )}
            </div>
          </div>

          {/* Health Tip */}
          <div className="bg-blue-600 dark:bg-blue-700 p-8 rounded-2xl text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-colors duration-300">
            <h3 className="font-bold text-lg mb-2">Daily Health Tip</h3>
            <p className="text-blue-100 dark:text-blue-200 text-sm leading-relaxed">
              Stay hydrated! Drinking at least 8 glasses of water a day helps maintain energy levels and supports overall organ function.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
