
import React from 'react';
import StoryCarousel, { StorySlide } from './StoryCarousel';
import ActivityBubbles from './ActivityBubbles';

interface AnnualReviewCarouselProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AnnualReviewCarousel: React.FC<AnnualReviewCarouselProps> = ({ 
  isOpen,
  onOpenChange
}) => {
  // Create slides for the annual review
  const slides: StorySlide[] = [
    {
      title: "Your 2025 Overview",
      content: (
        <div>
          <p className="text-gray-600 mb-8">
            Here's how your finances shaped up in 2025. Let's dive into the key numbers and insights.
          </p>
          
          <ActivityBubbles
            income="48.562,00 €"
            expenses="32.410,00 €"
            investments="11.286,45 €"
          />
          
          <p className="text-gray-600 mt-8">
            You've saved <span className="font-bold">16.152,00 €</span> this year!
          </p>
        </div>
      )
    },
    {
      title: "Investment Growth",
      content: (
        <div>
          <p className="text-gray-600 mb-6">
            Your investments grew by <span className="text-tr-green font-bold">9.2%</span> in 2025, outperforming the market average of 7.4%.
          </p>
          
          <div className="bg-gray-50 p-5 rounded-lg mb-6">
            <h3 className="font-bold mb-3">Top Performing Investments</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Global Tech ETF: <span className="text-tr-green">+18.3%</span></li>
              <li>Clean Energy Fund: <span className="text-tr-green">+15.7%</span></li>
              <li>Healthcare Innovation: <span className="text-tr-green">+12.2%</span></li>
            </ul>
          </div>
          
          <p className="text-gray-600">
            By consistently investing each month, you've built a portfolio worth <span className="font-bold">11.286,45 €</span>.
          </p>
        </div>
      )
    },
    {
      title: "Spending Insights",
      content: (
        <div>
          <p className="text-gray-600 mb-6">
            Here's how your spending breaks down across categories in 2025.
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-1">
                <span>Housing</span>
                <span className="font-bold">38%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-tr-purple h-full rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-1">
                <span>Food & Dining</span>
                <span className="font-bold">22%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-tr-purple h-full rounded-full" style={{ width: '22%' }}></div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-1">
                <span>Transportation</span>
                <span className="font-bold">15%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-tr-purple h-full rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-1">
                <span>Entertainment</span>
                <span className="font-bold">12%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-tr-purple h-full rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-1">
                <span>Other</span>
                <span className="font-bold">13%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-tr-purple h-full rounded-full" style={{ width: '13%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Looking Forward",
      content: (
        <div>
          <p className="text-gray-600 mb-6">
            Based on your 2025 performance, here are some goals for next year:
          </p>
          
          <div className="space-y-5 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold">Increase Emergency Fund</h3>
              <p className="text-gray-600 text-sm mt-1">
                Aim to save 3 more months of expenses in your emergency fund, reaching a 6-month safety net.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold">Diversify Investments</h3>
              <p className="text-gray-600 text-sm mt-1">
                Consider adding more international exposure to your investment portfolio.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold">Reduce Dining Expenses</h3>
              <p className="text-gray-600 text-sm mt-1">
                Your food spending increased 8% from last year. Consider meal planning to reduce costs.
              </p>
            </div>
          </div>
          
          <p className="text-gray-600">
            Keep up the great work! Your financial health improved significantly in 2025.
          </p>
        </div>
      )
    }
  ];
  
  return (
    <StoryCarousel
      title="2025 in Numbers"
      slides={slides}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    />
  );
};

export default AnnualReviewCarousel;
