
import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  ShieldAlert, 
  Award, 
  PlusCircle, 
  ChevronRight,
  Info,
  QrCode
} from 'lucide-react';
import { Student, PointLog } from '../types';
import { REWARD_TYPES, VIOLATION_TYPES } from '../constants';

interface ProfileProps {
  student: Student;
  onAddAction: (log: PointLog) => void;
}

const Profile: React.FC<ProfileProps> = ({ student, onAddAction }) => {
  const [showTeacherPanel, setShowTeacherPanel] = useState(false);

  const handleQuickAction = (type: 'reward' | 'violation', action: any) => {
    onAddAction({
      id: Math.random().toString(36).substr(2, 9),
      studentId: student.id,
      title: action.label,
      description: `Input manual via panel guru`,
      points: action.points,
      type: type,
      date: Date.now()
    });
    setShowTeacherPanel(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <section className="text-center pt-4">
        <div className="relative inline-block">
          <img 
            src={student.avatar} 
            alt="Avatar" 
            className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl object-cover mx-auto"
          />
          <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg">
            <QrCode size={18} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mt-4">{student.name}</h2>
        <p className="text-slate-500 font-medium">{student.class} • NISN {student.id}</p>
      </section>

      {/* Admin/Teacher Simulation Panel */}
      <section className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5 overflow-hidden relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1 rounded text-white">
              <ShieldAlert size={14} />
            </div>
            <h3 className="font-bold text-indigo-900 text-sm">Mode Guru (Simulasi)</h3>
          </div>
          <button 
            onClick={() => setShowTeacherPanel(!showTeacherPanel)}
            className="text-indigo-600 text-xs font-bold underline"
          >
            {showTeacherPanel ? 'Tutup' : 'Tambah Poin/Laporan'}
          </button>
        </div>
        <p className="text-indigo-700 text-[11px] opacity-75 mb-4">Panel ini disimulasikan untuk menunjukkan fitur input bagi tenaga kependidikan.</p>

        {showTeacherPanel && (
          <div className="space-y-4 mt-4 animate-in slide-in-from-top-4">
             <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Penghargaan</p>
                <div className="flex flex-wrap gap-2">
                  {REWARD_TYPES.map(r => (
                    <button 
                      key={r.id}
                      onClick={() => handleQuickAction('reward', r)}
                      className="bg-white px-3 py-2 rounded-xl border border-indigo-200 text-[11px] font-bold text-indigo-700 flex items-center gap-1 shadow-sm active:scale-95"
                    >
                      <Award size={12} /> {r.label} (+{r.points})
                    </button>
                  ))}
                </div>
             </div>
             <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Pelanggaran</p>
                <div className="flex flex-wrap gap-2">
                  {VIOLATION_TYPES.map(v => (
                    <button 
                      key={v.id}
                      onClick={() => handleQuickAction('violation', v)}
                      className="bg-white px-3 py-2 rounded-xl border border-rose-200 text-[11px] font-bold text-rose-700 flex items-center gap-1 shadow-sm active:scale-95"
                    >
                      <ShieldAlert size={12} /> {v.label} ({v.points})
                    </button>
                  ))}
                </div>
             </div>
          </div>
        )}
      </section>

      {/* Settings List */}
      <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <MenuItem icon={<User size={20} className="text-slate-400" />} label="Data Diri" detail="Lengkap" />
        <MenuItem icon={<Settings size={20} className="text-slate-400" />} label="Pengaturan Aplikasi" detail="" />
        <MenuItem icon={<Info size={20} className="text-slate-400" />} label="Pusat Bantuan" detail="" />
        <MenuItem 
          icon={<LogOut size={20} className="text-rose-500" />} 
          label="Keluar" 
          detail="" 
          last 
          destructive 
        />
      </section>

      <footer className="text-center py-6">
        <p className="text-[10px] text-slate-400 font-medium">SMAN 2 TANGGUL - VERSI 2.1.0</p>
        <p className="text-[10px] text-slate-300">Proudly Developed for Excellence</p>
      </footer>
    </div>
  );
};

const MenuItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  detail: string; 
  last?: boolean;
  destructive?: boolean;
}> = ({ icon, label, detail, last, destructive }) => (
  <button className={`w-full flex items-center justify-between p-4 active:bg-slate-50 transition-colors ${!last && 'border-b border-slate-100'}`}>
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 flex items-center justify-center">
        {icon}
      </div>
      <span className={`font-bold text-sm ${destructive ? 'text-rose-500' : 'text-slate-700'}`}>{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 font-medium">{detail}</span>
      <ChevronRight size={16} className="text-slate-300" />
    </div>
  </button>
);

export default Profile;
