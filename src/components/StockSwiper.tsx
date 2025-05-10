
import React, { useState, useRef, useContext, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import { Check, X, ArrowUp, ArrowDown, Circle, Info, DollarSign, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { WatchlistContext } from '../contexts/WatchlistContext';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage } from './ui/avatar';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from "@/hooks/use-toast";

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
        
        <div className="p-4">
          {/* Header with logo and company info side by side */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={stock.image} alt={`${stock.name} logo`} />
              </Avatar>
              <div>
                <h3 className="text-lg font-bold">{stock.name}</h3>
                <p className="text-xs text-gray-500">{stock.ticker}</p>
              </div>
            </div>
            <span className={`font-semibold ${stock.change >= 0 ? 'text-tr-green' : 'text-red-500'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change}%
            </span>
          </div>
          
          <div className="mb-2">
            <p className="text-sm text-gray-600 line-clamp-2">{stock.description}</p>
          </div>

          {/* AI Signal Section */}
          <div className="mt-1 border-t border-gray-100 pt-1">
            <div className="flex items-center mb-1">
              <h4 className="font-semibold text-gray-800 text-sm">AI Signal</h4>
            </div>
            
            <div className="flex items-center mb-1">
              <Badge className={`${signalInfo.color} border flex items-center capitalize`} variant="outline">
                {signalInfo.icon}
                {stock.aiSignal}
              </Badge>
            </div>
            
            <p className="text-xs text-gray-600 mb-1">{stock.aiReasoning}</p>
            
            <div className="flex items-center text-xs text-gray-400">
              <Info className="w-3 h-3 mr-1" />
              <span>This is not financial advice</span>
            </div>
          </div>
          
          <div className="mt-1">
            <span className="bg-gray-100 text-gray-800 py-1 px-2 rounded-full text-xs">
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
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const { toast } = useToast();
  const availableFunds = 344.53; // Example available funds
  const predefinedAmounts = ["50", "75", "100", "250"];
  const fee = 1.00;
  
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

  const handleBuyClick = () => {
    setBuyDialogOpen(true);
    setConfirmationStep(false);
    setSelectedAmount("");
    setCustomAmount("");
  };
  
  const handleAmountSelection = (amount: string) => {
    setSelectedAmount(amount);
  };
  
  const handleProceedToConfirmation = () => {
    const amountToUse = selectedAmount === "custom" ? customAmount : selectedAmount;
    if (!amountToUse || parseFloat(amountToUse) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please select or enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    setSelectedAmount(amountToUse);
    setConfirmationStep(true);
  };

  const handlePurchase = () => {
    const currentStock = stocks[currentStockIndex];
    const amount = parseFloat(selectedAmount === "custom" ? customAmount : selectedAmount);
    
    toast({
      title: "Order Placed!",
      description: `Successfully invested ${amount.toFixed(2)} € in ${currentStock.ticker}`,
    });
    setBuyDialogOpen(false);
    setConfirmationStep(false);
  };

  const handleCloseDialog = () => {
    setBuyDialogOpen(false);
    setConfirmationStep(false);
  };
  
  const getCurrentStock = () => {
    return currentStockIndex < stocks.length ? stocks[currentStockIndex] : null;
  };
  
  const calculateShares = () => {
    const currentStock = getCurrentStock();
    if (!currentStock) return 0;
    
    const amount = parseFloat(selectedAmount === "custom" ? customAmount : selectedAmount);
    const price = parseFloat(currentStock.price.replace('$', ''));
    
    if (isNaN(amount) || isNaN(price) || price === 0) return 0;
    
    return amount / price;
  };
  
  const calculateTotal = () => {
    const amount = parseFloat(selectedAmount === "custom" ? customAmount : selectedAmount);
    return isNaN(amount) ? 0 : amount + fee;
  };
  
  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange} shouldScaleBackground={false}>
        <DrawerContent className="h-[90svh] max-h-[90svh] bg-white">
          <DrawerHeader>
            <DrawerTitle>Discover Stocks</DrawerTitle>
            <p className="text-sm text-gray-500">Swipe right if interested, left if not</p>
          </DrawerHeader>
          
          <div className="p-4 flex-1 flex flex-col items-center overflow-hidden">
            <div className="relative w-full max-w-md h-[400px] mx-auto">
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
            
            <div className="flex justify-center space-x-6 mt-6">
              <button 
                onClick={() => handleManualSwipe('left')} 
                className="bg-red-100 text-red-500 h-14 w-14 rounded-full flex items-center justify-center shadow-md hover:bg-red-200 transition-colors"
              >
                <X className="w-7 h-7" />
              </button>
              
              <button 
                onClick={handleBuyClick} 
                className="bg-blue-100 text-blue-500 h-12 w-12 rounded-full flex items-center justify-center shadow-md hover:bg-blue-200 transition-colors"
              >
                <DollarSign className="w-6 h-6" />
              </button>
              
              <button 
                onClick={() => handleManualSwipe('right')} 
                className="bg-tr-green/20 text-tr-green h-14 w-14 rounded-full flex items-center justify-center shadow-md hover:bg-tr-green/30 transition-colors"
              >
                <Check className="w-7 h-7" />
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

      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          {!confirmationStep ? (
            /* First Step: Amount Selection */
            <div className="flex flex-col">
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Investieren</DialogTitle>
                  <DialogDescription className="text-base font-medium">
                    {availableFunds.toFixed(2)} € verfügbar
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelection(amount)}
                      className={`p-4 rounded-md text-xl font-bold border ${
                        selectedAmount === amount 
                          ? 'border-black bg-gray-100' 
                          : 'border-gray-300'
                      }`}
                    >
                      {amount} €
                    </button>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Label htmlFor="customAmount" className="text-lg font-semibold">
                    Betrag
                  </Label>
                  <Input
                    id="customAmount"
                    type="number"
                    min="1"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount("custom");
                    }}
                    className="mt-2 text-lg"
                  />
                </div>
              </div>
              
              <div className="mt-auto p-6 pt-0">
                <Button 
                  onClick={handleProceedToConfirmation}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-black text-lg font-medium py-6 rounded-md flex items-center justify-between"
                >
                  <span>Weiter</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ) : (
            /* Second Step: Order Confirmation */
            <div className="flex flex-col h-full">
              <div className="p-6 pb-0">
                <button 
                  onClick={() => setConfirmationStep(false)}
                  className="mb-4 flex items-center text-gray-600"
                >
                  <ArrowLeft className="mr-1 w-5 h-5" />
                  <span>Zurück</span>
                </button>
                
                <DialogHeader>
                  <div className="flex items-center">
                    {getCurrentStock()?.image && (
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={getCurrentStock()?.image} />
                      </Avatar>
                    )}
                    <DialogTitle className="text-2xl font-bold">
                      {parseFloat(selectedAmount).toFixed(2)} € investieren
                    </DialogTitle>
                  </div>
                </DialogHeader>
              </div>
              
              <div className="p-6 flex-1">
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Zahlung</span>
                    <span className="font-medium">Cash</span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Ordertyp</span>
                    <span className="font-medium">Kauf</span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Asset</span>
                    <span className="font-medium">{getCurrentStock()?.ticker}</span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Anteile</span>
                    <span className="font-medium">{calculateShares().toFixed(6)}</span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Asset-Kurs</span>
                    <span className="font-medium">{getCurrentStock()?.price}</span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Gebühr</span>
                    <span className="font-medium">{fee.toFixed(2)} €</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-t border-gray-200 mt-4 pt-4">
                    <span className="font-bold">Gesamt</span>
                    <span className="font-bold">{calculateTotal().toFixed(2)} €</span>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <span>Hier findest du das </span>
                  <button className="text-black font-medium">Kosteninformation</button>
                </div>
              </div>
              
              <div className="p-6 pt-0 mt-auto flex space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => setConfirmationStep(false)}
                  className="w-1/4"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                
                <Button 
                  onClick={handlePurchase}
                  className="w-3/4 bg-black hover:bg-gray-800 text-white text-lg"
                >
                  Kaufen
                  <Check className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StockSwiper;
