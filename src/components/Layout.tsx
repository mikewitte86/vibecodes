import React, { useState } from 'react';
import { ShieldIcon, BarChart2Icon, CheckSquareIcon, HomeIcon, UsersIcon, RefreshCcwIcon, TrendingUpIcon, FileTextIcon, ChevronLeftIcon, ChevronRightIcon, MenuIcon } from 'lucide-react';
import { Logo } from './common/Logo';
import { GlobalSearchBar } from './common/GlobalSearchBar';
interface LayoutProps {
  children: React.ReactNode;
  currentSection: string;
  setCurrentSection: (section: string) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}
export const Layout: React.FC<LayoutProps> = ({
  children,
  currentSection,
  setCurrentSection,
  currentView,
  setCurrentView
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const handleNavigation = (section: string, view: string) => {
    setCurrentSection(section);
    setCurrentView(view);
  };
  const navItems = [{
    section: 'outputs',
    title: 'Data Outputs',
    items: [{
      title: 'Dashboard',
      icon: HomeIcon,
      view: 'dashboard'
    }, {
      title: 'Companies',
      icon: UsersIcon,
      view: 'companies'
    }, {
      title: 'Policies',
      icon: FileTextIcon,
      view: 'policies'
    }, {
      title: 'Next 90 Renewals',
      icon: RefreshCcwIcon,
      view: 'renewals'
    }, {
      title: 'New Business',
      icon: TrendingUpIcon,
      view: 'newBusiness'
    }, {
      title: 'Invoices',
      icon: FileTextIcon,
      view: 'invoices'
    }]
  }, {
    section: 'inputs',
    title: 'Feed Ultron',
    items: [{
      title: 'New Policy',
      icon: FileTextIcon,
      view: 'newPolicy'
    }, {
      title: 'New Contact',
      icon: UsersIcon,
      view: 'newContact'
    }]
  }, {
    section: 'tasks',
    title: 'Task Management',
    items: [{
      title: 'Task Board',
      icon: CheckSquareIcon,
      view: 'tasks'
    }]
  }, {
    section: 'admin',
    title: 'Administrative',
    items: [{
      title: 'User Management',
      icon: UsersIcon,
      view: 'userManagement'
    }, {
      title: 'Roles & Permissions',
      icon: ShieldIcon,
      view: 'roleManagement'
    }]
  }];
  return <div className="min-h-screen bg-gray-50">
      <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} fixed left-0 top-0 h-screen bg-[#0F172A] transition-all duration-300 ease-in-out z-20`}>
        <div className={`h-16 flex items-center border-b border-gray-800 ${isSidebarCollapsed ? 'justify-center px-4' : 'justify-between px-4'}`}>
          {!isSidebarCollapsed && <Logo variant="white" size="sm" />}
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="text-gray-400 hover:text-white transition-colors" title={isSidebarCollapsed ? 'Expand' : 'Collapse'}>
            {isSidebarCollapsed ? <ChevronRightIcon size={20} /> : <ChevronLeftIcon size={20} />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems.map(group => <div key={group.section} className="mb-6">
              {!isSidebarCollapsed && <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 px-3">
                  {group.title}
                </h3>}
              <ul className="space-y-1">
                {group.items.map(item => {
              const Icon = item.icon;
              const isActive = currentSection === group.section && currentView === item.view;
              return <li key={item.view} onClick={() => handleNavigation(group.section, item.view)} className={`
                        cursor-pointer rounded-md transition-colors duration-200
                        ${isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                      `}>
                      <div className={`flex items-center px-3 py-2 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                        <Icon size={20} className="min-w-[20px]" />
                        {!isSidebarCollapsed && <span className="ml-3 text-sm">{item.title}</span>}
                      </div>
                    </li>;
            })}
              </ul>
            </div>)}
        </nav>
      </aside>
      <div className={`${isSidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <h1 className="text-xl font-semibold text-gray-900">
                Equal Parts
              </h1>
              <div className="flex-1 max-w-2xl mx-4">
                <GlobalSearchBar />
              </div>
              <div className="flex items-center space-x-4">
                {/* Add any header actions/profile menu here */}
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>;
};