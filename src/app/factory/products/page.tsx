"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/lib/supabase";
import {
  Package,
  Plus,
  Search,
  Eye,
  MoreVertical,
  ChevronLeft,
  Filter,
  Grid,
  List,
  X,
  Truck,
  CheckCircle,
  Clock,
} from "lucide-react";

interface FactoryProduct {
  id: string;
  asin: string | null;
  sku: string | null;
  title: string;
  description: string;
  brand: string;
  price: number | null;
  quantity: number;
  status: string;
  category: string | null;
  subcategory: string | null;
  images: { url: string }[];
  created_at: string;
  wholesale_price: number | null;
  lead_time_days: number | null;
}

export default function FactoryProductsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [products, setProducts] = useState<FactoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (!user || user.role !== "factory") {
      router.push("/factory/login");
      return;
    }
    fetchProducts();
  }, [user]);

  async function fetchProducts() {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        return;
      }
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.asin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <Package size={48} className="gradient-text" />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <div>
          <h1>Factory Products</h1>
          <p className="header-subtitle">Manage your product catalog</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn-secondary">
            <Truck size={20} />
            Bulk Import
          </button>
          <button className="btn-primary">
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </header>

      <div className="products-toolbar">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, ASIN, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="toolbar-actions">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>

          <div className="view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={18} />
            </button>
            <button
              className={viewMode === "list" ? "active" : ""}
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <Package
            size={64}
            style={{ color: "var(--primary)", marginBottom: "1rem" }}
          />
          <h3>No products found</h3>
          <p>
            {searchQuery
              ? "Try adjusting your search"
              : "Start by adding your first product"}
          </p>
          {!searchQuery && (
            <button className="btn-primary">
              <Plus size={20} />
              Add Product
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="products-grid-dashboard">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card-dashboard glass-card">
              <div className="product-image-container">
                <Image
                  src={product.images?.[0]?.url || "/images/placeholder.jpg"}
                  alt={product.title}
                  width={300}
                  height={200}
                  placeholder="blur"
                  blurDataURL="/images/placeholder.jpg"
                />
                <span className={`status-badge ${product.status}`}>
                  {product.status}
                </span>
              </div>
              <div className="product-details">
                <div className="product-asin">{product.asin || "No ASIN"}</div>
                <h3 className="product-title">{product.title}</h3>
                <div className="product-meta-row">
                  <span className="product-category">
                    {product.category || "General"}
                  </span>
                  <span className="product-price">
                    ${product.price?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="product-stats">
                  <span>Stock: {product.quantity}</span>
                  {product.lead_time_days && (
                    <span className="lead-time">
                      <Clock size={12} /> {product.lead_time_days} days
                    </span>
                  )}
                </div>
                <div className="product-actions">
                  <button className="action-btn" title="View">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="products-table glass-card">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>ASIN</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Lead Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={
                        product.images?.[0]?.url ||
                        "https://via.placeholder.com/50"
                      }
                      alt={product.title}
                      className="table-thumb"
                    />
                  </td>
                  <td className="asin-cell">{product.asin || "-"}</td>
                  <td className="title-cell">{product.title}</td>
                  <td>{product.category || "General"}</td>
                  <td className="price-cell">
                    ${product.price?.toFixed(2) || "0.00"}
                  </td>
                  <td className={product.quantity < 10 ? "low-stock" : ""}>
                    {product.quantity}
                  </td>
                  <td>
                    {product.lead_time_days
                      ? `${product.lead_time_days} days`
                      : "-"}
                  </td>
                  <td>
                    <span className={`status-badge ${product.status}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
