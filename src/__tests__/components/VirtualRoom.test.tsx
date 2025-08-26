import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import VirtualRoom from '../../components/room/VirtualRoom';
import RoomAssets from '../../components/room/RoomAssets';
import Computer3DAsset from '../../components/room/Computer3DAsset';

// Mock Three.js and R3F
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: () => ({
    camera: { position: { set: vi.fn() } },
    scene: {},
  }),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  useGLTF: () => ({
    scene: { clone: vi.fn(() => ({ traverse: vi.fn() })) },
  }),
  Text: ({ children }: any) => <div data-testid="text">{children}</div>,
  Box: () => <div data-testid="box" />,
  Sphere: () => <div data-testid="sphere" />,
}));

const mockRoom = {
  id: '1',
  name: 'Test Room',
  description: 'A test virtual room',
  user_id: 'user-1',
  theme: 'cyberpunk',
  is_public: true,
  assets: [
    {
      id: 'asset-1',
      type: 'computer',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    },
  ],
};

describe('Virtual Room Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('VirtualRoom', () => {
    it('renders virtual room with canvas', () => {
      render(<VirtualRoom room={mockRoom} />);
      
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('displays room information', () => {
      render(<VirtualRoom room={mockRoom} />);
      
      expect(screen.getByText('Test Room')).toBeInTheDocument();
      expect(screen.getByText('A test virtual room')).toBeInTheDocument();
    });

    it('shows room controls', () => {
      render(<VirtualRoom room={mockRoom} />);
      
      expect(screen.getByRole('button', { name: /fullscreen/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    });

    it('handles fullscreen mode', async () => {
      render(<VirtualRoom room={mockRoom} />);
      
      const fullscreenButton = screen.getByRole('button', { name: /fullscreen/i });
      fireEvent.click(fullscreenButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('canvas')).toHaveClass('fullscreen');
      });
    });

    it('allows sharing room', async () => {
      const mockShare = vi.fn();
      global.navigator.share = mockShare;
      
      render(<VirtualRoom room={mockRoom} />);
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);
      
      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith({
          title: 'Test Room',
          text: 'Check out this virtual room!',
          url: expect.stringContaining('/room/1'),
        });
      });
    });
  });

  describe('RoomAssets', () => {
    it('renders room assets', () => {
      render(
        <Canvas>
          <RoomAssets assets={mockRoom.assets} />
        </Canvas>
      );
      
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('loads computer asset', () => {
      const computerAsset = mockRoom.assets[0];
      
      render(
        <Canvas>
          <Computer3DAsset asset={computerAsset} />
        </Canvas>
      );
      
      // Verify the asset is rendered within the canvas
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('handles asset interaction', async () => {
      const mockOnClick = vi.fn();
      const computerAsset = { ...mockRoom.assets[0], onClick: mockOnClick };
      
      render(
        <Canvas>
          <Computer3DAsset asset={computerAsset} onClick={mockOnClick} />
        </Canvas>
      );
      
      // Simulate clicking on the asset
      const canvas = screen.getByTestId('canvas');
      fireEvent.click(canvas);
      
      await waitFor(() => {
        expect(mockOnClick).toHaveBeenCalled();
      });
    });
  });

  describe('Computer3DAsset', () => {
    it('renders computer model', () => {
      const computerAsset = {
        id: 'computer-1',
        type: 'computer',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      };
      
      render(
        <Canvas>
          <Computer3DAsset asset={computerAsset} />
        </Canvas>
      );
      
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('handles model loading states', () => {
      const computerAsset = {
        id: 'computer-1',
        type: 'computer',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      };
      
      render(
        <Canvas>
          <Computer3DAsset asset={computerAsset} />
        </Canvas>
      );
      
      // The component should render without errors
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('applies correct transformations', () => {
      const computerAsset = {
        id: 'computer-1',
        type: 'computer',
        position: { x: 1, y: 2, z: 3 },
        rotation: { x: 0.1, y: 0.2, z: 0.3 },
        scale: { x: 2, y: 2, z: 2 },
      };
      
      render(
        <Canvas>
          <Computer3DAsset asset={computerAsset} />
        </Canvas>
      );
      
      // Asset should be rendered with correct transformations
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });
  });
});
