import React, { useState, useEffect } from 'react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent } from '../../../../../components/ui/card';
import {
  UploadIcon,
  X,
  PlusIcon,
  LightbulbIcon
} from 'lucide-react';
import DocumentChatResponse from '../response/DocumentChatResponse';
import { UploadModal } from '../../../../../components/workspacePage/uploadModal';

interface DocumentTag {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt' | 'other';
}

interface HistoryItem {
  id: string;
  title: string;
  date: string;
  fileCount: number;
}

interface DocumentChatProps {
  isSplit?: boolean;
  onBack?: () => void;
  onViewChange?: (view: string | null) => void;
}

function DocumentChat({ isSplit = false, onBack, onViewChange }: DocumentChatProps) {
  // Hard-coded reference file that matches the API
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentTag[]>([
    { 
      id: 'file-1bcf6d47fc704e63bf6b754b88668b08', 
      name: 'Introduction to Quantum Mechanics', 
      type: 'pdf' 
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const itemsPerPage = 8;

  const historyItems: HistoryItem[] = Array.from({ length: 24 }, (_, i) => ({
    id: (i + 1).toString(),
    title: 'Cosmological Coupling and Black Holes',
    date: 'Jun 1, 9:50 PM',
    fileCount: 8
  }));

  useEffect(() => {
    const filtered = historyItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentPage(1); // Reset