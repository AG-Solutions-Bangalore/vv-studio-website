import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { BlogItem } from '@/data/salonData';
import { BLOG_SEO, BLOG_DIMS } from '@/data/salonData';

interface BlogCardProps {
  blog: BlogItem;
  /** Article detail path — defaults to `/blog` (grid). */
  detailPath?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, detailPath = '/blog' }) => {
  const imageSeo = BLOG_SEO[blog.id] ?? { alt: blog.title, title: blog.title };
  const dims = BLOG_DIMS[blog.id];
  return (
    <article className="group flex flex-col h-full bg-white rounded-[14px] border border-[#F1E4EE] shadow-[0_2px_14px_rgba(90,20,80,0.08)] hover:shadow-[0_10px_28px_rgba(90,20,80,0.14)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Image — flush top, rounded via card overflow */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF0F6]">
        <img
          src={blog.image}
          alt={imageSeo.alt}
          title={imageSeo.title}
          width={dims?.width}
          height={dims?.height}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-[14px] sm:text-[15px] font-bold text-[#2D0A2E] leading-snug group-hover:text-[#A80086] transition-colors">
          {blog.title}
        </h3>

        <p className="mt-1 text-xs sm:text-[13px] text-[#7A6A77] leading-relaxed line-clamp-2">
          {blog.excerpt}
        </p>

        <Link
          to={detailPath}
          title={`${blog.title} — VV Studio Beauty & Wellness Blog`}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#D91A8A] group-hover:text-[#A80086] group-hover:translate-x-0.5 transition-all"
        >
          <span>Read More</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};
