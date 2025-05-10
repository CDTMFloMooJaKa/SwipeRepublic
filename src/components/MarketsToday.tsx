import React, { useContext, useState, useEffect } from 'react';
import BubbleChartView from './BubbleChartView';
import { Button } from './ui/button';
import { Card } from './ui/card';
import StoryCarousel from './StoryCarousel';
import { Bot, Bookmark, Loader2 } from 'lucide-react';
import { WatchlistContext } from '../contexts/WatchlistContext';
import { ScrollArea } from './ui/scroll-area';
import { Category } from './BubbleChart';

// Sample news articles for each stock
const stockNewsMap = {
  1: { // Tesla
    title: "Tesla Unveils Next-Gen Battery Technology",
    description: "The new battery promises 30% more rajknge and faster charging capabilities.",
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

// Mock data for bubble charts - kept as fallback
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
  const { watchlist } = useContext(WatchlistContext);
  const [boughtData, setBoughtData] = useState<Category[]>(boughtToday);
  const [soldData, setSoldData] = useState<Category[]>(soldToday);
  const [isLoading, setIsLoading] = useState(true);
  
  // Define available colors to assign
  const categoryColors = [
    "hsl(var(--tr-blue))",
    "hsl(var(--tr-green))",
    "hsl(var(--tr-purple))",
    "#F97316",
    "#D946EF",
    "#34D399", // Emerald Green
    "#60A5FA", // Sky Blue
    "#FBBF24", // Amber
    "#F87171", // Red
    "#A78BFA"  // Violet
  ];
  
  // Add colors to categories
  const addColorsToCategories = (categories: any[]): Category[] => {
    return categories.map((category, index) => ({
      ...category,
      color: categoryColors[index % categoryColors.length] // Cycle through colors
    }));
  };
  
  // Fetch data from the endpoint
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://cdtmbackend.onrender.com/load_top_investments');
        const data = await response.json();
        
        // Add colors to the fetched data
        const boughtWithColors = addColorsToCategories(data.bought);
        const soldWithColors = addColorsToCategories(data.sold);
        
        setBoughtData(boughtWithColors);
        setSoldData(soldWithColors);
      } catch (error) {
        console.error('Error fetching investment data:', error);
        // Fallback to mock data if fetch fails
        setBoughtData(boughtToday);
        setSoldData(soldToday);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
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
  
  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      <span className="ml-2 text-gray-500">Loading data...</span>
    </div>
  );
  
  // Define the slide contents
  const slides = [
    // Slide 1: News Today
    <div className="h-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">News Today</h3>
        <div className="flex items-center text-gray-500 mt-1">
          <Bot className="h-4 w-4 mr-1.5" />
          <span className="text-sm">Selected for you</span>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100%-6rem)]">
        <div className="space-y-4 pr-4 pb-4">
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
    
    // Slide 2: Bought Today - Updated with dynamic data
    <div className="h-full">
      <div className="mb-4">
        <h3 className="text-2xl font-bold">Bought Today</h3>
        <p className="text-gray-500 mt-1">People today have bought...</p>
      </div>
      <div className="flex-grow relative">
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <BubbleChartView
            categories={boughtData}
            title=""
            isOpen={isOpen}
          />
        )}
      </div>
    </div>,
    
    // Slide 3: Sold Today - Updated with dynamic data
    <div className="h-full">
      <div className="mb-4">
        <h3 className="text-2xl font-bold">Sold Today</h3>
        <p className="text-gray-500 mt-1">People today have sold...</p>
      </div>
      <div className="flex-grow relative">
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <BubbleChartView
            categories={soldData}
            title=""
            isOpen={isOpen}
          />
        )}
      </div>
    </div>,
    
    // Slide 4: Your Assets
    <div className="h-full">
      <h3 className="text-2xl font-bold mb-6">Your Assets</h3>
      <div className="space-y-4">
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
    />
  );
};

export default MarketsToday;