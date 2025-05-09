
import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import PerformanceChart from '@/components/PerformanceChart';
import InvestmentItem from '@/components/InvestmentItem';

// Mock data for the chart
const generateChartData = () => {
  const result = [];
  let value = 9000;
  
  for (let i = 0; i < 100; i++) {
    value = value + Math.random() * 200 - 100;
    if (value < 8500) value = 8500 + Math.random() * 500;
    if (value > 11000) value = 11000 - Math.random() * 500;
    result.push({ value });
  }
  
  return result;
};

// Mock investments data
const investments = [
  { name: "FTSE India USD (Acc)", price: "38,39 €", change: 0.38, changePercent: 1.00 },
  { name: "TDK", price: "9,58 €", change: 0.20, changePercent: 2.13 },
  { name: "RWE", price: "32,56 €", change: 0.06, changePercent: 0.18 },
  { name: "Intel", price: "43,21 €", change: 1.50, changePercent: 3.59 },
  { name: "E.ON", price: "15,48 €", change: -0.005, changePercent: -0.03 },
];

const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'1T' | '1W' | '1M' | '1J' | 'Max'>('Max');
  const chartData = generateChartData();
  const totalValue = "10.425,99 €";
  const change = "▲ 1.807,72 €";
  
  return (
    <div className="max-w-md mx-auto pb-24">
      <Header activeTab="portfolio" />
      
      <div className="p-4">
        <div>
          <p className="text-gray-400">Insgesamt</p>
          <h1 className="text-3xl font-bold mb-1">{totalValue}</h1>
          <p className="text-[hsl(var(--tr-green))]">{change}</p>
        </div>
        
        <div className="flex mt-5 mb-2">
          <button 
            className={`period-button ${activeTab === '1T' ? 'active' : ''}`}
            onClick={() => setActiveTab('1T')}
          >
            1T
          </button>
          <button 
            className={`period-button ${activeTab === '1W' ? 'active' : ''}`}
            onClick={() => setActiveTab('1W')}
          >
            1W
          </button>
          <button 
            className={`period-button ${activeTab === '1M' ? 'active' : ''}`}
            onClick={() => setActiveTab('1M')}
          >
            1M
          </button>
          <button 
            className={`period-button ${activeTab === '1J' ? 'active' : ''}`}
            onClick={() => setActiveTab('1J')}
          >
            1J
          </button>
          <button 
            className={`period-button ${activeTab === 'Max' ? 'active' : ''}`}
            onClick={() => setActiveTab('Max')}
          >
            Max
          </button>
        </div>
        
        <div className="mt-4">
          <PerformanceChart 
            data={chartData} 
            color="hsl(var(--tr-green))" 
            height={240}
          />
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Investments</h2>
            <button className="text-gray-400">Tagestrend ▼</button>
          </div>
          
          <div className="mt-4">
            {investments.map((item) => (
              <InvestmentItem 
                key={item.name}
                name={item.name}
                price={item.price}
                change={item.change}
                changePercent={item.changePercent}
              />
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Portfolio;
