
import React, { useState, useEffect, useRef } from 'react';
import { HeaderForm } from './components/HeaderForm';
import { LoanEntryForm } from './components/LoanEntryForm';
import { ReportTable } from './components/ReportTable';
import { EditModal } from './components/EditModal';
import { Guidelines } from './components/Guidelines';
import { ReportHeader, LoanEntry } from './types';
import { LayoutDashboard, Loader2, Cloud, Check, LogOut, FileSpreadsheet, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('mfi_user_branch'));
  const [userBranch, setUserBranch] = useState<string>(localStorage.getItem('mfi_user_branch') || '');
  const [isAdmin, setIsAdmin] = useState<boolean>(localStorage.getItem('mfi_user_branch') === 'ADMIN (অ্যাডমিন)');
  
  // ডিফল্ট ডাটা - সকল ব্যাংক
  const defaultBanks = [
    // রাষ্ট্রায়ত্ত বাণিজ্যিক ব্যাংক
    "সোনালী ব্যাংক পিএলসি", "জনতা ব্যাংক পিএলসি", "অগ্রণী ব্যাংক পিএলসি", "রূপালী ব্যাংক পিএলসি", "বেসিক ব্যাংক লিমিটেড", "বিডিবিএল",
    // বিশেষায়িত ব্যাংক
    "বাংলাদেশ কৃষি ব্যাংক", "রাজশাহী কৃষি উন্নয়ন ব্যাংক",
    // বেসরকারি বাণিজ্যিক ব্যাংক (প্রচলিত)
    "পূবালী ব্যাংক পিএলসি", "উত্তরা ব্যাংক পিএলসি", "এবি ব্যাংক পিএলসি", "আইএফআইসি ব্যাংক পিএলসি", "ইউনাইটেড কমার্শিয়াল ব্যাংক (UCB)", 
    "সিটি ব্যাংক পিএলসি", "ন্যাশনাল ব্যাংক লিমিটেড", "এনসিসি ব্যাংক পিএলসি", "প্রাইম ব্যাংক পিএলসি", "সাউথইস্ট ব্যাংক পিএলসি", 
    "ঢাকা ব্যাংক পিএলসি", "ডাচ-বাংলা ব্যাংক পিএলসি", "মার্কেন্টাইল ব্যাংক পিএলসি", "স্ট্যান্ডার্ড ব্যাংক পিএলসি", "ওয়ান ব্যাংক পিএলসি", 
    "ইস্টার্ন ব্যাংক পিএলসি (EBL)", "প্রিমিয়ার ব্যাংক পিএলসি", "মিউচুয়াল ট্রাস্ট ব্যাংক পিএলসি", "ব্র্যাক ব্যাংক পিএলসি", 
    "ট্রাস্ট ব্যাংক পিএলসি", "যমুনা ব্যাংক পিএলসি", "এনআরবি কমার্শিয়াল ব্যাংক", "সাউথ বাংলা এগ্রিকালচার ব্যাংক", "মিডল্যান্ড ব্যাংক", 
    "মধুমতি ব্যাংক", "এনআরবি ব্যাংক", "মেঘনা ব্যাংক", "পদ্মা ব্যাংক", "কমিউনিটি ব্যাংক বাংলাদেশ", "বেঙ্গল কমার্শিয়াল ব্যাংক", "গ্লোবাল ব্যাংক",
    // ইসলামী ব্যাংকসমূহ
    "ইসলামী ব্যাংক বাংলাদেশ পিএলসি", "আল-আরাফাহ ইসলামী ব্যাংক", "সোশ্যাল ইসলামী ব্যাংক", "এক্সিম ব্যাংক", "শাহজালাল ইসলামী ব্যাংক", 
    "ফার্স্ট সিকিউরিটি ইসলামী ব্যাংক", "ইউনিয়ন ব্যাংক পিএলসি", "গ্লোবাল ইসলামী ব্যাংক", "আইসিবি ইসলামিক ব্যাংক",
    // বিদেশি ব্যাংক
    "স্ট্যান্ডার্ড চার্টার্ড ব্যাংক", "স্টেট ব্যাংক অব ইন্ডিয়া", "হাবিব ব্যাংক", "সিটি ব্যাংক এনএ", "এইচএসবিসি", "উরি ব্যাংক", "ব্যাংক আলফালাহ"
  ].sort((a, b) => a.localeCompare(b, 'bn'));

  const defaultBranches = [
    "(০০১) চুড়ামনকাটি", "(০০১৫) রাজারহাট", "(০০২) সালুয়া বাজার", "(০০৩) পুড়াপাড়া", "(০০৪) কায়েমখোলা",
    "(০০৫) কোটচাঁদপুর", "(০০৬) চৌগাছা-০১", "(০০৭) বড় ধোপাদি", "(০০৮) ভৈরব", "(০০৯) মহেশপুর-০১",
    "(০১০) দত্তনগর", "(০১১) বারোবাজার", "(০১২) হাসিমপুর", "(০১৩) খাজুরা", "(০১৪) নাভারন",
    "(০১৬) খালিশপুর", "(০১৭) পুলেরহাট-০১", "(০১৮) জীবননগর-০১", "(০১৯) আন্দুলবাড়ীয়া", "(০২০) ঝিকরগাছা",
    "(০২১) দর্শনা", "(০২২) গ্যান্য্যা", "(০২৩) সীমাখালী", "(০২৫) আলঙ্গী", "(০২৬) মেহেরপুর",
    "(০২৭) বাড়াদী", "(০২৮) চুয়াডাঙ্গা", "(০২৯) সরোজগঞ্জ", "(০৩০) কার্পাসডাঙ্গা", "(০৩১) বাঁকড়া",
    "(০৩২) মুজিবনগর", "(০৩৩) বাগআঁচড়া", "(০৩৪) ছাতিয়ানতলা", "(০৩৫) বসুন্দিয়া", "(০৩৬) নওয়াপাড়া",
    "(০৩৭) ফুলতলা", "(০৩৮) দৌলতপুর", "(০৩৯) দামুড়হুদা", "(০৪০) আসমানখালী", "(০৪১) ডাকবাংলা",
    "(০৪২) হাটবোয়ালিয়া", "(০৪৩) মাগুরা", "(০৪৪) আলমডাঙ্গা", "(০৪৫) শার্শা", "(০৪৬) মণিরামপুর",
    "(০৪৭) কালীগঞ্জ", "(০৪৮) ঝিনাইদহ", "(০৪৯) আরপাড়া", "(০৫০) গাংনী", "(০৫১) কেশবপুর",
    "(০৫২) নেহালপুর", "(০৫৩) কুষ্টিয়া সদর", "(০৫৪) ঝাউদিয়া", "(০৫৫) পান্টি", "(০৫৬) হরিনারায়ণপুর",
    "(০৫৭) পোড়াদহ", "(০৫৮) হাটগোপালপুর", "(০৫৯) হরিণাকুন্ডু", "(০৬০) ঘোড়দাড়ী", "(০৬১) বামন্দী",
    "(০৬২) কাথুলী", "(০৬৩) মোহাম্মদপুর", "(০৬৪) নড়াইল সদর", "(০৬৫) পাটকেলঘাটা", "(০৬৬) লকপুর",
    "(০৬৭) রাজগঞ্জ", "(০৬৮) গড়পাড়া", "(০৬৯) বাঘারপাড়া", "(০৭০) নারিকেলবাড়ীয়া-বি", "(০৭১) নারিকেলবাড়ীয়া-জে",
    "(০৭২) পুলেরহাট-০২", "(০৭৩) চৌগাছা-০২", "(০৭৪) মহেশপুর-০২", "(০৭৫) জীবননগর-০২", "(০৭৬) লোহাগড়া",
    "(০৭৭) ভেড়ামারা", "(০৭৮) মিরপুর", "(০৭৯) আমলা", "(০৮০) কুষ্টিয়া দৌলতপুর", "(০৮১) কুচিয়াম মোড়া",
    "(০৮২) ঈশ্বরদী", "(০৮৩) পাবনা সদর", "(০৮৪) মুলাডুলি", "(০৮৫) জালালপুর", "(০৮৬) আটঘরিয়া",
    "ADMIN (অ্যাডমিন)"
  ];

  const defaultDistricts = ["যশোর", "খুলনা", "সাতক্ষীরা", "বাগেরহাট", "ঝিনাইদহ", "মাগুরা", "নড়াইল", "কুষ্টিয়া", "চুয়াডাঙ্গা", "মেহেরপুর", "ফরিদপুর", "পাবনা", "নাটোর"];
  const defaultUpazilas = ["যশোর সদর", "চৌগাছা", "ঝিকরগাছা", "মনিরামপুর", "কেশবপুর", "অভয়নগর", "বাঘারপাড়া", "শার্শা", "সদর"];
  const defaultSectors = [
    "কলা চাষ", "কাপড়ের ব্যবসা", "গরু মোটাতাজা করন", "গাভী পালন", "গৃহ নির্মান", "গৃহ নির্মান (ধান চাষ)",
    "জমি ক্রয়", "জমি ক্রয় (গৃহ নির্মান)", "জমি বন্ধক (ধান চাষ)", "ড্রাগন চাষ", "ধান চাষ", "পান চাষ",
    "পেয়ারা চাষ", "ফল চাষ", "বানিজ্য গৃহ নির্মাণ", "ভুট্টা চাষ", "মাছ চাষ", "মাল্টা চাষ", "সবজি চাষ", "সিটি গোল্ড"
  ];

  // ড্রপডাউন লিস্টগুলোর স্টেট
  const [bankList, setBankList] = useState<string[]>(() => {
    const saved = localStorage.getItem('mfi_banks');
    return saved ? JSON.parse(saved) : defaultBanks;
  });
  const [branchList, setBranchList] = useState<string[]>(() => {
    const saved = localStorage.getItem('mfi_branches');
    return saved ? JSON.parse(saved) : defaultBranches;
  });
  const [districtList, setDistrictList] = useState<string[]>(() => {
    const saved = localStorage.getItem('mfi_districts');
    return saved ? JSON.parse(saved) : defaultDistricts;
  });
  const [upazilaList, setUpazilaList] = useState<string[]>(() => {
    const saved = localStorage.getItem('mfi_upazilas');
    return saved ? JSON.parse(saved) : defaultUpazilas;
  });
  const [sectorList, setSectorList] = useState<string[]>(() => {
    const saved = localStorage.getItem('mfi_sectors');
    return saved ? JSON.parse(saved) : defaultSectors;
  });

  const [header, setHeader] = useState<ReportHeader>(() => {
    const savedHeader = localStorage.getItem('mfi_report_header');
    return savedHeader ? JSON.parse(savedHeader) : { bankName: '', mfiName: 'শিশু নিলয় ফাউন্ডেশন (এসএনএফ)', disbursementArea: '', reportPeriod: '' };
  });

  const [entries, setEntries] = useState<LoanEntry[]>(() => {
    const savedEntries = localStorage.getItem('mfi_report_entries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  const [editingEntry, setEditingEntry] = useState<LoanEntry | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(localStorage.getItem('mfi_gs_url') || '');
  const [autoSync, setAutoSync] = useState<boolean>(localStorage.getItem('mfi_auto_sync') === 'true');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncStatus, setLastSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const isSyncingRef = useRef(false);

  useEffect(() => { localStorage.setItem('mfi_report_header', JSON.stringify(header)); }, [header]);
  useEffect(() => { localStorage.setItem('mfi_report_entries', JSON.stringify(entries)); }, [entries]);
  useEffect(() => {
    localStorage.setItem('mfi_gs_url', googleSheetUrl);
    localStorage.setItem('mfi_auto_sync', autoSync.toString());
  }, [googleSheetUrl, autoSync]);

  useEffect(() => { localStorage.setItem('mfi_banks', JSON.stringify(bankList)); }, [bankList]);
  useEffect(() => { localStorage.setItem('mfi_branches', JSON.stringify(branchList)); }, [branchList]);
  useEffect(() => { localStorage.setItem('mfi_districts', JSON.stringify(districtList)); }, [districtList]);
  useEffect(() => { localStorage.setItem('mfi_upazilas', JSON.stringify(upazilaList)); }, [upazilaList]);
  useEffect(() => { localStorage.setItem('mfi_sectors', JSON.stringify(sectorList)); }, [sectorList]);

  const handleLogout = () => {
    if (window.confirm("আপনি কি লগআউট করতে চান? সকল তথ্য সংরক্ষিত থাকবে।")) {
      localStorage.removeItem('mfi_user_branch');
      setIsLoggedIn(false);
      setUserBranch('');
      setIsAdmin(false);
    }
  };

  const syncToCloud = async (currentEntries: LoanEntry[]) => {
    if (isSyncingRef.current) return;
    const unsyncedOnes = currentEntries.filter(e => !e.isSynced);
    if (unsyncedOnes.length === 0 || !googleSheetUrl) return;

    isSyncingRef.current = true;
    setIsSyncing(true);

    try {
      const formattedData = unsyncedOnes.map((entry) => {
        return {
          "ID": entry.id,
          "ব্যাংক": header.bankName,
          "ক্র. নং": currentEntries.indexOf(entry) + 1,
          "শাখার নাম": entry.branchName || userBranch,
          "ঋণ গ্রহীতার নাম:, স্বামীর নাম:, গ্রাম: ও মোবাইল নং-": entry.borrowerInfo,
          "উপজেলা": entry.upazila,
          "জেলা": entry.district,
          "ঋণের খাত": entry.loanSector,
          "ঋণ মঞ্জুরী ও বিতরণ এর তারিখ": entry.disbursementDate,
          "বিতরণকৃত ঋণের পরিমাণ": entry.loanAmount,
          "গ্রাহক পর্যায়ে সুদের হার (ক্রমহ্রাসমান/ফ্ল্যাট)": entry.interestRate,
          "বিতরণকৃত ঋণের মোট ধার্যকৃত সুদের পরিমাণ": entry.totalInterest,
          "নীতিমালা অনুযায়ী অন্যান্য আদায় (বীমা, পাশ বই, আবেদন পত্র ফি ইত্যাদি)": entry.otherCollections,
          "ঋণের মেয়াদকাল": entry.loanDuration,
          "কিস্তির সংখ্যা": entry.installmentCount,
          "কিস্তির পরিমাণ": entry.installmentAmount,
          "পাশ বইয়ে হালনাগাদ লেনদেন সঠিকভাবে লিপিবদ্ধ করা হয়েছে কিনা": entry.passbookUpdated ? "হ্যাঁ" : "না",
          "ঋণ আদায় শুরুর তারিখ (যদি আদায় থাকে)": entry.collectionStartDate,
          "পরিদর্শন দলের মন্তব্য": entry.inspectionComments
        };
      });

      await fetch(googleSheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      const syncedIds = new Set(unsyncedOnes.map(e => e.id));
      setEntries(prev => prev.map(e => syncedIds.has(e.id) ? { ...e, isSynced: true } : e));
      setLastSyncStatus('success');
      setTimeout(() => setLastSyncStatus('idle'), 3000);
    } catch (error) { 
      console.error("Sync Error:", error);
      setLastSyncStatus('error'); 
    } finally { 
      setIsSyncing(false);
      isSyncingRef.current = false;
    }
  };

  const deleteEntry = (id: string) => {
    const entryToDelete = entries.find(e => e.id === id);
    if (!entryToDelete) return;
    if (isAdmin || (!entryToDelete.isSynced && entryToDelete.userId === userBranch)) {
      if (window.confirm("আপনি কি এই রেকর্ডটি মুছতে চান?")) {
        setEntries(prev => prev.filter(e => e.id !== id));
      }
    } else {
      alert("ইতিমধ্যে সেভ হওয়া ডাটা মুছতে অ্যাডমিনের সহায়তা নিন।");
    }
  };

  const addEntry = (entry: LoanEntry) => {
    const newEntry = { ...entry, userId: userBranch, isSynced: false };
    const updated = [...entries, newEntry];
    setEntries(updated);
    if (autoSync) syncToCloud(updated);
  };

  const updateEntry = (updatedEntry: LoanEntry) => {
    const updated = { ...updatedEntry, isSynced: false };
    const updatedList = entries.map(e => e.id === updated.id ? updated : e);
    setEntries(updatedList);
    setEditingEntry(null);
    if (autoSync) syncToCloud(updatedList);
  };

  const exportToExcel = () => {
    if (entries.length === 0) return;
    const worksheetData = entries.map((entry, index) => ({
      "ক্র. নং": index + 1,
      "শাখার নাম": entry.branchName,
      "ঋণ গ্রহীতার তথ্য": entry.borrowerInfo,
      "উপজেলা": entry.upazila,
      "জেলা": entry.district,
      "খাত": entry.loanSector,
      "বিতরণ তারিখ": entry.disbursementDate,
      "পরিমাণ": entry.loanAmount,
      "সুদ": entry.totalInterest,
      "মন্তব্য": entry.inspectionComments
    }));
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inspection Data");
    XLSX.utils.writeFile(wb, `Report_${header.bankName || 'SNF'}.xlsx`);
  };

  const exportToPDF = async () => {
    const reportArea = document.getElementById('report-main-content');
    if (!reportArea || entries.length === 0) return;
    try {
      const canvas = await html2canvas(reportArea, { scale: 1.5 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a3'); 
      pdf.addImage(imgData, 'PNG', 5, 5, pdf.internal.pageSize.getWidth() - 10, (canvas.height * (pdf.internal.pageSize.getWidth() - 10)) / canvas.width);
      pdf.save(`Inspection_${header.bankName || 'SNF'}.pdf`);
    } catch (e) { console.error(e); }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#022c22] flex items-center justify-center p-6 font-['Hind_Siliguri']">
        <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl p-12 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-8">শাখা লগইন</h2>
          <select 
            onChange={(e) => {
              const b = e.target.value;
              if (b) {
                localStorage.setItem('mfi_user_branch', b);
                setUserBranch(b);
                setIsAdmin(b === 'ADMIN (অ্যাডমিন)');
                setIsLoggedIn(true);
              }
            }}
            className="w-full p-6 bg-slate-50 border-4 border-slate-100 rounded-[2.5rem] outline-none focus:border-emerald-500 text-xl font-black text-slate-800 transition-all text-center"
          >
            <option value="">-- শাখা নির্বাচন করুন --</option>
            {branchList.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <p className="mt-8 text-slate-400 text-sm font-bold italic">পরিদর্শন রিপোর্ট ম্যানেজমেন্ট সিস্টেম v3.5</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-40 bg-slate-50 font-['Hind_Siliguri']">
      <nav className="bg-[#022c22] text-white shadow-2xl sticky top-0 z-50 px-8 py-5 pdf-exclude">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg"><LayoutDashboard size={28} /></div>
            <h1 className="text-2xl font-black leading-none tracking-tight">এমএফআই পরিদর্শন পোর্টাল</h1>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => syncToCloud(entries)} disabled={isSyncing || entries.length === 0} className={`px-8 py-4 rounded-2xl text-[11px] font-black flex items-center gap-2 shadow-2xl transition-all active:scale-95 ${lastSyncStatus === 'success' ? 'bg-emerald-400 text-emerald-950' : 'bg-white text-emerald-950 hover:bg-emerald-50'}`}>
              {isSyncing ? <Loader2 size={20} className="animate-spin" /> : lastSyncStatus === 'success' ? <Check size={20} /> : <Cloud size={20} />} 
              {lastSyncStatus === 'success' ? 'সিঙ্ক হয়েছে' : 'শিটে সেভ'}
            </button>
            <button onClick={exportToExcel} className="bg-blue-600 text-white px-6 py-4 rounded-2xl text-[11px] font-black flex items-center gap-2 hover:bg-blue-700 transition-all"><FileSpreadsheet size={20} /> Excel</button>
            <button onClick={exportToPDF} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black flex items-center gap-2 hover:bg-emerald-700 transition-all"><FileDown size={20} /> PDF</button>
            <button onClick={handleLogout} className="bg-rose-600 text-white px-6 py-4 rounded-2xl text-[11px] font-black hover:bg-rose-700 transition-all"><LogOut size={20} /></button>
          </div>
        </div>
      </nav>

      <main id="report-main-content" className="max-w-[1800px] mx-auto px-6 md:px-12 mt-12 bg-white p-10 md:p-14 shadow-2xl rounded-[3rem] border border-slate-200">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-8">এমএফআই এর মাধ্যমে বিতরণকৃত ঋণ সরেজমিনে পরিদর্শন প্রতিবেদন</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-4xl mx-auto font-black text-slate-700 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <div>ব্যাংকের নাম: <span className="text-emerald-800">{header.bankName || "—"}</span></div>
                <div>এমএফআই: <span className="text-emerald-800">{header.mfiName || "—"}</span></div>
                <div>এলাকা: <span className="text-emerald-800">{header.disbursementArea || "—"}</span></div>
                <div>ত্রৈমাসিক: <span className="text-emerald-800">{header.reportPeriod || "—"}</span></div>
            </div>
        </div>

        <div className="pdf-exclude">
            <HeaderForm 
              data={header} 
              onChange={(f, v) => setHeader(p => ({...p, [f]: v}))} 
              googleSheetUrl={googleSheetUrl} 
              onUrlChange={setGoogleSheetUrl} 
              autoSync={autoSync} 
              onSyncToggle={setAutoSync}
              isAdmin={isAdmin}
              bankList={bankList}
              setBankList={setBankList}
              branchList={branchList}
              setBranchList={setBranchList}
              districtList={districtList}
              setDistrictList={setDistrictList}
              upazilaList={upazilaList}
              setUpazilaList={setUpazilaList}
              sectorList={sectorList}
              setSectorList={setSectorList}
            />
            <LoanEntryForm 
              onAdd={addEntry} 
              branchList={branchList}
              districtList={districtList}
              upazilaList={upazilaList}
              sectorList={sectorList}
            />
        </div>
        
        <ReportTable entries={entries} onDelete={deleteEntry} onEdit={setEditingEntry} />
        {editingEntry && <EditModal entry={editingEntry} onSave={updateEntry} onClose={() => setEditingEntry(null)} />}
        <Guidelines />
      </main>
    </div>
  );
};

export default App;
