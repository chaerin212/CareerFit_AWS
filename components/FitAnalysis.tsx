
import React, { useState } from 'react';
import { UserProfile, FitAnalysisResult } from '../types';
import { analyzeFit as analyzeFitAPI } from '../services/apiService';
import { Loader2, Zap, Target, Smile, ShieldCheck, AlertCircle } from 'lucide-react';

interface FitAnalysisProps {
  profile: UserProfile;
}

const FitAnalysis: React.FC<FitAnalysisProps> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({ name: '', position: '', jd: '', values: '' });
  const [analysis, setAnalysis] = useState<FitAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!companyInfo.name || !companyInfo.position) return;
    setLoading(true);
    try {
      const result = await analyzeFitAPI({
        profile,
        companyInfo
      });
      setAnalysis(result);
    } catch (error) {
      console.error('분석 중 오류가 발생했습니다:', error);
      alert('분석 중 오류가 발생했습니다. 백엔드 서버를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const ScoreBadge = ({ value, label, icon: Icon, color }: any) => (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center text-center">
      <div className={`p-3 rounded-full ${color} bg-opacity-10 mb-3`}>
        <Icon className={color} size={24} />
      </div>
      <p className="text-zinc-500 text-sm mb-1 uppercase tracking-wider font-semibold">{label}</p>
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
            strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * value) / 100}
            className={color} strokeLinecap="round" />
        </svg>
        <span className="absolute text-2xl font-black text-white">{value}%</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">직무 및 컬쳐핏 분석</h2>
        <p className="text-zinc-400">나와 이 회사는 얼마나 어울릴까요? AI가 정밀 분석해드립니다.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-6 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 h-fit">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">회사명</label>
              <input
                type="text"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">지원 직무</label>
              <input
                type="text"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                value={companyInfo.position}
                onChange={(e) => setCompanyInfo({...companyInfo, position: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">채용 공고 (JD)</label>
            <textarea
              rows={4}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none resize-none"
              value={companyInfo.jd}
              onChange={(e) => setCompanyInfo({...companyInfo, jd: e.target.value})}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">회사 인재상 / 핵심 가치</label>
            <input
              type="text"
              placeholder="예: 고객 중심, 빠른 실행, 협력"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
              value={companyInfo.values}
              onChange={(e) => setCompanyInfo({...companyInfo, values: e.target.value})}
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading || !companyInfo.name || !companyInfo.position}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
              loading ? 'bg-zinc-800 text-zinc-500' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-900/20'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
            {loading ? 'AI 분석 분석 중...' : '적합도 정밀 분석'}
          </button>
        </section>

        <section className="space-y-6">
          {analysis ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ScoreBadge label="직무 적합도" value={analysis.jobFit} icon={Target} color="text-blue-500" />
                <ScoreBadge label="컬쳐 핏" value={analysis.cultureFit} icon={Smile} color="text-amber-500" />
                <ScoreBadge label="종합 점수" value={analysis.overallScore} icon={Zap} color="text-emerald-500" />
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-500" size={18} /> 강점 요인 (Strengths)
                </h4>
                <div className="space-y-2">
                  {analysis.strengths.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-zinc-300 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                      <div className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={18} /> 부족 요소 (Areas for Improvement)
                </h4>
                <div className="space-y-2">
                  {analysis.weaknesses.map((w, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-zinc-300 bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                      <div className="mt-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      {w}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 border border-blue-500/20 p-6 rounded-2xl shadow-lg shadow-blue-500/5">
                <h4 className="text-white font-semibold mb-2">AI 총평</h4>
                <p className="text-zinc-300 text-sm leading-relaxed italic">"{analysis.summary}"</p>
              </div>
            </div>
          ) : (
            <div className="h-full bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-600 p-12">
              <Zap size={64} className="mb-4 opacity-5" />
              <p className="text-lg font-medium">분석 대기 중</p>
              <p className="text-sm">왼쪽의 정보를 입력하고 분석 버튼을 눌러주세요.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FitAnalysis;
