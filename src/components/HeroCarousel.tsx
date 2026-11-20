import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES, HeroSlide } from '../data/categories';
import { ResilientImage } from './ResilientImage';

interface HeroCarouselProps {
  onSelectSlideAction: (slide: HeroSlide) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onSelectSlideAction,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const slide = HERO_SLIDES[activeIndex];

  return (
    <section
      aria-label="Featured Collections Carousel"
      className="relative w-full overflow-hidden bg-[#1F1A17]"
    >
      <div className="relative h-[420px] sm:h-[500px] lg:h-[560px] w-full">
        <ResilientImage
          src={slide.imageUrl}
          alt={slide.title}
          className="w-full h-full object-cover object-center transition-opacity duration-500"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#1F1A17]/90 via-[#1F1A17]/60 to-[#1F1A17]/20"
        />

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-xl text-[#FDFBF7] space-y-4 sm:space-y-5">
            <p className="text-xs sm:text-sm font-medium tracking-wider text-[#E6C567]">
              {slide.eyebrow}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
              {slide.title}
            </h1>
            <p className="text-sm sm:text-base text-[#F6F1E7]/90 leading-relaxed max-w-lg">
              {slide.subtitle}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectSlideAction(slide)}
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#C59B27] hover:bg-[#D4AD3B] text-[#1F1A17] text-sm font-semibold rounded-md transition-colors shadow-lg whitespace-nowrap"
              >
                <span>{slide.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next Controls */}
        <div className="hidden sm:flex items-center gap-2 absolute right-6 bottom-6 z-10">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous hero slide"
            className="w-10 h-10 flex items-center justify-center rounded-md bg-[#1F1A17]/70 hover:bg-[#5C162E] text-[#FDFBF7] border border-[#FDFBF7]/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next hero slide"
            className="w-10 h-10 flex items-center justify-center rounded-md bg-[#1F1A17]/70 hover:bg-[#5C162E] text-[#FDFBF7] border border-[#FDFBF7]/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div
          className="absolute left-4 sm:left-8 lg:left-[max(2rem,calc((100%-80rem)/2+2rem))] bottom-6 flex items-center gap-2 z-10"
          role="tablist"
          aria-label="Hero slides"
        >
          {HERO_SLIDES.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Show slide ${idx + 1}: ${item.title}`}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === activeIndex
                  ? 'w-8 bg-[#C59B27]'
                  : 'w-2.5 bg-[#FDFBF7]/50 hover:bg-[#FDFBF7]/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
