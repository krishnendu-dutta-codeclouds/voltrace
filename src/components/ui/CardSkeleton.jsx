/**
 * CardSkeleton — PLP loading placeholder (Tailwind CSS v4).
 */
export default function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-[20px] overflow-hidden bg-surface-alt" aria-hidden="true">
      {/* Media area */}
      <div className="skeleton-shimmer aspect-[4/3] w-full" />
      {/* Body */}
      <div className="flex flex-col gap-2 p-4">
        <div className="skeleton-shimmer h-4 w-3/4 rounded-full" />
        <div className="skeleton-shimmer h-3 w-1/2 rounded-full" />
        <div className="skeleton-shimmer h-3 w-1/3 rounded-full" />
      </div>
    </div>
  );
}
