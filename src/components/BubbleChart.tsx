
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
    const MAX_SIZE = 140; // Maximum bubble size to prevent very large bubbles
    const containerHeight = 350; // Increased container height to give more room
    const containerWidth = 300;
    const padding = 30; // Increased padding from container edges
    
    // First, determine sizes based on percentages
    let processedItems = items.map((item, index) => {
      // Extract numeric value from percentage
      const percentValue = parseInt(item.percentage);
      // Calculate size proportional to percentage, but within min and max bounds
      const size = Math.min(MAX_SIZE, Math.max(MIN_SIZE, 80 + percentValue * 1.5));
      
      return {
        ...item,
        bubbleSize: size,
        position: { x: 0, y: 0 }, // Will be calculated later
      };
    });
    
    // Now calculate positions to avoid overlap
    if (processedItems.length <= 1) {
      // For a single item, center it
      if (processedItems.length === 1) {
        const item = processedItems[0];
        const size = item.bubbleSize as number;
        processedItems[0].position = {
          x: containerWidth / 2 - size / 2,
          y: containerHeight / 2 - size / 2
        };
      }
    } else {
      // For multiple items, distribute them more evenly
      const totalItems = processedItems.length;
      const availableWidth = containerWidth - 2 * padding;
      const availableHeight = containerHeight - 2 * padding;
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      
      // Sort items by size (largest first) for better distribution
      processedItems.sort((a, b) => 
        (b.bubbleSize as number) - (a.bubbleSize as number)
      );
      
      // Function to check if a position would cause overlap
      const wouldOverlap = (x: number, y: number, size: number, index: number) => {
        for (let i = 0; i < index; i++) {
          const other = processedItems[i];
          const otherX = other.position!.x;
          const otherY = other.position!.y;
          const otherSize = other.bubbleSize as number;
          
          // Calculate distance between centers
          const dx = x + size/2 - (otherX + otherSize/2);
          const dy = y + size/2 - (otherY + otherSize/2);
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // If distance is less than sum of radii plus a small buffer, there's overlap
          if (distance < (size + otherSize) / 2 + 10) {
            return true;
          }
        }
        
        // Check if bubble would be cut off by container edges
        if (x < padding || y < padding || 
            x + size > containerWidth - padding || 
            y + size > containerHeight - padding) {
          return true;
        }
        
        return false;
      };
      
      // Place first bubble in center
      const firstItem = processedItems[0];
      const firstSize = firstItem.bubbleSize as number;
      firstItem.position = {
        x: centerX - firstSize / 2,
        y: centerY - firstSize / 2
      };
      
      // For remaining bubbles, use a more aggressive spiral algorithm
      for (let i = 1; i < processedItems.length; i++) {
        const item = processedItems[i];
        const size = item.bubbleSize as number;
        
        // Start with a smaller angle and radius step for more positions
        let angle = 0;
        let radius = 20;
        let spiralStep = Math.PI / 8; // Smaller step for more positions to try
        let radiusIncrement = 5;
        let foundPosition = false;
        let iterations = 0;
        const maxIterations = 500; // Prevent infinite loops
        
        // Spiral out until we find a good position
        while (!foundPosition && iterations < maxIterations) {
          iterations++;
          
          // Try this position
          const x = centerX - size / 2 + radius * Math.cos(angle);
          const y = centerY - size / 2 + radius * Math.sin(angle);
          
          if (!wouldOverlap(x, y, size, i)) {
            item.position = { x, y };
            foundPosition = true;
            break;
          }
          
          // Increment angle and occasionally increase radius
          angle += spiralStep;
          if (angle >= Math.PI * 2) {
            angle = 0;
            radius += radiusIncrement;
            // Slightly reduce the spiral step to get more positions at larger radii
            spiralStep = Math.max(spiralStep * 0.95, Math.PI / 16);
          }
        }
        
        // If we couldn't find a position, place it somewhere with minimum overlap
        if (!foundPosition) {
          // As a last resort, place it at a random position with some distance from center
          const randomAngle = Math.random() * Math.PI * 2;
          const randomRadius = 50 + Math.random() * 100;
          item.position = {
            x: Math.max(padding, Math.min(containerWidth - size - padding, 
               centerX - size / 2 + randomRadius * Math.cos(randomAngle))),
            y: Math.max(padding, Math.min(containerHeight - size - padding, 
               centerY - size / 2 + randomRadius * Math.sin(randomAngle)))
          };
        }
      }
    }
    
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
    <div className="relative h-[350px] w-full">
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
