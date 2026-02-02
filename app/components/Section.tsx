import { ReactNode } from 'react';

type SectionVariant = 'default' | 'alt' | 'highlighted';

interface SectionProps {
  children: ReactNode;
  variant?: SectionVariant;
  className?: string;
}

const variantStyles: Record<SectionVariant, string> = {
  default: '',
  alt: 'bg-gray-100 dark:bg-gray-900 p-4',
  highlighted: 'bg-indigo-50 dark:bg-indigo-950 p-4',
};

export default function Section({ 
  children, 
  variant = 'default', 
  className = '' 
}: SectionProps) {
  const baseStyles = variantStyles[variant];
  const combinedStyles = `${baseStyles} ${className}`.trim();

  return (
    <section className={combinedStyles}>
      <div className="container mx-auto py-8">
        {children}
      </div>
    </section>
  );
}