import React, { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../components/ui/avatar';
import {
  SearchIcon,
  ChevronDownIcon,
  PlusIcon,
  UploadIcon,
  EditIcon,
  TrashIcon,
  MoreHorizontalIcon,
  FolderIcon,
  FileTextIcon,
  FileIcon,
  ImageIcon,
  ChevronRightIcon
} from 'lucide-react';
import { getDriveFiles, DriveFileItem } from '../../../../api/workspaces/drive/getFiles';
import { uploadFileWithProgress } from '../../../../api/workspaces/drive/uploadFiles';
import { useToast } from '../../../../hooks/useToast';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'pdf' | 'image' | 'note' | 'spreadsheet' | 'presentation';
  dateCreated: string;
  lastModified: string;
  size: string;
  owner: string;
  ownerAvatar: string;
  parent_id: string;
  processed?: {
    text_extracted: {
      done: boolean;
      output_directory: string;
    };
    embeddings_generated: {
      done: boolean;
      output_directory: string;
    };
  };
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface DriveProps {
  onBack?: () => void;
}

function Drive({ onBack }: DriveProps) {
  const { error } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('By Name');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [workspaceName, setWorkspaceName] = useState('');
  const [statistics, setStatistics] = useState({
    total_items: 0,
    file_count: 0,
    folder_count: 0
  });
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  // Ref for file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load drive files on component mount
  useEffect(() => {
    loadDriveFiles();
  }, []);

  const loadDriveFiles = async () => {
    try {
      setLoading(true);
      const response = await getDriveFiles();
      
      if (response.success) {
        // Convert DriveFileItem[] to FileItem[]
        const convertedFiles = response.drive_files.items.map(convertDriveFileToFileItem);
        setFiles(convertedFiles);
        setWorkspaceName(response.workspace_name);
        setStatistics(response.statistics);
        
        // Initialize breadcrumbs with My Drive and workspace name
        // Only include workspace name, not My Drive
        setBreadcrumbs([{ id: 'root', name: response.workspace_name }]);
        
        console.log('📁 Loaded drive files for Drive component:', response.drive_files.items.length, 'items');
      } else {
        error('Failed to load drive files');
        setFiles([]);
      }
    } catch (err) {
      console.error('Error loading drive files:', err);
      error('Failed to load drive files. Please try again.');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  // Convert DriveFileItem to FileItem format
  const convertDriveFileToFileItem = (driveFile: DriveFileItem): FileItem => {
    // Map file_type to our type system
    const mapFileType = (type: 'file' | 'folder', fileType?: string): FileItem['type'] => {
      if (type === 'folder') return 'folder';
      
      if (!fileType) return 'document';
      
      const lowerFileType = fileType.toLowerCase();
      switch (lowerFileType) {
        case 'pdf':
          return 'pdf';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'svg':
          return 'image';
        case 'doc':
        case 'docx':
          return 'document';
        case 'txt':
        case 'md':
          return 'note';
        case 'xls':
        case 'xlsx':
          return 'spreadsheet';
        case 'ppt':
        case 'pptx':
          return 'presentation';
        default:
          return 'document';
      }
    };

    // Format date
    const formatDate = (dateString?: string) => {
      if (!dateString) return 'Unknown date';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return 'Unknown date';
      }
    };

    // Generate a size placeholder (API doesn't provide size)
    const generateSize = (type: 'file' | 'folder') => {
      if (type === 'folder') return '—';
      // Generate random realistic file sizes
      const sizes = ['1.2 MB', '856 KB', '3.4 MB', '12.8 KB', '45.6 MB', '234 KB', '1.8 GB'];
      return sizes[Math.floor(Math.random() * sizes.length)];
    };

    return {
      id: driveFile.id,
      name: driveFile.name,
      type: mapFileType(driveFile.type, driveFile.file_type),
      dateCreated: formatDate(driveFile.uploaded_at),
      lastModified: formatDate(driveFile.uploaded_at),
      size: generateSize(driveFile.type),
      owner: 'John Doe', // Placeholder - API doesn't provide owner info
      ownerAvatar: '/main/landing_page/avatars.png',
      processed: driveFile.processed,
      parent_id: driveFile.parent_id
    };
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        console.log(`🚀 Starting upload for file: ${file.name} to folder: ${currentFolderId}`);
        
        await uploadFileWithProgress(
          file,
          (progressData) => {
            console.log(`📊 Upload progress for ${file.name}:`, progressData);
          },
          (errorMsg) => {
            console.error(`❌ Upload failed for ${file.name}:`, errorMsg);
            error(`Upload failed for ${file.name}: ${errorMsg}`);
          },
          (fileId) => {
            console.log(`✅ Upload completed for ${file.name}, fileId: ${fileId}`);
            
            // Add the new file to the files list with processed set to false
            const newFile: FileItem = {
              id: fileId,
              name: file.name,
              type: mapFileTypeToItemType(file.type),
              dateCreated: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              lastModified: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              size: formatFileSize(file.size),
              owner: 'John Doe',
              ownerAvatar: '/main/landing_page/avatars.png',
              parent_id: currentFolderId,
              processed: {
                text_extracted: {
                  done: false,
                  output_directory: ''
                },
                embeddings_generated: {
                  done: false,
                  output_directory: ''
                }
              }
            };
            
            setFiles(prev => [...prev, newFile]);
            
            // Refresh the file list
            loadDriveFiles();
          },
          currentFolderId === 'root' ? undefined : currentFolderId
        );
      } catch (err) {
        console.error(`❌ Upload error for ${file.name}:`, err);
        error(`Failed to upload ${file.name}`);
      }
    }
  };

  // Helper function to map MIME type to FileItem type
  const mapFileTypeToItemType = (mimeType: string): FileItem['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'document';
    if (mimeType === 'text/plain') return 'note';
    return 'document';
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter files based on search query and current folder
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    file.parent_id === currentFolderId
  );

  // Handle folder navigation
  const handleFolderClick = (folder: FileItem) => {
    if (folder.type !== 'folder') return;
    
    // Add current folder to breadcrumbs
    setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
    setCurrentFolderId(folder.id);
  };

  // Navigate to a specific breadcrumb
  const navigateToBreadcrumb = (targetId: string) => {
    // Find the index of the target breadcrumb
    // Only allow navigation to workspace level (root) or below
    if (targetId !== 'my-drive') {
      const targetIndex = breadcrumbs.findIndex(item => item.id === targetId);
      if (targetIndex === -1) return;

      // Update breadcrumbs to only include items up to and including the target
      setBreadcrumbs(prev => prev.slice(0, targetIndex + 1));
      
      // Set the current folder ID
      setCurrentFolderId(targetId);
    }
  };

  const getFileIcon = (type: string) => {
    // First handle folder type
    if (type === 'folder') {
      return <FolderIcon className="w-5 h-5 text-blue-600" />;
    }
    
    // Map file types to icon names (handle specific mappings)
    const getIconName = (type: string) => {
      switch (type) {
        case 'pdf':
          return 'pdf';
        case 'note':
        case 'document':
          return 'txt';
        case 'presentation':
          return 'ppt';
        case 'image':
          return 'image';
        case 'spreadsheet':
          return 'spreadsheet';
        case 'epub':
          return 'epub';
        default:
          // Try to determine icon based on file extension
          const fileExtension = getFileExtension(type);
          if (fileExtension === 'pdf') return 'pdf';
          if (fileExtension === 'txt' || fileExtension === 'doc' || fileExtension === 'docx') return 'txt';
          if (fileExtension === 'ppt' || fileExtension === 'pptx') return 'ppt';
          if (fileExtension === 'md') return 'md';
          if (fileExtension === 'epub') return 'epub';
          return 'file';
      }
    };
    
    const iconName = getIconName(type);
    const iconPath = `/workspace/fileIcons/${iconName}.svg`;
    
    // Check if we have a specific icon for this file type
    if (['pdf', 'txt', 'ppt', 'md', 'epub'].includes(iconName)) {
      return (
        <img 
          src={iconPath} 
          alt={`${type} file`} 
          className="w-5 h-5"
          onError={(e) => {
            // Fallback to Lucide icons if SVG fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const fallbackIcon = document.createElement('span');
              fallbackIcon.innerHTML = `<svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
              parent.appendChild(fallbackIcon);
            }
          }}
        />
      );
    }
    
    // Default icons for types without specific SVG files
    if (type === 'image') return <ImageIcon className="w-5 h-5 text-green-600" />;
    if (type === 'spreadsheet') return <FileIcon className="w-5 h-5 text-green-600" />;
    
    // Final fallback
    return <FileIcon className="w-5 h-5 text-gray-600" />;
  };

  // Helper function to extract file extension from a string
  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-[180px] bg-white border-r border-gray-200 flex flex-col">
        {/* New and Upload buttons */}
        <div className="p-4 space-y-2">
          <Button className="w-full h-10 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 font-['Inter',Helvetica] text-sm">
            <PlusIcon className="w-4 h-4" />
            New
          </Button>
          <Button 
            className="w-full h-10 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 font-['Inter',Helvetica] text-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className="w-4 h-4" />
            Upload
          </Button>
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

        {/* Navigation Menu */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-black bg-gray-100 rounded-lg font-['Inter',Helvetica]">
              <FolderIcon className="w-4 h-4" />
              Workspace Drive
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer font-['Inter',Helvetica]">
              <FileIcon className="w-4 h-4" />
              Recent
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer font-['Inter',Helvetica]">
              <FileIcon className="w-4 h-4" />
              Starred
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer font-['Inter',Helvetica]">
              <FileIcon className="w-4 h-4" />
              Shared
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer font-['Inter',Helvetica]">
              <FileIcon className="w-4 h-4" />
              Trash
            </div>
          </div>
        </nav>

        {/* Storage indicator - Updated with real statistics */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-600 font-['Inter',Helvetica] mb-2">Storage</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '4.15%' }}></div>
          </div>
          <div className="text-xs text-gray-500 font-['Inter',Helvetica]">
            {statistics.total_items} items • 0.83 GB of 20 GB used
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Header with icon and title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-yellow-400 to-green-400 rounded-lg flex items-center justify-center">
                <FolderIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-black text-xl font-['Inter',Helvetica]">
                  Workspace Drive
                </h1>
                <p className="text-sm text-gray-600 font-['Inter',Helvetica]">
                  {workspaceName ? `${workspaceName} - ` : ''}all files enabled with smart assistant
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb and controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 font-['Inter',Helvetica]">
              {/* Clickable Breadcrumb Navigation */}
              <div className="flex items-center">
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={breadcrumb.id}>
                    {breadcrumb.id === 'my-drive' ? (
                      <span className="text-gray-900 font-medium">
                        {breadcrumb.name}
                      </span>
                    ) : (
                      <button
                        onClick={() => navigateToBreadcrumb(breadcrumb.id)}
                        className={`hover:text-blue-600 transition-colors ${
                          index === breadcrumbs.length - 1 
                            ? 'text-gray-900 font-medium cursor-default' 
                            : 'text-blue-600 hover:underline'
                        }`}
                        disabled={index === breadcrumbs.length - 1}
                      >
                        {breadcrumb.name}
                      </button>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search bar */}
              <div className="relative w-[280px]">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for files..."
                  className="w-full h-9 pl-10 pr-4 border border-gray-300 rounded-lg text-sm font-['Inter',Helvetica] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Sort dropdown */}
              <Button
                variant="outline"
                className="h-9 px-3 border-gray-300 rounded-lg flex items-center gap-2 font-['Inter',Helvetica] text-sm"
              >
                <span className="text-gray-700">{sortBy}</span>
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              </Button>

              {/* New button */}
              <Button className="h-9 px-3 bg-black text-white rounded-lg flex items-center gap-2 font-['Inter',Helvetica] text-sm hover:bg-gray-800">
                <PlusIcon className="w-4 h-4" />
                New
              </Button>

              {/* Upload button */}
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-9 px-3 border-gray-300 rounded-lg flex items-center gap-2 font-['Inter',Helvetica] text-sm"
              >
                <UploadIcon className="w-4 h-4" />
                Upload
              </Button>
            </div>
          </div>
        </div>

        {/* File Table */}
        <div className="flex-1 bg-white overflow-auto">
          <div className="w-full">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 sticky top-0">
              <div className="col-span-4">
                <span className="font-medium text-gray-700 text-sm font-['Inter',Helvetica]">Name</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-700 text-sm font-['Inter',Helvetica]">Date Created</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-700 text-sm font-['Inter',Helvetica]">Last Modified</span>
              </div>
              <div className="col-span-1">
                <span className="font-medium text-gray-700 text-sm font-['Inter',Helvetica]">Size</span>
              </div>
              <div className="col-span-3">
                <span className="font-medium text-gray-700 text-sm font-['Inter',Helvetica]">Owner</span>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 font-['Inter',Helvetica]">Loading files...</span>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredFiles.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FolderIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-['Inter',Helvetica] mb-2">
                    {searchQuery 
                      ? 'No files found matching your search' 
                      : currentFolderId !== 'root' 
                        ? 'This folder is empty' 
                        : 'No files in this workspace'}
                  </p>
                  <p className="text-sm text-gray-400 font-['Inter',Helvetica]">
                    {searchQuery 
                      ? 'Try adjusting your search query' 
                      : 'Upload files to get started'}
                  </p>
                </div>
              </div>
            )}

            {/* Table rows */}
            {!loading && filteredFiles.length > 0 && (
              <div className="divide-y divide-gray-100">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-gray-50 transition-colors group cursor-pointer"
                    onClick={() => file.type === 'folder' && handleFolderClick(file)}
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-900 text-sm font-['Inter',Helvetica] truncate block">
                          {file.name}
                        </span>
                        {file.type === 'folder' && (
                          <span className="text-xs text-blue-500 font-['Inter',Helvetica]">
                            Click to open
                          </span>
                        )}
                        {/* Show processing status if available */}
                        {file.processed && (
                          <div className="flex items-center gap-1 mt-1">
                            <div className={`w-3 h-3 rounded-full ${
                              file.processed.text_extracted.done ? 'bg-green-400' : 'bg-gray-300'
                            }`} title={file.processed.text_extracted.done ? 'Text extracted' : 'Text extraction pending'}>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${
                              file.processed.embeddings_generated.done ? 'bg-green-400' : 'bg-gray-300'
                            }`} title={file.processed.embeddings_generated.done ? 'Embeddings generated' : 'Embeddings pending'}>
                            </div>
                            <span className="text-xs text-gray-500 ml-1">
                              {file.processed.text_extracted.done && file.processed.embeddings_generated.done 
                                ? 'Processed' 
                                : 'Processing...'}
                            </span>
                          </div>
                        )}
                        {file.type === 'note' && (
                          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-['Inter',Helvetica] mt-1">
                            Note
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span className="text-gray-600 text-sm font-['Inter',Helvetica]">
                        {file.dateCreated}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span className="text-gray-600 text-sm font-['Inter',Helvetica]">
                        {file.lastModified}
                      </span>
                    </div>
                    <div className="col-span-1 flex items-center">
                      <span className="text-gray-600 text-sm font-['Inter',Helvetica]">
                        {file.size}
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={file.ownerAvatar} alt={file.owner} />
                          <AvatarFallback className="text-xs">
                            {file.owner.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-gray-600 text-sm font-['Inter',Helvetica]">
                          {file.owner}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-gray-600"
                          onClick={(e) => e.stopPropagation()} // Prevent folder navigation when clicking buttons
                        >
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-600"
                          onClick={(e) => e.stopPropagation()} // Prevent folder navigation when clicking buttons
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-gray-600"
                          onClick={(e) => e.stopPropagation()} // Prevent folder navigation when clicking buttons
                        >
                          <MoreHorizontalIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Drive;