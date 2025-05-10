
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BubbleChart, { Category } from './BubbleChart';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

// Investment focus data
const investmentCategories: Category[] = [
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

// Spending categories data
const spendingCategories = [
  { name: "Shopping", amount: "1.500€", status: "Highest", percentage: "40%" },
  { name: "Errands", amount: "800€", status: "Highest", percentage: "10%" },
  { name: "Restaurants", amount: "650€", status: "Average", percentage: "5%" },
  { name: "Entertainment", amount: "450€", status: "Lowest", percentage: "30%" },
  { name: "Transport", amount: "350€", status: "Average", percentage: "15%" }
];

interface AnnualReviewCarouselProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AnnualReviewCarousel: React.FC<AnnualReviewCarouselProps> = ({ isOpen, onOpenChange }) => {
  const [activeCategory, setActiveCategory] = React.useState<number | null>(null);

  // Handle category click
  const handleCategoryClick = (index: number) => {
    setActiveCategory(index);
  };

  // Handle back to main categories
  const handleBackToCategories = () => {
    setActiveCategory(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">2025 in Numbers</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Your annual financial review
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 pt-2">
          <Carousel className="w-full">
            <CarouselContent>
              {/* Slide 1: Your Investment Focus */}
              <CarouselItem>
                <div className="p-1">
                  <div className="rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-4">Your Investment Focus</h3>
                    <div className="h-[350px]">
                      {activeCategory !== null && (
                        <button 
                          onClick={handleBackToCategories}
                          className="text-sm text-gray-500 hover:text-gray-700 mb-4"
                        >
                          ← Back to all categories
                        </button>
                      )}
                      <BubbleChart
                        categories={investmentCategories}
                        activeCategory={activeCategory}
                        onCategoryClick={handleCategoryClick}
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
              
              {/* Slide 2: Your Spending */}
              <CarouselItem>
                <div className="p-1">
                  <div className="rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-2">You spent 3.750€</h3>
                    <p className="text-gray-500 mb-4">These are your top categories:</p>
                    <div className="space-y-4">
                      {spendingCategories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-2">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{index + 1}.</span>
                            <span>{category.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{category.amount}</div>
                            <div className={`text-xs ${category.status === 'Highest' ? 'text-tr-green' : 
                              category.status === 'Lowest' ? 'text-red-500' : 'text-gray-500'}`}>
                              {category.status} {category.percentage}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CarouselItem>
              
              {/* Slide 3: Saveback */}
              <CarouselItem>
                <div className="p-1">
                  <div className="rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-4">Saveback</h3>
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <p className="text-lg mb-2">You collected <span className="font-bold">285€</span> with Saveback</p>
                      <p className="text-gray-600 mb-6">Invested with 7% p.a, this will turn out to <span className="font-bold">1,240€</span> when you retire (before tax)</p>
                      
                      <Button className="w-full">
                        Invest more to close the pension gap
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              
              {/* Slide 4: RoundUp */}
              <CarouselItem>
                <div className="p-1">
                  <div className="rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-4">RoundUp</h3>
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <p className="text-lg mb-2">You collected <span className="font-bold">124€</span> with RoundUp</p>
                      <p className="text-gray-600 mb-6">Invested with 7% p.a, this will turn out to <span className="font-bold">540€</span> when you retire (before tax)</p>
                      
                      <Button className="w-full">
                        Invest more to close the pension gap
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              
              {/* Slide 5: Investment Performance */}
              <CarouselItem>
                <div className="p-1">
                  <div className="rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-4">Investment Performance</h3>
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <p className="text-2xl font-bold text-tr-green mb-4">+7.2%</p>
                      <p className="text-gray-700">Your investments went up <span className="font-bold">7.2%</span> this year.</p>
                      <p className="text-tr-green font-medium mb-6">You beat the MSCI World Index by 1.3%</p>
                      
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                        <div className="bg-tr-green h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Your portfolio: 7.2%</span>
                        <span>MSCI World: 5.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="flex items-center justify-center gap-4 py-4">
              <CarouselPrevious className="position-static relative inset-0 left-0 right-0 translate-y-0" />
              <CarouselNext className="position-static relative inset-0 left-0 right-0 translate-y-0" />
            </div>
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnnualReviewCarousel;
