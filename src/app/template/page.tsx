'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { TemplateController } from '@/lib/controllers/middleman-controller';
import { motion } from 'framer-motion';

interface Template {
  id: string;
  name: string;
  description: string;
  preview_image: string | null;
  category: string;
  is_premium: boolean;
  config: any;
}

export default function TemplateSelectionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/middleman');
      return;
    }

    if (user) {
      // Get user's store
      const getStore = async () => {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );
          
          const { data } = await supabase
            .from('middleman_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();
          
          if (data) {
            setStoreId(data.id);
          } else {
            router.push('/middleman');
          }
        } catch (error) {
          console.error('Error fetching store:', error);
          router.push('/middleman');
        }
      };
      
      getStore();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      const data = await TemplateController.getTemplates();
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectTemplate(templateId: string) {
    if (!storeId) return;
    
    setSelectedTemplate(templateId);
    
    try {
      await TemplateController.applyTemplate(storeId, templateId);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error applying template:', error);
      alert('Failed to apply template. Please try again.');
      setSelectedTemplate(null);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Store Template
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Select a professional template to customize your storefront. You can change this later.
          </p>
        </motion.div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
            >
              {/* Preview Image */}
              <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
                {template.preview_image ? (
                  <img
                    src={template.preview_image}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl">🏪</span>
                  </div>
                )}
                {template.is_premium && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    Premium
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{template.name}</h3>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
                
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {template.description}
                </p>

                {/* Features */}
                {template.config && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Features:</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {template.config.layout_mode && (
                        <li>• Layout: {template.config.layout_mode}</li>
                      )}
                      {template.config.products_per_page && (
                        <li>• Products per page: {template.config.products_per_page}</li>
                      )}
                      {template.config.show_sidebar !== undefined && (
                        <li>• Sidebar: {template.config.show_sidebar ? 'Enabled' : 'Hidden'}</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Select Button */}
                <button
                  onClick={() => handleSelectTemplate(template.id)}
                  disabled={selectedTemplate === template.id}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedTemplate === template.id
                      ? 'bg-green-600 text-white cursor-wait'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {selectedTemplate === template.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Applying...
                    </span>
                  ) : (
                    'Select This Template'
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No templates available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
