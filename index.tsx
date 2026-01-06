
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Home, 
  MapPin, 
  History as HistoryIcon, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  BrainCircuit,
  Bell,
  ChevronRight,
  ShieldCheck,
  Star,
  Navigation,
  LocateFixed,
  XCircle,
  Plus,
  Minus,
  LogOut,
  ShieldAlert,
  Award,
  TrendingUp,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// --- Types & Constants ---
interface Student {
  id: string;
  name: string;
  class: string;
  points: number;
  violations: number;
  avatar: string;
}

interface AttendanceRecord {
  id: string;
  timestamp: number;
  type: 'in' | 'out';
  status: 'ontime' | 'late';
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
  attendance: AttendanceRecord[];
  history: PointLog[];
}

const SCHOOL_COORDS = { lat: -8.156534, lng: 113.447512, radius: 200 };

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
// Initializing GoogleGenAI with apiKey from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analyzeStudentBehavior = async (student: Student) => {
  const prompt = `Berikan analisis singkat perilaku siswa ${student.name} dengan poin ${student.points} dan ${student.violations} pelanggaran di SMAN 2 Tanggul. Format JSON: summary, advice, riskLevel (Low/Medium/High).`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            advice: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          },
          required: ["summary", "advice", "riskLevel"]
        }
      }
    });
    // Correctly accessing the .text property of GenerateContentResponse
    return JSON.parse(response.text);
  } catch (error) {
    return { summary: "Teruslah berbuat baik dan patuhi peraturan sekolah.", advice: "Pertahankan kedisiplinan Anda.", riskLevel: "Low" };
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
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header Profile Section */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm font-medium tracking-wide">Dashboard</p>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">{state.currentUser.name}</h2>
              <p className="text-indigo-100/80 font-semibold mt-1">{state.currentUser.class}</p>
            </div>
            <div className="relative">
              <img src={state.currentUser.avatar} className="w-20 h-20 rounded-full border-4 border-white/30 shadow-2xl object-cover" />
              <div className="absolute -bottom-1 -right-1 bg-emerald-400 p-1.5 rounded-full border-2 border-indigo-600">
                <ShieldCheck size={14} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-5 px-1">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
             <div className="p-2 bg-amber-100 text-amber-500 rounded-lg"><Star size={20} fill="currentColor" /></div>
             <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Poin Moral</span>
          </div>
          <h3 className="text-4xl font-black text-slate-800">{state.currentUser.points}</h3>
          <div className="mt-2 flex items-center text-emerald-500 gap-1 font-bold text-sm">
            <TrendingUp size={16} /> <span>Up</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
             <div className="p-2 bg-rose-100 text-rose-500 rounded-lg"><AlertCircle size={20} /></div>
             <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pelanggaran</span>
          </div>
          <h3 className="text-4xl font-black text-slate-800">{state.currentUser.violations}</h3>
          <p className="mt-2 text-slate-400 text-xs font-medium">Laporan Aktif</p>
        </div>
      </div>

      {/* AI Behavioral Insights */}
      <section className="px-1">
        <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Status Kedisiplinan</h3>
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xl shadow-slate-200/50">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-slate-100 rounded w-1/2"></div>
              <div className="h-10 bg-slate-50 rounded"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-2xl">
                  <BrainCircuit size={24} />
                </div>
                <span className={`text-xl font-bold ${aiInsight?.riskLevel === 'Low' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  Disiplin {aiInsight?.riskLevel} Risk
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed font-medium">
                {aiInsight?.summary}
              </p>
              <div className="pt-2">
                <p className="text-xs text-slate-400 italic">"Teruslah berbuat baik dan patuhi peraturan sekolah."</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const AttendanceView: React.FC<{ onCheckIn: (type: 'in' | 'out') => void }> = ({ onCheckIn }) => {
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'success'>('idle');

  const handleAction = (type: 'in' | 'out') => {
    setStatus('checking');
    setTimeout(() => {
      onCheckIn(type);
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-10 pb-10 px-1">
      <header className="px-2">
        <h2 className="text-2xl font-black text-slate-800">Presensi Lokasi</h2>
      </header>
      
      <div className="aspect-[4/3] bg-slate-50 rounded-[2.5rem] border-4 border-white shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg relative z-10 transition-transform group-hover:scale-110">
          <MapPin className="text-slate-300" size={40} />
        </div>
        <p className="mt-4 text-slate-400 font-bold text-sm relative z-10">25m dari sekolah</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleAction('in')}
          disabled={status === 'checking'}
          className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold py-5 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 transition-all disabled:opacity-50"
        >
          <div className="p-1.5 bg-white/20 rounded-lg"><CheckCircle2 size={20} /></div>
          <span>Masuk</span>
        </button>
        <button 
          onClick={() => handleAction('out')}
          disabled={status === 'checking'}
          className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-white font-bold py-5 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-amber-100 transition-all disabled:opacity-50"
        >
          <div className="p-1.5 bg-white/20 rounded-lg"><Home size={20} /></div>
          <span>Pulang</span>
        </button>
      </div>

      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl text-center font-bold text-emerald-700 animate-in zoom-in">
          Berhasil Absen! Data tersimpan.
        </div>
      )}
    </div>
  );
};

const HistoryView: React.FC<{ history: PointLog[] }> = ({ history }) => (
  <div className="space-y-6 animate-in slide-in-from-right-10 pb-10 px-1">
    <header className="px-2"><h2 className="text-2xl font-black text-slate-800">Riwayat Poin</h2></header>
    <div className="space-y-4">
      {history.map(item => (
        <div key={item.id} className="bg-white border border-slate-50 p-5 rounded-[2rem] flex items-center gap-5 shadow-xl shadow-slate-200/40 transition-transform active:scale-[0.98]">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
            item.type === 'reward' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
          }`}>
            {item.type === 'reward' ? <Star size={24} fill="currentColor" /> : (item.points > 0 ? <Plus size={24} /> : <Minus size={24} />)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 text-base truncate">{item.title}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: 1223-11-001</p>
          </div>
          <div className={`text-xl font-black ${item.points > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {item.points > 0 ? '+' : ''}{item.points}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProfileView: React.FC<{ student: Student; onAddAction: (log: PointLog) => void }> = ({ student, onAddAction }) => {
  const [panel, setPanel] = useState(false);
  return (
    <div className="space-y-8 animate-in slide-in-from-left-10 pb-10 px-1">
      <div className="text-center pt-6">
        <div className="relative inline-block">
          <img src={student.avatar} className="w-32 h-32 rounded-full border-4 border-white shadow-2xl mx-auto object-cover" />
          <div className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-slate-100">
             {/* Fixed error: Added QrCode icon component (now imported from lucide-react) */}
             <QrCode size={20} className="text-indigo-600" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-slate-800 mt-6">{student.name}</h2>
        <p className="text-slate-400 font-bold mt-1">{student.class}</p>
      </div>

      <button onClick={() => setPanel(!panel)} className="w-full bg-indigo-600 text-white p-5 rounded-3xl font-black shadow-xl shadow-indigo-100 active:scale-95 transition-all">
        Mode Guru (Simulasi)
      </button>

      {panel && (
        <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-5">
          {VIOLATION_TYPES.map(v => (
            <button 
              key={v.id} 
              onClick={() => onAddAction({ id: Math.random().toString(), title: v.label, points: v.points, type: 'violation', date: Date.now() })}
              className="bg-white border-2 border-rose-100 p-4 rounded-2xl text-xs font-black text-rose-500 flex items-center gap-2 shadow-sm"
            >
              <ShieldAlert size={16} /> {v.label}
            </button>
          ))}
          <button className="bg-white border-2 border-slate-100 p-4 rounded-2xl text-xs font-black text-slate-500 flex items-center gap-2 shadow-sm">
             <AlertCircle size={16} /> Pengaturan
          </button>
          <div className="col-span-2 mt-2">
            <button className="w-full bg-rose-500 text-white p-4 rounded-2xl font-black shadow-lg shadow-rose-100">Keluar</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-50 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/30">
        <MenuItem label="Data Diri" icon={<User size={20} className="text-slate-300" />} />
        <MenuItem label="Pengaturan Akun" icon={<LogOut size={20} className="text-slate-300" />} last />
      </div>
    </div>
  );
};

const MenuItem: React.FC<{ label: string; icon: React.ReactNode; last?: boolean }> = ({ label, icon, last }) => (
  <div className={`p-6 flex items-center justify-between group active:bg-slate-50 ${!last && 'border-b border-slate-50'}`}>
    <div className="flex items-center gap-4">
      <div className="p-2 bg-slate-50 rounded-xl group-active:bg-indigo-50 transition-colors">
        {icon}
      </div>
      <span className="font-bold text-slate-700">{label}</span>
    </div>
    <ChevronRight size={18} className="text-slate-300" />
  </div>
);

// --- Main Application ---
const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'presensi' | 'history' | 'profile'>('home');
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('smada_app_state_v2');
    return saved ? JSON.parse(saved) : {
      currentUser: MOCK_STUDENT,
      attendance: [],
      history: [
        { id: '1', title: 'Juara 1 Lomba Puisi', points: 50, type: 'reward', date: Date.now() - 86400000 },
        { id: '2', title: 'Terlambat', points: -5, type: 'violation', date: Date.now() - 172800000 }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('smada_app_state_v2', JSON.stringify(state));
  }, [state]);

  const addPointLog = (log: PointLog) => setState(p => ({
    ...p,
    history: [log, ...p.history],
    currentUser: { 
      ...p.currentUser, 
      points: p.currentUser.points + log.points, 
      violations: log.type === 'violation' ? p.currentUser.violations + 1 : p.currentUser.violations 
    }
  }));

  const renderContent = () => {
    switch (currentTab) {
      case 'home': return <DashboardView state={state} />;
      case 'presensi': return <AttendanceView onCheckIn={(t) => console.log(t)} />;
      case 'history': return <HistoryView history={state.history} />;
      case 'profile': return <ProfileView student={state.currentUser} onAddAction={addPointLog} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 pb-24 max-w-md mx-auto shadow-2xl overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-50 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-[1rem] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">S2</div>
          <h1 className="font-black text-slate-800 text-lg">SMAN 2 Tanggul</h1>
        </div>
        <div className="relative">
          <Bell className="text-slate-300" size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
        </div>
      </header>

      <main className="flex-1 p-6">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-50 safe-area-bottom z-50 h-20 flex justify-around items-center px-6 max-w-md mx-auto">
        <NavButton active={currentTab === 'home'} onClick={() => setCurrentTab('home')} icon={<Home size={26} />} />
        <NavButton active={currentTab === 'presensi'} onClick={() => setCurrentTab('presensi')} icon={<MapPin size={26} />} />
        <NavButton active={currentTab === 'history'} onClick={() => setCurrentTab('history')} icon={<HistoryIcon size={26} />} />
        <NavButton active={currentTab === 'profile'} onClick={() => setCurrentTab('profile')} icon={<User size={26} />} />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button onClick={onClick} className={`relative flex flex-col items-center justify-center transition-all duration-300 ${active ? 'text-indigo-600 scale-110' : 'text-slate-300 hover:text-slate-400'}`}>
    {icon}
    {active && <div className="absolute -bottom-3 w-1.5 h-1.5 bg-indigo-600 rounded-full shadow-lg shadow-indigo-300"></div>}
  </button>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
