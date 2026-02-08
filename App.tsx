
import React, { useState, useEffect } from 'react';
import { HeaderForm } from './components/HeaderForm';
import { LoanEntryForm } from './components/LoanEntryForm';
import { ReportTable } from './components/ReportTable';
import { EditModal } from './components/EditModal';
import { ReportHeader, LoanEntry } from './types';
import { FileText, LayoutDashboard, Sparkles, ShieldCheck, FileDown, Loader2, Table, Cloud, Check, Trash2, HelpCircle, Share2, Info, ExternalLink, Github, Globe, MousePointer2, ChevronRight, ArrowUpRight, AlertTriangle, Eye, Lock, Copy, MailCheck, MousePointerClick } from 'lucide-react';
import { summarizeReport, validateEntries } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const App: React.FC = () => {
  const [header, setHeader] = useState<ReportHeader>(() => {
    const savedHeader = localStorage.getItem('mfi_report_header');
    return savedHeader ? JSON.parse(savedHeader) : {
      bankName: '',
      mfiName: '',
      disbursementArea: '',
      reportPeriod: '',
    };
  });

  const [entries, setEntries] = useState<LoanEntry[]>(() => {
    const savedEntries = localStorage.getItem('mfi_report_entries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  const [editingEntry, setEditingEntry] = useState<LoanEntry | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [validationResult, setValidationResult] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExcelExporting, setIsExcelExporting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showShareGuide, setShowShareGuide] = useState(false);
  
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(localStorage.getItem('mfi_gs_url') || '');
  const [autoSync, setAutoSync] = useState<boolean>(localStorage.getItem('mfi_auto_sync') === 'true');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncStatus, setLastSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    localStorage.setItem('mfi_report_header', JSON.stringify(header));
  }, [header]);

  useEffect(() => {
    localStorage.setItem('mfi_report_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('mfi_gs_url', googleSheetUrl);
    localStorage.setItem('mfi_auto_sync', autoSync.toString());
  }, [googleSheetUrl, autoSync]);

  const handleHeaderChange = (field: keyof ReportHeader, value: string) => {
    setHeader(prev => ({ ...prev, [field]: value }));
  };

  const syncToCloud = async (entriesToSync: LoanEntry[]) => {
    const unsyncedOnes = entriesToSync.filter(e => !e.isSynced);
    if (unsyncedOnes.length === 0) {
      alert("সেভ করার মতো কোনো নতুন বা সংশোধিত তথ্য নেই।");
      return;
    }
    if (!googleSheetUrl) {
      alert("গুগল অ্যাপ স্ক্রিপ্ট URL প্রদান করুন। ক্লাউড সেটিংসে এটি সেট করুন।");
      setShowHelp(true);
      return;
    }
    if (!header.bankName) {
      alert("ব্যাংকের নাম উল্লেখ করুন।");
      return;
    }

    setIsSyncing(true);
    try {
      await fetch(googleSheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          header,
          entries: unsyncedOnes,
          timestamp: new Date().toLocaleString('bn-BD')
        }),
      });

      const syncedIds = new Set(unsyncedOnes.map(e => e.id));
      setEntries(prev => prev.map(e => syncedIds.has(e.id) ? { ...e, isSynced: true } : e));
      setLastSyncStatus('success');
      setTimeout(() => setLastSyncStatus('idle'), 3000);
    } catch (error) {
      setLastSyncStatus('error');
      alert("গুগল শিটে সেভ করতে সমস্যা হয়েছে। আপনার ইন্টারনেট কানেকশন চেক করুন।");
    } finally {
      setIsSyncing(false);
    }
  };

  const addEntry = (entry: LoanEntry) => {
    const newEntry = { ...entry, isSynced: false };
    const updated = [...entries, newEntry];
    setEntries(updated);
    if (autoSync && googleSheetUrl && header.bankName) {
      syncToCloud([newEntry]);
    }
  };

  const updateEntry = (updatedEntry: LoanEntry) => {
    const updated = entries.map(e => e.id === updatedEntry.id ? { ...updatedEntry, isSynced: false } : e);
    setEntries(updated);
    setEditingEntry(null);
    if (autoSync && googleSheetUrl && header.bankName) {
      syncToCloud([{ ...updatedEntry, isSynced: false }]);
    }
  };

  const deleteEntry = (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে এই রেকর্ডটি মুছে ফেলতে চান?")) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const clearAllData = () => {
    if (window.confirm("সকল তথ্য মুছে নতুন রিপোর্ট শুরু করবেন?")) {
      setEntries([]);
      setHeader({ bankName: '', mfiName: '', disbursementArea: '', reportPeriod: '' });
      setSummary('');
      setValidationResult('');
      localStorage.removeItem('mfi_report_entries');
      localStorage.removeItem('mfi_report_header');
    }
  };

  const handleSummarize = async () => {
    if (entries.length === 0) return;
    setIsSummarizing(true);
    const text = await summarizeReport(entries);
    setSummary(text || '');
    setIsSummarizing(false);
  };

  const handleValidate = async () => {
    if (entries.length === 0) return;
    setIsValidating(true);
    const result = await validateEntries(entries);
    setValidationResult(result || '');
    setIsValidating(false);
  };

  const exportToPDF = async () => {
    const reportElement = document.getElementById('report-main-content');
    if (!reportElement || entries.length === 0) return;
    setIsExporting(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff', ignoreElements: (el) => el.classList.contains('pdf-exclude') });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 5, 5, pdfWidth - 10, pdfHeight - 10);
      pdf.save(`MFI_Report_${header.bankName || 'Report'}.pdf`);
    } catch (error) {
      alert("PDF তৈরি করতে সমস্যা হয়েছে।");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = () => {
    if (entries.length === 0) return;
    setIsExcelExporting(true);
    try {
      const dataToExport = entries.map((e, i) => ({
        'ক্র. নং': i + 1,
        'শাখা': e.branchName,
        'গ্রহীতার তথ্য': e.borrowerInfo,
        'খাত': e.loanSector,
        'তারিখ': e.disbursementDate,
        'ঋণের পরিমাণ': e.loanAmount,
        'মোট সুদ': e.totalInterest,
        'মন্তব্য': e.inspectionComments
      }));
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "InspectionReport");
      XLSX.writeFile(workbook, `MFI_Report_${header.bankName || 'Export'}.xlsx`);
    } catch (error) {
      alert("Excel তৈরি করতে সমস্যা হয়েছে।");
    } finally {
      setIsExcelExporting(false);
    }
  };

  const sectorData = entries.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.loanSector);
    if (existing) existing.value += curr.loanAmount;
    else acc.push({ name: curr.loanSector, value: curr.loanAmount });
    return acc;
  }, []);

  const unsyncedCount = entries.filter(e => !e.isSynced).length;

  const repoPath = "shamimulhassan0-boop/SNF-BANK-LOAN-DISBURSEMENT-SHEET";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(repoPath);
    alert("নামটি কপি করা হয়েছে।");
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50 font-['Hind_Siliguri']">
      <nav className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50 px-4 py-3 pdf-exclude">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-emerald-300" />
            <h1 className="text-xl font-bold leading-none tracking-tight">MFI Inspection Portal</h1>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={() => setShowShareGuide(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-md">
              <Share2 size={16} /> শেয়ার গাইড
            </button>
            <button onClick={() => setShowHelp(true)} className="bg-amber-400 hover:bg-amber-300 text-amber-950 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-md">
              <HelpCircle size={16} /> সাহায্য
            </button>
            <button 
              onClick={() => syncToCloud(entries)} 
              disabled={isSyncing || entries.length === 0 || unsyncedCount === 0} 
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md relative ${
                unsyncedCount === 0 ? 'bg-slate-200 text-slate-500 cursor-not-allowed' :
                lastSyncStatus === 'success' ? 'bg-emerald-400 text-emerald-900' : 'bg-white text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              {isSyncing ? <Loader2 size={18} className="animate-spin" /> : lastSyncStatus === 'success' ? <Check size={18} /> : <Cloud size={18} />} 
              {lastSyncStatus === 'success' ? 'শিটে সেভ হয়েছে' : `শিটে সেভ (${unsyncedCount})`}
            </button>
            <button onClick={exportToExcel} disabled={isExcelExporting || entries.length === 0} className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
              <Table size={18} /> Excel
            </button>
            <button onClick={exportToPDF} disabled={isExporting || entries.length === 0} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md">
              <FileDown size={18} /> PDF
            </button>
            <button onClick={clearAllData} className="bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md">
              <Trash2 size={18} /> নতুন রিপোর্ট
            </button>
          </div>
        </div>
      </nav>

      {/* Share Guide Modal */}
      {showShareGuide && (
        <div className="fixed inset-0 z-[110] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 pdf-exclude overflow-y-auto">
          <div className="bg-white max-w-5xl w-full rounded-3xl shadow-2xl p-8 relative animate-in zoom-in duration-300">
             <button onClick={() => setShowShareGuide(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">✕</button>
             
             <div className="text-center mb-8">
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-emerald-600" size={40} />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">অভিনন্দন! আপনার অ্যাপটি এখন লাইভ।</h2>
                <p className="text-slate-500 mt-2">ব্যবহার শুরু করার জন্য নিচের চেকলিস্টটি দেখুন।</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 shadow-sm">
                   <h3 className="font-bold text-emerald-800 mb-6 flex items-center gap-2"><ArrowUpRight size={20}/> ব্যবহার শুরুর চেকলিস্ট</h3>
                   <div className="space-y-4">
                      <p className="text-[11px] text-emerald-900 leading-relaxed font-semibold flex items-center gap-2"><Check size={14} className="text-emerald-600" /> ১. **Visit Site** বাটনে ক্লিক করে লিঙ্কটি ওপেন করুন।</p>
                      <p className="text-[11px] text-emerald-900 leading-relaxed font-semibold flex items-center gap-2"><Check size={14} className="text-emerald-600" /> ২. অ্যাপের ওপরের **"ক্লাউড সেটিংস"** এ যান।</p>
                      <p className="text-[11px] text-emerald-900 leading-relaxed font-semibold flex items-center gap-2"><Check size={14} className="text-emerald-600" /> ৩. আপনার **Google Apps Script URL** টি পেস্ট করুন।</p>
                      <p className="text-[11px] text-emerald-900 leading-relaxed font-semibold flex items-center gap-2"><Check size={14} className="text-emerald-600" /> ৪. একটি টেস্ট ডাটা এন্ট্রি দিয়ে চেক করুন শিটে সেভ হচ্ছে কি না।</p>
                   </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 shadow-sm">
                   <h3 className="font-bold text-blue-800 mb-6 flex items-center gap-2"><HelpCircle size={20}/> সমস্যা হলে কি করবেন?</h3>
                   <div className="space-y-4">
                      <p className="text-[11px] text-blue-900 leading-relaxed font-semibold">১. যদি লিঙ্কটি **404** দেখায়, তবে ২-৩ মিনিট পর আবার রিফ্রেশ করুন।</p>
                      <p className="text-[11px] text-blue-900 leading-relaxed font-semibold">২. যদি "Custom Domain" এরর দেখায়, তবে বক্সটি আবার খালি করে সেভ করুন।</p>
                      <p className="text-[11px] text-blue-900 leading-relaxed font-semibold">৩. লিঙ্কটি ব্রাউজারে **বুকমার্ক** করে রাখুন যাতে পরে সহজে খুঁজে পান।</p>
                   </div>
                </div>
             </div>

             <div className="mt-8 flex justify-center">
                <button onClick={() => setShowShareGuide(false)} className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl text-lg transform hover:scale-105 active:scale-95">এখনই কাজ শুরু করছি</button>
             </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 pdf-exclude overflow-y-auto">
          <div className="bg-white max-w-3xl w-full rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-slate-800">সিস্টেম কনফিগারেশন গাইড</h2>
                <button onClick={() => setShowHelp(false)} className="p-2 hover:bg-slate-100 rounded-lg">✕</button>
             </div>
             <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                   <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2"><Sparkles size={18}/> আধুনিক ফিচারসমূহ</h3>
                   <ul className="list-disc pl-5 space-y-1">
                     <li><strong>অটো ক্যালকুলেশন:</strong> পরিমাণ এবং হার দিলে সুদ ও কিস্তি নিজে থেকেই বের হবে।</li>
                     <li><strong>স্মার্ট এডিট:</strong> তথ্য ভুল হলে টেবিল থেকে এডিট করে পুনরায় আপডেট করা যাবে।</li>
                     <li><strong>ব্যাংক ভিত্তিক সর্টিং:</strong> প্রতিটি ব্যাংকের ডাটা শিটে আলাদা ট্যাবে জমা হবে।</li>
                   </ul>
                </div>
                <p><strong>গুগল শিট কানেকশন ধাপ:</strong> ক্লাউড সেটিংস থেকে আপনার Apps Script Web App URL প্রদান করুন।</p>
             </div>
             <div className="mt-6 text-center">
                <button onClick={() => setShowHelp(false)} className="bg-emerald-800 text-white px-8 py-2 rounded-lg font-bold hover:bg-emerald-900 transition-all">বন্ধ করুন</button>
             </div>
          </div>
        </div>
      )}

      <main id="report-main-content" className="max-w-[1400px] mx-auto px-4 mt-8 bg-white p-6 md:p-10 shadow-sm rounded-2xl border border-slate-200">
        <div className="text-center mb-10 border-b-4 border-slate-900 pb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">এমএফআই এর মাধ্যমে বিতরণকৃত ঋণ সরেজমিনে পরিদর্শন প্রতিবেদন</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mt-6 text-left max-w-3xl mx-auto font-bold text-slate-700">
                <div className="flex justify-between border-b border-slate-200 pb-1"><span>ব্যাংকের নাম</span> <span>: {header.bankName || "..."}</span></div>
                <div className="flex justify-between border-b border-slate-200 pb-1"><span>এমএফআই-এর নাম</span> <span>: {header.mfiName || "..."}</span></div>
                <div className="flex justify-between border-b border-slate-200 pb-1"><span>বিতরণকৃত এলাকা</span> <span>: {header.disbursementArea || "..."}</span></div>
                <div className="flex justify-between border-b border-slate-200 pb-1"><span>রিপোর্টের সময়কাল</span> <span>: {header.reportPeriod || "..."}</span></div>
            </div>
        </div>

        {entries.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12 pdf-exclude">
                <div className="lg:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                    <div className="flex items-center gap-2 mb-4">
                        <LayoutDashboard className="text-emerald-600" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">ঋণ খাতভিত্তিক বরাদ্দ চিত্র</h2>
                    </div>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sectorData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{fontSize: 11, fill: '#64748b'}} />
                                <YAxis tick={{fontSize: 11, fill: '#64748b'}} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {sectorData.map((entry, index) => <Cell key={`c-${index}`} fill={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6'][index % 6]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col shadow-inner group">
                    <h2 className="text-sm font-bold text-emerald-900 flex items-center gap-2 mb-3"><Sparkles size={16} className="text-emerald-500 animate-pulse" /> AI পরিদর্শন সারসংক্ষেপ</h2>
                    <div className="text-emerald-800 text-xs flex-grow overflow-y-auto max-h-48 whitespace-pre-wrap leading-relaxed">{summary || "পরিদর্শন শেষে এআই সারসংক্ষেপ জেনারেট করুন।"}</div>
                    <button onClick={handleSummarize} disabled={isSummarizing} className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                      {isSummarizing ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />} 
                      রিফ্রেশ সারসংক্ষেপ
                    </button>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl flex flex-col text-white shadow-xl shadow-slate-200">
                    <h2 className="text-sm font-bold flex items-center gap-2 mb-3"><ShieldCheck size={16} className="text-emerald-400" /> AI ডিজিটাল অডিট</h2>
                    <div className="text-slate-300 text-xs flex-grow overflow-y-auto max-h-48 whitespace-pre-wrap leading-relaxed">{validationResult || "ডাটা ইনপুট শেষে ডিজিটাল অডিট রিপোর্ট রান করুন।"}</div>
                    <button onClick={handleValidate} disabled={isValidating} className="mt-4 w-full py-2 bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-600 transition-all flex items-center justify-center gap-2">
                      {isValidating ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />} 
                      অডিট রান করুন
                    </button>
                </div>
            </div>
        )}

        <div className="pdf-exclude">
            <HeaderForm data={header} onChange={handleHeaderChange} googleSheetUrl={googleSheetUrl} onUrlChange={setGoogleSheetUrl} autoSync={autoSync} onSyncToggle={setAutoSync} />
            <LoanEntryForm onAdd={addEntry} />
        </div>
        
        <ReportTable entries={entries} onDelete={deleteEntry} onEdit={setEditingEntry} />
        
        {editingEntry && (
          <EditModal 
            entry={editingEntry} 
            onSave={updateEntry} 
            onClose={() => setEditingEntry(null)} 
          />
        )}

        {entries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-2xl pdf-exclude bg-slate-50/50">
                <div className="bg-slate-200 p-4 rounded-full mb-4">
                  <Table className="text-slate-400" size={48} />
                </div>
                <p className="text-slate-500 font-bold text-lg">এখনও কোনো তথ্য যোগ করা হয়নি</p>
                <p className="text-slate-400 text-sm mt-1">উপরে ফরম পূরণ করে নতুন তথ্য যোগ করুন</p>
            </div>
        )}
      </main>

      <footer className="mt-16 text-center text-slate-400 text-xs pb-12 pdf-exclude flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 opacity-60">
           <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
           <span>সিস্টেম লাইভ এবং সচল আছে</span>
        </div>
        <p>&copy; {new Date().getFullYear()} MFI Inspection Management System | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default App;
