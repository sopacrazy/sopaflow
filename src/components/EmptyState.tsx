import { Music } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({ 
  title = "Nenhuma música encontrada", 
  description = "Tente buscar por outra coisa ou selecione uma categoria diferente." 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center mb-4 border border-zinc-200 shadow-sm">
        <Music className="w-8 h-8 text-zinc-400" />
      </div>
      <h3 className="text-lg font-bold text-zinc-800 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm">{description}</p>
    </div>
  );
}
