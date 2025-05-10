
import { useState, useEffect } from 'react';
import { Category } from '@/components/BubbleChart';

export function useBubbleChart(categories: Category[], isOpen: boolean) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  
  // Reset the active category when the component is closed
  useEffect(() => {
    if (!isOpen) {
      setActiveCategory(null);
    }
  }, [isOpen]);
  
  // Handle click on a category bubble
  const handleCategoryClick = (index: number, e: React.MouseEvent) => {
    // Stop event propagation to prevent slide change in carousel
    e.stopPropagation();
    setActiveCategory(index);
  };
  
  // Handle going back to main categories
  const handleBackToCategories = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCategory(null);
  };
  
  return {
    activeCategory,
    setActiveCategory,
    handleCategoryClick,
    handleBackToCategories
  };
}
