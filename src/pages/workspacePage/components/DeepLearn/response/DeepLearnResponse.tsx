import React, { useState } from 'react';
import './DeepLearnResponse.css';

interface DeepLearnResponseProps {
  isSplit?: boolean;
  onBack?: () => void;
}

const DeepLearnResponse: React.FC<DeepLearnResponseProps> = ({ isSplit = false, onBack }) => {
  const [profileSelected, setProfileSelected] = useState(false);
  const [referenceSelected, setReferenceSelected] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasFirstQuestion, setHasFirstQuestion] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'follow-up' | 'new-topic' | null>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [selectedResponseMode, setSelectedResponseMode] = useState<'deep-learn' | 'quick-search'>('deep-learn');

  const handleBackClick = () => {
    // Navigate back to deep learn entry page
    onBack?.();
  };

  const toggleProfile = () => {
    setProfileSelected(!profileSelected);
  };

  const toggleReference = () => {
    setReferenceSelected(!referenceSelected);
  };

  const handleFollowUp = () => {
    setHasFirstQuestion(true);
    setSelectedMode('follow-up');
    // Additional logic for follow up mode
  };

  const handleNewTopic = () => {
    setHasFirstQuestion(true);
    setSelectedMode('new-topic');
    // Additional logic for new topic mode
  };

  const handleModeChange = (newMode: 'follow-up' | 'new-topic') => {
    setSelectedMode(newMode);
  };

  const toggleWebSearch = () => {
    setWebSearchEnabled(!webSearchEnabled);
  };

  const toggleResponseMode = (mode: 'deep-learn' | 'quick-search') => {
    setSelectedResponseMode(mode);
  };

  return (
    <div className="deep-learn-response">
      {/* Header Section */}
      <header className="deep-learn-response-header">
        {/* Left-aligned elements */}
        <div className="deep-learn-response-header-left">
          {/* Back Arrow */}
          <button
            onClick={handleBackClick}
            className="deep-learn-response-back-button"
            aria-label="Go back to deep learn entry"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M17.4168 10.9999H4.5835M4.5835 10.9999L11.0002 17.4166M4.5835 10.9999L11.0002 4.58325" 
                stroke="#00276C" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Conversation Title */}
          <h1 className="deep-learn-response-title">
            Learning Journey: Black Hole Information Paradox
          </h1>

          {/* Conversation Tag */}
          <div className="deep-learn-response-tag">
            <span className="deep-learn-response-tag-text">
              Conversation
            </span>
          </div>
        </div>

        {/* Right-aligned elements */}
        <div className="deep-learn-response-header-right">
          {/* Share Icon */}
          <button
            className="deep-learn-response-action-button"
            aria-label="Share analysis"
          >
            <img
              src="/workspace/share.svg"
              alt="Share"
              className="deep-learn-response-action-icon"
            />
          </button>

          {/* Print Icon */}
          <button
            className="deep-learn-response-action-button"
            aria-label="Print analysis"
          >
            <img
              src="/workspace/print.svg"
              alt="Print"
              className="deep-learn-response-action-icon"
            />
          </button>

          {/* Publish to Community Button */}
          <button
            className="deep-learn-response-publish-button"
            aria-label="Publish to community"
          >
            <img
              src="/workspace/publish.svg"
              alt="Publish"
              className="deep-learn-response-publish-icon"
            />
            <span className="deep-learn-response-publish-text">
              Publish to Community
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Section */}
      <div className="deep-learn-response-main">
        <div className="deep-learn-response-content">
          {/* Conversation Section */}
          <div className="deep-learn-response-conversation">
            {/* Conversation Main Section */}
            <div className="deep-learn-response-conversation-main">
              {/* Sample conversation group */}
              <div className="deep-learn-response-conversation-groups">
                {/* First Q&A Group */}
                <div className="deep-learn-response-conversation-group">
                  {/* Question Part (User Question) */}
                  <div className="deep-learn-response-question">
                    <span className="deep-learn-response-question-date">
                      Me, Jun 1, 9:50PM
                    </span>
                    <div className="deep-learn-response-question-box">
                      <span className="deep-learn-response-question-text">
                        What is the Black Hole Information Paradox?
                      </span>
                    </div>
                  </div>

                  {/* Deep Learn Response Part */}
                  <div className="deep-learn-response-answer">
                    {/* Title Section */}
                    <div className="deep-learn-response-title-section">
                      <span className="deep-learn-response-answer-title">
                        Solution of Black Hole Information Paradox
                      </span>
                      <div className="deep-learn-response-tag">
                        <span className="deep-learn-response-tag-text">
                          Deep Learn
                        </span>
                      </div>
                    </div>
                    
                    {/* Separation Line */}
                    <div className="deep-learn-response-separator"></div>
                    
                    {/* Thinking Progress Bar */}
                    <div className="deep-learn-response-thinking-bar">
                      <span className="deep-learn-response-thinking-status">
                        Thinking...
                      </span>
                      <div className="deep-learn-response-thinking-right">
                        <span className="deep-learn-response-thinking-duration">
                          Thought for 13 seconds
                        </span>
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          className="deep-learn-response-arrow-icon"
                        >
                          <path 
                            d="M6 9L12 15L18 9" 
                            stroke="black" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Source Webpages Section */}
                    <div className="deep-learn-response-sources">
                      <div className="deep-learn-response-source-card">
                        <div className="deep-learn-response-source-title">
                          Black Hole Information Paradox: A Comprehensive Analysis
                        </div>
                        <div className="deep-learn-response-source-detail">
                          Recent developments in quantum mechanics and general relativity have shed new light on this fundamental problem in theoretical physics.
                        </div>
                        <div className="deep-learn-response-source-site">
                          <img 
                            src="/workspace/site-icons/physics-today.svg" 
                            alt="Physics Today" 
                            className="deep-learn-response-site-icon"
                          />
                          <span className="deep-learn-response-site-name">
                            Physics Today
                          </span>
                        </div>
                      </div>
                      
                      <div className="deep-learn-response-source-card">
                        <div className="deep-learn-response-source-title">
                          Hawking Radiation and Information Loss
                        </div>
                        <div className="deep-learn-response-source-detail">
                          Understanding the relationship between Hawking radiation and the preservation of quantum information.
                        </div>
                        <div className="deep-learn-response-source-site">
                          <img 
                            src="/workspace/site-icons/nature.svg" 
                            alt="Nature" 
                            className="deep-learn-response-site-icon"
                          />
                          <span className="deep-learn-response-site-name">
                            Nature
                          </span>
                        </div>
                      </div>
                      
                      <div className="deep-learn-response-source-card">
                        <div className="deep-learn-response-source-title">
                          Quantum Mechanics and Black Hole Thermodynamics
                        </div>
                        <div className="deep-learn-response-source-detail">
                          Exploring the intersection of quantum mechanics and black hole thermodynamics.
                        </div>
                        <div className="deep-learn-response-source-site">
                          <img 
                            src="/workspace/site-icons/science.svg" 
                            alt="Science" 
                            className="deep-learn-response-site-icon"
                          />
                          <span className="deep-learn-response-site-name">
                            Science
                          </span>
                        </div>
                      </div>
                      
                      <div className="deep-learn-response-source-card">
                        <div className="deep-learn-response-source-title">
                          String Theory Approaches to Information Paradox
                        </div>
                        <div className="deep-learn-response-source-detail">
                          How string theory provides insights into resolving the black hole information paradox.
                        </div>
                        <div className="deep-learn-response-source-site">
                          <img 
                            src="/workspace/site-icons/arxiv.svg" 
                            alt="arXiv" 
                            className="deep-learn-response-site-icon"
                          />
                          <span className="deep-learn-response-site-name">
                            arXiv
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Response Content */}
                    <div className="deep-learn-response-content-text">
                      The Black Hole Information Paradox represents one of the most profound challenges in theoretical physics, arising from the apparent conflict between quantum mechanics and general relativity. At its core, the paradox questions whether information that falls into a black hole is permanently lost or somehow preserved.

                      Stephen Hawking's groundbreaking work in 1974 showed that black holes emit radiation (now known as Hawking radiation) and can eventually evaporate. However, this radiation appears to be purely thermal, containing no information about the matter that originally formed the black hole. This creates a fundamental problem: if information is truly lost, it violates the principle of unitarity in quantum mechanics, which states that information must be conserved.

                      Several theoretical approaches have been proposed to resolve this paradox. The AdS/CFT correspondence, proposed by Juan Maldacena in 1997, suggests that information is indeed preserved through a holographic principle where the information is encoded on the black hole's event horizon rather than being lost inside. String theory approaches propose that quantum correlations in the Hawking radiation carry the necessary information.

                      Recent developments in quantum information theory and the study of quantum entanglement have provided new insights. The concept of "firewalls" and the ER=EPR conjecture suggest that quantum entanglement might play a crucial role in preserving information across the event horizon.

                      While the paradox remains not fully resolved, these theoretical frameworks provide promising directions for understanding how quantum mechanics and gravity can be reconciled, potentially leading to a unified theory of quantum gravity.
                    </div>
                    
                    {/* End Separator */}
                    <div className="deep-learn-response-separator" style={{ marginTop: '10px' }}></div>
                  </div>
                </div>
                
                {/* Second Q&A Group - Quick Search */}
                <div className="deep-learn-response-conversation-group">
                  {/* Question Part (User Question) */}
                  <div className="deep-learn-response-question">
                    <span className="deep-learn-response-question-date">
                      Me, Jun 1, 10:15PM
                    </span>
                    <div className="deep-learn-response-question-box">
                      <span className="deep-learn-response-question-text">
                        What are the latest developments in quantum computing?
                      </span>
                    </div>
                  </div>

                  {/* Quick Search Response Part */}
                  <div className="deep-learn-response-answer response-quick-search">
                    {/* Title Section */}
                    <div className="deep-learn-response-title-section">
                      <span className="deep-learn-response-answer-title">
                        Latest Developments in Quantum Computing
                      </span>
                      <div className="deep-learn-response-tag">
                        <span className="deep-learn-response-tag-text">
                          Quick Search
                        </span>
                      </div>
                    </div>
                    
                    {/* Separation Line */}
                    <div className="deep-learn-response-separator"></div>
                    
                    {/* Response Content */}
                    <div className="deep-learn-response-content-text">
                      Quantum computing has seen remarkable progress in recent years, with several key developments shaping the field. IBM's quantum roadmap has achieved significant milestones, including the development of 433-qubit Osprey processor and plans for 4,000+ qubit systems by 2025. Google's Sycamore processor demonstrated quantum supremacy in 2019, solving a problem in 200 seconds that would take classical supercomputers 10,000 years.

                      Error correction has emerged as a critical focus area, with companies like PsiQuantum developing photonic quantum computers that could potentially scale to millions of qubits. Microsoft's topological qubit approach using Majorana fermions shows promise for more stable quantum bits. Startups like IonQ and Rigetti are making quantum computers accessible through cloud platforms, democratizing access to quantum computing resources.

                      The development of quantum algorithms continues to advance, with applications in cryptography, drug discovery, and optimization problems. Quantum machine learning is also gaining traction, with hybrid classical-quantum approaches showing potential for solving complex problems in finance and logistics.

                      Major investments from governments worldwide, including the US National Quantum Initiative and EU's Quantum Flagship program, are accelerating research and development. The race for quantum advantage in practical applications is intensifying, with companies across various industries exploring quantum solutions for their most challenging computational problems.
                    </div>
                    
                    {/* End Separator */}
                    <div className="deep-learn-response-separator"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Box Section */}
            <div className="deep-learn-response-input-section">
              {/* Input Area */}
              <div className="deep-learn-response-input-box">
                {!hasFirstQuestion ? (
                  <div className="deep-learn-response-mode-selection">
                    <span className="deep-learn-response-mode-text">Start a </span>
                    <button 
                      className="deep-learn-response-mode-button follow-up"
                      onClick={handleFollowUp}
                    >
                      Follow Up
                    </button>
                    <span className="deep-learn-response-mode-text"> or </span>
                    <button 
                      className="deep-learn-response-mode-button new-topic"
                      onClick={handleNewTopic}
                    >
                      New Topic
                    </button>
                  </div>
                ) : (
                  <>
                    <textarea
                      className="deep-learn-response-input"
                      placeholder="Type your question here..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    {selectedMode && (
                      <div className="deep-learn-response-mode-change">
                        <span className="deep-learn-response-mode-text">Change to </span>
                        <button 
                          className={`deep-learn-response-mode-button ${selectedMode === 'follow-up' ? 'new-topic' : 'follow-up'}`}
                          onClick={() => handleModeChange(selectedMode === 'follow-up' ? 'new-topic' : 'follow-up')}
                        >
                          {selectedMode === 'follow-up' ? 'New Topic' : 'Follow Up'}
                        </button>
                      </div>
                    )}
                  </>
                )}
                
                {/* Buttons at the bottom right */}
                <div className="deep-learn-response-buttons">
                  {/* Mode Toggle Button - Only show when New Topic is selected */}
                  {selectedMode === 'new-topic' && (
                                          <div className="deep-learn-response-mode-toggle">
                        <div 
                          className={`deep-learn-response-mode-toggle-option ${selectedResponseMode === 'deep-learn' ? 'selected' : 'unselected'}`}
                          onClick={() => toggleResponseMode('deep-learn')}
                          title="Deep Learn"
                        >
                          <img 
                            src="/workspace/deepLearn/lens-stars.svg" 
                            alt="Deep Learn Icon" 
                            className="deep-learn-response-mode-toggle-icon"
                            style={{ filter: selectedResponseMode === 'deep-learn' ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(32%) sepia(9%) saturate(2096%) hue-rotate(182deg) brightness(93%) contrast(87%)' }}
                          />
                        </div>
                        <div 
                          className={`deep-learn-response-mode-toggle-option ${selectedResponseMode === 'quick-search' ? 'selected' : 'unselected'}`}
                          onClick={() => toggleResponseMode('quick-search')}
                          title="Quick Search"
                        >
                          <img 
                            src="/workspace/deepLearn/lens-check.svg" 
                            alt="Quick Search Icon" 
                            className="deep-learn-response-mode-toggle-icon"
                            style={{ filter: selectedResponseMode === 'quick-search' ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(32%) sepia(9%) saturate(2096%) hue-rotate(182deg) brightness(93%) contrast(87%)' }}
                          />
                        </div>
                      </div>
                  )}

                  {/* Web Search Toggle Button */}
                  <button 
                    className={`deep-learn-response-web-search ${webSearchEnabled ? 'selected' : 'unselected'}`}
                    onClick={toggleWebSearch}
                    title="Toggle Web Search" 
                  >
                    <img 
                      src="/workspace/deepLearn/language.svg" 
                      alt="Web Search" 
                      className="deep-learn-response-web-search-icon"
                      style={{ filter: webSearchEnabled ? 'brightness(0) saturate(100%) invert(32%) sepia(9%) saturate(2096%) hue-rotate(182deg) brightness(93%) contrast(87%)' : 'brightness(0) saturate(100%) invert(48%) sepia(0%) saturate(0%) hue-rotate(251deg) brightness(94%) contrast(92%)' }}
                    />
                  </button>

                  {/* Profile Select Button */}
                  <button 
                    className={`deep-learn-response-button ${profileSelected ? 'selected' : ''}`}
                    onClick={toggleProfile}
                    title="Select Profile" 
                  >
                    <img 
                      src="/workspace/deepLearn/contacts-line.svg" 
                      alt="Profile" 
                      className="deep-learn-response-button-icon"
                      style={{ filter: profileSelected ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(39%) sepia(0%) saturate(0%) hue-rotate(147deg) brightness(94%) contrast(87%)' }}
                    />
                  </button>
                  
                  {/* Reference Select Button */}
                  <button 
                    className={`deep-learn-response-button ${referenceSelected ? 'selected' : ''}`}
                    onClick={toggleReference}
                    title="Select References" 
                  >
                    <img 
                      src="/workspace/deepLearn/folder.svg" 
                      alt="References" 
                      className="deep-learn-response-button-icon"
                      style={{ filter: referenceSelected ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(39%) sepia(0%) saturate(0%) hue-rotate(147deg) brightness(94%) contrast(87%)' }}
                    />
                  </button>

                  {/* Separator Line */}
                  <div className="deep-learn-response-button-separator"></div>

                  {/* Send Button */}
                  <button 
                    className={`deep-learn-response-send-button ${inputValue.trim() ? 'active' : ''}`}
                    disabled={!inputValue.trim()}
                    title="Send Query" 
                  >
                    <img 
                      src="/workspace/arrow-up.svg" 
                      alt="Send" 
                      className="deep-learn-response-send-icon"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Section */}
          <div className="deep-learn-response-interactive">
            {/* Top Gray Box */}
            <div className="deep-learn-response-interactive-box top-box">
              <div className="deep-learn-response-interactive-content">
                {/* Related Videos Section */}
                <div className="deep-learn-response-related-videos">
                  {/* Header */}
                  <div className="deep-learn-response-related-header">
                    <img 
                      src="/workspace/deepLearn/related-videos.svg" 
                      alt="Related Videos" 
                      className="deep-learn-response-related-icon"
                    />
                    <span className="deep-learn-response-related-title">
                      Related Videos
                    </span>
                  </div>
                  
                  {/* Video Content */}
                  <div className="deep-learn-response-video-content">
                    {/* Single Video Box */}
                    <div className="deep-learn-response-video-box">
                      {/* Image Section */}
                      <div className="deep-learn-response-video-image-section">
                        <img 
                          src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=284&h=132&fit=crop" 
                          alt="Universe video thumbnail" 
                          className="deep-learn-response-video-image"
                        />
                      </div>
                      
                      {/* Text Section */}
                      <div className="deep-learn-response-video-text-section">
                        <h4 className="deep-learn-response-video-title">
                          DNA and Gene Editing Using CRISPR Technology
                        </h4>
                        <div className="deep-learn-response-video-source">
                          <img 
                            src="/workspace/deepLearn/youtube.svg" 
                            alt="YouTube" 
                            className="deep-learn-response-youtube-icon"
                          />
                          <span className="deep-learn-response-source-text">
                            Science Channel
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Related Webpages Section */}
                <div className="deep-learn-response-related-webpages">
                  {/* Header */}
                  <div className="deep-learn-response-webpages-header">
                    <img 
                      src="/workspace/deepLearn/related-webpages.svg" 
                      alt="Related Webpages" 
                      className="deep-learn-response-webpages-icon"
                    />
                    <span className="deep-learn-response-webpages-title">
                      Related Webpages
                    </span>
                  </div>
                  
                  {/* Webpages Content */}
                  <div className="deep-learn-response-webpages-content">
                    {/* First Webpage Box */}
                    <div className="deep-learn-response-webpage-box">
                      <h4 className="deep-learn-response-webpage-title">
                        Related Webpages 1
                      </h4>
                      <p className="deep-learn-response-webpage-description">
                        Discover Pinterest's best ideas and inspiration for Study icon. Get inspired and try out new things.
                      </p>
                    </div>
                    
                    {/* Second Webpage Box */}
                    <div className="deep-learn-response-webpage-box">
                      <h4 className="deep-learn-response-webpage-title">
                        Related Webpages 1
                      </h4>
                      <p className="deep-learn-response-webpage-description">
                        Discover Pinterest's best ideas and inspiration for Study icon. Get inspired and try out new things.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Gray Box */}
            <div className="deep-learn-response-interactive-box bottom-box">
              <div className="deep-learn-response-interactive-content">
                {/* Concept Map Section */}
                <div className="deep-learn-response-concept-map">
                  {/* Header */}
                  <div className="deep-learn-response-concept-map-header">
                    <img 
                      src="/workspace/deepLearn/concept-map.svg" 
                      alt="Concept Map" 
                      className="deep-learn-response-concept-map-icon"
                    />
                    <span className="deep-learn-response-concept-map-title">
                      Concept Map
                    </span>
                  </div>
                  
                  {/* Concept Map Content */}
                  <div className="deep-learn-response-concept-map-content">
                    {/* Concept Map Box */}
                    <div className="deep-learn-response-concept-map-box">
                      {/* Concept Map visualization would go here */}
                      <div className="deep-learn-response-concept-map-placeholder">
                        <div className="deep-learn-response-concept-map-node black-hole-node">
                          <div className="deep-learn-response-concept-map-node-dot"></div>
                          <span className="deep-learn-response-concept-map-node-label">Black Hole</span>
                        </div>
                        <div className="deep-learn-response-concept-map-node white-dwarf-node">
                          <div className="deep-learn-response-concept-map-node-dot"></div>
                          <span className="deep-learn-response-concept-map-node-label">White dwarf</span>
                        </div>
                        <div className="deep-learn-response-concept-map-node supernova-node">
                          <div className="deep-learn-response-concept-map-node-dot"></div>
                          <span className="deep-learn-response-concept-map-node-label">Type I Supernova</span>
                        </div>
                        <div className="deep-learn-response-concept-map-node horizon-node">
                          <div className="deep-learn-response-concept-map-node-dot"></div>
                          <span className="deep-learn-response-concept-map-node-label">Stretched Horizon</span>
                        </div>
                        <div className="deep-learn-response-concept-map-node cosmology-node">
                          <div className="deep-learn-response-concept-map-node-dot"></div>
                          <span className="deep-learn-response-concept-map-node-label">Cosmology</span>
                        </div>
                        <div className="deep-learn-response-concept-map-node gravity-wave-node">
                          <div className="deep-learn-response-concept-map-node-dot"></div>
                          <span className="deep-learn-response-concept-map-node-label">Gravity Wave</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Current Selection Indicator */}
                    <div className="deep-learn-response-concept-map-selection">
                      <span className="deep-learn-response-concept-map-selection-text">
                        You are currently at:
                      </span>
                      <div className="deep-learn-response-concept-map-selection-button">
                        Black Hole
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepLearnResponse;
