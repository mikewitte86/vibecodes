import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/outputs/Dashboard';
import { CompanyList } from './components/outputs/CompanyList';
import { CompanyProfile } from './components/outputs/CompanyProfile';
import { RenewalsList } from './components/outputs/RenewalsList';
import { NewBusiness } from './components/outputs/NewBusiness';
import { Invoices } from './components/outputs/Invoices';
import { NewPolicy } from './components/inputs/NewPolicy';
import { NewContact } from './components/inputs/NewContact';
import { UploadDocument } from './components/inputs/UploadDocument';
import { TaskBoard } from './components/tasks/TaskBoard';
import { PolicyView } from './components/views/PolicyView';
import { ContactView } from './components/views/ContactView';
import { PoliciesList } from './components/outputs/PoliciesList';
import { ChatBubble } from './components/chat/ChatBubble';
import { UsersList } from './components/admin/UsersList';
import { RoleManagement } from './components/admin/RoleManagement';
import { SearchProvider } from './components/search/SearchContext';
import { GlobalSearch } from './components/search/GlobalSearch';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { setupCorsDisabler } from './corsDisabler';
import { CustomerList } from './components/ultron/CustomerList';
import { CustomerDocuments } from './components/ultron/CustomerDocuments';
import { CorsDebugger } from './components/common/CorsDebugger';

// Define type for dashboard props
interface DashboardProps {
  onTaskFilterClick: (filter: { status: string; priority: string }) => void;
  onActivityClick?: (type: string, id: number) => void;
  onNavigate?: (section: string, view: string) => void;
}

// Define a type for company
interface Company {
  id: number;
  name: string;
  activePolicies: number;
  premium: string;
  revenue: string;
  hubspotUrl: string;
}

// Define a type for customer
interface Customer {
  id: string;
  name: string;
  status: string;
}

export function App() {
  // Initialize CORS disabler for development
  useEffect(() => {
    setupCorsDisabler();
  }, []);

  const [currentView, setCurrentView] = useState('dashboard');
  const [currentSection, setCurrentSection] = useState('outputs');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
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
    // Create a complete Company object from the minimal data we have
    const companyData: Company = {
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

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setPreviousView('customers');
    setCurrentView('customerDocuments');
  };

  const handleBackFromCustomerDocuments = () => {
    setCurrentView('customers');
    setSelectedCustomer(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          onTaskFilterClick={handleTaskFilterClick}
          onActivityClick={handleActivityClick}
          onNavigate={handleDashboardNavigate}
        />;
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
        return <CompanyList onSelectCompany={(company: Company) => {
          setSelectedCompany(company);
          setCurrentView('companyProfile');
        }} />;
      case 'customers':
        return <CustomerList onSelectCustomer={handleCustomerClick} />;
      case 'customerDocuments':
        return selectedCustomer ? (
          <CustomerDocuments 
            customerId={selectedCustomer.id} 
            customerName={selectedCustomer.name}
            onBack={handleBackFromCustomerDocuments}
          />
        ) : (
          <div>Error: No customer selected</div>
        );
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
      case 'uploadDocument':
        return <UploadDocument />;
      case 'tasks':
        return <TaskBoard initialFilter={taskFilter} />;
      case 'policies':
        return <PoliciesList onPolicyClick={handlePolicyClick} />;
      case 'userManagement':
        return <UsersList />;
      case 'roleManagement':
        return <RoleManagement />;
      default:
        return <Dashboard 
          onTaskFilterClick={handleTaskFilterClick}
          onActivityClick={handleActivityClick}
          onNavigate={handleDashboardNavigate}
        />;
    }
  };

  return (
    <AuthProvider>
      <SearchProvider>
        <div className="min-h-screen flex flex-col">
          <ProtectedRoute>
            <Layout currentSection={currentSection} setCurrentSection={setCurrentSection} currentView={currentView} setCurrentView={setCurrentView}>
              {renderContent()}
              <ChatBubble />
              <GlobalSearch />
            </Layout>
          </ProtectedRoute>
          {process.env.NODE_ENV === 'development' && <CorsDebugger />}
        </div>
      </SearchProvider>
    </AuthProvider>
  );
}