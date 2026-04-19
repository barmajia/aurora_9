'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Globe, 
  Settings, 
  Eye, 
  Edit3, 
  Trash2,
  ExternalLink,
  Loader2,
  Layout,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Site {
  id: string;
  name: string;
  slug: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface SitesListProps {
  userId: string;
  userRole: 'seller' | 'factory' | 'middleman';
}

export default function SitesList({ userId, userRole }: SitesListProps) {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchSites();
  }, [userId]);

  const fetchSites = async () => {
    try {
      const res = await fetch(`/api/builder/sites?user_id=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setSites(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (siteId: string) => {
    if (!confirm('Are you sure you want to delete this site? This action cannot be undone.')) {
      return;
    }

    setDeleting(siteId);
    try {
      const res = await fetch(`/api/builder/sites?site_id=${siteId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setSites(sites.filter(s => s.id !== siteId));
      }
    } catch (error) {
      console.error('Error deleting site:', error);
    } finally {
      setDeleting(null);
    }
  };

  const getSiteUrl = (site: Site) => {
    if (site.is_published && site.slug) {
      return `/store/${site.slug}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Website</h2>
          <p className="text-gray-500 mt-1">
            {userRole === 'factory' 
              ? 'Create and manage your factory website'
              : 'Create and manage your online store'}
          </p>
        </div>
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New Site
        </Link>
      </div>

      {sites.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No website yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            {userRole === 'factory'
              ? 'Start building your factory website to showcase your products and attract buyers.'
              : 'Start building your online store to reach more customers and grow your business.'}
          </p>
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Layout className="h-4 w-4" />
            Choose a Template
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {sites.map((site) => {
            const siteUrl = getSiteUrl(site);
            
            return (
              <div
                key={site.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{site.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {site.is_published ? (
                        <>
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            Published
                          </span>
                          {siteUrl && (
                            <Link
                              href={siteUrl}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </Link>
                          )}
                        </>
                      ) : (
                        <span className="text-amber-600">Draft</span>
                      )}
                      <span>•</span>
                      <span>Updated {new Date(site.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {siteUrl && (
                    <Link
                      href={siteUrl}
                      target="_blank"
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View site"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    href={`/builder/${site.id}`}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit site"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/builder/${site.id}/settings`}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Site settings"
                  >
                    <Settings className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(site.id)}
                    disabled={deleting === site.id}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete site"
                  >
                    {deleting === site.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add another site
        </Link>
        <Link
          href="/builder/landing-pages"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          View Landing Pages
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}