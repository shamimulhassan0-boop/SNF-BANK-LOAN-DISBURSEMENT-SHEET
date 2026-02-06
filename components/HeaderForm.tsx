
import React, { useState } from 'react';
import { ReportHeader } from '../types';
import { Settings, Cloud, Link2 } from 'lucide-react';

interface HeaderFormProps {
  data: ReportHeader;
  onChange: (field: keyof ReportHeader, value: string) => void;
  googleSheetUrl: string;
  onUrlChange: (url: string) => void;
  autoSync: boolean;
  onSyncToggle: (val: boolean) => void;
}

export const HeaderForm: React.FC<HeaderFormProps> = ({ 
  data, 
  onChange, 
  googleSheetUrl, 
  onUrlChange, 
  autoSync, 
  onSyncToggle 
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const commonBanks = [
    "সোনালী ব্যাংক লিমিটেড", "জনতা ব্যাংক লিমিটেড", "অগ্রণী ব্যাংক লিমিটেড", "রূপালী ব্যাংক লিমিটেড", 
    "বেসিক ব্যাংক লিমিটেড", "বাংলাদেশ ডেভেলপমেন্ট ব্যাংক", "বাংলাদেশ কৃষি ব্যাংক", "রাজশাহী কৃষি উন্নয়ন ব্যাংক", 
    "আইএফআইসি ব্যাংক লিমিটেড", "ইউনাইটেড কমার্শিয়াল ব্যাংক (ইউসিবি)", "এবি ব্যাংক লিমিটেড", 
    "ইসলামী ব্যাংক বাংলাদেশ লিমিটেড", "আইসিবি ইসলামিক ব্যাংক লিমিটেড", "আল-আরাফাহ ইসলামী ব্যাংক", 
    "সোশ্যাল ইসলামী ব্যাংক লিমিটেড", "এক্সিম ব্যাংক লিমিটেড", "ফার্স্ট সিকিউরিটি ইসলামী ব্যাংক", 
    "শাহজালাল ইসলামী ব্যাংক", "ইউনিয়ন ব্যাংক লিমিটেড", "স্ট্যান্ডার্ড ব্যাংক লিমিটেড", 
    "দি সিটি ব্যাংক লিমিটেড", "ডাচ-বাংলা ব্যাংক লিমিটেড", "ন্যাশনাল ব্যাংক লিমিটেড", 
    "পুবালী ব্যাংক লিমিটেড", "উ উত্তরা ব্যাংক লিমিটেড", "ইস্টার্ন ব্যাংক লিমিটেড", 
    "এনসিসি ব্যাংক লিমিটেড", "মার্কেন্টাইল ব্যাংক লিমিটেড", "প্রাইম ব্যাংক লিমিটেড", 
    "সাউথইস্ট ব্যাংক লিমিটেড", "ঢাকা ব্যাংক লিমিটেড", "মিউচুয়াল ট্রাস্ট ব্যাংক লিমিটেড", 
    "ওয়ান ব্যাংক লিমিটেড", "ট্রাস্ট ব্যাংক লিমিটেড", "ব্যাংক এশিয়া লিমিটেড", 
    "যমুনা ব্যাংক লিমিটেড", "প্রিমিয়ার ব্যাংক লিমিটেড", "ব্র্যাক ব্যাংক লিমিটেড", 
    "এনআরবি কমার্শিয়াল ব্যাংক", "এনআরবি ব্যাংক লিমিটেড", "এনআরবি গ্লোবাল ব্যাংক", 
    "মেঘনা ব্যাংক লিমিটেড", "মিডল্যান্ড ব্যাংক লিমিটেড", "সাউথ বাংলা এগ্রিকালচার অ্যান্ড কমার্স ব্যাংক", 
    "মধুমতি ব্যাংক লিমিটেড", "পদ্মা ব্যাংক লিমিটেড", "বেঙ্গল কমার্শিয়াল ব্যাংক", 
    "সিটিজেনস ব্যাংক পিএলসি", "কমিউনিটি ব্যাংক বাংলাদেশ লিমিটেড", "স্ট্যান্ডার্ড চার্টার্ড ব্যাংক", 
    "স্টেট ব্যাংক অফ ইন্ডিয়া", "হাবিব ব্যাংক লিমিটেড", "ন্যাশনাল ব্যাংক অফ পাকিস্তান", 
    "কমার্শিয়াল ব্যাংক অফ সিলন", "ব্যাংক আলফালাহ", "এইচএসবিসি", "উরি ব্যাংক", "ব্যাংক অফ চায়না"
  ];

  const commonMFIs = [
    "শিশু নিলয় ফাউন্ডেশন (এসএনএফ)",
    "পিকেএসএফ",
    "ব্র্যাক (BRAC)",
    "আশা (ASA)",
    "ব্যুরো বাংলাদেশ",
    "টিএমএসএস",
    "পদক্ষেপ",
    "সাজিদ"
  ];
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">সাধারণ তথ্য (General Information)</h2>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors border border-emerald-100"
        >
          <Settings size={14} /> ক্লাউড সেটিংস
        </button>
      </div>

      {showSettings && (
        <div className="mb-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100 animate-in slide-in-from-top duration-300">
           <div className="flex items-center gap-2 mb-3 text-emerald-800">
             <Cloud size={18} />
             <h3 className="font-bold text-sm">গুগল শিট কানেকশন (Google Sheets API/Web App)</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-emerald-700 uppercase mb-1">গুগল অ্যাপ স্ক্রিপ্ট URL (Web App URL)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                    <input 
                      type="text" 
                      placeholder="https://script.google.com/macros/s/..." 
                      className="w-full pl-9 p-2 text-xs border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={googleSheetUrl}
                      onChange={(e) => onUrlChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer group mb-2">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer" 
                    checked={autoSync} 
                    onChange={(e) => onSyncToggle(e.target.checked)} 
                  />
                  <span className="text-sm font-semibold text-emerald-800">ডাটা এন্ট্রির সাথে সাথে অটো-সেভ করুন</span>
                </label>
              </div>
           </div>
           <p className="mt-2 text-[10px] text-emerald-600 italic">* গুগল শিট এ সেভ করার জন্য একটি Apps Script Web App প্রয়োজন।</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">ব্যাংকের নাম</label>
          <input
            list="bank-list"
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            placeholder="ব্যাংক নির্বাচন করুন বা লিখুন"
            value={data.bankName}
            onChange={(e) => onChange('bankName', e.target.value)}
          />
          <datalist id="bank-list">
            {commonBanks.map(bank => <option key={bank} value={bank} />)}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">এমএফআই-এর নাম</label>
          <input
            list="mfi-list"
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            placeholder="উদাঃ শিশু নিলয় ফাউন্ডেশন (এসএনএফ)"
            value={data.mfiName}
            onChange={(e) => onChange('mfiName', e.target.value)}
          />
          <datalist id="mfi-list">
            {commonMFIs.map(mfi => <option key={mfi} value={mfi} />)}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">বিতরণকৃত এলাকা</label>
          <input
            type="text"
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            placeholder="উদাঃ শিবপুর, নরসিংদী"
            value={data.disbursementArea}
            onChange={(e) => onChange('disbursementArea', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">রিপোর্টের সময়কাল</label>
          <input
            type="text"
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            placeholder="উদাঃ জানুয়ারি-মার্চ ২০২৫"
            value={data.reportPeriod}
            onChange={(e) => onChange('reportPeriod', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
