
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import BubbleChart, { Category } from './BubbleChart';
import { useBubbleChart } from '@/hooks/useBubbleChart';

interface BubbleChartViewProps {
  categories: Category[];
  title: string;
  isOpen: boolean;
}

const BubbleChartView: React.FC<BubbleChartViewProps> = ({
  categories,
  title,
  isOpen
}) => {
  const {
    activeCategory,
    handleCategoryClick,
    handleBackToCategories
  } = useBubbleChart(categories, isOpen);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex-grow relative">
        {activeCategory !== null && (
          <button 
            onClick={handleBackToCategories}
            className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to all categories
          </button>
        )}
        <div className="h-full">
          <BubbleChart
            categories={categories}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </div>
    </div>
  );
};

export default BubbleChartView;
