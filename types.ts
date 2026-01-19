
export enum ApplicationStatus {
  PLANNING = '지원 전',
  SUBMITTED = '서류제출',
  PASS_DOCUMENT = '서류합격',
  INTERVIEWING = '면접진행',
  ACCEPTED = '최종합격',
  REJECTED = '서류탈락'
}

export type RecruitType = '체험형인턴' | '채용형인턴' | '계약직' | '일반채용';

export interface UserProfile {
  name: string;
  education: string;
  major: string;
  gpa: string;
  experience: string[];
  projects: {
    title: string;
    description: string;
    contribution: string;
    period: string;
  }[];
  skills: string[];
  activities: string[];
  certifications: {
    date: string;
    title: string;
  }[];
  awards: {
    date: string;
    title: string;
  }[];
}

export interface Application {
  id: string;
  companyName: string;
  position: string;
  date: string;
  status: ApplicationStatus;
  recruitType?: RecruitType;
  link?: string;
  resumeVersion?: string;
}

export interface FitAnalysisResult {
  jobFit: number;
  cultureFit: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
}
