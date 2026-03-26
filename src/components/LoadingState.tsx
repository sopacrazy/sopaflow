export function LoadingState() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 p-3 rounded-2xl bg-zinc-900/20 animate-pulse">
            <div className="aspect-square w-full rounded-xl bg-zinc-800/50" />
            <div className="flex flex-col gap-2 px-1">
              <div className="h-4 w-3/4 bg-zinc-800/50 rounded" />
              <div className="h-3 w-1/2 bg-zinc-800/50 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
