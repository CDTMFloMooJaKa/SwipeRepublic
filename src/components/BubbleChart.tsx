
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
  onCategoryClick: (index: number, e: React.MouseEvent) => void;
}

const BubbleChart: React.FC<BubbleChartProps> = ({ 
  categories,
  activeCategory,
  onCategoryClick
}) => {
  const [bubbles, setBubbles] = useState<ProcessedBubble[]>([]);
  const [key, setKey] = useState(Date.now());
  
  // When activeCategory changes, reset the key to force re-rendering with new positions
  useEffect(() => {
    setKey(Date.now());
  }, [activeCategory]);
  
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
  }, [categories, activeCategory, key]);

  return (
    <div className="h-full relative" onClick={(e) => e.stopPropagation()}>
      <BubbleDisplay 
        bubbles={bubbles} 
        onCategoryClick={onCategoryClick} 
        activeCategory={activeCategory}
        key={key} // Force re-render of bubbles when category changes
      />
    </div>
  );
};

export default BubbleChart;
