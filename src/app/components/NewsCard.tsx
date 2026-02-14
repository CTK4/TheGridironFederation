import { ChevronRight } from 'lucide-react';
import { NewsItem } from '../data/mock-data';

interface NewsCardProps {
  news: NewsItem;
  onCtaClick?: () => void;
}

export function NewsCard({ news, onCtaClick }: NewsCardProps) {
  return (
    <div 
      className="p-4 flex flex-col gap-3 rounded-2xl"
      style={{ 
        backgroundColor: 'rgba(28, 28, 30, 1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[15px] font-semibold text-white leading-snug">
          {news.headline}
        </h3>
        <div 
          className="text-[11px] font-medium"
          style={{ color: 'rgba(235, 235, 245, 0.6)' }}
        >
          {news.timestamp}
        </div>
      </div>

      <p 
        className="text-[13px] leading-relaxed"
        style={{ color: 'rgba(235, 235, 245, 0.8)' }}
      >
        {news.description}
      </p>

      {news.cta && (
        <button
          onClick={onCtaClick}
          className="flex items-center justify-between px-4 py-2.5 rounded-xl transition-all active:opacity-60"
          style={{ 
            backgroundColor: 'rgba(255, 107, 0, 1)',
          }}
        >
          <span className="text-sm font-semibold text-white">
            {news.cta}
          </span>
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      )}
    </div>
  );
}