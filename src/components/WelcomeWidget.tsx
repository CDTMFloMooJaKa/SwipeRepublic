
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for investments with categories and subcategories
const investmentCategories = [
  {
    name: "Technology",
    percentage: "53%",
    color: "#f89c5e",
    subcategories: [
      { name: "Software", percentage: "50%" },
      { name: "Hardware", percentage: "30%" },
      { name: "Cloud Services", percentage: "20%" }
    ]
  },
  {
    name: "Consumer Goods",
    percentage: "22%",
    color: "#d9d9d9",
    subcategories: [
      { name: "Food & Beverage", percentage: "45%" },
      { name: "Clothing", percentage: "35%" },
      { name: "Electronics", percentage: "20%" }
    ]
  },
  {
    name: "Healthcare",
    percentage: "14%",
    color: "#b066f7",
    subcategories: [
      { name: "Pharmaceuticals", percentage: "40%" },
      { name: "Medical Devices", percentage: "35%" },
      { name: "Healthcare Services", percentage: "25%" }
    ]
  },
  {
    name: "Infrastructure",
    percentage: "6%",
    color: "#e8ed69",
    subcategories: [
      { name: "Transportation", percentage: "40%" },
      { name: "Energy", percentage: "35%" },
      { name: "Utilities", percentage: "25%" }
    ]
  },
  {
    name: "Sustainability",
    percentage: "5%",
    color: "#6dcff6",
    subcategories: [
      { name: "Renewable Energy", percentage: "60%" },
      { name: "Water Conservation", percentage: "25%" },
      { name: "Green Buildings", percentage: "15%" }
    ]
  }
];

interface BubbleProps {
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
      exit={isChild ? { scale: 0, opacity: 0 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.05 }}
    >
      <span className="text-lg font-bold">{percentage}</span>
      <span className="text-xs px-2">{name}</span>
    </motion.div>
  );
};

interface WelcomeWidgetProps {
  userName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const WelcomeWidget: React.FC<WelcomeWidgetProps> = ({ 
  userName,
  isOpen,
  onOpenChange
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  
  // If device status is still determining or definitely not mobile, don't render
  if (isMobile === undefined || isMobile === false) {
    return null;
  }

  // Handle category click
  const handleCategoryClick = (index: number) => {
    setActiveCategory(index);
  };

  // Handle back to main categories
  const handleBackToCategories = () => {
    setActiveCategory(null);
  };

  // Calculate bubble sizes and positions based on percentages
  const calculateBubbleSizes = (items: typeof investmentCategories) => {
    const MIN_SIZE = 80; // Minimum bubble size
    const baseSize = 120;
    const containerHeight = 300;
    const containerWidth = 300;
    
    return items.map((item, index) => {
      // Extract numeric value from percentage
      const percentValue = parseInt(item.percentage);
      // Calculate size proportional to percentage, but not smaller than minimum
      const size = Math.max(MIN_SIZE, baseSize * (percentValue / 30));
      
      // Calculate positions in a circular pattern
      // For main categories, arrange in a circular pattern
      let x, y;
      
      // Arrange bubbles in a somewhat circular pattern
      if (items.length <= 2) {
        // For 1-2 items, center them
        x = containerWidth / 2 - size / 2;
        y = containerHeight / 2 - size / 2;
        if (items.length === 2 && index === 1) {
          x = containerWidth / 2 - size / 2;
          y = containerHeight / 2 + 20;
        }
      } else {
        // For 3+ items, arrange in a circular pattern
        const angle = (2 * Math.PI * index) / items.length;
        const radius = containerWidth / 3; // Distance from center
        
        x = containerWidth / 2 - size / 2 + radius * Math.cos(angle);
        y = containerHeight / 2 - size / 2 + radius * Math.sin(angle);
      }
      
      return {
        ...item,
        bubbleSize: size,
        position: {x, y},
      };
    });
  };

  // Calculate bubble data
  const bubbleData = activeCategory === null 
    ? calculateBubbleSizes(investmentCategories)
    : calculateBubbleSizes(investmentCategories[activeCategory].subcategories.map(sub => ({
        ...sub,
        color: investmentCategories[activeCategory].color
      })));

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerContent className="h-[85vh] rounded-t-xl">
        <div className="flex justify-end p-4">
          <DrawerClose className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-6 w-6" />
          </DrawerClose>
        </div>
        
        <div className="px-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-1">Willkommen zurück, {userName}!</h2>
          <p className="text-gray-500 mb-6">Seit du weg warst, haben Nutzer investiert in:</p>
          
          <div className="pb-8">
            {activeCategory !== null && (
              <button 
                onClick={handleBackToCategories}
                className="text-sm text-gray-500 hover:text-gray-700 mb-10"
              >
                ← Zurück zu allen Kategorien
              </button>
            )}
            
            <h3 className="text-lg font-medium mb-3">
              {activeCategory === null ? "Trending Investments" : investmentCategories[activeCategory].name}
            </h3>
            
            <div className="relative h-[350px] w-full">
              <AnimatePresence>
                {bubbleData.map((bubble, index) => (
                  <Bubble
                    key={`${bubble.name}-${index}`}
                    name={bubble.name}
                    percentage={bubble.percentage}
                    color={bubble.color}
                    size={bubble.bubbleSize}
                    onClick={activeCategory === null 
                      ? () => handleCategoryClick(index)
                      : undefined
                    }
                    position={bubble.position}
                    isChild={activeCategory !== null}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default WelcomeWidget;
