import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/outputs/Dashboard';
import { CompanyList } from './components/outputs/CompanyList';
import { CompanyProfile } from './components/outputs/CompanyProfile';
import { RenewalsList } from './components/outputs/RenewalsList';
import { NewBusiness } from './components/outputs/NewBusiness';
import { Invoices } from './components/outputs/Invoices';
import { NewPolicy } from './components/inputs/NewPolicy';
import { NewContact } from './components/inputs/NewContact';
import { TaskBoard } from './components/tasks/TaskBoard';
import { mockTasks, mockCompanies } from './components/data/mockData';
import { PolicyView } from './components/views/PolicyView';
import { ContactView } from './components/views/ContactView';
import { PoliciesList } from './components/outputs/PoliciesList';
import { ChatBubble } from './components/chat/ChatBubble';
import { UsersList } from './components/admin/UsersList';
import { RoleManagement } from './components/admin/RoleManagement';
import { SearchProvider } from './components/search/SearchContext';
import { GlobalSearch } from './components/search/GlobalSearch';
export function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentSection, setCurrentSection] = useState('outputs');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [taskFilter, setTaskFilter] = useState({
    status: 'all',
    priority: 'all'
  });
  const [selectedActivity, setSelectedActivity] = useState<{
    type: string;
    id: number;
  } | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<number | null>(null);
  const [previousView, setPreviousView] = useState<string>('dashboard');
  const handleTaskFilterClick = (filter: {
    status: string;
    priority: string;
  }) => {
    setTaskFilter(filter);
    setCurrentSection('tasks');
    setCurrentView('tasks');
  };
  const handleActivityClick = (type: string, id: number) => {
    setSelectedActivity({
      type,
      id
    });
    setCurrentView('activityDetail');
  };
  const handlePolicyClick = (policyId: number) => {
    setPreviousView(currentView);
    setSelectedPolicy(policyId);
    setCurrentView('activityDetail');
    setSelectedActivity({
      type: 'policy',
      id: policyId
    });
  };
  const handleBackFromPolicy = () => {
    setCurrentView(previousView);
    setSelectedPolicy(null);
    setSelectedActivity(null);
  };
  const handleDashboardNavigate = (section: string, view: string) => {
    setCurrentSection(section);
    setCurrentView(view);
  };
  const handleNewBusinessCompanyClick = (company: {
    id: number;
    name: string;
  }) => {
    const companyData = {
      id: company.id,
      name: company.name,
      activePolicies: 0,
      premium: '$0',
      revenue: '$0',
      hubspotUrl: '#'
    };
    setSelectedCompany(companyData);
    setPreviousView(currentView);
    setCurrentView('companyProfile');
  };
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onTaskFilterClick={handleTaskFilterClick} onActivityClick={handleActivityClick} onNavigate={handleDashboardNavigate} />;
      case 'activityDetail':
        if (!selectedActivity) return null;
        switch (selectedActivity.type) {
          case 'policy':
            return <PolicyView policyId={selectedActivity.id} onBack={() => {
              setCurrentView(previousView);
              setSelectedPolicy(null);
              setSelectedActivity(null);
            }} />;
          case 'contact':
            return <ContactView contactId={selectedActivity.id} onBack={() => setCurrentView('dashboard')} />;
          default:
            return null;
        }
      case 'companies':
        return <CompanyList onSelectCompany={company => {
          setSelectedCompany(company);
          setCurrentView('companyProfile');
        }} />;
      case 'companyProfile':
        return <CompanyProfile company={selectedCompany} onBack={() => setCurrentView(previousView)} onPolicyClick={handlePolicyClick} />;
      case 'renewals':
        return <RenewalsList onPolicyClick={handlePolicyClick} />;
      case 'newBusiness':
        return <NewBusiness onCompanyClick={handleNewBusinessCompanyClick} />;
      case 'invoices':
        return <Invoices />;
      case 'newPolicy':
        return <NewPolicy />;
      case 'newContact':
        return <NewContact />;
      case 'tasks':
        return <TaskBoard initialFilter={taskFilter} />;
      case 'policies':
        return <PoliciesList onPolicyClick={handlePolicyClick} />;
      case 'userManagement':
        return <UsersList />;
      case 'roleManagement':
        return <RoleManagement />;
      default:
        return <Dashboard onTaskFilterClick={handleTaskFilterClick} />;
    }
  };
  return <SearchProvider>
      <Layout currentSection={currentSection} setCurrentSection={setCurrentSection} currentView={currentView} setCurrentView={setCurrentView}>
        {renderContent()}
        <ChatBubble />
        <GlobalSearch />
      </Layout>
    </SearchProvider>;
}