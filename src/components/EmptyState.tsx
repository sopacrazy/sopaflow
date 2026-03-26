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
      <div className="w-16 h-16 rounded-full bg-zinc-900/50 flex items-center justify-center mb-4 border border-zinc-800">
        <Music className="w-8 h-8 text-zinc-500" />
      </div>
      <h3 className="text-lg font-medium text-zinc-200 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm">{description}</p>
    </div>
  );
}
