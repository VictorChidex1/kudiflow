import { Printer, CheckCircle2, X } from "lucide-react";
import type { Sale, NewSale } from "../../types/sales";

interface ReceiptModalProps {
  sale: Sale | NewSale;
  onClose: () => void;
  onNewSale?: () => void;
}

export function ReceiptModal({ sale, onClose, onNewSale }: ReceiptModalProps) {
  let saleDate = new Date();
  const _sale = sale as unknown as { createdAt?: unknown };
  if (
    _sale.createdAt &&
    typeof (_sale.createdAt as { toDate?: () => Date }).toDate === "function"
  ) {
    saleDate = (_sale.createdAt as { toDate: () => Date }).toDate();
  } else if (_sale.createdAt && typeof _sale.createdAt === "number") {
    saleDate = new Date(_sale.createdAt);
  } else if (_sale.createdAt instanceof Date) {
    saleDate = _sale.createdAt;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:relative print:z-0 print:bg-white print:p-0 print:flex-none print:items-start font-mono animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:rounded-none flex flex-col max-h-[90vh]">
        {/* Close Button for non-print view */}
        <div className="flex justify-end pt-4 pr-4 print:hidden">
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The actual Printable Receipt Area */}
        <div className="p-6 pt-2 bg-white flex-1 overflow-y-auto print:overflow-visible print:p-0">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-kudi-green/10 text-kudi-green rounded-full flex items-center justify-center mb-3 print:hidden">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 uppercase tracking-widest">
              KudiFlow Store
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Receipt for your transaction
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {saleDate.toLocaleString()}
            </p>
          </div>

          <div className="border-t-2 border-dashed border-slate-200 mb-4 pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="text-left font-medium pb-2">Item</th>
                  <th className="text-center font-medium pb-2">Qty</th>
                  <th className="text-right font-medium pb-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-50">
                    <td className="py-2 text-slate-900 pr-2">
                      {item.productName}
                    </td>
                    <td className="py-2 text-center text-slate-600">
                      x{item.quantity}
                    </td>
                    <td className="py-2 text-right text-slate-900 font-medium">
                      ₦{item.subtotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-1.5 text-sm mb-6">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>₦{sale.subtotal.toLocaleString()}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-rose-500">
                <span>Discount</span>
                <span>-₦{sale.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Amount</span>
              <span>₦{sale.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600 pt-2">
              <span>Amount Paid</span>
              <span>₦{sale.amountPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payment Method</span>
              <span className="capitalize font-medium">
                {sale.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Status</span>
              <span className="uppercase font-bold text-[10px] px-2 py-0.5 bg-slate-100 rounded-md">
                {sale.paymentStatus}
              </span>
            </div>

            {sale.customerName && (
              <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                <div className="text-xs text-slate-500">Customer</div>
                <div className="font-medium text-slate-900">
                  {sale.customerName}
                </div>
                {sale.customerPhone && (
                  <div className="text-xs text-slate-500">
                    {sale.customerPhone}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-center text-xs text-slate-500 pb-2">
            Thank you for choosing us!
            <div className="mt-1 font-semibold">Powered by KudiFlow Engine</div>
          </div>
        </div>

        {/* Print Modal Actions - Hidden on actual print */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold flex flex-col items-center justify-center hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Printer className="w-4 h-4" /> Print Receipt
            </span>
          </button>
          {onNewSale && (
            <button
              onClick={onNewSale}
              className="flex-1 py-3 bg-kudi-green text-white rounded-xl font-bold flex flex-col items-center justify-center hover:bg-kudi-green/90 transition-colors"
            >
              New Sale
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
