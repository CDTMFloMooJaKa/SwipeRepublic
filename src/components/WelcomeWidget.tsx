
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";

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

interface InvestmentBlockProps {
  name: string;
  percentage: string;
  color: string;
  size?: string;
  onClick?: () => void;
}

// Individual investment block component for visualization
const InvestmentBlock: React.FC<InvestmentBlockProps> = ({ 
  name, 
  percentage, 
  color,
  size = "auto",
  onClick
}) => {
  return (
    <div 
      className="p-4 rounded-md flex flex-col justify-between cursor-pointer"
      style={{ 
        backgroundColor: color,
        minHeight: "100px",
        width: size
      }}
      onClick={onClick}
    >
      <div className="text-2xl font-bold">{percentage}</div>
      <div className="text-black text-sm mt-2">{name}</div>
    </div>
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

  // Handle navigation to portfolio
  const handleNavigateToPortfolio = () => {
    onOpenChange(false);
    navigate('/portfolio');
  };

  // Handle category click
  const handleCategoryClick = (index: number) => {
    setActiveCategory(index);
  };

  // Handle back to main categories
  const handleBackToCategories = () => {
    setActiveCategory(null);
  };

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
          
          {activeCategory === null ? (
            // Main categories view
            <div className="pb-8">
              <h3 className="text-lg font-medium mb-3">Trending Investments</h3>
              <div className="grid grid-cols-2 gap-3">
                {investmentCategories.map((category, index) => {
                  // Calculate sizing based on percentage (larger values get more space)
                  const size = parseInt(category.percentage) > 25 ? "100%" : "auto";
                  
                  // For first item that has high percentage, span full width
                  const colSpan = index === 0 ? "col-span-2" : "";
                  
                  return (
                    <div key={index} className={colSpan}>
                      <InvestmentBlock 
                        name={category.name}
                        percentage={category.percentage}
                        color={category.color}
                        size={size}
                        onClick={() => handleCategoryClick(index)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Subcategory view when a category is selected
            <div className="pb-8">
              <div className="flex items-center mb-3">
                <button 
                  onClick={handleBackToCategories}
                  className="text-sm text-gray-500 hover:text-gray-700 mb-2"
                >
                  ← Back to all categories
                </button>
              </div>
              <h3 className="text-lg font-medium mb-3">{investmentCategories[activeCategory].name}</h3>
              <div className="grid grid-cols-2 gap-3">
                {investmentCategories[activeCategory].subcategories.map((subcategory, index) => {
                  const parentColor = investmentCategories[activeCategory].color;
                  
                  // For first item with high percentage, span full width
                  const colSpan = index === 0 && parseInt(subcategory.percentage) > 40 ? "col-span-2" : "";
                  
                  return (
                    <div key={index} className={colSpan}>
                      <InvestmentBlock 
                        name={subcategory.name}
                        percentage={subcategory.percentage}
                        color={parentColor}
                        size="auto"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default WelcomeWidget;
