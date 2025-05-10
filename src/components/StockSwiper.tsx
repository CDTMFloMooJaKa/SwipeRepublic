
import React, { useState, useRef } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, PanInfo, useAnimation } from 'framer-motion';

interface StockCardProps {
  stock: Stock;
  onSwipe: (direction: 'left' | 'right') => void;
}

interface Stock {
  id: number;
  name: string;
  ticker: string;
  price: string;
  change: number;
  description: string;
  industry: string;
  image: string;
}

// Sample stock data
const stocks: Stock[] = [
  {
    id: 1,
    name: "Apple Inc.",
    ticker: "AAPL",
    price: "$182.63",
    change: 1.25,
    description: "Technology company that designs, manufactures, and markets smartphones, personal computers, tablets, wearables and accessories.",
    industry: "Technology",
    image: "/lovable-uploads/62d7a477-be26-455b-a75e-a9c614db04ac.png"
  },
  {
    id: 2,
    name: "Tesla, Inc.",
    ticker: "TSLA",
    price: "$187.24",
    change: -0.89,
    description: "Electric vehicle and clean energy company that designs and manufactures electric cars, battery energy storage, solar panels and more.",
    industry: "Automotive",
    image: "/lovable-uploads/88d6a29b-923a-4da2-b04e-81ca9bf9874c.png"
  },
  {
    id: 3,
    name: "Amazon.com, Inc.",
    ticker: "AMZN",
    price: "$178.92",
    change: 2.34,
    description: "E-commerce, cloud computing, digital streaming, and artificial intelligence company.",
    industry: "E-Commerce",
    image: "/lovable-uploads/42dec5de-4be6-487c-902e-1c251e61c932.png"
  },
  {
    id: 4,
    name: "Microsoft Corp.",
    ticker: "MSFT",
    price: "$415.26",
    change: 0.78,
    description: "Technology company that develops, licenses, and supports software, services, devices, and solutions worldwide.",
    industry: "Technology",
    image: "/lovable-uploads/8abae172-83fe-4ef8-aadd-fb27c22ba5a7.png"
  },
  {
    id: 5,
    name: "NVIDIA Corp.",
    ticker: "NVDA",
    price: "$873.45",
    change: 3.21,
    description: "Technology company that designs graphics processing units (GPUs) for the gaming and professional markets, as well as system-on-a-chip units for mobile computing and automotive markets.",
    industry: "Semiconductors",
    image: "/lovable-uploads/62d7a477-be26-455b-a75e-a9c614db04ac.png"
  }
];

const StockCard: React.FC<StockCardProps> = ({ stock, onSwipe }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
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
  
  return (
    <motion.div
      ref={cardRef}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="absolute w-full cursor-grab active:cursor-grabbing"
      whileTap={{ scale: 1.05 }}
      style={{ touchAction: 'none' }}
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full border border-gray-200">
        <div className="relative h-48 bg-gray-100">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${stock.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <h3 className="text-xl font-bold">{stock.name}</h3>
            <p className="text-sm opacity-90">{stock.ticker}</p>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-bold">{stock.price}</span>
            <span className={`font-semibold ${stock.change >= 0 ? 'text-tr-green' : 'text-red-500'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change}%
            </span>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-600">{stock.description}</p>
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
  
  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipedStocks(prev => [...prev, {id: stocks[currentStockIndex].id, liked: direction === 'right'}]);
    
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
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[90svh] max-h-[90svh]">
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
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={() => handleManualSwipe('right')} 
              className="bg-tr-green/20 text-tr-green h-16 w-16 rounded-full flex items-center justify-center shadow-md hover:bg-tr-green/30 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
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
