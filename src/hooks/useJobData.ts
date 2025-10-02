import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import type {
  Job,
  Project,
  HierarchyItem,
  TimeseriesMetadata,
  TimeseriesDataResponse,
} from '../services/api'

export function useProject(projectId: number) {
  return useQuery<Project>({
    queryKey: ['project', projectId],
    queryFn: () => api.getProject(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProjectJobs(projectId: number) {
  return useQuery<Job[]>({
    queryKey: ['projectJobs', projectId],
    queryFn: () => api.getProjectJobs(projectId),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds to check for new jobs
  })
}

export function useProjectHierarchy(projectId: number) {
  return useQuery<HierarchyItem[]>({
    queryKey: ['projectHierarchy', projectId],
    queryFn: () => api.getProjectHierarchy(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Timeseries hooks
export function useTimeseriesMetadata(jobId: number, enabled = true) {
  return useQuery<TimeseriesMetadata>({
    queryKey: ['timeseriesMetadata', jobId],
    queryFn: () => api.getTimeseriesMetadata(jobId),
    staleTime: 5 * 60 * 1000, // Metadata doesn't change often
    enabled,
  })
}

export function useTimeseriesData(
  jobId: number,
  channels: string[],
  startTimestamp?: number,
  endTimestamp?: number,
  enabled = true
) {
  return useQuery<TimeseriesDataResponse>({
    queryKey: ['timeseriesData', jobId, channels, startTimestamp, endTimestamp],
    queryFn: () => api.getTimeseriesData(jobId, channels, startTimestamp, endTimestamp),
    refetchInterval: enabled ? 2000 : false, // Poll every 2 seconds when enabled
    enabled: enabled && channels.length > 0,
  })
}
