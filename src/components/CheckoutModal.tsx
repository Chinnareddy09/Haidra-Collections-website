import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  X,
} from 'lucide-react';
import { CartItem, OrderRecord } from '../types/jewellery';
import { buildOrderWhatsAppUrl, formatINR } from '../utils/csvParser';

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  storeName: string;
  whatsappNumber: string;
  freeShippingThreshold: number;
  onClose: () => void;
  onConfirmOrder: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  items,
  storeName,
  whatsappNumber,
  freeShippingThreshold,
  onClose,
  onConfirmOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'COD'>('COD');
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
    } else {
      setConfirmedOrder(null);
      setError('');
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 79;
  const total = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = customerName.trim();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const trimmedAddress = address.trim();

    if (trimmedName.length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (trimmedAddress.length < 10) {
      setError('Please enter your complete delivery address with PIN code.');
      return;
    }

    const order: OrderRecord = {
      orderId: `SR-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      customerName: trimmedName,
      phone: phone.trim(),
      address: trimmedAddress,
      paymentMode,
      items: items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
      })),
      subtotal,
      shippingFee,
      total,
      status: 'Confirmed — Preparing Dispatch',
    };

    setError('');
    setConfirmedOrder(order);
    onConfirmOrder(order);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        className="fixed inset-0 bg-[#1F1A17]/65 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#FDFBF7] border border-[#E6DEC8] rounded-xl shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 bg-[#F6F1E7] border-b border-[#E6DEC8] flex items-center justify-between">
          <h2
            id="checkout-modal-title"
            className="font-serif text-xl font-bold text-[#1F1A17]"
          >
            {confirmedOrder ? 'Order Confirmed' : 'Checkout & WhatsApp Order'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 text-[#1F1A17] hover:text-[#5C162E] rounded-md"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex items-start gap-3 p-4 bg-[#EFF8F3] border border-[#B7DFC8] rounded-lg">
              <CheckCircle2
                className="w-6 h-6 text-[#145332] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-serif text-lg font-bold text-[#145332]">
                  Order #{confirmedOrder.orderId} Confirmed — Preparing Shipment
                </h3>
                <p className="text-sm text-[#1F1A17] mt-1">
                  Thank you, {confirmedOrder.customerName}. Your order summary has been saved for tracking. Tap below to send your confirmed order directly to our store WhatsApp desk.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E6DEC8] rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#635850]">Order Number</span>
                <span className="font-mono font-semibold text-[#1F1A17]">
                  #{confirmedOrder.orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#635850]">Payment Mode</span>
                <span className="font-semibold text-[#1F1A17]">
                  {confirmedOrder.paymentMode === 'COD'
                    ? 'Cash on Delivery (COD)'
                    : 'UPI Instant Payment'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#635850]">Delivery Address</span>
                <span className="text-right text-[#1F1A17] max-w-xs">
                  {confirmedOrder.address}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E6DEC8] flex justify-between font-bold text-base">
                <span>Total Payable</span>
                <span className="text-[#5C162E] tabular-nums">
                  {formatINR(confirmedOrder.total)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={buildOrderWhatsAppUrl(
                  whatsappNumber,
                  storeName,
                  confirmedOrder
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-[#145332] hover:bg-[#0F4026] text-white text-sm font-semibold rounded-md inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Send Order on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 bg-[#F6F1E7] hover:bg-[#EAE1CF] text-[#1F1A17] border border-[#E6DEC8] text-sm font-semibold rounded-md transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
            {/* Order Items Summary */}
            <div className="bg-white border border-[#E6DEC8] rounded-lg p-4 space-y-2">
              <p className="text-xs font-semibold text-[#635850] pb-1 border-b border-[#F0E9DA]">
                Order Summary ({items.reduce((a, b) => a + b.quantity, 0)} items)
              </p>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="text-[#1F1A17] truncate">
                      {item.product.name} ({item.selectedSize},{' '}
                      {item.selectedColor}) × {item.quantity}
                    </span>
                    <span className="font-semibold tabular-nums shrink-0">
                      {formatINR(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[#E6DEC8] space-y-1 text-xs">
                <div className="flex justify-between text-[#635850]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#635850]">
                  <span>Insured Shipping</span>
                  <span className="tabular-nums">
                    {shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#5C162E] pt-1">
                  <span>Total Payable</span>
                  <span className="tabular-nums">{formatINR(total)}</span>
                </div>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="p-3 text-xs font-medium text-[#991B1B] bg-[#FEF2F2] border border-[#FECACA] rounded-md"
              >
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-semibold text-[#1F1A17] mb-1.5"
                >
                  Customer Name *
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Lakshmi Narayana"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E6DEC8] rounded-md focus:outline-none focus:border-[#5C162E]"
                />
              </div>
              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-xs font-semibold text-[#1F1A17] mb-1.5"
                >
                  Mobile / WhatsApp Number *
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 63050 85353"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E6DEC8] rounded-md focus:outline-none focus:border-[#5C162E]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="checkout-address"
                className="block text-xs font-semibold text-[#1F1A17] mb-1.5"
              >
                Full Shipping Address &amp; PIN Code *
              </label>
              <textarea
                id="checkout-address"
                rows={3}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Door No, Street, Landmark, City, State, PIN Code"
                className="w-full px-3 py-2 text-sm bg-white border border-[#E6DEC8] rounded-md focus:outline-none focus:border-[#5C162E]"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-[#1F1A17] mb-2">
                Payment Mode
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMode('COD')}
                  className={`p-3 text-left rounded-md border transition-colors ${
                    paymentMode === 'COD'
                      ? 'bg-[#5C162E] text-[#FDFBF7] border-[#5C162E]'
                      : 'bg-white text-[#1F1A17] border-[#E6DEC8] hover:border-[#C59B27]'
                  }`}
                >
                  <p className="text-xs font-bold">Cash on Delivery (COD)</p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      paymentMode === 'COD'
                        ? 'text-[#FDFBF7]/80'
                        : 'text-[#635850]'
                    }`}
                  >
                    Pay upon doorstep delivery
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('UPI')}
                  className={`p-3 text-left rounded-md border transition-colors ${
                    paymentMode === 'UPI'
                      ? 'bg-[#5C162E] text-[#FDFBF7] border-[#5C162E]'
                      : 'bg-white text-[#1F1A17] border-[#E6DEC8] hover:border-[#C59B27]'
                  }`}
                >
                  <p className="text-xs font-bold">UPI (GPay / PhonePe)</p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      paymentMode === 'UPI'
                        ? 'text-[#FDFBF7]/80'
                        : 'text-[#635850]'
                    }`}
                  >
                    Priority dispatch confirmation
                  </p>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#E6DEC8]">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#635850]">
                <ShieldCheck className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                <span>Direct Factory Guarantee</span>
              </span>
              <button
                type="submit"
                className="px-6 py-3 bg-[#5C162E] hover:bg-[#430F21] text-[#FDFBF7] text-sm font-semibold rounded-md transition-colors"
              >
                Place Order · {formatINR(total)}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
