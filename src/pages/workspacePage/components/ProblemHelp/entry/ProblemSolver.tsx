import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent } from '../../../../../components/ui/card';
import { Input } from '../../../../../components/ui/input';
import { 
  ChevronDownIcon, 
  UserIcon, 
  FileTextIcon,
  SearchIcon
} from 'lucide-react';
import './ProblemSolver.css';

interface ProblemHistoryItem {
  id: number;
  problem: string;
  date: string;
  type: 'Step-by-step' | 'Solution';
}

function ProblemSolver() {
  const [problemText, setProblemText] = useState('');
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const [selectedMode, setSelectedMode] = useState<'step-by-step' | 'solution'>('step-by-step');
  const [sortBy, setSortBy] = useState('Date/Type');

  // Sample history data
  const historyItems: ProblemHistoryItem[] = [
    {
      id: 1,
      problem: "What's the derivation of x^2",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Step-by-step"
    },
    {
      id: 2,
      problem: "Why does a rainbow contain a pure spread...",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Solution"
    },
    {
      id: 3,
      problem: "Why does a rainbow contain a pure spread...",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Solution"
    },
    {
      id: 4,
      problem: "What's the derivation of x^2",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Step-by-step"
    },
    {
      id: 5,
      problem: "Why does a rainbow contain a pure spread...",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Step-by-step"
    },
    {
      id: 6,
      problem: "Why does a rainbow contain a pure spread...",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Solution"
    },
    {
      id: 7,
      problem: "What's the derivation of x^2",
      date: "Apr 18, 2025, 12:56 PM",
      type: "Step-by-step"
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(historyItems.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return historyItems.slice(startIndex, endIndex);
  };

  return (
    <main className="problem-solver-main">
      {/* Header with icon and title */}
      <div className="problem-solver-header">
        <div className="header-content">
          <img
            className="header-logo"
            alt="Hyperknow logo"
            src="/main/landing_page/hyperknow_logo 1.svg"
          />
          <div className="header-text">
            <h2 className="header-title">Problem Help</h2>
            <p className="header-subtitle">get step-by-step help for problem sets</p>
          </div>
        </div>
      </div>

      {/* Upload area */}
      <div className="upload-container">
        <div className="upload-area">
          <div className="upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 37 35" fill="none">
              <path d="M24.333 23.3334L18.4996 17.5001M18.4996 17.5001L12.6663 23.3334M18.4996 17.5001L18.4996 30.6251M30.735 26.8188C32.1574 26.0434 33.2811 24.8164 33.9286 23.3314C34.5762 21.8464 34.7108 20.1881 34.3112 18.6182C33.9116 17.0482 33.0006 15.656 31.7219 14.6614C30.4432 13.6667 28.8696 13.1261 27.2496 13.1251H25.4121C24.9707 11.4177 24.148 9.83265 23.0058 8.48903C21.8636 7.1454 20.4317 6.07819 18.8177 5.36763C17.2037 4.65707 15.4496 4.32164 13.6873 4.38657C11.925 4.4515 10.2004 4.9151 8.64302 5.74251C7.08568 6.56991 5.73617 7.7396 4.69596 9.16364C3.65575 10.5877 2.95189 12.229 2.63732 13.9642C2.32274 15.6994 2.40562 17.4834 2.87974 19.1819C3.35386 20.8805 4.20686 22.4495 5.37464 23.7709" stroke="#B3B3B3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="upload-text">Drag or upload additional context here</p>
        </div>
      </div>

      {/* Input box */}
      <div className="input-container">
        <div className="input-box">
          <textarea
            className="input-textarea"
            placeholder="Paste or type your problem here..."
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
          />
          
          {/* GPT-4o button */}
          <Button variant="outline" size="sm" className="gpt-button">
            <div className="gpt-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8.00033 10.0001C8.55588 10.0001 9.0281 9.80564 9.41699 9.41675C9.80588 9.02786 10.0003 8.55564 10.0003 8.00008C10.0003 7.44453 9.80588 6.9723 9.41699 6.58341C9.0281 6.19453 8.55588 6.00008 8.00033 6.00008C7.44477 6.00008 6.97255 6.19453 6.58366 6.58341C6.19477 6.9723 6.00033 7.44453 6.00033 8.00008C6.00033 8.55564 6.19477 9.02786 6.58366 9.41675C6.97255 9.80564 7.44477 10.0001 8.00033 10.0001ZM8.00033 11.3334C7.0781 11.3334 6.29199 11.0084 5.64199 10.3584C4.99199 9.70841 4.66699 8.9223 4.66699 8.00008C4.66699 7.07786 4.99199 6.29175 5.64199 5.64175C6.29199 4.99175 7.0781 4.66675 8.00033 4.66675C8.92255 4.66675 9.70866 4.99175 10.3587 5.64175C11.0087 6.29175 11.3337 7.07786 11.3337 8.00008C11.3337 8.9223 11.0087 9.70841 10.3587 10.3584C9.70866 11.0084 8.92255 11.3334 8.00033 11.3334ZM3.33366 8.66675H0.666992V7.33341H3.33366V8.66675ZM15.3337 8.66675H12.667V7.33341H15.3337V8.66675ZM7.33366 3.33341V0.666748H8.66699V3.33341H7.33366ZM7.33366 15.3334V12.6667H8.66699V15.3334H7.33366ZM4.26699 5.16675L2.58366 3.55008L3.53366 2.56675L5.13366 4.23341L4.26699 5.16675ZM12.467 13.4334L10.8503 11.7501L11.7337 10.8334L13.417 12.4501L12.467 13.4334ZM10.8337 4.26675L12.4503 2.58341L13.4337 3.53341L11.767 5.13341L10.8337 4.26675ZM2.56699 12.4667L4.25033 10.8501L5.16699 11.7334L3.55033 13.4167L2.56699 12.4667Z" fill="#6B6B6B"/>
              </svg>
            </div>
            <span className="gpt-text">GPT-4o</span>
            <ChevronDownIcon className="gpt-dropdown" />
          </Button>

          {/* Mode selection toggle */}
          <div
            className="mode-toggle"
            onClick={() => setSelectedMode(selectedMode === 'step-by-step' ? 'solution' : 'step-by-step')}
          >
            <div className={`mode-slider ${selectedMode === 'step-by-step' ? 'step-by-step' : 'solution'}`} />
            <div className="mode-text step-by-step-text">
              <span>Step-by-step</span>
            </div>
            <div className="mode-text solution-text">
              <span>Solution</span>
            </div>
          </div>
          
          {/* Profile selection button */}
          <Button variant="outline" size="sm" className="profile-button">
            <UserIcon className="profile-icon" />
            <span className="profile-text">Profile</span>
            <ChevronDownIcon className="profile-dropdown" />
          </Button>
        </div>

      </div>
    </main>
  );
}

export default ProblemSolver;