import React, { useState } from 'react';
import { FileIcon, XIcon, UploadIcon, FileTextIcon, ImageIcon, FileTypeIcon, AlertCircleIcon } from 'lucide-react';
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  error?: string;
}
interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onFileRemove: (fileId: string) => void;
  uploadedFiles: UploadedFile[];
  maxFiles?: number;
  acceptedFileTypes?: string;
}
export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  onFileRemove,
  uploadedFiles,
  maxFiles = 10,
  acceptedFileTypes = '.pdf,.doc,.docx,.txt,image/*'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }
    onFilesSelected(files);
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }
    onFilesSelected(files);
    e.target.value = ''; // Reset input
  };
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return ImageIcon;
    if (fileType.includes('pdf')) return FileTextIcon;
    return FileIcon;
  };
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  return <div className="space-y-4">
      <div className={`border-2 border-dashed rounded-lg p-6 transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${uploadedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => {
      if (uploadedFiles.length < maxFiles) {
        document.getElementById('file-input')?.click();
      }
    }}>
        <div className="flex flex-col items-center justify-center text-gray-500">
          <UploadIcon size={24} className="mb-2" />
          <p className="text-sm mb-1">
            Drag & drop files here, or click to select files
          </p>
          <p className="text-xs text-gray-400">
            Supported files: PDF, DOC, DOCX, TXT, Images
          </p>
        </div>
        <input id="file-input" type="file" className="hidden" multiple accept={acceptedFileTypes} onChange={handleFileInput} disabled={uploadedFiles.length >= maxFiles} />
      </div>
      {uploadedFiles.length > 0 && <div className="space-y-2">
          {uploadedFiles.map(file => {
        const Icon = getFileIcon(file.type);
        return <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon size={20} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {file.error ? <div className="flex items-center text-red-500 text-sm">
                      <AlertCircleIcon size={16} className="mr-1" />
                      {file.error}
                    </div> : file.progress < 100 ? <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-300" style={{
                width: `${file.progress}%`
              }} />
                    </div> : <span className="text-green-500 text-sm">Uploaded</span>}
                  <button onClick={e => {
              e.stopPropagation();
              onFileRemove(file.id);
            }} className="text-gray-400 hover:text-gray-600">
                    <XIcon size={16} />
                  </button>
                </div>
              </div>;
      })}
        </div>}
    </div>;
};