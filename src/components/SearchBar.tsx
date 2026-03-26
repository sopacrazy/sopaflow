import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Buscar músicas para foco..." }: SearchBarProps) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-indigo-400 transition-colors" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="block w-full pl-11 pr-10 py-3.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-sm backdrop-blur-sm"
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
