import React from 'react';
import { Button } from '../../../../../components/ui/button';
import { GlobeIcon, FolderIcon } from 'lucide-react';

interface QuestionInputProps {
  conversationMode: 'follow-up' | 'new-topic' | null;
  inputText: string;
  isInputFocused: boolean;
  isSubmitting: boolean;
  selectedMode: 'deep-learn' | 'quick-search';
  onModeSelection: (mode: 'follow-up' | 'new-topic') => void;
  onModeChange: () => void;
  onInputChange: (value: string) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onModeToggle: () => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  conversationMode,
  inputText,
  isInputFocused,
  isSubmitting,
  selectedMode,
  onModeSelection,
  onModeChange,
  onInputChange,
  onInputFocus,
  onInputBlur,
  onKeyPress,
  onModeToggle
}) => {
  // Get the opposite mode for "Change to" text
  const getOppositeMode = () => {
    return conversationMode === 'follow-up' ? 'New Topic' : 'Follow Up';
  };

  return (
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
              onClick={() => onModeSelection('follow-up')}
            >
              Follow Up
            </button>
            <span className="text-gray-500 font-['Inter',Helvetica] text-[12px]">or</span>
            <button 
              className="bg-[#F9F9F9] border border-[#D9D9D9] text-[#4A4A4A] rounded-xl px-2 py-0.5 font-['Inter',Helvetica] text-[12px] hover:bg-gray-100 transition-colors"
              onClick={() => onModeSelection('new-topic')}
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
            onChange={(e) => onInputChange(e.target.value)}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            onKeyPress={onKeyPress}
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
                onClick={onModeChange}
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
                  onClick={() => !isSubmitting && onModeToggle()}
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
  );
};

export default QuestionInput;