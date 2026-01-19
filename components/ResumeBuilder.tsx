
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Application } from '../types';
import { generateResumeContent } from '../services/geminiService';
import { Sparkles, Loader2, Copy, Check, Briefcase, Building2, CheckCircle, FileText, X, Send, User, Bot, History, Layers } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: {
    projects: string[];
    company?: string;
  };
}

interface ResumeBuilderProps {
  profile: UserProfile;
  applications: Application[];
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ profile, applications }) => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Block Selection States
  const [selectedProjectIndices, setSelectedProjectIndices] = useState<number[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleProject = (idx: number) => {
    setSelectedProjectIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const selectApplication = (id: string) => {
    setSelectedAppId(id === selectedAppId ? null : id);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    const selectedProjects = selectedProjectIndices.map(idx => profile.projects[idx]);
    const selectedApp = applications.find(a => a.id === selectedAppId);

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
      context: {
        projects: selectedProjects.map(p => p.title),
        company: selectedApp?.companyName
      }
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentPrompt = prompt;
    setPrompt('');
    setLoading(true);

    const enrichedPrompt = `
      [참고할 프로젝트 경험 블록]
      ${selectedProjects.map(p => `- ${p.title}: ${p.description} (기여도: ${p.contribution})`).join('\n')}
      
      [참고할 지원 예정/과거 회사 블록]
      ${selectedApp ? `- ${selectedApp.companyName} (${selectedApp.position}) - 상태: ${selectedApp.status}` : '선택된 회사 블록 없음'}

      사용자의 질문/요청: ${currentPrompt}
    `;

    try {
      const companyInfo = selectedApp 
        ? { name: selectedApp.companyName, position: selectedApp.position, jd: "" }
        : { name: "입력되지 않음", position: "입력되지 않음", jd: "" };

      const output = await generateResumeContent(profile, companyInfo, enrichedPrompt);
      
      const assistantMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: "분석을 완료하여 문서를 생성/수정했습니다. 우측 패널에서 상세 내용을 확인하실 수 있습니다.",
        timestamp: new Date()
      };
      
      setResult(output || '');
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: "죄송합니다. AI 처리 중 오류가 발생했습니다.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-10">
      <header>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">AI 커리어 에이전트</h2>
        <p className="text-zinc-500">컨텍스트 블록을 선택하여 AI와 대화하며 최적의 자소서를 작성하세요.</p>
      </header>

      {/* Block Sections - Separated */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Context Area */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xs font-black text-blue-500 flex items-center gap-2 uppercase tracking-widest">
              <FileText size={14} /> 프로젝트 컨텍스트
            </h3>
            <span className="text-[10px] text-zinc-600 font-bold bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
              {selectedProjectIndices.length}개 선택됨
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {profile.projects.map((project, idx) => (
              <div 
                key={idx}
                onClick={() => toggleProject(idx)}
                className={`min-w-[150px] max-w-[150px] p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  selectedProjectIndices.includes(idx) 
                    ? 'bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/20' 
                    : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <h4 className="text-[11px] font-black text-white truncate mb-1">{project.title}</h4>
                <p className="text-[10px] text-zinc-600 truncate">{project.period}</p>
                {selectedProjectIndices.includes(idx) && <CheckCircle size={10} className="text-blue-500 mt-2" />}
              </div>
            ))}
          </div>
        </section>

        {/* Company Context Area */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xs font-black text-emerald-500 flex items-center gap-2 uppercase tracking-widest">
              <Building2 size={14} /> 회사 컨텍스트
            </h3>
            <span className="text-[10px] text-zinc-600 font-bold bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
              {selectedAppId ? '1' : '0'}개 선택됨
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {applications.map((app) => (
              <div 
                key={app.id}
                onClick={() => selectApplication(app.id)}
                className={`min-w-[150px] max-w-[150px] p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  selectedAppId === app.id 
                    ? 'bg-emerald-600/10 border-emerald-500 ring-2 ring-emerald-500/20' 
                    : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <h4 className="text-[11px] font-black text-white truncate mb-1">{app.companyName}</h4>
                <p className="text-[10px] text-zinc-600 truncate">{app.position}</p>
                {selectedAppId === app.id && <CheckCircle size={10} className="text-emerald-500 mt-2" />}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Chat & Results Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[550px]">
        {/* Dialogue Panel */}
        <div className="lg:col-span-5 flex flex-col bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md z-10">
            <h3 className="text-white font-bold flex items-center gap-2 text-xs uppercase tracking-tighter">
              <History size={14} className="text-blue-500" /> AI 대화 내역
            </h3>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-gradient-to-b from-transparent to-zinc-950/30"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <Bot size={48} className="text-zinc-600" />
                <p className="text-sm font-medium">컨텍스트 블록을 먼저 선택하고<br/>AI에게 요청사항을 말씀해 주세요.</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`max-w-[90%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'bg-zinc-800 border border-zinc-700'}`}>
                    {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-blue-500" />}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-zinc-800/80 text-zinc-200 rounded-tl-none border border-zinc-700/50 backdrop-blur-sm'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && msg.context && (msg.context.projects.length > 0 || msg.context.company) && (
                      <div className="flex flex-wrap gap-1 justify-end px-1 opacity-60">
                         {msg.context.company && (
                           <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-[9px] font-bold">
                             @{msg.context.company}
                           </span>
                         )}
                         {msg.context.projects.map((p, i) => (
                           <span key={i} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md text-[9px] font-bold">
                             #{p}
                           </span>
                         ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center">
                    <Loader2 size={16} className="text-zinc-600 animate-spin" />
                  </div>
                  <div className="p-4 bg-zinc-800/30 border border-zinc-800 rounded-3xl rounded-tl-none text-zinc-500 text-xs italic">
                    AI가 최적화된 문서를 생성 중입니다...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Prompt Area with Integrated Selection Visual */}
          <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 backdrop-blur-xl">
            {/* Current Context Sticky Indicator */}
            {(selectedProjectIndices.length > 0 || selectedAppId) && (
              <div className="flex flex-wrap gap-1.5 mb-3 px-1 animate-in fade-in slide-in-from-bottom-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mr-1 self-center">Context:</span>
                {selectedAppId && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-[10px] font-black group">
                    <Building2 size={10} />
                    {applications.find(a => a.id === selectedAppId)?.companyName}
                    <button onClick={() => setSelectedAppId(null)} className="hover:text-white ml-0.5"><X size={10} /></button>
                  </div>
                )}
                {selectedProjectIndices.map((idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-lg text-[10px] font-black group">
                    <FileText size={10} />
                    {profile.projects[idx].title}
                    <button onClick={() => toggleProject(idx)} className="hover:text-white ml-0.5"><X size={10} /></button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleGenerate} className="relative group">
              <input
                type="text"
                placeholder="어떤 문서를 작성하거나 수정할까요?"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-5 pr-14 text-sm text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-zinc-600"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="absolute right-2 top-2 bottom-2 w-10 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 text-white rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-blue-900/20"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 flex flex-col bg-zinc-950 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl group/result">
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/20 backdrop-blur-md">
            <h3 className="text-zinc-100 font-bold flex items-center gap-2 text-xs uppercase tracking-tighter">
              <Sparkles size={14} className="text-blue-500" /> AI 생성 문서 미리보기
            </h3>
            {result && (
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 rounded-xl text-[11px] font-black transition-all flex items-center gap-2 border border-blue-500/20"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? '복사완료' : '결과 복사'}
              </button>
            )}
          </div>

          <div className="flex-1 p-8 md:p-12 overflow-y-auto">
            {result ? (
              <div className="whitespace-pre-wrap text-zinc-300 font-medium leading-relaxed text-base animate-in fade-in duration-700 selection:bg-blue-500/30">
                {result}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <Layers size={80} className="text-zinc-400 mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">분석 결과 없음</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
