import React, { useState, useEffect } from 'react';
import { Button } from '../../../../../components/ui/button';
import { ArrowLeftIcon, ShareIcon, PrinterIcon, MoreHorizontalIcon, CheckIcon, ThumbsUpIcon, ThumbsDownIcon, CopyIcon, PaperclipIcon, FolderIcon } from 'lucide-react';
import { submitProblemSolverSolution } from '../../../../../api/workspaces/problem_help/ProblemHelpMain';
import { useToast } from '../../../../../hooks/useToast';
import { MarkdownRenderer } from '../../../../../components/ui/markdown';

interface ProblemHelpResponseProps {
  onBack: () => void;
}

// Interface for parsing the streaming response
interface ProblemSolverResponse {
  steps?: Array<{
    title: string;
    content: string;
  }>;
  concepts?: Array<{
    title: string;
    explanation: string;
  }>;
  rawContent?: string;
}

// Conversation message interface
interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  streamingContent?: string;
}

function ProblemHelpResponse({ onBack }: ProblemHelpResponseProps) {
  const { error } = useToast();
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const [parsedResponse, setParsedResponse] = useState<ProblemSolverResponse>({});
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New state for conversation history
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);

  // Load saved data for this tab and initialize conversation history
  useEffect(() => {
    const tabId = window.location.pathname + window.location.search;
    const savedConversationId = localStorage.getItem(`problemhelp_conversation_${tabId}`);
    const savedQuery = localStorage.getItem(`problemhelp_query_${tabId}`);
    const savedStreamingContent = localStorage.getItem(`problemhelp_streaming_content_${tabId}`) || '';
    const isStreamingComplete = localStorage.getItem(`problemhelp_streaming_complete_${tabId}`) === 'true';

    console.log('📂 Loading saved problem help data for tab:', {
      tabId,
      conversationId: savedConversationId,
      query: savedQuery,
      streamingContentLength: savedStreamingContent.length,
      isStreamingComplete
    });

    if (savedQuery) {
      setUserQuery(savedQuery);
      if (savedConversationId) {
        setConversationId(savedConversationId);
      }

      // Initialize conversation history with the first message
      const initialUserMessage: ConversationMessage = {
        id: 'initial-user',
        type: 'user',
        content: savedQuery,
        timestamp: 'Me, ' + new Date().toLocaleString()
      };

      const initialAssistantMessage: ConversationMessage = {
        id: 'initial-assistant',
        type: 'assistant',
        content: savedQuery,
        timestamp: 'Assistant',
        isStreaming: !isStreamingComplete,
        streamingContent: savedStreamingContent
      };

      setConversationHistory([initialUserMessage, initialAssistantMessage]);
      
      if (savedStreamingContent) {
        setStreamingContent(savedStreamingContent);
        parseStreamingContent(savedStreamingContent);
      }
      setIsStreaming(!isStreamingComplete);

      // Listen for streaming updates
      const handleStreamingUpdate = (event: CustomEvent) => {
        if (event.detail.tabId === tabId) {
          setStreamingContent(event.detail.content);
          parseStreamingContent(event.detail.content);
          
          // Update conversation history
          setConversationHistory(prev => 
            prev.map(msg => 
              msg.id === 'initial-assistant'
                ? { ...msg, streamingContent: event.detail.content }
                : msg
            )
          );
        }
      };

      const handleStreamingComplete = (event: CustomEvent) => {
        if (event.detail.tabId === tabId) {
          setIsStreaming(false);
          setConversationHistory(prev => 
            prev.map(msg => 
              msg.id === 'initial-assistant'
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
        }
      };

      window.addEventListener('problemhelp-streaming-update', handleStreamingUpdate as EventListener);
      window.addEventListener('problemhelp-streaming-complete', handleStreamingComplete as EventListener);

      return () => {
        window.removeEventListener('problemhelp-streaming-update', handleStreamingUpdate as EventListener);
        window.removeEventListener('problemhelp-streaming-complete', handleStreamingComplete as EventListener);
      };
    }
  }, []);

  // Parse streaming content to extract steps and concepts
  const parseStreamingContent = (content: string) => {
    try {
      // Try to extract structured information from the streaming content
      const steps: Array<{title: string; content: string}> = [];
      const concepts: Array<{title: string; explanation: string}> = [];

      // Look for step patterns in the content
      const stepMatches = content.match(/Step \d+:([^\n]+)\n([\s\S]*?)(?=Step \d+:|$)/g);
      if (stepMatches) {
        stepMatches.forEach(stepMatch => {
          const titleMatch = stepMatch.match(/Step \d+:\s*(.+)/);
          const contentMatch = stepMatch.replace(/Step \d+:[^\n]+\n/, '').trim();
          if (titleMatch) {
            steps.push({
              title: titleMatch[1].trim(),
              content: contentMatch
            });
          }
        });
      }

      // Look for concept explanations (this is a simple heuristic)
      const conceptPatterns = [
        'Kinetic Friction',
        'Free-body Diagram',
        'Applied Force',
        'Static Friction',
        'Normal Force'
      ];

      conceptPatterns.forEach(concept => {
        if (content.includes(concept)) {
          // Extract explanation for this concept (simplified)
          const conceptRegex = new RegExp(`${concept}[:\\s]*([^\\n]{50,200})`, 'i');
          const match = content.match(conceptRegex);
          if (match) {
            concepts.push({
              title: concept,
              explanation: match[1].trim()
            });
          }
        }
      });

      setParsedResponse({
        steps: steps.length > 0 ? steps : undefined,
        concepts: concepts.length > 0 ? concepts : undefined,
        rawContent: content
      });
    } catch (error) {
      console.error('Error parsing streaming content:', error);
      setParsedResponse({ rawContent: content });
    }
  };

  // Handle submitting follow-up question
  const handleSubmitFollowUp = async () => {
    if (!followUpQuestion.trim() || isSubmitting) {
      return;
    }

    if (!conversationId) {
      error('No conversation ID found. Please start a new conversation.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      console.log('🔄 Submitting follow-up question in existing conversation:', {
        conversationId,
        query: followUpQuestion.trim(),
        isNewConversation: false
      });
      
      // Add user message to conversation history
      const newUserMessage: ConversationMessage = {
        id: `user-${Date.now()}`,
        type: 'user',
        content: followUpQuestion.trim(),
        timestamp: new Date().toLocaleString()
      };

      // Add assistant message placeholder
      const newAssistantMessage: ConversationMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: followUpQuestion.trim(),
        timestamp: 'Assistant',
        isStreaming: true,
        streamingContent: ''
      };

      setConversationHistory(prev => [...prev, newUserMessage, newAssistantMessage]);
      
      // Clear input immediately after submission
      const queryToSubmit = followUpQuestion.trim();
      setFollowUpQuestion('');

      // Start problem solver with existing conversation ID (new_conversation = false)
      await submitProblemSolverSolution(
        queryToSubmit,
        'profile-default',
        null,
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
          console.error('Problem solver follow-up streaming error:', errorMsg);
          error(`Streaming error: ${errorMsg}`);
          setIsSubmitting(false);
        },
        () => {
          console.log('Problem solver follow-up streaming completed');
          setConversationHistory(prev => 
            prev.map(msg => 
              msg.id === newAssistantMessage.id
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
          setIsSubmitting(false);
        },
        conversationId, // Pass existing conversation ID
        conversationId // Also pass as the generated conversation ID parameter
      );
      
    } catch (err) {
      console.error('Error submitting follow-up question:', err);
      error('Failed to submit follow-up question. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitFollowUp();
    }
  };

  // Render the main response content for a message
  const renderMessageContent = (message: ConversationMessage) => {
    if (message.type === 'user') {
      return (
        <div className="flex flex-col items-end mb-6">
          <span className="text-xs text-gray-500 font-['Inter',Helvetica] mb-2">
            {message.timestamp}
          </span>
          <div className="bg-[#E8F4FD] rounded-lg p-4 w-full max-w-4xl border border-[#B3D9FF]">
            <div className="text-sm text-black font-['Inter',Helvetica]">
              {message.content}
            </div>
          </div>
        </div>
      );
    }

    // Assistant message
    const contentToRender = message.streamingContent || '';
    
    if (message.isStreaming && !contentToRender) {
      return (
        <div className="text-gray-500 italic mb-6">
          Loading response...
        </div>
      );
    }

    return (
      <div className="w-full max-w-4xl ml-auto mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600 font-['Inter',Helvetica]">
            Answer, GPT-4o
          </span>
        </div>

        {/* Main Response Container - 65% left, 35% right */}
        <div className="flex gap-6">
          {/* GPT Response - 65% with Markdown Support */}
          <div className="w-[65%]">
            <MarkdownRenderer 
              content={contentToRender}
              variant="response"
              className="text-sm leading-relaxed"
            />
            
            {/* Streaming indicator */}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
            )}

            {/* Action Buttons - Only show for completed messages */}
            {!message.isStreaming && (
              <div className="flex justify-end mt-6">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 bg-[#ECF1F6] text-xs text-gray-600 hover:bg-[#e2e8f0] font-['Inter',Helvetica] rounded-lg"
                  >
                    <CheckIcon className="w-3 h-3 mr-1" />
                    Check Answer
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 bg-[#ECF1F6] text-xs text-gray-600 hover:bg-[#e2e8f0] font-['Inter',Helvetica] rounded-lg"
                  >
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Regenerate
                  </Button>

                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-gray-600 hover:text-gray-800"
                    >
                      <ThumbsUpIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-gray-600 hover:text-gray-800"
                    >
                      <ThumbsDownIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-gray-600 hover:text-gray-800"
                    >
                      <CopyIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Concept Cards - 35% */}
          <div className="w-[35%] space-y-4">
            {[
              {
                title: "Kinetic Friction",
                explanation: "Kinetic friction is the resistive force that acts against the motion of two surfaces that are already in relative motion. When an object is sliding or moving, kinetic friction tries to slow it down or oppose its motion along the surface."
              },
              {
                title: "Free-body Diagram (FBD)",
                explanation: "A free-body diagram (FBD) is a simple, essential tool in physics used to analyze the forces acting on an object. It is a diagram that shows all the external forces acting on one object, isolated from everything else."
              },
              {
                title: "Applied Force",
                explanation: "An applied force is any force that is deliberately exerted on an object by a person, machine, or another object to move it, hold it, or change its motion."
              }
            ].map((concept, index) => (
              <div key={index} className="bg-[#f2f7ff] rounded-lg p-4 border-l-4 border-[#90BBFF]">
                <h4 className="font-semibold text-sm text-black font-['Inter',Helvetica] mb-2">
                  {concept.title}
                </h4>
                <p className="text-xs text-black font-['Inter',Helvetica] leading-relaxed">
                  {concept.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className=" flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <h1 className="font-medium text-base text-black font-['Inter',Helvetica]">
            Problem Solution: {userQuery.substring(0, 50)}{userQuery.length > 50 ? '...' : ''}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button className="bg-[#6B94E4] hover:bg-[#5a82d1] text-white rounded-lg px-4 py-2 flex items-center gap-2 font-['Inter',Helvetica] text-sm">
            Publish to Community
            <ShareIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-2"
          >
            <ShareIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-2"
          >
            <PrinterIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-2"
          >
            <MoreHorizontalIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col h-[calc(100vh-320px)] bg-white">
        <div className="flex-1 overflow-y-auto max-w-6xl mx-auto px-8 py-6">
          {/* Render conversation history */}
          {conversationHistory.map((message) => (
            <div key={message.id}>
              {renderMessageContent(message)}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Input Area - Enhanced hover effects matching Deep Learn */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Input container with enhanced hover effects exactly like Deep Learn */}
          <div className={`relative bg-white border rounded-2xl h-32 p-4 transition-all duration-300 ${
            isInputFocused 
              ? 'border-[#80A5E4] shadow-[0px_2px_20px_0px_rgba(128,165,228,0.15)]' 
              : 'border-gray-300'
          }`}>
            <textarea
              className={`w-full h-full border-0 resize-none outline-none bg-transparent font-['Inter',Helvetica] text-sm placeholder:text-gray-500 pr-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-all duration-300 ${
                isInputFocused ? 'caret-[#80A5E4]' : ''
              }`}
              placeholder="Continue to ask; provide more details..."
              value={followUpQuestion}
              onChange={(e) => setFollowUpQuestion(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting}
            />

            {/* Icons positioned in bottom right corner */}
            <div className="absolute bottom-4 right-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 p-0 text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                <PaperclipIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 p-0 text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                <FolderIcon className="w-5 h-5" />
              </Button>
              
              {/* Submit button - only show when there's text */}
              {followUpQuestion.trim() && (
                <Button
                  onClick={handleSubmitFollowUp}
                  disabled={isSubmitting}
                  className="bg-[#80A5E4] hover:bg-[#6b94d6] text-white rounded-lg px-3 py-1 text-xs font-['Inter',Helvetica] ml-2"
                >
                  {isSubmitting ? 'Solving...' : 'Ask'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemHelpResponse;