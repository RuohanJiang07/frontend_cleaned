import React from 'react';
import { Button } from '../../../../../components/ui/button';
import {
  ArrowLeftIcon, BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon,
  AlignLeftIcon, AlignCenterIcon, AlignRightIcon, ListIcon, ListOrderedIcon,
  LinkIcon, ImageIcon, TableIcon, CodeIcon, QuoteIcon, ZoomInIcon, ZoomOutIcon
} from 'lucide-react';

interface NoteEditorTopToolbarProps {
  onBack: () => void;
  editor?: any;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

function NoteEditorTopToolbar({ onBack, editor, onZoomIn, onZoomOut }: NoteEditorTopToolbarProps) {
  const handleHeadingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    
    switch (value) {
      case 'Normal':
        editor?.chain().focus().setParagraph().run();
        break;
      case 'Heading 1':
        editor?.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'Heading 2':
        editor?.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'Heading 3':
        editor?.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'Quote':
        editor?.chain().focus().toggleBlockquote().run();
        break;
      case 'Code':
        editor?.chain().focus().toggleCodeBlock().run();
        break;
      default:
        editor?.chain().focus().setParagraph().run();
    }
  };

  const getCurrentHeading = () => {
    if (editor?.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor?.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor?.isActive('heading', { level: 3 })) return 'Heading 3';
    if (editor?.isActive('blockquote')) return 'Quote';
    if (editor?.isActive('codeBlock')) return 'Code';
    return 'Normal';
  };

  return (
    <>
      {/* Header - Reduced height and aligned menu items with title */}
      <div className="flex items-center justify-between px-4 py-3 bg-white flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Left arrow positioned in the middle vertically */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="p-0 w-5 h-5 flex-shrink-0"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          
          {/* Title with last saved info */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-base text-black font-inter">
              PHYS 2801 Class
            </span>
            <span className="text-xs text-gray-500 font-inter">
              Last saved at 4:47 pm
            </span>
          </div>
        </div>
      </div>

      {/* New Toolbar - Matching the image with rounded rectangle design */}
      <div className="px-4 py-0 bg-white flex-shrink-0">
        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 gap-2">
          {/* Undo/Redo Group */}
          <div className="flex items-center gap-2 px-2">
            <button 
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              onClick={() => editor?.chain().focus().undo().run()}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7v6h6"/>
                <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/>
              </svg>
            </button>
            <button 
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              onClick={() => editor?.chain().focus().redo().run()}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 7v6h-6"/>
                <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3-2.3"/>
              </svg>
            </button>
          </div>
          
          {/* Divider */}
          <div className="w-px h-6 bg-gray-300"></div>
          
          {/* Style Dropdown */}
          <div className="flex items-center px-2">
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={getCurrentHeading()}
                onChange={handleHeadingChange}
              >
                <option>Normal</option>
                <option>Heading 1</option>
                <option>Heading 2</option>
                <option>Heading 3</option>
                <option>Quote</option>
                <option>Code</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="w-px h-6 bg-gray-300"></div>
          
          {/* Text formatting - Bold, Italic, Underline, Strikethrough */}
          <div className="flex items-center gap-2 px-2">
            <button 
              className={`p-1 hover:bg-gray-200 rounded-full transition-colors ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              <BoldIcon className="w-5 h-5" />
            </button>
            <button 
              className={`p-1 hover:bg-gray-200 rounded-full transition-colors ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              <ItalicIcon className="w-5 h-5" />
            </button>
            <button 
              className={`p-1 hover:bg-gray-200 rounded-full transition-colors ${editor?.isActive('underline') ? 'bg-gray-200' : ''}`}
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon className="w-5 h-5" />
            </button>
            <button 
              className={`p-1 hover:bg-gray-200 rounded-full transition-colors ${editor?.isActive('strike') ? 'bg-gray-200' : ''}`}
              onClick={() => editor?.chain().focus().toggleStrike().run()}
            >
              <StrikethroughIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Divider */}
          <div className="w-px h-6 bg-gray-300"></div>
          
          {/* Alignment and Lists */}
          <div className="flex items-center gap-2 px-2">
            <button 
              className={`p-1 hover:bg-gray-200 rounded-full transition-colors ${editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
              onClick={() => editor?.chain().focus().setTextAlign('left').run()}
            >
              <AlignLeftIcon className="w-5 h-5" />
            </button>
            <button 
              className={`p-1 hover:bg-gray-200 rounded-full transition-colors ${editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
              onClick={() => editor?.chain().focus().setTextAlign('center').run()}
            >
              <AlignCenterIcon className="w-5 h-5" />
            </button>
            <button 
              className={`p-1 hover:bg-gray-200 rounded-full transition-colors ${editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
              onClick={() => editor?.chain().focus().setTextAlign('right').run()}
            >
              <AlignRightIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Divider */}
          <div className="w-px h-6 bg-gray-300"></div>
          
          {/* Lists */}
          <div className="flex items-center gap-2 px-2">
            <button 
              className={`p-1 hover:bg-gray-200 rounded-full transition-colors ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              <ListIcon className="w-5 h-5" />
            </button>
            <button 
              className={`p-1 hover:bg-gray-200 rounded-full transition-colors ${editor?.isActive('orderedList') ? 'bg-gray-200' : ''}`}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            >
              <ListOrderedIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Divider */}
          <div className="w-px h-6 bg-gray-300"></div>
          
          {/* Insert options - Link, Image, Table, Code, Quote, etc. */}
          <div className="flex items-center gap-2 px-2">
            <button 
              className="p-1 hover:bg-gray-200 rounded-full transition-colors" 
              onClick={() => {
                const url = window.prompt('Enter link URL:');
                if (url) {
                  editor?.chain().focus().setLink({ href: url }).run();
                }
              }}
            >
              <LinkIcon className="w-5 h-5" />
            </button>
            <button 
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button 
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <TableIcon className="w-5 h-5" />
            </button>
            <button 
              className={`p-1 hover:bg-gray-200 rounded-full transition-colors ${editor?.isActive('code') ? 'bg-gray-200' : ''}`}
              onClick={() => editor?.chain().focus().toggleCode().run()}
            >
              <CodeIcon className="w-5 h-5" />
            </button>
            <button 
              className={`p-1 hover:bg-gray-200 rounded-full transition-colors ${editor?.isActive('blockquote') ? 'bg-gray-200' : ''}`}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            >
              <QuoteIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Divider */}
          <div className="w-px h-6 bg-gray-300"></div>
          
          {/* Text and Color options */}
          <div className="flex items-center gap-2 px-2">
            <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
              <span className="font-bold text-lg">T</span>
            </button>
            <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v8"></path>
                <path d="M8 12h8"></path>
              </svg>
            </button>
          </div>
          
          {/* Divider */}
          <div className="w-px h-6 bg-gray-300"></div>
          
          {/* Zoom buttons */}
          <div className="flex items-center gap-2 px-2 ml-auto">
            <button 
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              onClick={onZoomIn}
              title="Zoom In"
            >
              <ZoomInIcon className="w-5 h-5" />
            </button>
            <button 
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              onClick={onZoomOut}
              title="Zoom Out"
            >
              <ZoomOutIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NoteEditorTopToolbar;