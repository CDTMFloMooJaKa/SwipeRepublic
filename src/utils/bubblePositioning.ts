
import { Category } from "@/components/BubbleChart";

export interface ProcessedBubble {
  name: string;
  percentage: string;
  color: string;
  size: number;
  position: {x: number, y: number};
}

// Convert percentage string to decimal value (0-1)
export const percentToDecimal = (percentStr: string): number => {
  return parseFloat(percentStr.replace('%', '')) / 100;
};

// Calculate bubble size based on percentage
export const calculateBubbleSize = (
  percentValue: number, 
  minSize: number, 
  maxSize: number
): number => {
  return Math.max(minSize, Math.min(maxSize, minSize + (percentValue * 300)));
};

// Check collision between two bubbles
export const checkCollision = (bubble1: ProcessedBubble, bubble2: ProcessedBubble): boolean => {
  const dx = bubble1.position.x + (bubble1.size / 2) - (bubble2.position.x + (bubble2.size / 2));
  const dy = bubble1.position.y + (bubble1.size / 2) - (bubble2.position.y + (bubble2.size / 2));
  const distance = Math.sqrt(dx * dx + dy * dy);
  const minDistance = (bubble1.size + bubble2.size) / 2 + 8; // Add 8px buffer
  
  return distance < minDistance;
};

// Process and position bubbles
export const positionBubbles = (
  itemsToProcess: Category[], 
  isChildBubbles: boolean
): ProcessedBubble[] => {
  // Container dimensions - reduced height to move bubbles up
  const containerWidth = 350;
  const containerHeight = 400; // Reduced from 500 to 400
  const padding = 30; // Padding from edges
  
  // For child bubbles, use more central positioning
  const verticalOffset = isChildBubbles ? 80 : 0;
  
  // Bubble size constraints
  const MIN_SIZE = 70;
  const MAX_SIZE = 120;
  
  // Step 1: Calculate initial sizes based on percentages
  const initialBubbles = itemsToProcess.map(item => {
    const percentValue = percentToDecimal(item.percentage);
    // Calculate size proportionally
    const size = calculateBubbleSize(percentValue, MIN_SIZE, MAX_SIZE);
    
    return {
      name: item.name,
      percentage: item.percentage,
      color: item.color,
      size,
      position: { x: 0, y: 0 } // Will be calculated later
    };
  });
  
  // Sort bubbles by size (largest first)
  initialBubbles.sort((a, b) => b.size - a.size);
  
  // Step 2: Place bubbles with collision detection
  const placedBubbles: ProcessedBubble[] = [];
  
  // Place the first (largest) bubble in the center
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
    const centerY = containerHeight / 2 - verticalOffset;
    
    // Try to place in spiral pattern
    let placed = false;
    let angle = 0;
    let radius = 80; // Starting distance from center
    let attempts = 0;
    const maxAttempts = 500;
    const angleIncrement = Math.PI / 12;
    
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
            
            minDistance = Math.min(minDistance, distance - collisionDistance);
          }
          
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
  
  return placedBubbles;
};
