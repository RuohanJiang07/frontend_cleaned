import { UploadCloudIcon, X } from "lucide-react";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import './createWorkspaceModal.css';
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../ui/select";
import { useState } from "react";

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
  const [formData, setFormData] = useState<WorkspaceData>({
    name: '',
    description: '',
    coverImage: '',
    tags: [],
    background: ''
  });

  const [tagInput, setTagInput] = useState('');

  // Sample tag data for mapping
  const tagColors = [
    "bg-[#60adff]",
    "bg-[#72b17b]",
    "bg-[#ffcc58]",
    "bg-[#ff6b6b]",
    "bg-[#9c6bff]",
    "bg-[#ff9c6b]",
  ];

  // Sample cover images data for mapping
  const coverImages = [
    { id: 1, src: "/main/landing_page/projectRectangle/rectangle-1.png", alt: "Rectangle" },
    { id: 2, src: "/main/landing_page/projectRectangle/rectangle-2.png", alt: "Rectangle" },
    { id: 3, src: "/main/landing_page/projectRectangle/rectangle-3.png", alt: "Rectangle" },
    { id: 4, src: "/main/landing_page/projectRectangle/rectangle-4.png", alt: "Rectangle" },
    { id: 5, src: "/main/landing_page/projectRectangle/rectangle-5.png", alt: "Rectangle" },
  ];

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

  const handleSubmit = () => {
    onSubmit(formData);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-[711px] h-[509px] bg-white rounded-[20px] shadow-lg">
        {/* Close Button */}
        <button
          className="absolute top-[28px] right-[37px]"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-black" />
        </button>

        {/* Inner Content Frame */}
        <div className="absolute left-[43px] top-[28px] w-[625px] h-[437px] overflow-y-auto">
          <div className="flex flex-col items-center">
            <h2 className="mt-[2px] font-['IBM_Plex_Sans'] text-[20px] font-normal text-black leading-normal">
              Create New Workspace
            </h2>
            <p className="mt-[5px] text-center font-['IBM_Plex_Sans'] text-[15px] font-normal text-[#898989] leading-normal max-w-[485px]">
              Workspaces are where you have your study materials organized by
              subject, topic, or your interest
            </p>
          </div>

          {/* First row with Workspace Name and Tags */}
          <div className="flex gap-[21px] mt-[15px] mx-auto">
            {/* Workspace Name Field */}
            <div className="flex flex-col">
              <label className="font-['IBM_Plex_Sans'] text-[16px] font-normal text-black leading-normal pl-[17px]">
                Workspace Name <span className="text-[#e72a2a]">*</span>
              </label>
              <Input
                className="w-[295px] h-[43px] flex-shrink-0 rounded-[20px] border-2 border-[#e2e2e2] pl-[17px] font-['IBM_Plex_Sans'] text-[16px] font-normal text-[#898989] leading-normal placeholder:text-[#898989]"
                placeholder="Name your workspace"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            {/* Tags Field */}
            <div className="flex flex-col">
              <label className="font-['IBM_Plex_Sans'] text-[16px] font-normal text-black leading-normal pl-[17px]">
                Tags (Optional)
              </label>
              <Input
                className="w-[295px] h-[43px] flex-shrink-0 rounded-[20px] border-2 border-[#e2e2e2] pl-[17px] font-['IBM_Plex_Sans'] text-[16px] font-normal text-[#898989] leading-normal placeholder:text-[#898989]"
                placeholder='Type and press Enter to add tags'
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyPress={handleTagKeyPress}
              />
            </div>
          </div>

          {/* Collaborator Section */}
          <div className="mt-[15px] mx-auto">
            <label className="font-['IBM_Plex_Sans'] text-[16px] font-normal text-black leading-normal pl-[17px]">
              Collaborator (Optional)
            </label>
            <Input
              className="w-[611px] h-[43px] rounded-[20px] border-2 border-[#e2e2e2] pl-[17px] font-['IBM_Plex_Sans'] text-[16px] font-normal text-[#898989] leading-normal placeholder:text-[#898989]"
              placeholder="Invite collaborator"
              value={formData.background}
              onChange={(e) => handleInputChange('background', e.target.value)}
            />
          </div>

          {/* Workspace Cover Section */}
          <div className="mt-[15px] mx-auto">
            <label className="font-['IBM_Plex_Sans'] text-[16px] font-normal text-black leading-normal pl-[17px]">
              Select Workspace Cover
            </label>

            <div className="mt-2 pl-[17px] grid grid-cols-3 gap-x-[25px] gap-y-[14px]">
              <Card className="w-[182px] h-[122px] flex-shrink-0 bg-[#f4f4f4] rounded-[5px] border-2 border-[#d9d9d9] flex flex-col items-center justify-center">
                <UploadCloudIcon className="w-12 h-12 mb-2" />
                <p className="font-['IBM_Plex_Sans'] text-[16px] font-normal text-[#898989] leading-normal">Upload from computer</p>
              </Card>

              {coverImages.map((image) => (
                <div
                  key={image.id}
                  className="w-[182px] h-[122px] flex-shrink-0 cursor-pointer"
                  onClick={() => handleInputChange('coverImage', image.src)}
                >
                  <img
                    className="w-full h-full object-cover rounded-[5px]"
                    alt={image.alt}
                    src={image.src}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Button */}
        <button
          className="absolute right-[37px] bottom-[36px] w-[90px] h-[35px] bg-[#ECF1F6] rounded-[17px] text-black font-['IBM_Plex_Sans'] text-[16px] font-normal leading-normal flex-shrink-0"
          onClick={handleSubmit}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;