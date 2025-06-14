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
            <div className="w-[300px]">
              <Card className="w-full h-[154px] border-2 border-[#0064A2] bg-[rgba(226,238,252,0.60)] rounded-lg shadow-[0px_3px_30px_0px_rgba(72,112,208,0.05)] [border-style:dashed] [border-width:2px] [border-spacing:6px] [border-dash-pattern:6px_6px]">
                <CardContent className="flex flex-col items-center justify-center h-full p-6">
                  <div className="w-10 h-10 flex-shrink-0 mb-4">
                    <svg 
                      className="w-full h-full" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 40 40" 
                      fill="none"
                    >
                      <path 
                        d="M26.6671 26.6667L20.0004 20.0001M20.0004 20.0001L13.3338 26.6667M20.0004 20.0001L20.0004 35.0001M33.9838 30.6501C35.6093 29.7638 36.8935 28.3615 37.6335 26.6644C38.3736 24.9673 38.5274 23.0721 38.0708 21.2779C37.6141 19.4836 36.5729 17.8926 35.1115 16.7558C33.6502 15.619 31.8519 15.0013 30.0004 15.0001H27.9004C27.3959 13.0488 26.4557 11.2373 25.1503 9.70171C23.845 8.16614 22.2085 6.94647 20.3639 6.1344C18.5193 5.32233 16.5147 4.93899 14.5006 5.01319C12.4866 5.0874 10.5155 5.61722 8.73572 6.56283C6.9559 7.50844 5.41361 8.84523 4.22479 10.4727C3.03598 12.1002 2.23157 13.9759 1.87206 15.959C1.51254 17.9421 1.60726 19.9809 2.14911 21.9222C2.69096 23.8634 3.66583 25.6565 5.00042 27.1667" 
                        stroke="#B3B3B3" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="w-[224px] text-[#6D6D6D] text-center font-['Inter'] text-sm font-normal leading-5 tracking-normal">
                    Upload or choose your sources to start chat
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right panel with selected documents - expanded to fill remaining space */}
            <div className="w-[505px] flex-shrink-0">
              <Card className="w-full h-[154px] bg-white rounded-lg border border-[#B3B3B3] shadow-[0px_3px_60px_1px_rgba(2,119,189,0.05)]">
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
                  <div className="mt-auto flex items-center justify-end">
                    {/* Profile button */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-[81px] h-[26px] bg-[#ECF1F6] border-none rounded-lg flex items-center justify-center gap-1 p-0 hover:bg-[#e2e8f0]"
                    >
                      <svg 
                        className="w-[18px] h-[19px] flex-shrink-0" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 18 19" 
                        fill="none"
                      >
                        <path 
                          d="M9 9.50008C8.175 9.50008 7.46875 9.19001 6.88125 8.56987C6.29375 7.94973 6 7.20425 6 6.33341C6 5.46258 6.29375 4.7171 6.88125 4.09696C7.46875 3.47682 8.175 3.16675 9 3.16675C9.825 3.16675 10.5312 3.47682 11.1187 4.09696C11.7062 4.7171 12 5.46258 12 6.33341C12 7.20425 11.7062 7.94973 11.1187 8.56987C10.5312 9.19001 9.825 9.50008 9 9.50008ZM3 15.8334V13.6167C3 13.1681 3.10937 12.7558 3.32812 12.3798C3.54688 12.0037 3.8375 11.7167 4.2 11.5188C4.975 11.1098 5.7625 10.803 6.5625 10.5985C7.3625 10.394 8.175 10.2917 9 10.2917C9.825 10.2917 10.6375 10.394 11.4375 10.5985C12.2375 10.803 13.025 11.1098 13.8 11.5188C14.1625 11.7167 14.4531 12.0037 14.6719 12.3798C14.8906 12.7558 15 13.1681 15 13.6167V15.8334H3ZM4.5 14.2501H13.5V13.6167C13.5 13.4716 13.4656 13.3397 13.3969 13.2209C13.3281 13.1022 13.2375 13.0098 13.125 12.9438C12.45 12.5876 11.7688 12.3204 11.0813 12.1423C10.3938 11.9641 9.7 11.8751 9 11.8751C8.3 11.8751 7.60625 11.9641 6.91875 12.1423C6.23125 12.3204 5.55 12.5876 4.875 12.9438C4.7625 13.0098 4.67188 13.1022 4.60313 13.2209C4.53438 13.3397 4.5 13.4716 4.5 13.6167V14.2501ZM9 7.91675C9.4125 7.91675 9.76563 7.76171 10.0594 7.45164C10.3531 7.14157 10.5 6.76883 10.5 6.33341C10.5 5.898 10.3531 5.52525 10.0594 5.21519C9.76563 4.90512 9.4125 4.75008 9 4.75008C8.5875 4.75008 8.23438 4.90512 7.94063 5.21519C7.64688 5.52525 7.5 5.898 7.5 6.33341C7.5 6.76883 7.64688 7.14157 7.94063 7.45164C8.23438 7.76171 8.5875 7.91675 9 7.91675Z" 
                          fill="#79747E"
                        />
                      </svg>
                      <span className="text-[#6B6B6B] font-['Inter',Helvetica] text-xs font-medium">Profile</span>
                      <svg 
                        className="w-[9px] h-[10px] flex-shrink-0" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 9 10" 
                        fill="none"
                      >
                        <g opacity="0.3">
                          <path 
                            d="M2.25 3.75L4.5 6.25L6.75 3.75" 
                            stroke="#757575" 
                            strokeWidth="1.6" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </g>
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Create New Chat Button Section */}
        <div className="w-full max-w-5xl mx-auto mb-4">
          <div className="flex justify-end">
            <Button 
              className="w-[132px] h-[28px] flex-shrink-0 bg-[#80A5E4] hover:bg-[#6b94d6] text-white rounded-[8px] flex items-center justify-center gap-2 font-['Inter'] text-[13px] font-semibold leading-normal shadow-[0px_1px_4px_rgba(0,0,0,0.05)]"
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