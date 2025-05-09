
import React, { useEffect, useState } from 'react';
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

interface ProcessedBubble {
  name: string;
  percentage: string;
  color: string;
  size: number;
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
  const [bubbles, setBubbles] = useState<ProcessedBubble[]>([]);
  
  // Map percentage string to a number between 0 and 1
  const percentToDecimal = (percentStr: string): number => {
    // Remove % sign and convert to number
    return parseFloat(percentStr.replace('%', '')) / 100;
  };
  
  useEffect(() => {
    console.log("Active Category:", activeCategory);
    
    // Determine what data we're working with
    const itemsToProcess = activeCategory === null 
      ? categories 
      : categories[activeCategory]?.subcategories.map(sub => ({
          name: sub.name,
          percentage: sub.percentage,
          color: categories[activeCategory].color,
          subcategories: []
        })) || [];
    
    console.log("Items to process:", itemsToProcess);
    
    // Container dimensions
    const containerWidth = 350;
    const containerHeight = 500; // Increased height
    const padding = 30; // Padding from edges

    // For child bubbles, use more central positioning
    const verticalOffset = activeCategory !== null ? 80 : 0; // Lift the child bubbles higher by 80px
    
    // Bubble size constraints
    const MIN_SIZE = activeCategory === null ? 70 : 50;  // Smaller minimum size for subcategories
    const MAX_SIZE = activeCategory === null ? 120 : 100; // Smaller maximum size for subcategories
    
    // Step 1: Calculate initial sizes based on percentages
    const initialBubbles = itemsToProcess.map(item => {
      const percentValue = percentToDecimal(item.percentage);
      console.log(`Item: ${item.name}, Percentage: ${item.percentage}, Decimal: ${percentValue}`);
      
      // Calculate size proportionally, ensuring it's between MIN_SIZE and MAX_SIZE
      const size = Math.max(MIN_SIZE, Math.min(MAX_SIZE, MIN_SIZE + (percentValue * 300)));
      console.log(`Calculated size for ${item.name}: ${size}`);
      
      return {
        name: item.name,
        percentage: item.percentage,
        color: item.color,
        size,
        position: { x: 0, y: 0 } // Will be calculated later
      };
    });
    
    console.log("Initial bubbles with sizes:", initialBubbles);
    
    // Sort bubbles by size (largest first)
    initialBubbles.sort((a, b) => b.size - a.size);
    console.log("Sorted bubbles:", initialBubbles);
    
    // Step 2: Place bubbles with collision detection
    const placedBubbles: ProcessedBubble[] = [];
    
    const checkCollision = (bubble1: ProcessedBubble, bubble2: ProcessedBubble): boolean => {
      const dx = bubble1.position.x + (bubble1.size / 2) - (bubble2.position.x + (bubble2.size / 2));
      const dy = bubble1.position.y + (bubble1.size / 2) - (bubble2.position.y + (bubble2.size / 2));
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = (bubble1.size + bubble2.size) / 2 + 8; // Add 8px buffer
      
      return distance < minDistance;
    };
    
    // Place the first (largest) bubble in the center, adjusted by vertical offset for child bubbles
    if (initialBubbles.length > 0) {
      const firstBubble = initialBubbles[0];
      firstBubble.position = {
        x: (containerWidth - firstBubble.size) / 2,
        y: (containerHeight - firstBubble.size) / 2 - verticalOffset
      };
      placedBubbles.push(firstBubble);
    }
    
    // Place remaining bubbles
    for (let i = 1; i < initialBubbles.length; i++) {
      const currentBubble = initialBubbles[i];
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2 - verticalOffset; // Apply vertical offset
      
      // Try to place in spiral pattern
      let placed = false;
      let angle = 0;
      let radius = 80; // Starting distance from center
      let attempts = 0;
      const maxAttempts = 500;
      const angleIncrement = Math.PI / 12; // Smaller angle increments for better placement
      
      while (!placed && attempts < maxAttempts) {
        // Calculate position on the spiral
        const x = centerX - currentBubble.size / 2 + radius * Math.cos(angle);
        const y = centerY - currentBubble.size / 2 + radius * Math.sin(angle);
        
        // Check if position is within bounds
        if (
          x >= padding && 
          x + currentBubble.size <= containerWidth - padding &&
          y >= padding && 
          y + currentBubble.size <= containerHeight - padding
        ) {
          // Test position
          currentBubble.position = { x, y };
          
          // Check for collisions with already placed bubbles
          let hasCollision = false;
          for (const placedBubble of placedBubbles) {
            if (checkCollision(currentBubble, placedBubble)) {
              hasCollision = true;
              break;
            }
          }
          
          if (!hasCollision) {
            placed = true;
            placedBubbles.push(currentBubble);
          }
        }
        
        // Move along the spiral
        angle += angleIncrement;
        if (angle >= 2 * Math.PI) {
          angle = 0;
          radius += 10; // Increase radius after a full circle
        }
        
        attempts++;
      }
      
      // If we couldn't place the bubble, try a different strategy
      if (!placed) {
        // Find the most space between existing bubbles
        let bestX = padding;
        let bestY = padding;
        let maxMinDistance = 0;
        
        // Try a grid of positions
        for (let testX = padding; testX <= containerWidth - padding - currentBubble.size; testX += 20) {
          for (let testY = padding; testY <= containerHeight - padding - currentBubble.size; testY += 20) {
            let minDistance = Number.MAX_VALUE;
            
            // Calculate minimum distance to any placed bubble
            for (const placedBubble of placedBubbles) {
              const testBubble = {
                ...currentBubble,
                position: { x: testX, y: testY }
              };
              
              const dx = testBubble.position.x + (testBubble.size / 2) - (placedBubble.position.x + (placedBubble.size / 2));
              const dy = testBubble.position.y + (testBubble.size / 2) - (placedBubble.position.y + (placedBubble.size / 2));
              const distance = Math.sqrt(dx * dx + dy * dy);
              const collisionDistance = (testBubble.size + placedBubble.size) / 2 + 8;
              
              // Calculate how far we are from collision (negative means collision)
              minDistance = Math.min(minDistance, distance - collisionDistance);
            }
            
            // If this position is better than our best so far and doesn't collide
            if (minDistance > maxMinDistance && minDistance >= 0) {
              maxMinDistance = minDistance;
              bestX = testX;
              bestY = testY;
            }
          }
        }
        
        // Use the best position we found
        currentBubble.position = { x: bestX, y: bestY };
        placedBubbles.push(currentBubble);
      }
    }
    
    console.log("Final placed bubbles:", placedBubbles);
    
    // Update state with placed bubbles
    setBubbles(placedBubbles);
  }, [categories, activeCategory]);

  return (
    <div className="relative h-[500px] w-full">
      <AnimatePresence>
        {bubbles.map((bubble, index) => (
          <Bubble
            key={`${bubble.name}-${index}`}
            name={bubble.name}
            percentage={bubble.percentage}
            color={bubble.color}
            size={bubble.size}
            onClick={activeCategory === null ? () => onCategoryClick(index) : undefined}
            position={bubble.position}
            isChild={activeCategory !== null}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BubbleChart;
