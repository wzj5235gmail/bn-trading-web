import React, { useState, useEffect, useRef } from "react";
import "./SymbolSearch.css";

import { Order } from "./interfaces";

interface SymbolSearchProps {
  symbols: string[];
  setOrderInfo: (orderInfo: Order) => void;
  orderInfo: Order;
}

const SymbolSearch: React.FC<SymbolSearchProps> = ({
  symbols,
  setOrderInfo,
  orderInfo,
}) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const fuzzyResults = symbols.filter((symbol) =>
        symbol.toLowerCase().includes(query.toLowerCase())
      );
      setResults(fuzzyResults);
    } else {
      setResults([]);
    }
  }, [query, symbols]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleResultClick = (result: string) => {
    setQuery(result);
    setOrderInfo({ ...orderInfo, symbol: result });
    setResults([]);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="fuzzy-search-container" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setOrderInfo({
            ...orderInfo,
            symbol: e.target.value.toUpperCase(),
          });
          handleInputChange(e);
        }}
      />
      {results.length > 0 && (
        <div className="results-dropdown">
          {results.map((result, index) => (
            <div
              key={index}
              className="result-item"
              onClick={() => handleResultClick(result)}
            >
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SymbolSearch;