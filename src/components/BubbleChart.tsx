
import React, { useEffect, useState } from 'react';
import BubbleDisplay from './BubbleDisplay';
import { positionBubbles, ProcessedBubble } from '@/utils/bubblePositioning';

export interface Category {
  name: string;
  percentage: string;
  color: string;
  subcategories: { name: string; percentage: string; }[];
  bubbleSize?: number;
  position?: {x: number, y: number};
}

interface BubbleChartProps {
  categories: Category[];
  activeCategory: number | null;
  onCategoryClick: (index: number) => void;
}

const BubbleChart: React.FC<BubbleChartProps> = ({ 
  categories,
  activeCategory,
  onCategoryClick
}) => {
  const [bubbles, setBubbles] = useState<ProcessedBubble[]>([]);
  
  useEffect(() => {
    // Determine what data we're working with
    const itemsToProcess = activeCategory === null 
      ? categories 
      : categories[activeCategory]?.subcategories.map(sub => ({
          name: sub.name,
          percentage: sub.percentage,
          color: categories[activeCategory].color,
          subcategories: []
        })) || [];
    
    // Get positioned bubbles from our utility function
    const positionedBubbles = positionBubbles(itemsToProcess, activeCategory !== null);
    
    // Update state with placed bubbles
    setBubbles(positionedBubbles);
  }, [categories, activeCategory]);

  return (
    <BubbleDisplay 
      bubbles={bubbles} 
      onCategoryClick={onCategoryClick} 
      activeCategory={activeCategory}
    />
  );
};

export default BubbleChart;
