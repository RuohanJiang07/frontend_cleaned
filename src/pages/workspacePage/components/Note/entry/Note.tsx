import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent } from '../../../../../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../../components/ui/avatar';
import { 
  SearchIcon, 
  ChevronDownIcon,
  PlusIcon,
  UploadIcon,
  EditIcon,
  TrashIcon,
  FileTextIcon
} from 'lucide-react';

interface NoteItem {
  id: string;
  name: string;
  dateCreated: string;
  lastModified: string;
  owner: string;
  ownerAvatar: string;
}

function Note() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('By Name');

  // Sample recent notes data
  const recentNotes = Array.from({ length: 5 }, (_, i) => ({
    id: (i + 1).toString(),
    title: 'Moment of Inertia',
    date: 'Apr 18, 12:56 PM',
    thumbnail: '/workspace/note-thumbnail.png' // You'll need to add this image
  }));

  // Sample all notes data
  const allNotes: NoteItem[] = [
    {
      id: '1',
      name: 'Moment of Inertia',
      dateCreated: 'Apr 18, 2025, 12:56 PM',
      lastModified: 'Apr 18, 2025, 12:56 PM',
      owner: 'John Doe',
      ownerAvatar: '/main/landing_page/avatars.png'
    },
    {
      id: '2',
      name: "Newton's Laws",
      dateCreated: 'Apr 18, 2025, 12:56 PM',
      lastModified: 'Apr 18, 2025, 12:56 PM',
      owner: 'John Doe',
      ownerAvatar: '/main/landing_page/avatars.png'
    },
    {
      id: '3',
      name: "Newton's Laws",
      dateCreated: 'Apr 18, 2025, 12:56 PM',
      lastModified: 'Apr 18, 2025, 12:56 PM',
      owner: 'John Doe',
      ownerAvatar: '/main/landing_page/avatars.png'
    },
    {
      id: '4',
      name: "Newton's Laws",
      dateCreated: 'Apr 18, 2025, 12:56 PM',
      lastModified: 'Apr 18, 2025, 12:56 PM',
      owner: 'John Doe',
      ownerAvatar: '/main/landing_page/avatars.png'
    },
    {
      id: '5',
      name: "Newton's Laws",
      dateCreated: 'Apr 18, 2025, 12:56 PM',
      lastModified: 'Apr 18, 2025, 12:56 PM',
      owner: 'John Doe',
      ownerAvatar: '/main/landing_page/avatars.png'
    },
    {
      id: '6',
      name: "Newton's Laws",
      dateCreated: 'Apr 18, 2025, 12:56 PM',
      lastModified: 'Apr 18, 2025, 12:56 PM',
      owner: 'John Doe',
      ownerAvatar: '/main/landing_page/avatars.png'
    },
    {
      id: '7',
      name: "Newton's Laws",
      dateCreated: 'Apr 18, 2025, 12:56 PM',
      lastModified: 'Apr 18, 2025, 12:56 PM',
      owner: 'John Doe',
      ownerAvatar: '/main/landing_page/avatars.png'
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-white">
      <main className="flex-1 p-12 max-w-7xl mx-auto">
        {/* Header with icon and title - matching Document Chat style */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <img
              className="w-12 h-10"
              alt="Hyperknow logo"
              src="/main/landing_page/hyperknow_logo 1.svg"
            />
            <div>
              <h2 className="font-['Outfit',Helvetica] font-medium text-black text-2xl">
                Smart Note
              </h2>
              <p className="font-['Outfit',Helvetica] font-medium text-black text-[13px]">
                better than google docs and granola
              </p>
            </div>
          </div>
        </div>

        {/* Recent Section */}
        <div className="mb-12">
          <h2 className="font-semibold text-black text-xl font-['Inter',Helvetica] mb-6">
            Recent
          </h2>
          
          <div className="flex gap-6 overflow-x-auto pb-4">
            {recentNotes.map((note) => (
              <div key={note.id} className="flex-shrink-0">
                <Card className="w-[200px] h-[280px] bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    {/* Date header */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <span className="text-xs font-medium text-gray-500 font-['Inter',Helvetica]">
                        {note.date}
                      </span>
                    </div>
                    
                    {/* Note preview */}
                    <div className="p-4 h-[200px] bg-gray-50 flex items-center justify-center">
                      <div className="w-full h-full bg-white rounded border border-gray-200 flex flex-col">
                        {/* Mock document header */}
                        <div className="flex items-center gap-2 p-2 border-b border-gray-100">
                          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                            <FileTextIcon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-black">Class Notes</div>
                            <div className="text-xs text-gray-500">PHYS 2211 MECHANICS</div>
                          </div>
                        </div>
                        
                        {/* Mock content lines */}
                        <div className="p-2 space-y-1">
                          <div className="h-2 bg-gray-200 rounded w-full"></div>
                          <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                          <div className="mt-2 space-y-1">
                            <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                            <div className="h-1.5 bg-gray-100 rounded w-5/6"></div>
                            <div className="h-1.5 bg-gray-100 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Note title */}
                    <div className="px-4 py-3">
                      <h3 className="font-medium text-black text-sm font-['Inter',Helvetica]">
                        {note.title}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* All Notes Section */}
        <div className="w-full">
          {/* All Notes header and controls */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-black text-xl font-['Inter',Helvetica]">
              All Notes
            </h2>
            
            <div className="flex items-center gap-3">
              {/* Search bar */}
              <div className="relative w-[280px]">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for notes..."
                  className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm font-['Inter',Helvetica] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Sort dropdown */}
              <Button
                variant="outline"
                className="h-10 px-4 border-gray-300 rounded-lg flex items-center gap-2 font-['Inter',Helvetica] text-sm"
              >
                <span className="text-gray-700">{sortBy}</span>
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              </Button>
              
              {/* New button */}
              <Button className="h-10 px-4 bg-black text-white rounded-lg flex items-center gap-2 font-['Inter',Helvetica] text-sm hover:bg-gray-800">
                <PlusIcon className="w-4 h-4" />
                New
              </Button>
              
              {/* Upload button */}
              <Button
                variant="outline"
                className="h-10 px-4 border-gray-300 rounded-lg flex items-center gap-2 font-['Inter',Helvetica] text-sm"
              >
                <UploadIcon className="w-4 h-4" />
                Upload
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="col-span-4">
                <span className="font-medium text-gray-700 text-sm font-['Inter',Helvetica]">Name</span>
              </div>
              <div className="col-span-3">
                <span className="font-medium text-gray-700 text-sm font-['Inter',Helvetica]">Date Created</span>
              </div>
              <div className="col-span-3">
                <span className="font-medium text-gray-700 text-sm font-['Inter',Helvetica]">Last Modified</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-700 text-sm font-['Inter',Helvetica]">Owner</span>
              </div>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-gray-100">
              {allNotes.map((note) => (
                <div
                  key={note.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <FileTextIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900 text-sm font-['Inter',Helvetica]">
                      {note.name}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-gray-600 text-sm font-['Inter',Helvetica]">
                      {note.dateCreated}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-gray-600 text-sm font-['Inter',Helvetica]">
                      {note.lastModified}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={note.ownerAvatar} alt={note.owner} />
                        <AvatarFallback className="text-xs">
                          {note.owner.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-600 text-sm font-['Inter',Helvetica]">
                        {note.owner}
                      </span>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-16 text-xs font-['Inter',Helvetica] text-gray-600 hover:text-gray-900"
                      >
                        OPEN
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-600"
                      >
                        <EditIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Note;