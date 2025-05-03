import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Table } from '../common/Table';
import { FileIcon, ArrowLeftIcon, ExternalLinkIcon, Loader2Icon, MessageSquareIcon } from 'lucide-react';
import { DocumentChatModal } from './DocumentChatModal';
import { useApiClient } from '../../services/ApiService';

interface Document {
  id: string;
  document_type: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
  key: string;
  bucket: string;
  has_analysis: boolean;
}

interface Column<T> {
  key: keyof T;
  header: string;
  sortable: boolean;
  render?: (value: any, rowData?: T) => React.ReactNode;
}

interface CustomerDocumentsProps {
  customerId: string;
  customerName: string;
  onBack: () => void;
}

export const CustomerDocuments: React.FC<CustomerDocumentsProps> = ({
  customerId,
  customerName,
  onBack
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [loadingDocumentId, setLoadingDocumentId] = useState<string | null>(null);
  const [chatDocumentId, setChatDocumentId] = useState<string | null>(null);
  const [chatDocumentName, setChatDocumentName] = useState<string>('');
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const { getIdToken } = useAuth();
  const apiClient = useApiClient();

  useEffect(() => {
    fetchDocuments();
  }, [customerId]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.fetchCustomerDocuments(customerId);
      console.log('Documents data:', data);
      
      // Extract documents from the nested response structure
      const documentsList = data.body?.documents || [];
      setDocuments(documentsList);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(`Failed to load documents: ${err instanceof Error ? err.message : String(err)}`);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPresignedUrl = async (documentId: string, bucket: string, key: string) => {
    setLoadingDocumentId(documentId);
    
    try {
      // Request a presigned URL for viewing the document
      const data = await apiClient.getDocumentPresignedUrl({
        bucket,
        key,
        operation: 'download'
      });
      
      console.log('Presigned URL response:', data);
      
      // Open the presigned URL in a new tab
      if (data.body?.url) {
        window.open(data.body.url, '_blank');
      } else {
        throw new Error('No presigned URL returned from API');
      }
    } catch (err) {
      console.error('Error getting presigned URL:', err);
      alert(`Failed to view document: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoadingDocumentId(null);
    }
  };

  const openChatModal = (document: Document) => {
    setChatDocumentId(document.id);
    setChatDocumentName(getDocumentFileName(document.key));
    setIsChatModalOpen(true);
  };

  const closeChatModal = () => {
    setIsChatModalOpen(false);
    setChatDocumentId(null);
  };

  const getDocumentFileName = (key: string): string => {
    // Extract just the filename from the full S3 key
    const parts = key.split('/');
    return parts[parts.length - 1];
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDocumentType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ');
  };

  const sortedDocuments = [...documents].sort((a, b) => {
    if (sortField === 'created_at') {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    } else if (sortField === 'document_type') {
      return sortDirection === 'asc' 
        ? a.document_type.localeCompare(b.document_type) 
        : b.document_type.localeCompare(a.document_type);
    } else if (sortField === 'size_bytes') {
      return sortDirection === 'asc' 
        ? a.size_bytes - b.size_bytes 
        : b.size_bytes - a.size_bytes;
    }
    return 0;
  });

  const columns: Column<Document>[] = [
    {
      key: 'document_type',
      header: 'Type',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <FileIcon size={16} className="text-blue-600" />
          <span>{formatDocumentType(value)}</span>
        </div>
      )
    },
    {
      key: 'mime_type',
      header: 'Format',
      sortable: true
    },
    {
      key: 'size_bytes',
      header: 'Size',
      sortable: true,
      render: (value: number) => <span>{formatBytes(value)}</span>
    },
    {
      key: 'created_at',
      header: 'Uploaded',
      sortable: true,
      render: (value: string) => <span>{formatDate(value)}</span>
    },
    {
      key: 'has_analysis',
      header: 'Analyzed',
      sortable: true,
      render: (value: boolean, rowData?: Document) => (
        <div>
          <span 
            className={`px-2 py-1 text-xs rounded-full ${
              value ? 'bg-green-100 text-green-800 cursor-pointer hover:bg-green-200' : 'bg-gray-100 text-gray-800'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (value && rowData) {
                openChatModal(rowData);
              }
            }}
          >
            {value ? 'Yes' : 'No'}
            {value && <MessageSquareIcon size={12} className="inline ml-1" />}
          </span>
        </div>
      )
    },
    {
      key: 'id',
      header: 'Actions',
      sortable: false,
      render: (value: string, rowData?: Document) => {
        if (!rowData) return null;
        
        return (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              getPresignedUrl(rowData.id, rowData.bucket, rowData.key);
            }}
            disabled={loadingDocumentId === rowData.id}
            className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {loadingDocumentId === rowData.id ? (
              <>
                <Loader2Icon size={14} className="animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>View</span>
                <ExternalLinkIcon size={14} />
              </>
            )}
          </button>
        );
      }
    }
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          <span>Back to Customers</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Documents for {customerName}</h1>
        <p className="text-gray-600">
          View and manage documents for this customer.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
          <p className="mb-2">{error}</p>
          <button 
            onClick={fetchDocuments}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm"
          >
            Retry
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading documents...
          </div>
        ) : documents.length === 0 && !error ? (
          <div className="p-8 text-center text-gray-500">
            No documents found for this customer
          </div>
        ) : (
          <Table 
            data={sortedDocuments}
            columns={columns}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        )}
      </div>

      {chatDocumentId && (
        <DocumentChatModal
          documentId={chatDocumentId}
          documentName={chatDocumentName}
          onClose={closeChatModal}
          isOpen={isChatModalOpen}
        />
      )}
    </div>
  );
}; 