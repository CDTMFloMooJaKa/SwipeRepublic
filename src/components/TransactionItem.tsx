
import React from 'react';

interface TransactionItemProps {
  logo?: string;
  name: string;
  date: string;
  status: string;
  amount: string;
  isPositive?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  logo, 
  name, 
  date, 
  status, 
  amount,
  isPositive = false
}) => {
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
          <p className="text-gray-400 text-sm">{date} · {status}</p>
        </div>
      </div>
      <div className={isPositive ? "text-green-500" : ""}>
        <span className="font-medium">{amount}</span>
      </div>
    </div>
  );
};

export default TransactionItem;
