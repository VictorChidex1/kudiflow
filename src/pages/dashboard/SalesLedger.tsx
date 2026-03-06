import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import { useInventory } from "../../hooks/useInventory";
import { useSales } from "../../hooks/useSales";
import type { Product } from "../../types/inventory";
import type {
  CartItem,
  NewSale,
  PaymentMethod,
  PaymentStatus,
} from "../../types/sales";
import toast from "react-hot-toast";

export default function SalesLedger() {
  const { products, isLoading: isLoadingInventory } = useInventory();
  const { processSale } = useSales();

  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.subtotal, 0),
    [cart]
  );

  const totalAmount = useMemo(
    () => Math.max(0, subtotal - discount),
    [subtotal, discount]
  );

  const handleAddToCart = (product: Product) => {
    if (product.stockLevel <= 0) {
      toast.error("This product is out of stock!");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stockLevel) {
          toast.error("Cannot add more than available stock!");
          return prev;
        }
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.unitPrice,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id!,
          productName: product.productName,
          quantity: 1,
          unitPrice: product.sellingPrice,
          subtotal: product.sellingPrice,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId) {
            const newQuantity = Math.max(0, item.quantity + delta);

            // Verify stock limit
            const product = products.find((p) => p.id === productId);
            if (product && newQuantity > product.stockLevel) {
              toast.error("Cannot exceed available stock!");
              return item;
            }

            return {
              ...item,
              quantity: newQuantity,
              subtotal: newQuantity * item.unitPrice,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleNumberInput = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string
  ) => {
    const numericString = value.replace(/[^0-9]/g, "");
    const numericValue = numericString ? parseInt(numericString, 10) : 0;
    setter(numericValue);
  };

  const openCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setAmountPaid(totalAmount); // Default to full payment
    setIsCheckoutOpen(true);
  };

  const submitSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    let status: PaymentStatus = "unpaid";
    if (amountPaid >= totalAmount) status = "paid";
    else if (amountPaid > 0) status = "partial";

    if (paymentMethod === "credit" && !customerName.trim()) {
      toast.error("Customer Name is required for credit sales.");
      return;
    }

    const newSale: NewSale = {
      items: cart,
      subtotal,
      discount,
      totalAmount,
      amountPaid,
      paymentMethod,
      paymentStatus: status,
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
    };

    const result = await processSale(newSale);

    if (result && result.success) {
      // Because we use an optimistic UI approach with fire-and-forget in useSales
      // the toast is handled inside the hook.

      // Reset POS state
      setCart([]);
      setDiscount(0);
      setIsCheckoutOpen(false);
      setCustomerName("");
      setCustomerPhone("");
      setAmountPaid(0);
      setPaymentMethod("cash");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-80px)] lg:overflow-hidden bg-slate-50 gap-4 lg:gap-6 p-4 lg:p-6">
      {/* Left Panel: Products Selection */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[60vh] lg:min-h-0">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-white z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products to add..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-kudi-green/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoadingInventory ? (
            <div className="flex justify-center items-center h-full text-slate-400">
              Loading inventory...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex justify-center items-center h-full text-slate-400">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stockLevel <= 0}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-300 ease-out ${
                    product.stockLevel <= 0
                      ? "opacity-50 border-slate-100 bg-slate-50 cursor-not-allowed grayscale"
                      : "border-slate-100 bg-white hover:border-kudi-green hover:shadow-lg hover:-translate-y-1 cursor-pointer active:scale-95 active:shadow-sm text-slate-900 group"
                  }`}
                >
                  <div className="font-semibold mb-1 group-hover:text-kudi-green transition-colors line-clamp-2">
                    {product.productName}
                  </div>
                  <div className="text-sm font-medium text-slate-600 mb-3">
                    ₦{product.sellingPrice.toLocaleString()}
                  </div>
                  <div className="mt-auto">
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-medium ${
                        product.stockLevel <= 5
                          ? "bg-rose-50 text-rose-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {product.stockLevel} in stock
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: The Cart view */}
      <div className="w-full lg:w-[400px] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 shrink-0 overflow-hidden h-fit lg:h-full">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-kudi-green" />
            Current Sale
          </h2>
          <span className="text-sm font-medium bg-kudi-green text-white px-2 py-0.5 rounded-full">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                <ShoppingCart className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="font-bold text-slate-700 mb-1">
                Your Cart is Empty
              </h3>
              <p className="text-sm text-slate-400">
                Select items from your inventory to begin a new sale.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col gap-2 p-3 bg-white border border-slate-100 shadow-sm rounded-xl relative overflow-hidden group animate-in slide-in-from-right-4 duration-300"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-kudi-green"></div>
                  <div className="flex justify-between items-start pl-2">
                    <span className="font-semibold text-slate-900 text-sm line-clamp-2 pr-2">
                      {item.productName}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-slate-300 hover:bg-rose-50 rounded-md hover:text-rose-500 p-1.5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pl-2">
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-1">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm border border-slate-100 hover:bg-slate-50 active:scale-95 transition-all"
                      >
                        <Minus className="w-3 h-3 text-slate-600" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center text-slate-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm border border-slate-100 hover:bg-slate-50 active:scale-95 transition-all"
                      >
                        <Plus className="w-3 h-3 text-slate-600" />
                      </button>
                    </div>
                    <span className="font-bold text-slate-800">
                      ₦{item.subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals & Checkout Button */}
        <div className="p-5 border-t border-slate-100 bg-white space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-medium text-slate-900">
              ₦{subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Discount</span>
            <input
              type="text"
              value={discount ? discount.toLocaleString() : ""}
              onChange={(e) => handleNumberInput(setDiscount, e.target.value)}
              placeholder="0"
              className="w-24 text-right px-2 py-1 border border-slate-200 rounded-lg focus:ring-2 focus:ring-kudi-green/20 outline-none"
            />
          </div>
          <div className="pt-3 border-t border-dashed border-slate-200 flex justify-between items-center">
            <span className="font-bold text-slate-900">Total</span>
            <span className="font-bold text-2xl text-kudi-green">
              ₦{totalAmount.toLocaleString()}
            </span>
          </div>

          <button
            onClick={openCheckout}
            disabled={cart.length === 0}
            className="w-full py-3.5 bg-kudi-green text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-kudi-green/90 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard className="w-5 h-5" />
            Checkout • ₦{totalAmount.toLocaleString()}
          </button>
        </div>
      </div>

      {/* Checkout Modal (Glassmorphism) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl border border-white/20 rounded-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="bg-kudi-green/10 text-kudi-green p-2 rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </span>
                Complete Sale
              </h2>

              <form onSubmit={submitSale} className="space-y-6">
                {/* Payment Method Selector */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      ["cash", "transfer", "pos", "credit"] as PaymentMethod[]
                    ).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 rounded-xl border text-sm font-semibold capitalize transition-all ${
                          paymentMethod === method
                            ? "bg-kudi-green/10 border-kudi-green text-kudi-green"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Paid Section with Quick Chips */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-semibold text-slate-700">
                      Amount Paid (₦)
                    </label>
                  </div>

                  {/* Quick Chips */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[1000, 5000, 10000, 50000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmountPaid(amt)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:border-kudi-green hover:text-kudi-green text-slate-600 text-xs font-bold rounded-lg transition-colors shadow-sm"
                      >
                        +{amt / 1000}k
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setAmountPaid(totalAmount)}
                      className="px-3 py-1.5 bg-kudi-green/10 border border-kudi-green/20 hover:bg-kudi-green hover:text-white text-kudi-green text-xs font-bold rounded-lg transition-colors shadow-sm ml-auto"
                    >
                      Exact (₦{totalAmount.toLocaleString()})
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    value={amountPaid ? amountPaid.toLocaleString() : ""}
                    onChange={(e) =>
                      handleNumberInput(setAmountPaid, e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-transparent outline-none transition-all font-bold text-xl text-slate-900 shadow-inner"
                    placeholder="0"
                  />
                  {amountPaid < totalAmount && (
                    <p className="text-xs text-amber-600 mt-1 font-medium">
                      Balance to pay: ₦
                      {(totalAmount - amountPaid).toLocaleString()} (Will be
                      marked as partial/unpaid)
                    </p>
                  )}
                </div>

                {/* Customer Details (Optional unless Credit/Partial) */}
                <div className="pt-2 border-t border-slate-100 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Customer Name{" "}
                      {(paymentMethod === "credit" ||
                        amountPaid < totalAmount) && (
                        <span className="text-rose-500">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required={
                        paymentMethod === "credit" || amountPaid < totalAmount
                      }
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-kudi-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 08012345678"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-kudi-green outline-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-kudi-green text-white rounded-xl font-bold hover:bg-kudi-green/90 transition-colors"
                  >
                    Confirm Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
