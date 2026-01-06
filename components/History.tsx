
import React from 'react';
import { PointLog } from '../types';
import { 
  History as HistoryIcon, 
  Plus, 
  Minus, 
  Search,
  Calendar,
  Filter
} from 'lucide-react';

const PointHistory: React.FC<{ history: PointLog[] }> = ({ history }) => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Riwayat Poin</h2>
          <p className="text-slate-500 text-sm mt-1">Lacak semua aktivitas dan poin disiplin.</p>
        </div>
        <div className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400">
          <Filter size={18} />
        </div>
      </header>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Cari aktivitas..." 
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
            <HistoryIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">Belum ada aktivitas tercatat.</p>
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-4 transition-transform active:scale-[0.98]"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                item.type === 'reward' ? 'bg-emerald-50 text-emerald-500' : 
                item.type === 'violation' ? 'bg-rose-50 text-rose-500' : 
                'bg-blue-50 text-blue-500'
              }`}>
                {item.points > 0 ? <Plus size={20} /> : <Minus size={20} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 truncate leading-tight">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={10} className="text-slate-400" />
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-lg font-bold ${
                  item.points > 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {item.points > 0 ? '+' : ''}{item.points}
                </span>
                <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Poin</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="text-center pt-4">
        <button className="text-indigo-600 text-sm font-bold">Muat Lebih Banyak</button>
      </div>
    </div>
  );
};

export default PointHistory;
