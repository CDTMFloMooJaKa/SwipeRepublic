
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
    const containerHeight = 300;
    const containerWidth = 300;
    const padding = 20; // Padding from container edges
    
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
      // For multiple items, use a spiral layout algorithm
      // This helps avoid overlap and ensures bubbles stay within container bounds
      const availableWidth = containerWidth - 2 * padding;
      const availableHeight = containerHeight - 2 * padding;
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      
      // Sort items by size (largest first) to place larger bubbles near center
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
          
          // If distance is less than sum of radii, there's overlap
          if (distance < (size + otherSize) / 2) {
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
      
      // Place each bubble
      processedItems.forEach((item, index) => {
        const size = item.bubbleSize as number;
        
        if (index === 0) {
          // Place the first (largest) bubble in the center
          item.position = {
            x: centerX - size / 2,
            y: centerY - size / 2
          };
        } else {
          // For subsequent bubbles, find a non-overlapping position
          // Start from the center and spiral outwards
          let angle = 0;
          let radius = 10;
          let x, y;
          let found = false;
          
          // Spiral out until we find a good position
          while (!found && radius < Math.max(containerWidth, containerHeight)) {
            // Try positions along the current radius
            for (let i = 0; i < 20; i++) { // Try multiple angles at each radius
              angle += Math.PI / 10; // Increment angle
              x = centerX - size / 2 + radius * Math.cos(angle);
              y = centerY - size / 2 + radius * Math.sin(angle);
              
              if (!wouldOverlap(x, y, size, index)) {
                item.position = { x, y };
                found = true;
                break;
              }
            }
            
            radius += 5; // Increase radius if no position found
          }
          
          // If still not found, place it somewhere even if there's overlap
          if (!found) {
            item.position = {
              x: Math.max(padding, Math.min(containerWidth - size - padding, centerX - size / 2 + Math.random() * 50 - 25)),
              y: Math.max(padding, Math.min(containerHeight - size - padding, centerY - size / 2 + Math.random() * 50 - 25))
            };
          }
        }
      });
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
