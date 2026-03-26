import { cn } from "../utils/cn";

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryChips({ categories, selectedCategory, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center my-8">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
          selectedCategory === null
            ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-300"
            : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800/50"
        )}
      >
        Todas
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
            selectedCategory === category
              ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-300"
              : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800/50"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
