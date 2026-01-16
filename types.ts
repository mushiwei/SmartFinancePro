
export type TransactionType = 'INCOME' | 'EXPENSE';

export enum Category {
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  INVESTMENT = 'Investment',
  FOOD = 'Food & Dining',
  TRANSPORT = 'Transportation',
  HOUSING = 'Housing & Utilities',
  ENTERTAINMENT = 'Entertainment',
  SHOPPING = 'Shopping',
  HEALTH = 'Health & Fitness',
  EDUCATION = 'Education',
  OTHERS = 'Others'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
}

export interface AIInsight {
  analysis: string;
  suggestions: string[];
  savingTips: string;
}
