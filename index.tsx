import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Home, MapPin, History, User, Bell, Star, AlertCircle, ChevronRight, LogOut, CheckCircle2, Loader2, Navigation } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('absen'); // Set default ke absen untuk testing
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'denied'>('idle');
  const [distance, setDistance] = useState<number | null>(null);

  // Titik Koordinat SMAN 2 Tanggul
  const SCHOOL_COORDS = { lat: -8.156534, lng: 113.447512, radius: 200 };

  // Fungsi Hitung Jarak (Haversine Formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // meter
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleCheckIn = () => {
    setStatus('checking');
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung GPS");
      setStatus('idle');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = calculateDistance(pos.coords.latitude, pos.coords.longitude, SCHOOL_COORDS.lat, SCHOOL_COORDS.lng);
        setDistance(Math.round(d));
        
        if (d <= SCHOOL_COORDS.radius) {
          setStatus('success');
        } else {
          setStatus('denied');
          alert(`Anda berada di luar jangkauan (${Math.round(d)}m). Maksimal 200m.`);
        }
      },
      () => {
        alert("Gagal akses lokasi. Berikan izin GPS di browser HP Anda.");
        setStatus('idle');
      },
      { enableHighAccuracy: true }
    );
  };

  const AttendanceView = () => (
    <div className="animate-in slide-in-from-bottom-5 text-left space-y-6">
      <header className="px-1">
        <h2 className="text-2xl font-black text-slate-800">Presensi Lokasi</h2>
      </header>
      
      {/* Kartu Lokasi Mirip Gambar */}
      <div className="aspect-video bg-slate-50 rounded-[2.5rem] border-4 border-white shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
        
        {status === 'checking' ? (
          <Loader2 className="text-indigo-600 animate-spin" size={48} />
        ) : status === 'success' ? (
          <CheckCircle2 className="text-emerald-500 animate-bounce" size={50} />
        ) : (
          <MapPin className="text-slate-300 transition-transform group-hover:scale-110" size={50} />
        )}

        <p className="mt-4 text-slate-400 font-bold text-sm relative z-10">
          {distance !== null ? `${distance}m dari sekolah` : "Deteksi Lokasi Sekolah"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={handleCheckIn}
          className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold py-5 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 transition-all"
        >
          <CheckCircle2 size={20} />
          <span>Masuk</span>
        </button>
        <button 
          className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-white font-bold py-5 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-amber-100 transition-all"
        >
          <Navigation size={20} className="rotate-45" />
          <span>Pulang</span>
        </button>
      </div>

      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl text-center font-bold text-emerald-700 animate-in zoom-in">
          Berhasil Absen! Selamat belajar.
        </div>
      )}
    </div>
  );

  return (
    <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', minHeight: '100vh', background: '#fff', paddingBottom: '100px' }} className="max-w-md mx-auto shadow-2xl">
      <header className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-slate-50 px-6 py-5 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">S2</div>
            <h1 className="font-black text-slate-800 text-lg">SMAN 2 Tanggul</h1>
        </div>
        <Bell size={24} className="text-slate-300" />
      </header>

      <main className="p-6">
        {activeTab === 'home' && <div className="p-10 text-center font-bold">Dashboard Siswa</div>}
        {activeTab === 'absen' && <AttendanceView />}
        {activeTab === 'history' && <div className="p-10 text-center font-bold">Riwayat Poin</div>}
        {activeTab === 'profile' && <div className="p-10 text-center font-bold">Profil Akun</div>}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-50 h-20 flex justify-around items-center px-6 max-w-md mx-auto z-50">
        <button onClick={() => setActiveTab('home')} style={{ color: activeTab === 'home' ? '#4f46e5' : '#cbd5e1' }} className="transition-all"><Home size={26}/></button>
        <button onClick={() => setActiveTab('absen')} style={{ color: activeTab === 'absen' ? '#4f46e5' : '#cbd5e1' }} className="transition-all"><MapPin size={26}/></button>
        <button onClick={() => setActiveTab('history')} style={{ color: activeTab === 'history' ? '#4f46e5' : '#cbd5e1' }} className="transition-all"><History size={26}/></button>
        <button onClick={() => setActiveTab('profile')} style={{ color: activeTab === 'profile' ? '#4f46e5' : '#cbd5e1' }} className="transition-all"><User size={26}/></button>
      </nav>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
