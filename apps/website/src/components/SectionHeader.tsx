import React from 'react';
import { FadeIn } from '../animations/MotionPrims';

interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  subtitle: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  badge,
  badgeIcon,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div
      className={`max-w-3xl mb-12 sm:mb-16 ${
        isCenter ? 'mx-auto text-center' : 'text-left'
      } ${className}`}
    >
      {badge && (
        <FadeIn delay={0.05} direction="up">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 mb-4 ${
              isCenter ? 'justify-center' : ''
            }`}
          >
            {badgeIcon}
            <span>{badge}</span>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.1} direction="up">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">
          {title}
        </h2>
      </FadeIn>

      <FadeIn delay={0.15} direction="up">
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
          {subtitle}
        </p>
      </FadeIn>
    </div>
  );
}
