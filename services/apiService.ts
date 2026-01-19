/**
 * API Service Layer
 * S3 정적 웹페이지 호스팅 환경에서 EC2 백엔드와 통신
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_API_KEY || '';

interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

/**
 * 공통 API 요청 핸들러
 */
async function apiRequest<T>(
  endpoint: string,
  config: ApiRequestConfig = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = config;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // API 키가 설정된 경우 헤더에 추가
  if (API_KEY) {
    defaultHeaders['X-API-Key'] = API_KEY;
  }

  const requestConfig: RequestInit = {
    method,
    headers: { ...defaultHeaders, ...headers },
  };

  if (body && method !== 'GET') {
    requestConfig.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestConfig);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API 요청 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API 요청 오류 [${endpoint}]:`, error);
    throw error;
  }
}

// ========================================
// 1. 프로필 관리 API (ProfileForm)
// ========================================

export interface SaveProfileRequest {
  name: string;
  education: string;
  major: string;
  gpa?: string;
  experience?: string[];
  projects: Array<{
    title: string;
    description: string;
    contribution: string;
    period: string;
  }>;
  skills: string[];
  activities?: string[];
  certifications?: Array<{ date: string; title: string }>;
  awards?: Array<{ date: string; title: string }>;
}

export interface SaveProfileResponse {
  success: boolean;
  message: string;
  profileId: string;
}

export interface GetProfileResponse extends SaveProfileRequest {
  profileId: string;
  updatedAt: string;
}

/**
 * 프로필 저장
 */
export async function saveProfile(
  profileData: SaveProfileRequest
): Promise<SaveProfileResponse> {
  return apiRequest<SaveProfileResponse>('/api/profile', {
    method: 'POST',
    body: profileData,
  });
}

/**
 * 프로필 조회
 */
export async function getProfile(
  profileId?: string
): Promise<GetProfileResponse> {
  const endpoint = profileId ? `/api/profile/${profileId}` : '/api/profile';
  return apiRequest<GetProfileResponse>(endpoint);
}

// ========================================
// 2. 직무 및 컬쳐핏 분석 API (FitAnalysis)
// ========================================

export interface AnalyzeFitRequest {
  profile: SaveProfileRequest;
  companyInfo: {
    name: string;
    position: string;
    jd?: string;
    values?: string;
  };
}

export interface AnalyzeFitResponse {
  jobFit: number;
  cultureFit: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

/**
 * 직무 및 컬쳐핏 분석
 */
export async function analyzeFit(
  requestData: AnalyzeFitRequest
): Promise<AnalyzeFitResponse> {
  return apiRequest<AnalyzeFitResponse>('/api/analysis/fit', {
    method: 'POST',
    body: requestData,
  });
}

// ========================================
// 3. 회사 리스트 및 적합도 탐색 API (CompanyList)
// ========================================

export interface SearchJobOpeningsRequest {
  profile: SaveProfileRequest;
  query: string;
}

export interface JobOpening {
  companyName: string;
  position: string;
  recruitType: string;
  jdSummary: string;
  fitScore: number;
}

export interface SearchJobOpeningsResponse {
  results: JobOpening[];
  totalCount: number;
}

/**
 * 직무 공고 검색 및 추천
 */
export async function searchJobOpenings(
  requestData: SearchJobOpeningsRequest
): Promise<SearchJobOpeningsResponse> {
  return apiRequest<SearchJobOpeningsResponse>('/api/jobs/search', {
    method: 'POST',
    body: requestData,
  });
}

// ========================================
// 4. AI 커리어 에이전트 API (ResumeBuilder)
// ========================================

export interface GenerateResumeRequest {
  profile: SaveProfileRequest;
  companyInfo: {
    name: string;
    position: string;
    jd: string;
  };
  prompt: string;
  selectedProjects?: string[];
}

export interface GenerateResumeResponse {
  content: string;
  generatedAt: string;
}

/**
 * AI 자소서 생성
 */
export async function generateResumeContent(
  requestData: GenerateResumeRequest
): Promise<GenerateResumeResponse> {
  return apiRequest<GenerateResumeResponse>('/api/resume/generate', {
    method: 'POST',
    body: requestData,
  });
}

// ========================================
// 5. 지원 트래커 API (Tracker & Dashboard)
// ========================================

export interface Application {
  id?: string;
  companyName: string;
  position: string;
  status: string;
  recruitType?: string;
  date: string;
  link?: string;
}

export interface CreateApplicationRequest extends Omit<Application, 'id'> {}

export interface ApplicationResponse extends Application {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetApplicationsResponse {
  applications: ApplicationResponse[];
  totalCount: number;
}

/**
 * 지원 내역 목록 조회
 */
export async function getApplications(): Promise<GetApplicationsResponse> {
  return apiRequest<GetApplicationsResponse>('/api/applications');
}

/**
 * 지원 내역 생성
 */
export async function createApplication(
  data: CreateApplicationRequest
): Promise<ApplicationResponse> {
  return apiRequest<ApplicationResponse>('/api/applications', {
    method: 'POST',
    body: data,
  });
}

/**
 * 지원 내역 수정
 */
export async function updateApplication(
  applicationId: string,
  data: Partial<Application>
): Promise<ApplicationResponse> {
  return apiRequest<ApplicationResponse>(`/api/applications/${applicationId}`, {
    method: 'PUT',
    body: data,
  });
}

/**
 * 지원 내역 삭제
 */
export async function deleteApplication(
  applicationId: string
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/api/applications/${applicationId}`, {
    method: 'DELETE',
  });
}

// ========================================
// 6. 대시보드 통계 API (Dashboard)
// ========================================

export interface DashboardStatsResponse {
  totalApplications: number;
  passedDocument: number;
  inProgress: number;
  acceptanceRate: number;
  statusDistribution: {
    planning: number;
    submitted: number;
    passDocument: number;
    interviewing: number;
    accepted: number;
    rejected: number;
  };
}

/**
 * 대시보드 통계 조회
 */
export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  return apiRequest<DashboardStatsResponse>('/api/dashboard/stats');
}
