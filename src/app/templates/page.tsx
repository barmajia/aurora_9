'use client';

import { useState } from 'react';
import { 
  Layout, 
  ShoppingBag, 
  Smartphone, 
  Utensils, 
  Briefcase, 
  Image,
  Search,
  Eye,
  Check,
  Star
} from 'lucide-react';
import { TEMPLATE_CATEGORIES } from '@/lib/builder';
import { cn } from '@/lib/utils';

const MOCK_TEMPLATES = [
  {
    id: '1',
    name: 'Modern Fashion',
    slug: 'modern-fashion',
    description: 'Clean and elegant fashion store template',
    category: 'fashion',
    thumbnailUrl: '/templates/fashion.jpg',
    isPremium: false,
  },
  {
    id: '2',
    name: 'Tech Hub',
    slug: 'tech-hub',
    description: 'Electronics store with sleek dark design',
    category: 'electronics',
    thumbnailUrl: '/templates/tech.jpg',
    isPremium: false,
  },
  {
    id: '3',
    name: 'Food Delivery',
    slug: 'food-delivery',
    description: 'Restaurant and food delivery template',
    category: 'food',
    thumbnailUrl: '/templates/food.jpg',
    isPremium: false,
  },
  {
    id: '4',
    name: 'Minimal Store',
    slug: 'minimal-store',
    description: 'Clean minimal design for any product',
    category: 'general',
    thumbnailUrl: '/templates/minimal.jpg',
    isPremium: false,
  },
  {
    id: '5',
    name: 'Boutique',
    slug: 'boutique',
    description: 'Elegant boutique for luxury products',
    category: 'fashion',
    thumbnailUrl: '/templates/boutique.jpg',
    isPremium: true,
    price: 29,
  },
  {
    id: '6',
    name: 'Service Pro',
    slug: 'service-pro',
    description: 'Service business landing page',
    category: 'services',
    thumbnailUrl: '/templates/service.jpg',
    isPremium: false,
  },
  {
    id: '7',
    name: 'Portfolio',
    slug: 'portfolio',
    description: 'Showcase your work beautifully',
    category: 'portfolio',
    thumbnailUrl: '/templates/portfolio.jpg',
    isPremium: false,
  },
  {
    id: '8',
    name: 'Gourmet',
    slug: 'gourmet',
    description: 'Premium food and gourmet products',
    category: 'food',
    thumbnailUrl: '/templates/gourmet.jpg',
    isPremium: true,
    price: 39,
  },
];

const ICONS = {
  layout: Layout,
  shirt: ShoppingBag,
  smartphone: Smartphone,
  utensils: Utensils,
  briefcase: Briefcase,
  image: Image,
};

export default function TemplateGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const filteredTemplates = MOCK_TEMPLATES.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose a Template
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start with a professionally designed template and customize it to match your brand
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedCategory === 'all'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            )}
          >
            All Templates
          </button>
          {TEMPLATE_CATEGORIES.map((category) => {
            const Icon = ICONS[category.icon as keyof typeof ICONS] || Layout;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2',
                  selectedCategory === category.id
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                )}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={cn(
                'bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow',
                selectedTemplate === template.id && 'ring-2 ring-black'
              )}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Layout className="h-16 w-16 text-gray-400" />
                </div>
                {template.isPremium && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    PREMIUM
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.description}</p>
                  </div>
                  {template.isPremium && (
                    <span className="text-sm font-bold text-amber-600">${template.price}</span>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                    Use Template
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Layout className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}