
import React, { useState } from 'react';
import { Search, Building2, ShieldCheck, ArrowRight, X, LayoutGrid } from 'lucide-react';

interface BranchLoginProps {
  branches: string[];
  onLogin: (branchName: string) => void;
}

export const BranchLogin: React.FC<BranchLoginProps> = ({ branches, onLogin }) => {
  const [search, setSearch] = useState('');
  
  const filteredBranches = branches.filter(b => 
    b.toLowerCase().includes(search.toLowerCase()) && b !== 'ADMIN (অ্যাডমিন)'
  );

  const isAdminAvailable = branches.includes('ADMIN (অ্যাডমিন)');

  return (
    <div className="min-h-screen bg-[#022c22] flex items-center justify-center p-4 md:p-8 font-['Hind_Siliguri'] overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>

      <div className="bg-white w-full max-w-4xl rounded-[3rem] md:rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
        
        {/* Left Side: Branding/Welcome */}
        <div className="md:w-2/5 bg-gradient-to-br from-emerald-900 to-emerald-700 p-12 text-white flex flex-col justify-between relative">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
               <Building2 size={32} className="text-emerald-300" />
            </div>
            <h1 className="text-3xl font-black leading-tight mb-4">পরিদর্শন পোর্টালে স্বাগতম</h1>
            <p className="text-emerald-100/70 text-sm font-medium leading-relaxed">
              সঠিক ডাটা এন্ট্রি নিশ্চিত করতে আপনার শাখাটি নির্বাচন করে লগইন করুন।
            </p>
          </div>
          
          <div className="relative z-10 pt-10">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck size={18} className="text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-widest">নিরাপদ সিস্টেম</span>
                </div>
                <p className="text-[10px] text-emerald-200/60 font-bold">আপনার দেওয়া তথ্য সরাসরি কেন্দ্রীয় শিটে সুরক্ষিতভাবে জমা হয়।</p>
            </div>
          </div>
        </div>

        {/* Right Side: Selection Terminal */}
        <div className="md:w-3/5 p-8 md:p-12 flex flex-col h-[600px] md:h-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-800 mb-2">আপনার শাখা খুঁজুন</h2>
            <div className="h-1.5 w-12 bg-emerald-500 rounded-full"></div>
          </div>

          {/* Search Box */}
          <div className="relative mb-6">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="শাখার নাম বা কোড দিয়ে খুঁজুন..."
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
                <button onClick={() => setSearch('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={18} />
                </button>
            )}
          </div>

          {/* Branch List Grid */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 mb-6">
            {filteredBranches.length > 0 ? (
                filteredBranches.map((branch) => (
                    <button
                        key={branch}
                        onClick={() => onLogin(branch)}
                        className="w-full flex items-center justify-between p-5 bg-white border-2 border-slate-50 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <Building2 size={18} />
                            </div>
                            <span className="text-sm font-black text-slate-700">{branch}</span>
                        </div>
                        <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </button>
                ))
            ) : (
                <div className="py-12 text-center">
                    <LayoutGrid size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-slate-400 font-bold">এই নামে কোনো শাখা পাওয়া যায়নি</p>
                </div>
            )}
          </div>

          {/* Admin Login Shortcut */}
          {isAdminAvailable && !search && (
            <button 
                onClick={() => onLogin('ADMIN (অ্যাডমিন)')}
                className="mt-auto flex items-center justify-center gap-3 p-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm hover:bg-slate-800 transition-all shadow-xl"
            >
                <ShieldCheck size={20} className="text-emerald-400" />
                অ্যাডমিন প্যানেল এ প্রবেশ করুন
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
