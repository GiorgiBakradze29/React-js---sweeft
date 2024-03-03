import React, { createContext, useContext, ReactNode, useState } from "react";

interface SearchContextProps {
  children: ReactNode;
}

interface SearchContextValue {
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export const SearchProvider: React.FC<SearchContextProps> = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const addToSearchHistory = (query: string) => {
    if (!searchHistory.includes(query)) {
      setSearchHistory((prevHistory) => [...prevHistory, query]);
    }
  };

  return (
    <SearchContext.Provider value={{ searchHistory, addToSearchHistory }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
