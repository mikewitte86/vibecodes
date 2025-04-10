import React, { useState } from 'react';
import { ViewLayout } from '../common/ViewLayout';
import { Card } from '../common/Card';
import { DataGrid } from '../common/DataGrid';
import { DataField } from '../common/DataField';
import { FileTextIcon, BotIcon, TrendingUpIcon, ShieldIcon, DollarSignIcon, ArrowRightIcon, StarIcon, LayersIcon } from 'lucide-react';
import { Badge } from '../common/Badge';
import { DocumentPreview } from '../common/DocumentPreview';
interface PolicyViewProps {
  policyId: number;
  onBack: () => void;
}
export const PolicyView: React.FC<PolicyViewProps> = ({
  policyId,
  onBack
}) => {
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const mockPolicy = {
    id: policyId,
    type: 'General Liability',
    company: 'Acme Inc.',
    coverage: '$1.2M',
    premium: '$12,500',
    effectiveDate: '2023-01-01',
    expirationDate: '2024-01-01',
    status: 'Active',
    carrier: 'Insurance Co',
    policyNumber: 'GL-123456',
    documents: [{
      name: 'Policy Document',
      date: '2023-01-01'
    }, {
      name: 'Endorsement 1',
      date: '2023-03-15'
    }],
    coverages: [{
      type: 'General Aggregate',
      limit: '$2,000,000',
      deductible: '$1,000',
      subLimits: 'Products/Completed Operations: $2,000,000',
      terms: 'Per occurrence basis'
    }, {
      type: 'Each Occurrence',
      limit: '$1,000,000',
      deductible: '$1,000'
    }, {
      type: 'Personal & Advertising Injury',
      limit: '$1,000,000',
      deductible: '$1,000'
    }, {
      type: 'Damage to Rented Premises',
      limit: '$100,000',
      deductible: '$500'
    }]
  };
  return <ViewLayout title="Policy Details" subtitle="View and manage policy information" onBack={onBack}>
      <DataGrid>
        <Card title="Policy Information">
          <div className="space-y-4">
            <div className="flex items-center">
              <FileTextIcon size={20} className="text-blue-600 mr-2" />
              <span className="font-medium">{mockPolicy.type}</span>
            </div>
            <DataGrid columns={2}>
              <DataField label="Company" value={mockPolicy.company} />
              <DataField label="Policy Number" value={mockPolicy.policyNumber} />
              <DataField label="Coverage" value={mockPolicy.coverage} />
              <DataField label="Premium" value={mockPolicy.premium} icon={DollarSignIcon} />
              <DataField label="Effective Date" value={mockPolicy.effectiveDate} />
              <DataField label="Expiration Date" value={mockPolicy.expirationDate} />
              <DataField label="Status" value={<Badge variant={mockPolicy.status === 'Active' ? 'success' : 'default'}>
                    {mockPolicy.status}
                  </Badge>} />
              <DataField label="Carrier" value={mockPolicy.carrier} />
            </DataGrid>
          </div>
        </Card>
        <Card title="Coverages">
          <div className="space-y-4">
            {mockPolicy.coverages.map((coverage, index) => <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{coverage.type}</h4>
                  <span className="text-blue-600 font-medium">
                    {coverage.limit}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Deductible:</span>
                    <span className="ml-2">{coverage.deductible}</span>
                  </div>
                  {coverage.subLimits && <div>
                      <span className="text-gray-500">Sub-limits:</span>
                      <span className="ml-2">{coverage.subLimits}</span>
                    </div>}
                  {coverage.terms && <div className="col-span-2">
                      <span className="text-gray-500">Terms:</span>
                      <span className="ml-2">{coverage.terms}</span>
                    </div>}
                </div>
              </div>)}
          </div>
        </Card>
        <Card title="Documents">
          <div className="space-y-3">
            {mockPolicy.documents.map((doc, index) => <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div className="flex items-center">
                  <FileTextIcon size={16} className="text-gray-400 mr-2" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.date}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDocument({
              name: doc.name,
              url: ''
            })} className="text-blue-600 hover:text-blue-800 text-sm">
                  View
                </button>
              </div>)}
          </div>
        </Card>
      </DataGrid>
      {selectedDocument && <DocumentPreview name={selectedDocument.name} url={selectedDocument.url} onClose={() => setSelectedDocument(null)} />}
    </ViewLayout>;
};