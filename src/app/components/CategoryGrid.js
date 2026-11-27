"use client";

import OptimizedImage from './ui/OptimizedImage';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const CategoryGrid = ({ categories: initialCategories = null }) => {
  const [categories, setCategories] = useState(initialCategories || []);
  const [loading, setLoading] = useState(!initialCategories);

  useEffect(() => {
    if (initialCategories) {
      setCategories(initialCategories);
      setLoading(false);
      return;
    }
    fetchCategories();
  }, [initialCategories]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        const activeCategories = data
          .filter((cat) => cat.status === 'Active' && cat.sortOrder >= 1 && cat.sortOrder <= 8)
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        setCategories(activeCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-6 md:py-12 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-12 bg-white">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/${cat.slug}`}
              style={{
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              }}
              className="group block bg-white hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {cat.image ? (
                  <OptimizedImage
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizePreset="category"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    quality={70}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
              </div>
              <div className="py-3 px-2 bg-white">
                <h3 className="text-center text-xs sm:text-[13px] font-medium uppercase tracking-wider text-gray-800 group-hover:text-black line-clamp-1">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;