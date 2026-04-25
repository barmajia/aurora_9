# Middleman Controller System Documentation

## Overview
The Middleman Controller system enables users to create personalized storefronts by selecting templates and curating products from the main catalog.

## Architecture

### Database Schema
```sql
-- Templates table (pre-existing)
templates (id, name, description, preview_image, category, is_premium, config)

-- Store Customizations (NEW)
store_customizations (
  id, store_id, template_id,
  layout_mode, products_per_page, show_sidebar,
  primary_color, secondary_color, font_family,
  hero_banner_url, hero_title, hero_subtitle,
  created_at, updated_at
)

-- Store Products Junction
store_products (store_id, asin, added_at)
```

### Controllers

#### 1. TemplateController
Manages template selection and store customization.

**Methods:**
- `getTemplates()` - Fetch all available templates
- `getTemplateById(id)` - Get specific template
- `applyTemplate(storeId, templateId)` - Apply template to store
- `getStoreCustomization(storeId)` - Get current customization
- `updateCustomization(storeId, updates)` - Update settings
- `getCompleteStore(storeSlug)` - Get full store data with products
- `previewTemplate(templateId)` - Preview with sample data

#### 2. ProductController
Manages product curation for stores.

**Methods:**
- `addProductToStore(storeId, asin)` - Add single product
- `removeProductFromStore(storeId, asin)` - Remove product
- `getStoreProducts(storeId)` - Get all store products
- `bulkAddProducts(storeId, asins[])` - Bulk import

#### 3. DashboardController
Provides dashboard analytics and overview.

**Methods:**
- `getDashboardOverview(storeId)` - Get stats summary
- `getAnalytics(storeId, days)` - Get analytics data

### API Routes

#### GET /api/middleman/templates
Returns all available templates.

#### POST /api/middleman/templates
Applies a template to a store.
```json
{ "storeId": "uuid", "templateId": "template-id" }
```

#### GET /api/middleman/products?storeId=xxx
Gets all products for a store.

#### POST /api/middleman/products
Adds product(s) to store.
```json
// Single
{ "storeId": "uuid", "asin": "B08N5KWB9H" }

// Bulk
{ "storeId": "uuid", "asins": ["B08N5KWB9H", "B07ZPKBL7V"] }
```

#### DELETE /api/middleman/products?storeId=xxx&asin=yyy
Removes a product from store.

#### GET /api/middleman/customize?storeId=xxx
Gets store customization settings.

#### POST /api/middleman/customize
Updates customization settings.
```json
{
  "storeId": "uuid",
  "primary_color": "#FF5733",
  "layout_mode": "masonry",
  "hero_title": "My Awesome Store"
}
```

## User Flow

### 1. Welcome & Store Creation (`/middleman`)
```typescript
// Check if user has store
if (!store) {
  // Show create store form
  // Generate unique slug
  // Save to middleman_profiles
} else {
  // Redirect to template selection or dashboard
}
```

### 2. Template Selection (`/template`)
```typescript
// Fetch templates from DB
// Display grid of templates
// On select:
await TemplateController.applyTemplate(storeId, templateId)
router.push('/dashboard')
```

### 3. Dashboard (`/dashboard`)
Left sidebar navigation:
- **Overview** - Stats and quick actions
- **Products** - Add/remove ASINs
- **Customize** - Change colors, layout, branding
- **Settings** - Store info, template switch
- **View Store** - Link to public storefront

### 4. Public Storefront (`/[storeSlug]`)
```typescript
// Dynamic route captures storeSlug
const { profile, customization, products } = 
  await TemplateController.getCompleteStore(storeSlug)

// Render with template styling
// Apply custom colors, fonts, layout
// Display curated products
```

## Security

### Row Level Security (RLS)
```sql
-- Owners can manage their own stores
CREATE POLICY "Store owners can view own settings" 
  ON store_customizations FOR SELECT 
  USING (auth.uid() IN (
    SELECT user_id FROM middleman_profiles 
    WHERE id = store_customizations.store_id
  ));

-- Public can read for rendering
CREATE POLICY "Public can view store settings" 
  ON store_customizations FOR SELECT 
  USING (true);
```

### API Authentication
All mutating endpoints verify:
1. User is authenticated
2. User owns the store
3. Request data is validated

## Customization Options

### Layout Modes
- `grid` - Standard grid layout (default)
- `list` - List view with details
- `masonry` - Pinterest-style staggered
- `minimal` - Clean, minimal design

### Branding
- Primary color (buttons, accents)
- Secondary color (headers, borders)
- Font family (inter, roboto, open-sans, etc.)
- Hero banner image
- Custom titles/subtitles

### Display Settings
- Products per page (6, 12, 24, 48)
- Show/hide sidebar
- Sort order options

## Example Usage

### Adding Products via Dashboard
```tsx
// Dashboard product manager component
const [asinInput, setAsinInput] = useState('')

const handleAddProduct = async () => {
  const response = await fetch('/api/middleman/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      storeId: store.id,
      asin: asinInput
    })
  })
  
  const result = await response.json()
  if (result.success) {
    // Refresh product list
    toast.success('Product added!')
  }
}
```

### Rendering Customized Storefront
```tsx
// [storeSlug]/page.tsx
export default async function StorePage({ params }) {
  const store = await TemplateController.getCompleteStore(params.storeSlug)
  
  if (!store) notFound()
  
  const { customization, products } = store
  
  return (
    <div style={{ 
      '--primary-color': customization.primary_color,
      '--font-family': customization.font_family
    }}>
      <HeroBanner 
        image={customization.hero_banner_url}
        title={customization.hero_title}
      />
      
      <ProductGrid 
        products={products}
        layout={customization.layout_mode}
        perPage={customization.products_per_page}
      />
    </div>
  )
}
```

## Migration Steps

1. **Run Database Migration**
```bash
npx supabase db push
```

2. **Seed Templates**
```sql
INSERT INTO templates (id, name, description, category, config) VALUES
  ('modern-tech', 'Modern Tech', 'Clean tech-focused design', 'technology', 
   '{"layout_mode": "grid", "products_per_page": 12, "show_sidebar": true}'),
  ('minimalist', 'Minimalist', 'Simple and elegant', 'lifestyle',
   '{"layout_mode": "minimal", "products_per_page": 8, "show_sidebar": false}')
-- Add more templates
```

3. **Test Flow**
- Visit `/middleman` → Create store
- Select template at `/template`
- Add products in `/dashboard`
- View store at `/your-store-name`

## Future Enhancements

- [ ] Template marketplace (user-submitted templates)
- [ ] Advanced analytics dashboard
- [ ] A/B testing for layouts
- [ ] Custom domain support
- [ ] Multi-language stores
- [ ] Inventory sync alerts
- [ ] Automated product recommendations
- [ ] Social media integration

## Troubleshooting

### Common Issues

**Template not applying:**
- Check RLS policies allow insert/update
- Verify store ownership
- Ensure template exists in DB

**Products not showing:**
- Verify ASINs exist in main products table
- Check store_products junction records
- Confirm RLS allows public read

**Customization not saving:**
- Validate field names match allowed fields
- Check for typos in API payload
- Verify authentication token is valid
