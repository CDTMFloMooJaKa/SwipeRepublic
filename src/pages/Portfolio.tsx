import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import PerformanceChart from '@/components/PerformanceChart';
import InvestmentItem from '@/components/InvestmentItem';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AnnualReviewCarousel from '@/components/AnnualReviewCarousel';
import { Card } from '@/components/ui/card';
import MarketsToday from '@/components/MarketsToday';

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
  const chartData = generateChartData();
  const totalValue = "11.286,45 €";
  const change = "▲ 752,18 €";
  return <div className="max-w-md mx-auto pb-24">
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
        
        {/* Scrollable Cards Section */}
        <div className="mt-6 mb-6 overflow-x-auto scrollbar-none">
          <div className="flex gap-3" style={{ paddingBottom: '8px' }}>
            {/* Markets Today Card - Now with updated text positioning */}
            <Card 
              className="p-4 flex flex-col justify-between border rounded-lg hover:bg-gray-50/80 transition-all relative overflow-hidden flex-shrink-0 cursor-pointer"
              style={{
                minHeight: "120px",
                width: "70%", 
                minWidth: "240px"
              }}
              onClick={() => setShowMarketsToday(true)}
            >
              {/* Background image - now using newly provided image */}
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center" 
                style={{
                  backgroundImage: `url('/lovable-uploads/62d7a477-be26-455b-a75e-a9c614db04ac.png')`,
                  opacity: 0.85
                }} 
              />
              
              {/* Overlay to ensure text visibility */}
              <div className="absolute inset-0 bg-black/30 z-10" />
              
              {/* Content with z-index to appear above the background, now aligned to bottom */}
              <div className="relative z-20 h-full flex flex-col justify-end">
                <div>
                  <p className="text-gray-100 text-xs mb-1">See what people buy</p>
                  <h2 className="text-xl font-bold text-white">Markets Today</h2>
                </div>
                <div className="flex items-center justify-end mt-1">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>
            
            {/* Annual Review Card - Now with updated text positioning */}
            <Button 
              variant="outline" 
              className="p-4 h-auto flex flex-col items-start border rounded-lg hover:bg-gray-50/80 transition-all relative overflow-hidden flex-shrink-0"
              onClick={() => setShowAnnualReview(true)} 
              style={{
                minHeight: "120px",
                width: "70%",
                minWidth: "240px"
              }}
            >
              {/* Background image div */}
              <div className="absolute inset-0 z-0 bg-cover bg-center" style={{
                backgroundImage: `url('/lovable-uploads/42dec5de-4be6-487c-902e-1c251e61c932.png')`,
                opacity: 0.8
              }} />
              
              {/* Overlay to ensure text visibility */}
              <div className="absolute inset-0 bg-black/30 z-10" />
              
              {/* Content with z-index to appear above the background, now aligned to bottom */}
              <div className="relative z-20 h-full flex flex-col justify-end w-full">
                <div>
                  <p className="text-gray-100 text-xs mb-1">Discover your financial highlights</p>
                  <h2 className="text-xl font-bold text-white">2025 in Numbers</h2>
                </div>
                <div className="flex items-center justify-end mt-1">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </div>
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Investments</h2>
            <button className="text-gray-400">Tagestrend ▼</button>
          </div>
          
          <div className="mt-4">
            {investments.map(item => <InvestmentItem key={item.name} name={item.name} price={item.price} change={item.change} changePercent={item.changePercent} />)}
          </div>
        </div>
      </div>
      
      <AnnualReviewCarousel 
        isOpen={showAnnualReview} 
        onOpenChange={setShowAnnualReview} 
      />
      
      <MarketsToday 
        isOpen={showMarketsToday}
        onOpenChange={setShowMarketsToday}
      />
      
      <BottomNav />
    </div>;
};
export default Portfolio;
