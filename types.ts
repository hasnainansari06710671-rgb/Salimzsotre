
export interface AppEntry {
  id: string;
  name: string;
  developer: string;
  description: string;
  category: string;
  iconUrl: string;
  rating: number;
  downloads: string;
  size: string;
  screenshots: string[];
  apkUrl: string;
  createdAt: any;
  isFeatured?: boolean;
}

export enum Category {
  GAMES = 'Games',
  SOCIAL = 'Social',
  TOOLS = 'Tools',
  ENTERTAINMENT = 'Entertainment',
  EDUCATION = 'Education',
  PRODUCTIVITY = 'Productivity'
}
