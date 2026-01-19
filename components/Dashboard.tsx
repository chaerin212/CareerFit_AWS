
import React, { useEffect, useState } from 'react';
import { Application, ApplicationStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowUpRight, CheckCircle2, Clock, Send, Briefcase, Calendar, MoreHorizontal, AlertCircle, BarChart3 as BarChartIcon } from 'lucide-react';
import { getDashboardStats } from '../services/apiService';

interface DashboardProps {
  applications: Application[];
}

const Dashboard: React.FC<DashboardProps> = ({ applications }) => {
  const [backendStats, setBackendStats] = useState<any>(null);

  // 백엔드에서 통계 데이터 가져오기 (선택적)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getDashboardStats();
        setBackendStats(stats);
        console.log('백엔드 통계:', stats);
      } catch (error) {
        console.log('백엔드 통계 없음, 로컬 계산 사용');
      }
    };
    fetchStats();
  }, [applications]);

  const getDDay = (targetDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = [
    { label: '전체 지원', value: applications.length, icon: Send, color: 'text-blue-500' },
    { label: '서류 합격', value: applications.filter(a => a.status === ApplicationStatus.PASS_DOCUMENT).length, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: '진행 중', value: applications.filter(a => [ApplicationStatus.SUBMITTED, ApplicationStatus.INTERVIEWING].includes(a.status)).length, icon: Clock, color: 'text-amber-500' },
    { label: '합격률', value: applications.length ? `${Math.round((applications.filter(a => a.status === ApplicationStatus.ACCEPTED).length / applications.length) * 100)}%` : '0%', icon: ArrowUpRight, color: 'text-indigo-500' },
  ];

  const chartData = [
    { name: '지원예정', value: applications.filter(a => a.status === ApplicationStatus.PLANNING).length },
    { name: '제출완료', value: applications.filter(a => a.status === ApplicationStatus.SUBMITTED).length },
    { name: '서류합격', value: applications.filter(a => a.status === ApplicationStatus.PASS_DOCUMENT).length },
    { name: '면접진행', value: applications.filter(a => a.status === ApplicationStatus.INTERVIEWING).length },
    { name: '최종합격', value: applications.filter(a => a.status === ApplicationStatus.ACCEPTED).length },
    { name: '불합격', value: applications.filter(a => a.status === ApplicationStatus.REJECTED).length },
  ];

  const COLORS = ['#3f3f46', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
  const sortedApplications = [...applications].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusBadgeStyle = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.INTERVIEWING: return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case ApplicationStatus.SUBMITTED: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case ApplicationStatus.PLANNING: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
      case ApplicationStatus.ACCEPTED: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case ApplicationStatus.REJECTED: return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header>
        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">대시보드</h2>
        <p className="text-zinc-500 font-medium">취업 파이프라인의 실시간 현황을 확인하세요.</p>
      </header>

      {/* 1. Pipeline Table (TOP) - Initials Removed */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white px-2 flex items-center gap-2">
          내 지원 파이프라인 <ArrowUpRight size={20} className="text-zinc-600" />
        </h3>
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2rem] overflow-hidden backdrop-blur-sm shadow-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50">
                <th className="px-8 py-5">회사명</th>
                <th className="px-6 py-5">포지션</th>
                <th className="px-6 py-5">상태</th>
                <th className="px-6 py-5">지원일</th>
                <th className="px-8 py-5 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {sortedApplications.length > 0 ? (
                sortedApplications.map((app) => {
                  const dDay = getDDay(app.date);
                  const isUrgent = app.status === ApplicationStatus.PLANNING && dDay >= 0 && dDay <= 5;
                  
                  return (
                    <tr key={app.id} className="group hover:bg-zinc-900/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-base font-bold text-zinc-100">{app.companyName}</span>
                          {isUrgent && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-amber-500 animate-pulse">
                              <AlertCircle size={10} /> D-{dDay === 0 ? 'Day' : dDay} 마감임박
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Briefcase size={14} className="opacity-50" />
                          <span className="text-sm font-medium">{app.position}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${getStatusBadgeStyle(app.status)}`}>
                          {app.status === ApplicationStatus.SUBMITTED ? '지원완료' : app.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                          <Calendar size={14} className="opacity-40" />
                          {app.date}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Clock size={48} className="text-zinc-800" />
                      <p className="text-zinc-500 font-medium">지원 파이프라인이 비어 있습니다.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800/50 p-6 rounded-3xl hover:border-zinc-700 transition-all group shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition-colors`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-4xl font-black text-white mt-2">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* 3. Distribution Chart */}
      <div className="bg-zinc-900 border border-zinc-800/50 p-8 rounded-[2rem] shadow-sm">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
          <BarChartIcon size={20} className="text-blue-500" /> 진행 상태별 분포
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#52525b" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#52525b" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#18181b', opacity: 0.4 }}
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
