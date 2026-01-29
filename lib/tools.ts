/**
 * Tools Data Utilities
 * 工具資料載入與處理函數
 * Phase 3.5: 已遷移至資料庫
 */

import type { Tool, ToolBase, ToolReview, FilterState } from '@/types';
import { prisma } from '@/lib/prisma';

// 評論和分類仍從 JSON 載入（暫時保留）
import reviewsData from '@/data/tools/reviews.json';
import categoriesData from '@/data/tools/categories.json';

const REVIEWS: ToolReview[] = reviewsData as ToolReview[];

/**
 * 分類介面
 */
export interface Category {
  id: string;
  name: string;
  icon: string;
}

const CATEGORIES: Category[] = categoriesData as Category[];

/**
 * 將資料庫工具轉換為 Tool 類型
 */
function dbToolToTool(dbTool: {
  id: number;
  slug: string;
  name: string;
  description: string;
  fullDescription: string | null;
  url: string;
  logo: string | null;
  category: string;
  pricing: string;
  features: string | null;
  tags: string | null;
  pricingPlans: string | null;
  screenshots: string | null;
  relatedToolIds: string | null;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Tool {
  return {
    id: dbTool.id,
    slug: dbTool.slug,
    name: dbTool.name,
    description: dbTool.description,
    fullDescription: dbTool.fullDescription || dbTool.description,
    url: dbTool.url,
    logo: dbTool.logo || '/images/tools/default-logo.png',
    category: dbTool.category,
    pricing: dbTool.pricing as 'free' | 'freemium' | 'paid',
    features: dbTool.features ? JSON.parse(dbTool.features) : [],
    tags: dbTool.tags ? JSON.parse(dbTool.tags) : [],
    pricingPlans: dbTool.pricingPlans ? JSON.parse(dbTool.pricingPlans) : [],
    screenshots: dbTool.screenshots ? JSON.parse(dbTool.screenshots) : [],
    relatedToolIds: dbTool.relatedToolIds ? JSON.parse(dbTool.relatedToolIds) : [],
    rating: dbTool.rating,
    reviewCount: dbTool.reviewCount,
  };
}

/**
 * 獲取所有工具（基礎資訊）- 異步版本
 */
export async function getAllToolsAsync(): Promise<ToolBase[]> {
  const dbTools = await prisma.tool.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { rating: 'desc' }],
  });
  return dbTools.map(tool => dbToolToTool(tool));
}

/**
 * 獲取所有完整工具資料 - 異步版本
 */
export async function getAllToolsFullAsync(): Promise<Tool[]> {
  const dbTools = await prisma.tool.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { rating: 'desc' }],
  });
  return dbTools.map(tool => dbToolToTool(tool));
}

/**
 * 根據 ID 獲取工具 - 異步版本
 */
export async function getToolByIdAsync(id: number): Promise<Tool | null> {
  const dbTool = await prisma.tool.findUnique({
    where: { id },
  });
  return dbTool ? dbToolToTool(dbTool) : null;
}

/**
 * 根據 slug 獲取工具 - 異步版本
 */
export async function getToolBySlugAsync(slug: string): Promise<Tool | null> {
  const dbTool = await prisma.tool.findUnique({
    where: { slug },
  });
  return dbTool ? dbToolToTool(dbTool) : null;
}

/**
 * 根據 ID 或 slug 獲取工具 - 異步版本
 */
export async function getToolAsync(idOrSlug: string | number): Promise<Tool | null> {
  if (typeof idOrSlug === 'number') {
    return getToolByIdAsync(idOrSlug);
  }
  // 先嘗試解析為數字
  const numId = parseInt(idOrSlug, 10);
  if (!isNaN(numId)) {
    return getToolByIdAsync(numId);
  }
  // 否則當作 slug 處理
  return getToolBySlugAsync(idOrSlug);
}

/**
 * 獲取相關工具 - 異步版本
 */
export async function getRelatedToolsAsync(tool: Tool): Promise<ToolBase[]> {
  if (!tool.relatedToolIds || tool.relatedToolIds.length === 0) {
    return [];
  }
  const dbTools = await prisma.tool.findMany({
    where: { 
      id: { in: tool.relatedToolIds },
      isActive: true,
    },
  });
  return dbTools.map(t => dbToolToTool(t));
}

// ============================================
// 同步版本（向後相容，使用快取）
// 注意：這些函數不會即時反映資料庫變更
// ============================================

let toolsCache: Tool[] | null = null;
let cacheExpiry = 0;
const CACHE_TTL = 60000; // 1 分鐘

async function getToolsCache(): Promise<Tool[]> {
  const now = Date.now();
  if (!toolsCache || now > cacheExpiry) {
    toolsCache = await getAllToolsFullAsync();
    cacheExpiry = now + CACHE_TTL;
  }
  return toolsCache;
}

/**
 * 獲取所有工具（基礎資訊）- 同步版本（使用快取）
 * @deprecated 建議使用 getAllToolsAsync
 */
export function getAllTools(): ToolBase[] {
  // 回傳空陣列，實際資料需透過 API 獲取
  console.warn('getAllTools() is deprecated. Use getAllToolsAsync() or fetch from /api/tools');
  return [];
}

/**
 * 獲取所有完整工具資料 - 同步版本
 * @deprecated 建議使用 getAllToolsFullAsync
 */
export function getAllToolsFull(): Tool[] {
  console.warn('getAllToolsFull() is deprecated. Use getAllToolsFullAsync() or fetch from /api/tools');
  return [];
}

/**
 * 根據 ID 獲取工具 - 同步版本
 * @deprecated 建議使用 getToolByIdAsync
 */
export function getToolById(id: number): Tool | undefined {
  console.warn('getToolById() is deprecated. Use getToolByIdAsync() or fetch from /api/tools');
  return undefined;
}

/**
 * 根據 slug 獲取工具 - 同步版本
 * @deprecated 建議使用 getToolBySlugAsync
 */
export function getToolBySlug(slug: string): Tool | undefined {
  console.warn('getToolBySlug() is deprecated. Use getToolBySlugAsync() or fetch from /api/tools');
  return undefined;
}

/**
 * 根據 ID 或 slug 獲取工具 - 同步版本
 * @deprecated 建議使用 getToolAsync
 */
export function getTool(idOrSlug: string | number): Tool | undefined {
  console.warn('getTool() is deprecated. Use getToolAsync() or fetch from /api/tools');
  return undefined;
}

/**
 * 獲取工具的評論
 */
export function getToolReviews(toolId: number): ToolReview[] {
  return REVIEWS.filter(review => review.toolId === toolId);
}

/**
 * 獲取相關工具
 */
export function getRelatedTools(tool: Tool): ToolBase[] {
  return tool.relatedToolIds
    .map(id => getToolById(id))
    .filter((t): t is Tool => t !== undefined)
    .map(t => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      description: t.description,
      category: t.category,
      pricing: t.pricing,
      rating: t.rating,
      reviewCount: t.reviewCount,
      logo: t.logo,
      tags: t.tags,
      url: t.url,
      features: t.features,
    }));
}

/**
 * 獲取所有分類
 */
export function getCategories(): Category[] {
  return CATEGORIES;
}

/**
 * 獲取分類列表（不含「全部」）
 */
export function getCategoryList(): string[] {
  return CATEGORIES
    .filter(cat => cat.id !== 'all')
    .map(cat => cat.id);
}

/**
 * 篩選工具
 */
export function filterTools(filters: Partial<FilterState>): ToolBase[] {
  const tools = getAllTools();
  
  return tools.filter(tool => {
    // 搜尋篩選
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // 分類篩選
    if (filters.category && filters.category !== 'all') {
      if (tool.category !== filters.category) return false;
    }

    // 定價篩選
    if (filters.pricing && filters.pricing !== 'all') {
      if (tool.pricing !== filters.pricing) return false;
    }

    // 評分篩選
    if (filters.rating && filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      if (!isNaN(minRating) && tool.rating < minRating) return false;
    }

    return true;
  });
}

/**
 * 排序工具
 */
export function sortTools(tools: ToolBase[], sortBy: string): ToolBase[] {
  const sorted = [...tools];
  
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-TW'));
    case 'reviews':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'newest':
      // 未來可根據 createdAt 排序，目前按 ID 降序
      return sorted.sort((a, b) => b.id - a.id);
    default:
      return sorted;
  }
}

/**
 * 獲取篩選後並排序的工具
 */
export function getFilteredAndSortedTools(
  filters: Partial<FilterState>
): ToolBase[] {
  const filtered = filterTools(filters);
  return sortTools(filtered, filters.sortBy || 'rating');
}

/**
 * 獲取工具統計
 */
export function getToolsStats() {
  const tools = getAllTools();
  
  return {
    total: tools.length,
    byCategory: getCategoryList().reduce((acc, category) => {
      acc[category] = tools.filter(t => t.category === category).length;
      return acc;
    }, {} as Record<string, number>),
    byPricing: {
      free: tools.filter(t => t.pricing === 'free').length,
      freemium: tools.filter(t => t.pricing === 'freemium').length,
      paid: tools.filter(t => t.pricing === 'paid').length,
    },
    averageRating: tools.reduce((sum, t) => sum + t.rating, 0) / tools.length,
  };
}

/**
 * 搜尋工具（用於搜尋建議）
 */
export function searchTools(query: string, limit: number = 5): ToolBase[] {
  if (!query.trim()) return [];
  
  const tools = getAllTools();
  const lowerQuery = query.toLowerCase();
  
  // 計算相關性分數
  const scored = tools.map(tool => {
    let score = 0;
    
    // 名稱完全匹配
    if (tool.name.toLowerCase() === lowerQuery) score += 100;
    // 名稱開頭匹配
    else if (tool.name.toLowerCase().startsWith(lowerQuery)) score += 50;
    // 名稱包含
    else if (tool.name.toLowerCase().includes(lowerQuery)) score += 30;
    
    // 標籤匹配
    tool.tags.forEach(tag => {
      if (tag.toLowerCase().includes(lowerQuery)) score += 10;
    });
    
    // 描述匹配
    if (tool.description.toLowerCase().includes(lowerQuery)) score += 5;
    
    return { tool, score };
  });
  
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.tool);
}

/**
 * 獲取熱門工具
 */
export function getPopularTools(limit: number = 6): ToolBase[] {
  const tools = getAllTools();
  return tools
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

/**
 * 獲取高評分工具
 */
export function getTopRatedTools(limit: number = 6): ToolBase[] {
  const tools = getAllTools();
  return tools
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}
