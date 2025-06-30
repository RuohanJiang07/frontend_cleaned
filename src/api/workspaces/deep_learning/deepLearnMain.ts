export interface DeepLearnRequest {
  workspace_id: string;
  conversation_id?: string;
  new_conversation: boolean;
  search_type: string;
  question_type: string;
  web_search: boolean;
  user_query: string;
  user_additional_comment?: string;
  profile_selected: string;
  references_selected?: string[] | null;
}

export interface DeepLearnResponse {
  conversation_id: string;
  message: string;
  status: string;
}

export interface QuickSearchRequest {
  workspace_id: string;
  conversation_id?: string;
  new_conversation: boolean;
  search_type: string;
  web_search: boolean;
  user_query: string;
  user_additional_comment?: string | null;
  profile_selected?: string | null;
  references_selected?: string[] | null;
}

export interface InteractiveRequest {
  workspace_id: string;
  conversation_id: string;
  user_query: string;
  user_additional_comment?: string | null;
}

export interface InteractiveResponse {
  success: boolean;
  conversation_title: string;
  topic: string;
  roadmap_node_index: number;
  concept_map: {
    nodes: Array<{
      id: number;
      label: string;
      neighbors: number[];
    }>;
  };
  interactive_content: {
    conversation_title: string;
    recommended_videos: Array<{
      title: string;
      url: string;
      thumbnail: string;
      channel: string;
    }>;
    related_webpages: Array<{
      title: string;
      url: string;
      description: string;
    }>;
    related_concepts: Array<{
      concept: string;
      explanation: string;
    }>;
  };
  files_updated: {
    conversation_json: string;
    concept_map_json: string;
  };
  timestamp: string;
}

const API_BASE_URL = 'https://backend-aec-experimental.onrender.com';

// Helper function to get access token
const getAccessToken = (): string | null => {
  return localStorage.getItem('hyperknow_access_token');
};

// Helper function to get workspace ID
const getWorkspaceId = (): string | null => {
  return localStorage.getItem('current_workspace_id');
};

// Helper function to create headers with auth
const createAuthHeaders = () => {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    throw new Error('No access token found. Please login first.');
  }

  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'accept': 'application/json',
  };
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

export const submitQuickSearchQuery = async (
  query: string,
  webSearch: boolean,
  additionalComments?: string,
  profile?: string,
  references?: string[] | null,
  onData: (data: string) => void,
  onError: (error: string) => void,
  onComplete: () => void,
  existingConversationId?: string, // Existing conversation ID for continuous conversation
  generatedConversationId?: string // Generated conversation ID for new conversation
): Promise<string> => {
  try {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      throw new Error('No workspace selected. Please select a workspace first.');
    }

    // Use existing conversation ID, generated conversation ID, or generate new one
    const conversationId = existingConversationId || generatedConversationId || generateConversationId();
    const isNewConversation = !existingConversationId;
    
    console.log('🆔 Quick Search - Using conversation ID:', conversationId, 'isNew:', isNewConversation);
    console.log('📤 Quick Search - Displaying conversation ID before streaming...');

    // Use real user input and settings
    const requestData: QuickSearchRequest = {
      workspace_id: workspaceId,
      conversation_id: conversationId,
      search_type: isNewConversation ? "new_topic" : "new_topic", // Always new_topic for now
      web_search: webSearch,
      user_query: query,
      new_conversation: isNewConversation,
      user_additional_comment: additionalComments || null,
      profile_selected: profile || null,
      references_selected: references || []
    };

    console.log('📝 Submitting Quick Search request:', requestData);

    // Schedule interactive endpoint call for 4 seconds later
    const interactivePromise = new Promise<InteractiveResponse>((resolve, reject) => {
      setTimeout(async () => {
        try {
          console.log('Starting interactive endpoint call (4 seconds after quicksearch)...');
          const interactiveData = await callInteractiveEndpoint(conversationId, query, additionalComments);
          resolve(interactiveData);
        } catch (error) {
          reject(error);
        }
      }, 3000); // 3 seconds delay
    });

    const response = await fetch(`${API_BASE_URL}/api/v1/deep_research/start/quicksearch`, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('Quick search streaming completed');
        onComplete();
        break;
      }

      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines (backend sends line by line)
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          console.log('Received streaming line:', line);
          
          // Check for error in the line
          if (line.includes('"error"')) {
            try {
              const errorData = JSON.parse(line);
              if (errorData.error) {
                onError(errorData.error);
                return conversationId;
              }
            } catch (parseError) {
              // If it's not valid JSON, treat as regular content
            }
          }
          
          // Send the line to the callback (add newline back since backend expects line-by-line)
          onData(line + '\n');
        }
      }
    }

    // Wait for interactive endpoint to complete and handle the response
    try {
      const interactiveData = await interactivePromise;
      console.log('Interactive endpoint response (after 3 second delay):', interactiveData);
      
      // Store interactive data for the sidebar
      const tabId = window.location.pathname + window.location.search;
      localStorage.setItem(`deeplearn_interactive_${tabId}`, JSON.stringify(interactiveData));
      
      // Trigger event to update sidebar
      window.dispatchEvent(new CustomEvent('deeplearn-interactive-update', {
        detail: { tabId, data: interactiveData }
      }));
    } catch (interactiveError) {
      console.error('Interactive endpoint error (after 3 second delay):', interactiveError);
      // Don't fail the main request if interactive fails
    }

    return conversationId;
  } catch (error) {
    console.error('Quick Search API error:', error);
    onError(error instanceof Error ? error.message : 'Unknown quick search error');
    throw error;
  }
};

const callInteractiveEndpoint = async (
  conversationId: string,
  userQuery: string,
  userAdditionalComment?: string
): Promise<InteractiveResponse> => {
  try {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      throw new Error('No workspace selected for interactive call.');
    }

    const requestData: InteractiveRequest = {
      workspace_id: workspaceId,
      conversation_id: conversationId,
      user_query: userQuery,
      user_additional_comment: userAdditionalComment || null
    };

    console.log('Calling interactive endpoint:', requestData);

    const response = await fetch(`${API_BASE_URL}/api/v1/deep_research/interactive`, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: InteractiveResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Interactive API error:', error);
    throw error;
  }
};