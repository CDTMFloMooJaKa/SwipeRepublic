
import React, { useState } from 'react';
import BubbleChart, { Category } from './BubbleChart';
import { Button } from './ui/button';
import { Card } from './ui/card';
import StoryCarousel from './StoryCarousel';
import { Bot } from 'lucide-react';

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
  }
];

// Enhanced mock data for bubble charts with subcategories
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
      { name: "Insurance", percentage: "35%" },
      { name: "Investments", percentage: "20%" }
    ]
  },
  { 
    name: "Consumer Goods", 
    percentage: "12%", 
    color: "#F97316", 
    subcategories: [
      { name: "Food & Beverage", percentage: "50%" },
      { name: "Clothing", percentage: "25%" },
      { name: "Electronics", percentage: "25%" }
    ]
  },
  { 
    name: "Energy", 
    percentage: "8%", 
    color: "#D946EF", 
    subcategories: [
      { name: "Renewable", percentage: "55%" },
      { name: "Oil & Gas", percentage: "30%" },
      { name: "Nuclear", percentage: "15%" }
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
      { name: "Industrial", percentage: "20%" }
    ]
  },
  { 
    name: "Utilities", 
    percentage: "25%", 
    color: "hsl(var(--tr-purple))", 
    subcategories: [
      { name: "Electric", percentage: "50%" },
      { name: "Water", percentage: "30%" },
      { name: "Gas", percentage: "20%" }
    ]
  },
  { 
    name: "Materials", 
    percentage: "23%", 
    color: "#D946EF", 
    subcategories: [
      { name: "Metals", percentage: "40%" },
      { name: "Chemicals", percentage: "35%" },
      { name: "Construction", percentage: "25%" }
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
      { name: "Manufacturing", percentage: "50%" },
      { name: "Transportation", percentage: "30%" },
      { name: "Aerospace", percentage: "20%" }
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
  const [activeBoughtCategory, setActiveBoughtCategory] = useState<number | null>(null);
  const [activeSoldCategory, setActiveSoldCategory] = useState<number | null>(null);
  
  // Handle clicking a bubble category for "Bought Today"
  const handleBoughtCategoryClick = (index: number) => {
    setActiveBoughtCategory(prevActive => prevActive === index ? null : index);
  };
  
  // Handle clicking a bubble category for "Sold Today"
  const handleSoldCategoryClick = (index: number) => {
    setActiveSoldCategory(prevActive => prevActive === index ? null : index);
  };
  
  // Reset active categories when closing the carousel
  React.useEffect(() => {
    if (!isOpen) {
      setActiveBoughtCategory(null);
      setActiveSoldCategory(null);
    }
  }, [isOpen]);
  
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
    </div>,
    
    // Slide 2: Bought Today
    <div className="h-full flex flex-col">
      <h3 className="text-2xl font-bold mb-6">Bought Today</h3>
      <div className="flex-1 relative">
        <BubbleChart 
          categories={boughtToday} 
          activeCategory={activeBoughtCategory}
          onCategoryClick={handleBoughtCategoryClick} 
        />
        
        {activeBoughtCategory !== null && (
          <button 
            onClick={() => setActiveBoughtCategory(null)}
            className="text-sm text-gray-500 hover:text-gray-700 absolute top-0 left-0"
          >
            ← Back to all categories
          </button>
        )}
      </div>
    </div>,
    
    // Slide 3: Sold Today
    <div className="h-full flex flex-col">
      <h3 className="text-2xl font-bold mb-6">Sold Today</h3>
      <div className="flex-1 relative">
        <BubbleChart 
          categories={soldToday} 
          activeCategory={activeSoldCategory}
          onCategoryClick={handleSoldCategoryClick} 
        />
        
        {activeSoldCategory !== null && (
          <button 
            onClick={() => setActiveSoldCategory(null)}
            className="text-sm text-gray-500 hover:text-gray-700 absolute top-0 left-0"
          >
            ← Back to all categories
          </button>
        )}
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
      title="Markets Today"
      autoAdvanceDuration={8000}
    />
  );
};

export default MarketsToday;
