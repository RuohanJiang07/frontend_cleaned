import React, { useState, useEffect } from 'react';
import { Button } from '../../../../../components/ui/button';
import {
  ArrowLeftIcon,
  GlobeIcon,
  FolderIcon,
  PlayIcon,
  ExternalLinkIcon
} from 'lucide-react';
import { useToast } from '../../../../../hooks/useToast';
import { DeepLearnStreamingData, InteractiveResponse } from '../../../../../api/workspaces/deep_learning/deepLearn_deeplearn';
import { submitQuickSearchQuery } from '../../../../../api/workspaces/deep_learning/deepLearnMain';
import { submitDeepLearnDeepQuery } from '../../../../../api/workspaces/deep_learning/deepLearn_deeplearn';
import { ConceptMap } from '../../../../../components/workspacePage/conceptMap';

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

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Helper function to get YouTube thumbnail URL
const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    // Use maxresdefault for high quality, fallback to hqdefault if needed
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  // Fallback to a placeholder if not a YouTube URL
  return 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400';
};

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
  const renderContent = () => {
    if (message.mode === 'quick-search') {
      if (message.isStreaming && !message.streamingContent) {
        return (
          <div className="text-gray-500 italic">
            Loading response...
          </div>
        );
      } else if (message.streamingContent) {
        return (
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.streamingContent}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
            )}
          </div>
        );
      } else {
        return (
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
        );
      }
    } else {
      // Deep learn mode
      if (message.isStreaming && !message.deepLearnData) {
        return (
          <div className="text-gray-500 italic">
            Loading deep learn response...
          </div>
        );
      } else if (message.deepLearnData) {
        const data = message.deepLearnData;
        return (
          <div className="space-y-4">
            {/* Progress information */}
            {data.progress && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">
                    Progress: {data.progress.current_completions}/{data.progress.total_expected_completions}
                  </span>
                  <span className="text-sm text-blue-600">
                    {data.progress.progress_percentage}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.progress.progress_percentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Stream info */}
            <div className="text-sm text-gray-600 mb-4">
              {data.stream_info}
            </div>

            {/* Newly completed item */}
            {data.newly_completed_item && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="text-sm font-medium text-green-800">
                  ✅ Completed: {data.newly_completed_item.description}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Section: {data.newly_completed_item.section} | 
                  Type: {data.newly_completed_item.type}
                </div>
              </div>
            )}

            {/* LLM Response content */}
            {data.llm_response && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Response Content:</h4>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(data.llm_response, null, 2)}
                </pre>
              </div>
            )}

            {/* Generation status */}
            {data.generation_status && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="font-medium text-yellow-800 mb-2">Generation Status:</h4>
                <pre className="text-xs text-yellow-700 whitespace-pre-wrap">
                  {JSON.stringify(data.generation_status, null, 2)}
                </pre>
              </div>
            )}

            {/* Final status */}
            {data.final && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                <div className="text-green-800 font-medium">
                  🎉 Deep learning process completed!
                </div>
                <div className="text-sm text-green-600 mt-1">
                  Total streams sent: {data.total_streams_sent}
                </div>
              </div>
            )}

            {/* Loading indicator for ongoing process */}
            {message.isStreaming && !data.final && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Processing deep learning content...</span>
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
        );
      }
    }
  };

  return (
    <div className="prose max-w-none font-['Inter',Helvetica] text-sm leading-relaxed mb-6">
      <AnswerHeader 
        title={message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')} 
        tag={message.mode === 'deep-learn' ? 'Deep Learn' : 'Quick Search'} 
        isSplit={isSplit} 
      />
      <SourceWebpagesPlaceholders isSplit={isSplit} />
      
      <AnswerBody isSplit={isSplit}>
        {renderContent()}
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

  // Get the opposite mode for "Change to" text
  const getOppositeMode = () => {
    return conversationMode === 'follow-up' ? 'New Topic' : 'Follow Up';
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
              
              {/* Fixed Bottom Input Box - Enhanced hover effects, removed submit button */}
              <div className={`bg-white border rounded-2xl px-4 py-2 shadow-sm h-[120px] text-[12px] flex flex-col justify-between transition-all duration-300 ${
                isInputFocused 
                  ? 'border-[#80A5E4] shadow-[0px_2px_15px_0px_rgba(128,165,228,0.15)]' 
                  : 'border-gray-300'
              }`}>
                {/* Mode Selection Section - Only show if no mode is selected */}
                {!conversationMode && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-700 font-['Inter',Helvetica] text-[12px]">Start a</span>
                      <button 
                        className="bg-[#F9F9F9] border border-[#D9D9D9] text-[#4A4A4A] rounded-xl px-2 py-0.5 font-['Inter',Helvetica] text-[12px] hover:bg-gray-100 transition-colors"
                        onClick={() => handleModeSelection('follow-up')}
                      >
                        Follow Up
                      </button>
                      <span className="text-gray-500 font-['Inter',Helvetica] text-[12px]">or</span>
                      <button 
                        className="bg-[#F9F9F9] border border-[#D9D9D9] text-[#4A4A4A] rounded-xl px-2 py-0.5 font-['Inter',Helvetica] text-[12px] hover:bg-gray-100 transition-colors"
                        onClick={() => handleModeSelection('new-topic')}
                      >
                        New Topic
                      </button>
                    </div>
                  </div>
                )}

                {/* Input Area - Show when mode is selected */}
                {conversationMode && (
                  <div className="flex-1">
                    <textarea
                      className={`w-full h-full resize-none border-none outline-none bg-transparent font-['Inter',Helvetica] text-[12px] placeholder:text-gray-400 transition-all duration-300 ${
                        isInputFocused ? 'caret-[#80A5E4]' : ''
                      }`}
                      placeholder={`Type your ${conversationMode === 'follow-up' ? 'follow-up question' : 'new topic'} here...`}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      onKeyPress={handleKeyPress}
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                {/* Bottom Controls - Show when mode is selected */}
                {conversationMode && (
                  <div className="space-y-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-['Inter',Helvetica]">Change to</span>
                        <button 
                          className="bg-[#F9F9F9] border border-[#D9D9D9] text-[#4A4A4A] rounded-xl px-2 py-0.5 text-[12px] font-['Inter',Helvetica] hover:bg-gray-100 transition-colors"
                          onClick={handleModeChange}
                          disabled={isSubmitting}
                        >
                          {getOppositeMode()}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <GlobeIcon className="w-4 h-4 text-gray-500" />

                        {/* Deep Learn / Quick Search Toggle - Only show in new-topic mode */}
                        {conversationMode === 'new-topic' && (
                          <div
                            className="w-[180px] h-[30px] bg-[#ECF1F6] rounded-[16.5px] flex items-center cursor-pointer relative"
                            onClick={() => !isSubmitting && setSelectedMode(selectedMode === 'deep-learn' ? 'quick-search' : 'deep-learn')}
                          >
                            <div
                              className={`absolute top-1 w-[84px] h-[22px] bg-white rounded-[14px] transition-all duration-300 ease-in-out z-10 ${selectedMode === 'deep-learn' ? 'left-1.5' : 'left-[94px]'
                                }`}
                            />
                            <div className="absolute left-4 h-full flex items-center z-20">
                              <span className="text-[#6B6B6B] font-['Inter',Helvetica] text-xs font-medium">Deep Learn</span>
                            </div>
                            <div className="absolute right-3 h-full flex items-center z-20">
                              <span className="text-[#6B6B6B] font-['Inter',Helvetica] text-xs font-medium">Quick Search</span>
                            </div>
                          </div>
                        )}

                        <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-600" disabled={isSubmitting}>
                          <FolderIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - 紧贴左侧文字，缩小间距 */}
            <div className={`${isSplit ? 'pr-[-100px]' : 'p-0'} flex flex-col gap-[22px] py-6 flex-shrink-0 overflow-hidden`}>
              {/* Fixed Right Sidebar - Related Contents - 缩小顶部间距 */}
              <div className="flex flex-col flex-1 max-w-[220px] rounded-[13px] border border-[rgba(73,127,255,0.22)] bg-white shadow-[0px_1px_30px_2px_rgba(73,127,255,0.05)] overflow-hidden mt-3">
                {/* Title Section - 修复边框对齐问题 */}
                <div className="flex-shrink-0 w-full h-[58.722px] rounded-t-[13px] bg-[#ECF1F6] p-3 flex flex-col justify-between">
                  {/* First row - Icon and "Related Contents" text */}
                  <div className="flex items-center">
                    <img
                      src="/workspace/related_content_icon.svg"
                      alt="Related Contents Icon"
                      className="flex-shrink-0 mr-2 w-[18.432px] h-[18px]"
                    />
                    <span className="text-[#0064A2] font-['Inter'] text-[12px] font-medium leading-normal">
                      Related Contents
                    </span>
                  </div>

                  {/* Second row - "See more on this topic" text */}
                  <div className="ml-1">
                    <span className="text-black font-['Inter'] text-[14px] font-semibold leading-normal">
                      See more on this topic
                    </span>
                  </div>
                </div>

                {/* Scrollable Content Section - 添加Related Contents内容 */}
                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="bg-white p-3">
                    {isLoadingInteractive ? (
                      <div className="text-center py-4">
                        <div className="text-gray-500 text-sm">Loading...</div>
                      </div>
                    ) : interactiveData ? (
                      <>
                        {/* Related Videos */}
                        {interactiveData.interactive_content.recommended_videos.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-xs text-black mb-2">Related Videos</h4>
                            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                              <div className="w-full h-20 relative overflow-hidden">
                                <img
                                  src={getYouTubeThumbnail(interactiveData.interactive_content.recommended_videos[0].url)}
                                  alt="Video thumbnail"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to gradient background if thumbnail fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.className += ' bg-gradient-to-r from-yellow-400 via-blue-500 to-yellow-400';
                                    }
                                  }}
                                />
                                {/* Play button overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-12 h-12 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
                                    <PlayIcon className="w-6 h-6 text-white ml-1" />
                                  </div>
                                </div>
                                {/* YouTube logo overlay */}
                                <div className="absolute top-2 right-2">
                                  <div className="bg-red-600 text-white px-1 py-0.5 rounded text-xs font-bold">
                                    YouTube
                                  </div>
                                </div>
                              </div>
                              <div className="p-2">
                                <p className="text-[10px] text-black mb-1 font-medium line-clamp-2">
                                  {interactiveData.interactive_content.recommended_videos[0].title}
                                </p>
                                <div className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                                  <p className="text-[9px] text-red-600 font-medium">
                                    {interactiveData.interactive_content.recommended_videos[0].channel}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Related Webpages */}
                        {interactiveData.interactive_content.related_webpages.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-xs text-black mb-2">Related Webpages</h4>
                            <div className="grid grid-cols-2 gap-1.5">
                              {interactiveData.interactive_content.related_webpages.slice(0, 2).map((webpage, index) => (
                                <div key={index} className="bg-[#F0F0F0] rounded-lg p-2">
                                  <div className="text-[9px] font-medium text-black mb-1 line-clamp-2">
                                    {webpage.title}
                                  </div>
                                  <div className="text-[8px] text-gray-600 mb-1 line-clamp-2">
                                    {webpage.description}
                                  </div>
                                  <div className="text-[8px] text-blue-600 truncate">
                                    🌐 {new URL(webpage.url).hostname}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Related Concepts */}
                        {interactiveData.interactive_content.related_concepts.length > 0 && (
                          <div>
                            <h4 className="font-medium text-xs text-black mb-2">Related Concepts</h4>
                            <div className="space-y-2">
                              {interactiveData.interactive_content.related_concepts.slice(0, 3).map((concept, index) => (
                                <div key={index}>
                                  <div className="text-[9px] font-medium text-black mb-1">
                                    {concept.explanation}
                                  </div>
                                  <div className={`${
                                    index === 0 ? 'bg-[#D5EBF3] text-[#1e40af]' :
                                    index === 1 ? 'bg-[#E8D5F3] text-[#6b21a8]' :
                                    'bg-[#D5F3E8] text-[#059669]'
                                  } px-1.5 py-0.5 rounded text-[8px] inline-block`}>
                                    {concept.concept}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Show empty state when no interactive data */
                      <div className="text-center py-8 text-gray-400">
                        <p className="text-xs">Related content will appear here...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Fixed Right Sidebar - Concept Map - Use the separated component */}
              <ConceptMap />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default DeepLearnResponse;