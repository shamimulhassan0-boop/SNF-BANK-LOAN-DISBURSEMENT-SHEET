
import React from 'react';
import { HelpCircle, LogIn, Settings, Database, Cloud, FileDown, ShieldCheck, Sparkles } from 'lucide-react';

export const Guidelines: React.FC = () => {
  const steps = [
    {
      icon: <LogIn className="text-emerald-600" size={24} />,
      title: "ধাপ ১: লগইন",
      desc: "আপনার নির্দিষ্ট শাখা নির্বাচন করে পোর্টালে প্রবেশ করুন। অ্যাডমিন কাজের জন্য 'ADMIN' শাখা ব্যবহার করুন।"
    },
    {
      icon: <Settings className="text-blue-600" size={24} />,
      title: "ধাপ ২: কনফিগারেশন",
      desc: "অ্যাডমিন প্যানেল থেকে ব্যাংকের নাম, এলাকা এবং গুগল শিট স্ক্রিপ্ট URL সেটআপ করে নিন।"
    },
    {
      icon: <Database className="text-purple-600" size={24} />,
      title: "ধাপ ৩: ডাটা এন্ট্রি",
      desc: "ঋণ গ্রহীতার সঠিক তথ্য প্রদান করুন। দ্রুত মন্তব্যের জন্য 'AI স্মার্ট মন্তব্য' বাটনটি ব্যবহার করতে পারেন।"
    },
    {
      icon: <Cloud className="text-amber-600" size={24} />,
      title: "ধাপ ৪: ক্লাউড সিঙ্ক",
      desc: "ডাটা এন্ট্রি শেষে অবশ্যই 'শিটে সেভ' বাটনে ক্লিক করুন। হলুদ রঙের ভাসমান বাটনটি আপনাকে সেভ করার কথা মনে করিয়ে দেবে।"
    },
    {
      icon: <FileDown className="text-rose-600" size={24} />,
      title: "ধাপ ৫: ডাউনলোড",
      desc: "প্রয়োজন অনুযায়ী পরিদর্শন রিপোর্টটি PDF অথবা ব্যাকআপ হিসেবে Excel ফরম্যাটে ডাউনলোড করে রাখুন।"
    }
  ];

  return (
    <div id="guidelines-section" className="mt-20 border-t-4 border-emerald-500 pt-16 pdf-exclude">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg">
          <HelpCircle size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800">ব্যবহারের নির্দেশিকা</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">System Operation Guidelines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group hover:-translate-y-2">
            <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
              {step.icon}
            </div>
            <h4 className="font-black text-slate-800 mb-3 text-lg">{step.title}</h4>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-emerald-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="bg-white/10 p-4 rounded-3xl"><ShieldCheck size={40} className="text-emerald-400" /></div>
          <div>
            <h3 className="text-xl font-black mb-1">গুরুত্বপূর্ণ নিরাপত্তা বার্তা</h3>
            <p className="text-emerald-200 text-xs font-bold">আপনার ব্রাউজারের ক্যাশ (Cache) ক্লিয়ার করলে আন-সিঙ্কড ডাটা মুছে যেতে পারে। তাই কাজ শেষে অবশ্যই 'শিটে সেভ' করুন।</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
          <Sparkles size={18} className="text-amber-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">Powered by Gemini AI 3.0</span>
        </div>
      </div>
    </div>
  );
};
