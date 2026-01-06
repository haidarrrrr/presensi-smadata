
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  LocateFixed, 
  ShieldCheck, 
  XCircle,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { SCHOOL_COORDS } from '../constants';
import { AttendanceRecord } from '../types';

interface AttendanceProps {
  onCheckIn: (record: AttendanceRecord) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ onCheckIn }) => {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'success' | 'denied'>('idle');
  const [distance, setDistance] = useState<number | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
  };

  const checkLocation = () => {
    setStatus('checking');
    setError(null);

    if (!navigator.geolocation) {
      setError("Browser kamu tidak mendukung GPS.");
      setStatus('idle');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords);
        const dist = calculateDistance(
          pos.coords.latitude, 
          pos.coords.longitude, 
          SCHOOL_COORDS.lat, 
          SCHOOL_COORDS.lng
        );
        setDistance(dist);
        setStatus(dist <= SCHOOL_COORDS.radius ? 'ready' : 'denied');
      },
      (err) => {
        setError("Izin lokasi ditolak atau tidak tersedia.");
        setStatus('idle');
      },
      { enableHighAccuracy: true }
    );
  };

  const handlePresence = (type: 'in' | 'out') => {
    if (!location) return;

    const record: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: "2024001",
      timestamp: Date.now(),
      type: type,
      location: {
        lat: location.latitude,
        lng: location.longitude,
      },
      status: 'ontime'
    };

    onCheckIn(record);
    setStatus('success');
    
    setTimeout(() => {
      setStatus('idle');
      setLocation(null);
      setDistance(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Presensi Lokasi</h2>
        <p className="text-slate-500 text-sm mt-1">Gunakan GPS untuk mencatat kehadiran di sekolah.</p>
      </header>

      {/* Map Preview Placeholder */}
      <div className="relative aspect-video bg-slate-200 rounded-3xl overflow-hidden border-4 border-white shadow-inner flex items-center justify-center">
        {location ? (
          <div className="absolute inset-0 bg-indigo-50 flex items-center justify-center">
             <div className="relative">
                <div className="absolute inset-0 animate-ping bg-indigo-400 rounded-full opacity-25"></div>
                <div className="relative bg-indigo-600 p-4 rounded-full text-white shadow-xl shadow-indigo-200">
                   <Navigation size={24} className="rotate-45" />
                </div>
             </div>
             <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl flex items-center justify-between border border-white">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Lokasi Kamu</p>
                  <p className="text-xs font-semibold text-slate-700">Terdeteksi di sekitar Tanggul</p>
                </div>
                <div className="bg-indigo-100 px-2 py-1 rounded text-[10px] font-bold text-indigo-700">
                  {distance?.toFixed(0)}m dari SMADA
                </div>
             </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <MapPin size={32} />
            </div>
            <p className="text-slate-400 text-sm font-medium">Klik tombol di bawah untuk mendeteksi posisi kamu</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {status === 'idle' && (
          <button 
            onClick={checkLocation}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <LocateFixed size={20} />
            Mulai Deteksi Lokasi
          </button>
        )}

        {status === 'checking' && (
          <div className="w-full bg-slate-100 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 text-slate-500 font-bold">
            <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
            Mendeteksi Lokasi...
          </div>
        )}

        {status === 'ready' && (
          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4">
            <button 
              onClick={() => handlePresence('in')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 rounded-2xl shadow-lg shadow-emerald-100 flex flex-col items-center gap-2 transition-all"
            >
              <CheckCircle2 size={24} />
              <span>Absen Masuk</span>
            </button>
            <button 
              onClick={() => handlePresence('out')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-5 rounded-2xl shadow-lg shadow-amber-100 flex flex-col items-center gap-2 transition-all"
            >
              <Navigation size={24} className="rotate-45" />
              <span>Absen Pulang</span>
            </button>
          </div>
        )}

        {status === 'denied' && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl text-center space-y-3 animate-in shake-1">
            <XCircle size={48} className="mx-auto text-rose-500" />
            <h3 className="text-rose-800 font-bold">Di Luar Jangkauan</h3>
            <p className="text-rose-600 text-xs">Kamu berada {distance?.toFixed(0)}m dari sekolah. Jarak maksimal adalah {SCHOOL_COORDS.radius}m.</p>
            <button 
              onClick={checkLocation}
              className="text-rose-700 text-xs font-bold underline"
            >
              Coba Deteksi Ulang
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center space-y-3 animate-in zoom-in">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-100">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-emerald-800 font-bold text-lg">Presensi Berhasil!</h3>
            <p className="text-emerald-600 text-sm">Data kehadiranmu telah tercatat di server SMAN 2 Tanggul.</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-xs font-medium flex items-center gap-2">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <h4 className="font-bold text-slate-800 text-sm mb-4">Penting Diketahui</h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="p-1 bg-indigo-50 text-indigo-600 rounded">
              <Clock size={12} />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Absen masuk dilakukan paling lambat pukul <span className="font-bold">07:00 WIB</span>. Keterlambatan akan mengurangi poin disiplin.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="p-1 bg-indigo-50 text-indigo-600 rounded">
              <MapPin size={12} />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Pastikan GPS aktif dan akurasi tinggi. Pastikan kamu berada di dalam area SMAN 2 Tanggul.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Attendance;
