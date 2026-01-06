import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Home, 
  MapPin, 
  History as HistoryIcon, 
  User, 
  ShieldCheck,
  Star,
  Navigation,
  Plus,
  Minus,
  LogOut,
  Bell,
  BrainCircuit,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

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

const VIOLATION_TYPES = [
  { id: 'V1', label: 'Terlambat', points: -5 },
  { id: 'V2', label: 'Atribut Tidak Lengkap', points: -10 },
  { id: 'V3', label: 'Bolos Pelajaran', points: -25 },
];

// --- View Components ---

const DashboardView: React.FC<{ state: AppState }> = ({ state }) => {
  return (
    <div className="space-y-6">
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
          <img src={state.currentUser.avatar} alt="Profile" className="w-16 h-16 rounded-2xl border-2 border-white/50 object-cover" />
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

      <section className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600"><BrainCircuit size={18} /></div>
          <h3 className="font-bold text-slate-800">Status Kedisiplinan</h3>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 italic">
          "Tetap pertahankan kedisiplinan Anda untuk menjaga poin moral tetap tinggi."
        </div>
      </section>
    </div>
  );
};

const AttendanceView: React.FC<{ onCheckIn: (record: AttendanceRecord) => void }> = ({ onCheckIn }) => {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'success'>('idle');
  const [distance, setDistance] = useState<number | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const dLat = (lat2-lat1) * Math.PI/180;
    const dLon = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const checkLocation = () => {
    setStatus('checking');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords);
        const dist = calculateDistance(pos.coords.latitude, pos.coords.longitude, SCHOOL_COORDS.lat, SCHOOL_COORDS.lng);
        setDistance(dist);
        setStatus('ready');
      },
      () => setStatus('idle'),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-6">
      <header><h2 className="text-2xl font-bold text-slate-800">Presensi Lokasi</h2></header>
      <div className="aspect-video bg-slate-100 rounded-3xl flex items-center justify-center border-4 border-white shadow-inner">
        {location ? <div className="text-center"><Navigation className="text-indigo-600 mx-auto mb-2 animate-bounce" /> <p className="text-xs font-bold text-slate-500">{distance?.toFixed(0)}m dari sekolah</p></div> : <MapPin className="text-slate-300" size={48} />}
      </div>
      <button onClick={checkLocation} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl">Cek Lokasi</button>
    </div>
  );
};

const HistoryView: React.FC<{ history: PointLog[] }> = ({ history }) => (
  <div className="space-y-6">
    <header><h2 className="text-2xl font-bold text-slate-800">Riwayat Poin</h2></header>
    <div className="space-y-3">
      {history.map(item => (
        <div key={item.id} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.points > 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
            {item.points > 0 ? <Plus size={18} /> : <Minus size={18} />}
          </div>
          <div className="flex-1"><h4 className="font-bold text-slate-800 text-sm">{item.title}</h4></div>
          <div className={`font-bold ${item.points > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{item.points > 0 ? '+' : ''}{item.points}</div>
        </div>
      ))}
    </div>
  </div>
);

// --- Main Application ---
const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [state, setState] = useState<AppState>({
    currentUser: MOCK_STUDENT,
    attendance: [],
    history: [
      { id: '1', studentId: MOCK_STUDENT.id, title: 'Juara Lomba', description: '', points: 50, type: 'reward', date: Date.now() }
    ]
  });

  const renderContent = () => {
    switch (currentTab) {
      case 'home': return <DashboardView state={state} />;
      case 'presensi': return <AttendanceView onCheckIn={() => {}} />;
      case 'history': return <HistoryView history={state.history} />;
      case 'profile': return <div className="p-10 text-center font-bold">Profil Siswa</div>;
      default: return <DashboardView state={state} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">S2</div>
        <h1 className="font-bold text-slate-800">SMAN 2 Tanggul</h1>
      </header>
      <main className="p-5">{renderContent()}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex justify-around items-center">
        <button onClick={() => setCurrentTab('home')} className={currentTab === 'home' ? 'text-indigo-600' : 'text-slate-400'}><Home /></button>
        <button onClick={() => setCurrentTab('presensi')} className={currentTab === 'presensi' ? 'text-indigo-600' : 'text-slate-400'}><MapPin /></button>
        <button onClick={() => setCurrentTab('history')} className={currentTab === 'history' ? 'text-indigo-600' : 'text-slate-400'}><HistoryIcon /></button>
        <button onClick={() => setCurrentTab('profile')} className={currentTab === 'profile' ? 'text-indigo-600' : 'text-slate-400'}><User /></button>
      </nav>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
