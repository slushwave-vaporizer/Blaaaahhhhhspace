// Media upload and processing test helpers
import { vi } from 'vitest';

// Mock file types for testing
export const mockFiles = {
  image: {
    jpeg: new File(['mock jpeg data'], 'test-image.jpg', { type: 'image/jpeg' }),
    png: new File(['mock png data'], 'test-image.png', { type: 'image/png' }),
    gif: new File(['mock gif data'], 'animated.gif', { type: 'image/gif' }),
    webp: new File(['mock webp data'], 'modern.webp', { type: 'image/webp' }),
    large: new File(['mock large image data'.repeat(1000)], 'large.jpg', { type: 'image/jpeg' }),
  },
  
  audio: {
    mp3: new File(['mock mp3 data'], 'track.mp3', { type: 'audio/mpeg' }),
    wav: new File(['mock wav data'], 'track.wav', { type: 'audio/wav' }),
    flac: new File(['mock flac data'], 'track.flac', { type: 'audio/flac' }),
    m4a: new File(['mock m4a data'], 'track.m4a', { type: 'audio/mp4' }),
    large: new File(['mock large audio data'.repeat(5000)], 'large.wav', { type: 'audio/wav' }),
  },
  
  video: {
    mp4: new File(['mock mp4 data'], 'video.mp4', { type: 'video/mp4' }),
    webm: new File(['mock webm data'], 'video.webm', { type: 'video/webm' }),
    mov: new File(['mock mov data'], 'video.mov', { type: 'video/quicktime' }),
    large: new File(['mock large video data'.repeat(10000)], 'large.mp4', { type: 'video/mp4' }),
  },
  
  document: {
    pdf: new File(['mock pdf data'], 'document.pdf', { type: 'application/pdf' }),
    zip: new File(['mock zip data'], 'archive.zip', { type: 'application/zip' }),
    json: new File(['{}'], 'data.json', { type: 'application/json' }),
  },
  
  model3d: {
    glb: new File(['mock glb data'], 'model.glb', { type: 'model/gltf-binary' }),
    gltf: new File(['mock gltf data'], 'model.gltf', { type: 'model/gltf+json' }),
    obj: new File(['mock obj data'], 'model.obj', { type: 'application/octet-stream' }),
  },
  
  invalid: {
    exe: new File(['mock exe data'], 'virus.exe', { type: 'application/x-msdownload' }),
    script: new File(['alert("xss")'], 'malicious.js', { type: 'application/javascript' }),
    oversized: new File(['x'.repeat(100 * 1024 * 1024)], 'huge.bin', { type: 'application/octet-stream' }),
  },
};

// Mock upload responses
export const mockUploadResponses = {
  success: (fileName: string) => ({
    data: {
      path: `uploads/${fileName}`,
      id: `file-${Date.now()}`,
      fullPath: `public/uploads/${fileName}`,
      size: 1024 * 50, // 50KB
      uploadedAt: new Date().toISOString(),
      url: `https://storage.example.com/uploads/${fileName}`,
      publicUrl: `https://cdn.example.com/uploads/${fileName}`,
    },
    error: null,
  }),
  
  error: (message: string, code?: string) => ({
    data: null,
    error: {
      message,
      code: code || 'UPLOAD_ERROR',
      statusCode: 400,
    },
  }),
  
  progress: (loaded: number, total: number) => ({
    loaded,
    total,
    percentage: Math.round((loaded / total) * 100),
  }),
};

// File validation helpers
export const validateFile = (file: File, constraints: any = {}) => {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = ['image/*', 'audio/*', 'video/*'],
    allowedExtensions = [],
    minSize = 1,
  } = constraints;
  
  const errors: string[] = [];
  
  // Size validation
  if (file.size > maxSize) {
    errors.push(`File size ${file.size} exceeds maximum ${maxSize} bytes`);
  }
  
  if (file.size < minSize) {
    errors.push(`File size ${file.size} is below minimum ${minSize} bytes`);
  }
  
  // Type validation
  const isTypeAllowed = allowedTypes.some((type: string) => {
    if (type.endsWith('*')) {
      return file.type.startsWith(type.slice(0, -1));
    }
    return file.type === type;
  });
  
  if (!isTypeAllowed) {
    errors.push(`File type ${file.type} is not allowed`);
  }
  
  // Extension validation
  if (allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      errors.push(`File extension ${extension} is not allowed`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    file: {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    },
  };
};

// Mock file upload process
export const mockFileUpload = {
  async uploadFile(file: File, options: any = {}) {
    const validation = validateFile(file, options.validation);
    if (!validation.valid) {
      return mockUploadResponses.error(validation.errors.join(', '), 'VALIDATION_ERROR');
    }
    
    // Simulate upload progress
    if (options.onProgress) {
      const steps = [0, 25, 50, 75, 100];
      for (const step of steps) {
        setTimeout(() => {
          options.onProgress(mockUploadResponses.progress(step, 100));
        }, step * 10);
      }
    }
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, options.delay || 100));
    
    return mockUploadResponses.success(file.name);
  },
  
  async uploadMultipleFiles(files: File[], options: any = {}) {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (options.onFileProgress) {
        options.onFileProgress(i, file.name);
      }
      
      const result = await this.uploadFile(file, { ...options, delay: 50 });
      results.push({ file: file.name, result });
    }
    
    return {
      data: results.filter(r => !r.result.error),
      errors: results.filter(r => r.result.error),
      total: files.length,
    };
  },
  
  async deleteFile(path: string) {
    // Simulate deletion
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return {
      data: { deleted: path },
      error: null,
    };
  },
};

// Media processing mocks
export const mockMediaProcessing = {
  async generateThumbnail(file: File) {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return {
        data: null,
        error: { message: 'Thumbnail generation not supported for this file type' },
      };
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      data: {
        url: `https://cdn.example.com/thumbnails/thumb_${file.name}.jpg`,
        width: 300,
        height: 200,
        format: 'jpeg',
        size: 15000,
      },
      error: null,
    };
  },
  
  async processAudio(file: File) {
    if (!file.type.startsWith('audio/')) {
      return {
        data: null,
        error: { message: 'File is not an audio file' },
      };
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: {
        duration: 245, // seconds
        waveform: Array.from({ length: 100 }, () => Math.random()),
        peaks: Array.from({ length: 1000 }, () => Math.random()),
        metadata: {
          bitrate: 320,
          sampleRate: 44100,
          channels: 2,
          format: 'mp3',
        },
        spectrogram_url: `https://cdn.example.com/spectrograms/spec_${file.name}.png`,
      },
      error: null,
    };
  },
  
  async processVideo(file: File) {
    if (!file.type.startsWith('video/')) {
      return {
        data: null,
        error: { message: 'File is not a video file' },
      };
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      data: {
        duration: 180, // seconds
        dimensions: { width: 1920, height: 1080 },
        framerate: 30,
        bitrate: 5000, // kbps
        codec: 'h264',
        thumbnails: [
          `https://cdn.example.com/video-thumbs/${file.name}_001.jpg`,
          `https://cdn.example.com/video-thumbs/${file.name}_002.jpg`,
          `https://cdn.example.com/video-thumbs/${file.name}_003.jpg`,
        ],
        preview_url: `https://cdn.example.com/previews/preview_${file.name}.mp4`,
      },
      error: null,
    };
  },
  
  async process3DModel(file: File) {
    const supported3DTypes = ['model/gltf-binary', 'model/gltf+json'];
    if (!supported3DTypes.includes(file.type)) {
      return {
        data: null,
        error: { message: 'Unsupported 3D model format' },
      };
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      data: {
        vertices: 12845,
        faces: 8432,
        materials: 3,
        textures: 5,
        animations: ['idle', 'rotate', 'glow'],
        bounding_box: {
          min: { x: -2, y: 0, z: -2 },
          max: { x: 2, y: 4, z: 2 },
        },
        preview_images: [
          `https://cdn.example.com/3d-previews/${file.name}_front.jpg`,
          `https://cdn.example.com/3d-previews/${file.name}_side.jpg`,
          `https://cdn.example.com/3d-previews/${file.name}_top.jpg`,
        ],
      },
      error: null,
    };
  },
};

// Storage bucket operations mock
export const mockStorageBucket = {
  async list(path: string = '') {
    const mockFiles = [
      { name: 'audio/track1.mp3', size: 5242880, updated_at: '2025-01-15T10:30:00Z' },
      { name: 'images/artwork1.jpg', size: 2097152, updated_at: '2025-01-15T11:45:00Z' },
      { name: 'videos/visualizer1.mp4', size: 52428800, updated_at: '2025-01-15T12:15:00Z' },
    ];
    
    return {
      data: mockFiles.filter(f => f.name.startsWith(path)),
      error: null,
    };
  },
  
  async createSignedUrl(path: string, expiresIn: number = 3600) {
    return {
      data: {
        signedUrl: `https://storage.example.com/${path}?token=signed_${Date.now()}&expires=${expiresIn}`,
        path,
        token: `signed_${Date.now()}`,
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      },
      error: null,
    };
  },
  
  async getPublicUrl(path: string) {
    return {
      data: {
        publicUrl: `https://cdn.example.com/${path}`,
        path,
      },
      error: null,
    };
  },
  
  async move(fromPath: string, toPath: string) {
    return {
      data: { message: `File moved from ${fromPath} to ${toPath}` },
      error: null,
    };
  },
  
  async copy(fromPath: string, toPath: string) {
    return {
      data: { message: `File copied from ${fromPath} to ${toPath}` },
      error: null,
    };
  },
};

// File transformation helpers
export const transformFile = {
  async resizeImage(file: File, width: number, height: number) {
    if (!file.type.startsWith('image/')) {
      throw new Error('File is not an image');
    }
    
    // Mock image resizing
    return new File(
      [`resized image data ${width}x${height}`],
      `resized_${width}x${height}_${file.name}`,
      { type: file.type }
    );
  },
  
  async compressAudio(file: File, bitrate: number) {
    if (!file.type.startsWith('audio/')) {
      throw new Error('File is not an audio file');
    }
    
    // Mock audio compression
    const compressedSize = Math.floor(file.size * (bitrate / 320));
    return new File(
      [`compressed audio data at ${bitrate}kbps`],
      `compressed_${bitrate}k_${file.name}`,
      { type: 'audio/mpeg' }
    );
  },
  
  async convertFormat(file: File, targetFormat: string) {
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
    };
    
    const newMimeType = mimeTypes[targetFormat];
    if (!newMimeType) {
      throw new Error(`Unsupported format: ${targetFormat}`);
    }
    
    const newFileName = file.name.replace(/\.[^.]+$/, `.${targetFormat}`);
    
    return new File(
      [`converted ${targetFormat} data`],
      newFileName,
      { type: newMimeType }
    );
  },
};
