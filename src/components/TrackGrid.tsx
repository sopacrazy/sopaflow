import { ReactNode } from "react";

interface TrackGridProps {
  children: ReactNode;
  title?: string;
}

export function TrackGrid({ children, title }: TrackGridProps) {
  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {children}
      </div>
    </div>
  );
}
