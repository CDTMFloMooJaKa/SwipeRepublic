import React, { useState, useRef, useContext, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import { Check, X, ArrowUp, ArrowDown, Circle, Info } from 'lucide-react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { WatchlistContext } from '../contexts/WatchlistContext';
import { Badge } from './ui/badge';

interface StockCardProps {
  stock: Stock;
  onSwipe: (direction: 'left' | 'right') => void;
}

export interface Stock {
  id: number;
  name: string;
  ticker: string;
  price: string;
  change: number;
  description: string;
  industry: string;
  image: string;
  aiSignal: 'buy' | 'hold' | 'sell';
  aiReasoning: string;
}

// Sample stock data
export const stocks: Stock[] = [
  {
    id: 1,
    name: "Tesla, Inc.",
    ticker: "TSLA",
    price: "$182.63",
    change: 1.25,
    description: "Electric vehicle and clean energy company that designs and manufactures electric cars, battery energy storage, solar panels and more.",
    industry: "Automotive",
    image: "/lovable-uploads/87e9327e-9fdd-4acb-8304-e8c06eadf118.png", // Tesla logo
    aiSignal: "sell",
    aiReasoning: "Increased competition in EV market alongside production challenges may pressure margins in the near term."
  },
  {
    id: 2,
    name: "Amazon.com, Inc.",
    ticker: "AMZN",
    price: "$187.24",
    change: -0.89,
    description: "E-commerce, cloud computing, digital streaming, and artificial intelligence company.",
    industry: "E-Commerce",
    image: "/lovable-uploads/edd95656-1015-4ca4-885a-4f5e9e11a355.png", // Amazon logo
    aiSignal: "buy",
    aiReasoning: "Strong AWS growth and retail expansion present substantial upside potential for long-term investors."
  },
  {
    id: 3,
    name: "Apple Inc.",
    ticker: "AAPL",
    price: "$178.92",
    change: 2.34,
    description: "Technology company that designs, manufactures, and markets smartphones, personal computers, tablets, wearables and accessories.",
    industry: "Technology",
    image: "/lovable-uploads/dfb629e1-1416-408e-a2ac-324755938194.png", // Apple logo
    aiSignal: "buy",
    aiReasoning: "Robust ecosystem and services segment growth provide stable revenue streams with upcoming AI features likely to drive upgrades."
  },
  {
    id: 4,
    name: "Microsoft Corp.",
    ticker: "MSFT",
    price: "$415.26",
    change: 0.78,
    description: "Technology company that develops, licenses, and supports software, services, devices, and solutions worldwide.",
    industry: "Technology",
    image: "/lovable-uploads/c7edeaa5-a457-4903-92b0-1545667af436.png", // Microsoft logo
    aiSignal: "buy",
    aiReasoning: "Cloud business momentum and AI integration across product lines position the company for continued growth."
  },
  {
    id: 5,
    name: "NVIDIA Corp.",
    ticker: "NVDA",
    price: "$873.45",
    change: 3.21,
    description: "Technology company that designs graphics processing units (GPUs) for the gaming and professional markets, as well as system-on-a-chip units for mobile computing and automotive markets.",
    industry: "Semiconductors",
    image: "/lovable-uploads/e903ee92-f1bc-4b4f-bb9f-869da81fe818.png", // NVIDIA logo
    aiSignal: "hold",
    aiReasoning: "While AI demand remains strong, high valuation and potential market saturation suggest waiting for a better entry point."
  }
];

const StockCard: React.FC<StockCardProps> = ({ stock, onSwipe }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [swipeDirection, setSwipeDirection] = useState<null | 'left' | 'right'>(null);
  const [swipeProgress, setSwipeProgress] = useState(0); // 0 to 1
  
  const handleDrag = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const maxDrag = 250; // Maximum drag distance for 100% opacity
    const progress = Math.min(Math.abs(info.offset.x) / maxDrag, 1);
    setSwipeProgress(progress);
    
    if (info.offset.x > 0) {
      setSwipeDirection('right');
    } else if (info.offset.x < 0) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };
  
  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    setSwipeProgress(0);
    setSwipeDirection(null);
    
    if (info.offset.x > threshold) {
      // Swiped right
      controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } })
        .then(() => onSwipe('right'));
    } else if (info.offset.x < -threshold) {
      // Swiped left
      controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } })
        .then(() => onSwipe('left'));
    } else {
      // Return to center
      controls.start({ x: 0, opacity: 1, transition: { duration: 0.3 } });
    }
  };
  
  // Function to return the signal color and icon based on the AI signal
  const getSignalInfo = (signal: 'buy' | 'hold' | 'sell') => {
    switch (signal) {
      case 'buy':
        return { 
          color: 'bg-tr-green/20 text-tr-green border-tr-green', 
          icon: <ArrowUp className="w-4 h-4 mr-1" />
        };
      case 'hold':
        return { 
          color: 'bg-yellow-100 text-yellow-700 border-yellow-400', 
          icon: <Circle className="w-4 h-4 mr-1" />
        };
      case 'sell':
        return { 
          color: 'bg-red-100 text-red-700 border-red-400', 
          icon: <ArrowDown className="w-4 h-4 mr-1" />
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-700 border-gray-400',
          icon: null
        };
    }
  };

  const signalInfo = getSignalInfo(stock.aiSignal);
  
  return (
    <motion.div
      ref={cardRef}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="absolute w-full cursor-grab active:cursor-grabbing"
      whileTap={{ scale: 1.05 }}
      style={{ touchAction: 'none' }}
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full border border-gray-200 relative">
        {/* Visual indicators for swipe direction */}
        {swipeDirection === 'left' && (
          <div className="absolute top-4 left-4 z-10 bg-red-500 rounded-full p-2" 
               style={{ opacity: swipeProgress }}>
            <X className="text-white" size={24} />
          </div>
        )}
        
        {swipeDirection === 'right' && (
          <div className="absolute top-4 right-4 z-10 bg-tr-green rounded-full p-2"
               style={{ opacity: swipeProgress }}>
            <Check className="text-white" size={24} />
          </div>
        )}
        
        <div className="relative h-24 bg-gray-100">
          <div className="flex justify-center items-center h-full">
            <img 
              src={stock.image}
              alt={`${stock.name} logo`}
              className="h-6 w-auto object-contain"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-lg font-bold">{stock.name}</h3>
              <p className="text-sm text-gray-500">{stock.ticker}</p>
            </div>
            <span className={`font-semibold ${stock.change >= 0 ? 'text-tr-green' : 'text-red-500'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change}%
            </span>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-600">{stock.description}</p>
          </div>

          {/* AI Signal Section */}
          <div className="mt-4 border-t border-gray-100 pt-3">
            <div className="flex items-center mb-2">
              <h4 className="font-semibold text-gray-800">AI Signal</h4>
            </div>
            
            <div className="flex items-center mb-2">
              <Badge className={`${signalInfo.color} border flex items-center capitalize`} variant="outline">
                {signalInfo.icon}
                {stock.aiSignal}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{stock.aiReasoning}</p>
            
            <div className="flex items-center text-xs text-gray-400">
              <Info className="w-3 h-3 mr-1" />
              <span>This is not financial advice</span>
            </div>
          </div>
          
          <div className="mt-4">
            <span className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-xs">
              {stock.industry}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface StockSwiperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const StockSwiper: React.FC<StockSwiperProps> = ({ isOpen, onOpenChange }) => {
  const [currentStockIndex, setCurrentStockIndex] = useState(0);
  const [swipedStocks, setSwipedStocks] = useState<{id: number, liked: boolean}[]>([]);
  const controls = useAnimation();
  const { addToWatchlist } = useContext(WatchlistContext);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentStock = stocks[currentStockIndex];
    const liked = direction === 'right';
    
    setSwipedStocks(prev => [...prev, {id: currentStock.id, liked}]);
    
    // Add to watchlist if swiped right (liked)
    if (liked) {
      addToWatchlist(currentStock);
    }
    
    if (currentStockIndex < stocks.length - 1) {
      setTimeout(() => {
        setCurrentStockIndex(currentStockIndex + 1);
      }, 300);
    } else {
      // All stocks have been swiped
      setTimeout(() => {
        setCurrentStockIndex(0);
        // You could show a summary here or reset
      }, 300);
    }
  };
  
  const handleManualSwipe = (direction: 'left' | 'right') => {
    // Apply animation based on direction
    if (direction === 'right') {
      controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } })
        .then(() => handleSwipe(direction));
    } else {
      controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } })
        .then(() => handleSwipe(direction));
    }
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerContent className="h-[90svh] max-h-[90svh] bg-white">
        <DrawerHeader>
          <DrawerTitle>Discover Stocks</DrawerTitle>
          <p className="text-sm text-gray-500">Swipe right if interested, left if not</p>
        </DrawerHeader>
        
        <div className="p-4 flex-1 flex flex-col items-center overflow-hidden">
          <div className="relative w-full max-w-md h-[500px] mx-auto">
            {/* Show current stock if available */}
            {currentStockIndex < stocks.length ? (
              <motion.div
                key={stocks[currentStockIndex].id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <StockCard 
                  stock={stocks[currentStockIndex]} 
                  onSwipe={handleSwipe} 
                />
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No more stocks to show</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center space-x-12 mt-6">
            <button 
              onClick={() => handleManualSwipe('left')} 
              className="bg-red-100 text-red-500 h-16 w-16 rounded-full flex items-center justify-center shadow-md hover:bg-red-200 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <button 
              onClick={() => handleManualSwipe('right')} 
              className="bg-tr-green/20 text-tr-green h-16 w-16 rounded-full flex items-center justify-center shadow-md hover:bg-tr-green/30 transition-colors"
            >
              <Check className="w-8 h-8" />
            </button>
          </div>
          
          {swipedStocks.length > 0 && (
            <div className="mt-6 text-sm text-gray-500">
              <p>{swipedStocks.filter(s => s.liked).length} stocks liked</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default StockSwiper;
