import * as React from "react";
import { UploadCloud } from "lucide-react";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  label?: string;
  description?: string;
  acceptedTypes?: string;
  selectedFile?: File | null;
}

export function FileDropzone({
  onFileSelect,
  label = "Drag & drop files here, or click to select files",
  description = "Supported files: PDF, DOC, DOCX",
  acceptedTypes = "",
  selectedFile,
}: FileDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl w-full h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition relative"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
        <div className="text-gray-500">{label}</div>
        <div className="text-xs text-gray-400 mt-1">{description}</div>
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      {selectedFile && (
        <div className="text-sm text-gray-700 mt-2">
          Selected file: {selectedFile.name}
        </div>
      )}
    </div>
  );
}
