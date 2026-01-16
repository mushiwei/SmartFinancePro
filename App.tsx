
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
    setTransactions(prev => prev.filter(item => item.id !== id));
  };

  const toggleLocale = () => {
    setLocale(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m.5-1c.11 0 .21.002.318.006M12 16c-1.11 0-2.08-.402-2.599-1M12 16V7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              {t.title}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLocale}
              className="px-3 py-1 text-xs font-bold border border-slate-200 rounded-full hover:bg-slate-50 transition-colors uppercase tracking-widest text-slate-600"
            >
              {locale === 'en' ? '中文' : 'EN'}
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=finance`} alt="Avatar" />
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
              
              <div className="mt-8 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <h3 className="text-sm font-bold text-indigo-900 mb-2">{t.wisdom}</h3>
                <p className="text-xs text-indigo-700 leading-relaxed italic">
                  {t.quote}
                  <span className="block mt-2 font-bold not-italic">— {t.author}</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-20 py-10 border-t border-slate-200 text-center">
        <p className="text-sm text-slate-400">{t.footer}</p>
      </footer>
    </div>
  );
};

export default App;
