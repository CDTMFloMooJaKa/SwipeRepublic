
import React, { useContext } from 'react';
import { WatchlistContext } from '../contexts/WatchlistContext';
import { Card, CardContent } from './ui/card';
import { motion, PanInfo, useAnimation } from 'framer-motion';

const Watchlist: React.FC = () => {
  const { watchlist, removeFromWatchlist } = useContext(WatchlistContext);

  if (watchlist.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-3">Watchlist</h2>
        <p className="text-gray-500 text-sm">No stocks in your watchlist yet. Swipe right on stocks you like to add them here.</p>
      </div>
    );
  }

  const handleSwipe = (stockId: number, info: PanInfo) => {
    const threshold = 100; // Minimum swipe distance to trigger removal
    
    if (Math.abs(info.offset.x) > threshold) {
      removeFromWatchlist(stockId);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-3">Watchlist</h2>
      <div className="space-y-3">
        {watchlist.map(stock => (
          <motion.div
            key={stock.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => handleSwipe(stock.id, info)}
            className="relative overflow-hidden"
            whileDrag={{ 
              scale: 0.98,
            }}
            style={{ touchAction: 'none' }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center">
                  <div 
                    className="h-10 w-10 rounded bg-center bg-cover mr-3" 
                    style={{ backgroundImage: `url(${stock.image})` }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{stock.name}</p>
                        <p className="text-xs text-gray-500">{stock.ticker}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{stock.price}</p>
                        <p className={`text-xs ${stock.change >= 0 ? 'text-tr-green' : 'text-red-500'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
