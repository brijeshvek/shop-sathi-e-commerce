"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Verified Buyer",
    content: "Absolutely love the fast shipping! I ordered a new smartphone and it arrived the very next day in perfect condition. Will definitely shop here again.",
    rating: 5,
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Premium Member",
    content: "The product quality is top-notch. Customer service was also very helpful when I needed to exchange a pair of shoes for a different size. Seamless experience.",
    rating: 5,
    avatar: "MC"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Verified Buyer",
    content: "I've been using Shop Shathi for all my household needs. Their deals are unbeatable and the app is so easy to navigate. Highly recommended!",
    rating: 4,
    avatar: "ER"
  }
];

export function Testimonials() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900/50" aria-label="Customer Testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold font-heading text-gray-900 dark:text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base dark:text-gray-100">
            Don't just take our word for it. Here is what real shoppers have to say about their experience with Shop Shathi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary-100 dark:text-primary-900/30 rotate-180" aria-hidden="true" />

              <div className="flex text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm sm:text-base italic relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center font-bold text-primary-700 dark:text-primary-300">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-black text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
