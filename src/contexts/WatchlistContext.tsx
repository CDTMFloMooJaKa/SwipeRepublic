
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Stock, stocks } from '../components/StockSwiper';

// Empty default watchlist
const defaultWatchlistStocks: Stock[] = [];

interface WatchlistContextType {
  watchlist: Stock[];
  addToWatchlist: (stock: Stock) => void;
  removeFromWatchlist: (stockId: number) => void;
}

export const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  addToWatchlist: () => {},
  removeFromWatchlist: () => {},
});

export const WatchlistProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<Stock[]>(defaultWatchlistStocks);

  const addToWatchlist = (stock: Stock) => {
    setWatchlist(prev => {
      // Check if the stock is already in the watchlist
      if (!prev.some(item => item.id === stock.id)) {
        return [...prev, stock];
      }
      return prev;
    });
  };

  const removeFromWatchlist = (stockId: number) => {
    setWatchlist(prev => prev.filter(stock => stock.id !== stockId));
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
