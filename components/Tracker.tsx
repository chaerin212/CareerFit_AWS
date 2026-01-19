
import React, { useState } from 'react';
import { Application, ApplicationStatus, RecruitType } from '../types';
import { Plus, Trash2, Calendar, Search, Mail, ExternalLink, ChevronDown, Filter, ListFilter, ArrowUpDown, Maximize2, Settings2 } from 'lucide-react';

interface TrackerProps {
  applications: Application[];
  onAdd: (app: Application) => void;
  onUpdate: (app: Application) => void;
  onDelete: (id: string) => void;
}

const Tracker: React.FC<TrackerProps> = ({ applications, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Application>>({
    companyName: '',
    position: '',
    date: new Date().toISOString().split('T')[0],
    status: ApplicationStatus.PLANNING,
    recruitType: '일반채용',
    link: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.companyName && formData.position) {
      onAdd({
        ...formData as Application,
        id: Math.random().toString(36).substr(2, 9),
      });
      setIsModalOpen(false);
      setFormData({ 
        companyName: '', 
        position: '', 
        date: new Date().toISOString().split('T')[0], 
        status: ApplicationStatus.PLANNING,
        recruitType: '일반채용',
        link: ''
      });
    }
  };

  const statusGroups = [
    { 
      id: 'planning',
      title: '채용 일정', 
      icon: Calendar, 
      statuses: [ApplicationStatus.PLANNING],
      dateLabel: '마감일'
    },
    { 
      id: 'active',
      title: '진행 중', 
      icon: Search, 
      statuses: [ApplicationStatus.SUBMITTED, ApplicationStatus.PASS_DOCUMENT, ApplicationStatus.INTERVIEWING],
      dateLabel: '지원일'
    },
    { 
      id: 'results',
      title: '지원 결과', 
      icon: Mail, 
      statuses: [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED],
      dateLabel: '지원일'
    }
  ];

  const getStatusBadgeColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PLANNING: return 'bg-zinc-800 text-zinc-300';
      case ApplicationStatus.SUBMITTED: return 'bg-blue-600 text-white';
      case ApplicationStatus.PASS_DOCUMENT: return 'bg-emerald-600 text-white';
      case ApplicationStatus.INTERVIEWING: return 'bg-amber-600 text-white';
      case ApplicationStatus.ACCEPTED: return 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30';
      case ApplicationStatus.REJECTED: return 'bg-red-900/40 text-red-400 border border-red-500/30';
      default: return 'bg-zinc-800 text-zinc-300';
    }
  };

  const getRecruitTypeBadgeColor = (type?: RecruitType) => {
    switch (type) {
      case '체험형인턴': return 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20';
      case '채용형인턴': return 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20';
      case '계약직': return 'text-purple-400 bg-purple-400/10 border border-purple-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border border-blue-400/20';
    }
  };

  const TrackerSection = ({ group }: { group: typeof statusGroups[0] }) => {
    const groupApps = applications.filter(app => group.statuses.includes(app.status));

    return (
      <div className="space-y-4">
        <header className="flex items-center gap-2 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
          <group.icon size={20} className="text-zinc-400" />
          <h3 className="font-bold text-zinc-100">{group.title}</h3>
        </header>

        <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-2 border-b border-zinc-800/50 bg-zinc-950">
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-900 rounded-lg transition-colors">
                <ListFilter size={14} /> {group.title === '지원 결과' ? '결과' : group.title === '채용 일정' ? '지원 전' : '진행 중'}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-900 rounded-lg transition-colors">
                <Calendar size={14} /> 달력
              </button>
            </div>
            <div className="flex gap-1">
              <button className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-md"><ArrowUpDown size={14} /></button>
              <button className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-md"><Search size={14} /></button>
              <button className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-md"><Maximize2 size={14} /></button>
              <button className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-md"><Settings2 size={14} /></button>
              <button 
                onClick={() => {
                  setFormData({...formData, status: group.statuses[0]});
                  setIsModalOpen(true);
                }}
                className="ml-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                새로 만들기 <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="text-zinc-500 border-b border-zinc-800/50">
              <tr>
                <th className="px-4 py-3 font-medium w-32 flex items-center gap-1.5">진행 상태</th>
                <th className="px-4 py-3 font-medium w-48">기업명</th>
                <th className="px-4 py-3 font-medium w-48">직무</th>
                <th className="px-4 py-3 font-medium w-32">모집 유형</th>
                <th className="px-4 py-3 font-medium w-32">{group.dateLabel}</th>
                <th className="px-4 py-3 font-medium">지원 페이지</th>
                <th className="px-4 py-3 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {groupApps.map((app) => (
                <tr key={app.id} className="group hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-md font-bold text-[10px] whitespace-nowrap ${getStatusBadgeColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-zinc-100">{app.companyName}</td>
                  <td className="px-4 py-3 text-zinc-300">{app.position}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md font-medium text-[10px] ${getRecruitTypeBadgeColor(app.recruitType)}`}>
                      {app.recruitType || '일반채용'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{app.date}</td>
                  <td className="px-4 py-3">
                    {app.link ? (
                      <a href={app.link} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-400 truncate max-w-[200px] block underline decoration-zinc-800 underline-offset-4">
                        {app.link}
                      </a>
                    ) : (
                      <span className="text-zinc-700">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => onDelete(app.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={7} className="px-4 py-2 hover:bg-zinc-900/50 cursor-pointer group">
                  <button 
                    onClick={() => {
                      setFormData({...formData, status: group.statuses[0]});
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-zinc-500 group-hover:text-zinc-300 transition-colors"
                  >
                    <Plus size={14} /> 새 페이지
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          {group.title === '지원 결과' && groupApps.length > 0 && (
             <div className="px-4 py-2 border-t border-zinc-800/50 text-zinc-600 text-[10px]">
               개수 {groupApps.length}
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      {statusGroups.map((group) => (
        <TrackerSection key={group.id} group={group} />
      ))}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">상세 지원 정보</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><Plus className="rotate-45" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">기업명</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">직무</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">모집 유형</label>
                  <select
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
                    value={formData.recruitType}
                    onChange={(e) => setFormData({...formData, recruitType: e.target.value as RecruitType})}
                  >
                    <option value="일반채용">일반채용</option>
                    <option value="체험형인턴">체험형인턴</option>
                    <option value="채용형인턴">채용형인턴</option>
                    <option value="계약직">계약직</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">날짜</label>
                  <input
                    type="date"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">진행 상태</label>
                  <select
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as ApplicationStatus})}
                  >
                    {Object.values(ApplicationStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">지원 페이지 (URL)</label>
                  <input
                    type="url"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
                    value={formData.link}
                    placeholder="https://..."
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-xl shadow-blue-900/20"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracker;
