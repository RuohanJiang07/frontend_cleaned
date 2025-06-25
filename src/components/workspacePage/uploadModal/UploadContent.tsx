import React, { useRef, useState } from 'react';
import { UploadIcon, FileIcon, X } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  source: 'computer';
}

interface UploadContentProps {
  onFileSelection: (files: UploadedFile[]) => void;
  selectedFiles: UploadedFile[];
}

const UploadContent: React.FC<UploadContentProps> = ({ onFileSelection, selectedFiles }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type || 'unknown',
      source: 'computer'
    }));

    const currentNonComputerFiles = selectedFiles.filter(f => f.source !== 'computer');
    const currentComputerFiles = selectedFiles.filter(f => f.source === 'computer');
    const updatedFiles = [...currentNonComputerFiles, ...currentComputerFiles, ...newFiles];
    onFileSelection(updatedFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = selectedFiles.filter(f => f.id !== fileId);
    onFileSelection(updatedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const computerFiles = selectedFiles.filter(f => f.source === 'computer');

  return (
    <div className="flex flex-col h-full p-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2 font-['Inter',Helvetica]">
          Upload files from your computer
        </h3>
        <p className="text-sm text-gray-600 mb-4 font-['Inter',Helvetica]">
          Drag and drop files here, or click to browse
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-['Inter',Helvetica]"
        >
          Choose Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleFileUpload(e.target.files);
            }
          }}
        />
      </div>

      {/* Uploaded Files List */}
      {computerFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3 font-['Inter',Helvetica]">
            Uploaded Files ({computerFiles.length})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {computerFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 font-['Inter',Helvetica]">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 font-['Inter',Helvetica]">
                      {file.size}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Format Support */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 font-['Inter',Helvetica]">
          Supported formats: PDF, DOC, DOCX, TXT, MD, and more
        </p>
      </div>
    </div>
  );
};

export default UploadContent;