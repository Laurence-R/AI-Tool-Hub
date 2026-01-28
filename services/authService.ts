/**
 * Auth Service
 * 認證相關的 API 服務
 */

import { api } from './api';

// 使用者類型
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

// 登入請求類型
interface LoginRequest {
  email: string;
  password: string;
}

// 註冊請求類型
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// 認證響應類型
interface AuthResponse {
  user: User;
  token: string;
}

/**
 * 認證服務
 */
export const authService = {
  /**
   * 登入
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * 註冊
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/register', data);
  },

  /**
   * 登出
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  /**
   * 獲取當前使用者
   */
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  /**
   * 重設密碼請求
   */
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/password/reset', { email });
  },

  /**
   * 重設密碼
   */
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/password/reset/confirm', {
      token,
      newPassword,
    });
  },

  /**
   * OAuth 登入 URL
   */
  getOAuthUrl: (provider: 'google' | 'github'): string => {
    return `${process.env.NEXT_PUBLIC_API_URL || ''}/auth/${provider}`;
  },
};
