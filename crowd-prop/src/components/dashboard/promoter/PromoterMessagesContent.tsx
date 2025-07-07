'use client';

import { useState } from 'react';
import Link from 'next/link';
import { routes } from '@/lib/router';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  VideoCameraIcon,
  PhoneIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

// Mock data for message threads
const mockThreads = [
  {
    id: '1',
    participant: {
      name: 'Tracy Brown',
      avatar: '/api/placeholder/40/40',
      company: 'HealthTech Inc.',
      role: 'Marketing Manager'
    },
    campaign: {
      id: '1',
      title: 'KeepFit Health App',
      type: 'VISIBILITY'
    },
    lastMessage: {
      content: 'Looking forward to our meeting this Thursday!',
      timestamp: '2025-07-01T10:30:00Z',
      sender: 'participant'
    },
    unreadCount: 2,
    status: 'active'
  },
  {
    id: '2',
    participant: {
      name: 'Alex Chen',
      avatar: '/api/placeholder/40/40',
      company: 'TechStart Inc.',
      role: 'CEO'
    },
    campaign: {
      id: '2',
      title: 'AI Web Service',
      type: 'SALESMAN'
    },
    lastMessage: {
      content: 'Just updated the product version. Please check the new features.',
      timestamp: '2025-06-30T15:45:00Z',
      sender: 'participant'
    },
    unreadCount: 0,
    status: 'active'
  },
  {
    id: '3',
    participant: {
      name: 'Sarah Williams',
      avatar: '/api/placeholder/40/40',
      company: 'Marketing Pro LLC',
      role: 'Project Lead'
    },
    campaign: {
      id: '3',
      title: 'SechTrendz Consulting',
      type: 'CONSULTANT'
    },
    lastMessage: {
      content: 'The deliverables look great! When can we schedule the next review?',
      timestamp: '2025-06-29T14:20:00Z',
      sender: 'participant'
    },
    unreadCount: 1,
    status: 'active'
  },
  {
    id: '4',
    participant: {
      name: 'Mike Johnson',
      avatar: '/api/placeholder/40/40',
      company: 'GreenLife Co.',
      role: 'Brand Manager'
    },
    campaign: {
      id: '4',
      title: 'Eco-Friendly Products',
      type: 'VISIBILITY'
    },
    lastMessage: {
      content: 'Campaign completed successfully! Thanks for the great work.',
      timestamp: '2025-06-28T09:15:00Z',
      sender: 'participant'
    },
    unreadCount: 0,
    status: 'completed'
  }
];

// Mock messages for selected thread
const mockMessages = [
  {
    id: '1',
    content: 'Hi! I&apos;m excited to work with you on the KeepFit campaign. Let me know if you have any questions about the requirements.',
    timestamp: '2025-06-28T09:00:00Z',
    sender: 'participant',
    type: 'text'
  },
  {
    id: '2',
    content: 'Hello Tracy! Thank you for reaching out. I&apos;ve reviewed the campaign details and I&apos;m ready to get started. The target audience and messaging look great.',
    timestamp: '2025-06-28T09:30:00Z',
    sender: 'user',
    type: 'text'
  },
  {
    id: '3',
    content: 'Perfect! I&apos;ve attached the brand guidelines and additional creative assets you might need.',
    timestamp: '2025-06-28T10:00:00Z',
    sender: 'participant',
    type: 'text',
    attachments: [
      { name: 'brand-guidelines.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'logo-assets.zip', size: '15.8 MB', type: 'zip' }
    ]
  },
  {
    id: '4',
    content: 'Thank you for the assets! I&apos;ll incorporate these into my promotional content. I should have the first draft ready by tomorrow.',
    timestamp: '2025-06-28T11:15:00Z',
    sender: 'user',
    type: 'text'
  },
  {
    id: '5',
    content: 'Great! Also, would you be available for a quick call this Thursday at 2 PM to discuss the campaign strategy?',
    timestamp: '2025-07-01T10:30:00Z',
    sender: 'participant',
    type: 'text'
  },
  {
    id: '6',
    content: 'Looking forward to our meeting this Thursday!',
    timestamp: '2025-07-01T10:32:00Z',
    sender: 'participant',
    type: 'text'
  }
];

export default function PromoterMessagesContent() {
  const [selectedThread, setSelectedThread] = useState(mockThreads[0]);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredThreads = mockThreads.filter(thread =>
    thread.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.participant.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    // In a real app, this would send the message to your backend
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VISIBILITY':
        return 'bg-blue-100 text-blue-800';
      case 'SALESMAN':
        return 'bg-green-100 text-green-800';
      case 'CONSULTANT':
        return 'bg-purple-100 text-purple-800';
      case 'SELLER':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Sidebar - Message Threads */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedThread.id === thread.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {thread.participant.name.charAt(0)}
                    </span>
                  </div>
                  {thread.status === 'active' && (
                    <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {thread.participant.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(thread.lastMessage.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-600">{thread.participant.company}</p>
                    {thread.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate pr-2">
                      {thread.lastMessage.content}
                    </p>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(thread.campaign.type)}`}>
                      {thread.campaign.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {selectedThread.participant.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedThread.participant.name}
                </h2>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">{selectedThread.participant.company}</p>
                  <span className="text-gray-400">•</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedThread.campaign.type)}`}>
                    {selectedThread.campaign.type}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <PhoneIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <VideoCameraIcon className="h-5 w-5" />
              </button>
              <Link
                href={routes.dashboardCampaignDetails(selectedThread.campaign.id)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <InformationCircleIcon className="h-5 w-5" />
              </Link>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'order-2' : ''}`}>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Attachments */}
                  {message.attachments && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center space-x-2 p-2 rounded-lg ${
                            message.sender === 'user' ? 'bg-blue-500' : 'bg-gray-100'
                          }`}
                        >
                          <PaperClipIcon className="h-4 w-4" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{attachment.name}</p>
                            <p className="text-xs opacity-75">{attachment.size}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p
                  className={`text-xs text-gray-500 mt-1 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
              
              {/* Avatar for participant messages */}
              {message.sender === 'participant' && (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-xs font-medium text-white">
                    {selectedThread.participant.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-end space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <PaperClipIcon className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
