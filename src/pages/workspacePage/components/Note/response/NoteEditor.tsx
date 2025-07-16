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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lineCount, setLineCount] = useState(1);
  const [lineHeights, setLineHeights] = useState<number[]>([]);

  const updateLineCount = (editor: Editor) => {
    const dom = editor.view.dom;
    const elements = dom.querySelectorAll('p, h1, h2, h3, li, blockquote, pre');
    
    let totalLines = 0;
    const heights: number[] = [];
    
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const elementHeight = rect.height;
      
      // Calculate line height for this element type
      let lineHeight = 27.2; // default for 16px * 1.7
      const computedStyle = window.getComputedStyle(element);
      const fontSize = parseFloat(computedStyle.fontSize);
      const lineHeightValue = parseFloat(computedStyle.lineHeight);
      
      if (!isNaN(lineHeightValue)) {
        lineHeight = lineHeightValue;
      } else {
        // Fallback calculation based on element type
        if (element.tagName === 'H1') lineHeight = fontSize * 1.2;
        else if (element.tagName === 'H2') lineHeight = fontSize * 1.3;
        else if (element.tagName === 'H3') lineHeight = fontSize * 1.4;
        else lineHeight = fontSize * 1.7;
      }
      
      // Calculate how many visual lines this element spans
      const visualLines = Math.max(1, Math.round(elementHeight / lineHeight));
      
      // Add heights for each visual line
      for (let i = 0; i < visualLines; i++) {
        heights.push(lineHeight);
      }
      
      totalLines += visualLines;
    });
    
    setLineCount(totalLines || 1);
    setLineHeights(heights.length > 0 ? heights : [27.2]);
  };

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
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none font-inter text-sm leading-relaxed',
        style: 'overflow: visible; min-height: 100%;'
      },
    },
    onUpdate: ({ editor }) => {
      updateLineCount(editor);
    },
    onCreate: ({ editor }) => {
      updateLineCount(editor);
    },
  });

  useEffect(() => {
    const handleNoteCopilotText = (event: CustomEvent<{ text: string }>) => {
      if (editor && event.detail?.text) {
        editor.commands.setContent(event.detail.text);
        setTimeout(() => updateLineCount(editor), 100);
      }
    };

    window.addEventListener('note-copilot-text', handleNoteCopilotText as EventListener);
    return () => {
      window.removeEventListener('note-copilot-text', handleNoteCopilotText as EventListener);
    };
  }, [editor]);

  // Listen for changes in editor content to recalculate line heights
  useEffect(() => {
    if (editor) {
      const updateHeights = () => {
        setTimeout(() => updateLineCount(editor), 10);
      };
      
      editor.on('transaction', updateHeights);
      editor.on('focus', updateHeights);
      editor.on('blur', updateHeights);
      
      return () => {
        editor.off('transaction', updateHeights);
        editor.off('focus', updateHeights);
        editor.off('blur', updateHeights);
      };
    }
  }, [editor]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));

  const generateLineNumbers = () => {
    return Array.from({ length: lineCount }, (_, i) => (
      <div 
        key={i} 
        className="line-number"
        style={{ 
          height: `${lineHeights[i] || 27.2}px`,
          minHeight: `${lineHeights[i] || 27.2}px`,
          maxHeight: `${lineHeights[i] || 27.2}px`
        }}
      >
        {i + 1}
      </div>
    ));
  };

  return (
    <div className="h-[calc(100vh-88px)] flex flex-col bg-white font-inter overflow-hidden">
      <NoteEditorTopToolbar 
        onBack={onBack} 
        editor={editor} 
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      <div className="flex-1 bg-white relative overflow-hidden">
        <div className="flex-1 overflow-y-auto w-full h-full scrollbar-hide">
          <div className="flex justify-center items-start w-full">
            <div className="obsidian-editor-container" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
              <div className="line-numbers">{generateLineNumbers()}</div>
              <div className="editor-content-area">
                <EditorContent editor={editor} className="editor-content" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <NoteCopilotButton />
        </div>
      </div>

      {/* Styling fix included */}
      <style dangerouslySetInnerHTML={{ __html: `
        .obsidian-editor-container {
          display: flex !important;
          width: 50% !important;
          min-height: 100vh !important;
          background: white !important;
          padding: 4vh 0 !important;
          max-width: 800px !important;
        }

        .line-numbers {
          width: 60px !important;
          padding: 0 16px 0 20px !important;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace !important;
          font-size: 16px !important;
          color: #9ca3af !important;
          user-select: none !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-end !important;
          background: white !important;
          flex-shrink: 0 !important;
          line-height: 1.7 !important;
        }

        .line-number {
          padding: 0 8px 0 0 !important;
          text-align: right !important;
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          font-size: 16px !important;
          margin: 0 !important;
          box-sizing: border-box !important;
          flex-shrink: 0 !important;
        }

        .editor-content-area {
          flex: 1 !important;
          padding: 0 20px 0 0 !important;
          min-height: 100% !important;
          background: white !important;
        }

        .editor-content {
          width: 100% !important;
          min-height: 100% !important;
          background: white !important;
        }

        .ProseMirror {
          font-family: 'Inter', sans-serif !important;
          font-size: 16px !important;
          line-height: 1.7 !important;
          max-width: 100% !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          min-height: 100% !important;
          overflow: visible !important;
          color: #374151 !important;
          word-break: break-word !important;
          background: white !important;
        }

        .ProseMirror p {
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1.7 !important;
          min-height: 1.7em !important;
          box-sizing: border-box !important;
          font-size: 16px !important;
        }

        .ProseMirror h1 {
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1.2 !important;
          font-size: 32px !important;
          font-weight: 700 !important;
          color: #111827 !important;
          box-sizing: border-box !important;
        }

        .ProseMirror h2 {
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1.3 !important;
          font-size: 24px !important;
          font-weight: 600 !important;
          color: #111827 !important;
          box-sizing: border-box !important;
        }

        .ProseMirror h3 {
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1.4 !important;
          font-size: 20px !important;
          font-weight: 600 !important;
          color: #111827 !important;
          box-sizing: border-box !important;
        }

        .ProseMirror li,
        .ProseMirror blockquote,
        .ProseMirror pre {
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1.7 !important;
          min-height: 1.7em !important;
          box-sizing: border-box !important;
          font-size: 16px !important;
        }
        
        .ProseMirror p:empty::before {
          content: '';
          display: inline-block;
          height: 1.7em;
          width: 0;
        }

        .ProseMirror ul, .ProseMirror ol {
          padding-left: 24px !important;
        }

        .ProseMirror strong {
          font-weight: 700 !important;
          color: #111827 !important;
        }

        .ProseMirror em {
          font-style: italic !important;
          color: #374151 !important;
        }

        .ProseMirror code {
          font-family: 'SF Mono', monospace !important;
          font-size: 15px !important;
          background-color: #f3f4f6 !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #d1d5db !important;
          padding-left: 16px !important;
          font-style: italic !important;
        }

        .prose, .prose-sm {
          max-width: none !important;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .ProseMirror a {
          color: #2563eb !important;
          border-bottom: 1px dotted #2563eb !important;
          text-decoration: none !important;
        }

        .ProseMirror a:hover {
          color: #1d4ed8 !important;
          border-bottom: 1px solid #1d4ed8 !important;
        }
      `}} />
    </div>
  );
}

export default NoteEditor;