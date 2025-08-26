import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { WidgetConfig } from '../../hooks/useProfileBuilder'
import {
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

interface SortableWidgetWrapperProps {
  widget: WidgetConfig
  isSelected: boolean
  gridSize: number
  onSelect: () => void
  onUpdate: (updates: Partial<WidgetConfig>) => void
  onDelete: () => void
  children: React.ReactNode
}

export const SortableWidgetWrapper: React.FC<SortableWidgetWrapperProps> = ({
  widget,
  isSelected,
  gridSize,
  onSelect,
  onUpdate,
  onDelete,
  children
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: widget.id,
    data: { widget }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation()
    setIsResizing(true)
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = widget.size.width
    const startHeight = widget.size.height
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = Math.floor((e.clientX - startX) / gridSize)
      const deltaY = Math.floor((e.clientY - startY) / gridSize)
      
      let newWidth = startWidth
      let newHeight = startHeight
      
      if (direction.includes('right')) {
        newWidth = Math.max(1, startWidth + deltaX)
      }
      if (direction.includes('left')) {
        newWidth = Math.max(1, startWidth - deltaX)
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(1, startHeight + deltaY)
      }
      if (direction.includes('top')) {
        newHeight = Math.max(1, startHeight - deltaY)
      }
      
      onUpdate({
        size: { width: newWidth, height: newHeight }
      })
    }
    
    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'absolute',
        left: widget.position.x * gridSize,
        top: widget.position.y * gridSize,
        width: widget.size.width * gridSize,
        height: widget.size.height * gridSize,
        zIndex: widget.zIndex + (isDragging ? 1000 : 0),
        opacity: widget.isVisible ? (isDragging ? 0.8 : 1) : 0.5
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      className={`group cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-pink-500 ring-offset-2 ring-offset-gray-900' 
          : isHovered 
          ? 'ring-1 ring-gray-500' 
          : ''
      }`}
    >
      {/* Widget Content */}
      <div className="w-full h-full relative overflow-hidden bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
        {children}
        
        {/* Overlay for non-visible widgets */}
        {!widget.isVisible && (
          <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-10">
            <div className="text-gray-400 text-sm font-medium flex items-center space-x-2">
              <EyeSlashIcon className="w-4 h-4" />
              <span>Hidden</span>
            </div>
          </div>
        )}
      </div>

      {/* Drag Handle */}
      <div
        {...listeners}
        {...attributes}
        className={`absolute -top-8 left-0 right-0 h-6 bg-gray-800/90 backdrop-blur-sm rounded-t-lg border border-gray-700 border-b-0 flex items-center justify-between px-2 cursor-grab active:cursor-grabbing transition-all duration-200 ${
          isSelected || isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
        </div>
        
        <div className="text-xs text-gray-400 font-medium capitalize">
          {widget.type.replace('-', ' ')}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUpdate({ isVisible: !widget.isVisible })
            }}
            className="p-1 text-gray-400 hover:text-pink-400 transition-colors"
            title={widget.isVisible ? 'Hide widget' : 'Show widget'}
          >
            {widget.isVisible ? <EyeIcon className="w-3 h-3" /> : <EyeSlashIcon className="w-3 h-3" />}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
            title="Delete widget"
          >
            <TrashIcon className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Resize Handles */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-pink-500 border border-pink-400 rounded cursor-nw-resize hover:bg-pink-400 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 border border-pink-400 rounded cursor-ne-resize hover:bg-pink-400 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'top-right')}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-500 border border-pink-400 rounded cursor-sw-resize hover:bg-pink-400 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
          />
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-pink-500 border border-pink-400 rounded cursor-se-resize hover:bg-pink-400 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'top-left')}
          />
          
          {/* Edge handles */}
          <div
            className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-pink-500 border border-pink-400 rounded cursor-ew-resize hover:bg-pink-400 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'right')}
          />
          <div
            className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-pink-500 border border-pink-400 rounded cursor-ew-resize hover:bg-pink-400 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'left')}
          />
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-pink-500 border border-pink-400 rounded cursor-ns-resize hover:bg-pink-400 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'bottom')}
          />
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-pink-500 border border-pink-400 rounded cursor-ns-resize hover:bg-pink-400 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'top')}
          />
        </>
      )}

      {/* Widget Info Tooltip */}
      {isHovered && !isSelected && (
        <div className="absolute -bottom-8 left-0 bg-gray-800/90 backdrop-blur-sm text-xs text-gray-300 px-2 py-1 rounded border border-gray-700 whitespace-nowrap z-50">
          {widget.size.width} × {widget.size.height} • Click to configure
        </div>
      )}
    </div>
  )
}