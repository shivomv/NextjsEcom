'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageWithFallback from './ImageWithFallback';

export default function HeroSlider({ slides = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use the provided slides
  const displaySlides = slides;

  // Auto-rotate slides - always declare the hook even if we don't use it
  useEffect(() => {
    // Only set up the interval if we have slides
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  // If no slides are provided, don't show the slider
  if (slides.length === 0) {
    return null;
  }

  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-800/80 z-10"></div>

      {/* Slider container */}
      <div className="relative h-[30vh] sm:h-[35vh] md:h-[60vh] min-h-[200px] sm:min-h-[250px] md:min-h-[400px] max-h-[600px] w-full">
        {/* Slides */}
        {displaySlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ImageWithFallback
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === currentSlide}
              className="object-cover"
            />

            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-white mb-4 sm:mb-8 max-w-2xl drop-shadow-md">
                {slide.subtitle}
              </p>
              <Link
                href={slide.buttonLink}
                className="bg-gradient-purple-pink hover:opacity-90 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}

        {/* Navigation arrows - only show if more than one slide */}
        {displaySlides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Slide indicators - only show if more than one slide */}
        {displaySlides.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center space-x-2">
            {displaySlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
