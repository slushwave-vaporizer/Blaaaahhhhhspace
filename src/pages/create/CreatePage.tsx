// YourSpace Creative Labs - Create Page
import { useState } from 'react'
import { useContent } from '../../hooks/useContent'
import { 
  CloudArrowUpIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  CubeIcon,
  DocumentTextIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'
import { cn, formatFileSize, getFileExtension } from '../../lib/utils'
import { useDropzone } from 'react-dropzone'

const contentTypes = [
  { id: 'image', name: 'Image', icon: PhotoIcon, accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] } },
  { id: 'video', name: 'Video', icon: VideoCameraIcon, accept: { 'video/*': ['.mp4', '.webm', '.mov'] } },
  { id: 'audio', name: 'Audio', icon: MusicalNoteIcon, accept: { 'audio/*': ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.mp4'] } },
  { id: 'model', name: '3D Model', icon: CubeIcon, accept: { '.gltf,.glb,.obj': ['.gltf', '.glb', '.obj'] } },
  { id: 'code', name: 'Code', icon: CodeBracketIcon, accept: { 'text/*': ['.js', '.ts', '.py', '.html', '.css'] } },
  { id: 'text', name: 'Document', icon: DocumentTextIcon, accept: { 'text/*': ['.txt', '.md', '.pdf'] } }
]

export const CreatePage = () => {
  const { uploadContent, uploading } = useContent()
  const [selectedType, setSelectedType] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    isPublic: true
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const currentType = contentTypes.find(type => type.id === selectedType)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: currentType?.accept || {},
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0])
      }
    },
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !selectedType) {
      return
    }

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)

    const result = await uploadContent({
      file: selectedFile,
      title: formData.title,
      description: formData.description,
      tags,
      isPublic: formData.isPublic,
      contentType: selectedType
    })

    if (result) {
      // Reset form
      setFormData({ title: '', description: '', tags: '', isPublic: true })
      setSelectedFile(null)
      setSelectedType('')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-4">Create Something Amazing</h1>
        <p className="text-gray-400 text-lg">
          Upload your creative work and share it with the YourSpace community
        </p>
      </div>

      {/* Content Type Selection */}
      {!selectedType && (
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Choose Content Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {contentTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className="p-6 bg-black/30 border border-purple-500/30 rounded-xl hover:border-purple-400/50 hover:bg-purple-500/10 transition-all duration-200 group"
                >
                  <Icon className="h-12 w-12 mx-auto mb-3 text-purple-400 group-hover:text-purple-300" />
                  <h3 className="text-white font-semibold">{type.name}</h3>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Upload Form */}
      {selectedType && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload */}
          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                {currentType && <currentType.icon className="h-6 w-6 mr-2 text-purple-400" />}
                Upload {currentType?.name}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedType('')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Change Type
              </button>
            </div>

            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={cn(
                  'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200',
                  isDragActive || dragActive
                    ? 'border-purple-400 bg-purple-500/10'
                    : 'border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-500/5'
                )}
              >
                <input {...getInputProps()} />
                <CloudArrowUpIcon className="h-16 w-16 mx-auto mb-4 text-purple-400" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isDragActive ? 'Drop your file here' : 'Upload your file'}
                </h3>
                <p className="text-gray-400 mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <div className="text-sm text-gray-500">
                  Supported formats: {Object.values(currentType?.accept || {}).flat().join(', ')}
                </div>
              </div>
            ) : (
              <div className="bg-black/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {getFileExtension(selectedFile.name).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{selectedFile.name}</h4>
                      <p className="text-gray-400 text-sm">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content Details */}
          {selectedFile && (
            <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-white">Content Details</h2>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  placeholder="Give your creation a catchy title"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
                  placeholder="Describe your creation, inspiration, or process..."
                />
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  placeholder="vaporwave, synthwave, neon, cyberpunk (comma-separated)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Add tags to help others discover your content
                </p>
              </div>

              {/* Privacy */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-500 bg-black/30 border-purple-500/30 rounded focus:ring-purple-400/20"
                />
                <label htmlFor="isPublic" className="ml-2 text-gray-300">
                  Make this content public
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading || !formData.title.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  'Upload & Share'
                )}
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  )
}