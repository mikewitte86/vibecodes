import React, { useState } from 'react';
import { XIcon, LoaderIcon, FileTextIcon } from 'lucide-react';
interface DocumentPreviewProps {
  url: string;
  name: string;
  onClose: () => void;
}
export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  url,
  name,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  // For demo, we'll use a sample PDF URL
  const sampleUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">{name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        <div className="flex-1 min-h-0 p-4 relative">
          {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-white">
              <LoaderIcon size={24} className="animate-spin text-blue-600" />
            </div>}
          {error ? <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FileTextIcon size={48} className="mb-2" />
              <p>Unable to preview document</p>
            </div> : <iframe src={sampleUrl} className="w-full h-full border-0" onLoad={() => setIsLoading(false)} onError={() => {
          setIsLoading(false);
          setError(true);
        }} />}
        </div>
      </div>
    </div>;
};