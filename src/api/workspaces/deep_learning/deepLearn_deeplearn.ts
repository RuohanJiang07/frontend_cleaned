export interface DeepLearnDeepRequest {
    workspace_id: string;
    conversation_id: string;
    search_type: string;
    web_search: boolean;
    user_query: string;
    new_conversation?: boolean;
    user_additional_comment?: string | null;
    profile_selected?: string | null;
    references_selected?: string[] | null;
  }
  
  export interface DeepLearnStreamingData {
    stream_info: string;
    conversation_id: string;
    llm_response?: any;
    generation_status?: any;
    newly_completed_item?: {
      section: string;
      type: string;
      description: string;
    };
    progress?: {
      total_sections: number;
      total_expected_completions: number;
      current_completions: number;
      progress_percentage: number;
    };
    status?: string;
    final?: boolean;
    total_streams_sent?: number;
    error?: string;
    timestamp: string;
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
  
  export const submitDeepLearnDeepQuery = async (
    query: string,
    webSearch: boolean,
    additionalComments?: string,
    profile?: string,
    references?: string[] | null,
    onData: (data: DeepLearnStreamingData) => void,
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
      
      console.log('🆔 Deep Learn - Using conversation ID:', conversationId, 'isNew:', isNewConversation);
      console.log('📤 Deep Learn - Displaying conversation ID before streaming...');
  
      const requestData: DeepLearnDeepRequest = {
        workspace_id: workspaceId,
        conversation_id: conversationId,
        search_type: isNewConversation ? "new_topic" : "new_topic", // Always new_topic for now
        web_search: webSearch,
        user_query: query,
        new_conversation: isNewConversation,
        user_additional_comment: additionalComments || null,
        profile_selected: profile || null,
        references_selected: references || null
      };
  
      console.log('📝 Submitting Deep Learn (deep mode) request:', requestData);
  
      // 🔧 修复问题：确保 Interactive API 在 Deep Learn 模式下也被正确调用和等待
      // 立即获取 tabId 并开始 interactive 调用
      const tabId = window.location.pathname + window.location.search;
      console.log('🔧 Starting interactive call for Deep Learn with tabId:', tabId);
      
      // 启动 interactive 调用（4秒后）
      const interactivePromise = callInteractiveEndpoint(conversationId, query, additionalComments)
        .then(interactiveData => {
          console.log('✅ Interactive endpoint returned data for Deep Learn:', interactiveData);
          
          // 立即存储 interactive 数据
          localStorage.setItem(`deeplearn_interactive_${tabId}`, JSON.stringify(interactiveData));
          console.log('💾 Stored interactive data to localStorage with key:', `deeplearn_interactive_${tabId}`);
          
          // 立即触发事件来更新 sidebar
          window.dispatchEvent(new CustomEvent('deeplearn-interactive-update', {
            detail: { tabId, data: interactiveData }
          }));
          console.log('📡 Triggered deeplearn-interactive-update event for tabId:', tabId);
          
          return interactiveData;
        })
        .catch(error => {
          console.error('❌ Interactive endpoint error for Deep Learn:', error);
          throw error;
        });
  
      // 4秒后开始 interactive 调用
      setTimeout(() => {
        console.log('⏰ Starting interactive endpoint call for Deep Learn (4 seconds after deep learn start)...');
        interactivePromise.catch(error => {
          console.error('⚠️ Interactive call failed but continuing with Deep Learn:', error);
        });
      }, 4000);
  
      const response = await fetch(`${API_BASE_URL}/api/v1/deep_research/start/deep_learn`, {
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
  
      // 🔧 修复问题1：通过监听后端返回来处理刷新，而不是读取boolean json
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('Deep learn streaming completed');
          onComplete();
          break;
        }
  
        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines (backend sends Server-Sent Events format)
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
  
        for (const line of lines) {
          if (line.trim() && line.startsWith('data: ')) {
            const jsonData = line.substring(6); // Remove 'data: ' prefix
            
            try {
              // 🔧 修复：添加更好的错误处理和空数据检查
              if (!jsonData.trim()) {
                console.warn('Received empty data line, skipping...');
                continue;
              }
              
              const data: DeepLearnStreamingData = JSON.parse(jsonData);
              console.log('Received deep learn streaming data:', data);
              
              // Check for error in the data
              if (data.error) {
                onError(data.error);
                return conversationId;
              }
              
              // 🔧 修复问题1：每次收到后端返回就立即更新前端，完全替换内容
              onData(data);
              
              // Check for completion
              if (data.final || data.status === 'completed') {
                console.log('Deep learn streaming marked as final/completed');
                onComplete();
                return conversationId;
              }
            } catch (parseError) {
              console.warn('Failed to parse deep learn streaming data:', jsonData, parseError);
              // 🔧 修复：如果解析失败，不要立即报错，继续处理下一行
              if (jsonData.includes('error') || jsonData.includes('Error')) {
                onError(`Parse error: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
                return conversationId;
              }
            }
          } else if (line.trim() && !line.startsWith('data: ')) {
            // 🔧 修复：处理不是 SSE 格式的数据
            try {
              if (!line.trim()) {
                continue;
              }
              
              const data: DeepLearnStreamingData = JSON.parse(line.trim());
              console.log('Received deep learn streaming data (non-SSE):', data);
              
              if (data.error) {
                onError(data.error);
                return conversationId;
              }
              
              onData(data);
              
              if (data.final || data.status === 'completed') {
                console.log('Deep learn streaming marked as final/completed');
                onComplete();
                return conversationId;
              }
            } catch (parseError) {
              console.warn('Failed to parse non-SSE deep learn streaming data:', line, parseError);
              // 只有在明确是错误信息时才报错
              if (line.includes('error') || line.includes('Error')) {
                onError(`Parse error: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
                return conversationId;
              }
            }
          }
        }
      }
  
      return conversationId;
    } catch (error) {
      console.error('Deep Learn (deep mode) API error:', error);
      onError(error instanceof Error ? error.message : 'Unknown deep learn error');
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
  
      console.log('📞 Calling interactive endpoint for deep learn:', requestData);
  
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
      console.log('✅ Interactive endpoint returned data for Deep Learn:', data);
      return data;
    } catch (error) {
      console.error('Interactive API error for deep learn:', error);
      throw error;
    }
  };