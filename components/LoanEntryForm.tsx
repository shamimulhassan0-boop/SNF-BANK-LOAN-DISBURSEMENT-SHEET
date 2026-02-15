
import React, { useState, useEffect } from 'react';
import { LoanEntry } from '../types';
import { Sparkles, Plus, MapPin, User, Banknote, ClipboardCheck, ChevronDown } from 'lucide-react';
import { generateSmartComments } from '../services/geminiService';

interface LoanEntryFormProps {
  onAdd: (entry: LoanEntry) => void;
  branchList: string[];
  districtList: string[];
  upazilaList: string[];
  sectorList: string[];
}

export const LoanEntryForm: React.FC<LoanEntryFormProps> = ({ 
  onAdd, branchList, districtList, upazilaList, sectorList 
}) => {
  const [borrowerDetails, setBorrowerDetails] = useState({ name: '', guardian: '', village: '', mobile: '' });
  const [formData, setFormData] = useState<Partial<LoanEntry>>({
    branchName: '',
    upazila: '',
    district: '',
    loanSector: '',
    disbursementDate: '',
    loanAmount: 0,
    interestRate: '১৫% (ক্রমহ্রাসমান)',
    totalInterest: 0,
    otherCollections: 0,
    loanDuration: '১২ মাস',
    installmentCount: '৪৬ টি',
    installmentAmount: 0,
    passbookUpdated: true,
    collectionStartDate: '',
    inspectionComments: '',
  });

  const interestRates = ["১৫% (ক্রমহ্রাসমান)", "১৮% (ক্রমহ্রাসমান)", "২৪% (ক্রমহ্রাসমান)", "১০% (ফ্ল্যাট)", "১২% (ফ্ল্যাট)"];
  const loanDurations = ["৬ মাস", "১২ মাস", "১৮ মাস", "২৪ মাস"];
  const installmentCounts = ["১২ টি", "২৪ টি", "৪৬ টি", "৫২ টি"];

  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const info = `নাম: ${borrowerDetails.name}\nস্বামী/পিতা: ${borrowerDetails.guardian}\nগ্রাম: ${borrowerDetails.village}\nমোবাইল নং: ${borrowerDetails.mobile}`;
    setFormData(prev => ({ ...prev, borrowerInfo: info }));
  }, [borrowerDetails]);

  const handleMobileChange = (val: string) => {
    const digitsOnly = val.replace(/[^0-9]/g, '');
    const limitedDigits = digitsOnly.substring(0, 11);
    let formatted = limitedDigits;
    if (limitedDigits.length > 5) {
      formatted = `${limitedDigits.substring(0, 5)}-${limitedDigits.substring(5)}`;
    }
    setBorrowerDetails(p => ({ ...p, mobile: formatted }));
  };

  const handleChange = (field: keyof LoanEntry, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerDetails.name || !formData.loanAmount) {
      alert("নাম এবং ঋণের পরিমাণ আবশ্যিক।");
      return;
    }
    onAdd({ ...formData as LoanEntry, id: crypto.randomUUID() });
    setBorrowerDetails({ name: '', guardian: '', village: '', mobile: '' });
    setFormData(prev => ({ ...prev, loanAmount: 0, totalInterest: 0, installmentAmount: 0, inspectionComments: '', collectionStartDate: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 mb-14 overflow-hidden pdf-exclude transition-all hover:shadow-emerald-200/50">
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 p-8 flex flex-col md:flex-row justify-between items-center text-white gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md shadow-xl"><ClipboardCheck size={32} /></div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">নতুন পরিদর্শন এন্ট্রি</h2>
            <p className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mt-1">Inspection Data Entry Terminal</p>
          </div>
        </div>
        <button
          type="button"
          onClick={async () => {
            if (!formData.loanAmount) return alert("ঋণের পরিমাণ দিন।");
            setLoadingAI(true);
            const comment = await generateSmartComments(formData);
            handleChange('inspectionComments', comment);
            setLoadingAI(false);
          }}
          className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all backdrop-blur-sm font-black border border-white/20 shadow-xl active:scale-95"
        >
          <Sparkles size={20} className="text-amber-400" />
          {loadingAI ? 'AI তৈরি করছে...' : 'AI স্মার্ট মন্তব্য'}
        </button>
      </div>

      <div className="p-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-8">
            <h3 className="font-black uppercase tracking-widest text-xs text-emerald-800 border-b-2 border-emerald-50 pb-3 flex items-center gap-2"><MapPin size={18} /> শাখা ও এলাকা</h3>
            <div className="space-y-6">
              <InputField list="branch-list" label="শাখার নাম" value={formData.branchName} onChange={(v:any) => handleChange('branchName', v)} />
              <datalist id="branch-list">{branchList.map(b => <option key={b} value={b} />)}</datalist>
              <InputField list="upazila-list" label="উপজেলা" value={formData.upazila} onChange={(v:any) => handleChange('upazila', v)} />
              <datalist id="upazila-list">{upazilaList.map(u => <option key={u} value={u} />)}</datalist>
              <InputField list="district-list" label="জেলা" value={formData.district} onChange={(v:any) => handleChange('district', v)} />
              <datalist id="district-list">{districtList.map(d => <option key={d} value={d} />)}</datalist>
              <InputField list="sector-list" label="ঋণের খাত" value={formData.loanSector} onChange={(v:any) => handleChange('loanSector', v)} />
              <datalist id="sector-list">{sectorList.map(s => <option key={s} value={s} />)}</datalist>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="font-black uppercase tracking-widest text-xs text-emerald-800 border-b-2 border-emerald-50 pb-3 flex items-center gap-2"><User size={18} /> গ্রহীতার তথ্য</h3>
            <div className="space-y-6">
              <InputField label="গ্রহীতার নাম" value={borrowerDetails.name} onChange={(v:any) => setBorrowerDetails(p=>({...p, name:v}))} />
              <InputField label="স্বামী/পিতার নাম" value={borrowerDetails.guardian} onChange={(v:any) => setBorrowerDetails(p=>({...p, guardian:v}))} />
              <InputField label="গ্রাম" value={borrowerDetails.village} onChange={(v:any) => setBorrowerDetails(p=>({...p, village:v}))} />
              <InputField label="মোবাইল নং (অটো-হাইফেন)" placeholder="017XX-XXXXXX" value={borrowerDetails.mobile} onChange={handleMobileChange} />
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="font-black uppercase tracking-widest text-xs text-emerald-800 border-b-2 border-emerald-50 pb-3 flex items-center gap-2"><Banknote size={18} /> আর্থিক তথ্য</h3>
            <div className="space-y-6">
              <InputField label="বিতরণ তারিখ" type="date" value={formData.disbursementDate} onChange={(v:any) => handleChange('disbursementDate', v)} />
              <InputField label="ঋণের পরিমাণ (৳)" type="number" value={formData.loanAmount} onChange={(v:any) => handleChange('loanAmount', Number(v))} />
              <SelectField label="সুদের হার" value={formData.interestRate} options={interestRates} onChange={(v:any) => handleChange('interestRate', v)} />
              <InputField label="ধার্যকৃত মোট সুদ (৳)" type="number" value={formData.totalInterest} onChange={(v:any) => handleChange('totalInterest', Number(v))} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 pt-10 border-t border-slate-100">
          <SelectField label="ঋণের মেয়াদ" value={formData.loanDuration} options={loanDurations} onChange={(v:any) => handleChange('loanDuration', v)} />
          <SelectField label="কিস্তির সংখ্যা" value={formData.installmentCount} options={installmentCounts} onChange={(v:any) => handleChange('installmentCount', v)} />
          <InputField label="কিস্তির পরিমাণ (৳)" type="number" value={formData.installmentAmount} onChange={(v:any) => handleChange('installmentAmount', Number(v))} />
          <InputField label="অন্যান্য আদায় (বীমা/ফি)" type="number" value={formData.otherCollections} onChange={(v:any) => handleChange('otherCollections', Number(v))} />
          <InputField label="আদায় শুরুর তারিখ" type="date" value={formData.collectionStartDate} onChange={(v:any) => handleChange('collectionStartDate', v)} />
        </div>

        <div className="pt-10 border-t border-slate-100 flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
             <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">পরিদর্শন দলের মন্তব্য</label>
             <textarea 
               className="w-full p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] focus:border-emerald-500 outline-none text-sm font-bold min-h-[150px] transition-all"
               value={formData.inspectionComments}
               onChange={(e) => handleChange('inspectionComments', e.target.value)}
               placeholder="এখানে স্মার্ট মন্তব্য বা আপনার নিজস্ব মন্তব্য লিখুন..."
             />
          </div>
          <div className="lg:w-80 flex flex-col justify-end gap-6">
             <label className="flex items-center gap-4 cursor-pointer p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] hover:bg-emerald-50 transition-all shadow-sm">
                <input type="checkbox" checked={formData.passbookUpdated} onChange={(e) => handleChange('passbookUpdated', e.target.checked)} className="w-7 h-7 accent-emerald-600 rounded-xl cursor-pointer" />
                <span className="text-sm font-black text-slate-700">পাশ বই হালনাগাদ?</span>
             </label>
             <button type="submit" className="w-full bg-emerald-700 text-white p-7 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 shadow-2xl hover:bg-emerald-800 transition-all active:scale-95 shadow-emerald-200">
                <Plus size={28} /> রেকর্ড যোগ করুন
             </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const InputField = ({ label, value, onChange, type = "text", placeholder = "", list = undefined, disabled = false }: any) => (
  <div className="w-full space-y-2">
    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <input
      type={type}
      list={list}
      disabled={disabled}
      className={`w-full p-5 border-2 border-slate-50 rounded-[1.5rem] outline-none transition-all font-black text-slate-700 text-sm shadow-sm ${disabled ? 'bg-slate-100' : 'bg-slate-50 focus:border-emerald-500 hover:border-emerald-100'}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const SelectField = ({ label, value, options, onChange }: any) => (
  <div className="w-full space-y-2">
    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-5 border-2 border-slate-50 rounded-[1.5rem] outline-none transition-all font-black text-slate-700 text-sm shadow-sm bg-slate-50 focus:border-emerald-500 hover:border-emerald-100 appearance-none pr-12"
      >
        <option value="">নির্বাচন করুন</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-emerald-600">
        <ChevronDown size={20} />
      </div>
    </div>
  </div>
);
