'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import { Package, Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

interface ProductImage {
  url: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number | null;
  currency: string;
  images: ProductImage[];
  category?: string;
  subcategory?: string;
  quantity: number;
  status: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category || p.subcategory || 'General'));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory || p.subcategory === selectedCategory);
    }

    result = result.filter((p) => {
      const price = p.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 10000]);
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < 10000;

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 className="hero-title" style={{ fontSize: '3.5rem' }}>Our Products</h1>
          <p className="hero-subtitle" style={{ margin: '1rem auto', maxWidth: '600px' }}>
            Discover our curated collection of premium products
          </p>
        </div>
        <div className="loading-container">
          {[...Array(6)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Error</h2>
          <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>
          <button onClick={fetchProducts} className="auth-button">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '3.5rem' }}>Our Products</h1>
        <p className="hero-subtitle" style={{ margin: '1rem auto', maxWidth: '600px' }}>
          Discover our curated collection of premium products
        </p>
      </div>

      <div className="products-toolbar">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="toolbar-actions">
          <button
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>

          <div className="sort-dropdown">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
            <ChevronDown size={16} className="sort-icon" />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel glass-card">
          <div className="filter-section">
            <label className="filter-label">Category</label>
            <div className="filter-chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Price Range</label>
            <div className="price-range-inputs">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="price-input"
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="price-input"
                placeholder="Max"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              <X size={16} />
              Clear All Filters
            </button>
          )}
        </div>
      )}

      <div className="results-info">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <Package size={64} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
          {hasActiveFilters && (
            <button className="btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
