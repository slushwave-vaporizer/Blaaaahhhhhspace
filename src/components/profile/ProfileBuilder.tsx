import React, { useState, useRef, useCallback, useMemo } from 'react'
import { useProfileBuilder, WidgetType, WidgetConfig } from '../../hooks/useProfileBuilder'
import { WidgetLibrary } from './WidgetLibrary'
import { ProfileCanvas } from './ProfileCanvas'
import { ProfileBuilderHeader } from './ProfileBuilderHeader'
import { WidgetSettingsPanel } from './WidgetSettingsPanel'
import { ProfilePreview } from './ProfilePreview'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable'
import { 
  Bars3Icon, 
  XMarkIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon
} from '@heroicons/react/24/outline'

interface ProfileBuilderProps {
  className?: string
}

type ViewMode = 'desktop' | 'tablet' | 'mobile'

export const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ className = '' }) => {
  const {
    layouts,
    activeLayout,
    widgets,
    isLoading,
    error,
    createLayout,
    activateLayout,
    deleteLayout,
    addWidget,
    updateWidget,
    removeWidget,
    saveLayout
  } = useProfileBuilder()

  const [selectedWidget, setSelectedWidget] = useState<WidgetConfig | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const [draggedWidget, setDraggedWidget] = useState<{ type: WidgetType } | null>(null)
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(true)
  const [showSettingsPanel, setShowSettingsPanel] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Enhanced drag sensors with better touch support
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5
      }
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // Enhanced drag handlers with better positioning
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    
    // Check if dragging from widget library
    if (typeof active.id === 'string' && active.id.startsWith('library-')) {
      const widgetType = active.id.replace('library-', '') as WidgetType
      setDraggedWidget({ type: widgetType })
    } else {
      // Dragging existing widget
      const widget = widgets.find(w => w.id === active.id)
      if (widget) {
        setSelectedWidget(widget)
      }
    }
  }, [widgets])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    setDraggedWidget(null)

    if (!over) return

    // Check if dropping on canvas
    if (over.id === 'profile-canvas') {
      const canvasRect = canvasRef.current?.getBoundingClientRect()
      if (!canvasRect) return

      // Calculate drop position relative to canvas
      const clientOffset = event.activatorEvent as any
      const canvasX = clientOffset?.clientX - canvasRect.left
      const canvasY = clientOffset?.clientY - canvasRect.top
      
      const gridSize = 20
      const dropPosition = {
        x: Math.max(0, Math.floor(canvasX / gridSize)),
        y: Math.max(0, Math.floor(canvasY / gridSize))
      }

      // If dragging from library, create new widget
      if (typeof active.id === 'string' && active.id.startsWith('library-')) {
        const widgetType = active.id.replace('library-', '') as WidgetType
        await addWidget(widgetType, dropPosition)
      } else {
        // Move existing widget
        const widget = widgets.find(w => w.id === active.id)
        if (widget && event.delta) {
          const newPosition = {
            x: Math.max(0, widget.position.x + Math.floor(event.delta.x / gridSize)),
            y: Math.max(0, widget.position.y + Math.floor(event.delta.y / gridSize))
          }
          await updateWidget(widget.id, { position: newPosition })
        }
      }
    }
  }, [widgets, addWidget, updateWidget])

  // Enhanced widget handlers
  const handleWidgetSelect = useCallback((widget: WidgetConfig) => {
    setSelectedWidget(selectedWidget?.id === widget.id ? null : widget)
    setShowSettingsPanel(true)
  }, [selectedWidget])

  const handleWidgetUpdate = useCallback(async (widgetId: string, updates: Partial<WidgetConfig>) => {
    await updateWidget(widgetId, updates)
    // Update selected widget if it's the one being updated
    if (selectedWidget?.id === widgetId) {
      setSelectedWidget(prev => prev ? { ...prev, ...updates } : null)
    }
  }, [updateWidget, selectedWidget])

  const handleWidgetDelete = useCallback(async (widgetId: string) => {
    await removeWidget(widgetId)
    if (selectedWidget?.id === widgetId) {
      setSelectedWidget(null)
    }
  }, [removeWidget, selectedWidget])

  // View mode configurations
  const viewModeConfig = useMemo(() => {
    switch (viewMode) {
      case 'mobile':
        return { width: 375, name: 'Mobile', icon: DevicePhoneMobileIcon }
      case 'tablet':
        return { width: 768, name: 'Tablet', icon: DeviceTabletIcon }
      default:
        return { width: 1200, name: 'Desktop', icon: ComputerDesktopIcon }
    }
  }, [viewMode])

  // Responsive layout calculations
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 1024
  const shouldShowMobileMenu = isSmallScreen && (showWidgetLibrary || (selectedWidget && showSettingsPanel))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <LoadingSpinner size="lg" className="text-pink-500 mb-4" />
          <div className="text-gray-400">Loading Profile Builder...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center p-8 bg-gray-900 rounded-lg border border-pink-500/20 max-w-md">
          <div className="text-red-400 text-lg mb-4">Error loading profile builder</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (previewMode) {
    return (
      <ProfilePreview
        layout={activeLayout}
        widgets={widgets}
        onExitPreview={() => setPreviewMode(false)}
      />
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`min-h-screen bg-black text-white relative ${className}`}>
        {/* Header */}
        <ProfileBuilderHeader
          layouts={layouts}
          activeLayout={activeLayout}
          onCreateLayout={createLayout}
          onActivateLayout={activateLayout}
          onDeleteLayout={deleteLayout}
          onSave={saveLayout}
          onPreview={() => setPreviewMode(true)}
          onToggleLibrary={() => setShowWidgetLibrary(!showWidgetLibrary)}
        />

        {/* Mobile Menu Toggle */}
        {isSmallScreen && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="fixed top-20 left-4 z-50 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors lg:hidden"
          >
            {isMobileMenuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        )}

        <div className="flex h-[calc(100vh-4rem)] relative">
          {/* Widget Library Sidebar */}
          <div className={`${
            isSmallScreen 
              ? `fixed inset-y-16 left-0 z-40 w-80 transform transition-transform duration-300 ${
                  showWidgetLibrary && isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`
              : showWidgetLibrary ? 'w-80' : 'w-0'
          } border-r border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden`}>
            {showWidgetLibrary && (
              <>
                <WidgetLibrary />
                {/* Mobile overlay */}
                {isSmallScreen && isMobileMenuOpen && (
                  <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                )}
              </>
            )}
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 relative overflow-hidden">
            {/* View Mode Selector */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-1 bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 border border-gray-700">
              {(['desktop', 'tablet', 'mobile'] as ViewMode[]).map((mode) => {
                const config = mode === 'mobile' 
                  ? { width: 375, name: 'Mobile', icon: DevicePhoneMobileIcon }
                  : mode === 'tablet'
                  ? { width: 768, name: 'Tablet', icon: DeviceTabletIcon }
                  : { width: 1200, name: 'Desktop', icon: ComputerDesktopIcon }
                
                const IconComponent = config.icon
                
                return (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm transition-colors ${
                      viewMode === mode
                        ? 'bg-pink-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{config.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Canvas Container with View Mode */}
            <div className="h-full flex items-center justify-center p-4 pt-16">
              <div 
                className="transition-all duration-300 border border-gray-700 rounded-lg overflow-hidden shadow-2xl"
                style={{ 
                  width: `${viewModeConfig.width}px`,
                  maxWidth: '100%',
                  height: 'calc(100% - 2rem)'
                }}
              >
                <SortableContext
                  items={widgets.map(w => w.id)}
                  strategy={rectSortingStrategy}
                >
                  <ProfileCanvas
                    ref={canvasRef}
                    widgets={widgets}
                    selectedWidget={selectedWidget}
                    onWidgetSelect={handleWidgetSelect}
                    onWidgetUpdate={handleWidgetUpdate}
                    onWidgetDelete={handleWidgetDelete}
                  />
                </SortableContext>
              </div>
            </div>
          </div>

          {/* Widget Settings Panel */}
          <div className={`${
            isSmallScreen
              ? `fixed inset-y-16 right-0 z-40 w-80 transform transition-transform duration-300 ${
                  selectedWidget && showSettingsPanel && isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`
              : selectedWidget && showSettingsPanel ? 'w-80' : 'w-0'
          } border-l border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden`}>
            {selectedWidget && showSettingsPanel && (
              <>
                <WidgetSettingsPanel
                  widget={selectedWidget}
                  onUpdate={(updates) => handleWidgetUpdate(selectedWidget.id, updates)}
                  onClose={() => {
                    setSelectedWidget(null)
                    setShowSettingsPanel(false)
                    if (isSmallScreen) setIsMobileMenuOpen(false)
                  }}
                />
                {/* Mobile overlay */}
                {isSmallScreen && isMobileMenuOpen && (
                  <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Enhanced Drag Overlay */}
        <DragOverlay>
          {draggedWidget && (
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500 rounded-lg p-4 backdrop-blur-sm shadow-2xl">
              <div className="text-pink-400 font-medium capitalize flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span>{draggedWidget.type.replace('-', ' ')}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">Drop on canvas to add</div>
            </div>
          )}
        </DragOverlay>

        {/* Quick Help */}
        <div className="fixed bottom-4 right-4 z-10">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-400 border border-gray-700">
            <div className="flex items-center space-x-4">
              <span>🎯 Drag to add</span>
              <span>⚙️ Click to configure</span>
              <span>📏 Drag corners to resize</span>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  )
}