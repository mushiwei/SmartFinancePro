
import React, { useState } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { translations, Locale } from '../translations';

interface Props {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  locale: Locale;
}

const TransactionForm: React.FC<Props> = ({ onAdd, locale }) => {
  const t = translations[locale];
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(Category.FOOD);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAdd({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date
    });

    setAmount('');
    setDescription('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-semibold mb-6 text-slate-800">{t.newTransaction}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => { setType('EXPENSE'); setCategory(Category.FOOD); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'EXPENSE' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t.expense}
          </button>
          <button
            type="button"
            onClick={() => { setType('INCOME'); setCategory(Category.SALARY); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t.income_btn}
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">{t.amount} (¥)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">{t.category}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {type === 'INCOME' ? (
                <>
                  <option value={Category.SALARY}>{t.categories.Salary}</option>
                  <option value={Category.FREELANCE}>{t.categories.Freelance}</option>
                  <option value={Category.INVESTMENT}>{t.categories.Investment}</option>
                  <option value={Category.OTHERS}>{t.categories.Others}</option>
                </>
              ) : (
                Object.values(Category)
                  .filter(c => ![Category.SALARY, Category.FREELANCE, Category.INVESTMENT].includes(c))
                  .map(c => (
                    <option key={c} value={c}>{(t.categories as any)[c] || c}</option>
                  ))
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">{t.date}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">{t.description}</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder={locale === 'zh' ? "这笔钱花在哪里了？" : "What was this for?"}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mt-4 active:scale-95"
        >
          {t.add} {type === 'INCOME' ? t.income_btn : t.expense}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
