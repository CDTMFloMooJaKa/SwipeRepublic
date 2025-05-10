import React from 'react';
import { ArrowRight, Share } from 'lucide-react';
import { Button } from './ui/button';
import StoryCarousel from './StoryCarousel';
import BubbleChartView from './BubbleChartView';
import { BarChart, Bar, XAxis, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { Category } from '@/components/BubbleChart';

// Investment focus data
const investmentCategories: Category[] = [
  {
    name: "Technology",
    percentage: "53%",
    color: "#f89c5e",
    subcategories: [
      { name: "Software", percentage: "50%" },
      { name: "Hardware", percentage: "30%" },
      { name: "Cloud Services", percentage: "20%" }
    ]
  },
  {
    name: "Consumer Goods",
    percentage: "22%",
    color: "#d9d9d9",
    subcategories: [
      { name: "Food & Beverage", percentage: "45%" },
      { name: "Clothing", percentage: "35%" },
      { name: "Electronics", percentage: "20%" }
    ]
  },
  {
    name: "Healthcare",
    percentage: "14%",
    color: "#b066f7",
    subcategories: [
      { name: "Pharmaceuticals", percentage: "40%" },
      { name: "Medical Devices", percentage: "35%" },
      { name: "Healthcare Services", percentage: "25%" }
    ]
  },
  {
    name: "Infrastructure",
    percentage: "6%",
    color: "#e8ed69",
    subcategories: [
      { name: "Transportation", percentage: "40%" },
      { name: "Energy", percentage: "35%" },
      { name: "Utilities", percentage: "25%" }
    ]
  },
  {
    name: "Sustainability",
    percentage: "5%",
    color: "#6dcff6",
    subcategories: [
      { name: "Renewable Energy", percentage: "60%" },
      { name: "Water Conservation", percentage: "25%" },
      { name: "Green Buildings", percentage: "15%" }
    ]
  }
];

// Spending categories data
const spendingCategories = [
  { name: "Shopping", amount: "1.500€", percentage: 40 },
  { name: "Errands", amount: "800€", percentage: 10 },
  { name: "Restaurants", amount: "650€", percentage: 5 },
  { name: "Entertainment", amount: "450€", percentage: 30 },
  { name: "Transport", amount: "350€", percentage: 15 }
];

// Helper function to determine status based on percentage
const getStatusFromPercentage = (percentage: number): string => {
  if (percentage >= 30) return `Highest ${percentage}%`;
  if (percentage <= 10) return `Lowest ${percentage}%`;
  return `Average ${percentage}%`;
};

// Helper function to calculate future value based on present value, interest rate, and years
const calculateFutureValue = (presentValue: number, interestRate: number, years: number): number => {
  return Math.round(presentValue * Math.pow(1 + interestRate, years));
};

// Performance comparison data for the bar chart
const performanceData = [
  {
    name: 'Your portfolio',
    value: 7.2,
    color: 'url(#portfolioGradient)'
  },
  {
    name: 'MSCI World',
    value: 5.9,
    color: '#8E9196'
  }
];

// Awards data - Updated for a more minimalistic design
const awards = [
  {
    title: "Long-Term Vision",
    description: "You stayed invested despite market turbulences",
    icon: "🏆",
  },
  {
    title: "Consistent Saver",
    description: "You saved money every month this year",
    icon: "🌟",
  },
  {
    title: "Diversification Expert",
    description: "Your portfolio spans multiple asset classes",
    icon: "🎯",
  },
  {
    title: "Smart Investor",
    description: "Your returns beat the market average",
    icon: "🧠",
  }
];

interface AnnualReviewCarouselProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AnnualReviewCarousel: React.FC<AnnualReviewCarouselProps> = ({ 
  isOpen, 
  onOpenChange 
}) => {
  // Share handler function
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My 2025 Investment Awards',
        text: 'Check out my investment achievements from 2025!',
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      console.log('Web Share API not supported');
      // Fallback to copy to clipboard
      navigator.clipboard.writeText('Check out my investment achievements from 2025: ' + window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  // Define the slide contents
  const slides = [
    // Slide 1: Your Investment Focus
    <BubbleChartView 
      key="investment-focus"
      categories={investmentCategories}
      title="Your Investment Focus"
      isOpen={isOpen}
    />,
    
    // Slide 2: Your Spending
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Your Spending</h2>
      <div className="flex-grow">
        <div className="text-xl mb-2">You spent <span className="font-bold">3.750€</span></div>
        <p className="text-gray-600 mb-6">These are your top categories:</p>
        <div className="space-y-5">
          {spendingCategories.map((category, index) => {
            const amountNumber = parseFloat(category.amount.replace('€', '').replace('.', '').replace(',', '.'));
            const totalAmount = 3750;
            const widthPercentage = (amountNumber / totalAmount) * 100;
            const status = getStatusFromPercentage(category.percentage);
            
            return (
              <div key={index} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">{index + 1}.</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{category.amount}</div>
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" 
                    style={{ width: `${widthPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {status}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    
    // Slide 3: Saveback
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Saveback</h2>
      <div className="flex-grow flex flex-col justify-center items-center text-center">
        {/* Current value section */}
        <div className="text-5xl font-bold mb-1">285€</div>
        <p className="text-xl mb-8">collected with Saveback</p>
        
        {/* Future value section */}
        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-1">
          {calculateFutureValue(285, 0.07, 40)}€
        </div>
        <p className="text-xl mb-8">when you retire</p>
        
        <p className="text-xs text-gray-500 mb-8 text-center max-w-xs">
          Calculations based on a retirement age of 65 with an annual return of 7%. Taxes not included.
        </p>
        
        <Button 
          className="w-full mt-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white"
        >
          Invest more to close the pension gap
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>,
    
    // Slide 4: RoundUp
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">RoundUp</h2>
      <div className="flex-grow flex flex-col justify-center items-center text-center">
        {/* Current value section */}
        <div className="text-5xl font-bold mb-1">324€</div>
        <p className="text-xl mb-8">collected with RoundUp</p>
        
        {/* Future value section */}
        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-1">
          {calculateFutureValue(324, 0.07, 40)}€
        </div>
        <p className="text-xl mb-8">when you retire</p>
        
        <p className="text-xs text-gray-500 mb-8 text-center max-w-xs">
          Calculations based on a retirement age of 65 with an annual return of 7%. Taxes not included.
        </p>
        
        <Button 
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
        >
          Invest more to close the pension gap
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>,
    
    // Slide 5: Investment Performance
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Investment Performance</h2>
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="text-5xl font-bold text-tr-green mb-3">+7.2%</div>
        <p className="text-center mb-8">
          Your investments went up <span className="font-bold">7.2%</span> this year.<br/>
          <span className="text-tr-green">You beat the MSCI World Index by 1.3%</span>
        </p>
        
        <div className="w-full">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={200}
                data={performanceData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barSize={40}
              >
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{fontSize: 14, fontWeight: 500}}
                />
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    formatter={(value: number) => `${value}%`}
                    style={{ fontWeight: 'bold' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>,
    
    // Updated Slide 6: Your Investment Awards - more minimalistic design
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Your Investment Awards</h2>
      <div className="flex-grow">
        <div className="space-y-5">
          {awards.map((award, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center">
              <div className="text-2xl w-10 h-10 flex items-center justify-center shrink-0 mr-4">
                {award.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg">{award.title}</h3>
                <p className="text-sm text-gray-600">{award.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={handleShare}
            variant="outline"
            className="px-6 flex items-center gap-2"
          >
            Share your achievements
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  ];
  
  return (
    <StoryCarousel
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      slides={slides}
      title="2025 in Numbers"
      autoAdvanceDuration={10000} // 10 seconds per slide for this carousel
    />
  );
};

export default AnnualReviewCarousel;
