import React, { useEffect, useState } from 'react';
import { PackageSearch, Search, X } from 'lucide-react';
import { OrderRecord } from '../types/jewellery';
import { formatINR } from '../utils/csvParser';

interface TrackOrderModalProps {
  isOpen: boolean;
  orders: OrderRecord[];
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  orders,
  onClose,
}) => {
  const [lookupId, setLookupId] = useState('');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const query = lookupId.trim().replace(/^#/, '').toLowerCase();
  const visibleOrders = query
    ? orders.filter(
        (o) =>
          o.orderId.toLowerCase().includes(query) ||
          o.phone.toLowerCase().includes(query)
      )
    : orders;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="track-order-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        className="fixed inset-0 bg-[#1F1A17]/65 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-[#FDFBF7] border border-[#E6DEC8] rounded-xl shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 bg-[#F6F1E7] border-b border-[#E6DEC8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PackageSearch
              className="w-5 h-5 text-[#5C162E]"
              aria-hidden="true"
            />
            <h2
              id="track-order-title"
              className="font-serif text-xl font-bold text-[#1F1A17]"
            >
              Track Your Order
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close track order"
            className="p-1.5 text-[#1F1A17] hover:text-[#5C162E] rounded-md"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="relative">
            <Search
              className="w-4 h-4 text-[#635850] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="Search by Order ID (e.g. SR-123456) or Phone..."
              aria-label="Search by Order ID or phone number"
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#E6DEC8] rounded-md focus:outline-none focus:border-[#5C162E]"
            />
          </div>

          {visibleOrders.length === 0 ? (
            <div className="py-10 text-center bg-white border border-[#E6DEC8] rounded-lg px-4">
              <p className="font-serif text-base font-semibold text-[#1F1A17]">
                {orders.length === 0
                  ? 'No orders placed on this device yet'
                  : 'No matching order found'}
              </p>
              <p className="text-xs text-[#635850] mt-1">
                Once you place an order via Checkout, your receipt and live status will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="p-4 bg-white border border-[#E6DEC8] rounded-lg space-y-2 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-[#5C162E]">
                      #{order.orderId}
                    </span>
                    <span className="text-xs font-semibold text-[#145332]">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#635850]">
                    {order.customerName} · {order.paymentMode} ·{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <div className="pt-2 border-t border-[#F0E9DA] flex items-center justify-between text-xs">
                    <span className="text-[#635850]">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} item(s)
                    </span>
                    <span className="font-bold text-[#1F1A17] tabular-nums">
                      {formatINR(order.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
