import { useState } from "react";
import SEO from "../../components/SEO";
import { Plus, Search, Package, Edit2, Trash2 } from "lucide-react";
import { useInventory } from "../../hooks/useInventory";
import type { Product, NewProduct } from "../../types/inventory";

export default function Inventory() {
  const { products, isLoading, addProduct, updateProduct, deleteProduct } =
    useInventory();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<NewProduct>({
    productName: "",
    sellingPrice: 0,
    costPrice: 0,
    stockLevel: 0,
  });

  const filteredProducts = products.filter((p) =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.costPrice * p.stockLevel,
    0
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      productName: "",
      sellingPrice: 0,
      costPrice: 0,
      stockLevel: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      sellingPrice: product.sellingPrice,
      costPrice: product.costPrice,
      stockLevel: product.stockLevel,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct.id) {
      await updateProduct(editingProduct.id, formData);
    } else {
      await addProduct(formData);
    }
    setIsModalOpen(false);
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
        description="Manage your KudiFlow products and stock."
      />

      <div className="flex flex-col gap-6">
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Inventory Manager
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Total Value:{" "}
              <span className="font-bold text-emerald-600">
                ₦{totalInventoryValue.toLocaleString()}
              </span>
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-kudi-green hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Toolbar: Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 h-full">
              <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-500 text-sm font-medium">
                Loading inventory...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                No products found
              </h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                {searchTerm
                  ? "Try adjusting your search query."
                  : "You haven't added any products yet. Click 'Add Product' to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Product Name</th>
                    <th className="px-6 py-4 font-medium text-right">
                      Selling Price
                    </th>
                    <th className="px-6 py-4 font-medium text-right">
                      Cost Price
                    </th>
                    <th className="px-6 py-4 font-medium text-center">Stock</th>
                    <th className="px-6 py-4 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {product.productName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-700">
                        ₦{product.sellingPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500">
                        ₦{product.costPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stockLevel <= 5
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {product.stockLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors mr-2"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => product.id && handleDelete(product.id)}
                          className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm shadow-2xl">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden transform transition-all p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-transparent outline-none transition-all"
                  placeholder="e.g. iPhone 13 Pro"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Selling Price (₦)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={formData.sellingPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sellingPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Cost Price (₦)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={formData.costPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        costPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Initial Stock Level
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={formData.stockLevel || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stockLevel: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-kudi-green hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                >
                  {editingProduct ? "Save Changes" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
