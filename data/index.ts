/**
 * Data Index
 * 統一匯出所有資料
 */

// 舊的資料匯出（保持向後相容，未來移除）
export * from './toolsData';

// JSON 資料路徑
export const DATA_PATHS = {
  tools: '@/data/tools/tools.json',
  reviews: '@/data/tools/reviews.json',
  categories: '@/data/tools/categories.json',
} as const;
