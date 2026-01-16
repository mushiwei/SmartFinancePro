
import React from 'react';
import { Transaction } from '../types';
import { translations, Locale } from '../translations';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  locale: Locale;
}

const TransactionList: React.FC<Props> = ({ transactions, onDelete, locale }) => {
  const t = translations[locale];
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">{t.recent}</h2>
        <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-full">
          {t.total} {transactions.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">{t.date}</th>
              <th className="px-6 py-4 font-medium">{t.description}</th>
              <th className="px-6 py-4 font-medium">{t.category}</th>
              <th className="px-6 py-4 font-medium text-right">{t.amount}</th>
              <th className="px-6 py-4 font-medium text-center">{t.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{item.description}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    item.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {(t.categories as any)[item.category] || item.category}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm font-bold text-right ${
                  item.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {item.type === 'INCOME' ? '+' : '-'}¥{item.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                  {locale === 'zh' ? '暂无交易记录。' : 'No transactions recorded yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
