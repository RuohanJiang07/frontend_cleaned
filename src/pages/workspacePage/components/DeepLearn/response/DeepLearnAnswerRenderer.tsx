import React from 'react';
import { DeepLearnStreamingData } from '../../../../../api/workspaces/deep_learning/deepLearn_deeplearn';

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

interface DeepLearnAnswerRendererProps {
  message: ConversationMessage;
  isSplit?: boolean;
}

const DeepLearnAnswerRenderer: React.FC<DeepLearnAnswerRendererProps> = ({ 
  message, 
  isSplit = false 
}) => {
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
                <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {data.llm_response}
                </pre>
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
    <div className={`${isSplit ? 'w-full' : ''}`}>
      {renderContent()}
    </div>
  );
};

export default DeepLearnAnswerRenderer;