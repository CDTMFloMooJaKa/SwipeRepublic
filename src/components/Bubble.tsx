
import React from 'react';
import { motion } from "framer-motion";

export interface BubbleProps {
  name: string;
  percentage: string;
  color: string;
  size: number;
  onClick?: (e: React.MouseEvent) => void;
  position?: {x: number, y: number};
  isChild?: boolean;
}

// Bubble component for visualization
const Bubble: React.FC<BubbleProps> = ({ 
  name, 
  percentage, 
  color,
  size,
  onClick,
  position,
  isChild = false
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.div 
      className="absolute rounded-full flex flex-col items-center justify-center text-center cursor-pointer shadow-lg"
      style={{ 
        backgroundColor: color,
        width: size,
        height: size,
        left: position?.x,
        top: position?.y,
      }}
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.3,
        delay: isChild ? 0.1 : 0
      }}
      whileHover={{ scale: 1.05 }}
    >
      <span className="text-lg font-bold">{percentage}</span>
      <span className="text-xs px-2 line-clamp-2">{name}</span>
    </motion.div>
  );
};

export default Bubble;
