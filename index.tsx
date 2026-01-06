
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Home, 
  MapPin, 
  History as HistoryIcon, 
  User, 
  PlusCircle, 
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
  Clock,
  Plus,
  Minus,
  Search,
  Filter,
  LogOut,
  ShieldAlert,
  Award,
  QrCode,
  Info,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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
  studentId: string;
  timestamp: number;
  type: 'in' | 'out';
  location: { lat: number; lng: number };
  status: 'ontime' | 'late' | 'invalid';
}

interface PointLog {
  id: string;
  studentId: string;
  title: string;
  description: string;
  points: number;
  type: 'reward' | 'violation' | 'note';
  date: number;
}

interface AppState {
  currentUser: Student;
  attendance: AttendanceRecord[];
  history: PointLog[];
}

const SCHOOL_COORDS = {
  lat: -8.156534,
  lng: 113.447512,
  radius: 200,
  name: "SMAN 2 Tanggul"
};

const MOCK_STUDENT: Student = {
  id: "2024001",
  name: "Ahmad Rifai",
  class: "XII MIPA 1",
  points: 120,
  violations: 2,
  avatar: "https://picsum.photos/seed/ahmad/200"
};

const REWARD_TYPES = [
  { id: 'R1', label: 'Juara Kelas', points: 50 },
  { id: 'R2', label: 'Lomba Nasional', points: 100 },
  { id: 'R3', label: 'Aktif Organisasi', points: 20 },
  { id: 'R4', label: 'Membantu Guru', points: 10 },
];

const VIOLATION_TYPES = [
  { id: 'V1', label: 'Terlambat', points: -5 },
  { id: 'V2', label: 'Atribut Tidak Lengkap', points: -10 },
  { id: 'V3', label: 'Bolos Pelajaran', points: -25 },
  { id: 'V4', label: 'Merusak Fasilitas', points: -50 },
];

// --- AI Service ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analyzeStudentBehavior = async (student: Student, history: PointLog[]) => {
  const historySummary = history
    .slice(0, 5)
    .map(h => `${new Date(h.date).toLocaleDateString()}: ${h.title} (${h.points > 0 ? '+' : ''}${h.points})`)
    .join(', ');

  const prompt = `Analyze behavior for student: ${student.name} from SMAN 2 Tanggul.
    Current Stats: Points: ${student.points}, Violations: ${student.violations}.
    Recent History: ${historySummary || 'No recent activity.'}
    Provide summary (1-2 sentences), motivational advice, and risk level (Low, Medium, High).`;

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
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      summary: "Analisis otomatis sedang tidak tersedia.",
      advice: "Teruslah berbuat baik dan patuhi peraturan sekolah.",
      riskLevel: "Low"
    };
  }
};

// --- View Components ---

const DashboardView: React.FC<{ state: AppState }> = ({ state }) => {
  const [aiInsight, setAiInsight] = useState<any>(null);
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

  const chartData = [
    { name: 'Sen', pts: 80 }, { name: 'Sel', pts: 85 }, { name: 'Rab', pts: 100 },
    { name: 'Kam', pts: 95 }, { name: 'Jum', pts: 120 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-indigo-100 text-sm font-medium">Selamat Datang,</p>
            <h2 className="text-2xl font-bold mt-1">{state.currentUser.name}</h2>
            <div className="mt-4 flex gap-3">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">{state.currentUser.class}</span>
              <span className="bg-emerald-400/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <ShieldCheck size={12} /> Terverifikasi
              </span>
            </div>
          </div>
          <img src={state.currentUser.avatar} alt="Profile" className="w-16 h-16 rounded-2xl border-2 border-white/50 object-cover shadow-lg" />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-500"><Star size={20} /></div>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <div className="mt-3">
            <p className="text-slate-500 text-xs font-medium">Poin Moral</p>
            <h3 className="text-2xl font-bold text-slate-800">{state.currentUser.points}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-rose-50 rounded-xl text-rose-500"><AlertCircle size={20} /></div>
          </div>
          <div className="mt-3">
            <p className="text-slate-500 text-xs font-medium">Pelanggaran</p>
            <h3 className="text-2xl font-bold text-slate-800">{state.currentUser.violations}</h3>
          </div>
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600"><BrainCircuit size={18} /></div>
          <h3 className="font-bold text-slate-800">Analisis Perilaku AI</h3>
        </div>
        {loading ? (
          <div className="animate-pulse space-y-3"><div className="h-4 bg-slate-100 rounded w-3/4"></div><div className="h-12 bg-slate-100 rounded mt-4"></div></div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 italic">"{aiInsight?.summary}"</div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase w-fit ${aiInsight?.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              Disiplin {aiInsight?.riskLevel} Risk
            </div>
            <div className="bg-indigo-600 rounded-2xl p-4 text-white text-sm font-semibold">{aiInsight?.advice}</div>
          </div>
        )}
      </section>
    </div>
  );
};

const AttendanceView: React.FC<{ onCheckIn: (record: AttendanceRecord) => void }> = ({ onCheckIn }) => {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'success' | 'denied'>('idle');
  const [distance, setDistance] = useState<number | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180; const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180; const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const checkLocation = () => {
    setStatus('checking');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords);
        const dist = calculateDistance(pos.coords.latitude, pos.coords.longitude, SCHOOL_COORDS.lat, SCHOOL_COORDS.lng);
        setDistance(dist);
        setStatus(dist <= SCHOOL_COORDS.radius ? 'ready' : 'denied');
      },
      () => setStatus('idle'),
      { enableHighAccuracy: true }
    );
  };

  const handleAction = (type: 'in' | 'out') => {
    if (!location) return;
    onCheckIn({
      id: Math.random().toString(36).substr(2, 9),
      studentId: MOCK_STUDENT.id,
      timestamp: Date.now(),
      type,
      location: { lat: location.latitude, lng: location.longitude },
      status: 'ontime'
    });
    setStatus('success');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <header><h2 className="text-2xl font-bold text-slate-800">Presensi Lokasi</h2></header>
      <div className="aspect-video bg-slate-100 rounded-3xl flex items-center justify-center border-4 border-white shadow-inner">
        {location ? <div className="text-center"><Navigation className="text-indigo-600 mx-auto mb-2 animate-bounce" /> <p className="text-xs font-bold text-slate-500">{distance?.toFixed(0)}m dari sekolah</p></div> : <MapPin className="text-slate-300" size={48} />}
      </div>
      <div className="space-y-4">
        {status === 'idle' && <button onClick={checkLocation} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl">Mulai Deteksi Lokasi</button>}
        {status === 'ready' && (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleAction('in')} className="bg-emerald-500 text-white font-bold py-5 rounded-2xl flex flex-col items-center gap-2"><CheckCircle2 /><span>Masuk</span></button>
            <button onClick={() => handleAction('out')} className="bg-amber-500 text-white font-bold py-5 rounded-2xl flex flex-col items-center gap-2"><Navigation className="rotate-45" /><span>Pulang</span></button>
          </div>
        )}
        {status === 'success' && <div className="bg-emerald-50 text-emerald-800 p-8 rounded-2xl text-center font-bold">Presensi Berhasil Dicatat!</div>}
      </div>
    </div>
  );
};

const HistoryView: React.FC<{ history: PointLog[] }> = ({ history }) => (
  <div className="space-y-6 animate-in slide-in-from-right-4">
    <header><h2 className="text-2xl font-bold text-slate-800">Riwayat Poin</h2></header>
    <div className="space-y-3">
      {history.map(item => (
        <div key={item.id} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.points > 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
            {item.points > 0 ? <Plus size={18} /> : <Minus size={18} />}
          </div>
          <div className="flex-1"><h4 className="font-bold text-slate-800 text-sm">{item.title}</h4><p className="text-[10px] text-slate-400">{new Date(item.date).toLocaleDateString()}</p></div>
          <div className={`font-bold ${item.points > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{item.points > 0 ? '+' : ''}{item.points}</div>
        </div>
      ))}
    </div>
  </div>
);

const ProfileView: React.FC<{ student: Student; onAddAction: (log: PointLog) => void }> = ({ student, onAddAction }) => {
  const [panel, setPanel] = useState(false);
  return (
    <div className="space-y-6 animate-in slide-in-from-left-4">
      <div className="text-center pt-4">
        <img src={student.avatar} className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl mx-auto object-cover" />
        <h2 className="text-2xl font-bold text-slate-800 mt-4">{student.name}</h2>
        <p className="text-slate-500 text-sm">{student.class}</p>
      </div>
      <button onClick={() => setPanel(!panel)} className="w-full bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-indigo-700 font-bold text-sm">Mode Guru (Simulasi)</button>
      {panel && (
        <div className="grid grid-cols-2 gap-2">
          {VIOLATION_TYPES.map(v => (
            <button key={v.id} onClick={() => onAddAction({ id: Math.random().toString(), studentId: student.id, title: v.label, description: '', points: v.points, type: 'violation', date: Date.now() })} className="bg-white border border-rose-100 p-2 rounded-xl text-[10px] font-bold text-rose-600">{v.label}</button>
          ))}
        </div>
      )}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-sm font-bold text-slate-700"><span>Data Diri</span><ChevronRight size={16} /></div>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-sm font-bold text-slate-700"><span>Pengaturan</span><ChevronRight size={16} /></div>
        <div className="p-4 flex items-center justify-between text-sm font-bold text-rose-500"><span>Keluar</span><LogOut size={16} /></div>
      </div>
    </div>
  );
};

// --- Main Application ---
const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'presensi' | 'history' | 'profile'>('home');
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('smada_app_state');
    return saved ? JSON.parse(saved) : {
      currentUser: MOCK_STUDENT,
      attendance: [],
      history: [
        { id: '1', studentId: MOCK_STUDENT.id, title: 'Juara 1 Lomba Puisi', description: '', points: 50, type: 'reward', date: Date.now() - 86400000 },
        { id: '2', studentId: MOCK_STUDENT.id, title: 'Atribut Tidak Lengkap', description: '', points: -10, type: 'violation', date: Date.now() - 172800000 }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('smada_app_state', JSON.stringify(state));
  }, [state]);

  const addAttendance = (record: AttendanceRecord) => setState(p => ({ ...p, attendance: [record, ...p.attendance] }));
  const addPointLog = (log: PointLog) => setState(p => ({
    ...p,
    history: [log, ...p.history],
    currentUser: { ...p.currentUser, points: p.currentUser.points + log.points, violations: log.type === 'violation' ? p.currentUser.violations + 1 : p.currentUser.violations }
  }));

  const renderContent = () => {
    switch (currentTab) {
      case 'home': return <DashboardView state={state} />;
      case 'presensi': return <AttendanceView onCheckIn={addAttendance} />;
      case 'history': return <HistoryView history={state.history} />;
      case 'profile': return <ProfileView student={state.currentUser} onAddAction={addPointLog} />;
      default: return <DashboardView state={state} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">S2</div>
          <div>
            <h1 className="font-bold text-slate-800 leading-none">SMAN 2 Tanggul</h1>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">Student Hub</p>
          </div>
        </div>
        <Bell className="text-slate-400" size={20} />
      </header>

      <main className="flex-1 w-full max-w-md mx-auto p-5 overflow-x-hidden">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-bottom z-50 h-16 flex justify-around items-center px-4 max-w-md mx-auto">
        <NavButton active={currentTab === 'home'} onClick={() => setCurrentTab('home')} icon={<Home size={22} />} label="Beranda" />
        <NavButton active={currentTab === 'presensi'} onClick={() => setCurrentTab('presensi')} icon={<MapPin size={22} />} label="Absen" />
        <NavButton active={currentTab === 'history'} onClick={() => setCurrentTab('history')} icon={<HistoryIcon size={22} />} label="Riwayat" />
        <NavButton active={currentTab === 'profile'} onClick={() => setCurrentTab('profile')} icon={<User size={22} />} label="Akun" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 transition-all w-16 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
    <div className={`p-1 rounded-lg ${active ? 'bg-indigo-50' : ''}`}>{icon}</div>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
