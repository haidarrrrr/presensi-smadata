import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Home, 
  MapPin, 
  History as HistoryIcon, 
  User, 
  CheckCircle2, 
  BrainCircuit,
  Bell,
  ChevronRight,
  ShieldCheck,
  Star,
  Navigation,
  Plus,
  Minus,
  LogOut,
  ShieldAlert,
  TrendingUp,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { GoogleGenAI, SchemaType } from "@google/genai";

// --- Types & Constants ---
interface Student {
  id: string;
  name: string;
  class: string;
  points: number;
  violations: number;
  avatar: string;
}

interface PointLog {
  id: string;
  title: string;
  points: number;
  type: 'reward' | 'violation';
  date: number;
}

interface AppState {
  currentUser: Student;
  history: PointLog[];
}

const MOCK_STUDENT: Student = {
  id: "2024001",
  name: "Ahmad Rifai",
  class: "XII MIPA 1",
  points: 120,
  violations: 2,
  avatar: "https://i.pravatar.cc/150?u=ahmad"
};

const VIOLATION_TYPES = [
  { id: 'V1', label: 'Terlambat', points: -5 },
  { id: 'V2', label: 'Atribut Tidak Lengkap', points: -10 },
  { id: 'V3', label: 'Bolos Pelajaran', points: -25 }
];

// --- AI Service ---
// MENGGUNAKAN import.meta.env agar sinkron dengan Vercel
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenAI(apiKey) : null;

const analyzeStudentBehavior = async (student: Student) => {
  if (!genAI) return { summary: "Sistem AI sedang offline.", advice: "Patuhi peraturan sekolah.", riskLevel: "Low" };
  
  try {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    summary: { type: SchemaType.STRING },
                    advice: { type: SchemaType.STRING },
                    riskLevel: { type: SchemaType.STRING },
                },
                required: ["summary", "advice", "riskLevel"]
            }
        }
    });

    const prompt = `Analisis singkat perilaku siswa ${student.name} (Poin: ${student.points}, Pelanggaran: ${student.violations}) di SMAN 2 Tanggul.`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error(error);
    return { summary: "Teruslah berbuat baik.", advice: "Pertahankan kedisiplinan.", riskLevel: "Low" };
  }
};

// --- View Components ---
const DashboardView: React.FC<{ state: AppState }> = ({ state }) => {
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeStudentBehavior(state.currentUser).then(res => {
      setAiInsight(res);
      setLoading(false);
    });
  }, [state.currentUser.points]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 text-left">
          <p className="text-indigo-100 text-sm font-medium tracking-wide">Dashboard</p>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">{state.currentUser.name}</h2>
              <p className="text-indigo-100/80 font-semibold mt-1">{state.currentUser.class}</p>
            </div>
            <img src={state.currentUser.avatar} className="w-20 h-20 rounded-full border-4 border-white/30 shadow-2xl object-cover" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-5 px-1">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
             <div className="p-2 bg-amber-100 text-amber-500 rounded-lg"><Star size={20} fill="currentColor" /></div>
             <span className="text-slate-500 text-xs font-bold uppercase">Poin Moral</span>
          </div>
          <h3 className="text-4xl font-black text-slate-800">{state.currentUser.points}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
             <div className="p-2 bg-rose-100 text-rose-500 rounded-lg"><AlertCircle size={20} /></div>
             <span className="text-slate-500 text-xs font-bold uppercase">Pelanggaran</span>
          </div>
          <h3 className="text-4xl font-black text-slate-800">{state.currentUser.violations}</h3>
        </div>
      </div>

      <section className="px-1 text-left">
        <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Status Kedisiplinan</h3>
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xl shadow-slate-200/50">
          {loading ? (
            <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-slate-200 rounded w-3/4"></div><div className="h-4 bg-slate-200 rounded"></div></div></div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-2xl"><BrainCircuit size={24} /></div>
                <span className={`text-xl font-bold ${aiInsight?.riskLevel === 'Low' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  Disiplin {aiInsight?.riskLevel} Risk
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed font-medium">{aiInsight?.summary}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'presensi' | 'history' | 'profile'>('home');
  const [state, setState] = useState<AppState>({
    currentUser: MOCK_STUDENT,
    history: [
      { id: '1', title: 'Juara 1 Lomba Puisi', points: 50, type: 'reward', date: Date.now() },
      { id: '2', title: 'Terlambat', points: -5, type: 'violation', date: Date.now() }
    ]
  });

  const renderContent = () => {
    switch (currentTab) {
      case 'home': return <DashboardView state={state} />;
      case 'presensi': return <div className="p-10 text-center font-bold">Fitur Absensi Lokasi</div>;
      case 'history': return <div className="p-10 text-center font-bold">Riwayat Poin</div>;
      case 'profile': return <div className="p-10 text-center font-bold">Profil Siswa</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 pb-24 max-w-md mx-auto shadow-2xl overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-50 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-[1rem] flex items-center justify-center text-white font-black text-xl">S2</div>
          <h1 className="font-black text-slate-800 text-lg">SMAN 2 Tanggul</h1>
        </div>
        <Bell className="text-slate-300" size={24} />
      </header>

      <main className="flex-1 p-6">{renderContent()}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-50 h-20 flex justify-around items-center px-6 max-w-md mx-auto z-50">
        <button onClick={() => setCurrentTab('home')} className={currentTab === 'home' ? 'text-indigo-600' : 'text-slate-300'}><Home size={26}/></button>
        <button onClick={() => setCurrentTab('presensi')} className={currentTab === 'presensi' ? 'text-indigo-600' : 'text-slate-300'}><MapPin size={26}/></button>
        <button onClick={() => setCurrentTab('history')} className={currentTab === 'history' ? 'text-indigo-600' : 'text-slate-300'}><HistoryIcon size={26}/></button>
        <button onClick={() => setCurrentTab('profile')} className={currentTab === 'profile' ? 'text-indigo-600' : 'text-slate-300'}><User size={26}/></button>
      </nav>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
