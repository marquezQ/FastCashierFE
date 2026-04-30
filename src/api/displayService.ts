import axios from 'axios';
import { api } from './axiosConfig';
import type {
  DisplayConfig,
  CreateDisplayConfigDto,
  UpdateDisplayConfigDto,
  DisplayData,
} from '@/types/display';

// ============================================
// Instancia pública (sin auth interceptor)
// Para el endpoint de TV que no requiere token
// ============================================
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const publicApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const displayService = {
  // ========================================
  // Admin endpoints (requieren auth)
  // ========================================
  getConfigs: async () => {
    const { data } = await api.get<DisplayConfig[]>('/display-configs');
    return data;
  },

  createConfig: async (dto: CreateDisplayConfigDto) => {
    const { data } = await api.post<DisplayConfig>('/display-configs', dto);
    return data;
  },

  updateConfig: async (id: number, dto: UpdateDisplayConfigDto) => {
    const { data } = await api.patch<DisplayConfig>(`/display-configs/${id}`, dto);
    return data;
  },

  deleteConfig: async (id: number) => {
    await api.delete(`/display-configs/${id}`);
  },

  // ========================================
  // Endpoint público (SIN auth — para TVs)
  // ========================================
  getDisplayData: async (token: string) => {
    const { data } = await publicApi.get<DisplayData>(`/display/${token}`);
    return data;
  },
};
