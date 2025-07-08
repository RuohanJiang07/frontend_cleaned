export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}

export interface CheckAuthorizationResponse {
  authorized: boolean;
}

const API_BASE_URL = 'https://backend-aec-experimental.onrender.com';

// Helper function to get access token
const getAccessToken = (): string | null => {
  return localStorage.getItem('hyperknow_access_token');
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

// Helper function to get workspace ID
const getWorkspaceId = (): string | null => {
  return localStorage.getItem('current_workspace_id');
};

export const checkGoogleDriveAuthorization = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/google_drive_auth/check_authorization_status`, {
      method: 'GET',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CheckAuthorizationResponse = await response.json();
    console.log('✅ Google Drive authorization status:', data);
    return data.authorized;
  } catch (error) {
    console.error('❌ Error checking Google Drive authorization:', error);
    return false;
  }
};

export const listGoogleDriveFiles = async (): Promise<GoogleDriveFile[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/google_drive_auth/list_google_drive_files`, {
      method: 'GET',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched Google Drive files:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching Google Drive files:', error);
    throw error;
  }
};

export const importFileFromGoogleDrive = async (fileId: string): Promise<{message: string; file_id: string; s3_key: string}> => {
  try {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      throw new Error('No workspace selected. Please select a workspace first.');
    }

    const url = new URL(`${API_BASE_URL}/api/v1/google_drive_auth/import_file_from_drive`);
    url.searchParams.append('file_id', fileId);
    url.searchParams.append('workspace_id', workspaceId);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Successfully imported file from Google Drive:', data);
    return data;
  } catch (error) {
    console.error('❌ Error importing file from Google Drive:', error);
    throw error;
  }
};

export const connectGoogleDrive = async (): Promise<void> => {
  try {
    const userId = localStorage.getItem('hyperknow_user_id');
    if (!userId) {
      throw new Error('User ID not found. Please login first.');
    }

    // Redirect to the Google Drive auth endpoint
    window.location.href = `${API_BASE_URL}/api/v1/google_drive_auth/connect_google_drive?user_id=${userId}`;
  } catch (error) {
    console.error('❌ Error connecting to Google Drive:', error);
    throw error;
  }
};