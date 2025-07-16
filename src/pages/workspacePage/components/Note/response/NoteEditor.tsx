import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import NoteCopilotButton from './NoteCopilotButton';
import NoteEditorTopToolbar from './NoteEditorTopToolbar';

interface NoteEditorProps {
  onBack: () => void;
}

function NoteEditor({ onBack }: NoteEditorProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lineCount, setLineCount] = useState(1);
  const [lineHeights, setLineHeights] = useState<number[]>([]);
  const [toolbarTopMargin, setToolbarTopMargin] = useState(30); // Default to 30px as you suggested

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
    content: `<h1>What is Lorem Ipsum?</h1>
<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
<h2>Why do we use it?</h2>
<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
<p></p>
<p></p>
<h2>Where does it come from?</h2>
<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</p>`,
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

  // Function to adjust toolbar margin
  const increaseToolbarMargin = () => setToolbarTopMargin(prev => prev + 10);
  const decreaseToolbarMargin = () => setToolbarTopMargin(prev => Math.max(0, prev - 10));

  return (
    <div className="h-[calc(100vh-88px)] flex flex-col bg-white overflow-hidden">
      <NoteEditorTopToolbar 
        onBack={onBack} 
        editor={editor} 
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        toolbarTopMargin={toolbarTopMargin}
      />
      
      <div className="flex-1 relative overflow-hidden">
        <div className="flex-1 overflow-y-auto w-full h-full">
          <div className="flex justify-center w-full">
            <div className="editor-container" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
              <div className="line-numbers">{generateLineNumbers()}</div>
              <EditorContent editor={editor} className="editor-content" />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <NoteCopilotButton />
        </div>
      </div>

      {/* Debug controls for toolbar margin - can be removed in production */}
      <div className="fixed bottom-4 right-4 flex gap-2 bg-white p-2 rounded shadow-md z-50">
        <button 
          onClick={increaseToolbarMargin} 
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          title="Move toolbar down"
        >
          ↓ Toolbar
        </button>
        <button 
          onClick={decreaseToolbarMargin} 
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          title="Move toolbar up"
        >
          ↑ Toolbar
        </button>
        <span className="px-2 py-1 bg-gray-100 rounded">{toolbarTopMargin}px</span>
      </div>

      {/* Updated styling to match the image */}
      <style dangerouslySetInnerHTML={{ __html: `
        .editor-container {
          display: flex;
          width: 800px;
          min-height: 100vh;
          background: white;
          padding: 0;
          position: relative;
          margin-top: 0px;
        }

        .line-numbers {
          width: 50px;
          padding: 0 10px;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          font-size: 14px;
          color: #9ca3af;
          user-select: none;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          background: white;
          flex-shrink: 0;
          line-height: 1.7;
        }

        .line-number {
          padding: 0 8px 0 0;
          text-align: right;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-size: 14px;
          margin: 0;
          box-sizing: border-box;
          flex-shrink: 0;
          color: #9ca3af;
        }

        .editor-content {
          flex: 1;
          padding: 0 20px 0 0;
          min-height: 100%;
          background: white;
          width: 750px;
        }

        .ProseMirror {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          line-height: 1.7;
          max-width: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          min-height: 100%;
          overflow: visible;
          color: #374151;
          word-break: break-word;
          background: white;
          outline: none;
        }

        .ProseMirror p {
          margin: 0;
          padding: 0;
          line-height: 1.7;
          min-height: 1.7em;
          box-sizing: border-box;
          font-size: 16px;
        }

        .ProseMirror h1 {
          margin: 0;
          padding: 0;
          line-height: 1.2;
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          box-sizing: border-box;
        }

        .ProseMirror h2 {
          margin: 0;
          padding: 0;
          line-height: 1.3;
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          box-sizing: border-box;
        }

        .ProseMirror h3 {
          margin: 0;
          padding: 0;
          line-height: 1.4;
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          box-sizing: border-box;
        }

        .ProseMirror li,
        .ProseMirror blockquote,
        .ProseMirror pre {
          margin: 0;
          padding: 0;
          line-height: 1.7;
          min-height: 1.7em;
          box-sizing: border-box;
          font-size: 16px;
        }
        
        .ProseMirror p:empty::before {
          content: '';
          display: inline-block;
          height: 1.7em;
          width: 0;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 24px;
        }

        .ProseMirror strong {
          font-weight: 700;
          color: #111827;
        }

        .ProseMirror em {
          font-style: italic;
          color: #374151;
        }

        .ProseMirror code {
          font-family: 'SF Mono', monospace;
          font-size: 15px;
          background-color: #f3f4f6;
          padding: 2px 4px;
          border-radius: 3px;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 16px;
          font-style: italic;
        }

        .prose,
        .prose-sm {
          max-width: none;
        }

        ::-webkit-scrollbar {
          display: none;
        }

        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .ProseMirror a {
          color: #2563eb;
          border-bottom: 1px dotted #2563eb;
          text-decoration: none;
        }

        .ProseMirror a:hover {
          color: #1d4ed8;
          border-bottom: 1px solid #1d4ed8;
        }
      `}} />
    </div>
  );
}

export default NoteEditor;