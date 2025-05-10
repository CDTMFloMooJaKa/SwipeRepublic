
import React, { useState } from 'react';
import BubbleChart, { Category } from './BubbleChart';
import { Button } from './ui/button';
import { Card } from './ui/card';
import StoryCarousel from './StoryCarousel';

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
  const [activeBubbleCategory, setActiveBubbleCategory] = useState<number | null>(null);
  
  // Handle clicking a bubble category
  const handleCategoryClick = (index: number) => {
    setActiveBubbleCategory(activeBubbleCategory === index ? null : index);
  };
  
  // Define the slide contents
  const slides = [
    // Slide 1: News Today
    <div className="h-full flex flex-col">
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
    </div>,
    
    // Slide 2: Bought Today
    <div className="h-full flex flex-col">
      <h3 className="text-2xl font-bold mb-6">Bought Today</h3>
      <div className="flex-1 relative">
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
      title="Markets Today"
      autoAdvanceDuration={8000}
    />
  );
};

export default MarketsToday;
