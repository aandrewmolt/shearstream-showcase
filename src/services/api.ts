// Use Vercel proxy for CORS-free API access
const USE_PROXY = import.meta.env.PROD || import.meta.env.VITE_USE_PROXY === 'true'
const API_BASE_URL = 'https://production.api.shearstreaming.com/api/v1'
const PROXY_BASE_URL = '/api/proxy'

// Authentication storage
let authToken: string | null = null

export interface Project {
  id: number
  padId: number
  name: string
  createdAt: string
  updatedAt: string
  updatedBy: string
  active: boolean
  timezone: string
  unitSystem: 'IMPERIAL' | 'METRIC'
  share: boolean
}

export interface Job {
  id: number
  projectId: number
  job: {
    consumer: Array<{
      adc?: Array<{
        in: string
        out: string
        channel: number
        serialNumber: string
        '4mA': number
        '20mA': number
      }>
      device: {
        baudrate: number
        port_name: string
        serverPort?: number
        serverAddress?: string
      }
      transform: {
        headers: string[]
        encoding: string
        delimiters: string[]
      }
      description: string
      pressureUnits: string
    }>
    publisher: {
      name: string
      stage: string
      wellName: string
      environment: string
      emptyTimeseriesStrategy: string
    }
    description: string
  }
  createdAt: string
  updatedAt: string
  updatedBy: string
  state: 'RUNNING' | 'COMPLETED' | 'PAUSED' | 'STOPPED'
  jobType: string
  share: boolean
}

export interface HierarchyItem {
  title: string
  to: {
    name: string
    params?: Record<string, number>
  }
  assetType: string
}

export interface TimeseriesChannel {
  name: string
  unit: string
  type: string
  yAxis: string
}

export interface TimeseriesMetadata {
  jobId: number
  channels: TimeseriesChannel[]
}

export interface TimeseriesDataPoint {
  timestamp: number
  [channelName: string]: number
}

export interface TimeseriesDataResponse {
  jobId: number
  data: TimeseriesDataPoint[]
}

export interface ApiResponse<T> {
  [key: string]: T
}

class ShearStreamAPI {
  private async fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    }

    // Determine URL based on proxy configuration
    let url: string
    if (USE_PROXY) {
      // Use proxy endpoint - strip leading slash from endpoint
      const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
      url = `${PROXY_BASE_URL}?path=${encodeURIComponent(path)}`
    } else {
      // Direct API call with auth token
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }
      url = `${API_BASE_URL}${endpoint}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: USE_PROXY ? 'omit' : 'include', // Proxy handles auth, no need for cookies
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please check your credentials.')
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Authentication
  setAuthToken(token: string) {
    authToken = token
  }

  clearAuthToken() {
    authToken = null
  }

  // Project endpoints
  async getProject(projectId: number): Promise<Project> {
    const data = await this.fetchJSON<ApiResponse<Project>>(`/project/${projectId}`)
    return data.project
  }

  async getProjectJobs(projectId: number): Promise<Job[]> {
    const data = await this.fetchJSON<ApiResponse<Job[]>>(`/job/${projectId}/project`)
    return data.jobs || []
  }

  async getProjectHierarchy(projectId: number): Promise<HierarchyItem[]> {
    const data = await this.fetchJSON<ApiResponse<HierarchyItem[]>>(`/hierarchy/${projectId}/PROJECT`)
    return data.hierarchies || []
  }

  // Timeseries endpoints (corrected to match API_RESPONSES.md)
  async getTimeseriesMetadata(jobId: number): Promise<TimeseriesMetadata> {
    const data = await this.fetchJSON<TimeseriesMetadata>(`/timeseries/${jobId}/metadata`)
    return data
  }

  async getTimeseriesData(
    jobId: number,
    channels: string[],
    startTimestamp?: number,
    endTimestamp?: number,
    disableAggregation = false
  ): Promise<TimeseriesDataResponse> {
    const params = new URLSearchParams()

    // Add channel parameters (c[]=channel1&c[]=channel2)
    channels.forEach((channel) => {
      params.append('c[]', channel)
    })

    // Add timestamp parameter
    params.append('c[]', 'timestamp')

    // Add time range if provided
    if (startTimestamp) {
      params.append('startTimestamp', startTimestamp.toString())
    }
    if (endTimestamp) {
      params.append('endTimestamp', endTimestamp.toString())
    }

    params.append('disableAggregation', disableAggregation.toString())

    const endpoint = `/timeseries/${jobId}/data?${params.toString()}`
    const data = await this.fetchJSON<TimeseriesDataResponse>(endpoint)
    return data
  }
}

export const api = new ShearStreamAPI()
