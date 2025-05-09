
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
  const calculateBubbleSizes = (items: Category[] | { name: string; percentage: string; color: string; subcategories?: { name: string; percentage: string; }[] }[]) => {
    // Make sure all items have subcategories property (even if empty array)
    const itemsWithSubcategories = items.map(item => {
      return {
        ...item,
        subcategories: item.subcategories || []
      };
    }) as Category[];
    
    const MIN_SIZE = 70; // Minimum bubble size
    const MAX_SIZE = 130; // Maximum bubble size
    const containerHeight = 420; // Increased container height for more spacing
    const containerWidth = 350;  // Increased width for more room
    const padding = 40;         // Padding from edges
    
    // First, determine sizes based on percentages
    let processedItems = itemsWithSubcategories.map(item => {
      // Extract numeric value from percentage
      const percentValue = parseInt(item.percentage);
      // Calculate size proportionally to percentage value
      const size = Math.min(MAX_SIZE, Math.max(MIN_SIZE, 70 + percentValue * 1.5));
      
      return {
        ...item,
        bubbleSize: size,
        position: { x: 0, y: 0 } // Will be calculated in the next step
      };
    });
    
    // Sort items by size (larger bubbles first)
    processedItems.sort((a, b) => 
      (b.bubbleSize as number) - (a.bubbleSize as number)
    );
    
    // Define positions based on a pre-defined pattern for better distribution
    const positionBubbles = () => {
      if (processedItems.length === 0) return;
      
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      
      // Place largest bubble in center if there's only one
      if (processedItems.length === 1) {
        const item = processedItems[0];
        const size = item.bubbleSize as number;
        item.position = {
          x: centerX - size / 2,
          y: centerY - size / 2
        };
        return;
      }
      
      // For multiple bubbles, use a custom arrangement strategy
      // First bubble (largest) goes slightly off-center
      const firstItem = processedItems[0];
      const firstSize = firstItem.bubbleSize as number;
      firstItem.position = {
        x: centerX - firstSize / 2 - 10,
        y: centerY - firstSize / 2 + 15
      };
      
      // Calculate positions for remaining bubbles
      const positions = [];
      
      // For 2 bubbles
      if (processedItems.length >= 2) {
        const item = processedItems[1];
        const size = item.bubbleSize as number;
        const pos = {
          x: centerX - size / 2 + 65,
          y: centerY - size / 2 - 40
        };
        positions.push(pos);
      }
      
      // For 3 bubbles
      if (processedItems.length >= 3) {
        const item = processedItems[2];
        const size = item.bubbleSize as number;
        const pos = {
          x: centerX - size / 2 - 70,
          y: centerY - size / 2 + 80
        };
        positions.push(pos);
      }
      
      // For 4 bubbles
      if (processedItems.length >= 4) {
        const item = processedItems[3];
        const size = item.bubbleSize as number;
        const pos = {
          x: centerX - size / 2 + 40,
          y: centerY - size / 2 + 90
        };
        positions.push(pos);
      }
      
      // For 5 bubbles
      if (processedItems.length >= 5) {
        const item = processedItems[4];
        const size = item.bubbleSize as number;
        const pos = {
          x: centerX - size / 2 - 50,
          y: centerY - size / 2 - 60
        };
        positions.push(pos);
      }
      
      // Apply calculated positions
      for (let i = 1; i < processedItems.length && i <= positions.length; i++) {
        processedItems[i].position = positions[i-1];
      }
      
      // For more than 5 bubbles (if needed), use a fallback positioning
      if (processedItems.length > 5) {
        for (let i = 5; i < processedItems.length; i++) {
          const item = processedItems[i];
          const size = item.bubbleSize as number;
          const angle = (i - 4) * (Math.PI * 2 / (processedItems.length - 4));
          const radius = 100; // Distance from center
          
          item.position = {
            x: Math.max(padding, Math.min(containerWidth - size - padding, 
               centerX - size / 2 + radius * Math.cos(angle))),
            y: Math.max(padding, Math.min(containerHeight - size - padding, 
               centerY - size / 2 + radius * Math.sin(angle)))
          };
        }
      }
      
      // Final check to ensure no bubbles go out of bounds
      for (const item of processedItems) {
        const size = item.bubbleSize as number;
        if (item.position) {
          item.position = {
            x: Math.max(padding, Math.min(containerWidth - size - padding, item.position.x)),
            y: Math.max(padding, Math.min(containerHeight - size - padding, item.position.y))
          };
        }
      }
    };
    
    positionBubbles();
    return processedItems;
  };

  // Calculate bubble data
  const bubbleData = activeCategory === null 
    ? calculateBubbleSizes(categories)
    : calculateBubbleSizes(
        categories[activeCategory].subcategories.map(sub => ({
          ...sub,
          color: categories[activeCategory].color,
          subcategories: [] // Add the required subcategories property
        }))
      );

  return (
    <div className="relative h-[420px] w-full">
      <AnimatePresence mode="wait">
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
