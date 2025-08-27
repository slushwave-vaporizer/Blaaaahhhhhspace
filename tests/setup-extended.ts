import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Enhanced setup for comprehensive testing

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.clearAllTimers();
});

// Global test environment setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
  process.env.VITE_SUPABASE_ANON_KEY = 'test-key';
  
  // Mock console methods to reduce noise in tests
  global.console = {
    ...console,
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  };
  
  // Mock requestAnimationFrame for Three.js and animations
  global.requestAnimationFrame = vi.fn((cb) => {
    setTimeout(cb, 16);
    return 1;
  });
  
  global.cancelAnimationFrame = vi.fn();
  
  // Mock Web APIs that might not be available in test environment
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost:3000/',
      origin: 'http://localhost:3000',
      pathname: '/',
      search: '',
      hash: '',
    },
    writable: true,
  });
  
  // Mock Notification API
  global.Notification = {
    permission: 'granted',
    requestPermission: vi.fn(() => Promise.resolve('granted')),
  } as any;
  
  // Mock getUserMedia for audio/video testing
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn(() => Promise.resolve({
        getTracks: () => [{
          stop: vi.fn(),
          kind: 'audio',
          enabled: true,
        }],
      })),
      enumerateDevices: vi.fn(() => Promise.resolve([])),
    },
    writable: true,
  });
  
  // Mock File and FileReader APIs
  global.File = class MockFile {
    constructor(public chunks: any[], public name: string, public options: any = {}) {}
    get size() { return this.chunks.reduce((acc, chunk) => acc + chunk.length, 0); }
    get type() { return this.options.type || ''; }
    get lastModified() { return this.options.lastModified || Date.now(); }
  } as any;
  
  global.FileReader = class MockFileReader {
    result: any = null;
    error: any = null;
    readyState: number = 0;
    onload: any = null;
    onerror: any = null;
    onloadend: any = null;
    
    readAsDataURL(file: File) {
      setTimeout(() => {
        this.result = `data:${file.type};base64,mock-base64-data`;
        this.readyState = 2;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      }, 10);
    }
    
    readAsText(file: File) {
      setTimeout(() => {
        this.result = 'mock file content';
        this.readyState = 2;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      }, 10);
    }
  } as any;
  
  // Mock Clipboard API
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn(() => Promise.resolve()),
      readText: vi.fn(() => Promise.resolve('mock clipboard text')),
    },
    writable: true,
  });
  
  // Mock WebGL for Three.js testing
  const mockWebGLContext = {
    canvas: document.createElement('canvas'),
    getExtension: vi.fn(),
    getParameter: vi.fn(),
    createShader: vi.fn(),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    createProgram: vi.fn(),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    useProgram: vi.fn(),
    createBuffer: vi.fn(),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    drawArrays: vi.fn(),
    viewport: vi.fn(),
    clearColor: vi.fn(),
    clear: vi.fn(),
  };
  
  HTMLCanvasElement.prototype.getContext = vi.fn((contextType) => {
    if (contextType === 'webgl' || contextType === 'webgl2') {
      return mockWebGLContext;
    }
    return null;
  });
  
  // Mock performance API
  Object.defineProperty(window, 'performance', {
    value: {
      now: vi.fn(() => Date.now()),
      mark: vi.fn(),
      measure: vi.fn(),
      getEntriesByName: vi.fn(() => []),
      getEntriesByType: vi.fn(() => []),
    },
    writable: true,
  });
});

// Global cleanup
afterAll(() => {
  vi.restoreAllMocks();
});

// Test database cleanup helper
export const cleanupTestDatabase = async () => {
  // This would typically clean up test database state
  // Implementation depends on your test database setup
  console.log('Cleaning up test database...');
};

// Test file upload helper
export const createMockFile = (name: string, type: string, size: number = 1024) => {
  const file = new File(['mock file content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// Test audio context helper
export const createMockAudioContext = () => {
  return {
    createGain: vi.fn(() => ({
      connect: vi.fn(),
      disconnect: vi.fn(),
      gain: { value: 1 },
    })),
    createOscillator: vi.fn(() => ({
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: { value: 440 },
    })),
    createAnalyser: vi.fn(() => ({
      connect: vi.fn(),
      disconnect: vi.fn(),
      fftSize: 2048,
      frequencyBinCount: 1024,
      getByteFrequencyData: vi.fn(),
      getByteTimeDomainData: vi.fn(),
    })),
    destination: {},
    currentTime: 0,
    sampleRate: 44100,
    close: vi.fn(),
    suspend: vi.fn(),
    resume: vi.fn(),
  };
};
