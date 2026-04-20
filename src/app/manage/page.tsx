"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

type Tab = "products" | "sellers" | "factories" | "middlemen";

type Item = Record<string, unknown>;

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () =>
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem("admin_auth")),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [items, setItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const endpoints: Record<Tab, string> = {
          products: "/api/admin/products",
          sellers: "/api/admin/sellers",
          factories: "/api/admin/factories",
          middlemen: "/api/admin/middlemen",
        };
        const res = await fetch(endpoints[activeTab]);
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      }
      setIsLoading(false);
    };

    fetchItems();
  }, [isAuthenticated, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("admin_auth", "true");
      }
    } catch {}
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setIsSubmitting(true);
    try {
      const endpoints: Record<Tab, string> = {
        products: "/api/admin/products",
        sellers: "/api/admin/sellers",
        factories: "/api/admin/factories",
        middlemen: "/api/admin/middlemen",
      };
      await fetch(`${endpoints[activeTab]}?id=${id}`, { method: "DELETE" });
      fetchItems();
    } catch {}
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const endpoints: Record<Tab, string> = {
        products: "/api/admin/products",
        sellers: "/api/admin/sellers",
        factories: "/api/admin/factories",
        middlemen: "/api/admin/middlemen",
      };
      const method = editingItem ? "PUT" : "POST";
      await fetch(endpoints[activeTab], {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      setIsModalOpen(false);
      setEditingItem(null);
      fetchItems();
    } catch {}
    setIsSubmitting(false);
  };

  const openModal = (item?: Item) => {
    setEditingItem(item || null);
    setIsModalOpen(true);
  };

  const getItemName = (item: Item): string => {
    if (activeTab === "products") return String(item.title || "");
    if (activeTab === "sellers") return String(item.storeName || "");
    if (activeTab === "factories") return String(item.factoryName || "");
    if (activeTab === "middlemen") return String(item.name || "");
    return "-";
  };

  const getItemDetails = (item: Item): string => {
    if (activeTab === "products") return `$${item.price ?? 0}`;
    return `★ ${item.rating ?? 0}`;
  };

  const getItemStatus = (item: Item): string => {
    if (activeTab === "products") return String(item.status || "inactive");
    if (
      activeTab === "sellers" ||
      activeTab === "factories" ||
      activeTab === "middlemen"
    ) {
      return item.isVerified ? "Verified" : "Pending";
    }
    return "-";
  };

  const isStatusActive = (item: Item): boolean => {
    if (activeTab === "products") return item.status === "active";
    return Boolean(item.isVerified);
  };

  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="animate-pulse text-white/60">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-white/60 mt-2">Access the management panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "products", label: "Products" },
    { key: "sellers", label: "Sellers" },
    { key: "factories", label: "Factories" },
    { key: "middlemen", label: "Middlemen" },
  ];

  return (
    <div className="min-h-screen bg-[#050508] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/60 mt-1">Manage your platform</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem("admin_auth");
              setIsAuthenticated(false);
            }}
          >
            Logout
          </Button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white capitalize">
              {activeTab}
            </h2>
            <Button size="sm" onClick={() => openModal()}>
              Add New
            </Button>
          </div>

          {isLoading ? (
            <div className="animate-pulse text-white/60">Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              No {activeTab} found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="text-left text-white/60 pb-3 pr-4">Name</th>
                    <th className="text-left text-white/60 pb-3 pr-4">
                      Details
                    </th>
                    <th className="text-left text-white/60 pb-3 pr-4">
                      Status
                    </th>
                    <th className="text-right text-white/60 pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="wait">
                    {items.map((item) => (
                      <motion.tr
                        key={String(item.id)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-glass-border/50"
                      >
                        <td className="py-4 pr-4 text-white">
                          {getItemName(item)}
                        </td>
                        <td className="py-4 pr-4 text-white/60">
                          {getItemDetails(item)}
                        </td>
                        <td className="py-4 pr-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs ${isStatusActive(item) ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                          >
                            {getItemStatus(item)}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openModal(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(String(item.id))}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit" : "Add New"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "products" && (
            <>
              <Input
                label="Title"
                value={String(editingItem?.title || "")}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev
                      ? { ...prev, title: e.target.value }
                      : { title: e.target.value },
                  )
                }
                required
              />
              <Input
                label="Price"
                type="number"
                value={String(editingItem?.price || "")}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev
                      ? { ...prev, price: parseFloat(e.target.value) }
                      : { price: parseFloat(e.target.value) },
                  )
                }
                required
              />
              <Input
                label="Stock"
                type="number"
                value={String(editingItem?.stock || "")}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev
                      ? { ...prev, stock: parseInt(e.target.value) }
                      : { stock: parseInt(e.target.value) },
                  )
                }
                required
              />
            </>
          )}
          {activeTab === "sellers" && (
            <Input
              label="Store Name"
              value={String(editingItem?.storeName || "")}
              onChange={(e) =>
                setEditingItem((prev) =>
                  prev
                    ? { ...prev, storeName: e.target.value }
                    : { storeName: e.target.value },
                )
              }
              required
            />
          )}
          {activeTab === "factories" && (
            <Input
              label="Factory Name"
              value={String(editingItem?.factoryName || "")}
              onChange={(e) =>
                setEditingItem((prev) =>
                  prev
                    ? { ...prev, factoryName: e.target.value }
                    : { factoryName: e.target.value },
                )
              }
              required
            />
          )}
          {activeTab === "middlemen" && (
            <Input
              label="Name"
              value={String(editingItem?.name || "")}
              onChange={(e) =>
                setEditingItem((prev) =>
                  prev
                    ? { ...prev, name: e.target.value }
                    : { name: e.target.value },
                )
              }
              required
            />
          )}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
