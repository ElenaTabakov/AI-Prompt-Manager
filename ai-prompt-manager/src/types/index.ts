export interface Prompt {
  id: string;
  title: string;
  category: string;
  template: string;
  createdAt: number;
  updatedAt: number;
}

export type Category = 'Coding' | 'Writing' | 'Marketing' | 'Other';

export const CATEGORIES: Category[] = ['Coding', 'Writing', 'Marketing', 'Other'];

