import React, { useState } from 'react';
import { Card } from '../common/Card';
import { CheckCircleIcon, PlusIcon, XIcon } from 'lucide-react';
import { FileUpload } from '../common/FileUpload';
import { Tabs } from '../common/Tabs';
interface Coverage {
  type: string;
  limit: string;
  deductible: string;
  subLimits?: string;
  terms?: string;
}
interface ProcessingStatus {
  status: 'idle' | 'processing' | 'complete' | 'error';
  message: string;
  progress: number;
}
export const NewPolicy: React.FC = () => {
  const [formState, setFormState] = useState({
    companyName: '',
    contactName: '',
    policyType: '',
    effectiveDate: '',
    expirationDate: '',
    premium: '',
    carrier: '',
    coverageLimit: '',
    deductible: '',
    notes: '',
    coverages: [{
      type: '',
      limit: '',
      deductible: '',
      subLimits: '',
      terms: ''
    }] as Coverage[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    progress: number;
    error?: string;
  }>>([]);
  const [activeTab, setActiveTab] = useState<'manual' | 'quick'>('quick');
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    status: 'idle',
    message: '',
    progress: 0
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleCoverageChange = (index: number, field: keyof Coverage, value: string) => {
    const newCoverages = [...formState.coverages];
    newCoverages[index] = {
      ...newCoverages[index],
      [field]: value
    };
    setFormState(prev => ({
      ...prev,
      coverages: newCoverages
    }));
  };
  const addCoverage = () => {
    setFormState(prev => ({
      ...prev,
      coverages: [...prev.coverages, {
        type: '',
        limit: '',
        deductible: '',
        subLimits: '',
        terms: ''
      }]
    }));
  };
  const removeCoverage = (index: number) => {
    setFormState(prev => ({
      ...prev,
      coverages: prev.coverages.filter((_, i) => i !== index)
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to Ultron
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setFormState({
          companyName: '',
          contactName: '',
          policyType: '',
          effectiveDate: '',
          expirationDate: '',
          premium: '',
          carrier: '',
          coverageLimit: '',
          deductible: '',
          notes: '',
          coverages: [{
            type: '',
            limit: '',
            deductible: '',
            subLimits: '',
            terms: ''
          }] as Coverage[]
        });
      }, 3000);
    }, 1500);
  };
  const handleFilesSelected = (files: File[]) => {
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0
    }));
    // Simulate upload progress
    setUploadedFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(file => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            const newProgress = Math.min(f.progress + 20, 100);
            if (newProgress === 100) clearInterval(interval);
            return {
              ...f,
              progress: newProgress
            };
          }
          return f;
        }));
      }, 500);
    });
  };
  const handleFileRemove = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };
  const processDocument = async (files: File[]) => {
    setProcessingStatus({
      status: 'processing',
      message: 'Uploading document...',
      progress: 0
    });
    // Simulate upload progress
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessingStatus({
      status: 'processing',
      message: 'Analyzing document content...',
      progress: 30
    });
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessingStatus({
      status: 'processing',
      message: 'Extracting policy information...',
      progress: 60
    });
    // Simulate data extraction
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessingStatus({
      status: 'complete',
      message: 'Document processed successfully!',
      progress: 100
    });
    // Simulate extracted data
    setFormState({
      companyName: 'Acme Corporation',
      contactName: 'John Smith',
      policyType: 'General Liability',
      effectiveDate: '2023-09-15',
      expirationDate: '2024-09-15',
      premium: '12500',
      carrier: 'Insurance Co',
      coverageLimit: '1000000',
      deductible: '5000',
      notes: 'Automatically extracted from document',
      coverages: [{
        type: 'General Aggregate',
        limit: '2000000',
        deductible: '5000',
        subLimits: 'Products/Completed Operations: $2,000,000',
        terms: 'Per occurrence basis'
      }]
    });
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">New Policy</h1>
        <p className="text-gray-600">
          Create a new policy to be processed by Ultron.
        </p>
      </div>
      <Card>
        <Tabs value={activeTab} onChange={value => setActiveTab(value as 'manual' | 'quick')} tabs={[{
        value: 'quick',
        label: 'Quick Upload'
      }, {
        value: 'manual',
        label: 'Manual Entry'
      }]} />
        <div className="mt-6">
          {activeTab === 'quick' ? <div>
              {processingStatus.status === 'idle' ? <div className="space-y-4">
                  <div className="text-center max-w-xl mx-auto mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Upload Policy Document
                    </h3>
                    <p className="text-gray-600">
                      Upload your policy document and let Ultron automatically
                      extract the information. Supported formats: PDF, DOC, DOCX
                    </p>
                  </div>
                  <FileUpload onFilesSelected={files => processDocument(files)} onFileRemove={() => {}} uploadedFiles={[]} maxFiles={1} acceptedFileTypes=".pdf,.doc,.docx" />
                </div> : <div className="max-w-xl mx-auto">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {processingStatus.message}
                      </span>
                      <span className="text-sm text-gray-500">
                        {processingStatus.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{
                  width: `${processingStatus.progress}%`
                }} />
                    </div>
                  </div>
                  {processingStatus.status === 'complete' && <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <CheckCircleIcon className="text-green-500 mt-0.5 mr-3" size={16} />
                        <div>
                          <h4 className="text-green-800 font-medium">
                            Processing Complete
                          </h4>
                          <p className="text-green-700 text-sm">
                            Policy information has been extracted. Please review
                            and make any necessary adjustments below.
                          </p>
                        </div>
                      </div>
                    </div>}
                  {processingStatus.status === 'complete' && <div className="border-t border-gray-200 pt-6">
                      {/* Show the same form as manual entry, but pre-populated */}
                      {/* Existing form JSX goes here */}
                    </div>}
                </div>}
            </div> : <div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input type="text" id="companyName" name="companyName" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.companyName} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Contact *
                    </label>
                    <input type="text" id="contactName" name="contactName" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.contactName} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="policyType" className="block text-sm font-medium text-gray-700 mb-1">
                      Policy Type *
                    </label>
                    <select id="policyType" name="policyType" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.policyType} onChange={handleChange}>
                      <option value="">Select Policy Type</option>
                      <option value="General Liability">
                        General Liability
                      </option>
                      <option value="Property">Property</option>
                      <option value="Workers Compensation">
                        Workers Compensation
                      </option>
                      <option value="Professional Liability">
                        Professional Liability
                      </option>
                      <option value="Cyber">Cyber</option>
                      <option value="Commercial Auto">Commercial Auto</option>
                      <option value="Umbrella">Umbrella</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="carrier" className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Carrier *
                    </label>
                    <input type="text" id="carrier" name="carrier" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.carrier} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Effective Date *
                    </label>
                    <input type="date" id="effectiveDate" name="effectiveDate" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.effectiveDate} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Date *
                    </label>
                    <input type="date" id="expirationDate" name="expirationDate" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.expirationDate} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="premium" className="block text-sm font-medium text-gray-700 mb-1">
                      Premium Amount *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input type="text" id="premium" name="premium" required className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" value={formState.premium} onChange={handleChange} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="coverageLimit" className="block text-sm font-medium text-gray-700 mb-1">
                      Coverage Limit *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input type="text" id="coverageLimit" name="coverageLimit" required className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" value={formState.coverageLimit} onChange={handleChange} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="deductible" className="block text-sm font-medium text-gray-700 mb-1">
                      Deductible
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input type="text" id="deductible" name="deductible" className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" value={formState.deductible} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea id="notes" name="notes" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.notes} onChange={handleChange}></textarea>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    Coverages
                  </h3>
                  <button type="button" onClick={addCoverage} className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center">
                    <PlusIcon size={16} className="mr-1" />
                    Add Coverage
                  </button>
                </div>
                <div className="space-y-6">
                  {formState.coverages.map((coverage, index) => <div key={index} className="p-4 border border-gray-200 rounded-md relative">
                      {index > 0 && <button type="button" onClick={() => removeCoverage(index)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                          <XIcon size={16} />
                        </button>}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Coverage Type *
                          </label>
                          <input type="text" required value={coverage.type} onChange={e => handleCoverageChange(index, 'type', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Limit *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                $
                              </span>
                            </div>
                            <input type="text" required value={coverage.limit} onChange={e => handleCoverageChange(index, 'limit', e.target.value)} className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deductible *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                $
                              </span>
                            </div>
                            <input type="text" required value={coverage.deductible} onChange={e => handleCoverageChange(index, 'deductible', e.target.value)} className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sub-limits
                          </label>
                          <input type="text" value={coverage.subLimits} onChange={e => handleCoverageChange(index, 'subLimits', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Terms
                          </label>
                          <input type="text" value={coverage.terms} onChange={e => handleCoverageChange(index, 'terms', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                      </div>
                    </div>)}
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documents
                  </label>
                  <FileUpload onFilesSelected={handleFilesSelected} onFileRemove={handleFileRemove} uploadedFiles={uploadedFiles} maxFiles={5} />
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={isSubmitting} className={`px-6 py-2 rounded-md text-white font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {isSubmitting ? 'Submitting...' : 'Submit to Ultron'}
                  </button>
                </div>
              </form>
            </div>}
        </div>
      </Card>
    </div>;
};