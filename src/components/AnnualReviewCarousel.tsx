
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import BubbleChart, { Category } from './BubbleChart';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import StoryProgressIndicator from './StoryProgressIndicator';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

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

// Spending categories data - updated to store only amount and percentage
const spendingCategories = [
  { name: "Shopping", amount: "1.500€", percentage: 40 },
  { name: "Errands", amount: "800€", percentage: 10 },
  { name: "Restaurants", amount: "650€", percentage: 5 },
  { name: "Entertainment", amount: "450€", percentage: 30 },
  { name: "Transport", amount: "350€", percentage: 15 }
];

// Helper function to determine status based on percentage
const getStatusFromPercentage = (percentage: number): string => {
  if (percentage >= 30) return `Highest ${percentage}%`;
  if (percentage <= 10) return `Lowest ${percentage}%`;
  return `Average ${percentage}%`;
};

interface AnnualReviewCarouselProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AUTOPLAY_DURATION = 10000; // 10 seconds per slide

const AnnualReviewCarousel: React.FC<AnnualReviewCarouselProps> = ({ isOpen, onOpenChange }) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const totalSlides = 5;
  
  // Pause on touch
  const handleTouch = () => {
    setIsPaused(true);
  };
  
  // Resume on touch end
  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  // Handle category click
  const handleCategoryClick = (index: number) => {
    setActiveCategory(index);
  };

  // Handle back to main categories
  const handleBackToCategories = () => {
    setActiveCategory(null);
  };
  
  // Navigate to previous slide
  const goToPrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    setProgress(0);
  };
  
  // Navigate to next slide
  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    setProgress(0);
  };
  
  // Jump to specific slide
  const goToSlide = (index: number) => {
    setActiveSlide(index);
    setProgress(0);
  };
  
  // Auto-advance slides and progress bar
  useEffect(() => {
    if (!isOpen || isPaused) return;
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        
        // When progress reaches 100, advance to next slide
        if (newProgress >= 100) {
          setTimeout(() => {
            goToNextSlide();
          }, 0);
          return 0;
        }
        
        return newProgress;
      });
    }, AUTOPLAY_DURATION / 100);
    
    return () => clearInterval(progressInterval);
  }, [isOpen, activeSlide, isPaused]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white text-foreground shadow-lg h-full"
        onPointerDown={handleTouch}
        onPointerUp={handleTouchEnd}>
        
        {/* Accessibility title */}
        <DialogTitle className="sr-only">Annual Review</DialogTitle>
        
        {/* Story indicators */}
        <div className="px-2 pt-2">
          <StoryProgressIndicator 
            totalSlides={totalSlides} 
            activeSlide={activeSlide} 
            progress={progress} 
            onSlideClick={goToSlide}
          />
        </div>
        
        {/* Slide content */}
        <div className="p-6 h-[500px] relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {/* Slide 1: Your Investment Focus */}
              {activeSlide === 0 && (
                <div className="h-full flex flex-col">
                  <h2 className="text-2xl font-bold mb-4">Your Investment Focus</h2>
                  <div className="flex-grow relative">
                    {activeCategory !== null && (
                      <button 
                        onClick={handleBackToCategories}
                        className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to all categories
                      </button>
                    )}
                    <div className="h-full">
                      <BubbleChart
                        categories={investmentCategories}
                        activeCategory={activeCategory}
                        onCategoryClick={handleCategoryClick}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Slide 2: Your Spending (Updated) */}
              {activeSlide === 1 && (
                <div className="h-full flex flex-col">
                  <h2 className="text-2xl font-bold mb-4">Your Spending</h2>
                  <div className="flex-grow">
                    <div className="text-xl mb-2">You spent <span className="font-bold">3.750€</span></div>
                    <p className="text-gray-600 mb-6">These are your top categories:</p>
                    <div className="space-y-5">
                      {spendingCategories.map((category, index) => {
                        // Calculate width based on amount (remove € symbol and convert to number)
                        const amountNumber = parseFloat(category.amount.replace('€', '').replace('.', '').replace(',', '.'));
                        const totalAmount = 3750; // Sum of all amounts
                        const widthPercentage = (amountNumber / totalAmount) * 100;
                        const status = getStatusFromPercentage(category.percentage);
                        
                        return (
                          <div key={index} className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <span className="text-gray-500 mr-2">{index + 1}.</span>
                                <span className="font-medium">{category.name}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">{category.amount}</div>
                              </div>
                            </div>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" 
                                style={{ width: `${widthPercentage}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {status}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Slide 3: Saveback */}
              {activeSlide === 2 && (
                <div className="h-full flex flex-col">
                  <h2 className="text-2xl font-bold mb-4">Saveback</h2>
                  <div className="flex-grow flex flex-col justify-center items-center text-center">
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-3">285€</div>
                    <p className="text-xl mb-6">collected with Saveback</p>
                    <div className="mb-10 w-full">
                      <div className="w-full flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm">Current</span>
                        <span className="text-gray-500 text-sm">When you retire</span>
                      </div>
                      <Progress value={22} className="h-3 bg-gray-200" />
                      <div className="w-full flex items-center justify-between mt-2">
                        <span className="text-lg font-medium">285€</span>
                        <span className="text-lg font-medium text-tr-green">1,240€</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Calculations based on a Retirement Age of 65 with an annual return of 7%. Taxes not included.
                      </p>
                    </div>
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      Invest more to close the pension gap
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Slide 4: RoundUp */}
              {activeSlide === 3 && (
                <div className="h-full flex flex-col">
                  <h2 className="text-2xl font-bold mb-4">RoundUp</h2>
                  <div className="flex-grow flex flex-col justify-center items-center text-center">
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-3">124€</div>
                    <p className="text-xl mb-6">collected with RoundUp</p>
                    <div className="mb-10 w-full">
                      <div className="w-full flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm">Current</span>
                        <span className="text-gray-500 text-sm">When you retire</span>
                      </div>
                      <Progress value={18} className="h-3 bg-gray-200" />
                      <div className="w-full flex items-center justify-between mt-2">
                        <span className="text-lg font-medium">124€</span>
                        <span className="text-lg font-medium text-tr-green">540€</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Calculations based on a Retirement Age of 65 with an annual return of 7%. Taxes not included.
                      </p>
                    </div>
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
                    >
                      Invest more to close the pension gap
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Slide 5: Investment Performance */}
              {activeSlide === 4 && (
                <div className="h-full flex flex-col">
                  <h2 className="text-2xl font-bold mb-4">Investment Performance</h2>
                  <div className="flex-grow flex flex-col justify-center items-center">
                    <div className="text-5xl font-bold text-tr-green mb-3">+7.2%</div>
                    <p className="text-center mb-8">
                      Your investments went up <span className="font-bold">7.2%</span> this year.<br/>
                      <span className="text-tr-green">You beat the MSCI World Index by 1.3%</span>
                    </p>
                    
                    <div className="w-full">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>0%</span>
                        <span>8%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden mb-1 relative">
                        {/* MSCI Marker */}
                        <div className="absolute h-full bg-gray-400 w-[1px] left-[73.75%]"></div>
                        {/* Your Portfolio */}
                        <div className="h-full bg-gradient-to-r from-green-400 to-tr-green rounded-full" style={{ width: "90%" }}></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Your portfolio: <span className="text-tr-green">7.2%</span></span>
                        <span className="text-gray-500">MSCI: 5.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Navigation controls */}
        <div className="absolute inset-0 flex pointer-events-none">
          {/* Left area - previous slide */}
          <div 
            className="w-1/3 h-full cursor-pointer z-10 pointer-events-auto" 
            onClick={goToPrevSlide}
            style={{ marginTop: '40px' }} // Add space at the top to not interfere with close button
          />
          {/* Middle area - no action */}
          <div className="w-1/3 h-full" />
          {/* Right area - next slide */}
          <div 
            className="w-1/3 h-full cursor-pointer z-10 pointer-events-auto" 
            onClick={goToNextSlide}
            style={{ marginTop: '40px' }} // Add space at the top to not interfere with close button
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnnualReviewCarousel;
