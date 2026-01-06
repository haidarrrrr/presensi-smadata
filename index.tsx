import React from 'react';
import ReactDOM from 'react-dom/client';
import { Home, MapPin, History, User, Bell, Star, AlertCircle } from 'lucide-react';

// Sederhanakan kode untuk memastikan tampilan muncul dulu
const App = () => {
  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
      <header style={{ background: '#fff', padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#4f46e5', color: '#fff', padding: '8px 12px', borderRadius: '12px', fontWeight: 'bold' }}>S2</div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>SMAN 2 Tanggul</h1>
        </div>
        <Bell size={24} color="#ccc" />
      </header>

      <main style={{ padding: '20px' }}>
        <div style={{ background: 'linear-gradient(135deg, #4f46e5, #9333ea)', borderRadius: '24px', padding: '24px', color: '#fff', marginBottom: '20px' }}>
            <p style={{ margin: 0, opacity: 0.8 }}>Selamat Datang,</p>
            <h2 style={{ margin: '5px 0 0 0', fontSize: '24px' }}>Siswa SMAN 2</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <Star color="#f59e0b" style={{ marginBottom: '10px' }} />
                <div style={{ fontSize: '12px', color: '#666' }}>POIN</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>120</div>
            </div>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <AlertCircle color="#ef4444" style={{ marginBottom: '10px' }} />
                <div style={{ fontSize: '12px', color: '#666' }}>PELANGGARAN</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>0</div>
            </div>
        </div>
      </main>

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', height: '70px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #eee' }}>
        <Home color="#4f46e5" />
        <MapPin color="#ccc" />
        <History color="#ccc" />
        <User color="#ccc" />
      </nav>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}
