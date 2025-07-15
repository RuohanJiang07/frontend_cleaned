import React from 'react';
import { useState } from 'react';
import './ProblemHelp.css';

// Sample history data for demonstration
const SAMPLE_HISTORY = [
  {
    id: '1',
    title: 'Calculate the force required to move a 50kg box up a 30-degree incline with a coefficient of friction of 0.25',
    type: 'step-by-step',
    date: 'Apr 18, 2025, 12:56 PM' 
  },
  {
    id: '2',
    title: 'Find the derivative of f(x) = sin(x²) using the chain rule',
    type: 'solution',
    date: 'Apr 17, 2025, 10:23 AM' 
  },
  {
    id: '3',
    title: 'Solve the quadratic equation 3x² + 5x - 2 = 0 using the quadratic formula',
    type: 'step-by-step',
    date: 'Apr 16, 2025, 3:45 PM' 
  },
  {
    id: '4',
    title: 'Calculate the electric field at a point 10cm away from a point charge of 5μC',
    type: 'solution',
    date: 'Apr 15, 2025, 9:12 AM' 
  },
  {
    id: '5',
    title: 'Find the volume of a cone with height 12cm and base radius 5cm',
    type: 'step-by-step',
    date: 'Apr 14, 2025, 2:30 PM' 
  },
  {
    id: '6',
    title: 'Determine the pH of a solution with hydrogen ion concentration of 3.2 × 10⁻⁵ mol/L',
    type: 'solution',
    date: 'Apr 13, 2025, 11:18 AM' 
  },
  {
    id: '7',
    title: 'Calculate the momentum of a 2kg object moving at 5 m/s',
    type: 'step-by-step',
    date: 'Apr 12, 2025, 4:05 PM' 
  },
  {
    id: '8',
    title: 'Find the equivalent resistance of three resistors (10Ω, 15Ω, and 20Ω) connected in parallel',
    type: 'solution',
    date: 'Apr 11, 2025, 1:40 PM' 
  }
];

interface ProblemHelpProps {
  isSplit?: boolean;
  onBack?: () => void;
  onViewChange?: (view: string | null) => void;
}

function ProblemHelp({ isSplit = false, onBack, onViewChange }: ProblemHelpProps) {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [profileSelected, setProfileSelected] = useState(false);
  const [isUploadHovered, setIsUploadHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleProfile = () => {
    setProfileSelected(!profileSelected);
  };

  const handleUploadClick = () => {
    // Handle upload functionality here
    console.log('Upload clicked');
  };

  return (
    <div className="problem-help-container">
      {/* Header Section */}
      <div className="problem-help-header">
        <img
          src="/workspace/problemHelp/problemHelp.svg"
          alt="Problem Help Icon"
          className="problem-help-header-icon"
        />
        <div className="problem-help-header-text">
          <h1 className="problem-help-title font-outfit">Problem Help</h1>
          <p className="problem-help-subtitle font-outfit">It's ok to not understand every problem</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="problem-help-upload-section">
        <div 
          className="problem-help-upload-box"
          onClick={handleUploadClick}
          onMouseEnter={() => setIsUploadHovered(true)}
          onMouseLeave={() => setIsUploadHovered(false)}
        >
          <img
            src="/workspace/problemHelp/upload.svg"
            alt="Upload Icon"
            className="problem-help-upload-icon"
          />
          <span className="problem-help-upload-text">
            Drag or select additional contents here
          </span>
        </div>
      </div>

      {/* Input Section */}
      <div className="problem-help-input-section">
        {/* Input Box */}
        <div className={`problem-help-input-box ${isInputFocused ? 'focused' : ''}`}>          
          <textarea
            className="problem-help-input"
            placeholder="Enter your problem here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />

          {/* Model Selection Dropdown */}
          <div className="problem-help-model-dropdown">
            <img
              src="/workspace/problemHelp/stack-line.svg"
              alt="Model Icon"
              className="problem-help-model-icon"
            />
            <span className="problem-help-model-text">
              GPT-4o
            </span>
            <svg 
              width="19" 
              height="19" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#4C6694" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="problem-help-dropdown-arrow"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          
          {/* Buttons at the bottom right */}
          <div className="problem-help-buttons">
            {/* Profile Button */}
            <button 
              className={`problem-help-button ${profileSelected ? 'selected' : ''}`}
              onClick={toggleProfile}
              title="Select Profile" 
            >
              <img 
                src="/workspace/deepLearn/contacts-line.svg" 
                alt="Profile" 
                className="problem-help-button-icon"
                style={{ filter: profileSelected ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(39%) sepia(0%) saturate(0%) hue-rotate(147deg) brightness(94%) contrast(87%)' }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="problem-help-history-section">
        <div className="problem-help-history-header">
          <div className="problem-help-history-title">
            <img 
              src="/workspace/deepLearn/history.svg" 
              alt="History Icon"
              className="deep-learn-tab-button-icon"
              style={{ width: '20px', height: '20px', filter: 'brightness(0) saturate(100%) invert(32%) sepia(9%) saturate(2096%) hue-rotate(182deg) brightness(93%) contrast(87%)' }}
            />
            My History
          </div>
          <div className="problem-help-search-container">
            <img
              src="/workspace/problemHelp/search.svg"
              alt="Search Icon"
              className="problem-help-search-icon"
            />
            <input
              type="text"
              className="problem-help-search-input"
              placeholder="Search in workspace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* History Cards Section - Independent frame */}
      <div className={`problem-help-cards-container ${isSplit ? 'split' : ''}`}>
        {SAMPLE_HISTORY.map((item) => (
          <div key={item.id} className="problem-help-card">
            <div className="problem-help-card-title">
              {item.title}
            </div>
            <div className="problem-help-card-detail">
              <div className={`problem-help-card-tag ${item.type}`}>
                {item.type === 'step-by-step' ? 'Step-by-step' : 'Solution'}
              </div>
              <div className="problem-help-card-date">
                <img
                  src="/workspace/problemHelp/calendar.svg"
                  alt="Calendar"
                  className="problem-help-card-date-icon"
                />
                <span className="problem-help-card-date-text">
                  {item.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProblemHelp;