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

export interface StreamingData {
  content?: string;
  type?: string;
  is_end_marker?: boolean;
  error?: string;
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

export const submitDeepLearnQuery = async (
  query: string,
  mode: 'deep-learn' | 'quick-search',
  webSearch: boolean,
  additionalComments?: string,
  profile?: string,
  references?: string[] | null
): Promise<DeepLearnResponse> => {
  try {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      throw new Error('No workspace selected. Please select a workspace first.');
    }

    // Map mode to question_type
    const questionType = mode === 'deep-learn' ? 'deeplearn' : 'quicksearch';

    const requestData: DeepLearnRequest = {
      workspace_id: workspaceId,
      new_conversation: true,
      search_type: 'new_topic',
      question_type: questionType,
      web_search: webSearch,
      user_query: query,
      user_additional_comment: additionalComments || undefined,
      profile_selected: profile || 'profile-default',
      references_selected: references || null,
    };

    console.log('Submitting Deep Learn request:', requestData);

    const response = await fetch(`${API_BASE_URL}/api/v1/deep_research/start`, {
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

    const data: DeepLearnResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Deep Learn API error:', error);
    throw error;
  }
};

export const getStreamingResponse = async (
  conversationId: string,
  onData: (data: StreamingData) => void,
  onError: (error: string) => void,
  onComplete: () => void
): Promise<void> => {
  try {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      throw new Error('No workspace selected. Please select a workspace first.');
    }

    const url = new URL(`${API_BASE_URL}/api/v1/deep_research/get_streaming_response`);
    url.searchParams.append('conversation_id', conversationId);
    url.searchParams.append('workspace_id', workspaceId);

    console.log('Starting streaming request:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: createAuthHeaders(),
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
        console.log('Streaming completed');
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          try {
            const data: StreamingData = JSON.parse(line);
            console.log('Received streaming data:', data);
            
            if (data.error) {
              onError(data.error);
              return;
            }
            
            onData(data);
            
            // Check for end marker
            if (data.is_end_marker) {
              console.log('End marker received, stopping stream');
              onComplete();
              return;
            }
          } catch (parseError) {
            console.warn('Failed to parse streaming data:', line, parseError);
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming API error:', error);
    onError(error instanceof Error ? error.message : 'Unknown streaming error');
  }
};