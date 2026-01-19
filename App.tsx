
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Tracker from './components/Tracker';
import ResumeBuilder from './components/ResumeBuilder';
import CompanyList from './components/CompanyList';
import ProfileForm from './components/ProfileForm';
import { UserProfile, Application, ApplicationStatus } from './types';

const INITIAL_PROFILE: UserProfile = {
  name: '홍길동',
  education: '커리어대학교',
  major: '소프트웨어학과',
  gpa: '4.2/4.5',
  experience: ['A사 인턴 (3개월)'],
  projects: [
    { title: '인컴상 수업 프젝', period: '2025.07.31 - 2025.07.31', contribution: '100%', description: '인터랙티브 컴퓨터 그래픽스 수업 프로젝트' },
    { title: '시계열 데이터 분석 프젝', period: '2025.06.04 - 2025.06.21', contribution: '80%', description: '딥러닝 기반 주가 예측 및 시나리오 분석' },
    { title: '한양대 커뮤니티 프젝', period: '2025.08.07 - 2025.08.15', contribution: '50%', description: '대학생 전용 익명 게시판 및 매칭 서비스' }
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
  activities: ['전국 대학생 코딩 경진대회 은상 수상'],
  certifications: [
    { date: '2024.05', title: '노션 전문가 (Notion Expert)' },
    { date: '2023.11', title: '구글 워크스페이스 (Google Workspace Expert)' },
    { date: '2021.06', title: '디지털 마케팅 전문가 (Google)' }
  ],
  awards: [
    { date: '2024.08', title: '교내 해커톤 최우수상' }
  ]
};

const SAMPLE_APPS: Application[] = [
  { id: '1', companyName: 'AWS코리아', position: '백엔드 엔지니어', status: ApplicationStatus.PLANNING, recruitType: '체험형인턴', date: '2026-01-30', link: 'https://aws.amazon.com/ko' },
  { id: '2', companyName: 'OpenAI', position: 'Backend Engineer', status: ApplicationStatus.SUBMITTED, recruitType: '채용형인턴', date: '2026-01-18', link: 'https://openai.com' },
  { id: '3', companyName: '현대', position: '기획,PM업무', status: ApplicationStatus.ACCEPTED, recruitType: '계약직', date: '2026-01-18', link: '' },
  { id: '4', companyName: '삼성', position: '데이터 엔지니어', status: ApplicationStatus.REJECTED, recruitType: '일반채용', date: '2026-01-13', link: 'https://samsung.com' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('careerfit_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_PROFILE,
        ...parsed,
        certifications: parsed.certifications || INITIAL_PROFILE.certifications,
        awards: parsed.awards || INITIAL_PROFILE.awards
      };
    }
    return INITIAL_PROFILE;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('careerfit_apps');
    return saved ? JSON.parse(saved) : SAMPLE_APPS;
  });

  useEffect(() => {
    localStorage.setItem('careerfit_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('careerfit_apps', JSON.stringify(applications));
  }, [applications]);

  const addApplication = (app: Application) => {
    setApplications([app, ...applications]);
  };

  const updateApplication = (updatedApp: Application) => {
    setApplications(applications.map(app => app.id === updatedApp.id ? updatedApp : app));
  };

  const deleteApplication = (id: string) => {
    if (confirm('지원 내역을 삭제하시겠습니까?')) {
      setApplications(applications.filter(app => app.id !== id));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard applications={applications} />;
      case 'tracker': return (
        <Tracker 
          applications={applications} 
          onAdd={addApplication} 
          onUpdate={updateApplication} 
          onDelete={deleteApplication} 
        />
      );
      case 'resume': return <ResumeBuilder profile={profile} applications={applications} />;
      case 'company-list': return <CompanyList profile={profile} applications={applications} onSave={addApplication} />;
      case 'profile': return <ProfileForm profile={profile} onSave={setProfile} />;
      default: return <Dashboard applications={applications} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
