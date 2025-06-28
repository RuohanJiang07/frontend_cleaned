import { UploadCloudIcon, X } from "lucide-react";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import './createWorkspaceModal.css';
import { Button } from "../../ui/button";
import { useState, useEffect } from "react";
import { getWorkspaceCoverImages, createWorkspace, CreateWorkspaceRequest } from "../../../api/main/workspaces";
import { useToast } from "../../../hooks/useToast";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WorkspaceData) => void;
}

interface WorkspaceData {
  name: string;
  description: string;
  coverImage: string;
  tags: string[];
  background: string;
}

const CreateWorkspaceModal = ({ isOpen, onClose, onSubmit }: CreateWorkspaceModalProps) => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState<WorkspaceData>({
    name: '',
    description: '',
    coverImage: '',
    tags: [],
    background: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [loadingCovers, setLoadingCovers] = useState(false);
  const [creating, setCreating] = useState(false);

  // Fetch cover images when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCoverImages();
    }
  }, [isOpen]);

  const fetchCoverImages = async () => {
    try {
      setLoadingCovers(true);
      const response = await getWorkspaceCoverImages();
      
      if (response.success) {
        // Combine default covers and user uploaded covers
        const allCovers = [...response.default_covers, ...response.user_uploaded_covers];
        setCoverImages(allCovers);
        
        // Set first image as default if no image is selected
        if (allCovers.length > 0 && !formData.coverImage) {
          setFormData(prev => ({
            ...prev,
            coverImage: allCovers[0]
          }));
        }
      } else {
        error('Failed to load cover images');
      }
    } catch (err) {
      console.error('Error fetching cover images:', err);
      error('Failed to load cover images');
    } finally {
      setLoadingCovers(false);
    }
  };

  const handleInputChange = (field: keyof WorkspaceData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      error('Workspace name is required');
      return;
    }

    try {
      setCreating(true);
      
      const createRequest: CreateWorkspaceRequest = {
        workspace_name: formData.name.trim(),
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        collaborator_emails: formData.background.trim() ? [formData.background.trim()] : undefined,
        cover_url: formData.coverImage, // ✅ Now properly passing the selected cover image URL
      };

      console.log('Creating workspace with request:', createRequest); // Debug log

      const response = await createWorkspace(createRequest);
      
      success(`Workspace "${formData.name}" created successfully!`);
      
      // Save workspace_id to localStorage for future use
      localStorage.setItem('current_workspace_id', response.workspace_id);
      
      // Call parent onSubmit with the form data
      onSubmit(formData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        coverImage: '',
        tags: [],
        background: ''
      });
      setTagInput('');
      
      // Close modal
      onClose();
      
    } catch (err) {
      console.error('Error creating workspace:', err);
      error('Failed to create workspace. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-[780px] h-[540px] bg-white rounded-[20px] shadow-lg">
        {/* Close Button */}
        <button
          className="absolute top-[30px] right-[40px]"
          onClick={onClose}
          disabled={creating}
        >
          <X className="w-5 h-5 text-black" />
        </button>

        {/* Inner Content Frame */}
        <div className="absolute left-[46px] top-[30px] w-[688px] h-[465px] overflow-y-auto">
          <div className="flex flex-col items-center">
            <h2 className="mt-[2px] font-['IBM_Plex_Sans'] text-[20px] font-normal text-black leading-normal">
              Create New Workspace
            </h2>
            <p className="mt-[5px] text-center font-['IBM_Plex_Sans'] text-[15px] font-normal text-[#898989] leading-normal max-w-[520px]">
              Workspaces are where you have your study materials organized by
              subject, topic, or your interest
            </p>
          </div>

          {/* First row with Workspace Name and Tags */}
          <div className="flex gap-[22px] mt-[16px] mx-auto">
            {/* Workspace Name Field */}
            <div className="flex flex-col">
              <label className="font-['IBM_Plex_Sans'] text-[16px] font-normal text-black leading-normal pl-[18px]">
                Workspace Name <span className="text-[#e72a2a]">*</span>
              </label>
              <Input
                className="w-[320px] h-[46px] flex-shrink-0 rounded-[20px] border-2 border-[#e2e2e2] pl-[18px] font-['IBM_Plex_Sans'] text-[16px] font-normal text-[#898989] leading-normal placeholder:text-[#898989]"
                placeholder="Name your workspace"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={creating}
              />
            </div>

            {/* Tags Field */}
            <div className="flex flex-col">
              <label className="font-['IBM_Plex_Sans'] text-[16px] font-normal text-black leading-normal pl-[18px]">
                Tags (Optional)
              </label>
              <Input
                className="w-[320px] h-[46px] flex-shrink-0 rounded-[20px] border-2 border-[#e2e2e2] pl-[18px] font-['IBM_Plex_Sans'] text-[16px] font-normal text-[#898989] leading-normal placeholder:text-[#898989]"
                placeholder='Type and press Enter to add tags'
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyPress={handleTagKeyPress}
                disabled={creating}
              />
              
              {/* Display tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 pl-[18px]">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={creating}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Collaborator Section */}
          <div className="mt-[16px] mx-auto">
            <label className="font-['IBM_Plex_Sans'] text-[16px] font-normal text-black leading-normal pl-[18px]">
              Collaborator (Optional)
            </label>
            <Input
              className="w-[662px] h-[46px] rounded-[20px] border-2 border-[#e2e2e2] pl-[18px] font-['IBM_Plex_Sans'] text-[16px] font-normal text-[#898989] leading-normal placeholder:text-[#898989]"
              placeholder="Invite collaborator by email"
              value={formData.background}
              onChange={(e) => handleInputChange('background', e.target.value)}
              disabled={creating}
            />
          </div>

          {/* Workspace Cover Section */}
          <div className="mt-[16px] mx-auto">
            <label className="font-['IBM_Plex_Sans'] text-[16px] font-normal text-black leading-normal pl-[18px]">
              Select Workspace Cover
            </label>

            <div className="mt-2 grid grid-cols-3 gap-x-[26px] gap-y-[15px]">
              {/* Upload Card */}
              <Card className="w-[196px] h-[132px] flex-shrink-0 bg-[#f4f4f4] rounded-[5px] border-2 border-[#d9d9d9] flex flex-col items-center justify-center cursor-pointer hover:border-[#999]">
                <UploadCloudIcon className="w-12 h-12 mb-2 text-gray-500" />
                <p className="font-['IBM_Plex_Sans'] text-[16px] font-normal text-[#898989] leading-normal">Upload from computer</p>
              </Card>

              {/* Loading state for cover images */}
              {loadingCovers ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`loading-${index}`}
                    className="w-[196px] h-[132px] flex-shrink-0 bg-gray-200 rounded-[5px] animate-pulse"
                  />
                ))
              ) : (
                /* Cover Images */
                coverImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`w-[196px] h-[132px] flex-shrink-0 cursor-pointer rounded-[5px] border-2 transition-all ${
                      formData.coverImage === imageUrl 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-[#d9d9d9] hover:border-[#999]'
                    }`}
                    onClick={() => !creating && handleInputChange('coverImage', imageUrl)}
                  >
                    <img
                      className="w-full h-full object-cover rounded-[5px]"
                      alt={`Cover ${index + 1}`}
                      src={imageUrl}
                      onError={(e) => {
                        // Handle broken images
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Debug: Show selected cover URL */}
          {formData.coverImage && (
            <div className="mt-4 mx-auto">
              <p className="text-xs text-gray-500 pl-[18px]">
                Selected cover: {formData.coverImage}
              </p>
            </div>
          )}
        </div>

        {/* Create Button */}
        <Button
          className={`absolute right-[40px] bottom-[38px] w-[95px] h-[36px] rounded-[18px] text-black font-['IBM_Plex_Sans'] text-[16px] font-normal leading-normal flex-shrink-0 ${
            creating 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-[#ECF1F6] hover:bg-[#d1e9f8]'
          }`}
          onClick={handleSubmit}
          disabled={creating || !formData.name.trim()}
        >
          {creating ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;