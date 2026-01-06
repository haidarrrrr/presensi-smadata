
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
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
  Star
} from 'lucide-react';
import { MOCK_STUDENT } from './constants';
import { AppState, AttendanceRecord, PointLog } from './types';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import PointHistory from './components/History';
import Profile from './components/Profile';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('smada_app_state');
    if (saved) return JSON.parse(saved);
    return {
      currentUser: MOCK_STUDENT,
      attendance: [],
      history: [
        {
          id: '1',
          studentId: MOCK_STUDENT.id,
          title: 'Juara 1 Lomba Puisi',
          description: 'Prestasi tingkat kabupaten',
          points: 50,
          type: 'reward',
          date: Date.now() - 86400000 * 2
        },
        {
          id: '2',
          studentId: MOCK_STUDENT.id,
          title: 'Atribut Tidak Lengkap',
          description: 'Tidak memakai dasi saat upacara',
          points: -10,
          type: 'violation',
          date: Date.now() - 86400000 * 5
        }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('smada_app_state', JSON.stringify(state));
  }, [state]);

  const addAttendance = (record: AttendanceRecord) => {
    setState(prev => ({
      ...prev,
      attendance: [record, ...prev.attendance]
    }));
  };

  const addPointLog = (log: PointLog) => {
    setState(prev => ({
      ...prev,
      history: [log, ...prev.history],
      currentUser: {
        ...prev.currentUser,
        points: prev.currentUser.points + log.points,
        violations: log.type === 'violation' ? prev.currentUser.violations + 1 : prev.currentUser.violations
      }
    }));
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 pb-20">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
              S2
            </div>
            <div>
              <h1 className="font-bold text-slate-800 leading-none">SMAN 2 Tanggul</h1>
              <p className="text-xs text-slate-500 mt-1">Sistem Informasi Siswa</p>
            </div>
          </div>
          <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-md mx-auto p-5 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Dashboard state={state} />} />
            <Route path="/presensi" element={<Attendance onCheckIn={addAttendance} />} />
            <Route path="/history" element={<PointHistory history={state.history} />} />
            <Route path="/profile" element={<Profile student={state.currentUser} onAddAction={addPointLog} />} />
          </Routes>
        </main>

        {/* Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-bottom z-50">
          <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
            <NavLink to="/" icon={<Home size={22} />} label="Home" />
            <NavLink to="/presensi" icon={<MapPin size={22} />} label="Absen" />
            <NavLink to="/history" icon={<HistoryIcon size={22} />} label="Riwayat" />
            <NavLink to="/profile" icon={<User size={22} />} label="Akun" />
          </div>
        </nav>
      </div>
    </HashRouter>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 w-16
        ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
    >
      <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-indigo-50' : 'bg-transparent'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
    </Link>
  );
};

export default App;
