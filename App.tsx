
import React, { useState, useEffect, useRef } from 'react';
import { HeaderForm } from './components/HeaderForm.tsx';
import { LoanEntryForm } from './components/LoanEntryForm.tsx';
import { ReportTable } from './components/ReportTable.tsx';
import { EditModal } from './components/EditModal.tsx';
import { Guidelines } from './components/Guidelines.tsx';
import { BranchLogin } from './components/BranchLogin.tsx';
import { ReportHeader, LoanEntry } from './types.ts';
import { LayoutDashboard, Loader2, Cloud, Check, LogOut, Share2, Copy, Users, X } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('mfi_user_branch'));
  const [userBranch, setUserBranch] = useState<string>(localStorage.getItem('mfi_user_branch') || '');
  const [isAdmin, setIsAdmin] = useState<boolean>(localStorage.getItem('mfi_user_branch') === 'ADMIN (অ্যাডমিন)');
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const defaultBanks = [
    "সোনালী ব্যাংক পিএলসি", "জনতা ব্যাংক পিএলসি", "অগ্রণী ব্যাংক পিএলসি", "রূপালী ব্যাংক পিএলসি", "বাংলাদেশ কৃষি ব্যাংক", "ইসলামী ব্যাংক বাংলাদেশ পিএলসি"
  ].sort((a, b) => a.localeCompare(b, 'bn'));

  const defaultBranches = ["(০০১) চুড়ামনকাটি", "(০০১৫) রাজারহাট", "(০০২) সালুয়া বাজার", "ADMIN (অ্যাডমিন)"];
  const defaultDistricts = ["যশোর", "খুলনা", "ঝিনাইদহ", "মাগুরা", "কুষ্টিয়া"];
  const defaultUpazilas = ["যশোর সদর", "চৌগাছা", "ঝিকরগাছা", "মনিরামপুর"];
  const defaultSectors = ["কলা চাষ", "কাপড়ের ব্যবসা", "গরু মোটাতাজা করন", "গাভী পালন", "ধান চাষ"];

  const [bankList, setBankList] = useState<string[]>(() => JSON.parse(localStorage.getItem('mfi_banks') || JSON.stringify(defaultBanks)));
  const [branchList, setBranchList] = useState<string[]>(() => JSON.parse(localStorage.getItem('mfi_branches') || JSON.stringify(defaultBranches)));
  const [districtList, setDistrictList] = useState<string[]>(() => JSON.parse(localStorage.getItem('mfi_districts') || JSON.stringify(defaultDistricts)));
  const [upazilaList, setUpazilaList] = useState<string[]>(() => JSON.parse(localStorage.getItem('mfi_upazilas') || JSON.stringify(defaultUpazilas)));
  const [sectorList, setSectorList] = useState<string[]>(() => JSON.parse(localStorage.getItem('mfi_sectors') || JSON.stringify(defaultSectors)));

  const [header, setHeader] = useState<ReportHeader>(() => JSON.parse(localStorage.getItem('mfi_report_header') || '{"bankName":"","mfiName":"শিশু নিলয় ফাউন্ডেশন (এসএনএফ)","disbursementArea":"","reportPeriod":""}'));
  const [entries, setEntries] = useState<LoanEntry[]>(() => JSON.parse(localStorage.getItem('mfi_report_entries') || '[]'));
  const [editingEntry, setEditingEntry] = useState<LoanEntry | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(localStorage.getItem('mfi_gs_url') || '');
  const [autoSync, setAutoSync] = useState<boolean>(localStorage.getItem('mfi_auto_sync') === 'true');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncStatus, setLastSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const isSyncingRef = useRef(false);

  useEffect(() => {
    localStorage.setItem('mfi_report_header', JSON.stringify(header));
    localStorage.setItem('mfi_report_entries', JSON.stringify(entries));
    localStorage.setItem('mfi_gs_url', googleSheetUrl);
    localStorage.setItem('mfi_auto_sync', autoSync.toString());
    localStorage.setItem('mfi_banks', JSON.stringify(bankList));
    localStorage.setItem('mfi_branches', JSON.stringify(branchList));
    localStorage.setItem('mfi_districts', JSON.stringify(districtList));
    localStorage.setItem('mfi_upazilas', JSON.stringify(upazilaList));
    localStorage.setItem('mfi_sectors', JSON.stringify(sectorList));
  }, [header, entries, googleSheetUrl, autoSync, bankList, branchList, districtList, upazilaList, sectorList]);

  const handleLogin = (branchName: string) => {
    localStorage.setItem('mfi_user_branch', branchName);
    setUserBranch(branchName);
    setIsAdmin(branchName === 'ADMIN (অ্যাডমিন)');
    setIsLoggedIn(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const syncToCloud = async (currentEntries: LoanEntry[]) => {
    if (isSyncingRef.current || !googleSheetUrl) return;
    const unsyncedOnes = currentEntries.filter(e => !e.isSynced);
    if (unsyncedOnes.length === 0) return;
    isSyncingRef.current = true;
    setIsSyncing(true);
    try {
      const formattedData = unsyncedOnes.map((entry) => ({
        "ID": entry.id, "ব্যাংক": header.bankName, "শাখার নাম": entry.branchName || userBranch,
        "ঋণ গ্রহীতার তথ্য": entry.borrowerInfo, "বিতরণকৃত ঋণের পরিমাণ": entry.loanAmount
      }));
      await fetch(googleSheetUrl, { method: 'POST', mode: 'no-cors', body: JSON.stringify(formattedData) });
      const syncedIds = new Set(unsyncedOnes.map(e => e.id));
      setEntries(prev => prev.map(e => syncedIds.has(e.id) ? { ...e, isSynced: true } : e));
      setLastSyncStatus('success');
      setTimeout(() => setLastSyncStatus('idle'), 3000);
    } catch (e) { setLastSyncStatus('error'); } finally { setIsSyncing(false); isSyncingRef.current = false; }
  };

  const addEntry = (entry: LoanEntry) => {
    const newEntry = { ...entry, userId: userBranch, isSynced: false };
    const updated = [...entries, newEntry];
    setEntries(updated);
    if (autoSync) syncToCloud(updated);
  };

  const handleLogout = () => { if (window.confirm("লগআউট করতে চান?")) { localStorage.removeItem('mfi_user_branch'); window.location.reload(); } };

  if (!isLoggedIn) {
    return <BranchLogin branches={branchList} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-40 bg-slate-50 font-['Hind_Siliguri']">
      <nav className="bg-[#022c22] text-white shadow-2xl sticky top-0 z-50 px-8 py-5 pdf-exclude">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg"><LayoutDashboard size={28} /></div>
            <h1 className="text-2xl font-black tracking-tight">এমএফআই পরিদর্শন পোর্টাল</h1>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => setShowSharePanel(true)} className="px-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[11px] font-black flex items-center gap-2 transition-all border border-white/10"><Share2 size={20} /> ইনভাইট</button>
            <button onClick={() => syncToCloud(entries)} disabled={isSyncing} className="px-8 py-4 bg-white text-emerald-950 rounded-2xl text-[11px] font-black flex items-center gap-2 transition-all">
              {isSyncing ? <Loader2 size={20} className="animate-spin" /> : <Cloud size={20} />} সেভ করুন
            </button>
            <button onClick={handleLogout} className="bg-rose-600 text-white px-6 py-4 rounded-2xl text-[11px] font-black hover:bg-rose-700"><LogOut size={20} /></button>
          </div>
        </div>
      </nav>

      {showSharePanel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl p-10 text-center relative">
              <button onClick={() => setShowSharePanel(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600"><X size={24} /></button>
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner"><Share2 size={36} /></div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">সহকর্মীদের আমন্ত্রণ জানান</h2>
              <p className="text-slate-500 font-bold mb-8">সবাই একই লিঙ্কে ঢুকে নিজ নিজ শাখা থেকে ডাটা এন্ট্রি করতে পারবেন</p>
              
              <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 mb-8">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Portal Link</p>
                 <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                    <span className="text-xs font-bold text-emerald-800 truncate flex-1">{window.location.href}</span>
                    <button onClick={handleCopyLink} className={`p-3 rounded-xl transition-all ${copySuccess ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                       {copySuccess ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                 </div>
              </div>

              <div className="flex justify-center mb-8">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`} 
                  alt="QR Code" 
                  className="w-40 h-40 border-8 border-slate-50 rounded-2xl shadow-sm"
                />
              </div>

              <button onClick={() => setShowSharePanel(false)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all">বন্ধ করুন</button>
           </div>
        </div>
      )}

      <main className="max-w-[1800px] mx-auto px-6 mt-12 bg-white p-10 shadow-2xl rounded-[3rem]">
        <HeaderForm data={header} onChange={(f, v) => setHeader(p => ({...p, [f]: v}))} googleSheetUrl={googleSheetUrl} onUrlChange={setGoogleSheetUrl} autoSync={autoSync} onSyncToggle={setAutoSync} isAdmin={isAdmin} bankList={bankList} setBankList={setBankList} branchList={branchList} setBranchList={setBranchList} districtList={districtList} setDistrictList={setDistrictList} upazilaList={upazilaList} setUpazilaList={setUpazilaList} sectorList={sectorList} setSectorList={setSectorList} />
        <LoanEntryForm onAdd={addEntry} branchList={branchList} districtList={districtList} upazilaList={upazilaList} sectorList={sectorList} />
        <ReportTable entries={entries} onDelete={(id) => setEntries(prev => prev.filter(e => e.id !== id))} onEdit={setEditingEntry} />
        {editingEntry && <EditModal entry={editingEntry} onSave={(u) => { setEntries(entries.map(e => e.id === u.id ? u : e)); setEditingEntry(null); }} onClose={() => setEditingEntry(null)} />}
        <Guidelines />
      </main>
    </div>
  );
};
export default App;
