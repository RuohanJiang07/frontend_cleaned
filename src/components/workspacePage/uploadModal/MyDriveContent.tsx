import React, { useState } from 'react';
import { Search, FolderIcon, FileTextIcon, CheckIcon } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  lastModified: string;
  processStatus?: 'processed' | 'processing' | null;
  source: 'drive';
}

interface MyDriveContentProps {
  onFileSelection: (files: FileItem[]) => void;
  selectedFiles: FileItem[];
}

const MyDriveContent: React.FC<MyDriveContentProps> = ({ onFileSelection, selectedFiles }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState('My Drive / PHYS2801');

  // Sample file data based on the image
  const files: FileItem[] = [
    {
      id: '1',
      name: 'Lec 1',
      type: 'folder',
      lastModified: '12:56 PM',
      source: 'drive'
    },
    {
      id: '2',
      name: "Newton's Laws",
      type: 'file',
      lastModified: '12:56 PM',
      processStatus: 'processed',
      source: 'drive'
    },
    {
      id: '3',
      name: "Newton's Laws",
      type: 'file',
      lastModified: 'May 12',
      source: 'drive'
    },
    {
      id: '4',
      name: "Newton's Laws",
      type: 'file',
      lastModified: '12:56 PM',
      processStatus: 'processed',
      source: 'drive'
    },
    {
      id: '5',
      name: "Newton's Laws",
      type: 'file',
      lastModified: 'May 12',
      source: 'drive'
    },
    {
      id: '6',
      name: "Newton's Laws",
      type: 'file',
      lastModified: '12:56 PM',
      source: 'drive'
    },
    {
      id: '7',
      name: "Newton's Laws",
      type: 'file',
      lastModified: '12:56 PM',
      source: 'drive'
    },
    {
      id: '8',
      name: "Newton's Laws",
      type: 'file',
      lastModified: 'May 12',
      source: 'drive'
    }
  ];

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSelected = (fileId: string) => {
    return selectedFiles.some(f => f.id === fileId);
  };

  const toggleFileSelection = (file: FileItem) => {
    const currentSelected = selectedFiles.filter(f => f.source !== 'drive');
    const driveSelected = selectedFiles.filter(f => f.source === 'drive');
    
    if (isSelected(file.id)) {
      const newSelected = [...currentSelected, ...driveSelected.filter(f => f.id !== file.id)];
      onFileSelection(newSelected);
    } else {
      const newSelected = [...currentSelected, ...driveSelected, file];
      onFileSelection(newSelected);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm font-['Inter',Helvetica] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-4 py-2 text-sm text-gray-600 font-['Inter',Helvetica] border-b border-gray-100">
        {currentPath}
      </div>

      {/* File List Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700 font-['Inter',Helvetica]">
        <div className="col-span-6">File name</div>
        <div className="col-span-3 text-center">Last Modified</div>
        <div className="col-span-3 text-center">Process Status</div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => toggleFileSelection(file)}
            className={`grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
              isSelected(file.id) ? 'bg-blue-50' : ''
            }`}
          >
            <div className="col-span-6 flex items-center gap-3">
              {file.type === 'folder' ? (
                <FolderIcon className="w-5 h-5 text-blue-600" />
              ) : (
                <FileTextIcon className="w-5 h-5 text-gray-600" />
              )}
              <span className="text-sm text-gray-900 font-['Inter',Helvetica]">
                {file.name}
              </span>
            </div>
            <div className="col-span-3 flex items-center justify-center">
              <span className="text-sm text-gray-600 font-['Inter',Helvetica]">
                {file.lastModified}
              </span>
            </div>
            <div className="col-span-3 flex items-center justify-center">
              {file.processStatus === 'processed' ? (
                <div className="flex items-center gap-1 text-blue-600">
                  <CheckIcon className="w-4 h-4" />
                  <span className="text-sm font-['Inter',Helvetica]">Processed</span>
                </div>
              ) : isSelected(file.id) ? (
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <CheckIcon className="w-3 h-3 text-white" />
                </div>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDriveContent;