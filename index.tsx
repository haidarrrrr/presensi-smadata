import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Home, MapPin, History, User, Bell, Star, AlertCircle, CheckCircle2, ChevronRight, LogOut } from 'lucide-react';

const App = () => {
  // State untuk mengatur halaman mana yang aktif
  const [activeTab, setActiveTab] = useState('home');

  // Komponen Halaman Dashboard
  const DashboardView = () => (
    <div className="animate-in fade-in duration-500">
      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #9333ea)', borderRadius: '24px', padding: '24px', color: '#fff', marginBottom: '20px', textAlign: 'left' }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Selamat Datang,</p>
          <h2 style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>Ahmad Rifai</h2>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>XII MIPA 1</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <Star color="#f59e0b" size={24} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>POIN MORAL</div>
              <div style={{ fontSize: '24px', fontWeight: 'black', color: '#333' }}>120</div>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <AlertCircle color="#ef4444" size={24} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>PELANGGARAN</div>
              <div style={{ fontSize: '24px', fontWeight: 'black', color: '#333' }}>2</div>
          </div>
      </div>
    </div>
  );

  // Komponen Halaman Absensi
  const AttendanceView = () => (
    <div className="animate-in slide-in-from-bottom-5">
      <h2 style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '20px', marginBottom: '15px' }}>Presensi Lokasi</h2>
      <div style={{ background: '#f1f5f9', height: '200px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', marginBottom: '20px' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <MapPin size={40} style={{ marginBottom: '10px' }} />
          <p style={{ fontSize: '14px', fontWeight: 'bold' }}>Mendeteksi Lokasi...</p>
        </div>
      </div>
      <button style={{ width: '100%', background: '#10b981', color: '#fff', border: 'none', padding: '15px', borderRadius: '16px', fontWeight: 'bold', fontSize: '16px' }}>
        Check-In Sekarang
      </button>
    </div>
  );

  // Komponen Halaman Riwayat
  const HistoryView = () => (
    <div className="animate-in slide-in-from-right-5 text-left">
      <h2 style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '15px' }}>Riwayat Poin</h2>
      {[
        { title: 'Juara Lomba Puisi', pts: '+50', color: '#10b981' },
        { title: 'Terlambat Upacara', pts: '-10', color: '#ef4444' }
      ].map((item, i) => (
        <div key={i} style={{ background: '#fff', padding: '15px', borderRadius: '16px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <span style={{ fontWeight: '600', color: '#333' }}>{item.title}</span>
          <span style={{ fontWeight: 'bold', color: item.color }}>{item.pts}</span>
        </div>
      ))}
    </div>
  );

  // Komponen Halaman Profil
  const ProfileView = () => (
    <div className="animate-in fade-in">
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <img src="https://i.pravatar.cc/150?u=ahmad" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
        <h2 style={{ marginTop: '15px', fontWeight: 'bold' }}>Ahmad Rifai</h2>
        <p style={{ color: '#666' }}>ahmad.rifai@sman2.sch.id</p>
      </div>
      <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
          <span>Pengaturan Akun</span> <ChevronRight size={18} color="#ccc" />
        </div>
        <div style={{ padding: '15px', color: '#ef4444', display: 'flex', justifyContent: 'space-between' }}>
          <span>Keluar</span> <LogOut size={18} />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', minHeight: '100vh', background: '#f8fafc', paddingBottom: '100px' }}>
      <header style={{ background: '#fff', padding: '15px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#4f46e5', color: '#fff', width: '35px', height: '35px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>S2</div>
            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>SMAN 2 Tanggul</h1>
        </div>
        <Bell size={22} color="#94a3b8" />
      </header>

      <main style={{ padding: '20px' }}>
        {activeTab === 'home' && <DashboardView />}
        {activeTab === 'absen' && <AttendanceView />}
        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', height: '75px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #f1f5f9', maxWidth: '500px', margin: '0 auto' }}>
        <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#4f46e5' : '#cbd5e1' }}><Home /></button>
        <button onClick={() => setActiveTab('absen')} style={{ background: 'none', border: 'none', color: activeTab === 'absen' ? '#4f46e5' : '#cbd5e1' }}><MapPin /></button>
        <button onClick={() => setActiveTab('history')} style={{ background: 'none', border: 'none', color: activeTab === 'history' ? '#4f46e5' : '#cbd5e1' }}><History /></button>
        <button onClick={() => setActiveTab('profile')} style={{ background: 'none', border: 'none', color: activeTab === 'profile' ? '#4f46e5' : '#cbd5e1' }}><User /></button>
      </nav>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
