import React from 'react';
import './DocumentChatResponse.css';

interface DocumentChatResponseProps {
  isSplit?: boolean;
  onBack?: () => void;
}

const DocumentChatResponse: React.FC<DocumentChatResponseProps> = ({ isSplit = false, onBack }) => {
  const handleBackClick = () => {
    // Navigate back to document chat entry page
    onBack?.();
  };

  return (
    <div className="document-chat-response">
      {/* Header Section */}
      <header className="flex items-center justify-between h-[53px] w-full px-4">
        {/* Left-aligned elements */}
        <div className="flex items-center">
          {/* Back Arrow */}
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center w-[22px] h-[22px] mr-[10px]"
            aria-label="Go back to document chat entry"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M17.4168 10.9999H4.5835M4.5835 10.9999L11.0002 17.4166M4.5835 10.9999L11.0002 4.58325" 
                stroke="#00276C" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Conversation Title */}
          <h1 className="text-[#00276C] font-[-apple-system,BlinkMacSystemFont,'SF_Pro','Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[18px] font-[590] leading-normal mr-[11px]">
            Papers Regarding Black Hole Information Paradox
          </h1>

          {/* Conversation Tag */}
          <div className="flex items-center justify-center w-[91px] h-[22px] bg-[#EBEDF4] rounded-[5px]">
            <span className="text-[#00276C] text-center font-[-apple-system,BlinkMacSystemFont,'SF_Pro','Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[13px] font-[510] leading-normal">
              Conversation
            </span>
          </div>
        </div>

        {/* Right-aligned elements */}
        <div className="flex items-center gap-[14px]">
          {/* Share Icon */}
          <button
            className="flex items-center justify-center w-[20px] h-[20px]"
            aria-label="Share conversation"
          >
            <img
              src="/workspace/share.svg"
              alt="Share"
              className="w-[20px] h-[20px]"
            />
          </button>

          {/* Print Icon */}
          <button
            className="flex items-center justify-center w-[18px] h-[18px]"
            aria-label="Print conversation"
          >
            <img
              src="/workspace/print.svg"
              alt="Print"
              className="w-[18px] h-[18px]"
            />
          </button>

          {/* Publish to Community Button */}
          <button
            className="flex items-center h-[28px] px-[12px] py-[5px] bg-[#4C6694] rounded-[6px] gap-[10px] transition-all duration-200 ease-in-out hover:bg-[#3d5a7a] hover:shadow-[0px_2px_8px_rgba(76,102,148,0.25)]"
            aria-label="Publish to community"
          >
            <img
              src="/workspace/publish.svg"
              alt="Publish"
              className="w-[19px] h-[17px]"
            />
            <span className="text-white font-[-apple-system,BlinkMacSystemFont,'SF_Pro','Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[13px] font-normal leading-normal">
              Publish to Community
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Section */}
      <div className="flex justify-center w-full">
        <div className="w-full max-w-[1131px] flex gap-8">
          {/* File List Section */}
          <div className="flex flex-col items-end gap-[36px] flex-shrink-0 w-[280px] pt-[48px]">
            <div className="flex flex-col items-start gap-[2px] w-full">
              {/* List Header */}
              <div className="flex items-center justify-between w-full">
                <span className="text-[#6B6B6B] font-[-apple-system,BlinkMacSystemFont,'SF_Pro','Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[14px] font-[510] leading-[20px]">
                  File Uploaded
                </span>
                <div className="flex items-center gap-[10px]">
                  <span className="text-[#6B6B6B] font-[-apple-system,BlinkMacSystemFont,'SF_Pro','Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[14px] font-[510] leading-[20px]">
                    Select All
                  </span>
                  <input
                    type="checkbox"
                    className="w-[16px] h-[16px] rounded-[4px] border border-[#DBDBDB]"
                  />
                </div>
              </div>

              {/* List Content */}
              <div className="w-full">
                {/* Sample file items */}
                <div className="flex items-center py-[12px] gap-[7px] w-full border-b border-b-[#DBDBDB] border-b-[0.5px]">
                  <img
                    src="/workspace/fileIcons/pdf.svg"
                    alt="PDF file"
                    className="w-[20px] h-[20px]"
                  />
                  <span className="w-[230px] text-left text-[#09090B] font-[-apple-system,BlinkMacSystemFont,'SF_Pro','Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[14px] font-[510] leading-normal">
                    climate_research.pdf
                  </span>
                  <input
                    type="checkbox"
                    className="w-[16px] h-[16px] rounded-[4px] border border-[#DBDBDB]"
                  />
                </div>

                <div className="flex items-center py-[12px] gap-[7px] w-full border-b border-b-[#DBDBDB] border-b-[0.5px]">
                  <img
                    src="/workspace/fileIcons/txt.svg"
                    alt="Document file"
                    className="w-[20px] h-[20px]"
                  />
                  <span className="w-[230px] text-left text-[#09090B] font-[-apple-system,BlinkMacSystemFont,'SF_Pro','Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[14px] font-[510] leading-normal">
                    ml_nlp_guide.docx
                  </span>
                  <input
                    type="checkbox"
                    className="w-[16px] h-[16px] rounded-[4px] border border-[#DBDBDB]"
                  />
                </div>

                <div className="flex items-center py-[12px] gap-[7px] w-full border-b border-b-[#DBDBDB] border-b-[0.5px]">
                  <img
                    src="/workspace/fileIcons/pdf.svg"
                    alt="PDF file"
                    className="w-[20px] h-[20px]"
                  />
                  <span className="w-[230px] text-left text-[#09090B] font-[-apple-system,BlinkMacSystemFont,'SF_Pro','Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[14px] font-[510] leading-normal">
                    renewable_energy_report.pdf
                  </span>
                  <input
                    type="checkbox"
                    className="w-[16px] h-[16px] rounded-[4px] border border-[#DBDBDB]"
                  />
                </div>
              </div>
            </div>

            {/* Add New References Button */}
            <button className="flex w-[260px] h-[32px] px-[12px] py-[6px] justify-center items-center gap-[8px] flex-shrink-0 bg-[#4C6694] rounded-[20px] transition-all duration-200 ease-in-out hover:bg-[#3d5a7a] hover:shadow-[0px_2px_8px_rgba(76,102,148,0.25)] self-center">
              <img
                src="/workspace/documentChat/add.svg"
                alt="Add"
                className="w-[20px] h-[20px]"
              />
              <span className="text-white font-[-apple-system,BlinkMacSystemFont,'SF_Pro','Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[14px] font-medium leading-normal">
                Add New References
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentChatResponse;
