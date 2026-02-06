
import React, { useState, useEffect, useCallback } from 'react';
import { LoanEntry } from '../types';
import { X, Save, Calculator, AlertCircle } from 'lucide-react';

interface EditModalProps {
  entry: LoanEntry;
  onSave: (updated: LoanEntry) => void;
  onClose: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({ entry, onSave, onClose }) => {
  const [formData, setFormData] = useState<LoanEntry>(entry);

  const calculateFinancials = useCallback((data: LoanEntry) => {
    const principal = data.loanAmount || 0;
    const rateStr = data.interestRate || '';
    const durationStr = data.loanDuration || '';
    const nMatch = data.installmentCount.match(/(\d+)/);
    const n = nMatch ? parseInt(nMatch[1]) : 0;
    const rateMatch = rateStr.match(/(\d+(\.\d+)?)/);
    const rate = rateMatch ? parseFloat(rateMatch[1]) : 0;
    const monthsMatch = durationStr.match(/(\d+)/);
    const months = monthsMatch ? parseInt(monthsMatch[1]) : 0;

    if (principal <= 0 || rate <= 0 || months <= 0 || n <= 0) return data;

    let totalInterest = 0;
    let installmentAmount = 0;
    const isReducing = rateStr.includes('হ্রাসমান');

    if (!isReducing) {
      totalInterest = Math.round(principal * (rate / 100) * (months / 12));
      installmentAmount = Math.round((principal + totalInterest) / n);
    } else {
      const monthlyRate = (rate / 100) / 12;
      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
      installmentAmount = Math.round(emi);
      totalInterest = Math.round((installmentAmount * n) - principal);
    }

    return { ...data, totalInterest, installmentAmount };
  }, []);

  const handleChange = (field: keyof LoanEntry, value: any) => {
    setFormData(prev => {
      let updated = { ...prev, [field]: value };
      const financialFields = ['loanAmount', 'interestRate', 'loanDuration', 'installmentCount'];
      if (financialFields.includes(field)) {
        updated = calculateFinancials(updated);
      }
      return updated;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-emerald-800 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Calculator size={20} />
            <h3 className="font-bold text-lg">তথ্য সংশোধন করুন (Update Entry)</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition-colors"><X size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">ঋণ গ্রহীতার তথ্য (নাম, স্বামীর নাম, গ্রাম, মোবাইল)</label>
              <textarea 
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none h-20"
                value={formData.borrowerInfo}
                onChange={(e) => handleChange('borrowerInfo', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">শাখার নাম</label>
              <input type="text" className="w-full p-2.5 border rounded-lg text-sm" value={formData.branchName} onChange={(e) => handleChange('branchName', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">ঋণের খাত</label>
              <input type="text" className="w-full p-2.5 border rounded-lg text-sm" value={formData.loanSector} onChange={(e) => handleChange('loanSector', e.target.value)} />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">ঋণের পরিমাণ</label>
              <input type="number" className="w-full p-2.5 border rounded-lg text-sm font-bold text-emerald-700" value={formData.loanAmount} onChange={(e) => handleChange('loanAmount', Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">সুদের হার</label>
              <input type="text" className="w-full p-2.5 border rounded-lg text-sm" value={formData.interestRate} onChange={(e) => handleChange('interestRate', e.target.value)} />
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
               <span className="text-[10px] font-bold text-slate-400 uppercase">ধার্যকৃত মোট সুদ (Auto)</span>
               <div className="text-lg font-bold text-slate-700">৳ {formData.totalInterest.toLocaleString()}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
               <span className="text-[10px] font-bold text-slate-400 uppercase">কিস্তির পরিমাণ (Auto)</span>
               <div className="text-lg font-bold text-slate-700">৳ {formData.installmentAmount.toLocaleString()}</div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">পরিদর্শন মন্তব্য</label>
              <textarea 
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none h-24"
                value={formData.inspectionComments}
                onChange={(e) => handleChange('inspectionComments', e.target.value)}
              />
            </div>
          </div>
          
          {entry.isSynced && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-lg text-xs border border-amber-100">
              <AlertCircle size={14} />
              <span>সতর্কতা: এই ডাটাটি আগে সেভ করা হয়েছিল। এখন এডিট করলে এটি "Unsynced" হয়ে যাবে এবং আপনাকে পুনরায় শিটে সেভ করতে হবে।</span>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t">
          <button onClick={onClose} className="px-6 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-200 transition-colors">বাতিল</button>
          <button onClick={() => onSave(formData)} className="bg-emerald-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2">
            <Save size={18} /> আপডেট করুন
          </button>
        </div>
      </div>
    </div>
  );
};
