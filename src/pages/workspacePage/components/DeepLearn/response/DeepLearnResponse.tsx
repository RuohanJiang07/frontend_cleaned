import React, { useState, useEffect } from 'react';
import { Button } from '../../../../../components/ui/button';
import ForceGraph2D, { LinkObject, NodeObject } from 'react-force-graph-2d';
import {
  ArrowLeftIcon,
  GlobeIcon,
  FolderIcon,
  PlayIcon,
  ExternalLinkIcon
} from 'lucide-react';
import { getStreamingResponse, StreamingData, InteractiveResponse } from '../../../../../api/workspaces/deep_learning/deepLearnMain';
import { useToast } from '../../../../../hooks/useToast';

interface DeepLearnResponseProps {
  onBack: () => void;
  isSplit?: boolean;
}

interface CustomNode extends NodeObject {
  id: string;
  x?: number;
  y?: number;
  color?: string;
  __bckgDimensions?: [number, number];
}

const myData: { nodes: CustomNode[]; links: LinkObject[] } = {
  nodes: [
    { id: 'Black Hole' },
    { id: 'White dwarf' },
    { id: 'Type I Supernova' },
    { id: 'Gravity Wave' },
    { id: 'Stretched Horizon' },
    { id: 'Cosmology' },
  ],
  links: [
    { source: 'Black Hole', target: 'White dwarf' },
    { source: 'Black Hole', target: 'Type I Supernova' },
    { source: 'Type I Supernova', target: 'White dwarf' },
    { source: 'Type I Supernova', target: 'Gravity Wave' },
    { source: 'Black Hole', target: 'Stretched Horizon' },
    { source: 'Black Hole', target: 'Cosmology' },
  ],
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

function DeepLearnResponse({ onBack, isSplit = false }: DeepLearnResponseProps) {
  const { error } = useToast();
  const [selectedMode, setSelectedMode] = useState<'deep-learn' | 'quick-search'>('deep-learn');
  const [hoverNode, setHoverNode] = useState<CustomNode | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [conversationId, setConversationId] = useState<string>('');
  const [interactiveData, setInteractiveData] = useState<InteractiveResponse | null>(null);
  const [isLoadingInteractive, setIsLoadingInteractive] = useState(true);

  // Load saved data for this tab
  useEffect(() => {
    const tabId = window.location.pathname + window.location.search;
    const savedConversationId = localStorage.getItem(`deeplearn_conversation_${tabId}`);
    const savedQuery = localStorage.getItem(`deeplearn_query_${tabId}`);
    const savedMode = localStorage.getItem(`deeplearn_mode_${tabId}`) as 'deep-learn' | 'quick-search';
    const savedStreamingContent = localStorage.getItem(`deeplearn_streaming_content_${tabId}`) || '';
    const isStreamingComplete = localStorage.getItem(`deeplearn_streaming_complete_${tabId}`) === 'true';
    const savedInteractiveData = localStorage.getItem(`deeplearn_interactive_${tabId}`);

    console.log('Loading saved data for tab:', {
      tabId,
      conversationId: savedConversationId,
      query: savedQuery,
      mode: savedMode,
      streamingContentLength: savedStreamingContent.length,
      isStreamingComplete,
      hasInteractiveData: !!savedInteractiveData
    });

    if (savedQuery) {
      setUserQuery(savedQuery);
      if (savedMode) {
        setSelectedMode(savedMode);
      }

      if (savedMode === 'quick-search') {
        // For quick search, load streaming content
        setStreamingContent(savedStreamingContent);
        setIsLoading(!isStreamingComplete);
        
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
            setStreamingContent(event.detail.content);
          }
        };

        const handleStreamingComplete = (event: CustomEvent) => {
          if (event.detail.tabId === tabId) {
            setIsLoading(false);
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
        window.addEventListener('deeplearn-interactive-update', handleInteractiveUpdate as EventListener);

        return () => {
          window.removeEventListener('deeplearn-streaming-update', handleStreamingUpdate as EventListener);
          window.removeEventListener('deeplearn-streaming-complete', handleStreamingComplete as EventListener);
          window.removeEventListener('deeplearn-interactive-update', handleInteractiveUpdate as EventListener);
        };
      } else if (savedConversationId) {
        // For deep learn, start streaming if we have a conversation ID
        setConversationId(savedConversationId);
        console.log('Starting streaming for deep learn mode');
        startStreaming(savedConversationId);
        setIsLoadingInteractive(false); // Deep learn doesn't use interactive data
      }
    } else {
      console.log('No saved data found, using defaults');
      setIsLoading(false);
      setIsLoadingInteractive(false);
    }
  }, []);

  const startStreaming = async (convId: string) => {
    try {
      console.log('Starting streaming for conversation:', convId);
      setIsLoading(true);
      setStreamingContent('');

      await getStreamingResponse(
        convId,
        (data: StreamingData) => {
          console.log('Received streaming chunk:', data);
          if (data.content) {
            setStreamingContent(prev => {
              const newContent = prev + data.content;
              console.log('Updated content length:', newContent.length);
              return newContent;
            });
          }
        },
        (errorMsg: string) => {
          console.error('Streaming error:', errorMsg);
          error(`Streaming error: ${errorMsg}`);
          setIsLoading(false);
        },
        () => {
          console.log('Streaming completed');
          setIsLoading(false);
        }
      );
    } catch (err) {
      console.error('Failed to start streaming:', err);
      error('Failed to start streaming response');
      setIsLoading(false);
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
            Learning Journey: {userQuery || 'Research Topic'}
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
                {/* User Question - 学习参考代码的conversation样式 */}
                <UserQuestionBubble 
                  content={userQuery || "Research topic"} 
                  time="Me, Jun 1, 9:50 PM" 
                  isSplit={isSplit} 
                />

                {/* AI Response - 学习参考代码的conversation样式 */}
                <div className="prose max-w-none font-['Inter',Helvetica] text-sm leading-relaxed">
                  <AnswerHeader 
                    title={userQuery || "Research topic"} 
                    tag={selectedMode === 'deep-learn' ? 'Deep Learn' : 'Quick Search'} 
                    isSplit={isSplit} 
                  />
                  <SourceWebpagesPlaceholders isSplit={isSplit} />
                  
                  {/* 🎯 Conversation content area - 真正的实时streaming！ */}
                  <AnswerBody isSplit={isSplit}>
                    {isLoading && !streamingContent ? (
                      // 只在没有内容时显示简单的loading提示
                      <div className="text-gray-500 italic">
                        Loading response...
                      </div>
                    ) : streamingContent ? (
                      // 🚀 实时显示streaming内容 - 收到一段显示一段！
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {streamingContent}
                        {/* 如果还在loading，显示一个简单的cursor */}
                        {isLoading && (
                          <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                        )}
                      </div>
                    ) : selectedMode === 'deep-learn' ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>Deep learning response will appear here...</p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Response content will appear here...</p>
                      </div>
                    )}
                  </AnswerBody>
                </div>
              </div>
              
              {/* Fixed Bottom Input Box - 与文字对齐，使用相同的649px宽度，并计算正确的偏移量 */}
              <div className=" bg-white border border-gray-300 rounded-2xl px-4 py-2 shadow-sm h-[120px] text-[12px] flex flex-col justify-between">
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-['Inter',Helvetica] text-[12px]">Start a</span>
                    <button className="bg-[#F9F9F9] border border-[#D9D9D9] text-[#4A4A4A] rounded-xl px-2 py-0.5 font-['Inter',Helvetica] text-[12px] hover:bg-gray-100">
                      Follow Up
                    </button>
                    <span className="text-gray-500 font-['Inter',Helvetica] text-[12px]">or</span>
                    <button className="bg-[#F9F9F9] border border-[#D9D9D9] text-[#4A4A4A] rounded-xl px-2 py-0.5 font-['Inter',Helvetica] text-[12px] hover:bg-gray-100">
                      New Topic
                    </button>
                  </div>
                </div>

                <div className="space-y-0">
                  <div className="text-sm text-gray-600 font-['Inter',Helvetica]">
                    Note: If already selected
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-['Inter',Helvetica]">Change to</span>
                      <button className="bg-[#F9F9F9] border border-[#D9D9D9] text-[#4A4A4A] rounded-xl px-2 py-0.5 text-[12px] font-['Inter',Helvetica] hover:bg-gray-100">
                        New Topic
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <GlobeIcon className="w-4 h-4 text-gray-500" />

                      {/* Deep Learn / Quick Search Toggle */}
                      <div
                        className="w-[180px] h-[30px] bg-[#ECF1F6] rounded-[16.5px] flex items-center cursor-pointer relative"
                        onClick={() => setSelectedMode(selectedMode === 'deep-learn' ? 'quick-search' : 'deep-learn')}
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

                      <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-600">
                        <FolderIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
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
                              <div className="w-full h-20 bg-gradient-to-r from-yellow-400 via-blue-500 to-yellow-400 relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                                <div className="text-center z-10">
                                  <div className="text-yellow-300 font-bold text-xs mb-1">VIDEO</div>
                                  <div className="flex items-center justify-center mb-1">
                                    <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center mr-1">
                                      <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
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
                      /* Default placeholder content for non-quick-search modes */
                      <>
                        {/* Related Videos */}
                        <div className="mb-4">
                          <h4 className="font-medium text-xs text-black mb-2">Related Videos</h4>
                          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                            <div className="w-full h-20 bg-gradient-to-r from-yellow-400 via-blue-500 to-yellow-400 relative flex items-center justify-center">
                              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                              <div className="text-center z-10">
                                <div className="text-yellow-300 font-bold text-xs mb-1">QUANTUM</div>
                                <div className="flex items-center justify-center mb-1">
                                  <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center mr-1">
                                    <div className="w-2 h-2 bg-black rounded-full"></div>
                                  </div>
                                  <div className="text-blue-400 text-xs">⚡ ⚡</div>
                                </div>
                                <div className="text-white font-bold text-xs">ENTANGLEMENT</div>
                              </div>
                            </div>
                            <div className="p-2">
                              <p className="text-[10px] text-black mb-1 font-medium">Quantum Entanglement: Explained in REALLY SIMPLE Words</p>
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                                <p className="text-[9px] text-red-600 font-medium">Science ABC</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Related Webpages */}
                        <div className="mb-4">
                          <h4 className="font-medium text-xs text-black mb-2">Related Webpages</h4>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-[#F0F0F0] rounded-lg p-2">
                              <div className="text-[9px] font-medium text-black mb-1">ScienceDirect discusses quantum entanglement.</div>
                              <div className="text-[8px] text-gray-600 mb-1">Explore the phenomenon crucial for quantum information processing applications.</div>
                              <div className="text-[8px] text-black mb-1">Quantum Entanglement - an o...</div>
                              <div className="text-[8px] text-orange-600">📄 ScienceDirect.com</div>
                            </div>
                            <div className="bg-[#F0F0F0] rounded-lg p-2">
                              <div className="text-[9px] font-medium text-black mb-1">NASA's take entanglement</div>
                              <div className="text-[8px] text-gray-600 mb-1">Learn about nature of par common orig</div>
                              <div className="text-[8px] text-black mb-1">What is Qua</div>
                              <div className="text-[8px] text-blue-600">🌐 NASA Sc</div>
                            </div>
                          </div>
                        </div>

                        {/* Related Concepts */}
                        <div>
                          <h4 className="font-medium text-xs text-black mb-2">Related Concepts</h4>
                          <div className="space-y-2">
                            <div>
                              <div className="text-[9px] font-medium text-black mb-1">Understand the fundamental principles of quantum entanglement.</div>
                              <div className="bg-[#D5EBF3] text-[#1e40af] px-1.5 py-0.5 rounded text-[8px] inline-block">
                                Interconnected Fate
                              </div>
                            </div>
                            <div className="bg-[#E8D5F3] text-[#6b21a8] px-1.5 py-0.5 rounded text-[8px] inline-block">
                              Instantaneous Correlation
                            </div>
                            <div className="bg-[#D5F3E8] text-[#059669] px-1.5 py-0.5 rounded text-[8px] inline-block">
                              Randomness
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Fixed Right Sidebar - Concept Map - 修复边框对齐 */}
              <div className="flex flex-col max-w-[220px] h-[228.464px] flex-shrink-0 rounded-[13px] border border-[rgba(157,155,179,0.30)] bg-white shadow-[0px_1px_30px_2px_rgba(242,242,242,0.63)] overflow-hidden">
                {/* Header Section - 修复边框对齐问题 */}
                <div className="flex-shrink-0 w-full h-[59.736px] bg-[rgba(228,231,239,0.62)] rounded-t-[13px] p-3 flex flex-col justify-between">
                  {/* First row - Icon and "Concept Map" text */}
                  <div className="flex items-center">
                    <img
                      src="/workspace/concept_map_icon.svg"
                      alt="Concept Map Icon"
                      className="mr-2 w-[17px] h-[17px]"
                    />
                    <span className="text-[#63626B] font-['Inter'] text-[12px] font-medium leading-normal">
                      Concept Map
                    </span>
                  </div>

                  {/* Second row - "Your Learning Roadmap" text */}
                  <div className="ml-1">
                    <span className="text-black font-['Inter'] text-[14px] font-semibold leading-normal">
                      Your Learning Roadmap
                    </span>
                  </div>
                </div>

                {/* Content Section - Scaled Concept Map */}
                <div className="flex-1 overflow-hidden">
                  <div className="w-full h-full bg-white">
                    <ForceGraph2D
                      graphData={myData}
                      width={256}
                      height={168}
                      nodeAutoColorBy="group"
                      onNodeHover={(node: NodeObject | null) => {
                        setHoverNode(node as CustomNode | null);
                      }}
                      nodeCanvasObject={(node: CustomNode, ctx, globalScale) => {
                        const label = node.id;
                        const fontSize = 10 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;

                        const textWidth = ctx.measureText(label).width;
                        const bckgDimensions: [number, number] = [
                          textWidth + fontSize * 0.2,
                          fontSize + fontSize * 0.2,
                        ];
                        const x = node.x ?? 0;
                        const y = node.y ?? 0;

                        if (hoverNode?.id === node.id) {
                          ctx.save();
                          ctx.shadowColor = node.color || '#4f46e5';
                          ctx.shadowBlur = 15;
                          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                          ctx.fillRect(x - bckgDimensions[0] / 2, y - bckgDimensions[1] / 2, ...bckgDimensions);
                          ctx.restore();
                        } else {
                          ctx.fillStyle = 'rgba(255, 255, 255, 0)';
                          ctx.fillRect(x - bckgDimensions[0] / 2, y - bckgDimensions[1] / 2, ...bckgDimensions);
                        }

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = node.color ?? '#000';
                        ctx.fillText(label, x, y);

                        node.__bckgDimensions = bckgDimensions;
                      }}
                      linkPointerAreaPaint={(node: CustomNode, color, ctx) => {
                        const bckg = node.__bckgDimensions;
                        if (bckg) {
                          ctx.fillStyle = color;
                          ctx.fillRect(
                            (node.x ?? 0) - bckg[0] / 2,
                            (node.y ?? 0) - bckg[1] / 2,
                            ...bckg
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default DeepLearnResponse;