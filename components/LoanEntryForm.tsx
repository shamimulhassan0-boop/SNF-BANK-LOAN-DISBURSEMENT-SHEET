
import React, { useState, useEffect, useCallback } from 'react';
import { LoanEntry } from '../types';
import { Sparkles, Plus, MapPin, User, Landmark, Banknote, CalendarDays, ClipboardCheck } from 'lucide-react';
import { generateSmartComments } from '../services/geminiService';

interface LoanEntryFormProps {
  onAdd: (entry: LoanEntry) => void;
}

export const LoanEntryForm: React.FC<LoanEntryFormProps> = ({ onAdd }) => {
  const [borrowerDetails, setBorrowerDetails] = useState({
    name: '',
    guardian: '',
    village: '',
    mobile: ''
  });

  const [formData, setFormData] = useState<Partial<LoanEntry>>({
    branchName: '',
    borrowerInfo: '',
    upazila: '',
    district: '',
    loanSector: '',
    disbursementDate: '',
    loanAmount: 0,
    interestRate: '',
    totalInterest: 0,
    otherCollections: 0,
    loanDuration: '',
    installmentCount: '',
    installmentAmount: 0,
    passbookUpdated: true,
    collectionStartDate: '',
    inspectionComments: '',
  });

  const [loadingAI, setLoadingAI] = useState(false);
  const [isManualDuration, setIsManualDuration] = useState(false);

  const durationOptions = ["৬ মাস", "১২ মাস", "১৮ মাস", "২৪ মাস"];
  const durationToInstallments: Record<string, string> = {
    "৬ মাস": "৬ টি",
    "১২ মাস": "১২ টি",
    "১৮ মাস": "১৮ টি",
    "২৪ মাস": "২৪ টি",
  };

  const branches = [
    "(০০১) চুড়ামনকাটি", "(০০১৫) রাজারহাট", "(০০২) সালুয়া বাজার", "(০০৩) পুড়াপাড়া", "(০০৪) কায়েমখোলা",
    "(০০৫) কোটচাঁদপুর", "(০০৬) চৌগাছা-০১", "(০০৭) বড় ধোপাদি", "(০০৮) ভৈরব", "(০০৯) মহেশপুর-০১",
    "(০১০) দত্তনগর", "(০১১) বারোবাজার", "(০১২) হাসিমপুর", "(০১৩) খাজুরা", "(০১৪) নাভারন",
    "(০১৬) খালিশপুর", "(০১৭) পুলেরহাট-০১", "(০১৮) জীবননগর-০১", "(০১৯) আন্দুলবাড়ীয়া", "(০২০) ঝিকরগাছা",
    "(০২১) দর্শনা", "(০২২) গান্না", "(০২৩) সীমাখালী", "(০২৫) আলঙ্গী", "(০২৬) মেহেরপুর",
    "(০২৭) বারাদী", "(০২৮) চুয়াডাঙ্গা", "(০২৯) সরোজগঞ্জ", "(০৩০) কার্পাসডাঙ্গা", "(০৩১) বাঁকড়া",
    "(০৩২) মুজিবনগর", "(০৩৩) বাগআঁচড়া", "(০৩৪) ছাতিয়ানতলা", "(০৩৫) বসুন্দিয়া", "(০৩৬) নওয়াপাড়া",
    "(০৩৭) ফুলতলা", "(০৩৮) দৌলতপুর", "(০৩৯) দামুড়হুদা", "(০৪০) আসমানখালী", "(০৪১) ডাকবাংলো",
    "(০৪২) হাটবোয়ালিয়া", "(০৪৩) মাগুরা", "(০৪৪) আলমডাঙ্গা", "(০৪৫) শার্শা", "(০৪৬) মনিরামপুর",
    "(০৪৭) কালীগঞ্জ", "(০৪৮) ঝিনাইদহ", "(০৪৯) আড়পাড়া", "(০৫০) গাংনী", "(০৫১) কেশবপুর",
    "(০৫২) নেহালপুর", "(০৫৩) কুষ্টিয়া সদর", "(০৫৪) ঝাউদিয়া", "(০৫৫) পান্টি", "(০৫৬) হরিনারায়ণপুর",
    "(০৫৭) পোড়াদহ", "(০৫৮) হাটগোপালপুর", "(০৫৯) হরিণাকুণ্ডু", "(০৬০) গোলদারী", "(০৬১) বামন্দী",
    "(০৬২) কাথুলী", "(০৬৩) মোহাম্মদপুর", "(০৬৪) নড়াইল সদর", "(০৬৫) পাটকেলঘাটা", "(০৬৬) লকপুর",
    "(০৬৭) রাজগঞ্জ", "(০৬৮) গড়পাড়া", "(০৬৯) বাঘারপাড়া", "(০৭০) নারিকেলবাড়িয়া-বি", "(০৭১) নারিকেলবাড়িয়া-জে",
    "(০৭২) পুলেরহাট-০২", "(০৭৩) চৌগাছা-০২", "(০৭৪) মহেশপুর-০২", "(০৭৫) জীবননগর-০২", "(০৭৬) লোহাগড়া",
    "(০৭৭) ভেড়ামারা", "(০৭৮) মিরপুর", "(০৭৯) আমলা", "(০৮০) কুষ্টিয়া দৌলতপুর", "(০৮১) কুচিয়ামোড়া",
    "(০৮২) ঈশ্বরদী", "(০৮৩) পাবনা সদর", "(০৮৪) মুলাডুলি", "(০৮৫) জালালপুর", "(০৮৬) আটঘরিয়া"
  ];

  const districts = ["খুলনা", "বাগেরহাট", "সাতক্ষীরা", "যশোর", "ঝিনাইদহ", "কুষ্টিয়া", "মাগুরা", "নড়াইল", "চুয়াডাঙ্গা", "মেহেরপুর"];
  const upazilas = [
    "কয়রা", "পাইকগাছা", "দাকোপ", "ডুমুরিয়া", "বটিয়াঘাটা", "দিঘলিয়া", "তেরখাদা", "রূপসা", "ফুলতলা", 
    "বাগেরহাট সদর", "মোল্লাহাট", "ফকিরহাট", "কচুয়া", "চিতলমারী", "মোংলা", "রামপাল", "মোরেলগঞ্জ", "শরণখোলা", 
    "সাতক্ষীরা সদর", "কলারোয়া", "তালা", "কালীগঞ্জ", "আশাশুনি", "দেবহাটা", "শ্যামনগর", 
    "যশোর সদর", "অভয়নগর", "বাঘারপাড়া", "চৌগাছা", "ঝিকরগাছা", "কেশবপুর", "মনিরামপুর", "শার্শা", 
    "ঝিনাইদহ সদর", "কালীগঞ্জ", "কোটচাঁদপুর", "মহেশপুর", "শৈলকুপা", "হরিণাকুন্ডু", 
    "কুষ্টিয়া সদর", "কুমারখালী", "খোকসা", "দৌলতপুর", "মিরপুর", "ভেড়ামারা", 
    "মাগুরা সদর", "শ্রীপুর", "শালিখা", "মোহাম্মদপুর", 
    "নড়াইল সদর", "লোহাগড়া", "কালিয়া", 
    "চুয়াডাঙ্গা সদর", "আলমডাঙ্গা", "দামুড়হুদা", "জীবননগর", 
    "মেহেরপুর সদর", "মুজিবনগর", "গাংনী"
  ];

  const sectors = ["গবাদি পশু পালন", "ক্ষুদ্র ব্যবসা", "কৃষি চাষ", "মৎস্য চাষ", "হাঁস-মুরগি পালন", "গাভী পালন", "ধান চাষ"];
  const interestRates = ["বাৎসরিক ২৪% ক্রম হ্রাসমান", "বাৎসরিক ৯% ফ্ল্যাট", "বাৎসরিক ১০%", "বাৎসরিক ১২%", "বাৎসরিক ১৮%"];

  // Calculation Logic
  const calculateFinancials = useCallback((data: Partial<LoanEntry>) => {
    const principal = data.loanAmount || 0;
    const rateStr = data.interestRate || '';
    const durationStr = data.loanDuration || '';
    const installmentsStr = data.installmentCount || '';

    // Extract numbers from strings
    const rateMatch = rateStr.match(/(\d+(\.\d+)?)/);
    const rate = rateMatch ? parseFloat(rateMatch[1]) : 0;

    const durationMatch = durationStr.match(/(\d+)/);
    const months = durationMatch ? parseInt(durationMatch[1]) : 0;

    const installmentsMatch = installmentsStr.match(/(\d+)/);
    const n = installmentsMatch ? parseInt(installmentsMatch[1]) : 0;

    if (principal <= 0 || rate <= 0 || months <= 0 || n <= 0) return data;

    let totalInterest = 0;
    let installmentAmount = 0;

    const isReducing = rateStr.includes('হ্রাসমান');
    const isFlat = rateStr.includes('ফ্ল্যাট') || (!isReducing);

    if (isFlat) {
      // Flat Rate: Interest = P * R * T
      totalInterest = Math.round(principal * (rate / 100) * (months / 12));
      installmentAmount = Math.round((principal + totalInterest) / n);
    } else {
      // Reducing Balance Rate (EMI formula)
      // Standard monthly reducing calculation assumed if duration is in months
      const monthlyRate = (rate / 100) / 12;
      // EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
      // Assuming installments are monthly. If installments are weekly/fortnightly, 
      // the math changes, but usually MFI reducing rates are cited monthly.
      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
      
      installmentAmount = Math.round(emi);
      totalInterest = Math.round((installmentAmount * n) - principal);
    }

    return {
      ...data,
      totalInterest,
      installmentAmount
    };
  }, []);

  useEffect(() => {
    const info = `নাম: ${borrowerDetails.name}\nস্বামী/পিতা: ${borrowerDetails.guardian}\nগ্রাম: ${borrowerDetails.village}\nমোবাইল নং: ${borrowerDetails.mobile}`;
    setFormData(prev => ({ ...prev, borrowerInfo: info }));
  }, [borrowerDetails]);

  useEffect(() => {
    if (!isManualDuration && formData.disbursementDate && formData.collectionStartDate) {
      const start = new Date(formData.disbursementDate);
      const end = new Date(formData.collectionStartDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        let durationStr = diffDays >= 360 ? `${Math.round(diffDays / 365)} বছর` : diffDays >= 28 ? `${Math.round(diffDays / 30.44)} মাস` : `${diffDays} দিন`;
        
        // Trigger calculation if duration changed
        setFormData(prev => {
          const newData = { ...prev, loanDuration: durationStr };
          return calculateFinancials(newData);
        });
      }
    }
  }, [formData.disbursementDate, formData.collectionStartDate, isManualDuration, calculateFinancials]);

  const handleChange = (field: keyof LoanEntry, value: any) => {
    setFormData(prev => {
      let updatedData = { ...prev, [field]: value };
      
      // Auto-update installments if duration changes from dropdown
      if (field === 'loanDuration') {
        setIsManualDuration(true);
        if (durationToInstallments[value]) {
          updatedData.installmentCount = durationToInstallments[value];
        }
      }

      // Re-calculate financials if relevant fields change
      const financialFields = ['loanAmount', 'interestRate', 'loanDuration', 'installmentCount'];
      if (financialFields.includes(field)) {
        updatedData = calculateFinancials(updatedData);
      }

      return updatedData;
    });
  };

  const handleAISuggest = async () => {
    if (!formData.loanAmount || !formData.loanSector) {
      alert("AI মন্তব্যের জন্য ঋণের পরিমাণ এবং খাত প্রদান করুন।");
      return;
    }
    setLoadingAI(true);
    const comment = await generateSmartComments(formData);
    setFormData(prev => ({ ...prev, inspectionComments: comment }));
    setLoadingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerDetails.name || !formData.loanAmount) {
      alert("ঋণ গ্রহীতার নাম এবং ঋণের পরিমাণ আবশ্যিক।");
      return;
    }
    onAdd({ ...formData as LoanEntry, id: crypto.randomUUID() });
    setFormData(prev => ({ ...prev, borrowerInfo: '', loanAmount: 0, totalInterest: 0, inspectionComments: '', installmentAmount: 0, loanDuration: '', installmentCount: '', }));
    setBorrowerDetails({ name: '', guardian: '', village: '', mobile: '' });
    setIsManualDuration(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-200 mb-12 overflow-hidden pdf-exclude">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 p-5 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <ClipboardCheck size={24} />
          <h2 className="text-xl font-bold">নতুন ঋণ তথ্য যোগ করুন</h2>
        </div>
        <button
          type="button"
          onClick={handleAISuggest}
          disabled={loadingAI}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm disabled:opacity-50 text-sm font-semibold border border-white/20"
        >
          <Sparkles size={16} />
          {loadingAI ? 'প্রসেসিং...' : 'AI স্মার্ট মন্তব্য'}
        </button>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section: Location & Branch */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 border-b border-emerald-100 pb-2 mb-4">
              <MapPin size={18} />
              <h3 className="font-bold uppercase tracking-tight text-sm">শাখা ও এলাকা</h3>
            </div>
            <div className="space-y-3">
              <InputField list="branch-list" label="শাখার নাম (Editable)" value={formData.branchName} onChange={(val: string) => handleChange('branchName', val)} placeholder="শাখা খুঁজুন বা লিখুন" />
              <datalist id="branch-list">{branches.map(b => <option key={b} value={b} />)}</datalist>

              <InputField list="upazila-list" label="উপজেলা" value={formData.upazila} onChange={(val: string) => handleChange('upazila', val)} placeholder="উপজেলা লিখুন" />
              <datalist id="upazila-list">{upazilas.map(u => <option key={u} value={u} />)}</datalist>

              <InputField list="district-list" label="জেলা" value={formData.district} onChange={(val: string) => handleChange('district', val)} placeholder="জেলা লিখুন" />
              <datalist id="district-list">{districts.map(d => <option key={d} value={d} />)}</datalist>
              
              <InputField list="sector-list" label="ঋণের খাত" value={formData.loanSector} onChange={(val: string) => handleChange('loanSector', val)} placeholder="উদাঃ কৃষি / গবাদি পশু" />
              <datalist id="sector-list">{sectors.map(s => <option key={s} value={s} />)}</datalist>
            </div>
          </div>

          {/* Section: Borrower Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 border-b border-emerald-100 pb-2 mb-4">
              <User size={18} />
              <h3 className="font-bold uppercase tracking-tight text-sm">ঋণ গ্রহীতার তথ্য</h3>
            </div>
            <div className="space-y-3">
              <InputField label="নাম" value={borrowerDetails.name} onChange={(val: string) => setBorrowerDetails(p => ({...p, name: val}))} placeholder="গ্রহীতার নাম লিখুন" />
              <InputField label="স্বামী/পিতা" value={borrowerDetails.guardian} onChange={(val: string) => setBorrowerDetails(p => ({...p, guardian: val}))} placeholder="পিতার/স্বামীর নাম লিখুন" />
              <InputField label="গ্রাম" value={borrowerDetails.village} onChange={(val: string) => setBorrowerDetails(p => ({...p, village: val}))} placeholder="গ্রামের নাম" />
              <InputField label="মোবাইল নং" value={borrowerDetails.mobile} onChange={(val: string) => setBorrowerDetails(p => ({...p, mobile: val}))} placeholder="০১XXX-XXXXXX" />
            </div>
          </div>

          {/* Section: Loan Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 border-b border-emerald-100 pb-2 mb-4">
              <Banknote size={18} />
              <h3 className="font-bold uppercase tracking-tight text-sm">ঋণ ও পরিশোধের তথ্য</h3>
            </div>
            <div className="space-y-3">
              <InputField label="বিতরণ তারিখ" type="date" value={formData.disbursementDate} onChange={(val: string) => handleChange('disbursementDate', val)} />
              <div className="grid grid-cols-2 gap-3">
                <InputField label="ঋণের পরিমাণ" type="number" value={formData.loanAmount} onChange={(val: string) => handleChange('loanAmount', Number(val))} />
                <div className="relative">
                  <InputField label="ধার্যকৃত মোট সুদ" type="number" value={formData.totalInterest} onChange={(val: string) => handleChange('totalInterest', Number(val))} />
                  <span className="absolute right-2 top-[32px] text-[8px] font-bold text-slate-400">AUTO</span>
                </div>
              </div>
              <InputField list="rate-list" label="সুদের হার (%)" value={formData.interestRate} onChange={(val: string) => handleChange('interestRate', val)} placeholder="হার লিখুন বা বাছুন" />
              <datalist id="rate-list">{interestRates.map(r => <option key={r} value={r} />)}</datalist>
              
              <InputField label="অন্যান্য আদায়" type="number" value={formData.otherCollections} onChange={(val: string) => handleChange('otherCollections', Number(val))} placeholder="বীমা/অন্যান্য ফি" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
          <div className="relative">
            <InputField list="duration-list" label="মেয়াদকাল" value={formData.loanDuration} onChange={(val: string) => handleChange('loanDuration', val)} placeholder="উদাঃ ১২ মাস" />
            <datalist id="duration-list">{durationOptions.map(opt => <option key={opt} value={opt} />)}</datalist>
            {formData.disbursementDate && formData.collectionStartDate && !isManualDuration && (
              <span className="absolute right-2 top-[32px] text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">AUTO</span>
            )}
          </div>
          <div className="relative">
            <InputField list="installment-list" label="কিস্তি সংখ্যা" value={formData.installmentCount} onChange={(val: string) => handleChange('installmentCount', val)} />
            <datalist id="installment-list">{Object.values(durationToInstallments).map(opt => <option key={opt} value={opt} />)}</datalist>
          </div>
          
          <div className="relative">
            <InputField label="কিস্তির পরিমাণ" type="number" value={formData.installmentAmount} onChange={(val: string) => handleChange('installmentAmount', Number(val))} />
            <span className="absolute right-2 top-[32px] text-[8px] font-bold text-slate-400">AUTO</span>
          </div>
          
          <InputField label="আদায় শুরুর তারিখ" type="date" value={formData.collectionStartDate} onChange={(val: string) => handleChange('collectionStartDate', val)} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 pt-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">পরিদর্শন দলের মন্তব্য</label>
            <textarea
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px] text-sm leading-relaxed transition-all hover:border-slate-300"
              value={formData.inspectionComments}
              onChange={(e) => handleChange('inspectionComments', e.target.value)}
              placeholder="এখানে পরিদর্শন দলের মন্তব্য লিখুন অথবা AI বাটনে ক্লিক করুন..."
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-4 lg:w-48">
             <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-6 h-6 accent-emerald-600 rounded cursor-pointer" checked={formData.passbookUpdated} onChange={(e) => handleChange('passbookUpdated', e.target.checked)} />
                <span className="text-sm font-semibold text-slate-600 group-hover:text-emerald-700 transition-colors">পাস বই আপডেট আছে?</span>
             </label>
             <button
                type="submit"
                className="w-full bg-emerald-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <Plus size={20} /> যোগ করুন
              </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const InputField = ({ label, value, onChange, type = "text", placeholder = "", list = undefined }: any) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
    <input
      type={type}
      list={list}
      className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm placeholder:text-slate-300 hover:border-slate-300 shadow-sm"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
