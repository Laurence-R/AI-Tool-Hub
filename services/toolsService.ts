/**
 * Tools Service
 * 工具相關的 API 服務
 */

import { api } from './api';
import type { Tool, FilterState } from '@/types';

// 工具列表響應類型
interface ToolsListResponse {
  tools: Tool[];
  total: number;
  page: number;
  pageSize: number;
}

// 工具詳情響應類型
interface ToolDetailResponse {
  tool: Tool;
  relatedTools: Tool[];
}

/**
 * 工具服務
 */
export const toolsService = {
  /**
   * 獲取所有工具
   */
  getAll: async (filters?: Partial<FilterState>): Promise<ToolsListResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.searchQuery) {
      params.append('search', filters.searchQuery);
    }
    if (filters?.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters?.pricing && filters.pricing !== 'all') {
      params.append('pricing', filters.pricing);
    }
    if (filters?.sortBy) {
      params.append('sortBy', filters.sortBy);
    }

    const queryString = params.toString();
    const endpoint = `/tools${queryString ? `?${queryString}` : ''}`;
    
    return api.get<ToolsListResponse>(endpoint);
  },

  /**
   * 獲取單一工具詳情
   */
  getById: async (id: string): Promise<ToolDetailResponse> => {
    return api.get<ToolDetailResponse>(`/tools/${id}`);
  },

  /**
   * 獲取熱門工具
   */
  getPopular: async (limit: number = 6): Promise<Tool[]> => {
    return api.get<Tool[]>(`/tools/popular?limit=${limit}`);
  },

  /**
   * 獲取推薦工具
   */
  getRecommended: async (toolId: string, limit: number = 4): Promise<Tool[]> => {
    return api.get<Tool[]>(`/tools/${toolId}/recommended?limit=${limit}`);
  },

  /**
   * 搜尋工具
   */
  search: async (query: string): Promise<Tool[]> => {
    return api.get<Tool[]>(`/tools/search?q=${encodeURIComponent(query)}`);
  },

  /**
   * 獲取工具分類統計
   */
  getCategoryStats: async (): Promise<Record<string, number>> => {
    return api.get<Record<string, number>>('/tools/categories/stats');
  },
};
