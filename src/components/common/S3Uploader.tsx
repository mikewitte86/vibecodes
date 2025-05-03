import React, { useState, useRef } from 'react';
import { uploadFileToS3 } from '../../services/S3Service';
import { useApiClient } from '../../services/ApiService';
import { AlertCircleIcon, CheckCircleIcon, UploadIcon, Loader2Icon, XIcon } from 'lucide-react';

interface S3UploaderProps {
  customerId: string;
  policyId: string;
  documentType: string;
  onUploadComplete?: (success: boolean, error?: string) => void;
  className?: string;
}

export const S3Uploader: React.FC<S3UploaderProps> = ({
  customerId,
  policyId,
  documentType,
  onUploadComplete,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const apiClient = useApiClient();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      console.log(`Preparing to upload file: ${file.name} (${file.size} bytes, type: ${file.type})`);
      
      // Step 1: Get a presigned URL from the API
      const presignedUrlResponse = await apiClient.getUploadPresignedUrl({
        filename: file.name,
        customer_id: customerId,
        policy_id: policyId,
        document_type: documentType,
        content_type: file.type,
        operation: 'upload'
      });
      
      const presignedUrl = presignedUrlResponse.body.url;
      console.log('Obtained presigned URL:', presignedUrlResponse.body.object_key);
      
      // Step 2: Upload the file directly to S3
      const uploadResult = await uploadFileToS3(
        file,
        presignedUrl,
        (progress) => setUploadProgress(progress)
      );
      
      console.log('Upload completed successfully');
      setUploadSuccess(true);
      setUploadProgress(100);
      
      if (onUploadComplete) {
        onUploadComplete(true);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(`Failed to upload: ${error instanceof Error ? error.message : String(error)}`);
      
      if (onUploadComplete) {
        onUploadComplete(false, error instanceof Error ? error.message : String(error));
      }
    } finally {
      setIsUploading(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearStatus = () => {
    setUploadError(null);
    setUploadSuccess(false);
    setUploadProgress(0);
  };

  return (
    <div className={`s3-uploader ${className}`}>
      <div className="flex flex-col items-center">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
          id="file-upload"
        />
        
        {/* Upload Button */}
        <label
          htmlFor="file-upload"
          className={`
            flex items-center justify-center px-4 py-2 rounded 
            ${isUploading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}
            text-white font-medium text-sm transition-colors
          `}
        >
          {isUploading ? (
            <Loader2Icon size={18} className="mr-2 animate-spin" />
          ) : (
            <UploadIcon size={18} className="mr-2" />
          )}
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </label>
        
        {/* Progress Bar */}
        {(isUploading || uploadSuccess || uploadError) && (
          <div className="w-full mt-4">
            {isUploading && (
              <div className="relative w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            
            {/* Success Message */}
            {uploadSuccess && (
              <div className="flex items-center text-green-600 mt-2">
                <CheckCircleIcon size={16} className="mr-1" />
                <span>Upload completed successfully</span>
                <button 
                  onClick={clearStatus}
                  className="ml-auto text-gray-500 hover:text-gray-700"
                >
                  <XIcon size={16} />
                </button>
              </div>
            )}
            
            {/* Error Message */}
            {uploadError && (
              <div className="flex items-center text-red-600 mt-2">
                <AlertCircleIcon size={16} className="mr-1" />
                <span>{uploadError}</span>
                <button 
                  onClick={clearStatus}
                  className="ml-auto text-gray-500 hover:text-gray-700"
                >
                  <XIcon size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 