
import React, { useState } from 'react';
import { UserProfile, Application, ApplicationStatus, RecruitType } from '../types';
import { searchJobOpenings } from '../services/geminiService';
import { Search, Loader2, Bookmark, CheckCircle, ArrowRight, Building2, Sparkles, Plus } from 'lucide-react';

interface CompanyListProps {
  profile: UserProfile;
  applications: Application[];
  onSave: (app: Application) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({ profile, applications, onSave }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchJobOpenings(profile, query);
      // Sort by Fit Score (Highest first for better matching experience)
      const sortedData = [...data].sort((a, b) => b.fitScore - a.fitScore);
      setResults(sortedData);
    } catch (error) {
      console.error(error);
      alert('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (item: any, index: number) => {
    const newApp: Application = {
      id: Math.random().toString(36).substr(2, 9),
      companyName: item.companyName,
      position: item.position,
      status: ApplicationStatus.PLANNING,
      recruitType: item.recruitType as RecruitType || '일반채용',
      date: new Date().toISOString().split('T')[0],
      link: ''
    };
    onSave(newApp);
    setSavedIds(prev => new Set(prev).add(`${item.companyName}-${index}`));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-blue-400';
    return 'text-zinc-500';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">회사 리스트 및 적합도 탐색</h2>
        <p className="text-zinc-400">관심 직무를 검색하면 내 프로필과 가장 잘 어울리는 공고를 AI가 추천해 드립니다.</p>
      </header>

      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={20} className="text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="관심 직무 혹은 기술 스택을 입력하세요 (예: 백엔드 개발자, React 엔지니어)"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-5 pl-12 pr-32 text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? '검색 중...' : '검색'}
        </button>
      </form>

      <div className="space-y-4">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {results.map((item, idx) => {
              const uniqueId = `${item.companyName}-${idx}`;
              const isAlreadySaved = savedIds.has(uniqueId) || applications.some(a => a.companyName === item.companyName && a.position === item.position);
              const isHighScore = item.fitScore >= 90;

              return (
                <div 
                  key={idx} 
                  className={`bg-zinc-900 border ${isHighScore ? 'border-emerald-500/30 bg-emerald-500/5 shadow-lg shadow-emerald-500/5' : 'border-zinc-800'} p-6 rounded-2xl flex items-center justify-between hover:border-zinc-700 transition-all group animate-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 ${isHighScore ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-zinc-950 border-zinc-800'} rounded-2xl border flex items-center justify-center transition-colors`}>
                      <Building2 size={32} className={`${isHighScore ? 'text-emerald-500/50' : 'text-zinc-700'} group-hover:text-blue-500/50 transition-colors`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-bold text-white">{item.companyName}</h4>
                        {isHighScore && (
                          <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border border-emerald-500/20 animate-pulse">
                            <Sparkles size={10} /> BEST MATCH
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-400 font-medium">{item.position}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md ${isHighScore ? 'bg-emerald-500/10 text-emerald-500/70' : 'bg-zinc-800 text-zinc-400'}`}>
                          {item.recruitType}
                        </span>
                        <p className="text-xs text-zinc-600 truncate max-w-md">{item.jdSummary}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center flex flex-col items-center">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1 tracking-wider">Fit Score</p>
                      <div className={`text-4xl font-black flex items-baseline ${getScoreColor(item.fitScore)}`}>
                        {item.fitScore}<span className="text-sm ml-0.5 opacity-60">%</span>
                      </div>
                    </div>

                    <button
                      onClick={() => !isAlreadySaved && handleSave(item, idx)}
                      disabled={isAlreadySaved}
                      className={`h-12 w-32 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                        isAlreadySaved
                          ? 'bg-emerald-500/10 text-emerald-500 cursor-default'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-white active:scale-95'
                      }`}
                    >
                      {isAlreadySaved ? <CheckCircle size={18} /> : <Plus size={18} />}
                      {isAlreadySaved ? '저장됨' : '저장하기'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && (
            <div className="h-64 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-600">
              <Building2 size={48} className="opacity-10 mb-4" />
              <p className="font-medium">검색 결과가 없습니다.</p>
              <p className="text-sm">원하는 직무를 검색해 보세요!</p>
            </div>
          )
        )}
      </div>

      {results.length > 0 && (
        <div className="bg-blue-600/5 border border-blue-500/20 p-6 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white">
              <Bookmark size={24} />
            </div>
            <div>
              <h5 className="font-bold text-white">마음에 드는 회사를 저장하세요</h5>
              <p className="text-sm text-zinc-400">저장된 회사는 AI 자소서 작성 시 '회사 블록'으로 즉시 활용 가능합니다.</p>
            </div>
          </div>
          <ArrowRight className="text-zinc-700" />
        </div>
      )}
    </div>
  );
};

export default CompanyList;
