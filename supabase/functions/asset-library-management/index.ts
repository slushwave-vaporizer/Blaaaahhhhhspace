// Asset Library Management Edge Function
// Handles 3D asset uploads, management, and discovery

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
    
    // Get user from request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header required')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Invalid authorization token')
    }

    const { action, assetData, assetId, searchQuery } = await req.json()

    switch (action) {
      case 'create': {
        const { data, error } = await supabase
          .from('asset_library')
          .insert({
            user_id: user.id,
            name: assetData.name,
            description: assetData.description || '',
            category: assetData.category,
            subcategory: assetData.subcategory,
            file_url: assetData.file_url,
            thumbnail_url: assetData.thumbnail_url,
            file_type: assetData.file_type || 'gltf',
            file_size: assetData.file_size,
            dimensions: assetData.dimensions || {},
            materials: assetData.materials || [],
            tags: assetData.tags || [],
            is_public: assetData.is_public || false,
            is_free: assetData.is_free !== false, // Default to free
            price: assetData.price || 0,
            license_type: assetData.license_type || 'cc0',
            license_details: assetData.license_details
          })
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'search': {
        const { 
          query = '', 
          category, 
          subcategory, 
          is_free, 
          max_price, 
          tags = [], 
          page = 1, 
          limit = 20 
        } = searchQuery || {}
        
        let searchQuery = supabase
          .from('asset_library')
          .select('*', { count: 'exact' })
          .eq('is_public', true)

        // Text search
        if (query) {
          searchQuery = searchQuery.textSearch('name,description', query)
        }

        // Category filters
        if (category) {
          searchQuery = searchQuery.eq('category', category)
        }
        
        if (subcategory) {
          searchQuery = searchQuery.eq('subcategory', subcategory)
        }

        // Price filters
        if (is_free !== undefined) {
          searchQuery = searchQuery.eq('is_free', is_free)
        }
        
        if (max_price !== undefined) {
          searchQuery = searchQuery.lte('price', max_price)
        }

        // Tag filters
        if (tags.length > 0) {
          searchQuery = searchQuery.overlaps('tags', tags)
        }

        searchQuery = searchQuery
          .order('download_count', { ascending: false })
          .order('created_at', { ascending: false })
          .range((page - 1) * limit, page * limit - 1)

        const { data, error, count } = await searchQuery

        if (error) throw error

        return new Response(JSON.stringify({
          data,
          count,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'get': {
        if (!assetId) throw new Error('Asset ID required')

        const { data, error } = await supabase
          .from('asset_library')
          .select(`
            *,
            profiles:user_id (
              username,
              display_name,
              avatar_url
            )
          `)
          .eq('id', assetId)
          .single()

        if (error) throw error

        // Check access permissions
        if (!data.is_public && data.user_id !== user.id) {
          throw new Error('Not authorized to access this asset')
        }

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'update': {
        if (!assetId) throw new Error('Asset ID required')

        // Check ownership
        const { data: asset, error: assetError } = await supabase
          .from('asset_library')
          .select('user_id')
          .eq('id', assetId)
          .single()

        if (assetError || !asset) throw new Error('Asset not found')
        if (asset.user_id !== user.id) throw new Error('Not authorized to update this asset')

        const { data, error } = await supabase
          .from('asset_library')
          .update(assetData)
          .eq('id', assetId)
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'delete': {
        if (!assetId) throw new Error('Asset ID required')

        // Check ownership
        const { data: asset, error: assetError } = await supabase
          .from('asset_library')
          .select('user_id, file_url, thumbnail_url')
          .eq('id', assetId)
          .single()

        if (assetError || !asset) throw new Error('Asset not found')
        if (asset.user_id !== user.id) throw new Error('Not authorized to delete this asset')

        // Delete the asset record
        const { error } = await supabase
          .from('asset_library')
          .delete()
          .eq('id', assetId)

        if (error) throw error

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'download': {
        if (!assetId) throw new Error('Asset ID required')

        // Check if asset exists and is accessible
        const { data: asset, error: assetError } = await supabase
          .from('asset_library')
          .select('*')
          .eq('id', assetId)
          .single()

        if (assetError || !asset) throw new Error('Asset not found')
        if (!asset.is_public && asset.user_id !== user.id) {
          throw new Error('Not authorized to download this asset')
        }

        // Increment download count
        await supabase
          .from('asset_library')
          .update({ download_count: asset.download_count + 1 })
          .eq('id', assetId)

        return new Response(JSON.stringify({ 
          download_url: asset.file_url,
          name: asset.name,
          file_type: asset.file_type
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      default:
        throw new Error('Invalid action')
    }

  } catch (error) {
    console.error('Asset management error:', error)
    
    const errorResponse = {
      error: {
        code: 'ASSET_MANAGEMENT_ERROR',
        message: error.message
      }
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})