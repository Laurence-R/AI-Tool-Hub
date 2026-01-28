/**
 * Tools Data Utilities
 * 工具資料載入與處理函數
 */

import type { Tool, ToolBase, ToolReview, FilterState } from '@/types';

// 導入 JSON 資料
import toolsData from '@/data/tools/tools.json';
import reviewsData from '@/data/tools/reviews.json';
import categoriesData from '@/data/tools/categories.json';

// 型別轉換
const TOOLS: Tool[] = toolsData as Tool[];
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
 * 獲取所有工具（基礎資訊）
 */
export function getAllTools(): ToolBase[] {
  return TOOLS.map(tool => ({
    id: tool.id,
    slug: tool.slug,
    name: tool.name,
    description: tool.description,
    category: tool.category,
    pricing: tool.pricing,
    rating: tool.rating,
    reviewCount: tool.reviewCount,
    logo: tool.logo,
    tags: tool.tags,
    url: tool.url,
    features: tool.features,
  }));
}

/**
 * 獲取所有完整工具資料
 */
export function getAllToolsFull(): Tool[] {
  return TOOLS;
}

/**
 * 根據 ID 獲取工具
 */
export function getToolById(id: number): Tool | undefined {
  return TOOLS.find(tool => tool.id === id);
}

/**
 * 根據 slug 獲取工具
 */
export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find(tool => tool.slug === slug);
}

/**
 * 根據 ID 或 slug 獲取工具
 */
export function getTool(idOrSlug: string | number): Tool | undefined {
  if (typeof idOrSlug === 'number') {
    return getToolById(idOrSlug);
  }
  // 先嘗試解析為數字
  const numId = parseInt(idOrSlug, 10);
  if (!isNaN(numId)) {
    return getToolById(numId);
  }
  // 否則當作 slug 處理
  return getToolBySlug(idOrSlug);
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
