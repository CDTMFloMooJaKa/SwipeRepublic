
import React from 'react';

interface BubbleProps {
  amount: string;
  label: string;
  color: string;
  size?: number;
}

const Bubble: React.FC<BubbleProps> = ({
  amount,
  label,
  color,
  size = 160
}) => {
  return (
    <div 
      style={{
        backgroundColor: color,
        width: size,
        height: size
      }} 
      className="rounded-full flex flex-col items-center justify-center text-white"
    >
      <span className="text-xl font-bold">{amount}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
};

interface ActivityBubblesProps {
  income: string;
  expenses: string;
  investments: string;
}

const ActivityBubbles: React.FC<ActivityBubblesProps> = ({
  income,
  expenses,
  investments
}) => {
  // Extract numeric values for sizing (remove currency and commas)
  const getNumericValue = (str: string) => {
    return parseFloat(str.replace(/[^0-9.,]/g, '').replace(',', '.'));
  };

  const incomeValue = getNumericValue(income);
  const expensesValue = getNumericValue(expenses);
  const investmentsValue = getNumericValue(investments);

  const total = incomeValue + expensesValue + investmentsValue;
  
  // Base size calculations on relative proportions
  const baseSize = 120;
  const incomeSize = Math.max(baseSize, Math.round(baseSize * 1.2 * (incomeValue / total)));
  const expensesSize = Math.max(baseSize, Math.round(baseSize * 1.2 * (expensesValue / total)));
  const investmentsSize = Math.max(baseSize, Math.round(baseSize * 1.2 * (investmentsValue / total)));

  return (
    <div className="relative h-64 my-8">
      {/* Top row - expenses in the center */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <Bubble 
          amount={expenses} 
          label="Ausgaben" 
          color="hsl(var(--tr-purple))" 
          size={expensesSize} 
        />
      </div>
      
      {/* Bottom row - income on the left, investments on the right */}
      <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2">
        <Bubble 
          amount={income} 
          label="Einnahmen" 
          color="hsl(var(--tr-green))" 
          size={incomeSize} 
        />
      </div>
      
      <div className="absolute bottom-0 right-1/4 transform translate-x-1/2">
        <Bubble 
          amount={investments} 
          label="Investments" 
          color="hsl(var(--tr-blue))" 
          size={investmentsSize} 
        />
      </div>
    </div>
  );
};

export default ActivityBubbles;
