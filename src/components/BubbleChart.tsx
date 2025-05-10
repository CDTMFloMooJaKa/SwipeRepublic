
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
  const [isInteracting, setIsInteracting] = useState(false);
  
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

  // Handle bubble click with proper event propagation control
  const handleBubbleClick = (index: number, e: React.MouseEvent) => {
    // Make sure the event doesn't propagate to parent elements
    e.stopPropagation();
    setIsInteracting(true);
    onCategoryClick(index, e);
  }

  // Handle container click to prevent event propagation
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only if we're already interacting, allow the event to continue
    if (isInteracting) {
      setIsInteracting(false);
    }
  }

  return (
    <div className="relative w-full h-full" onClick={handleContainerClick}>
      <BubbleDisplay 
        bubbles={bubbles} 
        onCategoryClick={handleBubbleClick} 
        activeCategory={activeCategory}
      />
    </div>
  );
};

export default BubbleChart;
