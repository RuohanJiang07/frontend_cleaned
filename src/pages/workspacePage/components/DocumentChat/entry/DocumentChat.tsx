import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent } from '../../../../../components/ui/card';
import { 
  UploadIcon, 
  X, 
  ChevronDownIcon,
  SearchIcon,
  LightbulbIcon,
  UserIcon,
  PlusIcon
} from 'lucide-react';
import DocumentChatResponse from '../response/DocumentChatResponse';

interface DocumentTag {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'other';
}

interface HistoryItem {
  id: string;
  title: string;
  date: string;
  fileCount: number;
}

function DocumentChat() {
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentTag[]>([
    { id: '1', name: 'Introduction to Me...', type: 'pdf' },
    { id: '2', name: 'Cosmology and Its...', type: 'pdf' },
    { id: '3', name: 'NASA ADS Library...', type: 'doc' }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [showResponse, setShowResponse] = useState(false);
  const itemsPerPage = 8;

  // Sample history data
  const historyItems: HistoryItem[] = Array.from({ length: 24 }, (_, i) => ({
    id: (i + 1).toString(),
    title: 'Cosmological Coupling and Black Holes',
    date: 'Jun 1, 9:50 PM',
    fileCount: 8
  }));

  const totalPages = Math.ceil(historyItems.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return historyItems.slice(startIndex, endIndex);
  };

  const removeDocument = (id: string) => {
    setSelectedDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return (
          <div className="w-4 h-4 bg-red-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">PDF</span>
          </div>
        );
      case 'doc':
        return (
          <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">DOC</span>
          </div>
        );
      default:
        return (
          <div className="w-4 h-4 bg-gray-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">FILE</span>
          </div>
        );
    }
  };

  // Get card background color based on column index
  const getCardBackgroundColor = (index: number) => {
    const colors = ['#E5F6FF', '#ECF4F4', '#ECF1F6', '#DEEEFF'];
    return colors[index % 4];
  };

  const handleCreateNewChat = () => {
    setShowResponse(true);
  };

  const handleBackToEntry = () => {
    setShowResponse(false);
  };

  // Show response page if showResponse is true
  if (showResponse) {
    return <DocumentChatResponse onBack={handleBackToEntry} />;
  }

  return (
    <div className="h-full overflow-y-auto">
      <main className="flex-1 p-12 max-w-7xl mx-auto">
        {/* Header with icon and title */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <img
              className="w-12 h-10"
              alt="Hyperknow logo"
              src="/main/landing_page/hyperknow_logo 1.svg"
            />
            <div>
              <h2 className="font-['Outfit',Helvetica] font-medium text-black text-2xl">
                Document Chat
              </h2>
              <p className="font-['Outfit',Helvetica] font-medium text-black text-[13px]">
                answer questions based on your documents
              </p>
            </div>
          </div>
        </div>

        {/* Main content area - constrained to match history width */}
        <div className="w-full max-w-5xl mx-auto mb-6">
          <div className="flex gap-8 relative">
            {/* Upload area - made smaller */}
            <div className="w-[350px]">
              <Card className="w-full h-[200px] border-2 border-dashed border-blue-300 bg-blue-50/30 rounded-lg">
                <CardContent className="flex flex-col items-center justify-center h-full p-6">
                  <UploadIcon className="w-12 h-12 text-gray-400 mb-4" strokeWidth={1.5} />
                  <p className="text-gray-600 font-['Inter',Helvetica] text-base font-medium text-center">
                    Upload or choose your sources to<br />Start Chat
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right panel with selected documents - expanded to fill remaining space */}
            <div className="flex-1">
              <Card className="w-full h-[200px] bg-white rounded-lg border border-[#B3B3B3]">
                <CardContent className="p-4 h-full flex flex-col">
                  {/* Selected documents */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-2 bg-[#ECF1F6] border border-[#88ABFF] rounded-lg px-3 py-1.5"
                      >
                        {getDocumentIcon(doc.type)}
                        <span className="text-sm font-['Inter',Helvetica] text-gray-700">
                          {doc.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-4 h-4 p-0 hover:bg-gray-200 rounded-full"
                          onClick={() => removeDocument(doc.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Bottom controls */}
                  <div className="mt-auto flex items-center justify-start">
                    {/* Profile button - matching Problem Solver style */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-[81px] h-[25px] bg-[#EDF2F7] border-none rounded-lg flex items-center justify-center gap-1 p-0 hover:bg-[#e2e8f0]"
                    >
                      <UserIcon className="w-3 h-3 text-[#6B6B6B]" />
                      <span className="text-[#6B6B6B] font-['Inter',Helvetica] text-xs font-medium">Profile</span>
                      <ChevronDownIcon className="w-3 h-3 text-[#6B6B6B]" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Create New Chat Button Section - much closer to search */}
        <div className="w-full max-w-5xl mx-auto mb-4">
          <div className="flex justify-end">
            <Button 
              className="bg-[#80A5E4] hover:bg-[#6b94d6] text-white rounded-lg px-6 py-2 flex items-center gap-2 font-['Inter',Helvetica] text-sm"
              onClick={handleCreateNewChat}
            >
              <PlusIcon className="w-4 h-4" />
              Create New Chat
            </Button>
          </div>
        </div>

        {/* History section - matching the same max width */}
        <div className="w-full max-w-5xl mx-auto">
          {/* History header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-black font-['Inter',Helvetica] text-xl font-semibold">
              History
            </h2>
            
            <div className="flex items-center gap-2">
              {/* D/A button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-[50px] h-[32px] bg-gray-100 border-none rounded-lg flex items-center justify-center p-0"
              >
                <span className="text-gray-600 font-['Inter',Helvetica] text-xs font-medium">D/A</span>
              </Button>
              
              {/* Sort button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-[32px] bg-gray-100 border-none rounded-lg flex items-center justify-center px-3"
              >
                <span className="text-gray-600 font-['Inter',Helvetica] text-xs font-medium">Sort by Date/Type</span>
              </Button>
              
              {/* Search bar */}
              <div className="w-[200px] h-[32px] bg-gray-100 rounded-lg flex items-center px-3">
                <SearchIcon className="w-4 h-4 text-gray-500" />
                <span className="ml-2 text-gray-500 font-['Inter',Helvetica] text-xs">Search...</span>
              </div>
            </div>
          </div>

          {/* History grid - adjusted card dimensions and spacing */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {getCurrentPageItems().map((item, index) => (
              <Card
                key={item.id}
                className="w-[90%] h-[154px] rounded-lg border-none hover:shadow-md transition-shadow cursor-pointer mx-auto"
                style={{ 
                  backgroundColor: getCardBackgroundColor(index),
                  boxShadow: '0px 3px 60px 1px rgba(72, 111, 207, 0.13)'
                }}
                onClick={handleCreateNewChat}
              >
                <CardContent className="p-4 h-full flex flex-col">
                  {/* Lightbulb icon and file count */}
                  <div className="flex items-center justify-between mb-6">
                    <LightbulbIcon className="w-6 h-6 text-orange-500 fill-orange-500" />
                    <span className="text-xs font-['Inter',Helvetica] text-gray-600">
                      {item.fileCount} Files
                    </span>
                  </div>

                  {/* Title - moved down */}
                  <h3 className="font-['Inter',Helvetica] font-medium text-black text-sm mb-3 line-clamp-2 flex-1">
                    {item.title}
                  </h3>

                  {/* Date - moved down */}
                  <p className="font-['Inter',Helvetica] font-normal text-gray-600 text-xs mt-auto">
                    {item.date}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: Math.min(6, totalPages) }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="outline"
                size="sm"
                className={`w-8 h-8 p-0 font-['Inter',Helvetica] rounded ${
                  page === currentPage
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            {totalPages > 6 && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 bg-white text-gray-600 border-gray-300 font-['Inter',Helvetica] rounded hover:bg-gray-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DocumentChat;