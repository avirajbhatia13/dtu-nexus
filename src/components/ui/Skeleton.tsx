/**
 * Shimmer placeholders shown while data loads. Mirrors the shape of the real
 * content so the page doesn't jump when it arrives.
 */

export function SkeletonCard() {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="skeleton h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <div className="skeleton h-3 w-32 rounded" />
                    <div className="skeleton h-2.5 w-20 rounded" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-11/12 rounded" />
                <div className="skeleton h-3 w-2/3 rounded" />
            </div>
            <div className="flex gap-4 mt-4 pt-3 border-t border-slate-50">
                <div className="skeleton h-3 w-12 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
            </div>
        </div>
    );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4" aria-busy="true" aria-live="polite">
            <span className="sr-only">Loading…</span>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}
