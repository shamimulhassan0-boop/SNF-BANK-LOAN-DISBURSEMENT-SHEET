
import React, { useState, useEffect } from 'react';
import { LoanEntry } from '../types.ts';
import { Sparkles, Plus, MapPin, User, Banknote, ClipboardCheck, ChevronDown } from 'lucide-react';
import { generateSmartComments } from '../services/geminiService.ts';

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

  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const info = `নাম: ${borrowerDetails.name}\nস্বামী: ${borrowerDetails.guardian}\nগ্রাম: ${borrowerDetails.village}\nমোবাইল: ${borrowerDetails.mobile}`;
    setFormData(prev => ({ ...prev, borrowerInfo: info }));
  }, [borrowerDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData as LoanEntry, id: crypto.randomUUID() });
    setBorrowerDetails({ name: '', guardian: '', village: '', mobile: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8 mb-12 pdf-exclude">
       <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-3"><ClipboardCheck className="text-emerald-600" /> নতুন ডাটা এন্ট্রি</h2>
          <button
            type="button"
            onClick={async () => {
              setLoadingAI(true);
              const comment = await generateSmartComments(formData);
              setFormData(p => ({ ...p, inspectionComments: comment }));
              setLoadingAI(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold border border-emerald-100"
          >
            <Sparkles size={16} /> {loadingAI ? 'AI লোড হচ্ছে...' : 'AI স্মার্ট মন্তব্য'}
          </button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <input type="text" placeholder="গ্রহীতার নাম" className="p-4 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-emerald-500 font-bold" value={borrowerDetails.name} onChange={(e) => setBorrowerDetails(p=>({...p, name: e.target.value}))} />
          <input type="number" placeholder="ঋণের পরিমাণ (৳)" className="p-4 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-emerald-500 font-bold" value={formData.loanAmount || ''} onChange={(e) => setFormData(p=>({...p, loanAmount: Number(e.target.value)}))} />
          <input type="date" className="p-4 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-emerald-500 font-bold" value={formData.disbursementDate} onChange={(e) => setFormData(p=>({...p, disbursementDate: e.target.value}))} />
          <button type="submit" className="bg-emerald-600 text-white p-4 rounded-xl font-black shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
             <Plus size={20} /> এন্ট্রি যোগ করুন
          </button>
       </div>
    </form>
  );
};
