import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '../lib/supabase'

export interface WidgetConfig {
  id: string
  type: WidgetType
  position: { x: number; y: number }
  size: { width: number; height: number }
  data: Record<string, any>
  isVisible: boolean
  zIndex: number
}

export type WidgetType = 
  | 'portfolio-gallery'
  | 'about-section'
  | 'social-links'
  | 'shop'
  | 'collaboration-board'
  | 'learning-progress'
  | 'audio-player'
  | 'video-showcase'
  | 'blog-updates'
  | 'contact'
  | 'statistics'
  | 'featured-content'

export interface ProfileLayout {
  id: string
  name: string
  isActive: boolean
  widgets: WidgetConfig[]
  createdAt: string
  updatedAt: string
}

interface UseProfileBuilderReturn {
  layouts: ProfileLayout[]
  activeLayout: ProfileLayout | null
  widgets: WidgetConfig[]
  isLoading: boolean
  error: string | null
  createLayout: (name: string) => Promise<void>
  activateLayout: (layoutId: string) => Promise<void>
  deleteLayout: (layoutId: string) => Promise<void>
  addWidget: (type: WidgetType, position?: { x: number; y: number }) => Promise<void>
  updateWidget: (widgetId: string, updates: Partial<WidgetConfig>) => Promise<void>
  removeWidget: (widgetId: string) => Promise<void>
  saveLayout: () => Promise<void>
  resetToTemplate: (templateId?: string) => Promise<void>
  exportLayout: () => string
  importLayout: (layoutData: string) => Promise<void>
  batchUpdateWidgets: (widgets: WidgetConfig[]) => Promise<void>
  getLayoutTemplates: () => Promise<any[]>
}

export const useProfileBuilder = (): UseProfileBuilderReturn => {
  const { user } = useAuth()
  const [layouts, setLayouts] = useState<ProfileLayout[]>([])
  const [activeLayout, setActiveLayout] = useState<ProfileLayout | null>(null)
  const [widgets, setWidgets] = useState<WidgetConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load user layouts on mount
  useEffect(() => {
    if (user) {
      loadUserLayouts()
    }
  }, [user])

  // Update widgets when active layout changes
  useEffect(() => {
    if (activeLayout) {
      setWidgets(activeLayout.widgets)
    } else {
      setWidgets([])
    }
  }, [activeLayout])

  const loadUserLayouts = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data: layoutsData, error: layoutsError } = await supabase
        .from('profile_widget_layouts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (layoutsError) throw layoutsError

      // Load widget configurations for each layout
      const layoutsWithWidgets = await Promise.all(
        (layoutsData || []).map(async (layout) => {
          const { data: widgetsData, error: widgetsError } = await supabase
            .from('profile_widget_configs')
            .select('*')
            .eq('layout_id', layout.id)
            .order('z_index', { ascending: true })

          if (widgetsError) {
            console.warn('Failed to load widgets for layout:', layout.id, widgetsError)
          }

          const widgets: WidgetConfig[] = (widgetsData || []).map(widget => ({
            id: widget.widget_id,
            type: widget.widget_type as WidgetType,
            position: { x: widget.position_x, y: widget.position_y },
            size: { width: widget.width, height: widget.height },
            data: widget.config_data || {},
            isVisible: widget.is_visible,
            zIndex: widget.z_index
          }))

          return {
            id: layout.id,
            name: layout.layout_name,
            isActive: layout.is_active,
            widgets,
            createdAt: layout.created_at,
            updatedAt: layout.updated_at
          } as ProfileLayout
        })
      )

      setLayouts(layoutsWithWidgets)
      
      // Set active layout
      const activeLayoutData = layoutsWithWidgets.find(l => l.isActive)
      if (activeLayoutData) {
        setActiveLayout(activeLayoutData)
      } else if (layoutsWithWidgets.length > 0) {
        // If no active layout, make the first one active
        await activateLayout(layoutsWithWidgets[0].id)
      } else {
        // Create default layout if none exists
        await createLayout('My Profile')
      }
    } catch (err) {
      console.error('Failed to load layouts:', err)
      setError(err instanceof Error ? err.message : 'Failed to load layouts')
    } finally {
      setIsLoading(false)
    }
  }

  const createLayout = async (name: string) => {
    if (!user) return

    try {
      setError(null)

      // Deactivate all existing layouts first
      await supabase
        .from('profile_widget_layouts')
        .update({ is_active: false })
        .eq('user_id', user.id)

      // Create new layout
      const { data: newLayout, error } = await supabase
        .from('profile_widget_layouts')
        .insert({
          user_id: user.id,
          layout_name: name,
          is_active: true,
          layout_data: []
        })
        .select()
        .maybeSingle()

      if (error) throw error
      if (!newLayout) throw new Error('Failed to create layout')

      const layout: ProfileLayout = {
        id: newLayout.id,
        name: newLayout.layout_name,
        isActive: true,
        widgets: [],
        createdAt: newLayout.created_at,
        updatedAt: newLayout.updated_at
      }

      setLayouts(prev => [layout, ...prev.map(l => ({ ...l, isActive: false }))])
      setActiveLayout(layout)
      setWidgets([])
    } catch (err) {
      console.error('Failed to create layout:', err)
      setError(err instanceof Error ? err.message : 'Failed to create layout')
    }
  }

  const activateLayout = async (layoutId: string) => {
    if (!user) return

    try {
      setError(null)

      // Deactivate all layouts
      await supabase
        .from('profile_widget_layouts')
        .update({ is_active: false })
        .eq('user_id', user.id)

      // Activate selected layout
      const { error } = await supabase
        .from('profile_widget_layouts')
        .update({ is_active: true })
        .eq('id', layoutId)
        .eq('user_id', user.id)

      if (error) throw error

      // Update local state
      setLayouts(prev => 
        prev.map(layout => ({
          ...layout,
          isActive: layout.id === layoutId
        }))
      )

      const newActiveLayout = layouts.find(l => l.id === layoutId)
      if (newActiveLayout) {
        setActiveLayout({ ...newActiveLayout, isActive: true })
      }
    } catch (err) {
      console.error('Failed to activate layout:', err)
      setError(err instanceof Error ? err.message : 'Failed to activate layout')
    }
  }

  const deleteLayout = async (layoutId: string) => {
    if (!user || !activeLayout) return

    try {
      setError(null)

      // Delete layout (widgets will be cascade deleted)
      const { error } = await supabase
        .from('profile_widget_layouts')
        .delete()
        .eq('id', layoutId)
        .eq('user_id', user.id)

      if (error) throw error

      // Update local state
      const remainingLayouts = layouts.filter(l => l.id !== layoutId)
      setLayouts(remainingLayouts)

      // If we deleted the active layout, activate another one
      if (activeLayout.id === layoutId) {
        if (remainingLayouts.length > 0) {
          await activateLayout(remainingLayouts[0].id)
        } else {
          setActiveLayout(null)
          setWidgets([])
        }
      }
    } catch (err) {
      console.error('Failed to delete layout:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete layout')
    }
  }

  const addWidget = async (type: WidgetType, position = { x: 0, y: 0 }) => {
    if (!user || !activeLayout) return

    try {
      setError(null)

      const widgetId = `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const defaultSize = getDefaultWidgetSize(type)
      
      const newWidget: WidgetConfig = {
        id: widgetId,
        type,
        position,
        size: defaultSize,
        data: {},
        isVisible: true,
        zIndex: Math.max(...widgets.map(w => w.zIndex), 0) + 1
      }

      // Save to database
      const { error } = await supabase
        .from('profile_widget_configs')
        .insert({
          layout_id: activeLayout.id,
          widget_type: type,
          widget_id: widgetId,
          position_x: position.x,
          position_y: position.y,
          width: defaultSize.width,
          height: defaultSize.height,
          z_index: newWidget.zIndex,
          config_data: {},
          is_visible: true
        })

      if (error) throw error

      // Update local state
      const updatedWidgets = [...widgets, newWidget]
      setWidgets(updatedWidgets)
      setActiveLayout(prev => prev ? { ...prev, widgets: updatedWidgets } : null)
    } catch (err) {
      console.error('Failed to add widget:', err)
      setError(err instanceof Error ? err.message : 'Failed to add widget')
    }
  }

  const updateWidget = async (widgetId: string, updates: Partial<WidgetConfig>) => {
    if (!user || !activeLayout) return

    try {
      setError(null)

      // Prepare database updates
      const dbUpdates: any = {}
      if (updates.position) {
        dbUpdates.position_x = updates.position.x
        dbUpdates.position_y = updates.position.y
      }
      if (updates.size) {
        dbUpdates.width = updates.size.width
        dbUpdates.height = updates.size.height
      }
      if (updates.data !== undefined) {
        dbUpdates.config_data = updates.data
      }
      if (updates.isVisible !== undefined) {
        dbUpdates.is_visible = updates.isVisible
      }
      if (updates.zIndex !== undefined) {
        dbUpdates.z_index = updates.zIndex
      }

      // Update database
      const { error } = await supabase
        .from('profile_widget_configs')
        .update(dbUpdates)
        .eq('layout_id', activeLayout.id)
        .eq('widget_id', widgetId)

      if (error) throw error

      // Update local state
      const updatedWidgets = widgets.map(widget => 
        widget.id === widgetId ? { ...widget, ...updates } : widget
      )
      setWidgets(updatedWidgets)
      setActiveLayout(prev => prev ? { ...prev, widgets: updatedWidgets } : null)
    } catch (err) {
      console.error('Failed to update widget:', err)
      setError(err instanceof Error ? err.message : 'Failed to update widget')
    }
  }

  const removeWidget = async (widgetId: string) => {
    if (!user || !activeLayout) return

    try {
      setError(null)

      // Delete from database
      const { error } = await supabase
        .from('profile_widget_configs')
        .delete()
        .eq('layout_id', activeLayout.id)
        .eq('widget_id', widgetId)

      if (error) throw error

      // Update local state
      const updatedWidgets = widgets.filter(w => w.id !== widgetId)
      setWidgets(updatedWidgets)
      setActiveLayout(prev => prev ? { ...prev, widgets: updatedWidgets } : null)
    } catch (err) {
      console.error('Failed to remove widget:', err)
      setError(err instanceof Error ? err.message : 'Failed to remove widget')
    }
  }

  const saveLayout = async () => {
    if (!user || !activeLayout) return

    try {
      setError(null)

      // Update layout timestamp
      const { error } = await supabase
        .from('profile_widget_layouts')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', activeLayout.id)
        .eq('user_id', user.id)

      if (error) throw error

      // Update local state
      setActiveLayout(prev => prev ? {
        ...prev,
        updatedAt: new Date().toISOString()
      } : null)
    } catch (err) {
      console.error('Failed to save layout:', err)
      setError(err instanceof Error ? err.message : 'Failed to save layout')
    }
  }

  const resetToTemplate = async (templateId?: string) => {
    if (!user || !activeLayout) return

    try {
      setError(null)

      // For now, just clear all widgets (template system can be extended)
      const { error } = await supabase
        .from('profile_widget_configs')
        .delete()
        .eq('layout_id', activeLayout.id)

      if (error) throw error

      setWidgets([])
      setActiveLayout(prev => prev ? { ...prev, widgets: [] } : null)
    } catch (err) {
      console.error('Failed to reset layout:', err)
      setError(err instanceof Error ? err.message : 'Failed to reset layout')
    }
  }

  const exportLayout = () => {
    if (!activeLayout) return ''
    return JSON.stringify({
      name: activeLayout.name,
      widgets: activeLayout.widgets
    }, null, 2)
  }

  const importLayout = async (layoutData: string) => {
    try {
      const parsed = JSON.parse(layoutData)
      if (!parsed.widgets || !Array.isArray(parsed.widgets)) {
        throw new Error('Invalid layout data')
      }

      // Clear current widgets
      await resetToTemplate()

      // Add imported widgets
      for (const widget of parsed.widgets) {
        await addWidget(widget.type, widget.position)
        // Update with imported data
        await updateWidget(widgets[widgets.length - 1]?.id, {
          size: widget.size,
          data: widget.data,
          isVisible: widget.isVisible,
          zIndex: widget.zIndex
        })
      }
    } catch (err) {
      console.error('Failed to import layout:', err)
      setError(err instanceof Error ? err.message : 'Failed to import layout')
    }
  }

  // Enhanced batch widget updates using edge function
  const batchUpdateWidgets = useCallback(async (newWidgets: WidgetConfig[]) => {
    if (!user || !activeLayout) return

    try {
      setError(null)

      const { data, error } = await supabase.functions.invoke('profile-widgets-crud', {
        body: {
          method: 'BATCH_UPDATE_WIDGETS',
          data: {
            layoutId: activeLayout.id,
            widgets: newWidgets
          }
        }
      })

      if (error) throw error

      // Update local state
      setWidgets(newWidgets)
      setActiveLayout(prev => prev ? { ...prev, widgets: newWidgets } : null)
    } catch (err) {
      console.error('Failed to batch update widgets:', err)
      setError(err instanceof Error ? err.message : 'Failed to save widget changes')
    }
  }, [user, activeLayout])

  // Get layout templates using edge function
  const getLayoutTemplates = useCallback(async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('profile-widgets-crud', {
        body: {
          method: 'GET_LAYOUT_TEMPLATES',
          data: {}
        }
      })

      if (error) throw error
      return data?.data || []
    } catch (err) {
      console.error('Failed to get templates:', err)
      return []
    }
  }, [])

  return {
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
    saveLayout,
    resetToTemplate,
    exportLayout,
    importLayout,
    batchUpdateWidgets,
    getLayoutTemplates
  }
}

// Helper function to get default widget sizes
function getDefaultWidgetSize(type: WidgetType): { width: number; height: number } {
  const sizeMap: Record<WidgetType, { width: number; height: number }> = {
    'portfolio-gallery': { width: 8, height: 6 },
    'about-section': { width: 6, height: 4 },
    'social-links': { width: 4, height: 2 },
    'shop': { width: 6, height: 8 },
    'collaboration-board': { width: 8, height: 5 },
    'learning-progress': { width: 6, height: 4 },
    'audio-player': { width: 6, height: 3 },
    'video-showcase': { width: 8, height: 6 },
    'blog-updates': { width: 6, height: 6 },
    'contact': { width: 4, height: 5 },
    'statistics': { width: 4, height: 3 },
    'featured-content': { width: 6, height: 5 }
  }
  
  return sizeMap[type] || { width: 4, height: 3 }
}