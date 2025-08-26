// YourSpace Creative Labs - Post Composer Component
import React, { useState, useRef } from 'react';
import { Image, Video, Mic, MapPin, Calendar, Smile, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/Textarea';
import { useSocial } from '@/hooks/useSocial';
import { PostFormData } from '@/types/social';
import { toast } from 'react-hot-toast';

interface PostComposerProps {
  onPostCreated?: (post: any) => void;
  replyToId?: string;
  quotedPostId?: string;
  placeholder?: string;
  className?: string;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  onPostCreated,
  replyToId,
  quotedPostId,
  placeholder = "What's happening in your creative world?",
  className = ''
}) => {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'private'>('public');
  const [location, setLocation] = useState('');
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState(24);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const { createPost, loading } = useSocial();
  
  const characterLimit = 280;
  const remainingChars = characterLimit - content.length;
  const isOverLimit = remainingChars < 0;
  const canPost = content.trim().length > 0 && !isOverLimit && !loading;

  const handleFileSelect = (files: FileList | null, type: 'image' | 'video') => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];
    
    newFiles.forEach(file => {
      if (type === 'image' && file.type.startsWith('image/')) {
        validFiles.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      } else if (type === 'video' && file.type.startsWith('video/')) {
        validFiles.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      }
    });
    
    if (validFiles.length > 0) {
      setMediaFiles(prev => [...prev, ...validFiles].slice(0, 4));
      setMediaPreviewUrls(prev => [...prev, ...newPreviewUrls].slice(0, 4));
    }
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviewUrls[index]);
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!canPost) return;

    try {
      const postData: PostFormData = {
        content: content.trim(),
        mediaFiles,
        postType: replyToId ? 'reply' : quotedPostId ? 'quote' : 'post',
        replyToId,
        quotedPostId,
        visibility,
        location: location || undefined,
        poll: showPoll && pollOptions.some(opt => opt.trim()) ? {
          options: pollOptions.filter(opt => opt.trim()),
          duration: pollDuration
        } : undefined
      };

      const post = await createPost(postData);
      
      // Reset form
      setContent('');
      setMediaFiles([]);
      setMediaPreviewUrls(prev => {
        prev.forEach(url => URL.revokeObjectURL(url));
        return [];
      });
      setLocation('');
      setShowPoll(false);
      setPollOptions(['', '']);
      setPollDuration(24);
      
      toast.success(replyToId ? 'Reply posted!' : 'Post created!');
      onPostCreated?.(post);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions(prev => [...prev, '']);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    setPollOptions(prev => prev.map((opt, i) => i === index ? value : opt));
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      {/* Main Content Area */}
      <div className="flex gap-3">
        {/* Avatar placeholder - will be replaced with user avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex-shrink-0"></div>
        
        <div className="flex-1 space-y-4">
          {/* Text Input */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[120px] text-lg border-none resize-none focus:ring-0 p-0 bg-transparent"
            maxLength={characterLimit + 50} // Allow slight overflow for warning
          />
          
          {/* Media Preview */}
          {mediaPreviewUrls.length > 0 && (
            <div className={`grid gap-2 rounded-lg overflow-hidden ${
              mediaPreviewUrls.length === 1 ? 'grid-cols-1' :
              mediaPreviewUrls.length === 2 ? 'grid-cols-2' :
              'grid-cols-2'
            }`}>
              {mediaPreviewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  {mediaFiles[index]?.type.startsWith('video/') ? (
                    <video
                      src={url}
                      className="w-full h-48 object-cover rounded-lg"
                      controls
                    />
                  ) : (
                    <img
                      src={url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Poll Interface */}
          {showPoll && (
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Create a poll</h4>
                <button
                  onClick={() => setShowPoll(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {pollOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    maxLength={25}
                  />
                  {pollOptions.length > 2 && (
                    <button
                      onClick={() => removePollOption(index)}
                      className="text-gray-500 hover:text-red-500 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              {pollOptions.length < 4 && (
                <button
                  onClick={addPollOption}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add option
                </button>
              )}
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">Poll duration:</label>
                <select
                  value={pollDuration}
                  onChange={(e) => setPollDuration(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value={1}>1 hour</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>1 day</option>
                  <option value={72}>3 days</option>
                  <option value={168}>1 week</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Location Input */}
          {location !== undefined && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location"
                className="flex-1 text-sm bg-transparent border-none focus:ring-0 p-0"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        {/* Media and Options */}
        <div className="flex items-center gap-1">
          {/* Image Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-full text-purple-600 dark:text-purple-400 transition-colors"
            title="Add images"
          >
            <Image className="w-5 h-5" />
          </button>
          
          {/* Video Upload */}
          <button
            onClick={() => videoInputRef.current?.click()}
            className="p-2 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-full text-purple-600 dark:text-purple-400 transition-colors"
            title="Add video"
          >
            <Video className="w-5 h-5" />
          </button>
          
          {/* Poll Toggle */}
          <button
            onClick={() => setShowPoll(!showPoll)}
            className={`p-2 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-full transition-colors ${
              showPoll ? 'text-purple-600 bg-purple-50 dark:bg-gray-700 dark:text-purple-400' : 'text-gray-500'
            }`}
            title="Create poll"
          >
            <Calendar className="w-5 h-5" />
          </button>
          
          {/* Location Toggle */}
          <button
            onClick={() => setLocation(location === '' ? '' : undefined)}
            className={`p-2 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-full transition-colors ${
              location !== undefined ? 'text-purple-600 bg-purple-50 dark:bg-gray-700 dark:text-purple-400' : 'text-gray-500'
            }`}
            title="Add location"
          >
            <MapPin className="w-5 h-5" />
          </button>
          
          {/* Visibility Selector */}
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as 'public' | 'followers' | 'private')}
            className="text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="public">Everyone</option>
            <option value="followers">Followers</option>
            <option value="private">Private</option>
          </select>
        </div>
        
        {/* Character Count and Post Button */}
        <div className="flex items-center gap-4">
          {/* Character Counter */}
          <div className={`text-sm font-medium ${
            remainingChars < 20 ? remainingChars < 0 ? 'text-red-500' : 'text-orange-500' : 'text-gray-500'
          }`}>
            {remainingChars < 20 && remainingChars}
          </div>
          
          {/* Post Button */}
          <Button
            onClick={handleSubmit}
            disabled={!canPost}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              canPost
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Posting...
              </div>
            ) : (
              replyToId ? 'Reply' : 'Post'
            )}
          </Button>
        </div>
      </div>
      
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files, 'image')}
      />
      
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files, 'video')}
      />
    </div>
  );
};