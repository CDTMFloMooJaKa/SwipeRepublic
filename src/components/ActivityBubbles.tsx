
import React from 'react';

interface BubbleProps {
  amount: string;
  label: string;
  color: string;
  size?: number;
}

const Bubble: React.FC<BubbleProps> = ({ amount, label, color, size = 160 }) => {
  return (
    <div 
      className="rounded-full flex flex-col items-center justify-center text-white"
      style={{ 
        backgroundColor: color,
        width: size,
        height: size
      }}
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

const ActivityBubbles: React.FC<ActivityBubblesProps> = ({ income, expenses, investments }) => {
  return (
    <div className="flex items-center justify-center relative h-64 my-8">
      <div className="absolute left-1/4 transform -translate-x-1/2">
        <Bubble 
          amount={income} 
          label="Einnahmen" 
          color="hsl(var(--tr-green))" 
          size={140}
        />
      </div>
      <div className="absolute top-0 right-1/2 transform translate-x-1/2">
        <Bubble 
          amount={expenses} 
          label="Ausgaben" 
          color="hsl(var(--tr-purple))" 
          size={180}
        />
      </div>
      <div className="absolute right-1/4 transform translate-x-1/2 top-1/2">
        <Bubble 
          amount={investments} 
          label="Investments" 
          color="hsl(var(--tr-blue))" 
          size={140}
        />
      </div>
    </div>
  );
};

export default ActivityBubbles;
