import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Select } from '../common/Select';
import { FileUpload } from '../common/FileUpload';
import { CheckCircleIcon, RefreshCwIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApiClient, clearRequestCache } from '../../services/ApiService';
import { uploadFileToS3, cancelAllUploads } from '../../services/S3Service';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  error?: string;
  file?: File; // Store the actual file object for S3 upload
  presignedUrl?: string; // Store the presigned URL when received
  objectKey?: string; // Store the S3 object key for reference
}

interface Company {
  id: string;
  name: string;
}

interface Policy {
  id: string;
  name: string;
}

// Define API response types
interface CustomerData {
  id: string;
  commercial_name: string;
  description: string | null;
  status: string;
}

interface PolicyData {
  id: string;
  number: string;
  description?: string;
}

interface ApiResponse {
  statusCode: number;
  body: {
    customers: CustomerData[];
    policies?: PolicyData[];
    count: number;
    filter_applied: string | null;
    pagination: {
      total_items: number;
      fetch_all: boolean;
      limit_per_page: number;
      offset: number;
    };
    search_applied: string | null;
  };
}

interface PresignedUrlResponse {
  statusCode: number;
  body: {
    url: string;
    object_key: string;
    expiration_seconds: number;
    operation: string;
  };
}

export const UploadDocument: React.FC = () => {
  const { getIdToken } = useAuth();
  const apiClient = useApiClient();
  const [formState, setFormState] = useState({
    company: '',
    policy: '',
    documentType: '',
    newPolicyNumber: '',
  });
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPoliciesLoading, setIsPoliciesLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchCompanies();
    
    // Clean up any active uploads when component unmounts
    return () => {
      // Cancel any ongoing uploads to prevent memory leaks
      cancelAllUploads();
    };
  }, []);

  // Fetch policies when customer selection changes
  useEffect(() => {
    if (formState.company) {
      fetchPolicies(formState.company);
    } else {
      // Reset policies when no customer is selected
      setPolicies([]);
    }
  }, [formState.company]);

  const fetchCompanies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.fetchAmsCompanies();
      console.log('Companies data:', data);
      
      // Extract customers from the nested response structure
      const customers = data.body?.customers || [];
      setCompanies(customers.map((customer: {
        id: string;
        name?: string;
        commercial_name?: string;
      }) => ({
        id: customer.id,
        name: customer.commercial_name || customer.name || 'Unknown'
      })));
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(`Failed to load companies: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPolicies = async (customerId: string) => {
    setIsPoliciesLoading(true);
    setPolicyError(null);
    
    try {
      const response = await apiClient.get<ApiResponse>(`policies?by_customer=${customerId}`);
      console.log('Policies data:', response);
      
      // Extract policies from the nested response structure
      const policyList = response.body?.policies || [];
      setPolicies(policyList.map((policy: PolicyData) => ({
        id: policy.id,
        name: policy.number || `Policy ${policy.id}`
      })));
    } catch (err) {
      console.error('Error fetching policies:', err);
      setPolicyError(`Failed to load policies: ${err instanceof Error ? err.message : String(err)}`);
      setPolicies([]);
    } finally {
      setIsPoliciesLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If policy was previously selected but customer changes, reset policy
    if (name === 'company' && formState.policy) {
      setFormState(prev => ({
        ...prev,
        policy: '',
        newPolicyNumber: ''
      }));
    }
  };

  const handleFilesSelected = (files: File[]) => {
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0, // Start with 0 progress
      file: file, // Store the actual file for later upload
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileRemove = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    // Also remove from progress tracking if exists
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  // Get presigned URLs for each file
  const getPresignedUrls = async () => {
    setUploadError(null);
    
    try {
      // Get the policy info for the request
      let policyId = '';
      if (formState.policy === 'new_policy') {
        policyId = formState.newPolicyNumber;
      } else if (formState.policy === 'other') {
        policyId = 'other';
      } else if (formState.policy) {
        policyId = formState.policy;
      }
      
      // Map our document type to expected format
      const documentType = formState.documentType.replace('_', '-');
      
      // Process each file to get presigned URLs
      const filesWithUrls = await Promise.all(
        uploadedFiles.map(async (file) => {
          if (!file.file) {
            throw new Error(`File object missing for ${file.name}`);
          }
          
          try {
            // Create request for presigned URL
            const data = await apiClient.getUploadPresignedUrl({
              filename: file.name,
              customer_id: formState.company,
              policy_id: policyId,
              document_type: documentType,
              content_type: file.file.type || 'application/octet-stream',
              operation: "upload"
            });
            
            console.log('Presigned URL response:', data);
            console.log('Using content type for presigned URL:', file.file.type || 'application/octet-stream');
            
            return {
              ...file,
              presignedUrl: data.body.url,
              objectKey: data.body.object_key
            };
          } catch (error) {
            console.error(`Error getting presigned URL for ${file.name}:`, error);
            return {
              ...file,
              error: `Failed to get upload URL: ${error instanceof Error ? error.message : String(error)}`
            };
          }
        })
      );
      
      setUploadedFiles(filesWithUrls);
      return filesWithUrls;
    } catch (err) {
      console.error('Error getting presigned URLs:', err);
      setUploadError(`Failed to prepare upload: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    }
  };
  
  // Modified upload file to S3 function using our specialized service
  const uploadFileToS3WithProgress = async (file: UploadedFile): Promise<boolean> => {
    if (!file.presignedUrl || !file.file) {
      console.error('Missing presigned URL or file data');
      return false;
    }
    
    try {
      // Use our S3 service to handle the upload
      return await uploadFileToS3(
        file.file,
        file.presignedUrl,
        (progress) => {
          // Update progress state
          setUploadProgress(prev => ({
            ...prev,
            [file.id]: progress
          }));
          
          // Update the file's progress
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === file.id ? { ...f, progress } : f
            )
          );
        },
        file.id // Use the file's ID as the upload ID for tracking
      );
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      
      // Update file with error
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id ? { ...f, error: error instanceof Error ? error.message : String(error) } : f
        )
      );
      
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file.');
      return;
    }
    
    setIsSubmitting(true);
    setUploadError(null);
    
    try {
      // Step 1: Get presigned URLs for all files
      const filesWithUrls = await getPresignedUrls();
      
      // Step 2: Upload each file to S3 using its presigned URL
      const uploadResults = await Promise.all(
        filesWithUrls.map(file => uploadFileToS3WithProgress(file))
      );
      
      // Check if all uploads were successful
      const allSuccessful = uploadResults.every(result => result === true);
      
      if (allSuccessful) {
        console.log('All files uploaded successfully');
        setIsSuccess(true);
        
        // Reset form after success
        setTimeout(() => {
          setIsSuccess(false);
          setFormState({
            company: '',
            policy: '',
            documentType: '',
            newPolicyNumber: '',
          });
          setUploadedFiles([]);
          setUploadProgress({});
        }, 3000);
      } else {
        // Some uploads failed
        setUploadError('Some files failed to upload. Please try again.');
      }
    } catch (err) {
      console.error('Error during upload process:', err);
      setUploadError(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefreshCompanies = () => {
    // Clear the specific cache for AMS customers
    clearRequestCache('ams-customers-list');
    // Fetch fresh data
    fetchCompanies();
  };

  // Document type options
  const documentTypeOptions = [
    { value: '', label: 'Select Document Type' },
    { value: 'policy', label: 'Policy/Renewal Document' },
    { value: 'endorsement', label: 'Endorsement' },
    { value: 'quote', label: 'Quote' },
    { value: 'application', label: 'Application' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'other', label: 'Other' }
  ];

  // Transform API companies data to select options
  const companyOptions = [
    { value: '', label: 'Select Company' },
    ...companies.map(company => ({
      value: company.id,
      label: company.name
    }))
  ];

  // Transform API policies data to select options
  const policyOptions = [
    { value: '', label: formState.company ? 'Select Policy' : 'Select Company First' },
    ...policies.map(policy => ({
      value: policy.id,
      label: policy.name
    })),
    { value: 'new_policy', label: 'New Policy' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Upload Document</h1>
        <p className="text-gray-600">
          Upload documents to be processed and managed by Ultron.
        </p>
      </div>

      <Card title="Document Upload">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-600 mb-2">
              Documents Uploaded Successfully
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              The documents have been uploaded to S3 and will be processed shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
                <p className="mb-2">{error}</p>
                <div className="flex space-x-2">
                  <button 
                    type="button" 
                    onClick={fetchCompanies}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            
            {uploadError && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
                <p className="mb-2">{uploadError}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <div className="relative">
                  {isLoading ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                      Loading companies...
                    </div>
                  ) : companies.length === 0 && !error ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                      No companies found
                    </div>
                  ) : (
                    <div className="flex">
                      <div className="flex-grow">
                        <Select
                          id="company"
                          name="company"
                          options={companyOptions}
                          value={formState.company}
                          onChange={handleChange}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRefreshCompanies}
                        disabled={isLoading}
                        className={`ml-2 p-2 rounded ${
                          isLoading 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                        title="Refresh company list"
                      >
                        <RefreshCwIcon size={16} className={isLoading ? 'animate-spin' : ''} />
                      </button>
                    </div>
                  )}
                </div>
                {isLoading && (
                  <p className="text-sm text-gray-500 mt-1">Retrieving companies...</p>
                )}
              </div>
              
              <div>
                <label htmlFor="policy" className="block text-sm font-medium text-gray-700 mb-1">
                  Policy *
                </label>
                {!formState.company ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                    Select a company first
                  </div>
                ) : isPoliciesLoading ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                    Loading policies...
                  </div>
                ) : policies.length === 0 && !policyError ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                    No policies found
                  </div>
                ) : (
                  <div>
                    <Select
                      id="policy"
                      name="policy"
                      options={policyOptions}
                      value={formState.policy}
                      onChange={handleChange}
                      disabled={!formState.company || isPoliciesLoading}
                      required
                    />
                    {formState.policy === 'new_policy' && (
                      <div className="mt-2">
                        <input
                          type="text"
                          id="newPolicyNumber"
                          name="newPolicyNumber"
                          placeholder="Enter new policy number"
                          value={formState.newPolicyNumber}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>
                    )}
                  </div>
                )}
                {isPoliciesLoading && (
                  <p className="text-sm text-gray-500 mt-1">Retrieving policies...</p>
                )}
                {policyError && (
                  <p className="text-sm text-red-500 mt-1">{policyError}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type *
                </label>
                {!formState.company || !formState.policy ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                    Select company and policy first
                  </div>
                ) : (
                  <Select
                    id="documentType"
                    name="documentType"
                    options={documentTypeOptions}
                    value={formState.documentType}
                    onChange={handleChange}
                    disabled={!formState.company || !formState.policy}
                    required
                  />
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Documents *
              </label>
              <FileUpload
                onFilesSelected={handleFilesSelected}
                onFileRemove={handleFileRemove}
                uploadedFiles={uploadedFiles}
                maxFiles={5}
                acceptedFileTypes=".pdf,.doc,.docx,.txt,.xls,.xlsx,image/*"
              />
              
              {/* Display progress bars for files being uploaded */}
              {Object.keys(uploadProgress).length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="flex flex-col">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{file.name}</span>
                        <span>{uploadProgress[file.id] || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress[file.id] || 0}%` }}
                        ></div>
                      </div>
                      {file.error && (
                        <p className="text-sm text-red-500 mt-1">{file.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || isLoading || uploadedFiles.length === 0}
                className={`px-6 py-2 rounded-md text-white font-medium ${
                  isSubmitting || isLoading || uploadedFiles.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Uploading...' : 'Upload Documents'}
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}; 