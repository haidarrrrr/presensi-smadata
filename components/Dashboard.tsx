
import React, { useState, useEffect } from 'react';
import { 
  Star, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  BrainCircuit,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { AppState } from '../types';
import { analyzeStudentBehavior } from '../services/gemini';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard: React.FC<{ state: AppState }> = ({ state }) => {
  const [aiInsight, setAiInsight] = useState<{ summary: string; advice: string; riskLevel: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAI = async () => {
      setLoading(true);
      const insight = await analyzeStudentBehavior(state.currentUser, state.history);
      setAiInsight(insight);
      setLoading(false);
    };
    fetchAI();
  }, [state.currentUser.id]);

  // Chart data simulation
  const chartData = [
    { name: 'Sen', pts: 80 },
    { name: 'Sel', pts: 85 },
    { name: 'Rab', pts: 100 },
    { name: 'Kam', pts: 95 },
    { name: 'Jum', pts: 120 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Card */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-indigo-100 text-sm font-medium">Selamat Datang,</p>
            <h2 className="text-2xl font-bold mt-1">{state.currentUser.name}</h2>
            <div className="mt-4 flex gap-3">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                {state.currentUser.class}
              </span>
              <span className="bg-emerald-400/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <ShieldCheck size={12} /> Terverifikasi
              </span>
            </div>
          </div>
          <img 
            src={state.currentUser.avatar} 
            alt="Profile" 
            className="w-16 h-16 rounded-2xl border-2 border-white/50 object-cover shadow-lg"
          />
        </div>
      </section>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
              <Star size={20} />
            </div>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <div className="mt-3">
            <p className="text-slate-500 text-xs font-medium">Poin Moral</p>
            <h3 className="text-2xl font-bold text-slate-800">{state.currentUser.points}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
              <AlertCircle size={20} />
            </div>
            <span className="text-[10px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Warning</span>
          </div>
          <div className="mt-3">
            <p className="text-slate-500 text-xs font-medium">Pelanggaran</p>
            <h3 className="text-2xl font-bold text-slate-800">{state.currentUser.violations}</h3>
          </div>
        </div>
      </div>

      {/* AI Behavioral Insights */}
      <section className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <BrainCircuit size={80} />
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
            <BrainCircuit size={18} />
          </div>
          <h3 className="font-bold text-slate-800">Analisis Perilaku AI</h3>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-12 bg-slate-100 rounded mt-4"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "{aiInsight?.summary}"
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  aiInsight?.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-700' :
                  aiInsight?.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  Disiplin {aiInsight?.riskLevel} Risk
                </span>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-2xl p-4 text-white">
              <p className="text-xs font-medium opacity-80 mb-1">Pesan untukmu:</p>
              <p className="text-sm font-semibold leading-snug">
                {aiInsight?.advice}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Growth Chart */}
      <section className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-600" />
            Grafik Perkembangan
          </h3>
          <button className="text-xs text-indigo-600 font-bold flex items-center">
            7 Hari Terakhir <ChevronRight size={14} />
          </button>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}}
                dy={10}
              />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="pts" 
                stroke="#6366f1" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
