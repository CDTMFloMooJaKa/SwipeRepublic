import React, { useState, useContext } from 'react';
import BubbleChart, { Category } from './BubbleChart';
import { Button } from './ui/button';
import { Card } from './ui/card';
import StoryCarousel from './StoryCarousel';
import { Bot, Bookmark } from 'lucide-react';
import { WatchlistContext } from '../contexts/WatchlistContext';
import { Stock, stocks } from './StockSwiper';
import { ScrollArea } from './ui/scroll-area';

// Sample news articles for each stock
const stockNewsMap = {
  1: { // Tesla
    title: "Tesla Unveils Next-Gen Battery Technology",
    description: "The new battery promises 30% more range and faster charging capabilities.",
    source: "Bloomberg"
  },
  2: { // Amazon
    title: "Amazon Expands Same-Day Delivery to Rural Areas",
    description: "The e-commerce giant continues to grow its logistics network with innovative delivery solutions.",
    source: "Reuters"
  },
  3: { // Apple
    title: "Apple Announces Major AI Features for Next iOS",
    description: "The upcoming iOS update will integrate advanced AI capabilities across all native apps.",
    source: "Financial Times"
  },
  4: { // Microsoft
    title: "Microsoft Cloud Revenue Exceeds Expectations",
    description: "Azure's market share grows as more enterprises shift to cloud computing solutions.",
    source: "Wall Street Journal"
  },
  5: { // NVIDIA
    title: "NVIDIA Reveals New AI Chip Architecture",
    description: "The next-generation GPU promises 2x performance for machine learning workloads.",
    source: "TechCrunch"
  }
};

// Mock data for bubble charts
const boughtToday: Category[] = [
  { 
    name: "Technology", 
    percentage: "38%", 
    color: "hsl(var(--tr-blue))", 
    subcategories: [
      { name: "Software", percentage: "50%" },
      { name: "Hardware", percentage: "30%" },
      { name: "Cloud Services", percentage: "20%" }
    ]
  },
  { 
    name: "Healthcare", 
    percentage: "24%", 
    color: "hsl(var(--tr-green))", 
    subcategories: [
      { name: "Pharmaceuticals", percentage: "40%" },
      { name: "Medical Devices", percentage: "35%" },
      { name: "Healthcare Services", percentage: "25%" }
    ]
  },
  { 
    name: "Finance", 
    percentage: "18%", 
    color: "hsl(var(--tr-purple))", 
    subcategories: [
      { name: "Banking", percentage: "45%" },
      { name: "Investment", percentage: "35%" },
      { name: "Insurance", percentage: "20%" }
    ]
  },
  { 
    name: "Consumer Goods", 
    percentage: "12%", 
    color: "#F97316", 
    subcategories: [
      { name: "Food & Beverage", percentage: "50%" },
      { name: "Clothing", percentage: "30%" },
      { name: "Electronics", percentage: "20%" }
    ]
  },
  { 
    name: "Energy", 
    percentage: "8%", 
    color: "#D946EF", 
    subcategories: [
      { name: "Renewables", percentage: "40%" },
      { name: "Oil & Gas", percentage: "35%" },
      { name: "Utilities", percentage: "25%" }
    ]
  },
];

const soldToday: Category[] = [
  { 
    name: "Real Estate", 
    percentage: "32%", 
    color: "#F97316", 
    subcategories: [
      { name: "Residential", percentage: "45%" },
      { name: "Commercial", percentage: "35%" },
      { name: "REITs", percentage: "20%" }
    ]
  },
  { 
    name: "Utilities", 
    percentage: "25%", 
    color: "hsl(var(--tr-purple))", 
    subcategories: [
      { name: "Electricity", percentage: "40%" },
      { name: "Water", percentage: "35%" },
      { name: "Gas", percentage: "25%" }
    ]
  },
  { 
    name: "Materials", 
    percentage: "23%", 
    color: "#D946EF", 
    subcategories: [
      { name: "Chemicals", percentage: "50%" },
      { name: "Mining", percentage: "30%" },
      { name: "Construction", percentage: "20%" }
    ]
  },
  { 
    name: "Communications", 
    percentage: "11%", 
    color: "hsl(var(--tr-blue))", 
    subcategories: [
      { name: "Telecom", percentage: "45%" },
      { name: "Media", percentage: "35%" },
      { name: "Internet", percentage: "20%" }
    ]
  },
  { 
    name: "Industrials", 
    percentage: "9%", 
    color: "hsl(var(--tr-green))", 
    subcategories: [
      { name: "Manufacturing", percentage: "40%" },
      { name: "Transportation", percentage: "35%" },
      { name: "Aerospace", percentage: "25%" }
    ]
  },
];

// Expanded mock data for top assets - now with 4 assets each
const topAssets = [
  { name: "Global Tech ETF", change: 3.42, positive: true },
  { name: "Healthcare Innovation", change: 2.87, positive: true },
  { name: "Sustainable Energy", change: 2.53, positive: true },
  { name: "AI & Robotics Fund", change: 2.24, positive: true },
  { name: "European Dividend", change: -1.95, positive: false },
  { name: "Emerging Markets", change: -2.31, positive: false },
  { name: "Commodities Index", change: -2.68, positive: false },
  { name: "Small Cap Value", change: -3.05, positive: false },
];

interface MarketsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MarketsToday: React.FC<MarketsProps> = ({ isOpen, onOpenChange }) => {
  const [activeBubbleCategory, setActiveBubbleCategory] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { watchlist } = useContext(WatchlistContext);
  
  // Handle clicking a bubble category
  const handleCategoryClick = (index: number, e: React.MouseEvent) => {
    // Stop event propagation to prevent slide change
    e.stopPropagation();
    
    setActiveBubbleCategory(prevCategory => prevCategory === index ? null : index);
    setIsPaused(true); // Pause autoplay when interacting with bubbles
  };

  // Handle going back to main categories
  const handleBackToCategories = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveBubbleCategory(null);
    setIsPaused(false); // Resume autoplay when going back
  };
  
  // Reset category selection when closing the carousel
  const handleClose = () => {
    setActiveBubbleCategory(null);
    setIsPaused(false);
  };
  
  // Handle slide change to reset bubble categories
  const handleSlideChange = (slideIndex: number) => {
    // Only reset if moving away from the bubble chart slides (slides 1 & 2)
    if (slideIndex !== 1 && slideIndex !== 2) {
      setActiveBubbleCategory(null);
      setIsPaused(false);
    }
  };
  
  // Generate news articles based on watchlist
  const getNewsArticles = () => {
    // Start with general market news that's always shown
    const generalNews = {
      title: "Markets Reach All-Time High",
      description: "Global markets continue their rally as inflation concerns ease.",
      source: "Financial Times",
      isWatchlistItem: false
    };
    
    // Add news for watchlist items
    const watchlistNews = watchlist.map(stock => ({
      title: stockNewsMap[stock.id]?.title || `${stock.name} News Update`,
      description: stockNewsMap[stock.id]?.description || `Latest updates about ${stock.name} performance.`,
      source: stockNewsMap[stock.id]?.source || "Market Daily",
      isWatchlistItem: true,
      stockName: stock.name
    }));
    
    // If watchlist is empty, show default news
    if (watchlistNews.length === 0) {
      return [
        generalNews,
        {
          title: "Tech Stocks Lead Recovery",
          description: "Technology sector outperforms broader market for third consecutive month.",
          source: "Bloomberg",
          isWatchlistItem: false
        },
        {
          title: "Energy Sector Under Pressure",
          description: "Renewable energy investments overtake traditional fossil fuels.",
          source: "Reuters",
          isWatchlistItem: false
        }
      ];
    }
    
    // Combine general news with watchlist news, limit to 3 articles total
    return [generalNews, ...watchlistNews].slice(0, 3);
  };
  
  // Define the slide contents
  const slides = [
    // Slide 1: News Today
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">News Today</h3>
        <div className="flex items-center text-gray-500 mt-1">
          <Bot className="h-4 w-4 mr-1.5" />
          <span className="text-sm">Selected for you</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4 pb-4">
          {getNewsArticles().map((article, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between mb-1">
                <h4 className="text-xl font-bold">{article.title}</h4>
                {article.isWatchlistItem && (
                  <div className="flex items-center text-blue-500">
                    <Bookmark className="h-4 w-4 mr-1.5" />
                    <span className="text-sm">Watchlist</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 my-2">{article.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{article.source}</span>
                <Button size="sm" variant="outline">Read More</Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>,
    
    // Slide 2: Bought Today
    <div className="h-full flex flex-col">
      <h3 className="text-2xl font-bold mb-6">Bought Today</h3>
      <div className="flex-1 relative">
        {activeBubbleCategory !== null && (
          <button 
            onClick={handleBackToCategories}
            className="text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            ← Back to all categories
          </button>
        )}
        
        <BubbleChart 
          categories={boughtToday} 
          activeCategory={activeBubbleCategory}
          onCategoryClick={handleCategoryClick} 
        />
      </div>
    </div>,
    
    // Slide 3: Sold Today
    <div className="h-full flex flex-col">
      <h3 className="text-2xl font-bold mb-6">Sold Today</h3>
      <div className="flex-1 relative">
        {activeBubbleCategory !== null && (
          <button 
            onClick={handleBackToCategories}
            className="text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            ← Back to all categories
          </button>
        )}
        
        <BubbleChart 
          categories={soldToday} 
          activeCategory={activeBubbleCategory}
          onCategoryClick={handleCategoryClick} 
        />
      </div>
    </div>,
    
    // Slide 4: Your Assets
    <div className="h-full flex flex-col">
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
  ];

  return (
    <StoryCarousel
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      slides={slides}
      title="Your Insights"
      autoAdvanceDuration={8000}
      isPaused={isPaused}
      onPauseChange={setIsPaused}
      onClose={handleClose}
      onSlideChange={handleSlideChange}
    />
  );
};

export default MarketsToday;
