// src/components/SearchBar.tsx
import React, { useState } from "react";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setQuery(inputValue);

    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout to trigger search after 2 seconds of inactivity
    const newTimeoutId = setTimeout(() => {
      onSearch(inputValue);
    }, 2000);

    setTimeoutId(newTimeoutId);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for images..."
        value={query}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;
