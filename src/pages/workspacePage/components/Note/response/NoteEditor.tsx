import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { Button } from '../../../../../components/ui/button';
import NoteCopilotButton from './NoteCopilotButton';
import NoteEditorTopToolbar from './NoteEditorTopToolbar';

interface NoteEditorProps {
  onBack: () => void;
}

function NoteEditor({ onBack }: NoteEditorProps) {
  const [pageCount, setPageCount] = useState(1);
  const [editorHeight, setEditorHeight] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontFamily,
    ],
    content: `
      <h1>Wait-Why Do Antibiotics Exist?</h1>
      <p>Prof. Fabrizio Apagnolo</p>
      <p>Crisper (?) -> CRISPR</p>
      <br>
      <h2>1. History</h2>
      <p>Dawn of Modern Medicine: (1800s)</p>
      <ul>
        <li>Paul Erhlich: began working on microbial staining for microscopy; note that stains can easily enter bacterial</li>
        <li>First time the possibility of chemotherapy for infectious diseases is seriously pursued</li>
      </ul>
      <p>First True Antibiotic</p>
      <ul>
        <li>1928, Alexander Fleming: penicillin, the first true antibiotic (quite an accident!)</li>
        <li>1940: first experimentally used to treat an infection. Clinical approved in 1943. Also, resistance to penicillin was reported in the literature by Chain & a colleague</li>
        <li>1945: Fleming shared the Nobel Prize with two of the chemists</li>
      </ul>
      <p><strong>2. Antibiotic Resistance - is not New</strong></p>
      <ul>
        <li>Antibiotic resistance genes (ARGs) are common!</li>
        <li>Antibiotic resistance genes found mostly on plasmids (part of DNA): ARGs often on plasmids paired with genes needed for antibiotic synthesis</li>
      </ul>
      <p>Why haven't microbes made antibiotic weapons useless?</p>
      <p>Why DO antibiotics exist?</p>
      <p>- Differences in Concentration</p>
      <ul>
        <li>Concentration has been a key factor in the success of antibiotic treatments from penicillin onward: this is why Fleming needed chemists to help purify and concentrate penicillin</li>
        <li>Modern antibiotic therapy uses a PK/PD approach</li>
      </ul>
      <p>-Scale</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none font-inter text-sm leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      // Calculate content height and update page count
      const editorElement = editor.view.dom;
      const contentHeight = editorElement.scrollHeight;
      setEditorHeight(contentHeight);
      
      // Calculate pages needed (assuming ~1000px per page with margins)
      const pageHeight = 1000; // Approximate content height per page
      const calculatedPages = Math.max(1, Math.ceil(contentHeight / pageHeight));
      setPageCount(calculatedPages);
    },
  });

  // Listen for note-copilot-text events to update the editor with generated notes
  useEffect(() => {
    const handleNoteCopilotText = (event: CustomEvent<{ text: string }>) => {
      if (editor && event.detail?.text) {
        // REPLACE all content with the new text instead of comparing/appending
        editor.commands.setContent(event.detail.text);
        
        // Force recalculation of page count after content update
        setTimeout(() => {
          if (editor && editor.view && editor.view.dom) {
            const contentHeight = editor.view.dom.scrollHeight;
            setEditorHeight(contentHeight);
            
            // Calculate pages needed (assuming ~1000px per page with margins)
            const pageHeight = 1000; // Approximate content height per page
            const calculatedPages = Math.max(1, Math.ceil(contentHeight / pageHeight));
            setPageCount(calculatedPages);
          }
        }, 100);
      }
    };

    window.addEventListener('note-copilot-text', handleNoteCopilotText as EventListener);
    
    return () => {
      window.removeEventListener('note-copilot-text', handleNoteCopilotText as EventListener);
    };
  }, [editor]);

  // Update page count when editor content changes
  useEffect(() => {
    if (editor) {
      const editorElement = editor.view.dom;
      const contentHeight = editorElement.scrollHeight;
      setEditorHeight(contentHeight);
      
      // Calculate pages needed
      const pageHeight = 1000;
      const calculatedPages = Math.max(1, Math.ceil(contentHeight / pageHeight));
      setPageCount(calculatedPages);
    }
  }, [editor]);

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div className="h-[calc(100vh-88px)] flex flex-col bg-white font-inter overflow-hidden">
      {/* Top Toolbar Component - Pass editor instance */}
      <NoteEditorTopToolbar 
        onBack={onBack} 
        editor={editor} 
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      {/* Main Editor Area - Fixed height with proper overflow and pagination */}
      <div className="flex-1 bg-white overflow-hidden relative">
        {/* Editor content - Multiple pages with proper spacing */}
        <div className="flex-1 overflow-y-auto py-12 px-6 w-full">
          <div className="flex flex-col items-center gap-8">
            <EditorContent 
              editor={editor} 
              className="w-[816px] min-h-[1056px] bg-white shadow-lg px-10 py-12 relative font-inter transition-transform"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
            />
            
            {/* Add additional blank pages if needed */}
            {pageCount > 1 && Array.from({ length: pageCount - 1 }, (_, pageIndex) => (
              <div
                key={pageIndex + 1}
                className="w-[816px] min-h-[1056px] bg-white shadow-lg px-10 py-12 relative"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
              >
                {/* Page number at bottom */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-inter">
                  {pageIndex + 2}
                </div>
              </div>
            ))}
            
            {/* Extra spacing at the end */}
            <div className="h-20"></div>
          </div>
        </div>

        {/* NoteCopilotButton - Fixed position at bottom center */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <NoteCopilotButton />
        </div>
      </div>

      {/* Enhanced custom styles for the editor content with pagination */}
      <style jsx global>{`
        .ProseMirror {
          font-family: 'Inter', sans-serif !important;
          font-size: 16px !important;
          line-height: 1.7 !important;
          max-width: none !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          min-height: 900px !important;
          overflow: visible !important;
        }
        
        .ProseMirror h1 {
          font-family: 'Inter', sans-serif !important;
          font-size: 24px !important;
          font-weight: 700 !important;
          margin-bottom: 16px !important;
          margin-top: 0 !important;
          page-break-after: avoid !important;
        }
        
        .ProseMirror h2 {
          font-family: 'Inter', sans-serif !important;
          font-size: 20px !important;
          font-weight: 700 !important;
          margin-bottom: 12px !important;
          margin-top: 24px !important;
          page-break-after: avoid !important;
        }
        
        .ProseMirror h3 {
          font-family: 'Inter', sans-serif !important;
          font-size: 18px !important;
          font-weight: 700 !important;
          margin-bottom: 8px !important;
          margin-top: 20px !important;
          page-break-after: avoid !important;
        }
        
        .ProseMirror p {
          font-family: 'Inter', sans-serif !important;
          font-size: 16px !important;
          margin-bottom: 14px !important;
          margin-top: 0 !important;
          page-break-inside: avoid !important;
        }
        
        .ProseMirror ul, .ProseMirror ol {
          font-family: 'Inter', sans-serif !important;
          font-size: 16px !important;
          margin-bottom: 14px !important;
          padding-left: 24px !important;
          page-break-inside: avoid !important;
        }
        
        .ProseMirror li {
          font-family: 'Inter', sans-serif !important;
          font-size: 16px !important;
          margin-bottom: 6px !important;
          page-break-inside: avoid !important;
        }
        
        .ProseMirror strong {
          font-family: 'Inter', sans-serif !important;
          font-weight: 700 !important;
        }
        
        .ProseMirror em {
          font-family: 'Inter', sans-serif !important;
          font-style: italic !important;
        }
        
        .ProseMirror code {
          font-family: 'Inter', monospace !important;
          font-size: 15px !important;
          background-color: #f5f7fa !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
        }
        
        .ProseMirror blockquote {
          font-family: 'Inter', sans-serif !important;
          font-size: 16px !important;
          border-left: 4px solid #d1d5db !important;
          padding-left: 16px !important;
          margin: 16px 0 !important;
          font-style: italic !important;
          page-break-inside: avoid !important;
        }
        
        /* Remove prose max-width constraints */
        .prose {
          max-width: none !important;
        }
        
        .prose-sm {
          max-width: none !important;
        }

        /* Page break styles for better pagination */
        @media print {
          .ProseMirror {
            page-break-inside: avoid !important;
          }
          
          .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
          
          .ProseMirror p, .ProseMirror li {
            page-break-inside: avoid !important;
            orphans: 3 !important;
            widows: 3 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default NoteEditor;