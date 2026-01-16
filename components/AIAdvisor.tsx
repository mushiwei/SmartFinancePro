
import React, { useState } from 'react';
import { getFinancialInsights } from '../services/geminiService';
import { Transaction, AIInsight } from '../types';
import { translations, Locale } from '../translations';

interface Props {
  transactions: Transaction[];
  locale: Locale;
}

const AIAdvisor: React.FC<Props> = ({ transactions, locale }) => {
  const t = translations[locale];
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    if (transactions.length === 0) return;
    setLoading(true);
    const result = await getFinancialInsights(transactions, locale);
    if (result) setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-10 -translate-y-10">
        <div className="w-48 h-48 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <svg className="w-6 h-6 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">{t.aiTitle}</h2>
          </div>
          <button
            onClick={generateInsights}
            disabled={loading || transactions.length === 0}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-950"
          >
            {loading ? t.thinking : t.getAnalysis}
          </button>
        </div>

        {insight ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-4 bg-white/10 rounded-xl">
              <h4 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">{t.analysisLabel}</h4>
              <p className="text-sm leading-relaxed text-indigo-50">{insight.analysis}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-3">{t.suggestionsLabel}</h4>
                <ul className="space-y-2">
                  {insight.suggestions.map((s, i) => (
                    <li key={i} className="text-sm flex items-start space-x-2">
                      <span className="text-indigo-400 mt-1">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                <h4 className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-2">{t.savingTipLabel}</h4>
                <p className="text-sm italic">"{insight.savingTips}"</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-indigo-300">
            <p className="text-sm">{t.aiPlaceholder}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;
