# Middleman System Implementation Guide

## Overview
The Middleman system allows users to create their own curated stores by selecting products from the main catalog via ASINs and displaying them in a customizable template.

## User Flow

### 1. Welcome Page (`/middleman`)
- **Purpose**: Entry point for new middlemen sellers
- **Features**:
  - Authentication check (redirects to login if not authenticated)
  - Store creation form (name, slug, bio)
  - Auto-generates URL slug from store name
  - Checks for existing profile and redirects to dashboard if found

### 2. Template Selection (`/template`)
- **Purpose**: Choose a design template for the store
- **Features**:
  - Displays available templates with thumbnails
  - Shows premium badges for paid templates
  - Preview of template colors/features
  - Saves selection to database and local state
  - Redirects to dashboard after selection

### 3. Dashboard (`/dashboard`)
- **Purpose**: Manage store products and settings
- **Features**:
  - **Sidebar Navigation**: Products, Settings, View Store
  - **Add Products**: Enter ASIN to add products from main catalog
  - **Product List**: View all added products with images, titles, prices
  - **Remove Products**: Delete products from store
  - **Settings Tab**: Edit store name, bio, view store URL
  - **Change Template**: Link to re-select template

### 4. Public Storefront (`/[storeSlug]`)
- **Purpose**: Customer-facing store page
- **Features**:
  - Dynamic routing based on store slug
  - Displays store branding (logo, name, bio)
  - Shows curated product grid
  - Customizable colors based on template
  - Add to cart functionality
  - Links to main product detail pages

## Database Schema

### Tables Created (`supabase/migrations/004_middleman_system.sql`)

#### `middleman_profiles`
- `id`: UUID primary key
- `user_id`: Reference to auth.users
- `store_name`: Display name
- `store_slug`: Unique URL identifier
- `bio`: Store description
- `avatar_url`: Profile image
- `template_id`: Current template selection
- `is_active`: Store visibility flag

#### `templates`
- `id`: UUID primary key
- `name`: Template name
- `description`: Template description
- `thumbnail_url`: Preview image
- `config`: JSONB for theme settings
- `is_premium`: Premium flag

#### `store_products`
- `id`: UUID primary key
- `profile_id`: Reference to middleman_profiles
- `asin`: Product identifier from main catalog
- `custom_title`: Optional override
- `custom_price`: Optional price override
- `sort_order`: Display order

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/middleman.ts` | API functions for profiles, templates, products |
| `src/stores/middleman.ts` | Zustand store for client state |
| `src/app/middleman/page.tsx` | Store creation page |
| `src/app/template/page.tsx` | Template selection page |
| `src/app/dashboard/page.tsx` | Seller dashboard |
| `src/app/[storeSlug]/page.tsx` | Public storefront (SSR) |
| `src/app/[storeSlug]/Storefront.tsx` | Storefront UI component |

## How It Works

### Adding Products
1. Seller enters ASIN in dashboard
2. System creates record in `store_products` table
3. Storefront fetches products by joining `store_products` with `products` table
4. Products display with data from main catalog

### Store Access
1. Customer visits `localhost:3000/johns-store`
2. Next.js dynamic route captures `storeSlug`
3. Server fetches profile and products
4. Renders storefront with selected template config

### State Management
- **Zustand**: Stores current profile in localStorage
- **Persistence**: Survives page refreshes
- **Sync**: Database is source of truth, local state for UX

## Setup Instructions

### 1. Run Migration
```bash
# In Supabase SQL Editor or CLI
npx supabase db push
```

### 2. Seed Templates (Optional)
```sql
INSERT INTO templates (name, description, config) VALUES
  ('Minimal', 'Clean and simple design', '{"primaryColor": "#7C3AED", "layout": "grid"}'),
  ('Bold', 'Vibrant and eye-catching', '{"primaryColor": "#DC2626", "layout": "masonry"}'),
  ('Professional', 'Business-focused layout', '{"primaryColor": "#2563EB", "layout": "list"}');
```

### 3. Test Flow
1. Login/Register
2. Visit `/middleman`
3. Create store (e.g., "John's Tech", slug: "johns-tech")
4. Select template
5. Add products via ASIN (e.g., B08N5WRWNW)
6. Visit `/johns-tech` to see your store

## Security Notes

- RLS policies ensure users can only manage their own stores
- Public can only view active stores
- ASIN validation prevents invalid product links
- Slug uniqueness enforced at database level

## Future Enhancements

- [ ] Custom domain support
- [ ] Analytics dashboard
- [ ] Bulk ASIN import
- [ ] Template marketplace
- [ ] Revenue sharing tracking
- [ ] SEO optimization per store
- [ ] Social media integration
