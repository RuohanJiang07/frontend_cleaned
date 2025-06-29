import React, { useState, useEffect } from 'react';
import { Button } from '../../../../../components/ui/button';
import {
  ArrowLeftIcon,
} from 'lucide-react';
import { useToast } from '../../../../../hooks/useToast';
import { DeepLearnStreamingData, InteractiveResponse } from '../../../../../api/workspaces/deep_learning/deepLearn_deeplearn';
import { submitQuickSearchQuery } from '../../../../../api/workspaces/deep_learning/deepLearnMain';
import { submitDeepLearnDeepQuery } from '../../../../../api/workspaces/deep_learning/deepLearn_deeplearn';
import InteractiveContent from './InteractiveContent';
import DeepLearnAnswerRenderer from './DeepLearnAnswerRenderer';
import QuestionInput from './QuestionInput';

interface DeepLearnResponseProps {
  onBack: () => void;
  isSplit?: boolean;
}

// Conversation message interface
interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: 'deep-learn' | 'quick-search';
  isStreaming?: boolean;
  streamingContent?: string;
  deepLearnData?: DeepLearnStreamingData;
}

// 回答标题区域组件 - 缩小上下间距
const AnswerHeader: React.FC<{ title: string; tag: string; isSplit?: boolean }> = ({ title, tag, isSplit = false }) => (
  <div className={`mt-3 ${isSplit ? 'w-full' : 'w-[649px]'} mx-auto`}>
    <div className="flex items-center ml-0">
      <span className="text-black text-[13px] font-medium font-normal leading-normal">
        {title}
      </span>
      <span className="flex items-center justify-center ml-[9px] w-[61px] h-4 flex-shrink-0 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] text-[#6B6B6B] text-[9px] font-medium font-normal leading-normal">
        {tag}
      </span>
    </div>
    <div className={`mt-1.5 ${isSplit ? 'w-full' : 'w-[649px]'} h-[1.5px] bg-[#D9D9D9] rounded`} />
  </div>
);

// Source Webpages 区域占位组件 - 学习参考代码的样式
const SourceWebpagesPlaceholders: React.FC<{ isSplit?: boolean }> = ({ isSplit = false }) => (
  <div className={`flex justify-center mt-3 ${isSplit ? 'w-full' : 'w-[649px]'} mx-auto`}>
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        className={`${isSplit ? 'w-20 h-[50px]' : 'w-[114px] h-[73px]'} flex-shrink-0 rounded-lg border border-[rgba(179,179,179,0.58)] bg-[rgba(236,241,246,0.55)] shadow-[0px_1px_15px_0px_rgba(73,127,255,0.10)] ${i < 3 ? (isSplit ? 'mr-3' : 'mr-[18px]') : 'mr-0'}`}
      />
    ))}
    {/* More 按钮 placeholder */}
    <div className={`${isSplit ? 'w-[55px] h-[50px]' : 'w-[77px] h-[73px]'} flex-shrink-0 rounded-lg border border-[rgba(179,179,179,0.58)] bg-[rgba(236,241,246,0.55)] shadow-[0px_1px_15px_0px_rgba(73,127,255,0.10)] ${isSplit ? 'ml-3' : 'ml-[18px]'}`} />
  </div>
);

// 用户提问气泡组件 - 动态调整宽度
const UserQuestionBubble: React.FC<{
  content: string;
  time: string;
  className?: string;
  isSplit?: boolean;
}> = ({ content, time, className = "", isSplit = false }) => {
  // Calculate dynamic width based on content length
  const getWidth = () => {
    const baseWidth = isSplit ? 140 : 163;
    const charLength = content.length;
    
    if (charLength <= 20) return baseWidth;
    if (charLength <= 40) return baseWidth + (isSplit ? 40 : 60);
    if (charLength <= 60) return baseWidth + (isSplit ? 80 : 120);
    return baseWidth + (isSplit ? 120 : 180);
  };

  const dynamicWidth = getWidth();

  return (
    <div className={`flex flex-col items-end mb-6 ${isSplit ? 'w-full' : 'w-[649px]'} mx-auto ${className}`}>
      <span className="font-medium text-[#636363] font-['Inter'] text-[10px] font-normal font-medium leading-normal mb-0.5 self-end">
        {time}
      </span>
      <div 
        className={`flex items-center justify-center h-auto min-h-[34px] flex-shrink-0 rounded-[10px] bg-[#ECF1F6] self-end px-3 py-2`}
        style={{ width: `${dynamicWidth}px`, maxWidth: isSplit ? '300px' : '400px' }}
      >
        <span className={`text-black font-['Inter'] ${isSplit ? 'text-[11px]' : 'text-[13px]'} font-medium font-normal leading-normal text-center break-words`}>
          {content}
        </span>
      </div>
    </div>
  );
};

// 正文解释部分组件 - 学习参考代码的样式
const AnswerBody: React.FC<{ children: React.ReactNode; isSplit?: boolean }> = ({ children, isSplit = false }) => (
  <div className={`${isSplit ? 'w-full' : 'w-[649px]'} mx-auto mt-[18px]`}>
    <div className={`text-black ${isSplit ? 'text-[11px]' : 'text-[12px]'} font-normal font-normal leading-normal font-['Inter'] text-left`}>
      {children}
    </div>
    <div className={`mt-4 ${isSplit ? 'w-full' : 'w-[649px]'} h-[1.5px] bg-[#D9D9D9] rounded`} />
  </div>
);

// Assistant message component
const AssistantMessage: React.FC<{
  message: ConversationMessage;
  isSplit?: boolean;
}> = ({ message, isSplit = false }) => {
  return (
    <div className="prose max-w-none font-['Inter',Helvetica] text-sm leading-relaxed mb-6">
      <AnswerHeader 
        title={message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')} 
        tag={message.mode === 'deep-learn' ? 'Deep Learn' : 'Quick Search'} 
        isSplit={isSplit} 
      />
      <SourceWebpagesPlaceholders isSplit={isSplit} />
      
      <AnswerBody isSplit={isSplit}>
        <DeepLearnAnswerRenderer message={message} isSplit={isSplit} />
      </AnswerBody>
    </div>
  );
};

function DeepLearnResponse({ onBack, isSplit = false }: DeepLearnResponseProps) {
  const { error, success } = useToast();
  const [selectedMode, setSelectedMode] = useState<'deep-learn' | 'quick-search'>('deep-learn');
  const [conversationId, setConversationId] = useState<string>('');
  const [interactiveData, setInteractiveData] = useState<InteractiveResponse | null>(null);
  const [isLoadingInteractive, setIsLoadingInteractive] = useState(true);

  // New state for conversation history
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  
  // New state for continuous conversation
  const [conversationMode, setConversationMode] = useState<'follow-up' | 'new-topic' | null>(null);
  const [inputText, setInputText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved data for this tab and initialize conversation history
  useEffect(() => {
    const tabId = window.location.pathname + window.location.search;
    const savedConversationId = localStorage.getItem(`deeplearn_conversation_${tabId}`);
    const savedQuery = localStorage.getItem(`deeplearn_query_${tabId}`);
    const savedMode = localStorage.getItem(`deeplearn_mode_${tabId}`) as 'deep-learn' | 'quick-search';
    const savedStreamingContent = localStorage.getItem(`deeplearn_streaming_content_${tabId}`) || '';
    const savedDeepContent = localStorage.getItem(`deeplearn_deep_content_${tabId}`);
    const isStreamingComplete = localStorage.getItem(`deeplearn_streaming_complete_${tabId}`) === 'true';
    const isDeepComplete = localStorage.getItem(`deeplearn_deep_complete_${tabId}`) === 'true';
    const savedInteractiveData = localStorage.getItem(`deeplearn_interactive_${tabId}`);

    console.log('Loading saved data for tab:', {
      tabId,
      conversationId: savedConversationId,
      query: savedQuery,
      mode: savedMode,
      streamingContentLength: savedStreamingContent.length,
      hasDeepContent: !!savedDeepContent,
      isStreamingComplete,
      isDeepComplete,
      hasInteractiveData: !!savedInteractiveData
    });

    if (savedQuery) {
      if (savedMode) {
        setSelectedMode(savedMode);
      }
      if (savedConversationId) {
        setConversationId(savedConversationId);
      }

      // Initialize conversation history with the first message
      const initialUserMessage: ConversationMessage = {
        id: 'initial-user',
        type: 'user',
        content: savedQuery,
        timestamp: 'Me, Jun 1, 9:50 PM'
      };

      const initialAssistantMessage: ConversationMessage = {
        id: 'initial-assistant',
        type: 'assistant',
        content: savedQuery,
        timestamp: 'Assistant',
        mode: savedMode,
        isStreaming: savedMode === 'quick-search' ? !isStreamingComplete : !isDeepComplete,
        streamingContent: savedMode === 'quick-search' ? savedStreamingContent : undefined,
        deepLearnData: savedMode === 'deep-learn' && savedDeepContent ? JSON.parse(savedDeepContent) : undefined
      };

      setConversationHistory([initialUserMessage, initialAssistantMessage]);

      // Load interactive data if available
      if (savedInteractiveData) {
        try {
          const parsedInteractiveData = JSON.parse(savedInteractiveData);
          setInteractiveData(parsedInteractiveData);
          setIsLoadingInteractive(false);
        } catch (e) {
          console.error('Failed to parse interactive data:', e);
          setIsLoadingInteractive(false);
        }
      }
      
      // Listen for streaming updates
      const handleStreamingUpdate = (event: CustomEvent) => {
        if (event.detail.tabId === tabId) {
          setConversationHistory(prev => 
            prev.map(msg => 
              msg.id === 'initial-assistant' && msg.mode === 'quick-search'
                ? { ...msg, streamingContent: event.detail.content }
                : msg
            )
          );
        }
      };

      const handleStreamingComplete = (event: CustomEvent) => {
        if (event.detail.tabId === tabId) {
          setConversationHistory(prev => 
            prev.map(msg => 
              msg.id === 'initial-assistant' && msg.mode === 'quick-search'
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
        }
      };

      const handleDeepUpdate = (event: CustomEvent) => {
        if (event.detail.tabId === tabId) {
          setConversationHistory(prev => 
            prev.map(msg => 
              msg.id === 'initial-assistant' && msg.mode === 'deep-learn'
                ? { ...msg, deepLearnData: event.detail.data }
                : msg
            )
          );
        }
      };

      const handleDeepComplete = (event: CustomEvent) => {
        if (event.detail.tabId === tabId) {
          setConversationHistory(prev => 
            prev.map(msg => 
              msg.id === 'initial-assistant' && msg.mode === 'deep-learn'
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
        }
      };

      const handleInteractiveUpdate = (event: CustomEvent) => {
        if (event.detail.tabId === tabId) {
          setInteractiveData(event.detail.data);
          setIsLoadingInteractive(false);
        }
      };

      window.addEventListener('deeplearn-streaming-update', handleStreamingUpdate as EventListener);
      window.addEventListener('deeplearn-streaming-complete', handleStreamingComplete as EventListener);
      window.addEventListener('deeplearn-deep-update', handleDeepUpdate as EventListener);
      window.addEventListener('deeplearn-deep-complete', handleDeepComplete as EventListener);
      window.addEventListener('deeplearn-interactive-update', handleInteractiveUpdate as EventListener);

      return () => {
        window.removeEventListener('deeplearn-streaming-update', handleStreamingUpdate as EventListener);
        window.removeEventListener('deeplearn-streaming-complete', handleStreamingComplete as EventListener);
        window.removeEventListener('deeplearn-deep-update', handleDeepUpdate as EventListener);
        window.removeEventListener('deeplearn-deep-complete', handleDeepComplete as EventListener);
        window.removeEventListener('deeplearn-interactive-update', handleInteractiveUpdate as EventListener);
      };
    } else {
      console.log('No saved data found, using defaults');
      setIsLoadingInteractive(false);
    }
  }, []);

  // Handle mode selection
  const handleModeSelection = (mode: 'follow-up' | 'new-topic') => {
    setConversationMode(mode);
  };

  // Handle mode change
  const handleModeChange = () => {
    if (conversationMode === 'follow-up') {
      setConversationMode('new-topic');
    } else if (conversationMode === 'new-topic') {
      setConversationMode('follow-up');
    }
  };

  // Handle mode toggle for Deep Learn / Quick Search
  const handleModeToggle = () => {
    setSelectedMode(selectedMode === 'deep-learn' ? 'quick-search' : 'deep-learn');
  };

  // Handle submitting new question
  const handleSubmitQuestion = async () => {
    if (!inputText.trim() || isSubmitting) {
      return;
    }

    if (conversationMode === 'follow-up') {
      // TODO: Implement follow-up logic later
      success('Follow-up functionality will be implemented next!');
      return;
    }

    if (conversationMode === 'new-topic') {
      try {
        setIsSubmitting(true);
        
        // Add user message to conversation history
        const newUserMessage: ConversationMessage = {
          id: `user-${Date.now()}`,
          type: 'user',
          content: inputText.trim(),
          timestamp: new Date().toLocaleString()
        };

        // Add assistant message placeholder
        const newAssistantMessage: ConversationMessage = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: inputText.trim(),
          timestamp: 'Assistant',
          mode: selectedMode,
          isStreaming: true,
          streamingContent: selectedMode === 'quick-search' ? '' : undefined,
          deepLearnData: undefined
        };

        setConversationHistory(prev => [...prev, newUserMessage, newAssistantMessage]);
        
        // Clear input immediately after submission
        const queryToSubmit = inputText.trim();
        setInputText('');
        
        console.log('Starting new topic conversation:', {
          query: queryToSubmit,
          mode: selectedMode,
          conversationId,
          newConversation: false
        });

        if (selectedMode === 'quick-search') {
          // Start quick search with existing conversation ID
          await submitQuickSearchQuery(
            queryToSubmit,
            true, // web search enabled
            undefined, // no additional comments
            'profile-default',
            null, // no references
            (data: string) => {
              // Update the streaming content for the current assistant message
              setConversationHistory(prev => 
                prev.map(msg => 
                  msg.id === newAssistantMessage.id
                    ? { ...msg, streamingContent: (msg.streamingContent || '') + data }
                    : msg
                )
              );
            },
            (errorMsg: string) => {
              console.error('Quick search streaming error:', errorMsg);
              error(`Streaming error: ${errorMsg}`);
              setIsSubmitting(false);
            },
            () => {
              console.log('Quick search streaming completed');
              setConversationHistory(prev => 
                prev.map(msg => 
                  msg.id === newAssistantMessage.id
                    ? { ...msg, isStreaming: false }
                    : msg
                )
              );
              setIsSubmitting(false);
            },
            conversationId // Pass existing conversation ID
          );
        } else {
          // Deep learn mode
          await submitDeepLearnDeepQuery(
            queryToSubmit,
            true, // web search enabled
            undefined, // no additional comments
            'profile-default',
            null, // no references
            (data) => {
              // Update the deep learn data for the current assistant message
              setConversationHistory(prev => 
                prev.map(msg => 
                  msg.id === newAssistantMessage.id
                    ? { ...msg, deepLearnData: data }
                    : msg
                )
              );
            },
            (errorMsg: string) => {
              console.error('Deep learn streaming error:', errorMsg);
              error(`Deep learn error: ${errorMsg}`);
              setIsSubmitting(false);
            },
            () => {
              console.log('Deep learn streaming completed');
              setConversationHistory(prev => 
                prev.map(msg => 
                  msg.id === newAssistantMessage.id
                    ? { ...msg, isStreaming: false }
                    : msg
                )
              );
              setIsSubmitting(false);
            },
            conversationId // Pass existing conversation ID
          );
        }
        
      } catch (err) {
        console.error('Error submitting new topic question:', err);
        error('Failed to submit question. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitQuestion();
    }
  };

  return (
    <div className="h-[calc(100vh-88px)] flex flex-col bg-white overflow-hidden">
      {/* Header - 缩小上下padding */}
      <div className="flex items-center justify-between px-4 py-2 bg-white flex-shrink-0">
        <div className="flex items-center gap-[13px]">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="p-0 w-5 h-5 flex-shrink-0"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <h1 className="font-['Inter',Helvetica] text-[14px] font-medium text-black leading-normal">
            Learning Journey: {conversationHistory[0]?.content || 'Research Topic'}
          </h1>
        </div>

        <div className="flex items-center gap-[23px]">
          {/* Publish to Community 按钮 - 学习参考代码的样式 */}
          <button className="flex items-center justify-between w-[163px] h-[25px] flex-shrink-0 rounded-lg bg-[#80A5E4] px-3 py-0 font-['Inter'] text-[12px] font-medium text-white leading-normal">
            <span className="whitespace-nowrap">Publish to Community</span>
            <span className="ml-1 flex items-center">
              {/* Publish SVG */}
              <img
                src="/workspace/publish_icon.svg"
                alt="Publish Icon"
                className="w-[18px] h-[17px]"
              />
            </span>
          </button>

          {/* 分享按钮 - 学习参考代码的样式 */}
          <button
            className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0 mr-[18px]"
            aria-label="Share"
          >
            <img
              src="/workspace/share_icon.svg"
              alt="Share Icon"
              className="w-5 h-5"
            />
          </button>

          {/* 打印按钮 - 调整间距和图标粗细 */}
          <button
            className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0"
            aria-label="Print"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6,9 6,2 18,2 18,9" />
              <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content Area - 修复布局，防止页面滚动 */}
      <div className={`flex-1 flex overflow-hidden ${isSplit ? 'w-[95%]' : 'w-[70%]'}  self-center`}>
        {/* 整个内容区域居中 - 使用justify-center让内容组合在屏幕中央 */}
        <div className="flex-1 flex justify-center overflow-hidden">
          {/* 文字+sidebar组合 - 固定总宽度，在屏幕中央 */}
          <div className={`flex gap-6  ${isSplit ? 'max-w-[849px]' : 'max-w-[975px]'}`}>
            {/* Main Content - Scrollable - 固定宽度649px */}
            <div className={`${isSplit ? 'max-w-[449px]' : 'w-[649px]'}`}>
              <div className="h-[calc(100vh-280px)] overflow-y-auto py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-shrink-0">
                {/* Render conversation history */}
                {conversationHistory.map((message) => (
                  <div key={message.id}>
                    {message.type === 'user' ? (
                      <UserQuestionBubble 
                        content={message.content} 
                        time={message.timestamp} 
                        isSplit={isSplit} 
                      />
                    ) : (
                      <AssistantMessage 
                        message={message} 
                        isSplit={isSplit} 
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Fixed Bottom Input Box - Now using the separated component */}
              <QuestionInput
                conversationMode={conversationMode}
                inputText={inputText}
                isInputFocused={isInputFocused}
                isSubmitting={isSubmitting}
                selectedMode={selectedMode}
                onModeSelection={handleModeSelection}
                onModeChange={handleModeChange}
                onInputChange={setInputText}
                onInputFocus={() => setIsInputFocused(true)}
                onInputBlur={() => setIsInputFocused(false)}
                onKeyPress={handleKeyPress}
                onModeToggle={handleModeToggle}
              />
            </div>

            {/* Right Sidebar - 紧贴左侧文字，缩小间距 */}
            <InteractiveContent 
              interactiveData={interactiveData}
              isLoadingInteractive={isLoadingInteractive}
              isSplit={isSplit}
            />
          </div>
        </div>
      </div>
    </div >
  );
}

export default DeepLearnResponse;