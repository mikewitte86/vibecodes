import React from 'react';
import { Card } from '../common/Card';
import { ArrowLeftIcon, UserIcon, PhoneIcon, MailIcon, ClockIcon } from 'lucide-react';
import { Button } from '../common/Button';
interface ContactViewProps {
  contactId: number;
  onBack: () => void;
}
export const ContactView: React.FC<ContactViewProps> = ({
  contactId,
  onBack
}) => {
  const mockContact = {
    id: contactId,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Primary Contact',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    lastActivity: '2023-09-01',
    notes: 'Key decision maker for insurance matters'
  };
  return <div>
      <div className="mb-6">
        <Button variant="outline" size="sm" icon={ArrowLeftIcon} onClick={onBack} className="mb-4">
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Contact Details</h1>
        <p className="text-gray-600">View and manage contact information</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Contact Information">
          <div className="space-y-4">
            <div className="flex items-center">
              <UserIcon size={20} className="text-blue-600 mr-2" />
              <span className="font-medium">{mockContact.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{mockContact.company}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{mockContact.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="flex items-center">
                  <MailIcon size={14} className="text-gray-400 mr-1" />
                  {mockContact.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="flex items-center">
                  <PhoneIcon size={14} className="text-gray-400 mr-1" />
                  {mockContact.phone}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card title="Additional Information">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Last Activity</p>
              <p className="flex items-center mt-1">
                <ClockIcon size={14} className="text-gray-400 mr-1" />
                {mockContact.lastActivity}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Notes</p>
              <p className="mt-1">{mockContact.notes}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>;
};