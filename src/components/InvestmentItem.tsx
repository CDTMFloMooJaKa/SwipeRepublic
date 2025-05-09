
import React from 'react';

interface InvestmentItemProps {
  logo?: string;
  name: string;
  price: string;
  change: number;
  changePercent: number;
}

const InvestmentItem: React.FC<InvestmentItemProps> = ({ logo, name, price, change, changePercent }) => {
  const isPositive = changePercent >= 0;
  
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        {logo ? (
          <img src={logo} alt={name} className="w-8 h-8 mr-4" />
        ) : (
          <div className="w-8 h-8 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-bold text-base">{name}</h3>
          <p className="text-gray-500">{price}</p>
        </div>
      </div>
      <div className={isPositive ? 'increase' : 'decrease'}>
        <span className="font-medium text-base">
          {isPositive ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export default InvestmentItem;
