import React from 'react';
import { MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { CatalogTab, CategoryName } from '../types/jewellery';

interface FooterProps {
  storeName: string;
  whatsappNumber: string;
  onSelectTab: (tab: CatalogTab) => void;
  onSelectSubcategory: (category: CategoryName, subcategory: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  storeName,
  whatsappNumber,
  onSelectTab,
  onSelectSubcategory,
}) => {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '') || '916305085353';
  const supportUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Namaskaram ${storeName}, I need assistance with a 1-gram gold jewellery order.`
  )}`;

  return (
    <footer className="bg-[#1F1A17] text-[#F6F1E7] border-t border-[#C59B27]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/Haridra_Lgo_b038aa37.jpg"
                alt={storeName}
                className="w-10 h-10 rounded-md object-cover border border-[#C59B27]/60 bg-white shrink-0"
              />
              <span className="font-serif text-lg font-bold text-[#FDFBF7] leading-snug">
                {storeName}
              </span>
            </div>
            <p className="text-sm text-[#D6CEC2] leading-relaxed">
              Authentic South Indian 1-gram micro gold covering, temple bridal sets, kemp necklaces, and daily wear imitation jewellery crafted at direct workshop prices.
            </p>
            <a
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#C59B27] hover:bg-[#D4AD3B] text-[#1F1A17] text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>WhatsApp Customer Support</span>
            </a>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="font-serif text-base font-semibold text-[#E6C567] mb-4">
              Popular Collections
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D6CEC2]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('BRIDAL')}
                  className="hover:text-[#E6C567] transition-colors"
                >
                  Total Bridal Sets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectSubcategory('WOMEN', 'Haram Sets')}
                  className="hover:text-[#E6C567] transition-colors"
                >
                  1-Gram Gold Haram Sets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onSelectSubcategory(
                      'WOMEN',
                      'Hip Belts(Vaddanam(Plain And Heavy Models)'
                    )
                  }
                  className="hover:text-[#E6C567] transition-colors"
                >
                  Bridal Vaddanam Hip Belts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectSubcategory('WOMEN', 'Black Beads')}
                  className="hover:text-[#E6C567] transition-colors"
                >
                  Black Beads &amp; Thali Chains
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('MEN')}
                  className="hover:text-[#E6C567] transition-colors"
                >
                  Men&apos;s Chains, Kadiyams &amp; Rings
                </button>
              </li>
            </ul>
          </div>

          {/* Shipping & Return Policy */}
          <div>
            <h3 className="font-serif text-base font-semibold text-[#E6C567] mb-4">
              Shipping &amp; Return Policy
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D6CEC2]">
              <li className="flex items-start gap-2">
                <ShieldCheck
                  className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>Free insured shipping on orders above ₹999 across India.</span>
              </li>
              <li>Cash on Delivery (COD) &amp; UPI accepted nationwide.</li>
              <li>Dispatch within 24–48 working hours in tamper-proof boxes.</li>
              <li>
                48-hour transit damage replacement with mandatory package opening video.
              </li>
            </ul>
          </div>

          {/* Store Contact */}
          <div>
            <h3 className="font-serif text-base font-semibold text-[#E6C567] mb-4">
              Showroom &amp; Workshop
            </h3>
            <ul className="space-y-3 text-sm text-[#D6CEC2]">
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  Besides Seshmahal Theater, Tadepalligudem, West Godavari Dist - 534101
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone
                  className="w-4 h-4 text-[#C59B27] shrink-0"
                  aria-hidden="true"
                />
                <span className="tabular-nums">+{cleanPhone}</span>
              </li>
              <li className="text-xs text-[#A89F91]">
                Mon – Sat: 10:00 AM to 8:30 PM IST
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#FDFBF7]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A89F91]">
          <p>
            &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <p>Authentic South Indian 1-Gram Micro Gold Covering</p>
        </div>
      </div>
    </footer>
  );
};
