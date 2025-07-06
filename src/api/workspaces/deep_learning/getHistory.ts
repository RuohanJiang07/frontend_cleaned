export interface DeepLearningConversation {
  title: string;
  cover_img: string;
  created_at: string;
  concept_tags: string[];
  conversation_id: string;
  stored_location: string;
}

export interface GetHistoryResponse {
  success: boolean;
  workspace_id: string;
  workspace_name: string;
  owner_id: string;
  deep_learning_conversations: {
    items: DeepLearningConversation[];
  };
  total_conversations: number;
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

export const getDeepLearningHistory = async (): Promise<GetHistoryResponse> => {
  try {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      throw new Error('No workspace selected. Please select a workspace first.');
    }

    console.log('📂 Fetching deep learning history for workspace:', workspaceId);

    const response = await fetch(`${API_BASE_URL}/api/v1/deep_research/list_past_conversations`, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify({
        workspace_id: workspaceId
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GetHistoryResponse = await response.json();
    console.log('✅ Successfully fetched deep learning history:', data);
    return data;
  } catch (error) {
    console.error('❌ Get deep learning history API error:', error);
    throw error;
  }
};