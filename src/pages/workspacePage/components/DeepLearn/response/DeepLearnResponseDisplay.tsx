import React from 'react';
import { DeepLearnStreamingData } from '../../../../../api/workspaces/deep_learning/deepLearn_deeplearn';

interface DeepLearnResponseDisplayProps {
  deepLearnData: DeepLearnStreamingData;
  isStreaming: boolean;
}

function DeepLearnResponseDisplay({ deepLearnData, isStreaming }: DeepLearnResponseDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Progress information */}
      {deepLearnData.progress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">
              Progress: {deepLearnData.progress.current_completions}/{deepLearnData.progress.total_expected_completions}
            </span>
            <span className="text-sm text-blue-600">
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
      <div className="text-sm text-gray-600 mb-4">
        {deepLearnData.stream_info}
      </div>

      {/* Newly completed item */}
      {deepLearnData.newly_completed_item && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="text-sm font-medium text-green-800">
            ✅ Completed: {deepLearnData.newly_completed_item.description}
          </div>
          <div className="text-xs text-green-600 mt-1">
            Section: {deepLearnData.newly_completed_item.section} | 
            Type: {deepLearnData.newly_completed_item.type}
          </div>
        </div>
      )}

      {/* LLM Response content */}
      {deepLearnData.llm_response && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">Response Content:</h4>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(deepLearnData.llm_response, null, 2)}
          </pre>
        </div>
      )}

      {/* Generation status */}
      {deepLearnData.generation_status && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h4 className="font-medium text-yellow-800 mb-2">Generation Status:</h4>
          <pre className="text-xs text-yellow-700 whitespace-pre-wrap">
            {JSON.stringify(deepLearnData.generation_status, null, 2)}
          </pre>
        </div>
      )}

      {/* Final status */}
      {deepLearnData.final && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-3">
          <div className="text-green-800 font-medium">
            🎉 Deep learning process completed!
          </div>
          <div className="text-sm text-green-600 mt-1">
            Total streams sent: {deepLearnData.total_streams_sent}
          </div>
        </div>
      )}

      {/* Loading indicator for ongoing process */}
      {isStreaming && !deepLearnData.final && (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Processing deep learning content...</span>
        </div>
      )}
    </div>
  );
}

export default DeepLearnResponseDisplay;