
import React from 'react';
import { HelpCircle, LogIn, Settings, Database, Cloud, FileDown, ShieldCheck, Sparkles, Share2 } from 'lucide-react';

export const Guidelines: React.FC = () => {
  const steps = [
    {
      icon: <LogIn className="text-emerald-600" size={24} />,
      title: "ধাপ ১: শাখা পোর্টালে প্রবেশ",
      desc: "সবার জন্য একটাই লিঙ্ক। প্রবেশ করে নিজ নিজ শাখা নির্বাচন করলেই কাজ শুরু হবে।"
    },
    {
      icon: <Share2 className="text-blue-600" size={24} />,
      title: "ধাপ ২: ইনভাইট ও শেয়ার",
      desc: "উপরের ইনভাইট বাটন থেকে লিঙ্কটি কপি করে সকল পরিদর্শককে পাঠিয়ে দিন।"
    },
    {
      icon: <Database className="text-purple-600" size={24} />,
      title: "ধাপ ৩: কেন্দ্রীয় এন্ট্রি",
      desc: "সবাই যার যার মোবাইল বা ল্যাপটপ থেকে এন্ট্রি করলে তা একটি নির্দিষ্ট গুগল শিটে জমা হবে।"
    },
    {
      icon: <Cloud className="text-amber-600" size={24} />,
      title: "ধাপ ৪: ক্লাউড সিঙ্ক",
      desc: "ডাটা এন্ট্রি শেষে 'শিটে সেভ' দিলে তা শিটে চলে যাবে। হলুদ সিঙ্ক স্ট্যাটাস আপনাকে আপডেট জানাবে।"
    },
    {
      icon: <FileDown className="text-rose-600" size={24} />,
      title: "ধাপ ৫: সম্মিলিত রিপোর্ট",
      desc: "অ্যাডমিন চাইলে Excel ডাউনলোড করে সব শাখার তথ্য একসাথে সামারি করতে পারবেন।"
    }
  ];

  return (
    <div id="guidelines-section" className="mt-20 border-t-4 border-emerald-500 pt-16 pdf-exclude">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg">
          <HelpCircle size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800">সহযোগিতা ও মাল্টি-ইউজার নির্দেশিকা</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Multi-user Collaboration System</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group hover:-translate-y-2">
            <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
              {step.icon}
            </div>
            <h4 className="font-black text-slate-800 mb-3 text-lg leading-tight">{step.title}</h4>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-emerald-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="bg-white/10 p-4 rounded-3xl"><ShieldCheck size={40} className="text-emerald-400" /></div>
          <div>
            <h3 className="text-xl font-black mb-1">কেন্দ্রীয় ডাটাবেজ সিস্টেম</h3>
            <p className="text-emerald-200 text-xs font-bold">যেহেতু শিট ইউআরএল একটিই, তাই সবাই একই সময়ে কাজ করতে পারবেন কোনো ডেটা লস ছাড়াই।</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
          <Sparkles size={18} className="text-amber-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Ready v4.0</span>
        </div>
      </div>
    </div>
  );
};
