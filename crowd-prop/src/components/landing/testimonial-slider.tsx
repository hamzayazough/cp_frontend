'use client';

import { TESTIMONIALS } from '@/app/const/landing-page';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const testimonials = TESTIMONIALS;

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied advertisers and promoters who are growing their business with Crowd Prop
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className={`w-20 h-20 ${testimonials[currentIndex].bgColor} rounded-full flex items-center justify-center text-white text-2xl font-semibold`}>
                    {testimonials[currentIndex].avatar}
                  </div>
                </div>
                
                <div className="text-center lg:text-left">
                  <blockquote className="text-xl lg:text-2xl text-gray-900 mb-6 leading-relaxed">
                    &ldquo;{testimonials[currentIndex].content}&rdquo;
                  </blockquote>
                  
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-blue-600 font-medium">
                      {testimonials[currentIndex].role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
