
import React, { useState, useRef, useEffect } from 'react';
import StoryProgressIndicator from './StoryProgressIndicator';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import BubbleChart, { Category } from './BubbleChart';
import { Card } from './ui/card';

// Mock data for news articles
const newsArticles = [
  {
    title: "Markets Reach All-Time High",
    description: "Global markets continue their rally as inflation concerns ease.",
    source: "Financial Times"
  },
  {
    title: "Tech Stocks Lead Recovery",
    description: "Technology sector outperforms broader market for third consecutive month.",
    source: "Bloomberg"
  },
  {
    title: "Energy Sector Under Pressure",
    description: "Renewable energy investments overtake traditional fossil fuels.",
    source: "Reuters"
  },
  {
    title: "Banking Regulations Tightened",
    description: "New framework announced for global financial institutions.",
    source: "Wall Street Journal"
  }
];

// Mock data for bubble charts
const boughtToday: Category[] = [
  { name: "Technology", percentage: "38%", color: "hsl(var(--tr-blue))", subcategories: [] },
  { name: "Healthcare", percentage: "24%", color: "hsl(var(--tr-green))", subcategories: [] },
  { name: "Finance", percentage: "18%", color: "hsl(var(--tr-purple))", subcategories: [] },
  { name: "Consumer Goods", percentage: "12%", color: "#F97316", subcategories: [] },
  { name: "Energy", percentage: "8%", color: "#D946EF", subcategories: [] },
];

const soldToday: Category[] = [
  { name: "Real Estate", percentage: "32%", color: "#F97316", subcategories: [] },
  { name: "Utilities", percentage: "25%", color: "hsl(var(--tr-purple))", subcategories: [] },
  { name: "Materials", percentage: "23%", color: "#D946EF", subcategories: [] },
  { name: "Communications", percentage: "11%", color: "hsl(var(--tr-blue))", subcategories: [] },
  { name: "Industrials", percentage: "9%", color: "hsl(var(--tr-green))", subcategories: [] },
];

// Mock data for top assets
const topAssets = [
  { name: "Global Tech ETF", change: 3.42, positive: true },
  { name: "Healthcare Innovation", change: 2.87, positive: true },
  { name: "European Dividend", change: -1.95, positive: false },
  { name: "Emerging Markets", change: -2.31, positive: false },
];

interface MarketsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MarketsToday: React.FC<MarketsProps> = ({ isOpen, onOpenChange }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeBubbleCategory, setActiveBubbleCategory] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const TOTAL_SLIDES = 4;
  const PROGRESS_INTERVAL = 30; // Update every 30ms
  const SLIDE_DURATION = 8000; // 8 seconds per slide
  const STEPS = SLIDE_DURATION / PROGRESS_INTERVAL;
  
  // Reset timer when slide changes
  const resetTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(0);
  };
  
  // Start timer for auto-advancing slides
  const startTimer = () => {
    resetTimer();
    setProgress(0);
    
    intervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / STEPS);
        
        // Move to next slide when progress hits 100%
        if (newProgress >= 100) {
          if (activeSlide < TOTAL_SLIDES - 1) {
            setActiveSlide(prev => prev + 1);
          } else {
            onOpenChange(false); // Close carousel on last slide
          }
          return 0;
        }
        
        return newProgress;
      });
    }, PROGRESS_INTERVAL);
  };
  
  // Effect to handle timer
  useEffect(() => {
    if (isOpen) {
      startTimer();
    } else {
      resetTimer();
      setActiveSlide(0);
      setProgress(0);
      setActiveBubbleCategory(null);
    }
    
    return () => {
      resetTimer();
    };
  }, [isOpen, activeSlide]);
  
  // Handle manual slide change
  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
    resetTimer();
    startTimer();
    setActiveBubbleCategory(null);
  };
  
  // Handle clicking a bubble category
  const handleCategoryClick = (index: number) => {
    setActiveBubbleCategory(activeBubbleCategory === index ? null : index);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 flex items-center border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onOpenChange(false)}
          className="mr-2"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold">Markets Today</h2>
      </div>
      
      {/* Progress Indicator */}
      <div className="px-4 py-2">
        <StoryProgressIndicator 
          totalSlides={TOTAL_SLIDES} 
          activeSlide={activeSlide} 
          progress={progress} 
          onSlideClick={handleSlideChange}
        />
      </div>
      
      {/* Carousel Content */}
      <Carousel className="flex-1 w-full overflow-hidden" ref={carouselRef}>
        <CarouselContent className="h-full">
          {/* Slide 1: News Today */}
          <CarouselItem className="h-full" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
            <div className="p-4 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-6">News Today</h3>
              <div className="space-y-4 flex-1">
                {newsArticles.map((article, index) => (
                  <Card key={index} className="p-4">
                    <h4 className="text-xl font-bold">{article.title}</h4>
                    <p className="text-gray-600 my-2">{article.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{article.source}</span>
                      <Button size="sm" variant="outline">Read More</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CarouselItem>

          {/* Slide 2: Bought Today */}
          <CarouselItem className="h-full" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
            <div className="p-4 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-6">Bought Today</h3>
              <div className="flex-1 relative">
                <BubbleChart 
                  categories={boughtToday} 
                  activeCategory={activeBubbleCategory}
                  onCategoryClick={handleCategoryClick} 
                />
              </div>
            </div>
          </CarouselItem>

          {/* Slide 3: Sold Today */}
          <CarouselItem className="h-full" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
            <div className="p-4 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-6">Sold Today</h3>
              <div className="flex-1 relative">
                <BubbleChart 
                  categories={soldToday} 
                  activeCategory={activeBubbleCategory}
                  onCategoryClick={handleCategoryClick} 
                />
              </div>
            </div>
          </CarouselItem>

          {/* Slide 4: Your Assets */}
          <CarouselItem className="h-full" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
            <div className="p-4 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-6">Your Assets</h3>
              
              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="text-lg font-semibold text-tr-green mb-2">Top Performers</h4>
                  {topAssets.filter(asset => asset.positive).map((asset, index) => (
                    <div key={`gain-${index}`} className="flex justify-between py-3 border-b">
                      <span className="font-medium">{asset.name}</span>
                      <span className="text-tr-green font-bold">▲ {asset.change.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-red-500 mb-2">Underperformers</h4>
                  {topAssets.filter(asset => !asset.positive).map((asset, index) => (
                    <div key={`loss-${index}`} className="flex justify-between py-3 border-b">
                      <span className="font-medium">{asset.name}</span>
                      <span className="text-red-500 font-bold">▼ {Math.abs(asset.change).toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button className="w-full mt-4 py-6" size="lg">
                Trade Now
              </Button>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default MarketsToday;
