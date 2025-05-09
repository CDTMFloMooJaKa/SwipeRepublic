
import React from 'react';
import { AnimatePresence } from "framer-motion";
import Bubble from './Bubble';

export interface Category {
  name: string;
  percentage: string;
  color: string;
  subcategories: { name: string; percentage: string; }[];
  bubbleSize?: number;
  position?: {x: number, y: number};
}

interface ProcessedSubcategory {
  name: string;
  percentage: string;
  color: string;
  bubbleSize: number;
  position: {x: number, y: number};
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
  // Calculate bubble sizes and positions based on percentages
  const calculateBubbleSizes = (items: Category[] | { name: string; percentage: string; color: string }[]) => {
    const MIN_SIZE = 80; // Minimum bubble size
    const baseSize = 120;
    const containerHeight = 300;
    const containerWidth = 300;
    
    return items.map((item, index) => {
      // Extract numeric value from percentage
      const percentValue = parseInt(item.percentage);
      // Calculate size proportional to percentage, but not smaller than minimum
      const size = Math.max(MIN_SIZE, baseSize * (percentValue / 30));
      
      // Calculate positions in a circular pattern
      // For main categories, arrange in a circular pattern
      let x, y;
      
      // Arrange bubbles in a somewhat circular pattern
      if (items.length <= 2) {
        // For 1-2 items, center them
        x = containerWidth / 2 - size / 2;
        y = containerHeight / 2 - size / 2;
        if (items.length === 2 && index === 1) {
          x = containerWidth / 2 - size / 2;
          y = containerHeight / 2 + 20;
        }
      } else {
        // For 3+ items, arrange in a circular pattern
        const angle = (2 * Math.PI * index) / items.length;
        const radius = containerWidth / 3; // Distance from center
        
        x = containerWidth / 2 - size / 2 + radius * Math.cos(angle);
        y = containerHeight / 2 - size / 2 + radius * Math.sin(angle);
      }
      
      return {
        ...item,
        bubbleSize: size,
        position: {x, y},
      };
    });
  };

  // Calculate bubble data
  const bubbleData = activeCategory === null 
    ? calculateBubbleSizes(categories)
    : calculateBubbleSizes(
        categories[activeCategory].subcategories.map(sub => ({
          ...sub,
          color: categories[activeCategory].color
        }))
      );

  return (
    <div className="relative h-[350px] w-full">
      <AnimatePresence>
        {bubbleData.map((bubble, index) => (
          <Bubble
            key={`${bubble.name}-${index}`}
            name={bubble.name}
            percentage={bubble.percentage}
            color={bubble.color}
            size={bubble.bubbleSize as number}
            onClick={activeCategory === null 
              ? () => onCategoryClick(index)
              : undefined
            }
            position={bubble.position}
            isChild={activeCategory !== null}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BubbleChart;
