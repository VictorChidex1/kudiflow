import { useState, useMemo, useEffect } from "react";
import SEO from "../../components/SEO";
import {
  Plus,
  Search,
  Package,
  Edit2,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Wallet,
  X,
  LayoutGrid,
  List as ListIcon,
  Filter,
  ImagePlus,
  Loader2,
} from "lucide-react";
import { useInventory } from "../../hooks/useInventory";
import type { Product, NewProduct } from "../../types/inventory";
import { storage } from "../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Electronics & Gadgets",
  "Fashion & Apparel",
  "Provisions & Groceries",
  "Pharmacy & Health",
  "Automobile & Spare Parts",
  "Beauty & Cosmetics",
  "Others",
];

const UNITS = ["Pieces", "Cartons", "Packs", "Kg", "Liters", "Pairs", "Sets"];

export default function Inventory() {
  const { products, isLoading, addProduct, updateProduct, deleteProduct } =
    useInventory();

  // View & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, showLowStockOnly]);

  // Drawer & Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<NewProduct>({
    productName: "",
    category: "Others",
    sku: "",
    sellingPrice: 0,
    costPrice: 0,
    wholesalePrice: 0,
    stockLevel: 0,
    minStockLevel: 5,
    unit: "Pieces",
    expiryDate: "",
    notes: "",
    imageUrl: "",
  });

  // ─── Derived State (Filtering & Metrics) ───────────────────────────
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchesLowStock = showLowStockOnly
        ? p.stockLevel <= (p.minStockLevel || 5)
        : true;

      return matchesSearch && matchesCategory && matchesLowStock;
    });
  }, [products, searchTerm, selectedCategory, showLowStockOnly]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  const metrics = useMemo(() => {
    return products.reduce(
      (acc, p) => {
        acc.totalCost += p.costPrice * p.stockLevel;
        acc.potentialRevenue += p.sellingPrice * p.stockLevel;
        if (p.stockLevel <= (p.minStockLevel || 5)) {
          acc.lowStockCount++;
        }
        return acc;
      },
      { totalCost: 0, potentialRevenue: 0, lowStockCount: 0 }
    );
  }, [products]);

  // ─── Handlers ───────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      productName: "",
      category: "Others",
      sku: "",
      sellingPrice: 0,
      costPrice: 0,
      wholesalePrice: 0,
      stockLevel: 0,
      minStockLevel: 5,
      unit: "Pieces",
      expiryDate: "",
      notes: "",
      imageUrl: "",
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      category: product.category || "Others",
      sku: product.sku || "",
      sellingPrice: product.sellingPrice,
      costPrice: product.costPrice,
      wholesalePrice: product.wholesalePrice || 0,
      stockLevel: product.stockLevel,
      minStockLevel: product.minStockLevel || 5,
      unit: product.unit || "Pieces",
      expiryDate: product.expiryDate || "",
      notes: product.notes || "",
      imageUrl: product.imageUrl || "",
    });
    setIsDrawerOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setIsUploadingImage(true);
    const storageRef = ref(storage, `inventory/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Upload error", error);
        toast.error("Failed to upload image.");
        setIsUploadingImage(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
        toast.success("Image uploaded!");
        setIsUploadingImage(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct.id) {
      await updateProduct(editingProduct.id, formData);
    } else {
      await addProduct(formData);
    }
    setIsDrawerOpen(false);
  };

  const handleNumberInput = (field: keyof NewProduct, value: string) => {
    const numericString = value.replace(/[^0-9]/g, "");
    const numericValue = numericString ? parseInt(numericString, 10) : 0;
    setFormData({ ...formData, [field]: numericValue });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  return (
    <>
      <SEO
        title="Inventory Manager"
        description="Manage your KudiFlow products, track low stock, and handle wholesale pricing."
      />

      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
        {/* Header & KPI Cards */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Inventory Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Monitor stock levels, costs, and product grades.
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Package className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Total Items
                </span>
              </div>
              <span className="text-2xl font-extrabold text-slate-900">
                {products.length}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <Wallet className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Total Cost Value
                </span>
              </div>
              <span className="text-2xl font-extrabold text-slate-900">
                ₦{metrics.totalCost.toLocaleString()}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-2 text-indigo-500 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Expected Revenue
                </span>
              </div>
              <span className="text-2xl font-extrabold text-slate-900">
                ₦{metrics.potentialRevenue.toLocaleString()}
              </span>
            </div>

            <div
              className={`p-5 rounded-2xl border flex flex-col gap-1 transition-colors ${
                metrics.lowStockCount > 0
                  ? "bg-rose-50 border-rose-200"
                  : "bg-white border-slate-200"
              }`}
            >
              <div
                className={`flex items-center gap-2 mb-2 ${
                  metrics.lowStockCount > 0 ? "text-rose-600" : "text-slate-500"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Low Stock Alerts
                </span>
              </div>
              <span
                className={`text-2xl font-extrabold ${
                  metrics.lowStockCount > 0 ? "text-rose-700" : "text-slate-900"
                }`}
              >
                {metrics.lowStockCount}
              </span>
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="relative w-full sm:w-48 flex items-center">
              <Filter className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm font-medium appearance-none"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLowStockOnly}
                onChange={(e) => setShowLowStockOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Low Stock Only
              </span>
            </label>

            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === "table"
                    ? "bg-white shadow-sm text-emerald-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-emerald-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Display */}
        <div
          className={`${
            viewMode === "table"
              ? "bg-white rounded-2xl border border-slate-200 shadow-sm"
              : ""
          } min-h-[400px] relative`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 h-full absolute inset-0 bg-white/50 backdrop-blur-sm z-10 rounded-2xl">
              <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-2xl border border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                No products found
              </h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                {searchTerm || selectedCategory !== "All" || showLowStockOnly
                  ? "Try adjusting your filters."
                  : "Your inventory is empty. Click 'Add Product' to stock up."}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        product.stockLevel <= (product.minStockLevel || 5)
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {product.stockLevel} {product.unit || "Pcs"} Left
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => product.id && handleDelete(product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {product.imageUrl && (
                    <div className="mb-3 rounded-lg overflow-hidden h-32 w-full bg-slate-50 border border-slate-100 flex-shrink-0">
                      <img src={product.imageUrl} alt={product.productName} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-2">
                    {product.productName}
                  </h3>
                  {product.sku && (
                    <p className="text-xs text-slate-400 font-mono mb-3">
                      {product.sku}
                    </p>
                  )}
                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-0.5">
                        Retail
                      </p>
                      <p className="font-bold text-emerald-600">
                        ₦{product.sellingPrice.toLocaleString()}
                      </p>
                    </div>
                    {product.wholesalePrice ? (
                      <div className="text-right">
                        <p className="text-[10px] text-indigo-500 font-semibold mb-0.5 uppercase tracking-wider">
                          Wholesale
                        </p>
                        <p className="font-bold text-indigo-700 text-sm">
                          ₦{product.wholesalePrice.toLocaleString()}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200 text-xs uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-6 py-4">Pricing</th>
                    <th className="px-6 py-4 text-center">Stock</th>
                    <th className="px-6 py-4">Attributes</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-100 flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">
                              {product.productName}
                            </span>
                            <span className="text-xs text-slate-500 font-medium mt-0.5">
                              {product.category || "Uncategorized"}
                              {product.sku && ` • ${product.sku}`}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-emerald-600">
                            ₦{product.sellingPrice.toLocaleString()}
                          </span>
                          {product.wholesalePrice ? (
                            <span className="text-xs text-indigo-500 font-semibold mt-0.5">
                              Wholesale: ₦
                              {product.wholesalePrice.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 mt-0.5">
                              Cost: ₦{product.costPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                              product.stockLevel <= (product.minStockLevel || 5)
                                ? "bg-rose-100 text-rose-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {product.stockLevel} {product.unit || "Pcs"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          {product.expiryDate && (
                            <span className="text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-sm inline-flex w-max">
                              Exp: {product.expiryDate}
                            </span>
                          )}
                          {product.notes && (
                            <span className="text-slate-500 truncate max-w-[120px]" title={product.notes}>
                              {product.notes}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-2 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              product.id && handleDelete(product.id)
                            }
                            className="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination Footer */}
          {!isLoading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-200 rounded-b-2xl gap-4 mt-auto">
              <span className="text-sm text-slate-500 font-medium">
                Showing <span className="text-slate-900 font-bold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> of <span className="text-slate-900 font-bold">{filteredProducts.length}</span> items
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Previous
                </button>
                
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all shadow-sm ${
                        currentPage === idx + 1 
                          ? "bg-emerald-600 text-white border-none" 
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Slide-Over Drawer for Add/Edit */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Details Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Basic Details
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Product Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.productName}
                      onChange={(e) =>
                        setFormData({ ...formData, productName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder="e.g. Original Dubai Bag"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm appearance-none"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        SKU / Barcode
                      </label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                        placeholder="e.g. BAG-001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Product Image <span className="text-xs font-normal text-slate-400">(Optional)</span>
                    </label>
                    <div className="flex bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all overflow-hidden">
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="Paste image URL or upload..."
                        className="flex-1 px-4 py-2.5 bg-transparent border-none focus:outline-none text-sm w-full"
                      />
                      <label className="flex items-center justify-center px-4 border-l border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors text-slate-600 text-sm font-medium whitespace-nowrap">
                        {isUploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
                        <span className="ml-2 hidden sm:block">Upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingImage} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Pricing
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Cost Price (₦) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.costPrice ? formData.costPrice.toLocaleString() : ""}
                        onChange={(e) => handleNumberInput("costPrice", e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                        placeholder="Cost to you"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Retail Price (₦) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.sellingPrice ? formData.sellingPrice.toLocaleString() : ""}
                        onChange={(e) => handleNumberInput("sellingPrice", e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                        placeholder="Selling price"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Wholesale Price (₦) <span className="text-xs font-normal text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.wholesalePrice ? formData.wholesalePrice.toLocaleString() : ""}
                      onChange={(e) => handleNumberInput("wholesalePrice", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder="For bulk buyers"
                    />
                  </div>
                </div>

                {/* Stock & Advanced Section */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Stock & Details
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Current Stock <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.stockLevel ? formData.stockLevel.toLocaleString() : ""}
                        onChange={(e) => handleNumberInput("stockLevel", e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Unit
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm appearance-none"
                      >
                        {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5 text-rose-600">
                        Low Stock Alert At
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.minStockLevel ? formData.minStockLevel.toLocaleString() : ""}
                        onChange={(e) => handleNumberInput("minStockLevel", e.target.value)}
                        className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm"
                        title="We will alert you when stock falls below this number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Expiry Date <span className="text-xs font-normal text-slate-400">(Optional)</span>
                      </label>
                      <input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Notes / Grades <span className="text-xs font-normal text-slate-400">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm resize-none"
                      placeholder="e.g., China Grade A, London Used..."
                    />
                  </div>
                </div>

              </form>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                className="px-4 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5"
              >
                {editingProduct ? "Save Changes" : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
