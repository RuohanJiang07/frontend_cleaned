import React from 'react';

interface NoteEditorTopToolbarProps {
  onBack: () => void;
  editor?: any;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  toolbarTopMargin: number;
}

function NoteEditorTopToolbar({ onBack, editor, onZoomIn, onZoomOut, toolbarTopMargin }: NoteEditorTopToolbarProps) {
  // Function to handle bold formatting
  const handleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  // Function to handle italic formatting
  const handleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  // Function to handle underline formatting
  const handleUnderline = () => {
    editor?.chain().focus().toggleUnderline().run();
  };

  // Function to handle strikethrough formatting
  const handleStrike = () => {
    editor?.chain().focus().toggleStrike().run();
  };

  // Function to handle bullet list
  const handleBulletList = () => {
    editor?.chain().focus().toggleBulletList().run();
  };

  // Function to handle ordered list
  const handleOrderedList = () => {
    editor?.chain().focus().toggleOrderedList().run();
  };

  // Function to handle undo
  const handleUndo = () => {
    editor?.chain().focus().undo().run();
  };

  // Function to handle redo
  const handleRedo = () => {
    editor?.chain().focus().redo().run();
  };

  return (
    <div className="flex flex-col items-center" style={{ paddingTop: `${toolbarTopMargin}px` }}>
      {/* Header with title and icon - centered at 50% width */}
      <div className="flex flex-col items-start max-w-[800px] mx-auto w-full">
        {/* Note icon and title */}
        <div className="flex items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="2" width="16" height="20" rx="2" stroke="black" strokeWidth="2"/>
            <line x1="8" y1="7" x2="16" y2="7" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="12" x2="16" y2="12" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="17" x2="16" y2="17" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-blue-600 text-sm font-medium ml-2 bg-[#DFEDFF] px-3 py-1 rounded-[5px]">
            Note
          </span>
        </div>
        
        {/* Title - moved closer to the last saved info */}
        <h1 className="font-medium text-2xl text-black mt-1">
          PHYS 2801 Class
        </h1>
      </div>
      
      {/* Last saved info - moved closer to title */}
      <div className="flex items-center max-w-[800px] mx-auto w-full mb-1 text-gray-500">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
          <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M15 12H12V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-sm">Last saved at 4:47 pm</span>
      </div>
      
      {/* Author info */}
      <div className="flex items-center max-w-[800px] mx-auto w-full mb-4">
        <div className="flex items-center mr-4">
          <div className="rounded-[5px] border border-[#D9D9D9] bg-[#FDFDFD] flex items-center px-3 py-1 h-[32px] overflow-hidden">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden mr-2 border border-gray-200">
              <img src="/main/landing_page/avatars.png" alt="John Doe" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm">John Doe</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-500 rounded-[5px] border border-[#D9D9D9] bg-[#FDFDFD] px-3 py-1 h-[32px] flex items-center">Created at Jun 11</span>
        </div>
        
        {/* Share button - positioned to the right */}
        <div className="ml-auto">
          <button className="bg-[#DFEDFF] text-[#00276C] rounded-full px-4 py-1.5 flex items-center gap-2 hover:bg-blue-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37061L8.08261 9.84066C7.54305 9.32015 6.80891 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15C6.80891 15 7.54305 14.6798 8.08261 14.1593L15.0227 18.6294C15.0077 18.7508 15 18.8745 15 19C15 20.6569 16.3431 22 18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C17.1911 16 16.457 16.3202 15.9174 16.8407L8.97733 12.3706C8.99229 12.2492 9 12.1255 9 12C9 11.8745 8.99229 11.7508 8.97733 11.6294L15.9174 7.15934C16.457 7.67985 17.1911 8 18 8Z" fill="currentColor"/>
            </svg>
            Share
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-center mb-2">
        <div className="flex items-center gap-2 bg-[#F8F8F8] rounded-full border border-[#DFDFDF] px-3 py-1.5 w-[800px]">
          {/* Undo/Redo */}
          <button 
            className={`p-1 text-gray-600 hover:bg-gray-100 rounded-full ${editor?.isActive('undo') ? 'bg-[#DFEDFF]' : ''}`}
            onClick={handleUndo}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v6h6"/>
              <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/>
            </svg>
          </button>
          <button 
            className={`p-1 text-gray-600 hover:bg-gray-100 rounded-full ${editor?.isActive('redo') ? 'bg-[#DFEDFF]' : ''}`}
            onClick={handleRedo}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 7v6h-6"/>
              <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3-2.3"/>
            </svg>
          </button>
          
          <span className="mx-2 text-gray-300">|</span>
          
          {/* Bold, Italic, Underline, Strikethrough */}
          <button 
            className={`p-1 ${editor?.isActive('bold') ? 'bg-[#DFEDFF]' : ''} text-gray-600 hover:bg-gray-100 rounded-full`}
            onClick={handleBold}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
              <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
            </svg>
          </button>
          <button 
            className={`p-1 ${editor?.isActive('italic') ? 'bg-[#DFEDFF]' : ''} text-gray-600 hover:bg-gray-100 rounded-full`}
            onClick={handleItalic}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="4" x2="10" y2="4"/>
              <line x1="14" y1="20" x2="5" y2="20"/>
              <line x1="15" y1="4" x2="9" y2="20"/>
            </svg>
          </button>
          <button 
            className={`p-1 ${editor?.isActive('underline') ? 'bg-[#DFEDFF]' : ''} text-gray-600 hover:bg-gray-100 rounded-full`}
            onClick={handleUnderline}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/>
              <line x1="4" y1="21" x2="20" y2="21"/>
            </svg>
          </button>
          <button 
            className={`p-1 ${editor?.isActive('strike') ? 'bg-[#DFEDFF]' : ''} text-gray-600 hover:bg-gray-100 rounded-full`}
            onClick={handleStrike}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <path d="M16 6C16 6 16.5 8 12 8C8.5 8 7 6.5 7 5.5C7 4 8.5 3 10.5 3C13.5 3 14 5 14 6"/>
              <path d="M8 16C8 16 10 21 16 21C20 21 22 18 22 16C22 13 20 12 17 12"/>
            </svg>
          </button>
          
          <span className="mx-2 text-gray-300">|</span>
          
          {/* Lists */}
          <button 
            className={`p-1 ${editor?.isActive('bulletList') ? 'bg-[#DFEDFF]' : ''} text-gray-600 hover:bg-gray-100 rounded-full`}
            onClick={handleBulletList}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
          <button 
            className={`p-1 ${editor?.isActive('orderedList') ? 'bg-[#DFEDFF]' : ''} text-gray-600 hover:bg-gray-100 rounded-full`}
            onClick={handleOrderedList}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="10" y1="6" x2="21" y2="6"/>
              <line x1="10" y1="12" x2="21" y2="12"/>
              <line x1="10" y1="18" x2="21" y2="18"/>
              <path d="M4 6h1v1H4z"/>
              <path d="M4 12h1v1H4z"/>
              <path d="M4 18h1v1H4z"/>
            </svg>
          </button>
          <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="18" x2="3" y2="18"/>
            </svg>
          </button>
          
          <span className="mx-2 text-gray-300">|</span>
          
          {/* Link, Code, Mention, Emoji, Image, Video */}
          <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </button>
          <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
          </button>
          <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </button>
          <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>
          <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </button>
          
          {/* Zoom buttons - right aligned */}
          <div className="ml-auto flex items-center gap-2">
            <button 
              className="p-1 text-gray-600 hover:bg-gray-100 rounded-full"
              onClick={onZoomIn}
              title="Zoom In"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>
            <button 
              className="p-1 text-gray-600 hover:bg-gray-100 rounded-full"
              onClick={onZoomOut}
              title="Zoom Out"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteEditorTopToolbar;