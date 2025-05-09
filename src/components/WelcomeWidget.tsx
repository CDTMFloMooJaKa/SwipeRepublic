
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { 
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";

// Mock data for investments since user was away
const recentInvestments = [
  {
    title: "Trending Investments",
    items: [
      { name: "Sustainable Energy Fund", percentage: "53%", color: "#f89c5e" },
      { name: "Tech Innovation ETF", percentage: "12%", color: "#d9d9d9" },
      { name: "Healthcare Startups", percentage: "4%", color: "#b066f7" },
      { name: "Urban Real Estate", percentage: "1%", color: "#e8ed69" },
      { name: "Water Conservation", percentage: "1%", color: "#6dcff6" },
    ]
  },
  {
    title: "User Activity",
    items: [
      { name: "New Users Today", percentage: "38%", color: "#f89c5e" },
      { name: "Recurring Investors", percentage: "42%", color: "#d9d9d9" },
      { name: "First-Time Investors", percentage: "20%", color: "#b066f7" },
    ]
  },
  {
    title: "Market Trends",
    items: [
      { name: "Green Technology", percentage: "46%", color: "#f89c5e" },
      { name: "Digital Services", percentage: "29%", color: "#d9d9d9" },
      { name: "Manufacturing", percentage: "15%", color: "#b066f7" },
      { name: "Consumer Goods", percentage: "10%", color: "#e8ed69" },
    ]
  }
];

interface InvestmentBlockProps {
  name: string;
  percentage: string;
  color: string;
  size?: string;
}

// Individual investment block component for visualization
const InvestmentBlock: React.FC<InvestmentBlockProps> = ({ 
  name, 
  percentage, 
  color,
  size = "auto" 
}) => {
  return (
    <div 
      className="p-4 rounded-md flex flex-col justify-between"
      style={{ 
        backgroundColor: color,
        minHeight: "100px",
        width: size
      }}
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
  const [currentSlide, setCurrentSlide] = useState(0);

  // Handle navigation to portfolio
  const handleNavigateToPortfolio = () => {
    onOpenChange(false);
    navigate('/portfolio');
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerContent className="h-[85vh] rounded-t-xl">
        <div className="flex justify-end p-4">
          <DrawerClose className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-6 w-6" />
          </DrawerClose>
        </div>
        
        <div className="mx-auto max-w-md p-4">
          <h2 className="text-2xl font-bold mb-1">Willkommen zurück, {userName}!</h2>
          <p className="text-gray-500 mb-6">Seit du weg warst, haben Nutzer investiert in:</p>
          
          <Carousel 
            className="w-full" 
            onSelect={(selectedIndex) => {
              if (selectedIndex !== undefined) {
                setCurrentSlide(selectedIndex);
              }
            }}
          >
            <CarouselContent>
              {recentInvestments.map((slide, index) => (
                <CarouselItem key={index} className="pl-0">
                  <div className="p-1">
                    <h3 className="text-lg font-medium mb-3">{slide.title}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {slide.items.map((item, i) => {
                        // Calculate sizing based on percentage (larger values get more space)
                        const size = parseInt(item.percentage) > 25 ? "100%" : 
                                     parseInt(item.percentage) > 10 ? "auto" : "auto";
                        
                        // For first two items that have high percentages, span full width
                        const colSpan = i === 0 && parseInt(item.percentage) > 30 ? "col-span-2" : "";
                        
                        return (
                          <div key={i} className={colSpan}>
                            <InvestmentBlock 
                              name={item.name}
                              percentage={item.percentage}
                              color={item.color}
                              size={size}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex justify-center mt-4">
              <div className="flex gap-2">
                {recentInvestments.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index ? "w-4 bg-black" : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="hidden sm:flex">
              <CarouselPrevious className="absolute -left-12" />
              <CarouselNext className="absolute -right-12" />
            </div>
          </Carousel>
          
          <div className="flex justify-end mt-8">
            <Button onClick={handleNavigateToPortfolio}>
              Zum Portfolio
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default WelcomeWidget;
