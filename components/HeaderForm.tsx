
import React, { useState } from 'react';
import { ReportHeader } from '../types.ts';
import { Settings, Link2, Building2, ChevronDown, Plus, Trash2, List, RotateCcw, MapPin, AlertCircle } from 'lucide-react';

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
  const [errorMsg, setErrorMsg] = useState("");

  const getCurrentList = () => {
    switch (activeTab) {
      case 'bank': return bankList;
      case 'branch': return branchList;
      case 'district': return districtList;
      case 'upazila': return upazilaList;
      case 'sector': return sectorList;
      default: return [];
    }
  };

  const handleAddItem = () => {
    const value = newItem.trim();
    if (!value) return;

    const currentList = getCurrentList();
    if (currentList.includes(value)) {
      setErrorMsg("এই নামটি ইতোমধ্যেই তালিকায় রয়েছে!");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    if (activeTab === 'bank') setBankList([...bankList, value].sort((a,b) => a.localeCompare(b, 'bn')));
    else if (activeTab === 'branch') setBranchList([...branchList, value].sort((a,b) => a.localeCompare(b, 'bn')));
    else if (activeTab === 'district') setDistrictList([...districtList, value].sort((a,b) => a.localeCompare(b, 'bn')));
    else if (activeTab === 'upazila') setUpazilaList([...upazilaList, value].sort((a,b) => a.localeCompare(b, 'bn')));
    else if (activeTab === 'sector') setSectorList([...sectorList, value].sort((a,b) => a.localeCompare(b, 'bn')));
    
    setNewItem("");
    setErrorMsg("");
  };

  const removeItem = (item: string) => {
    if (window.confirm(`আপনি কি নিশ্চিতভাবে "${item}" তালিকা থেকে মুছতে চান?`)) {
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
    const existingAreas = currentText.split(',').map(s => s.trim()).filter(s => s !== "");
    
    if (!existingAreas.includes(val)) {
      const updatedAreas = existingAreas.length > 0 
        ? [...existingAreas, val].join(', ') 
        : val;
      onChange('disbursementArea', updatedAreas);
    }
  };

  const tabNames = {
    bank: 'ব্যাংক',
    branch: 'শাখা',
    district: 'জেলা/এলাকা',
    upazila: 'উপজেলা',
    sector: 'ঋণের খাত'
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 mb-12 pdf-exclude relative transition-all">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg"><Building2 size={28} /></div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">রিপোর্ট কনফিগারেশন</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">শাখা ও ড্রপডাউন ব্যবস্থাপনা</p>
          </div>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`px-6 py-3 rounded-2xl border-2 shadow-sm transition-all flex items-center gap-2 text-[11px] font-black ${showSettings ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-white border-emerald-50 text-emerald-700 hover:bg-emerald-50'}`}
          >
            <Settings size={18} className={showSettings ? 'animate-spin-slow' : ''} /> 
            {showSettings ? 'সেটিংস বন্ধ করুন' : 'শিট ও ড্রপডাউন সেটিংস'}
          </button>
        )}
      </div>

      {isAdmin && showSettings && (
        <div className="mb-10 p-6 md:p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-emerald-100 space-y-8 animate-in slide-in-from-top-4 duration-300">
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
              <div className="flex justify-between items-center">
                <h3 className="text-[12px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                  <List size={18} /> ড্রপডাউন তথ্য ব্যবস্থাপনা
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {(Object.keys(tabNames) as Array<keyof typeof tabNames>).map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => { setActiveTab(tab); setErrorMsg(""); }}
                    className={`px-4 md:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-emerald-700 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
                  >
                    {tabNames[tab]}
                  </button>
                ))}
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                 <div className="flex flex-col sm:flex-row gap-4 mb-2">
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        placeholder={`নতুন ${tabNames[activeTab]} এর নাম...`} 
                        className={`w-full p-4 bg-slate-50 border-2 rounded-xl outline-none font-bold transition-all ${errorMsg ? 'border-rose-300 focus:border-rose-500' : 'border-slate-100 focus:border-emerald-500'}`}
                        value={newItem}
                        onChange={(e) => { setNewItem(e.target.value); setErrorMsg(""); }}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                      />
                      {errorMsg && (
                        <div className="absolute -bottom-6 left-1 text-[10px] font-bold text-rose-500 flex items-center gap-1">
                          <AlertCircle size={12} /> {errorMsg}
                        </div>
                      )}
                    </div>
                    <button onClick={handleAddItem} className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-md active:scale-95">
                      <Plus size={20} /> যোগ করুন
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-10 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {getCurrentList().length > 0 ? getCurrentList().map(item => (
                      <div key={item} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-200 transition-all hover:bg-emerald-50/30">
                        <span className="text-xs font-bold text-slate-700 truncate mr-2" title={item}>{item}</span>
                        <button onClick={() => removeItem(item)} className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all p-2 bg-white rounded-lg shadow-sm border border-rose-50">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )) : (
                      <div className="col-span-full py-10 text-center text-slate-400 text-xs font-bold">
                        তালিকায় কোনো তথ্য নেই।
                      </div>
                    )}
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
                title="সব মুছুন"
              >
                <RotateCcw size={20} />
              </button>
            )}
          </div>
          <div className="relative mt-1">
            <input
              disabled={!isAdmin}
              type="text"
              placeholder="বাছাইকৃত জেলাগুলো এখানে কমা দিয়ে বসবে..."
              className="w-full p-4 border-b-2 border-slate-100 outline-none text-[13px] font-black text-emerald-800 bg-transparent focus:border-emerald-300 transition-all"
              value={data.disbursementArea}
              onChange={(e) => onChange('disbursementArea', e.target.value)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300">
               <MapPin size={14} />
            </div>
          </div>
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
