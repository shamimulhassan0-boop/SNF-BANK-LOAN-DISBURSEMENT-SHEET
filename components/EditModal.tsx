
import React, { useState, useEffect, useCallback } from 'react';
import { LoanEntry } from '../types.ts';
import { X, Save, Calculator, AlertCircle, ChevronDown, Calendar, MapPin, User, Banknote } from 'lucide-react';

interface EditModalProps {
  entry: LoanEntry;
  onSave: (updated: LoanEntry) => void;
  onClose: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({ entry, onSave, onClose }) => {
  const [formData, setFormData] = useState<LoanEntry>(entry);
  
  const interestRates = ["১৫% (ক্রমহ্রাসমান)", "১৮% (ক্রমহ্রাসমান)", "২৪% (ক্রমহ্রাসমান)", "১০% (ফ্ল্যাট)", "১২% (ফ্ল্যাট)"];
  const loanDurations = ["৬ মাস", "১২ মাস", "১৮ মাস", "২৪ মাস"];
  const installmentCounts = ["১২ টি", "২৪ টি", "৪৬ টি", "৫২ টি"];

  const handleChange = (field: keyof LoanEntry, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatMobileInText = (text: string) => {
    if (text.includes("মোবাইল নং:")) {
      const parts = text.split("মোবাইল নং:");
      const beforeMobile = parts[0];
      const mobilePart = parts[1] || "";
      
      const digits = mobilePart.replace(/[^0-9]/g, '').substring(0, 11);
      let formattedMobile = digits;
      if (digits.length > 5) {
        formattedMobile = `${digits.substring(0, 5)}-${digits.substring(5)}`;
      }
      
      return `${beforeMobile}মোবাইল নং: ${formattedMobile}`;
    }
    return text;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="bg-emerald-800 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg"><Calculator size={24} /></div>
            <div>
              <h3 className="font-black text-xl leading-tight">তথ্য সংশোধন করুন</h3>
              <p className="text-[10px] uppercase font-bold text-emerald-300 tracking-widest">Update Loan Inspection Entry</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={24} /></button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-8">
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2 border-b border-emerald-50 pb-2">
              <User size={14} /> সাধারণ ও এলাকা তথ্য
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">শাখার নাম</label>
                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 transition-all" value={formData.branchName} onChange={(e) => handleChange('branchName', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">উপজেলা</label>
                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 transition-all" value={formData.upazila} onChange={(e) => handleChange('upazila', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">জেলা</label>
                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 transition-all" value={formData.district} onChange={(e) => handleChange('district', e.target.value)} />
              </div>
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">ঋণ গ্রহীতার বিস্তারিত তথ্য (নাম, স্বামীর নাম, গ্রাম, মোবাইল)</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 transition-all h-24"
                  value={formData.borrowerInfo}
                  onChange={(e) => handleChange('borrowerInfo', formatMobileInText(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2 border-b border-emerald-50 pb-2">
              <Banknote size={14} /> আর্থিক ও ঋণের তথ্য
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">ঋণের খাত</label>
                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 transition-all" value={formData.loanSector} onChange={(e) => handleChange('loanSector', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">বিতরণ তারিখ</label>
                <input type="date" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 transition-all" value={formData.disbursementDate} onChange={(e) => handleChange('disbursementDate', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">ঋণের পরিমাণ (৳)</label>
                <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-black text-emerald-700 outline-none focus:border-emerald-500 transition-all" value={formData.loanAmount} onChange={(e) => handleChange('loanAmount', Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">সুদের হার</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 transition-all" value={formData.interestRate} onChange={(e) => handleChange('interestRate', e.target.value)}>
                  {interestRates.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <label className="block text-[10px] font-black text-emerald-600 uppercase mb-2 ml-1">ধার্যকৃত মোট সুদ (৳)</label>
                <input type="number" className="w-full p-4 bg-white border-2 border-emerald-200 rounded-xl text-sm font-black text-emerald-900 outline-none focus:border-emerald-500 transition-all" value={formData.totalInterest} onChange={(e) => handleChange('totalInterest', Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">কিস্তির পরিমাণ (৳)</label>
                <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-black outline-none focus:border-emerald-500 transition-all" value={formData.installmentAmount} onChange={(e) => handleChange('installmentAmount', Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">অন্যান্য আদায় (৳)</label>
                <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-black outline-none focus:border-emerald-500 transition-all" value={formData.otherCollections} onChange={(e) => handleChange('otherCollections', Number(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2 border-b border-emerald-50 pb-2">
              <Calendar size={14} /> আদায় ও পরিদর্শন মন্তব্য
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">আদায় শুরুর তারিখ</label>
                <input type="date" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 transition-all" value={formData.collectionStartDate} onChange={(e) => handleChange('collectionStartDate', e.target.value)} />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 border-2 border-slate-100 rounded-xl w-full hover:bg-emerald-50 transition-all">
                  <input type="checkbox" checked={formData.passbookUpdated} onChange={(e) => handleChange('passbookUpdated', e.target.checked)} className="w-6 h-6 accent-emerald-600 rounded-lg cursor-pointer" />
                  <span className="text-sm font-black text-slate-700">পাশ বই হালনাগাদ?</span>
                </label>
              </div>
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">পরিদর্শন মন্তব্য</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 transition-all h-24"
                  value={formData.inspectionComments}
                  onChange={(e) => handleChange('inspectionComments', e.target.value)}
                  placeholder="পরিদর্শন মন্তব্য লিখুন..."
                />
              </div>
            </div>
          </div>
          
          {entry.isSynced && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-800 rounded-2xl text-[11px] font-black border border-amber-100 shadow-sm">
              <AlertCircle size={18} className="shrink-0" />
              <span>সতর্কতা: এই ডাটাটি আগে সেভ করা হয়েছিল। এখন এডিট করলে এটি "Unsynced" হয়ে যাবে।</span>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-slate-50 flex flex-col sm:flex-row justify-end gap-4 border-t border-slate-100">
          <button onClick={onClose} className="px-8 py-4 rounded-2xl font-black text-slate-600 hover:bg-slate-200 transition-all active:scale-95">বাতিল</button>
          <button onClick={() => onSave(formData)} className="bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-emerald-800 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 shadow-emerald-200/50">
            <Save size={22} /> তথ্য আপডেট করুন
          </button>
        </div>
      </div>
    </div>
  );
};
