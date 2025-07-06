import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { GlobeIcon, PaperclipIcon, FolderIcon, ChevronDownIcon } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent } from '../../../../../components/ui/card';
import { useState, useEffect } from 'react';
import { submitQuickSearchQuery } from '../../../../../api/workspaces/deep_learning/deepLearnMain';
import { submitDeepLearnDeepQuery } from '../../../../../api/workspaces/deep_learning/deepLearn_deeplearn';
import { useToast } from '../../../../../hooks/useToast';
import { getDeepLearningHistory, DeepLearningConversation, getHistoryConversation } from '../../../../../api/workspaces/deep_learning/getHistory';

interface DeepLearnProps {
  isSplit?: boolean;
  onBack?: () => void;
  onViewChange?: (view: string | null) => void;
}

const learningCards = [
  {
    id: 1,
    title: "Physical Understanding of Schrödinger Equation",
    tag: "Schrödinger Equation",
    tagColor: "bg-[#ffdd89]",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    title: "Medieval History and Story of the Crusades",
    tag: "The Crusades",
    tagColor: "bg-[#96d8ff]",
    image: "https://images.pexels.com/photos/161154/book-read-literature-pages-161154.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 3,
    title: "CRISPR Technology in the Context of Gene Editing and Specific Approach",
    tag: "CRISPR",
    tagColor: "bg-[#c2dcdc]",
    image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 4,
    title: "How to Make Oxygen from metals?",
    tag: "Oxygen",
    tagColor: "bg-[#96d8ff]",
    image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 5,
    title: "Explain to Me the Mechanism of Neuron Networks",
    tag: "Neuron Net",
    tagColor: "bg-[#f9aaaa]",
    image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 6,
    title: "Medieval History and Story of the Crusades",
    tag: "The Crusades",
    tagColor: "bg-[#96d8ff]",
    image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 7,
    title: "Explain to Me the Mechanism of Neuron Networks",
    tag: "Neuron Net",
    tagColor: "bg-[#f9aaaa]",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 8,
    title: "Medieval History and Story of the Crusades",
    tag: "The Crusades",
    tagColor: "bg-[#c88eff]",
    image: "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

function DeepLearn({ isSplit = false, onBack, onViewChange }: DeepLearnProps) {
  const { success, error } = useToast();
  const [selectedMode, setSelectedMode] = useState<'deep-learn' | 'quick-search'>('deep-learn');
  const [selectedTab, setSelectedTab] = useState<'trending' | 'history'>('history'); // Changed default to 'history'
  const [inputText, setInputText] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isAdditionalCommentsFocused, setIsAdditionalCommentsFocused] = useState(false);
  const [historyConversations, setHistoryConversations] = useState<DeepLearningConversation[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load history when component mounts or when tab changes to history
  useEffect(() => {
    if (selectedTab === 'history') {
      loadHistory();
    }
  }, [selectedTab]);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const historyData = await getDeepLearningHistory();
      
      if (historyData.success) {
        setHistoryConversations(historyData.deep_learning_conversations.items);
        console.log('📚 Loaded history conversations:', historyData.deep_learning_conversations.items.length);
      } else {
        error('Failed to load conversation history');
      }
    } catch (err) {
      console.error('Error loading history:', err);
      error('Failed to load conversation history. Please try again.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Helper function to generate UUID
  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Helper function to generate conversation ID in dl-c-{uuid} format
  const generateConversationId = (): string => {
    const uuid = generateUUID();
    return `dl-c-${uuid}`;
  };

  // Helper function to save conversation ID and query for this tab
  const saveTabData = (conversationId: string, query: string, mode: 'deep-learn' | 'quick-search') => {
    // Get current tab ID from the URL or generate one if needed
    const tabId = window.location.pathname + window.location.search;
    localStorage.setItem(`deeplearn_conversation_${tabId}`, conversationId);
    localStorage.setItem(`deeplearn_query_${tabId}`, query);
    localStorage.setItem(`deeplearn_mode_${tabId}`, mode);
    
    console.log(`💾 Saved conversation data for tab ${tabId}:`, {
      conversationId,
      query,
      mode
    });
  };

  // Helper function to clear related content for new conversations
  const clearRelatedContent = () => {
    const tabId = window.location.pathname + window.location.search;
    // Clear all related content data for this tab
    localStorage.removeItem(`deeplearn_interactive_${tabId}`);
    localStorage.removeItem(`deeplearn_streaming_content_${tabId}`);
    localStorage.removeItem(`deeplearn_streaming_complete_${tabId}`);
    localStorage.removeItem(`deeplearn_deep_content_${tabId}`);
    localStorage.removeItem(`deeplearn_deep_complete_${tabId}`);
    
    console.log('🧹 Cleared related content for new conversation');
  };

  // Helper function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get tag color based on concept tags
  const getTagColor = (tags: string[], index: number) => {
    const colors = ['bg-[#ffdd89]', 'bg-[#96d8ff]', 'bg-[#c2dcdc]', 'bg-[#f9aaaa]', 'bg-[#c88eff]'];
    return colors[index % colors.length];
  };

  const handleCardClick = (cardId: number) => {
    // Notify parent component to change view to response
    onViewChange?.('deep-learn-response');
  };

  const handleHistoryCardClick = (conversation: DeepLearningConversation) => {
    // Load the historical conversation data
    loadHistoryConversation(conversation);
  };

  const loadHistoryConversation = async (conversation: DeepLearningConversation) => {
    try {
      console.log('📖 Loading history conversation:', conversation.conversation_id);
      
      // Fetch the conversation history
      const historyData = await getHistoryConversation(conversation.conversation_id);
      
      if (historyData.success && historyData.conversation_json.length > 0) {
        const tabId = window.location.pathname + window.location.search;
        
        // Clear ALL existing conversation data for this tab
        localStorage.removeItem(`deeplearn_streaming_content_${tabId}`);
        localStorage.removeItem(`deeplearn_streaming_complete_${tabId}`);
        localStorage.removeItem(`deeplearn_deep_content_${tabId}`);
        localStorage.removeItem(`deeplearn_deep_complete_${tabId}`);
        localStorage.removeItem(`deeplearn_interactive_${tabId}`);
        localStorage.removeItem(`deeplearn_conversation_${tabId}`);
        localStorage.removeItem(`deeplearn_query_${tabId}`);
        localStorage.removeItem(`deeplearn_mode_${tabId}`);
        
        // Save the conversation data for loading in response view
        localStorage.setItem(`deeplearn_conversation_${tabId}`, conversation.conversation_id);
        localStorage.setItem(`deeplearn_query_${tabId}`, conversation.title);
        localStorage.setItem(`deeplearn_mode_${tabId}`, 'deep-learn'); // Default to deep-learn mode for history
        
        // Store the full conversation history
        localStorage.setItem(`deeplearn_history_data_${tabId}`, JSON.stringify(historyData.conversation_json));
        
        // Store the latest interactive data (from the last conversation item)
        const latestConversation = historyData.conversation_json[historyData.conversation_json.length - 1];
        if (latestConversation.interactive) {
          localStorage.setItem(`deeplearn_interactive_${tabId}`, JSON.stringify({
            success: true,
            conversation_title: latestConversation.interactive.conversation_title,
            topic: latestConversation.interactive.conversation_title,
            roadmap_node_index: latestConversation.roadmap_node_index,
            concept_map: { nodes: [] }, // Placeholder for concept map
            interactive_content: latestConversation.interactive,
            files_updated: {
              conversation_json: '',
              concept_map_json: ''
            },
            timestamp: latestConversation.time
          }));
          
          // Trigger event to update sidebar
          window.dispatchEvent(new CustomEvent('deeplearn-interactive-update', {
            detail: { 
              tabId, 
              data: {
                success: true,
                conversation_title: latestConversation.interactive.conversation_title,
                topic: latestConversation.interactive.conversation_title,
                roadmap_node_index: latestConversation.roadmap_node_index,
                concept_map: { nodes: [] },
                interactive_content: latestConversation.interactive,
                files_updated: {
                  conversation_json: '',
                  concept_map_json: ''
                },
                timestamp: latestConversation.time
              }
            }
          }));
        }
        
        // Mark as history conversation loaded
        localStorage.setItem(`deeplearn_history_loaded_${tabId}`, 'true');
        
        console.log('✅ Successfully loaded and stored history conversation data');
        
        // NOW navigate to response view after all data is properly stored
        onViewChange?.('deep-learn-response');
      } else {
        error('Failed to load conversation history');
      }
    } catch (err) {
      console.error('❌ Error loading history conversation:', err);
      error('Failed to load conversation history. Please try again.');
    }
  };

  const handleSubmitQuery = async () => {
    if (!inputText.trim()) {
      error('Please enter a topic to learn about');
      return;
    }

    try {
      // Clear related content when starting a new conversation
      clearRelatedContent();

      // Generate conversation ID for new conversation
      const conversationId = generateConversationId();
      
      console.log('🆔 Generated conversation ID:', conversationId);
      console.log('📝 Submitting query with params:', {
        query: inputText.trim(),
        mode: selectedMode,
        webSearch: webSearchEnabled,
        additionalComments: additionalComments.trim() || undefined,
        profile: 'profile-default',
        references: null,
        conversationId
      });

      // Save conversation data immediately
      saveTabData(conversationId, inputText.trim(), selectedMode);

      if (selectedMode === 'quick-search') {
        // For quick search, use the existing streaming endpoint
        const tabId = window.location.pathname + window.location.search;
        localStorage.setItem(`deeplearn_query_${tabId}`, inputText.trim());
        localStorage.setItem(`deeplearn_mode_${tabId}`, selectedMode);
        localStorage.setItem(`deeplearn_streaming_content_${tabId}`, ''); // Clear previous content
        
        // Navigate to response page immediately
        onViewChange?.('deep-learn-response');
        
        // Start streaming in the background
        await submitQuickSearchQuery(
          inputText.trim(),
          webSearchEnabled,
          additionalComments.trim() || undefined,
          'profile-default',
          null,
          (data: string) => {
            // Update streaming content in localStorage
            const currentContent = localStorage.getItem(`deeplearn_streaming_content_${tabId}`) || '';
            localStorage.setItem(`deeplearn_streaming_content_${tabId}`, currentContent + data);
            
            // Trigger a custom event to notify the response component
            window.dispatchEvent(new CustomEvent('deeplearn-streaming-update', {
              detail: { tabId, content: currentContent + data }
            }));
          },
          (errorMsg: string) => {
            console.error('Quick search streaming error:', errorMsg);
            error(`Streaming error: ${errorMsg}`);
          },
          () => {
            console.log('Quick search streaming completed');
            // Mark streaming as complete
            localStorage.setItem(`deeplearn_streaming_complete_${tabId}`, 'true');
            window.dispatchEvent(new CustomEvent('deeplearn-streaming-complete', {
              detail: { tabId }
            }));
          },
          undefined, // No existing conversation ID for new conversation
          conversationId // Pass the generated conversation ID
        );
      } else {
        // For deep learn, use the new deep learn endpoint
        const tabId = window.location.pathname + window.location.search;
        localStorage.setItem(`deeplearn_query_${tabId}`, inputText.trim());
        localStorage.setItem(`deeplearn_mode_${tabId}`, selectedMode);
        localStorage.setItem(`deeplearn_deep_content_${tabId}`, ''); // Clear previous content
        
        // Navigate to response page immediately
        onViewChange?.('deep-learn-response');
        
        // Start deep learn streaming in the background
        const returnedConversationId = await submitDeepLearnDeepQuery(
          inputText.trim(),
          webSearchEnabled,
          additionalComments.trim() || undefined,
          'profile-default',
          null,
          (data) => {
            // For deep learn, completely replace the content each time
            const contentToStore = JSON.stringify(data);
            localStorage.setItem(`deeplearn_deep_content_${tabId}`, contentToStore);
            
            // Trigger a custom event to notify the response component
            window.dispatchEvent(new CustomEvent('deeplearn-deep-update', {
              detail: { tabId, data }
            }));
          },
          (errorMsg: string) => {
            console.error('Deep learn streaming error:', errorMsg);
            error(`Deep learn error: ${errorMsg}`);
          },
          () => {
            console.log('Deep learn streaming completed');
            // Mark deep learn as complete
            localStorage.setItem(`deeplearn_deep_complete_${tabId}`, 'true');
            window.dispatchEvent(new CustomEvent('deeplearn-deep-complete', {
              detail: { tabId }
            }));
          },
          undefined, // No existing conversation ID for new conversation
          conversationId // Pass the generated conversation ID
        );

        console.log('✅ Deep learn started with conversation ID:', returnedConversationId);
      }

    } catch (err) {
      console.error('Error submitting query:', err);
      error('Failed to start research. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitQuery();
    }
  };

  const handleBackToEntry = () => {
    // Notify parent component to go back to default view
    onViewChange?.(null);
  };

  return (
    <div className=" overflow-y-auto h-[calc(100vh-88px)]">
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
                Deep Learn
              </h2>
              <p className="font-['Outfit',Helvetica] font-medium text-black text-[13px]">
                making true understanding unprecedentedly easy
              </p>
            </div>
          </div>
        </div>

        {/* Network icon + Deep Learn/Quick Search toggle - 与input box右对齐 */}
        <div className="w-full max-w-4xl mx-auto flex justify-end items-center gap-3 mb-4">
          <button
            onClick={() => setWebSearchEnabled(!webSearchEnabled)}
            className={`p-1 rounded transition-colors ${
              webSearchEnabled 
                ? 'text-black' 
                : 'text-gray-400'
            }`}
            title={webSearchEnabled ? 'Web search enabled' : 'Web search disabled'}
          >
            <GlobeIcon className="w-6 h-6" />
          </button>

          {/* Deep Learn / Quick Search 可选择切换 */}
          <div
            className="w-[200px] h-[35px] bg-[#ECF1F6] rounded-[17.5px] flex items-center cursor-pointer relative"
            onClick={() => setSelectedMode(selectedMode === 'deep-learn' ? 'quick-search' : 'deep-learn')}
          >
            <div
              className={`absolute top-1 w-[90px] h-[27px] bg-white rounded-[13.5px] transition-all duration-300 ease-in-out z-10 shadow-sm ${selectedMode === 'deep-learn' ? 'left-1' : 'left-[108px]'
                }`}
            />
            <div className="absolute left-4 h-full flex items-center z-20">
              <span className="font-['Inter',Helvetica] font-medium text-[#898989] text-xs">
                Deep Learn
              </span>
            </div>
            <div className="absolute right-4 h-full flex items-center z-20">
              <span className="font-['Inter',Helvetica] font-medium text-[#898989] text-xs">
                Quick Search
              </span>
            </div>
          </div>
        </div>

        {/* Search Input Section - Enhanced hover effects matching Problem Help */}
        <div className="flex justify-center mb-4">
          <Card className={`w-full max-w-4xl h-[155px] rounded-[13px] border shadow-[0px_3px_60px_1px_#4870d00d] transition-all duration-300 ${
            isInputFocused 
              ? 'border-[#80A5E4] shadow-[0px_2px_20px_0px_rgba(128,165,228,0.15)]' 
              : 'border-[#d0d9e3]'
          }`}>
            <CardContent className="p-5 h-full flex flex-col">
              {/* 主要输入框 - 支持多行，无滚动条，增强焦点效果，文字颜色改为黑色 */}
              <textarea
                className={`flex-1 text-base font-medium font-['Inter',Helvetica] text-black border-0 resize-none outline-none bg-transparent placeholder:text-[#969696] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-all duration-300 ${
                  isInputFocused ? 'caret-[#80A5E4]' : ''
                }`}
                placeholder="Enter the topic you'd like to learn..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                {/* Additional comments 输入框 - 添加 hover 效果 */}
                <textarea
                  className={`w-full sm:w-[391px] h-[30px] bg-[#ecf1f6] rounded-[5px] text-xs font-medium font-['Inter',Helvetica] text-black border-0 resize-none outline-none px-3 py-2 placeholder:text-[#898989] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-all duration-300 ${
                    isAdditionalCommentsFocused 
                      ? 'border border-[#80A5E4] shadow-[0px_1px_8px_0px_rgba(128,165,228,0.15)] caret-[#80A5E4]' 
                      : 'border border-transparent'
                  }`}
                  placeholder="Enter additional comments..."
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  onFocus={() => setIsAdditionalCommentsFocused(true)}
                  onBlur={() => setIsAdditionalCommentsFocused(false)}
                />

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-[25px] bg-[#edf2f7] rounded-lg text-xs font-medium text-[#6b6b6b] flex items-center gap-1"
                  >
                    <PaperclipIcon className="h-[18px] w-[18px]" />
                    Profile
                    <ChevronDownIcon className="w-3 h-3" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-[25px] bg-[#ecf1f6] rounded-lg text-xs font-medium text-[#6b6b6b] flex items-center gap-1"
                  >
                    <FolderIcon className="h-[19px] w-[19px]" />
                    <span className="hidden sm:inline">Reference From Drive</span>
                    <span className="sm:hidden">Drive</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trending/History tabs - 与input box左对齐 */}
        <div className="w-full max-w-4xl mx-auto flex justify-start mb-8">
          <div className="w-[140px] h-[32px] bg-[#ECF1F6] rounded-lg flex items-center relative cursor-pointer">
            <div
              className={`absolute top-1 w-[65px] h-[24px] bg-white rounded transition-all duration-300 ease-in-out z-10 shadow-sm ${selectedTab === 'trending' ? 'left-1' : 'left-[72px]'
                }`}
            />
            <div
              className="absolute left-3 h-full flex items-center z-20 cursor-pointer"
              onClick={() => setSelectedTab('trending')}
            >
              <span className="font-['Inter',Helvetica] font-medium text-[#898989] text-xs">
                Trending
              </span>
            </div>
            <div
              className="absolute right-3 h-full flex items-center z-20 cursor-pointer"
              onClick={() => setSelectedTab('history')}
            >
              <span className="font-['Inter',Helvetica] font-medium text-[#898989] text-xs">
                History
              </span>
            </div>
          </div>
        </div>

        {/* Content based on selected tab */}
        {selectedTab === 'trending' ? (
          /* Learning cards grid - 确保每行4个卡片 */
          <div className="grid grid-cols-4 gap-x-3 gap-y-6 max-w-[860px] mx-auto">
            {learningCards.map((card) => (
              <Card
                key={card.id}
                className="w-[203px] rounded-[10px] shadow-[0px_3px_60px_1px_#476fcf21] overflow-hidden hover:shadow-[0px_6px_80px_2px_#476fcf35] transition-all duration-200 cursor-pointer"
                onClick={() => handleCardClick(card.id)}
              >
                <CardContent className="p-0">
                  <div className="flex justify-center pt-[15px]">
                    <img
                      className="w-[163px] h-[106px] object-cover rounded"
                      alt="Topic illustration"
                      src={card.image}
                    />
                  </div>

                  <div className="p-3.5 pt-6">
                    <h3 className="font-['Inter',Helvetica] font-medium text-[#0064a2] text-[13px] mb-4 line-clamp-3">
                      {card.title}
                    </h3>

                    <div
                      className={`${card.tagColor} rounded-[10px] px-2.5 py-1 inline-block`}
                    >
                      <span className="font-['Inter',Helvetica] font-medium text-white text-[11px]">
                        {card.tag}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* History cards grid */
          <div className="grid grid-cols-4 gap-x-3 gap-y-6 max-w-[860px] mx-auto">
            {isLoadingHistory ? (
              // Loading state
              Array.from({ length: 8 }, (_, index) => (
                <Card
                  key={`loading-${index}`}
                  className="w-[203px] h-[200px] rounded-[10px] shadow-[0px_3px_60px_1px_#476fcf21] overflow-hidden animate-pulse"
                >
                  <CardContent className="p-0 h-full">
                    <div className="flex justify-center pt-[15px]">
                      <div className="w-[163px] h-[106px] bg-gray-200 rounded" />
                    </div>
                    <div className="p-3.5 pt-6">
                      <div className="h-4 bg-gray-200 rounded mb-4" />
                      <div className="h-6 bg-gray-200 rounded w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : historyConversations.length > 0 ? (
              // Real history data
              historyConversations.map((conversation, index) => (
                <Card
                  key={conversation.conversation_id}
                  className="w-[203px] rounded-[10px] shadow-[0px_3px_60px_1px_#476fcf21] overflow-hidden hover:shadow-[0px_6px_80px_2px_#476fcf35] transition-all duration-200 cursor-pointer"
                  onClick={() => handleHistoryCardClick(conversation)}
                >
                  <CardContent className="p-0">
                    <div className="flex justify-center pt-[15px]">
                      <img
                        className="w-[163px] h-[106px] object-cover rounded"
                        alt="Conversation cover"
                        src={conversation.cover_img}
                        onError={(e) => {
                          // Fallback to a default image if cover image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400';
                        }}
                      />
                    </div>

                    <div className="p-3.5 pt-6">
                      <h3 className="font-['Inter',Helvetica] font-medium text-[#0064a2] text-[13px] mb-4 line-clamp-3">
                        {conversation.title}
                      </h3>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {conversation.concept_tags.length > 0 ? (
                          conversation.concept_tags.slice(0, 2).map((tag, tagIndex) => (
                            <div
                              key={tagIndex}
                              className={`${getTagColor(conversation.concept_tags, tagIndex)} rounded-[10px] px-2.5 py-1 inline-block`}
                            >
                              <span className="font-['Inter',Helvetica] font-medium text-white text-[11px]">
                                {tag}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="bg-[#96d8ff] rounded-[10px] px-2.5 py-1 inline-block">
                            <span className="font-['Inter',Helvetica] font-medium text-white text-[11px]">
                              Deep Learn
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 font-['Inter',Helvetica]">
                        {formatDate(conversation.created_at)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Empty state
              <div className="col-span-4 flex flex-col items-center justify-center py-12">
                <div className="text-gray-500 text-lg mb-2">No conversation history found</div>
                <div className="text-gray-400 text-sm">
                  Start a new deep learning session to see your conversations here
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default DeepLearn