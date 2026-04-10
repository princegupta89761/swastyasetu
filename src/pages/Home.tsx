import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  HeartPulse, 
  ShieldCheck, 
  Zap, 
  Clock, 
  ArrowRight,
  Activity,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

const Home = () => {
  return (
    <div className="overflow-hidden transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Bridging You to <br />
                <span className="text-blue-600 dark:text-blue-400">Better Health</span>
              </h1>
              <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                SwasthyaSetu (स्वास्थ्यसेतु) is your all-in-one digital health companion for early detection, 
                smart tracking, and emergency response.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20 flex items-center justify-center gap-2"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-50 dark:bg-sky-900/10 rounded-full blur-3xl opacity-50" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why SwasthyaSetu?</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Comprehensive tools designed for your well-being.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Smart Health Timeline',
                desc: 'Track symptoms over time and predict future health risks with our unique timeline feature.',
                icon: Clock,
                color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              },
              {
                title: 'AI Health Assistant',
                desc: 'Get instant guidance and answers to your health queries from our intelligent chatbot.',
                icon: MessageSquare,
                color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
              },
              {
                title: 'Early Risk Detection',
                desc: 'Identify potential health issues early with our symptom-based risk assessment tools.',
                icon: Activity,
                color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
              },
              {
                title: 'Digital Health Records',
                desc: 'Securely store and manage all your medical reports and prescriptions in one place.',
                icon: ShieldCheck,
                color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              },
              {
                title: 'SOS Emergency',
                desc: 'One-tap emergency alerts that notify your contacts and provide location data.',
                icon: AlertCircle,
                color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              },
              {
                title: 'Medicine Info',
                desc: 'Quickly find information about medicines, dosages, and potential side effects.',
                icon: Zap,
                color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6", feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700 relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to take control of your health?
          </h2>
          <p className="text-blue-100 dark:text-blue-200 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust SwasthyaSetu for their daily health management.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-blue-600 dark:text-blue-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all"
          >
            Create Your Profile
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
      </section>
    </div>
  );
};

export default Home;
