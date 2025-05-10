
import React from 'react';
import { ExternalLink } from 'lucide-react';
import StoryCarousel, { StorySlide } from './StoryCarousel';
import { Button } from '@/components/ui/button';
import BubbleChart, { Category } from './BubbleChart';
import InvestmentItem from './InvestmentItem';

// Mock news articles
const newsArticles = [
  {
    title: "Global Markets See Unexpected Surge",
    description: "Markets rallied after central banks announced new stimulus measures.",
    source: "Financial Times"
  },
  {
    title: "Tech Stocks Continue Record-Breaking Streak",
    description: "Major tech companies reported stronger than expected earnings.",
    source: "Wall Street Journal" 
  },
  {
    title: "Green Energy Investments Surge Amid Policy Shifts",
    description: "Renewable energy stocks are seeing increased interest following new policies.",
    source: "Bloomberg"
  },
  {
    title: "European Markets React to ECB Announcement",
    description: "European stocks showed mixed reactions to the latest ECB policy decision.",
    source: "Reuters"
  }
];

// Mock data for bought/sold bubbles
const boughtCategories: Category[] = [
  {
    name: "Technology",
    percentage: "42%",
    color: "#f89c5e",
    subcategories: [
      { name: "Software", percentage: "55%" },
      { name: "Hardware", percentage: "25%" },
      { name: "Cloud Services", percentage: "20%" }
    ]
  },
  {
    name: "Healthcare",
    percentage: "26%",
    color: "#b066f7",
    subcategories: [
      { name: "Pharmaceuticals", percentage: "40%" },
      { name: "Medical Devices", percentage: "35%" },
      { name: "Healthcare Services", percentage: "25%" }
    ]
  },
  {
    name: "Finance",
    percentage: "18%",
    color: "#6dcff6",
    subcategories: [
      { name: "Banking", percentage: "45%" },
      { name: "Insurance", percentage: "30%" },
      { name: "Fintech", percentage: "25%" }
    ]
  },
  {
    name: "Consumer Goods",
    percentage: "14%",
    color: "#e8ed69",
    subcategories: [
      { name: "Food & Beverage", percentage: "50%" },
      { name: "Apparel", percentage: "30%" },
      { name: "Home Products", percentage: "20%" }
    ]
  }
];

const soldCategories: Category[] = [
  {
    name: "Real Estate",
    percentage: "38%",
    color: "#e8ed69",
    subcategories: [
      { name: "Residential", percentage: "45%" },
      { name: "Commercial", percentage: "35%" },
      { name: "REITs", percentage: "20%" }
    ]
  },
  {
    name: "Energy",
    percentage: "27%",
    color: "#6dcff6",
    subcategories: [
      { name: "Oil & Gas", percentage: "55%" },
      { name: "Utilities", percentage: "30%" },
      { name: "Alternative Energy", percentage: "15%" }
    ]
  },
  {
    name: "Materials",
    percentage: "21%",
    color: "#f89c5e",
    subcategories: [
      { name: "Chemicals", percentage: "40%" },
      { name: "Metals & Mining", percentage: "35%" },
      { name: "Packaging", percentage: "25%" }
    ]
  },
  {
    name: "Industrials",
    percentage: "14%",
    color: "#b066f7",
    subcategories: [
      { name: "Manufacturing", percentage: "50%" },
      { name: "Transportation", percentage: "30%" },
      { name: "Aerospace", percentage: "20%" }
    ]
  }
];

// Mock data for top performing assets
const assets = [
  {
    name: "Clean Energy ETF",
    price: "82,37 €",
    change: 1.86,
    changePercent: 2.31,
    increased: true
  },
  {
    name: "Tech Innovation Fund",
    price: "124,59 €",
    change: 3.42,
    changePercent: 2.82,
    increased: true
  },
  {
    name: "European Real Estate",
    price: "45,82 €",
    change: -1.28,
    changePercent: -2.72,
    increased: false
  },
  {
    name: "Global Banks Index",
    price: "38,91 €",
    change: -1.53,
    changePercent: -3.78,
    increased: false
  }
];

interface MarketsTodayProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MarketsToday: React.FC<MarketsTodayProps> = ({ isOpen, onOpenChange }) => {
  // Create slides for the story carousel
  const slides: StorySlide[] = [
    // News Today slide
    {
      title: "News Today",
      content: (
        <div className="space-y-5">
          {newsArticles.map((article, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg">{article.title}</h3>
              <p className="text-gray-600 mt-1 text-sm">{article.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500">{article.source}</span>
                <Button size="sm" className="gap-1" variant="outline">
                  <span>Read</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )
    },
    // Bought Today slide
    {
      title: "Bought Today",
      content: (
        <div className="h-[60vh] relative">
          <BubbleChart
            categories={boughtCategories}
            activeCategory={null}
            onCategoryClick={() => {}}
          />
        </div>
      )
    },
    // Sold Today slide
    {
      title: "Sold Today",
      content: (
        <div className="h-[60vh] relative">
          <BubbleChart
            categories={soldCategories}
            activeCategory={null}
            onCategoryClick={() => {}}
          />
        </div>
      )
    },
    // Your Assets slide
    {
      title: "Your Assets",
      content: (
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="mb-3">
              <h3 className="font-medium text-green-600">Biggest Increases</h3>
              {assets.filter(asset => asset.increased).map((asset, index) => (
                <InvestmentItem
                  key={index}
                  name={asset.name}
                  price={asset.price}
                  change={asset.change}
                  changePercent={asset.changePercent}
                />
              ))}
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-red-600">Biggest Decreases</h3>
              {assets.filter(asset => !asset.increased).map((asset, index) => (
                <InvestmentItem
                  key={index}
                  name={asset.name}
                  price={asset.price}
                  change={asset.change}
                  changePercent={asset.changePercent}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mb-10">
            <Button className="w-full py-6 text-lg">Trade Now</Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <StoryCarousel
      title="Markets Today"
      slides={slides}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    />
  );
};

export default MarketsToday;
