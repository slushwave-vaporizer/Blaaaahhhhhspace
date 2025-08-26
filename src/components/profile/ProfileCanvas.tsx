import React, { forwardRef } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { WidgetConfig } from '../../hooks/useProfileBuilder'
import { SortableWidgetWrapper } from './SortableWidgetWrapper'
import { WidgetRenderer } from './WidgetRenderer'

interface ProfileCanvasProps {
  widgets: WidgetConfig[]
  selectedWidget: WidgetConfig | null
  onWidgetSelect: (widget: WidgetConfig) => void
  onWidgetUpdate: (widgetId: string, updates: Partial<WidgetConfig>) => void
  onWidgetDelete: (widgetId: string) => void
  className?: string
}

export const ProfileCanvas = forwardRef<HTMLDivElement, ProfileCanvasProps>(
  ({ widgets, selectedWidget, onWidgetSelect, onWidgetUpdate, onWidgetDelete, className = '' }, ref) => {
    const {
      isOver,
      setNodeRef: setDroppableRef
    } = useDroppable({
      id: 'profile-canvas'
    })

    // Grid configuration
    const GRID_SIZE = 20
    const CANVAS_WIDTH = 1200
    const CANVAS_HEIGHT = 2000
    const COLS = Math.floor(CANVAS_WIDTH / GRID_SIZE)
    const ROWS = Math.floor(CANVAS_HEIGHT / GRID_SIZE)

    // Create combined ref function
    const combinedRef = (node: HTMLDivElement | null) => {
      setDroppableRef(node)
      if (ref) {
        if (typeof ref === 'function') {
          ref(node)
        } else {
          ref.current = node
        }
      }
    }

    return (
      <div className={`relative h-full overflow-auto bg-gray-950 ${className}`}>
        {/* Canvas Container */}
        <div
          ref={combinedRef}
          className={`relative mx-auto bg-gray-900 border-2 transition-all duration-200 ${
            isOver
              ? 'border-pink-500 bg-pink-500/5 shadow-pink-500/20 shadow-2xl'
              : 'border-gray-800'
          }`}
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            minHeight: '100vh'
          }}
        >
          {/* Grid Background */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
            style={{ zIndex: 0 }}
          >
            <defs>
              <pattern
                id="grid"
                width={GRID_SIZE}
                height={GRID_SIZE}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
                  fill="none"
                  stroke="#374151"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Drop Zone Indicator */}
          {isOver && (
            <div className="absolute inset-4 border-2 border-dashed border-pink-400 bg-pink-500/10 rounded-lg flex items-center justify-center z-10">
              <div className="text-pink-400 text-lg font-medium">
                Drop widget here
              </div>
            </div>
          )}

          {/* Widgets */}
          {widgets.map((widget) => (
            <SortableWidgetWrapper
              key={widget.id}
              widget={widget}
              isSelected={selectedWidget?.id === widget.id}
              gridSize={GRID_SIZE}
              onSelect={() => onWidgetSelect(widget)}
              onUpdate={(updates) => onWidgetUpdate(widget.id, updates)}
              onDelete={() => onWidgetDelete(widget.id)}
            >
              <WidgetRenderer widget={widget} />
            </SortableWidgetWrapper>
          ))}

          {/* Empty State */}
          {widgets.length === 0 && !isOver && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-400 mb-2">Start Building Your Profile</h3>
                <p className="text-gray-500 mb-4 max-w-md">
                  Drag widgets from the library to create your personalized profile layout.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span>Drag to add</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Click to configure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Resize to fit</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Canvas Info */}
          <div className="absolute bottom-4 right-4 bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-400 border border-gray-700">
            {CANVAS_WIDTH} × {CANVAS_HEIGHT} • {widgets.length} widgets
          </div>
        </div>
      </div>
    )
  }
)