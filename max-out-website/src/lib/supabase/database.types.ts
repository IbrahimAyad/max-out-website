export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          email: string
          stripe_customer_id: string | null
          name: string | null
          first_name: string | null
          last_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          stripe_customer_id?: string | null
          name?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          stripe_customer_id?: string | null
          name?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string | null
          customer_email: string
          customer_name: string | null
          stripe_session_id: string
          stripe_payment_intent_id: string | null
          status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'failed'
          amount_subtotal: number
          amount_total: number
          discount: number
          tax: number
          shipping: number
          currency: string
          shipping_address: Json
          billing_address: Json | null
          metadata: Json | null
          bundle_info: Json | null
          tracking_number: string | null
          carrier: string | null
          shipped_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          customer_id?: string | null
          customer_email: string
          customer_name?: string | null
          stripe_session_id: string
          stripe_payment_intent_id?: string | null
          status?: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'failed'
          amount_subtotal: number
          amount_total: number
          discount?: number
          tax?: number
          shipping?: number
          currency?: string
          shipping_address: Json
          billing_address?: Json | null
          metadata?: Json | null
          bundle_info?: Json | null
          tracking_number?: string | null
          carrier?: string | null
          shipped_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string | null
          customer_email?: string
          customer_name?: string | null
          stripe_session_id?: string
          stripe_payment_intent_id?: string | null
          status?: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'failed'
          amount_subtotal?: number
          amount_total?: number
          discount?: number
          tax?: number
          shipping?: number
          currency?: string
          shipping_address?: Json
          billing_address?: Json | null
          metadata?: Json | null
          bundle_info?: Json | null
          tracking_number?: string | null
          carrier?: string | null
          shipped_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          type: 'suit' | 'shirt' | 'tie' | 'tuxedo' | 'tie_bundle' | 'bundle'
          product_id: string
          stripe_product_id: string | null
          stripe_price_id: string | null
          product_name: string
          product_image: string | null
          sku: string | null
          quantity: number
          unit_price: number
          total_price: number
          attributes: Json | null
          bundle_contents: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          type: 'suit' | 'shirt' | 'tie' | 'tuxedo' | 'tie_bundle' | 'bundle'
          product_id: string
          stripe_product_id?: string | null
          stripe_price_id?: string | null
          product_name: string
          product_image?: string | null
          sku?: string | null
          quantity: number
          unit_price: number
          total_price: number
          attributes?: Json | null
          bundle_contents?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          type?: 'suit' | 'shirt' | 'tie' | 'tuxedo' | 'tie_bundle' | 'bundle'
          product_id?: string
          stripe_product_id?: string | null
          stripe_price_id?: string | null
          product_name?: string
          product_image?: string | null
          sku?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          attributes?: Json | null
          bundle_contents?: Json | null
          created_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          type: 'shipping' | 'billing'
          is_default: boolean
          line1: string
          line2: string | null
          city: string
          state: string
          postal_code: string
          country: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type?: 'shipping' | 'billing'
          is_default?: boolean
          line1: string
          line2?: string | null
          city: string
          state: string
          postal_code: string
          country: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'shipping' | 'billing'
          is_default?: boolean
          line1?: string
          line2?: string | null
          city?: string
          state?: string
          postal_code?: string
          country?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          sku: string | null
          handle: string | null
          base_price: number
          vendor: string
          product_type: string
          status: string
          visibility: boolean
          featured: boolean
          requires_shipping: boolean
          taxable: boolean
          track_inventory: boolean
          weight: number | null
          meta_title: string | null
          meta_description: string | null
          seo_title: string | null
          seo_description: string | null
          tags: string[] | null
          additional_info: Json | null
          view_count: number
          total_inventory: number | null
          in_stock: boolean | null
          stripe_price_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string | null
          sku?: string | null
          handle?: string | null
          base_price: number
          vendor?: string
          product_type?: string
          status?: string
          visibility?: boolean
          featured?: boolean
          requires_shipping?: boolean
          taxable?: boolean
          track_inventory?: boolean
          weight?: number | null
          meta_title?: string | null
          meta_description?: string | null
          seo_title?: string | null
          seo_description?: string | null
          tags?: string[] | null
          additional_info?: Json | null
          view_count?: number
          total_inventory?: number | null
          in_stock?: boolean | null
          stripe_price_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string | null
          sku?: string | null
          handle?: string | null
          base_price?: number
          vendor?: string
          product_type?: string
          status?: string
          visibility?: boolean
          featured?: boolean
          requires_shipping?: boolean
          taxable?: boolean
          track_inventory?: boolean
          weight?: number | null
          meta_title?: string | null
          meta_description?: string | null
          seo_title?: string | null
          seo_description?: string | null
          tags?: string[] | null
          additional_info?: Json | null
          view_count?: number
          total_inventory?: number | null
          in_stock?: boolean | null
          stripe_price_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          title: string
          price: number
          compare_at_price: number | null
          cost_price: number | null
          sku: string | null
          barcode: string | null
          inventory_quantity: number
          allow_backorders: boolean
          weight: number | null
          option1: string | null
          option2: string | null
          option3: string | null
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          title: string
          price: number
          compare_at_price?: number | null
          cost_price?: number | null
          sku?: string | null
          barcode?: string | null
          inventory_quantity?: number
          allow_backorders?: boolean
          weight?: number | null
          option1?: string | null
          option2?: string | null
          option3?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          title?: string
          price?: number
          compare_at_price?: number | null
          cost_price?: number | null
          sku?: string | null
          barcode?: string | null
          inventory_quantity?: number
          allow_backorders?: boolean
          weight?: number | null
          option1?: string | null
          option2?: string | null
          option3?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          alt_text: string | null
          position: number
          image_type: string | null
          width: number | null
          height: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          alt_text?: string | null
          position?: number
          image_type?: string | null
          width?: number | null
          height?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          alt_text?: string | null
          position?: number
          image_type?: string | null
          width?: number | null
          height?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          name: string
          description: string | null
          handle: string | null
          image_url: string | null
          seo_title: string | null
          seo_description: string | null
          sort_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          handle?: string | null
          image_url?: string | null
          seo_title?: string | null
          seo_description?: string | null
          sort_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          handle?: string | null
          image_url?: string | null
          seo_title?: string | null
          seo_description?: string | null
          sort_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_collections: {
        Row: {
          id: string
          product_id: string
          collection_id: string
          position: number | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          collection_id: string
          position?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          collection_id?: string
          position?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}