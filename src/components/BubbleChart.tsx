
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
    const MAX_SIZE = 120; // Maximum bubble size (reduced slightly)
    const containerHeight = 450; // Increased container height
    const containerWidth = 350;  // Container width
    const padding = 20;         // Padding from edges
    
    // First, determine sizes based on percentages
    let processedItems = itemsWithSubcategories.map(item => {
      // Extract numeric value from percentage
      const percentValue = parseInt(item.percentage);
      // Calculate size proportionally to percentage value
      const size = Math.min(MAX_SIZE, Math.max(MIN_SIZE, 70 + percentValue * 1.2));
      
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

    // Define positions based on fixed patterns
    const positionBubbles = () => {
      if (processedItems.length === 0) return;
      
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      
      // For a single bubble, center it
      if (processedItems.length === 1) {
        const item = processedItems[0];
        const size = item.bubbleSize as number;
        item.position = {
          x: centerX - size / 2,
          y: centerY - size / 2
        };
        return;
      }
      
      // Position the largest bubble in the center
      const largestBubble = processedItems[0];
      const largestSize = largestBubble.bubbleSize as number;
      largestBubble.position = {
        x: centerX - largestSize / 2,
        y: centerY - largestSize / 2
      };
      
      // For remaining bubbles, position them around the center bubble without overlaps
      // Different arrangements based on number of bubbles
      if (processedItems.length > 1) {
        // For exactly 5 bubbles (our current case), use a specific arrangement
        if (processedItems.length === 5) {
          // Technology (largest) is already in the center
          
          // Consumer Goods - top right
          const consumerGoods = processedItems[1];
          const cgSize = consumerGoods.bubbleSize as number;
          consumerGoods.position = {
            x: centerX + 20,
            y: centerY - cgSize - 20
          };
          
          // Healthcare - bottom left
          const healthcare = processedItems[2];
          const hcSize = healthcare.bubbleSize as number;
          healthcare.position = {
            x: centerX - hcSize - 20,
            y: centerY + 30
          };
          
          // Infrastructure - bottom right
          const infrastructure = processedItems[3];
          const infSize = infrastructure.bubbleSize as number;
          infrastructure.position = {
            x: centerX + 40,
            y: centerY + 60
          };
          
          // Sustainability - top left
          const sustainability = processedItems[4];
          const susSize = sustainability.bubbleSize as number;
          sustainability.position = {
            x: centerX - susSize - 20,
            y: centerY - susSize - 20
          };
        } else {
          // For different numbers of bubbles, distribute them evenly in a circle
          const startAngle = Math.PI / 4; // Start from 45 degrees
          const totalItems = processedItems.length - 1; // Excluding the centered bubble
          
          for (let i = 1; i < processedItems.length; i++) {
            const item = processedItems[i];
            const size = item.bubbleSize as number;
            const angle = startAngle + ((i - 1) * (2 * Math.PI / totalItems));
            
            // Distance from center should be enough to prevent overlaps
            // Base radius on the size of the largest bubble plus current bubble
            const radius = (largestSize / 2) + (size / 2) + 20; // 20px buffer
            
            const x = centerX + radius * Math.cos(angle) - (size / 2);
            const y = centerY + radius * Math.sin(angle) - (size / 2);
            
            // Ensure the bubble stays within container bounds
            item.position = {
              x: Math.max(padding, Math.min(containerWidth - size - padding, x)),
              y: Math.max(padding, Math.min(containerHeight - size - padding, y))
            };
          }
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
    <div className="relative h-[450px] w-full">
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
