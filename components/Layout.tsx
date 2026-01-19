
import React from 'react';
import { LayoutDashboard, FileText, Search, BarChart3, UserCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'tracker', label: '지원 트래커', icon: BarChart3 },
    { id: 'resume', label: 'AI 자소서/이력서', icon: FileText },
    { id: 'company-list', label: '회사 리스트', icon: Search },
    { id: 'profile', label: '내 프로필', icon: UserCircle },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col p-4">
        <div className="flex items-center gap-2 px-2 py-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">C</div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">CareerFit</h1>
        </div>
        
        <nav className="flex-1 mt-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-zinc-800 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-2">
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <p className="text-xs text-zinc-500 font-medium uppercase mb-2">오늘의 한마디</p>
            <p className="text-sm text-zinc-300 italic">"꾸준함이 실력입니다. 한 걸음씩 나아가세요!"</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
