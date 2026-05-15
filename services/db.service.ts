// services/db.service.ts

import Dexie, { type Table } from 'dexie';
import type { Expense, Budget, Category, SyncMetadata } from '../types/db';

export class AppDatabase extends Dexie {
  expenses!: Table<Expense>;
  budgets!: Table<Budget>;
  categories!: Table<Category>;
  syncMetadata!: Table<SyncMetadata>;

  constructor() {
    super('NEO_LEDGER_DB');
    
    this.version(1).stores({
      expenses: '++id, amount, category, date, vendor',
      budgets: '++id, category, period',
      categories: '++id, name',
      syncMetadata: 'id'
    });
  }

  async exportData(): Promise<string> {
    const expenses = await this.expenses.toArray();
    const budgets = await this.budgets.toArray();
    const categories = await this.categories.toArray();
    
    return JSON.stringify({
      expenses,
      budgets,
      categories,
      exportedAt: Date.now()
    });
  }

  async importData(json: string) {
    const data = JSON.parse(json);
    await this.transaction('rw', [this.expenses, this.budgets, this.categories], async () => {
      await this.expenses.clear();
      await this.budgets.clear();
      await this.categories.clear();
      await this.expenses.bulkAdd(data.expenses);
      await this.budgets.bulkAdd(data.budgets);
      await this.categories.bulkAdd(data.categories);
    });
  }
}

export const db = new AppDatabase();
