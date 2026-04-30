import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { displayService } from '@/api/displayService';
import type { CreateDisplayConfigDto, UpdateDisplayConfigDto } from '@/types/display';

export const displayKeys = {
  all: ['display-configs'] as const,
  displayData: (token: string) => ['display-data', token] as const,
};

// ============================================
// ADMIN HOOKS
// ============================================

export const useDisplayConfigs = () => {
  return useQuery({
    queryKey: displayKeys.all,
    queryFn: displayService.getConfigs,
  });
};

export const useCreateDisplayConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDisplayConfigDto) => displayService.createConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: displayKeys.all });
    },
  });
};

export const useUpdateDisplayConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDisplayConfigDto }) =>
      displayService.updateConfig(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: displayKeys.all });
    },
  });
};

export const useDeleteDisplayConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => displayService.deleteConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: displayKeys.all });
    },
  });
};

// ============================================
// PUBLIC TV HOOK
// ============================================

export const useDisplayData = (token: string) => {
  return useQuery({
    queryKey: displayKeys.displayData(token),
    queryFn: () => displayService.getDisplayData(token),
    refetchInterval: 300000, // Refetch every 5 minutes to keep data fresh without websocket
    retry: 3,
    enabled: !!token,
  });
};
