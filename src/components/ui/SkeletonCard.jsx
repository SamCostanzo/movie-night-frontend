export default function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-surface border border-border animate-pulse">
      {/* Poster placeholder */}
      <div className="aspect-[2/3] bg-surface-alt" />

      {/* Info placeholder */}
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 bg-surface-alt rounded-full w-3/4" />
        <div className="h-3 bg-surface-alt rounded-full w-1/2" />
      </div>
    </div>
  );
}
