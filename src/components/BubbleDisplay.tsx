
import React from 'react';
import { AnimatePresence } from "framer-motion";
import Bubble from './Bubble';
import { ProcessedBubble } from '@/utils/bubblePositioning';

interface BubbleDisplayProps {
  bubbles: ProcessedBubble[];
  onCategoryClick?: (index: number) => void;
  activeCategory: number | null;
}

const BubbleDisplay: React.FC<BubbleDisplayProps> = ({ 
  bubbles, 
  onCategoryClick,
  activeCategory 
}) => {
  return (
    <div className="relative h-[400px] w-full">
      <AnimatePresence>
        {bubbles.map((bubble, index) => (
          <Bubble
            key={`${bubble.name}-${index}`}
            name={bubble.name}
            percentage={bubble.percentage}
            color={bubble.color}
            size={bubble.size}
            onClick={activeCategory === null ? () => onCategoryClick?.(index) : undefined}
            position={bubble.position}
            isChild={activeCategory !== null}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BubbleDisplay;
