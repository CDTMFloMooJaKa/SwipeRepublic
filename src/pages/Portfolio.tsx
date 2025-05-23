import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import PerformanceChart from '@/components/PerformanceChart';
import InvestmentItem from '@/components/InvestmentItem';
import AnnualReviewCarousel from '@/components/AnnualReviewCarousel';
import MarketsToday from '@/components/MarketsToday';
import StoryCard from '@/components/StoryCard';
import Watchlist from '@/components/Watchlist';
import StockSwiper from '@/components/StockSwiper';

// Mock data for the chart
const generateChartData = () => {
  const result = [];
  let value = 10000;
  for (let i = 0; i < 100; i++) {
    value = value + Math.random() * 200 - 100;
    if (value < 9500) value = 9500 + Math.random() * 500;
    if (value > 12000) value = 12000 - Math.random() * 500;
    result.push({
      value
    });
  }
  return result;
};

// Anonymized investments data
const investments = [{
  name: "Global Tech ETF",
  price: "45,23 €",
  change: 0.42,
  changePercent: 0.95
}, {
  name: "Clean Energy Fund",
  price: "28,76 €",
  change: 0.85,
  changePercent: 3.05
}, {
  name: "European Dividend",
  price: "62,19 €",
  change: 0.18,
  changePercent: 0.29
}, {
  name: "Emerging Markets",
  price: "18,45 €",
  change: -0.32,
  changePercent: -1.71
}, {
  name: "Healthcare Innovation",
  price: "36,92 €",
  change: 1.27,
  changePercent: 3.56
}];
const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'1T' | '1W' | '1M' | '1J' | 'Max'>('Max');
  const [showAnnualReview, setShowAnnualReview] = useState(false);
  const [showMarketsToday, setShowMarketsToday] = useState(false);
  const [showStockSwiper, setShowStockSwiper] = useState(false);
  
  const chartData = generateChartData();
  const totalValue = "11.286,45 €";
  const change = "▲ 752,18 €";
  return (
    <div className="max-w-md mx-auto pb-24">
      <Header activeTab="portfolio" />
      
      <div className="p-4">
        <div>
          <p className="text-gray-400">Insgesamt</p>
          <h1 className="text-3xl font-bold mb-1">{totalValue}</h1>
          <p className="text-tr-green">{change}</p>
        </div>
        
        <div className="flex mt-5 mb-2">
          <button className={`period-button ${activeTab === '1T' ? 'active' : ''}`} onClick={() => setActiveTab('1T')}>
            1T
          </button>
          <button className={`period-button ${activeTab === '1W' ? 'active' : ''}`} onClick={() => setActiveTab('1W')}>
            1W
          </button>
          <button className={`period-button ${activeTab === '1M' ? 'active' : ''}`} onClick={() => setActiveTab('1M')}>
            1M
          </button>
          <button className={`period-button ${activeTab === '1J' ? 'active' : ''}`} onClick={() => setActiveTab('1J')}>
            1J
          </button>
          <button className={`period-button ${activeTab === 'Max' ? 'active' : ''}`} onClick={() => setActiveTab('Max')}>
            Max
          </button>
        </div>
        
        <div className="mt-4">
          <PerformanceChart data={chartData} color="hsl(var(--tr-green))" height={240} />
        </div>
        
        {/* Scrollable Cards Section - Removed "Discover Stocks" card */}
        <div className="mt-6 mb-6 overflow-x-auto scrollbar-none">
          <div className="flex gap-3" style={{ paddingBottom: '8px' }}>
            {/* Your Insights Card */}
            <StoryCard
              title="Your Insights"
              subtitle="Stay up to date"
              backgroundImage="/lovable-uploads/62d7a477-be26-455b-a75e-a9c614db04ac.png"
              onClick={() => setShowMarketsToday(true)}
              variant="card"
            />
            
            {/* Annual Review Card */}
            <StoryCard
              title="2025 in Numbers"
              subtitle="Discover your financial highlights"
              backgroundImage="/lovable-uploads/42dec5de-4be6-487c-902e-1c251e61c932.png"
              onClick={() => setShowAnnualReview(true)}
              variant="button"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Investments</h2>
            <button className="text-gray-400">Tagestrend ▼</button>
          </div>
          
          <div className="mt-4">
            {investments.map(item => <InvestmentItem key={item.name} name={item.name} price={item.price} change={item.change} changePercent={item.changePercent} />)}
          </div>
        </div>
        
        {/* Watchlist moved below Investments */}
        <Watchlist />
      </div>
      
      <AnnualReviewCarousel 
        isOpen={showAnnualReview} 
        onOpenChange={setShowAnnualReview} 
      />
      
      <MarketsToday 
        isOpen={showMarketsToday}
        onOpenChange={setShowMarketsToday}
      />
      
      <StockSwiper
        isOpen={showStockSwiper}
        onOpenChange={setShowStockSwiper}
      />
      
      <BottomNav />
    </div>
  );
};

export default Portfolio;
