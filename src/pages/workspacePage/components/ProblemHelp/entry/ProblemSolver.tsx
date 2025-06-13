import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/button';
import { 
  ChevronDownIcon, 
  UserIcon, 
  FileTextIcon,
  SearchIcon,
  UploadIcon
} from 'lucide-react';

interface ProblemHistoryItem {
  id: number;
  problem: string;
  date: string;
  type: 'Step-by-step' | 'Solution';
}

function ProblemSolver() {
  const [problemText, setProblemText] = useState('');
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const [selectedMode, setSelectedMode] = useState<'step-by-step' | 'solution'>('step-by-step');
  const [sortBy, setSortBy] = useState('Date/Type');

  // Sample history data
  const historyItems: ProblemHistoryItem[] = [
    {
      id: 1,
      problem: "What's the derivation of x^2",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Step-by-step"
    },
    {
      id: 2,
      problem: "Why does a rainbow contain a pure spread...",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Solution"
    },
    {
      id: 3,
      problem: "Why does a rainbow contain a pure spread...",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Solution"
    },
    {
      id: 4,
      problem: "What's the derivation of x^2",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Step-by-step"
    },
    {
      id: 5,
      problem: "Why does a rainbow contain a pure spread...",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Step-by-step"
    },
    {
      id: 6,
      problem: "Why does a rainbow contain a pure spread...",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Solution"
    },
    {
      id: 7,
      problem: "What's the derivation of x^2",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Step-by-step"
    },
    {
      id: 8,
      problem: "Another problem for testing scroll",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Solution"
    },
    {
      id: 9,
      problem: "More content to test scrolling behavior",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Step-by-step"
    },
    {
      id: 10,
      problem: "Additional problem entry",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Solution"
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(historyItems.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return historyItems.slice(startIndex, endIndex);
  };

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
                Problem Help
              </h2>
              <p className="font-['Outfit',Helvetica] font-medium text-black text-[13px]">
                get step-by-step help for problem sets
              </p>
            </div>
          </div>
        </div>

        {/* Upload area */}
        <div className="flex justify-center mb-6">
          <div className="flex w-[661px] h-[100px] p-6 flex-col justify-center items-center gap-2 border-2 border-dashed border-[#0064A2] bg-[rgba(226,238,252,0.60)] rounded-lg">
            <UploadIcon className="w-9 h-9 text-[#B3B3B3]" strokeWidth={2} />
            <p className="text-[#6B6B6B] text-center font-['Inter',Helvetica] text-sm font-normal leading-5">
              Drag or upload additional context here
            </p>
          </div>
        </div>

        {/* Input box */}
        <div className="flex justify-center relative mt-5">
          <div className="w-[720px] h-36 border border-[#D0DAE4] bg-white rounded-[13px] shadow-[0px_3px_60px_1px_rgba(72,112,208,0.05)] relative">
            <textarea
              className="w-full h-full resize-none bg-transparent outline-none border-none rounded-[13px] p-4 text-[#6B6B6B] font-['Inter',Helvetica] text-base font-medium placeholder:text-[#6B6B6B]"
              placeholder="Paste or type your problem here..."
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
            />
            
            {/* GPT-4o button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute bottom-3 left-3 w-[106px] h-[25px] bg-[rgba(236,241,246,0.63)] border-none rounded-lg flex items-center justify-center gap-1 p-0 hover:bg-[rgba(236,241,246,0.8)]"
            >
              <div className="w-4 h-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8.00033 10.0001C8.55588 10.0001 9.0281 9.80564 9.41699 9.41675C9.80588 9.02786 10.0003 8.55564 10.0003 8.00008C10.0003 7.44453 9.80588 6.9723 9.41699 6.58341C9.0281 6.19453 8.55588 6.00008 8.00033 6.00008C7.44477 6.00008 6.97255 6.19453 6.58366 6.58341C6.19477 6.9723 6.00033 7.44453 6.00033 8.00008C6.00033 8.55564 6.19477 9.02786 6.58366 9.41675C6.97255 9.80564 7.44477 10.0001 8.00033 10.0001ZM8.00033 11.3334C7.0781 11.3334 6.29199 11.0084 5.64199 10.3584C4.99199 9.70841 4.66699 8.9223 4.66699 8.00008C4.66699 7.07786 4.99199 6.29175 5.64199 5.64175C6.29199 4.99175 7.0781 4.66675 8.00033 4.66675C8.92255 4.66675 9.70866 4.99175 10.3587 5.64175C11.0087 6.29175 11.3337 7.07786 11.3337 8.00008C11.3337 8.9223 11.0087 9.70841 10.3587 10.3584C9.70866 11.0084 8.92255 11.3334 8.00033 11.3334ZM3.33366 8.66675H0.666992V7.33341H3.33366V8.66675ZM15.3337 8.66675H12.667V7.33341H15.3337V8.66675ZM7.33366 3.33341V0.666748H8.66699V3.33341H7.33366ZM7.33366 15.3334V12.6667H8.66699V15.3334H7.33366ZM4.26699 5.16675L2.58366 3.55008L3.53366 2.56675L5.13366 4.23341L4.26699 5.16675ZM12.467 13.4334L10.8503 11.7501L11.7337 10.8334L13.417 12.4501L12.467 13.4334ZM10.8337 4.26675L12.4503 2.58341L13.4337 3.53341L11.767 5.13341L10.8337 4.26675ZM2.56699 12.4667L4.25033 10.8501L5.16699 11.7334L3.55033 13.4167L2.56699 12.4667Z" fill="#6B6B6B"/>
                </svg>
              </div>
              <span className="text-[#6B6B6B] font-['Inter',Helvetica] text-xs font-medium">GPT-4o</span>
              <ChevronDownIcon className="w-3 h-3 text-[#6B6B6B]" />
            </Button>

            {/* Mode selection toggle */}
            <div
              className="absolute bottom-3 left-[130px] w-[168px] h-[30px] bg-[#ECF1F6] rounded-[16.5px] flex items-center cursor-pointer"
              onClick={() => setSelectedMode(selectedMode === 'step-by-step' ? 'solution' : 'step-by-step')}
            >
              <div 
                className={`absolute top-1 w-24 h-[22px] bg-white rounded-[14px] transition-all duration-300 ease-in-out z-10 ${
                  selectedMode === 'step-by-step' ? 'left-1.5' : 'left-[66px]'
                }`} 
              />
              <div className="absolute left-4 h-full flex items-center z-20">
                <span className="text-[#6B6B6B] font-['Inter',Helvetica] text-xs font-medium">Step-by-step</span>
              </div>
              <div className="absolute right-3.5 h-full flex items-center z-20">
                <span className="text-[#6B6B6B] font-['Inter',Helvetica] text-xs font-medium">Solution</span>
              </div>
            </div>
            
            {/* Profile selection button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute bottom-3 right-[18px] w-[81px] h-[25px] bg-[#EDF2F7] border-none rounded-lg flex items-center justify-center gap-1 p-0 hover:bg-[#e2e8f0]"
            >
              <UserIcon className="w-3 h-3 text-[#6B6B6B]" />
              <span className="text-[#6B6B6B] font-['Inter',Helvetica] text-xs font-medium">Profile</span>
              <ChevronDownIcon className="w-3 h-3 text-[#6B6B6B]" />
            </Button>
          </div>
        </div>

        {/* History section */}
        <div className="w-full max-w-4xl mx-auto mt-20">
          {/* History header and controls */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-black font-['Inter',Helvetica] text-xl font-medium">
              History
            </h3>
            
            <div className="flex items-center gap-2">
              {/* DA button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-[30px] h-[29px] bg-[#ECF1F6] border-none rounded-lg flex items-center justify-center p-0"
              >
                <span className="text-[#6B6B6B] font-['Inter',Helvetica] text-xs font-medium">DA</span>
              </Button>
              
              {/* Sort button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-[120px] h-[29px] bg-[#ECF1F6] border-none rounded-lg flex items-center justify-center p-0"
              >
                <span className="text-[#6B6B6B] font-['Inter',Helvetica] text-xs font-medium">Date/Type</span>
              </Button>
              
              {/* Search bar */}
              <div className="w-[172px] h-[29px] bg-[#ECF1F6] rounded-lg flex items-center px-2">
                <SearchIcon className="w-4 h-4 text-[#6B6B6B]" />
                <span className="ml-2 text-[#6B6B6B] font-['Inter',Helvetica] text-xs">Search...</span>
              </div>
            </div>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-[#D9D9D9] mb-4 px-2">
            <div className="col-span-6">
              <span className="text-black font-['Inter',Helvetica] text-[15px] font-medium">Problem</span>
            </div>
            <div className="col-span-3">
              <span className="text-black font-['Inter',Helvetica] text-[15px] font-medium">Date</span>
            </div>
            <div className="col-span-3">
              <span className="text-black font-['Inter',Helvetica] text-[15px] font-medium">Type</span>
            </div>
          </div>

          {/* History table */}
          <div className="space-y-0">
            {getCurrentPageItems().map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 py-3 border-b border-[#F0F0F0] hover:bg-[#f9fafb] cursor-pointer transition-colors px-2 min-h-[48px] items-center"
              >
                <div className="col-span-6 flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4 text-black flex-shrink-0" />
                  <span className="text-black font-['Inter',Helvetica] text-sm font-normal leading-5">
                    {item.problem}
                  </span>
                </div>
                <div className="col-span-3 flex items-center">
                  <span className="text-black font-['Inter',Helvetica] text-sm font-normal leading-5">
                    {item.date}
                  </span>
                </div>
                <div className="col-span-3 flex items-center">
                  <span 
                    className={`inline-block px-3 py-1 rounded-xl text-xs font-medium font-['Inter',Helvetica] ${
                      item.type === 'Step-by-step' 
                        ? 'bg-[#dbeafe] text-[#1e40af]' 
                        : 'bg-[#dcfce7] text-[#166534]'
                    }`}
                  >
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="outline"
                size="sm"
                className={`w-8 h-8 p-0 font-['Inter',Helvetica] rounded ${
                  page === currentPage
                    ? 'bg-[#374151] text-white border-[#374151]'
                    : 'bg-white text-[#6b7280] border-[#d1d5db]'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 bg-white text-[#6b7280] border-[#d1d5db] font-['Inter',Helvetica] rounded"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProblemSolver;