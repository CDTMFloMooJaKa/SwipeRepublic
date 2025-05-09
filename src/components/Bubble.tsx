
import React from 'react';
import { motion } from "framer-motion";

export interface BubbleProps {
  name: string;
  percentage: string;
  color: string;
  size: number;
  onClick?: () => void;
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
  return (
    <motion.div 
      className="absolute rounded-full flex flex-col items-center justify-center text-center cursor-pointer"
      style={{ 
        backgroundColor: color,
        width: size,
        height: size,
        left: position?.x,
        top: position?.y,
      }}
      onClick={onClick}
      initial={isChild ? { scale: 0, opacity: 0 } : { scale: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={isChild 
        ? { type: "spring", stiffness: 300, damping: 20 } 
        : { type: "spring", stiffness: 300, damping: 20, duration: 0.1 } // Quick exit for parents
      }
      whileHover={{ scale: 1.05 }}
    >
      <span className="text-lg font-bold">{percentage}</span>
      <span className="text-xs px-2">{name}</span>
    </motion.div>
  );
};

export default Bubble;
