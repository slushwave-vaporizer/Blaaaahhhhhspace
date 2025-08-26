// Room Visit Tracking Edge Function
// Handles room visit analytics and engagement tracking

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { action, roomId, visitData } = await req.json()

    // Get user from request (optional for visit tracking)
    let user = null
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user: authUser }, error: userError } = await supabase.auth.getUser(token)
        if (!userError && authUser) {
          user = authUser
        }
      } catch (e) {
        // Ignore auth errors for visit tracking - allow anonymous visits
      }
    }

    switch (action) {
      case 'start_visit': {
        if (!roomId) throw new Error('Room ID required')

        // Check if room exists and is accessible
        const { data: room, error: roomError } = await supabase
          .from('virtual_rooms')
          .select('is_public, user_id')
          .eq('id', roomId)
          .single()

        if (roomError || !room) throw new Error('Room not found')
        if (!room.is_public && (!user || room.user_id !== user.id)) {
          throw new Error('Not authorized to visit this room')
        }

        // Create visit record
        const { data, error } = await supabase
          .from('room_visits')
          .insert({
            room_id: roomId,
            visitor_id: user?.id || null,
            device_type: visitData?.device_type || 'desktop',
            browser_info: visitData?.browser_info || {},
            referrer: visitData?.referrer
          })
          .select()
          .single()

        if (error) throw error

        // Increment room visit count
        await supabase
          .from('virtual_rooms')
          .update({ 
            visit_count: supabase.raw('visit_count + 1')
          })
          .eq('id', roomId)

        return new Response(JSON.stringify({ 
          visit_id: data.id,
          room_id: roomId,
          started_at: data.created_at
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'end_visit': {
        const { visit_id, duration, interactions, actions } = visitData
        if (!visit_id) throw new Error('Visit ID required')

        // Update visit record with completion data
        const { data, error } = await supabase
          .from('room_visits')
          .update({
            visit_duration: duration,
            interaction_count: interactions || 0,
            actions: actions || []
          })
          .eq('id', visit_id)
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ 
          success: true,
          visit_summary: {
            duration: data.visit_duration,
            interactions: data.interaction_count,
            actions_count: (data.actions || []).length
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'add_interaction': {
        const { visit_id, interaction_type, interaction_data } = visitData
        if (!visit_id) throw new Error('Visit ID required')

        // Get current visit
        const { data: visit, error: visitError } = await supabase
          .from('room_visits')
          .select('actions, interaction_count')
          .eq('id', visit_id)
          .single()

        if (visitError || !visit) throw new Error('Visit not found')

        // Add new action
        const currentActions = visit.actions || []
        const newAction = {
          type: interaction_type,
          data: interaction_data,
          timestamp: new Date().toISOString()
        }

        const { data, error } = await supabase
          .from('room_visits')
          .update({
            actions: [...currentActions, newAction],
            interaction_count: (visit.interaction_count || 0) + 1
          })
          .eq('id', visit_id)
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ 
          success: true,
          interaction_count: data.interaction_count
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'get_analytics': {
        if (!roomId) throw new Error('Room ID required')
        if (!user) throw new Error('Authentication required for analytics')

        // Check if user owns the room
        const { data: room, error: roomError } = await supabase
          .from('virtual_rooms')
          .select('user_id')
          .eq('id', roomId)
          .single()

        if (roomError || !room) throw new Error('Room not found')
        if (room.user_id !== user.id) throw new Error('Not authorized to view analytics')

        const { timeframe = '30d' } = visitData || {}
        
        // Calculate date range
        const now = new Date()
        let fromDate = new Date()
        
        switch (timeframe) {
          case '24h':
            fromDate.setDate(now.getDate() - 1)
            break
          case '7d':
            fromDate.setDate(now.getDate() - 7)
            break
          case '30d':
            fromDate.setDate(now.getDate() - 30)
            break
          case '90d':
            fromDate.setDate(now.getDate() - 90)
            break
          default:
            fromDate.setDate(now.getDate() - 30)
        }

        // Get visit statistics
        const { data: visits, error: visitsError } = await supabase
          .from('room_visits')
          .select('*')
          .eq('room_id', roomId)
          .gte('created_at', fromDate.toISOString())
          .order('created_at', { ascending: false })

        if (visitsError) throw visitsError

        // Calculate analytics
        const totalVisits = visits.length
        const uniqueVisitors = new Set(visits.filter(v => v.visitor_id).map(v => v.visitor_id)).size
        const averageDuration = visits.reduce((sum, v) => sum + (v.visit_duration || 0), 0) / totalVisits || 0
        const totalInteractions = visits.reduce((sum, v) => sum + (v.interaction_count || 0), 0)
        
        // Device breakdown
        const deviceTypes = visits.reduce((acc, v) => {
          acc[v.device_type] = (acc[v.device_type] || 0) + 1
          return acc
        }, {})

        // Daily visits for chart
        const dailyVisits = visits.reduce((acc, visit) => {
          const date = visit.created_at.split('T')[0]
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {})

        return new Response(JSON.stringify({
          timeframe,
          summary: {
            total_visits: totalVisits,
            unique_visitors: uniqueVisitors,
            average_duration: Math.round(averageDuration),
            total_interactions: totalInteractions,
            bounce_rate: totalVisits > 0 ? (visits.filter(v => (v.visit_duration || 0) < 30).length / totalVisits * 100).toFixed(1) : 0
          },
          device_breakdown: deviceTypes,
          daily_visits: Object.entries(dailyVisits)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, count]) => ({ date, visits: count }))
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      default:
        throw new Error('Invalid action')
    }

  } catch (error) {
    console.error('Room visit tracking error:', error)
    
    const errorResponse = {
      error: {
        code: 'VISIT_TRACKING_ERROR',
        message: error.message
      }
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})