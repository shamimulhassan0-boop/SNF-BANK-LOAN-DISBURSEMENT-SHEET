
import React, { useState, useMemo } from 'react';
import { LoanEntry } from '../types';
import { Trash2, Search, Pencil, Info } from 'lucide-react';

interface ReportTableProps {
  entries: LoanEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: LoanEntry) => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({ entries, onDelete, onEdit }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const userBranch = localStorage.getItem('mfi_user_branch') || '';
  const isAdmin = userBranch.includes('ADMIN');

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const searchMatch = !searchQuery || entry.borrowerInfo.toLowerCase().includes(searchQuery.toLowerCase());
      return searchMatch;
    });
  }, [entries, searchQuery]);

  if (entries.length === 0) return null;

  const totalAmount = filteredEntries.reduce((sum, e) => sum + e.loanAmount, 0);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden mb-12">
      <div className="p-8 border-b-2 border-slate-50 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl text-white"><Search size={20} /></div>
          <h3 className="font-black text-slate-800 text-xl">পরিদর্শন প্রতিবেদন ডেটাবেজ</h3>
        </div>
        <div className="flex items-center gap-4 pdf-exclude w-full md:w-auto">
          <div className="flex items-center gap-3 bg-white border-2 border-slate-100 rounded-2xl px-5 py-3 shadow-sm w-full md:w-64 focus-within:border-emerald-500 transition-all">
            <Search size={18} className="text-slate-300" />
            <input 
              type="text" 
              placeholder="গ্রহীতার নামে খুঁজুন..." 
              className="text-sm font-bold outline-none bg-transparent w-full" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[10px] leading-relaxed text-center border-collapse">
          <thead className="bg-slate-900 text-slate-300 border-b-4 border-emerald-600 font-black">
            <tr>
              <th className="px-2 py-4 border-r border-slate-800">ক্র. নং</th>
              <th className="px-3 py-4 border-r border-slate-800">শাখার নাম</th>
              <th className="px-4 py-4 border-r border-slate-800 min-w-[200px] text-left">ঋণ গ্রহীতার তথ্য (নাম, স্বামীর নাম, গ্রাম ও মোবাইল)</th>
              <th className="px-2 py-4 border-r border-slate-800">উপজেলা</th>
              <th className="px-2 py-4 border-r border-slate-800">জেলা</th>
              <th className="px-2 py-4 border-r border-slate-800">ঋণের খাত</th>
              <th className="px-2 py-4 border-r border-slate-800">মঞ্জুরী ও বিতরণের তারিখ</th>
              <th className="px-3 py-4 border-r border-slate-800">বিতরণকৃত ঋণের পরিমাণ</th>
              <th className="px-2 py-4 border-r border-slate-800">সুদের হার</th>
              <th className="px-2 py-4 border-r border-slate-800 text-emerald-400">ধার্যকৃত মোট সুদ</th>
              <th className="px-2 py-4 border-r border-slate-800">অন্যান্য আদায়</th>
              <th className="px-2 py-4 border-r border-slate-800">মেয়াদকাল</th>
              <th className="px-2 py-4 border-r border-slate-800">কিস্তির সংখ্যা</th>
              <th className="px-2 py-4 border-r border-slate-800">কিস্তির পরিমাণ</th>
              <th className="px-2 py-4 border-r border-slate-800">পাশ বই হালনাগাদ?</th>
              <th className="px-2 py-4 border-r border-slate-800">আদায় শুরুর তারিখ</th>
              <th className="px-4 py-4 min-w-[200px] text-left">পরিদর্শন দলের মন্তব্য</th>
              <th className="px-3 py-4 pdf-exclude">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEntries.map((entry, index) => {
                const canDelete = isAdmin || (!entry.isSynced && entry.userId === userBranch);
                return (
                  <tr key={entry.id} className={`transition-colors group ${entry.isSynced ? 'bg-emerald-50/20' : ''}`}>
                    <td className="px-2 py-4 border-r border-slate-50 font-black text-slate-400">{index + 1}</td>
                    <td className="px-3 py-4 border-r border-slate-50 font-bold text-slate-500">{entry.branchName}</td>
                    <td className="px-4 py-4 border-r border-slate-50 text-left whitespace-pre-wrap font-bold text-slate-700">{entry.borrowerInfo}</td>
                    <td className="px-2 py-4 border-r border-slate-50 font-bold text-slate-600">{entry.upazila}</td>
                    <td className="px-2 py-4 border-r border-slate-50 font-bold text-slate-600">{entry.district}</td>
                    <td className="px-2 py-4 border-r border-slate-50 font-bold text-slate-600">{entry.loanSector}</td>
                    <td className="px-2 py-4 border-r border-slate-50 text-slate-500 font-bold">{entry.disbursementDate}</td>
                    <td className="px-3 py-4 border-r border-slate-50 font-black text-slate-900">৳ {entry.loanAmount.toLocaleString()}</td>
                    <td className="px-2 py-4 border-r border-slate-50 font-bold text-slate-600">{entry.interestRate}</td>
                    <td className="px-2 py-4 border-r border-slate-50 font-bold text-emerald-700">৳ {entry.totalInterest.toLocaleString()}</td>
                    <td className="px-2 py-4 border-r border-slate-50 font-bold text-slate-600">৳ {entry.otherCollections.toLocaleString()}</td>
                    <td className="px-2 py-4 border-r border-slate-50 font-bold text-slate-600">{entry.loanDuration}</td>
                    <td className="px-2 py-4 border-r border-slate-50 font-bold text-slate-600">{entry.installmentCount}</td>
                    <td className="px-2 py-4 border-r border-slate-50 font-bold text-slate-600">৳ {entry.installmentAmount.toLocaleString()}</td>
                    <td className="px-2 py-4 border-r border-slate-50 font-bold text-slate-600">{entry.passbookUpdated ? 'হ্যাঁ' : 'না'}</td>
                    <td className="px-2 py-4 border-r border-slate-50 font-bold text-slate-600">{entry.collectionStartDate}</td>
                    <td className="px-4 py-4 text-left italic font-bold text-slate-500 leading-relaxed">{entry.inspectionComments}</td>
                    <td className="px-3 py-4 pdf-exclude">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => onEdit(entry)} className="text-emerald-600 hover:bg-emerald-100 p-2 rounded-xl transition-all"><Pencil size={16} /></button>
                        {canDelete && (
                          <button onClick={() => onDelete(entry.id)} className="text-rose-500 hover:bg-rose-100 p-2 rounded-xl transition-all"><Trash2 size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
            })}
          </tbody>
          <tfoot className="bg-slate-900 text-white font-black">
            <tr>
                <td colSpan={7} className="px-4 py-6 text-right border-r border-slate-800 uppercase tracking-widest text-xs">সর্বমোট বিতরণঃ</td>
                <td className="px-4 py-6 border-r border-slate-800 text-lg text-emerald-400">৳ {totalAmount.toLocaleString()}</td>
                <td colSpan={10} className="px-4 py-6 italic text-[10px] text-slate-400 text-left">
                  <div className="flex items-center gap-2">
                    <Info size={14} className="text-amber-400" />
                    <span>শিটে সেভ না করা পর্যন্ত তথ্যগুলো আপনার ব্রাউজারে ড্রাফট হিসেবে থাকবে।</span>
                  </div>
                </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
