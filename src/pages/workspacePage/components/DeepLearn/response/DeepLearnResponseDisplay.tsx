import React from 'react';
import { DeepLearnStreamingData } from '../../../../../api/workspaces/deep_learning/deepLearn_deeplearn';

interface DeepLearnResponseDisplayProps {
  deepLearnData: DeepLearnStreamingData;
  isStreaming: boolean;
}

function DeepLearnResponseDisplay({ deepLearnData, isStreaming }: DeepLearnResponseDisplayProps) {
  // Helper function to render LLM response content as normal text
  const renderLLMResponse = (llmResponse: any) => {
    if (!llmResponse) return null;

    // If it's a string, render it directly
    if (typeof llmResponse === 'string') {
      return (
        <div className="text-black font-['Inter',Helvetica] text-sm leading-relaxed whitespace-pre-wrap">
          {llmResponse}
        </div>
      );
    }

    // If it's an object, try to extract meaningful content
    if (typeof llmResponse === 'object') {
      // Look for common content fields
      const content = llmResponse.content || 
                    llmResponse.text || 
                    llmResponse.response || 
                    llmResponse.message ||
                    JSON.stringify(llmResponse, null, 2);

      return (
        <div className="text-black font-['Inter',Helvetica] text-sm leading-relaxed whitespace-pre-wrap">
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Progress information */}
      {deepLearnData.progress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800 font-['Inter',Helvetica]">
              Progress: {deepLearnData.progress.current_completions}/{deepLearnData.progress.total_expected_completions}
            </span>
            <span className="text-sm text-blue-600 font-['Inter',Helvetica]">
              {deepLearnData.progress.progress_percentage}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${deepLearnData.progress.progress_percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Stream info */}
      {deepLearnData.stream_info && (
        <div className="text-sm text-gray-600 mb-4 font-['Inter',Helvetica]">
          {deepLearnData.stream_info}
        </div>
      )}

      {/* Newly completed item */}
      {deepLearnData.newly_completed_item && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="text-sm font-medium text-green-800 font-['Inter',Helvetica]">
            ✅ Completed: {deepLearnData.newly_completed_item.description}
          </div>
          <div className="text-xs text-green-600 mt-1 font-['Inter',Helvetica]">
            Section: {deepLearnData.newly_completed_item.section} | 
            Type: {deepLearnData.newly_completed_item.type}
          </div>
        </div>
      )}

      {/* LLM Response content - Now rendered as normal text */}
      {deepLearnData.llm_response && (
        <div className="mb-4">
          {renderLLMResponse(deepLearnData.llm_response)}
        </div>
      )}

      {/* Generation status - Only show if it contains useful information */}
      {deepLearnData.generation_status && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="text-sm font-medium text-yellow-800 mb-2 font-['Inter',Helvetica]">
            Generation Status
          </div>
          <div className="text-sm text-yellow-700 font-['Inter',Helvetica]">
            {typeof deepLearnData.generation_status === 'string' 
              ? deepLearnData.generation_status 
              : JSON.stringify(deepLearnData.generation_status, null, 2)
            }
          </div>
        </div>
      )}

      {/* Final status */}
      {deepLearnData.final && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-3">
          <div className="text-green-800 font-medium font-['Inter',Helvetica]">
            🎉 Deep learning process completed!
          </div>
          {deepLearnData.total_streams_sent && (
            <div className="text-sm text-green-600 mt-1 font-['Inter',Helvetica]">
              Total streams sent: {deepLearnData.total_streams_sent}
            </div>
          )}
        </div>
      )}

      {/* Loading indicator for ongoing process */}
      {isStreaming && !deepLearnData.final && (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm font-['Inter',Helvetica]">Processing deep learning content...</span>
        </div>
      )}
    </div>
  );
}

export default DeepLearnResponseDisplay;