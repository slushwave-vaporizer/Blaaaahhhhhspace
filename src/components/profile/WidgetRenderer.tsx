import React from 'react'
import { WidgetConfig, WidgetType } from '../../hooks/useProfileBuilder'
import { PortfolioGalleryWidget } from './widgets/PortfolioGalleryWidget'
import { AboutSectionWidget } from './widgets/AboutSectionWidget'
import { SocialLinksWidget } from './widgets/SocialLinksWidget'
import { ShopWidget } from './widgets/ShopWidget'
import { CollaborationBoardWidget } from './widgets/CollaborationBoardWidget'
import { LearningProgressWidget } from './widgets/LearningProgressWidget'
import { AudioPlayerWidget } from './widgets/AudioPlayerWidget'
import { VideoShowcaseWidget } from './widgets/VideoShowcaseWidget'
import { BlogUpdatesWidget } from './widgets/BlogUpdatesWidget'
import { ContactWidget } from './widgets/ContactWidget'
import { StatisticsWidget } from './widgets/StatisticsWidget'
import { FeaturedContentWidget } from './widgets/FeaturedContentWidget'

interface WidgetRendererProps {
  widget: WidgetConfig
  className?: string
}

const WIDGET_COMPONENTS: Record<WidgetType, React.ComponentType<{ widget: WidgetConfig }>> = {
  'portfolio-gallery': PortfolioGalleryWidget,
  'about-section': AboutSectionWidget,
  'social-links': SocialLinksWidget,
  'shop': ShopWidget,
  'collaboration-board': CollaborationBoardWidget,
  'learning-progress': LearningProgressWidget,
  'audio-player': AudioPlayerWidget,
  'video-showcase': VideoShowcaseWidget,
  'blog-updates': BlogUpdatesWidget,
  'contact': ContactWidget,
  'statistics': StatisticsWidget,
  'featured-content': FeaturedContentWidget
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget, className = '' }) => {
  const WidgetComponent = WIDGET_COMPONENTS[widget.type]
  
  if (!WidgetComponent) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-800 border border-gray-700 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <div className="text-gray-400 mb-2">Unknown Widget</div>
          <div className="text-sm text-gray-500 capitalize">{widget.type.replace('-', ' ')}</div>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`w-full h-full ${className}`}>
      <WidgetComponent widget={widget} />
    </div>
  )
}