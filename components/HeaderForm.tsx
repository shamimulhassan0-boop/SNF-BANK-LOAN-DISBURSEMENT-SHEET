
import React, { useState } from 'react';
import { ReportHeader } from '../types';
import { Settings, Link2, Building2, ChevronDown, Plus, Trash2, List, RotateCcw } from 'lucide-react';

interface HeaderFormProps {
  data: ReportHeader;
  onChange: (field: keyof ReportHeader, value: string) => void;
  googleSheetUrl: string;
  onUrlChange: (url: string) => void;
  autoSync: boolean;
  onSyncToggle: (val: boolean) => void;
  isAdmin: boolean;
  bankList: string[];
  setBankList: (val: string[]) => void;
  branchList: string[];
  setBranchList: (val: string[]) => void;
  districtList: string[];
  setDistrictList: (val: string[]) => void;
  upazilaList: string[];
  setUpazilaList: (val: string[]) => void;
  sectorList: string[];
  setSectorList: (val: string[]) => void;
}

export const HeaderForm: React.FC<HeaderFormProps> = ({ 
  data, onChange, googleSheetUrl, onUrlChange, autoSync, onSyncToggle, isAdmin,
  bankList, setBankList, branchList, setBranchList, districtList, setDistrictList, upazilaList, setUpazilaList, sectorList, setSectorList
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [activeTab, setActiveTab] = useState<'bank' | 'branch' | 'district' | 'upazila' | 'sector'>('bank');

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    const value = newItem.trim();
    if (activeTab === 'bank') setBankList([...bankList, value]);
    else if (activeTab === 'branch') setBranchList([...branchList, value]);
    else if (activeTab === 'district') setDistrictList([...districtList, value]);
    else if (activeTab === 'upazila') setUpazilaList([...upazilaList, value]);
    else if (activeTab === 'sector') setSectorList([...sectorList, value]);
    setNewItem("");
  };

  const removeItem = (item: string) => {
    if (window.confirm(`আপনি কি "${item}" মুছতে চান?`)) {
      if (activeTab === 'bank') setBankList(bankList.filter(i => i !== item));
      else if (activeTab === 'branch') setBranchList(branchList.filter(i => i !== item));
      else if (activeTab === 'district') setDistrictList(districtList.filter(i => i !== item));
      else if (activeTab === 'upazila') setUpazilaList(upazilaList.filter(i => i !== item));
      else if (activeTab === 'sector') setSectorList(sectorList.filter(i => i !== item));
    }
  };

  const handleAddArea = (val: string) => {
    if (!val) return;
    const currentText = data.disbursementArea || "";
    // split current string by comma and trim to get individual areas
    const existingAreas = currentText.split(',').map(s => s.trim()).filter(s => s !== "");
    
    // add only if it doesn't already exist to avoid duplication
    if (!existingAreas.includes(val)) {
      const updatedAreas = [...existingAreas, val].join(', ');
      onChange('disbursementArea', updatedAreas);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 mb-12 pdf-exclude relative transition-all">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg"><Building2 size={28} /></div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">রিপোর্ট কনফিগারেশন</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">GENERAL SETTINGS & LISTS</p>
          </div>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`px-6 py-3 rounded-2xl border-2 shadow-sm transition-all flex items-center gap-2 text-[11px] font-black ${showSettings ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-white border-emerald-50 text-emerald-700 hover:bg-emerald-50'}`}
          >
            <Settings size={18} /> {showSettings ? 'সেটিংস বন্ধ করুন' : 'শিট ও ড্রপডাউন সেটিংস'}
          </button>
        )}
      </div>

      {isAdmin && showSettings && (
        <div className="mb-10 p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-emerald-100 space-y-8 animate-in slide-in-from-top-4 duration-300">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-b border-emerald-100 pb-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1">Google Script Web App URL</label>
                <div className="relative">
                  <Link2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="https://script.google.com/macros/s/..." 
                    className="w-full pl-12 p-4 text-xs border-2 rounded-2xl outline-none transition-all bg-white shadow-sm font-bold border-slate-200 focus:border-emerald-500"
                    value={googleSheetUrl}
                    onChange={(e) => onUrlChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-4 cursor-pointer p-4 bg-white rounded-2xl border-2 border-slate-100 w-full hover:border-emerald-200 transition-all shadow-sm">
                  <input type="checkbox" checked={autoSync} onChange={(e) => onSyncToggle(e.target.checked)} className="w-6 h-6 accent-emerald-600 rounded-lg cursor-pointer" />
                  <span className="text-sm font-black text-slate-600">অটো-সেভ (Real-time Cloud Sync)</span>
                </label>
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-[12px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                <List size={18} /> ড্রপডাউন তথ্য ব্যবস্থাপনা (এডিট মোড)
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {(['bank', 'branch', 'district', 'upazila', 'sector'] as const).map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-emerald-700 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
                  >
                    {tab === 'bank' ? 'ব্যাংক' : tab === 'branch' ? 'শাখা' : tab === 'district' ? 'জেলা/এলাকা' : tab === 'upazila' ? 'উপজেলা' : 'ঋণের খাত'}
                  </button>
                ))}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <div className="flex gap-4 mb-6">
                    <input 
                      type="text" 
                      placeholder={`নতুন ${activeTab === 'bank' ? 'ব্যাংক' : activeTab === 'branch' ? 'শাখা' : activeTab === 'district' ? 'জেলা' : activeTab === 'upazila' ? 'উপজেলা' : 'ঋণের খাত'} এর নাম...`} 
                      className="flex-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-bold"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                    />
                    <button onClick={handleAddItem} className="bg-emerald-600 text-white px-6 rounded-xl font-black flex items-center gap-2 hover:bg-emerald-700 transition-all">
                      <Plus size={20} /> যোগ করুন
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {(activeTab === 'bank' ? bankList : activeTab === 'branch' ? branchList : activeTab === 'district' ? districtList : activeTab === 'upazila' ? upazilaList : sectorList).map(item => (
                      <div key={item} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-emerald-200 transition-all">
                        <span className="text-xs font-bold text-slate-700 truncate mr-2" title={item}>{item}</span>
                        <button onClick={() => removeItem(item)} className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-3">
          <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">ব্যাংকের নাম</label>
          <div className="relative">
            <select
              disabled={!isAdmin}
              className="w-full p-5 border-2 rounded-[1.5rem] outline-none font-black text-slate-700 shadow-sm transition-all appearance-none bg-slate-50 border-slate-50 focus:border-emerald-500"
              value={data.bankName}
              onChange={(e) => onChange('bankName', e.target.value)}
            >
              <option value="">-- ব্যাংক বাছুন --</option>
              {bankList.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">এমএফআই-এর নাম</label>
          <input
            disabled={!isAdmin}
            type="text"
            className="w-full p-5 border-2 rounded-[1.5rem] outline-none font-black text-slate-700 shadow-sm bg-slate-50 border-slate-50 focus:border-emerald-500"
            value={data.mfiName}
            onChange={(e) => onChange('mfiName', e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">এলাকা/অঞ্চল (একাধিক বাছুন)</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                disabled={!isAdmin}
                className="w-full p-5 border-2 rounded-[1.5rem] outline-none font-black text-slate-700 shadow-sm transition-all appearance-none bg-slate-50 border-slate-50 focus:border-emerald-500 pr-10"
                value=""
                onChange={(e) => handleAddArea(e.target.value)}
              >
                <option value="">-- জেলা বাছুন --</option>
                {districtList.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <ChevronDown size={18} />
              </div>
            </div>
            {data.disbursementArea && isAdmin && (
              <button 
                onClick={() => onChange('disbursementArea', '')}
                className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all border-2 border-rose-100 shadow-sm flex items-center justify-center"
                title="মুছে ফেলুন"
              >
                <RotateCcw size={20} />
              </button>
            )}
          </div>
          <input
            disabled={!isAdmin}
            type="text"
            placeholder="বাছাইকৃত জেলাগুলো এখানে কমা দিয়ে বসবে..."
            className="w-full p-4 border-b-2 border-slate-100 outline-none text-[13px] font-black text-emerald-800 bg-transparent focus:border-emerald-300 transition-all mt-1"
            value={data.disbursementArea}
            onChange={(e) => onChange('disbursementArea', e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">ত্রৈমাসিকের নাম</label>
          <input
            disabled={!isAdmin}
            type="text"
            className="w-full p-5 border-2 rounded-[1.5rem] outline-none font-black text-slate-700 shadow-sm bg-slate-50 border-slate-50 focus:border-emerald-500"
            placeholder="যেমন: জানুয়ারি-মার্চ ২০২৫"
            value={data.reportPeriod}
            onChange={(e) => onChange('reportPeriod', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
