import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProfileBuilder from '../../components/profile/ProfileBuilder';
import WidgetLibrary from '../../components/profile/WidgetLibrary';
import WidgetRenderer from '../../components/profile/WidgetRenderer';

const mockProfile = {
  id: '1',
  user_id: 'user-1',
  layout_id: 'modern',
  widgets: [
    {
      id: 'widget-1',
      type: 'about',
      position: { x: 0, y: 0, width: 12, height: 4 },
      data: { content: 'Test about content' },
      visible: true,
    },
    {
      id: 'widget-2',
      type: 'music',
      position: { x: 0, y: 4, width: 6, height: 8 },
      data: { tracks: [] },
      visible: true,
    },
  ],
  theme: 'dark',
  background: '/test-bg.jpg',
};

const renderWithDnd = (component: React.ReactElement) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      {component}
    </DndProvider>
  );
};

describe('Profile Builder Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ProfileBuilder', () => {
    it('renders profile builder interface', () => {
      renderWithDnd(<ProfileBuilder />);
      
      expect(screen.getByText(/profile builder/i)).toBeInTheDocument();
      expect(screen.getByText(/widget library/i)).toBeInTheDocument();
      expect(screen.getByText(/canvas/i)).toBeInTheDocument();
    });

    it('allows adding widgets from library', async () => {
      renderWithDnd(<ProfileBuilder />);
      
      // Find and click on a widget in the library
      const aboutWidget = screen.getByText(/about section/i);
      fireEvent.click(aboutWidget);
      
      // Verify widget was added to canvas
      await waitFor(() => {
        expect(screen.getByText(/about/i)).toBeInTheDocument();
      });
    });

    it('shows widget settings panel when widget is selected', async () => {
      renderWithDnd(<ProfileBuilder />);
      
      // Add a widget first
      const aboutWidget = screen.getByText(/about section/i);
      fireEvent.click(aboutWidget);
      
      // Click on the added widget
      await waitFor(() => {
        const addedWidget = screen.getByTestId('widget-about');
        fireEvent.click(addedWidget);
      });
      
      // Verify settings panel appears
      await waitFor(() => {
        expect(screen.getByText(/widget settings/i)).toBeInTheDocument();
      });
    });

    it('allows previewing the profile', async () => {
      renderWithDnd(<ProfileBuilder />);
      
      const previewButton = screen.getByRole('button', { name: /preview/i });
      fireEvent.click(previewButton);
      
      await waitFor(() => {
        expect(screen.getByText(/profile preview/i)).toBeInTheDocument();
      });
    });

    it('saves profile changes', async () => {
      const mockSave = vi.fn();
      renderWithDnd(<ProfileBuilder onSave={mockSave} />);
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockSave).toHaveBeenCalled();
      });
    });
  });

  describe('WidgetLibrary', () => {
    it('renders available widget types', () => {
      renderWithDnd(<WidgetLibrary />);
      
      expect(screen.getByText(/about section/i)).toBeInTheDocument();
      expect(screen.getByText(/music player/i)).toBeInTheDocument();
      expect(screen.getByText(/social links/i)).toBeInTheDocument();
      expect(screen.getByText(/gallery/i)).toBeInTheDocument();
    });

    it('shows widget descriptions on hover', async () => {
      renderWithDnd(<WidgetLibrary />);
      
      const aboutWidget = screen.getByText(/about section/i);
      fireEvent.mouseEnter(aboutWidget);
      
      await waitFor(() => {
        expect(screen.getByText(/add information about yourself/i)).toBeInTheDocument();
      });
    });

    it('filters widgets by category', async () => {
      renderWithDnd(<WidgetLibrary />);
      
      const mediaCategory = screen.getByText(/media/i);
      fireEvent.click(mediaCategory);
      
      await waitFor(() => {
        expect(screen.getByText(/music player/i)).toBeInTheDocument();
        expect(screen.getByText(/gallery/i)).toBeInTheDocument();
        expect(screen.queryByText(/about section/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('WidgetRenderer', () => {
    it('renders about widget correctly', () => {
      const aboutWidget = {
        id: 'test-about',
        type: 'about',
        data: { content: 'Test about content' },
        visible: true,
      };
      
      render(<WidgetRenderer widget={aboutWidget} />);
      
      expect(screen.getByText('Test about content')).toBeInTheDocument();
    });

    it('renders music widget correctly', () => {
      const musicWidget = {
        id: 'test-music',
        type: 'music',
        data: { 
          tracks: [
            { id: '1', title: 'Test Song', artist: 'Test Artist' }
          ] 
        },
        visible: true,
      };
      
      render(<WidgetRenderer widget={musicWidget} />);
      
      expect(screen.getByText('Test Song')).toBeInTheDocument();
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });

    it('does not render invisible widgets', () => {
      const hiddenWidget = {
        id: 'test-hidden',
        type: 'about',
        data: { content: 'Hidden content' },
        visible: false,
      };
      
      render(<WidgetRenderer widget={hiddenWidget} />);
      
      expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });

    it('handles unknown widget types gracefully', () => {
      const unknownWidget = {
        id: 'test-unknown',
        type: 'unknown-type',
        data: {},
        visible: true,
      };
      
      render(<WidgetRenderer widget={unknownWidget} />);
      
      expect(screen.getByText(/unsupported widget type/i)).toBeInTheDocument();
    });
  });
});
