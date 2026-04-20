export function ProductCardSkeleton() {
  return (
    <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="h-48 rounded-3xl bg-zinc-200/80" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded-full bg-zinc-200/80" />
        <div className="h-4 w-1/2 rounded-full bg-zinc-200/80" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-8 w-20 rounded-full bg-zinc-200/80" />
        <div className="h-8 w-10 rounded-full bg-zinc-200/80" />
      </div>
    </div>
  );
}
