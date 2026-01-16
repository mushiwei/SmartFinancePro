
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import AIAdvisor from './components/AIAdvisor';
import { Transaction } from './types';
import { translations, Locale } from './translations';

const STORAGE_KEY = 'smart_finance_transactions_v1';
const LOCALE_KEY = 'smart_finance_locale_v1';

const App: React.FC = () => {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem(LOCALE_KEY);
    return (saved as Locale) || 'zh';
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const t = translations[locale];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(LOCALE_KEY, locale);
  }, [locale]);

  const addTransaction = (data: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    if (confirm(locale === 'zh' ? '确定要删除这条记录吗？' : 'Are you sure you want to delete this record?')) {
      setTransactions(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleLocale = () => {
    setLocale(prev => prev === 'en' ? 'zh' : 'en');
  };

  const exportData = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `finance_backup_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          setTransactions(json);
          alert(locale === 'zh' ? '导入成功！' : 'Import successful!');
        }
      } catch (err) {
        alert(locale === 'zh' ? '导入失败，请检查文件格式。' : 'Import failed, please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m.5-1c.11 0 .21.002.318.006M12 16c-1.11 0-2.08-.402-2.599-1M12 16V7" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600">
                {t.title}
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">{locale === 'zh' ? '智能理财 · 财富增值' : 'SMART WEALTH · GROW BETTER'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:flex items-center space-x-2 mr-4 border-r pr-4 border-slate-100">
               <button 
                 onClick={exportData}
                 title={locale === 'zh' ? '导出备份' : 'Export Backup'}
                 className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
               </button>
               <label className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer">
                 <input type="file" accept=".json" onChange={importData} className="hidden" />
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
               </label>
            </div>

            <button
              onClick={toggleLocale}
              className="px-4 py-1.5 text-xs font-bold border border-slate-200 rounded-full hover:bg-slate-50 hover:border-indigo-200 transition-all uppercase tracking-widest text-slate-600 active:scale-95 bg-white shadow-sm"
            >
              {locale === 'en' ? '中文' : 'ENGLISH'}
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=finance&backgroundColor=b6e3f4`} alt="Avatar" className="w-8 h-8" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Main Dashboard & AI */}
          <div className="xl:col-span-8 space-y-8">
            <AIAdvisor transactions={transactions} locale={locale} />
            <Dashboard transactions={transactions} locale={locale} />
            <TransactionList transactions={transactions} onDelete={deleteTransaction} locale={locale} />
          </div>

          {/* Sidebar Forms */}
          <div className="xl:col-span-4 space-y-8">
            <div className="sticky top-24">
              <TransactionForm onAdd={addTransaction} locale={locale} />
              
              <div className="mt-8 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                   <svg className="w-24 h-24 text-indigo-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                </div>
                <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  {t.wisdom}
                </h3>
                <p className="text-xs text-indigo-700 leading-relaxed italic relative z-10">
                  {t.quote}
                  <span className="block mt-2 font-bold not-italic text-indigo-900 opacity-60">— {t.author}</span>
                </p>
              </div>

              <div className="mt-4 flex justify-center">
                <p className="text-[10px] text-slate-400 font-medium">
                  {locale === 'zh' ? '🔒 数据存储在浏览器本地，不会上传服务器' : '🔒 Data is stored locally in your browser'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-20 py-12 border-t border-slate-200 text-center bg-white/50">
        <p className="text-sm text-slate-400 font-medium">{t.footer}</p>
      </footer>
    </div>
  );
};

export default App;
