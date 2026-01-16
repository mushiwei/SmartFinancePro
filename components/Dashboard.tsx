
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Transaction, Category } from '../types';
import { translations, Locale } from '../translations';

interface Props {
  transactions: Transaction[];
  locale: Locale;
}

const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#3b82f6'];

const Dashboard: React.FC<Props> = ({ transactions, locale }) => {
  const t = translations[locale];
  
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(trans => {
      if (trans.type === 'INCOME') income += trans.amount;
      else expense += trans.amount;
    });
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const chartData = useMemo(() => {
    const months: Record<string, { month: string, income: number, expense: number }> = {};
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sorted.forEach(trans => {
      const m = trans.date.substring(0, 7); // YYYY-MM
      if (!months[m]) months[m] = { month: m, income: 0, expense: 0 };
      if (trans.type === 'INCOME') months[m].income += trans.amount;
      else months[m].expense += trans.amount;
    });

    return Object.values(months);
  }, [transactions]);

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions.filter(trans => trans.type === 'EXPENSE').forEach(trans => {
      const label = (t.categories as any)[trans.category] || trans.category;
      cats[label] = (cats[label] || 0) + trans.amount;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [transactions, t.categories]);

  const formatCurrency = (val: number) => {
    return `¥${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-12 h-12 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.97 0-1.82 1.28-3.26 3.11-3.66V3.5h2.67v1.96c1.49.3 2.66 1.21 2.87 2.9h-1.87c-.16-.92-.81-1.48-2.14-1.48-1.32 0-2.23.57-2.23 1.53 0 .77.62 1.4 2.66 1.91 2.51.62 4.21 1.65 4.21 4.15.01 1.9-1.39 3.2-3.32 3.62z"/></svg>
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{t.balance}</p>
          <p className={`text-3xl font-bold mt-1 ${summary.balance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
            {formatCurrency(summary.balance)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-emerald-600 uppercase tracking-wide">{t.income}</p>
          <p className="text-3xl font-bold mt-1 text-slate-900">
            {formatCurrency(summary.income)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-rose-500 uppercase tracking-wide">{t.expenses}</p>
          <p className="text-3xl font-bold mt-1 text-slate-900">
            {formatCurrency(summary.expense)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">{t.trend}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(val: number) => [formatCurrency(val), '']}
                />
                <Bar name={t.income_btn} dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar name={t.expense} dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">{t.breakdown}</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => formatCurrency(val)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="hidden sm:block ml-4 space-y-1">
              {categoryData.slice(0, 5).map((cat, idx) => (
                <div key={cat.name} className="flex items-center text-xs text-slate-600">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
