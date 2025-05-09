
import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ActivityBubbles from '@/components/ActivityBubbles';
import TransactionItem from '@/components/TransactionItem';
import { ChevronRight } from 'lucide-react';

// Mock transactions data
const transactions = [
  { name: "Lovable", date: "9. Mai", status: "Kartenprüfung", amount: "0,00 €" },
  { name: "Google Chrome", date: "9. Mai", status: "Kartenprüfung", amount: "0,00 €" },
  { name: "Kai Ponel", date: "9. Mai", status: "Gesendet", amount: "700,00 €", isPositive: true },
];

const Cash: React.FC = () => {
  const [activeMonth, setActiveMonth] = useState<'Jan' | 'Feb' | 'Mär' | 'Apr' | 'Mai'>('Jan');
  const months: Array<'Jan' | 'Feb' | 'Mär' | 'Apr' | 'Mai'> = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai'];
  
  return (
    <div className="max-w-md mx-auto pb-24">
      <Header activeTab="cash" />
      
      <div className="p-4">
        <div>
          <p className="text-gray-400">Verfügbar</p>
          <h1 className="text-3xl font-bold mb-1">344,53 €</h1>
        </div>
        
        <div className="flex mt-5 mb-4">
          {months.map((month) => (
            <button 
              key={month}
              className={`period-button ${activeMonth === month ? 'active' : ''}`}
              onClick={() => setActiveMonth(month)}
            >
              {month}
            </button>
          ))}
        </div>
        
        <ActivityBubbles 
          income="75 €"
          expenses="1.040 €"
          investments="90 €"
        />
        
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Transaktionen</h2>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
          
          <div className="mt-4">
            {transactions.map((item) => (
              <TransactionItem 
                key={item.name}
                name={item.name}
                date={item.date}
                status={item.status}
                amount={item.amount}
                isPositive={item.isPositive}
              />
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Cash;
