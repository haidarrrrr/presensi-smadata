import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Home, MapPin, History as HistoryIcon, User, Bell, Star, 
  AlertCircle, CheckCircle2, Loader2, Navigation, ChevronRight, LogOut 
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [status, setStatus] = useState<'idle' | 'checking' | 'success'>('idle');
  const [distance, setDistance] = useState<number | null>(null);
  
  // State untuk menyimpan riwayat absensi & poin
  const [history, setHistory] = useState([
    { id: 1, title: 'Juara 1 Lomba Puisi', pts: '+50', type: 'reward', time: 'Kemarin' },
    { id: 2, title: 'Terlambat Upacara', pts: '-10', type: 'violation', time: '2 hari lalu' }
  ]);

  // Data Siswa
  const student = {
    name: "Ahmad Rifai",
    class: "XII MIPA 1",
    points: 120,
    violations: 2,
    avatar: "https://i.pravatar.cc/150?u=ahmad"
  };

  // Fungsi Absen & Tambah ke Histori
  const handleCheckIn = () => {
    setStatus('checking');
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0');
      
      // Tambahkan ke daftar histori
      const newAbsen = {
        id: Date.now(),
        title: 'Presensi Masuk Berhasil',
        pts: 'OK',
        type: 'attendance',
        time: 'Hari ini, ' + timeStr
      };
      
      setHistory([newAbsen, ...history]);
      setDistance(25);
      setStatus('success');
    }, 1500);
  };

  // --- KOMPONEN HALAMAN ---

  const DashboardView = () => (
    <div className="animate-in fade-in duration-500 text-left space-y-6">
      <div className="bg-gradient-to-br from-indigo-700 to-blue-500 rounded-[2.5rem] p-8 text-white shadow-2xl">
          <p className="text-sm opacity-80">Dashboard</p>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black">{student.name}</h2>
              <p className="font-semibold opacity-90">{student.class}</p>
            </div>
            <img src={student.avatar} className="w-16 h-16 rounded-full border-4 border-white/30 shadow-xl" />
          </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl flex flex-col items-center">
              <Star color="#f59e0b" fill="#f59e0b" size={24} className="mb-2" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Poin Moral</span>
              <h3 className="text-3xl font-black text-slate-800">{student.points}</h3>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl flex flex-col items-center">
              <AlertCircle color="#ef4444" size={24} className="mb-2" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pelanggaran</span>
              <h3 className="text-3xl font-black text-slate-800">{student.violations}</h3>
          </div>
      </div>
    </div>
  );

  const AttendanceView = () => (
    <div className="animate-in slide-in-from-bottom-5 text-left space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Presensi Lokasi</h2>
      <div className="aspect-video bg-slate-50 rounded-[2.5rem] border-4 border-white shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
        {status === 'checking' ? <Loader2 className="text-indigo-600 animate-spin" size={48} /> : 
         status === 'success' ? <CheckCircle2 className="text-emerald-500" size={50} /> : 
         <MapPin className="text-slate-300" size={50} />}
        <p className="mt-4 text-slate-400 font-bold text-sm">
          {status === 'success' ? `${distance}m dari sekolah` : "Siap melakukan presensi?"}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={handleCheckIn} className="bg-emerald-500 text-white font-bold py-5 rounded-3xl flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
          <CheckCircle2 size={20} /> Masuk
        </button>
        <button className="bg-amber-400 text-white font-bold py-5 rounded-3xl flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
          <Navigation size={20} className="rotate-45" /> Pulang
        </button>
      </div>
    </div>
  );

  const HistoryView = () => (
    <div className="animate-in slide-in-from-right-5 text-left space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Riwayat Aktivitas</h2>
      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-[2rem] border border-slate-50 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${item.type === 'reward' ? 'bg-emerald-50 text-emerald-500' : item.type === 'attendance' ? 'bg-blue-50 text-blue-500' : 'bg-rose-50 text-rose-500'}`}>
                {item.type === 'reward' ? <Star size={20} fill="currentColor"/> : item.type === 'attendance' ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{item.time}</p>
              </div>
            </div>
            <span className={`font-black ${item.pts.startsWith('+') ? 'text-emerald-500' : item.pts === 'OK' ? 'text-blue-500' : 'text-rose-500'}`}>
              {item.pts}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="animate-in fade-in text-center space-y-6">
      <div className="pt-6">
        <img src={student.avatar} className="w-28 h-28 rounded-full border-4 border-white shadow-2xl mx-auto" />
        <h2 className="text-2xl font-black text-slate-800 mt-4">{student.name}</h2>
        <p className="text-slate-400 font-bold">{student.class}</p>
      </div>
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-4"><User size={20} className="text-slate-300"/><span className="font-bold text-slate-700">Data Diri</span></div>
          <ChevronRight size={18} className="text-slate-300"/>
        </div>
        <div className="p-6 flex justify-between items-center text-rose-500">
          <div className="flex items-center gap-4"><LogOut size={20}/><span className="font-bold">Keluar Aplikasi</span></div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }} className="min-h-screen bg-[#f8fafc] max-w-md mx-auto shadow-2xl pb-24">
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-5 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">S2</div>
          <h1 className="font-black text-slate-800 text-lg">SMAN 2 Tanggul</h1>
        </div>
        <Bell size={24} className="text-slate-300" />
      </header>

      <main className="p-6">
        {activeTab === 'home' && <DashboardView />}
        {activeTab === 'absen' && <AttendanceView />}
        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-100 h-20 flex justify-around items-center px-6 max-w-md mx-auto z-50">
        <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-indigo-600' : 'text-slate-300'}><Home size={26}/></button>
        <button onClick={() => setActiveTab('absen')} className={activeTab === 'absen' ? 'text-indigo-600' : 'text-slate-300'}><MapPin size={26}/></button>
        <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'text-indigo-600' : 'text-slate-300'}><HistoryIcon size={26}/></button>
        <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-300'}><User size={26}/></button>
      </nav>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
