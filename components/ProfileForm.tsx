
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Save, Plus, X, GraduationCap, Briefcase, Code, Award, ShieldCheck, Trash2, Calendar } from 'lucide-react';
import { saveProfile } from '../services/apiService';

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSave }) => {
  const [data, setData] = useState<UserProfile>(profile);
  const [newSkill, setNewSkill] = useState('');

  const handleSave = async () => {
    try {
      // 백엔드 API 호출
      await saveProfile(data);
      onSave(data);
      alert('프로필이 성공적으로 저장되었습니다!');
    } catch (error) {
      console.error('프로필 저장 오류:', error);
      // 로컬 저장은 계속 진행
      onSave(data);
      alert('프로필이 로컬에 저장되었습니다. (백엔드 연결 확인 필요)');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      setData({ ...data, skills: [...data.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setData({ ...data, skills: data.skills.filter(s => s !== skill) });
  };

  // Projects Management
  const addProject = () => {
    setData({
      ...data,
      projects: [...data.projects, { title: '', description: '', contribution: '', period: '' }]
    });
  };

  const updateProject = (idx: number, field: string, value: string) => {
    const updated = [...data.projects];
    updated[idx] = { ...updated[idx], [field]: value };
    setData({ ...data, projects: updated });
  };

  const removeProject = (idx: number) => {
    setData({ ...data, projects: data.projects.filter((_, i) => i !== idx) });
  };

  // Certifications Management
  const addCertification = () => {
    setData({
      ...data,
      certifications: [...(data.certifications || []), { date: '', title: '' }]
    });
  };

  const updateCertification = (idx: number, field: 'date' | 'title', value: string) => {
    const updated = [...(data.certifications || [])];
    updated[idx] = { ...updated[idx], [field]: value };
    setData({ ...data, certifications: updated });
  };

  const removeCertification = (idx: number) => {
    setData({
      ...data,
      certifications: data.certifications.filter((_, i) => i !== idx)
    });
  };

  // Awards Management
  const addAward = () => {
    setData({
      ...data,
      awards: [...(data.awards || []), { date: '', title: '' }]
    });
  };

  const updateAward = (idx: number, field: 'date' | 'title', value: string) => {
    const updated = [...(data.awards || [])];
    updated[idx] = { ...updated[idx], [field]: value };
    setData({ ...data, awards: updated });
  };

  const removeAward = (idx: number) => {
    setData({
      ...data,
      awards: data.awards.filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">내 프로필 관리</h2>
          <p className="text-zinc-400">당신의 경험을 상세히 입력할수록 AI가 더 정교하게 분석합니다.</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
        >
          <Save size={18} /> 저장하기
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Info */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-4">
            <GraduationCap className="text-blue-500" size={20} /> 기본 정보 및 학력
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-2">이름</label>
              <input
                type="text"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">학교</label>
              <input
                type="text"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                value={data.education}
                onChange={(e) => setData({ ...data, education: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">전공</label>
              <input
                type="text"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                value={data.major}
                onChange={(e) => setData({ ...data, major: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-4">
            <Code className="text-blue-500" size={20} /> 기술 스택
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="기술 스택 입력 (예: React, TypeScript)"
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-blue-500"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            />
            <button
              onClick={addSkill}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 rounded-xl transition-colors"
            >
              추가
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills.map(skill => (
              <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-white"><X size={14} /></button>
              </span>
            ))}
          </div>
        </section>

        {/* Certifications (New Section) */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={20} /> 자격증 (Certifications)
            </h3>
            <button onClick={addCertification} className="text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 uppercase tracking-tighter transition-colors">
              <Plus size={14} /> 자격증 추가
            </button>
          </div>
          <div className="space-y-3">
            {data.certifications?.map((cert, idx) => (
              <div key={idx} className="flex gap-2 group animate-in slide-in-from-right-2 duration-300">
                <input
                  type="text"
                  placeholder="2024.05"
                  className="w-24 bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-emerald-500 transition-colors"
                  value={cert.date}
                  onChange={(e) => updateCertification(idx, 'date', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="자격증 명칭 입력"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-emerald-500 transition-colors"
                  value={cert.title}
                  onChange={(e) => updateCertification(idx, 'title', e.target.value)}
                />
                <button onClick={() => removeCertification(idx)} className="p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {(!data.certifications || data.certifications.length === 0) && (
              <p className="text-center text-xs text-zinc-600 py-4 italic">자격증 정보가 없습니다.</p>
            )}
          </div>
        </section>

        {/* Awards (New Section) */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Award className="text-amber-500" size={20} /> 수상 경력 (Awards)
            </h3>
            <button onClick={addAward} className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 uppercase tracking-tighter transition-colors">
              <Plus size={14} /> 수상 추가
            </button>
          </div>
          <div className="space-y-3">
            {data.awards?.map((award, idx) => (
              <div key={idx} className="flex gap-2 group animate-in slide-in-from-right-2 duration-300">
                <input
                  type="text"
                  placeholder="2024.08"
                  className="w-24 bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500 transition-colors"
                  value={award.date}
                  onChange={(e) => updateAward(idx, 'date', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="수상 명칭 및 기관"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500 transition-colors"
                  value={award.title}
                  onChange={(e) => updateAward(idx, 'title', e.target.value)}
                />
                <button onClick={() => removeAward(idx)} className="p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {(!data.awards || data.awards.length === 0) && (
              <p className="text-center text-xs text-zinc-600 py-4 italic">수상 경력 정보가 없습니다.</p>
            )}
          </div>
        </section>

        {/* Projects */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Briefcase className="text-blue-500" size={20} /> 프로젝트 경험
            </h3>
            <button onClick={addProject} className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 uppercase tracking-tighter">
              <Plus size={14} /> 프로젝트 추가
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl relative group">
                <button 
                  onClick={() => removeProject(idx)}
                  className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">프로젝트 명</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500"
                      value={proj.title}
                      onChange={(e) => updateProject(idx, 'title', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">수행 기간</label>
                      <input
                        type="text"
                        placeholder="2023.01 ~ 2023.04"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500"
                        value={proj.period}
                        onChange={(e) => updateProject(idx, 'period', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">기여도</label>
                      <input
                        type="text"
                        placeholder="프론트엔드 80%"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500"
                        value={proj.contribution}
                        onChange={(e) => updateProject(idx, 'contribution', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">상세 설명</label>
                    <textarea
                      rows={3}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 resize-none"
                      value={proj.description}
                      onChange={(e) => updateProject(idx, 'description', e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileForm;
