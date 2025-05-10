
import React from 'react';
import { AnimatePresence } from "framer-motion";
import Bubble from './Bubble';
import { ProcessedBubble } from '@/utils/bubblePositioning';

interface BubbleDisplayProps {
  bubbles: ProcessedBubble[];
  onCategoryClick?: (index: number, e: React.MouseEvent) => void;
  activeCategory: number | null;
}

const BubbleDisplay: React.FC<BubbleDisplayProps> = ({ 
  bubbles, 
  onCategoryClick,
  activeCategory 
}) => {
  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="wait">
        {bubbles.map((bubble, index) => (
          <Bubble
            key={`${bubble.name}-${index}-${activeCategory !== null ? 'child' : 'parent'}`}
            name={bubble.name}
            percentage={bubble.percentage}
            color={bubble.color}
            size={bubble.size}
            onClick={(e) => onCategoryClick?.(index, e)}
            position={bubble.position}
            isChild={activeCategory !== null}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BubbleDisplay;
