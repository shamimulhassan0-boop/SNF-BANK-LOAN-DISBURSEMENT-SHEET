
import React, { useState, useMemo } from 'react';
import { LoanEntry } from '../types';
import { Trash2, X, Calendar, Search, CheckCircle2, AlertCircle, RotateCcw, Pencil } from 'lucide-react';

interface ReportTableProps {
  entries: LoanEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: LoanEntry) => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({ entries, onDelete, onEdit }) => {
  const [selectedEntry, setSelectedEntry] = useState<LoanEntry | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const date = entry.disbursementDate;
      const startMatch = !startDate || (date && date >= startDate);
      const endMatch = !endDate || (date && date <= endDate);
      const searchMatch = !searchQuery || entry.borrowerInfo.toLowerCase().includes(searchQuery.toLowerCase());
      return startMatch && endMatch && searchMatch;
    });
  }, [entries, startDate, endDate, searchQuery]);

  if (entries.length === 0) return null;

  const totalAmount = filteredEntries.reduce((sum, e) => sum + e.loanAmount, 0);
  const totalInterest = filteredEntries.reduce((sum, e) => sum + e.totalInterest, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-12">
      <div className="p-4 border-b bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="font-bold text-slate-700">এমএফআই পরিদর্শন তালিকা</h3>
        <div className="flex flex-wrap items-center gap-3 pdf-exclude">
          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 shadow-sm">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="খুঁজুন..." className="text-xs outline-none bg-transparent w-40" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          {(startDate || endDate || searchQuery) && (
            <button onClick={() => {setStartDate(''); setEndDate(''); setSearchQuery('');}} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg flex items-center gap-1 text-[10px]"><RotateCcw size={14} /> রিসেট</button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[10px] leading-tight text-center border-collapse">
          <thead className="bg-blue-50 text-slate-800 border-b border-blue-200 uppercase font-bold">
            <tr>
              <th className="px-1 py-2 border-r border-blue-200">ক্র. নং</th>
              <th className="px-1 py-2 border-r border-blue-200">শাখা</th>
              <th className="px-1 py-2 border-r border-blue-200 min-w-[150px]">গ্রহীতার তথ্য</th>
              <th className="px-1 py-2 border-r border-blue-200">খাত</th>
              <th className="px-1 py-2 border-r border-blue-200">তারিখ</th>
              <th className="px-1 py-2 border-r border-blue-200">পরিমাণ</th>
              <th className="px-1 py-2 border-r border-blue-200">সুদ</th>
              <th className="px-1 py-2 border-r border-blue-200">কিস্তি</th>
              <th className="px-1 py-2 border-r border-blue-200">পাসবই</th>
              <th className="px-2 py-2 min-w-[150px]">মন্তব্য</th>
              <th className="px-1 py-2 pdf-exclude">Cloud</th>
              <th className="px-1 py-2 pdf-exclude">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            {filteredEntries.map((entry, index) => (
              <tr key={entry.id} className={`hover:bg-blue-50/50 transition ${entry.isSynced ? 'bg-emerald-50/20' : ''}`}>
                <td className="px-1 py-2 border-r border-blue-100">{index + 1}</td>
                <td className="px-1 py-2 border-r border-blue-100">{entry.branchName}</td>
                <td className="px-1 py-2 border-r border-blue-100 text-left whitespace-pre-wrap">{entry.borrowerInfo}</td>
                <td className="px-1 py-2 border-r border-blue-100">{entry.loanSector}</td>
                <td className="px-1 py-2 border-r border-blue-100">{entry.disbursementDate}</td>
                <td className="px-1 py-2 border-r border-blue-100 font-bold">{entry.loanAmount.toLocaleString()}</td>
                <td className="px-1 py-2 border-r border-blue-100">{entry.totalInterest.toLocaleString()}</td>
                <td className="px-1 py-2 border-r border-blue-100">{entry.installmentAmount.toLocaleString()}</td>
                <td className="px-1 py-2 border-r border-blue-100 font-semibold">{entry.passbookUpdated ? 'হ্যাঁ' : 'না'}</td>
                <td className="px-2 py-2 text-left italic">{entry.inspectionComments}</td>
                <td className="px-1 py-2 pdf-exclude border-r border-blue-100">
                  <div className="flex justify-center">
                    {entry.isSynced ? <div title="সেভ হয়েছে"><CheckCircle2 size={14} className="text-emerald-500" /></div> : <div title="সেভ হয়নি"><AlertCircle size={14} className="text-amber-400" /></div>}
                  </div>
                </td>
                <td className="px-1 py-2 pdf-exclude">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => onEdit(entry)} className="text-emerald-600 hover:text-emerald-800 p-1" title="এডিট"><Pencil size={14} /></button>
                    <button onClick={() => onDelete(entry.id)} className="text-rose-500 hover:text-rose-700 p-1" title="ডিলিট"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 font-bold border-t">
            <tr className="text-emerald-700">
                <td colSpan={5} className="px-2 py-2 text-right border-r border-blue-200">মোটঃ</td>
                <td className="px-1 py-2 border-r border-blue-200">{totalAmount.toLocaleString()}</td>
                <td className="px-1 py-2 border-r border-blue-200">{totalInterest.toLocaleString()}</td>
                <td colSpan={5}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
