export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  try {
    if (productId) {
      // Get inventory for specific product
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', productId);

      if (error) throw error;

      // Calculate available stock for each size
      const inventoryWithAvailable = (data || []).map(item => ({
        ...item,
        available_quantity: item.stock_quantity - item.reserved_quantity
      }));

      return NextResponse.json({ inventory: inventoryWithAvailable });
    } else {
      // Get all inventory with low stock alert
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .filter('stock_quantity', 'lte', 'low_stock_threshold');

      if (error) throw error;

      return NextResponse.json({ lowStockItems: data });
    }
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const body = await request.json();
  const { action } = body;

  try {
    switch (action) {
      case 'update_stock': {
        const { productId, size, quantity, movementType, notes } = body;

        // Update inventory
        const { data: inventory, error: invError } = await supabase
          .from('inventory')
          .upsert({
            product_id: productId,
            size: size,
            stock_quantity: quantity,
          }, {
            onConflict: 'product_id,size'
          })
          .select()
          .single();

        if (invError) throw invError;

        // Record movement
        const { error: moveError } = await supabase
          .from('inventory_movements')
          .insert({
            inventory_id: inventory.id,
            movement_type: movementType || 'adjustment',
            quantity: quantity,
            reference_type: 'manual',
            notes: notes,
          });

        if (moveError) throw moveError;

        return NextResponse.json({ success: true, inventory });
      }

      case 'bulk_update': {
        const { updates } = body;

        // Process each update
        const results = [];
        for (const update of updates) {
          const { data, error } = await supabase
            .from('inventory')
            .upsert({
              product_id: update.productId,
              size: update.size,
              stock_quantity: update.quantity,
              low_stock_threshold: update.lowStockThreshold || 5,
            }, {
              onConflict: 'product_id,size'
            })
            .select();

          if (error) {

            results.push({ productId: update.productId, size: update.size, error });
          } else {
            results.push({ productId: update.productId, size: update.size, success: true });
          }
        }

        return NextResponse.json({ results });
      }

      case 'cleanup_reservations': {
        const { error } = await supabase.rpc('cleanup_expired_reservations');
        if (error) throw error;

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    );
  }
}