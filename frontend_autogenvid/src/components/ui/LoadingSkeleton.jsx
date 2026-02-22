export default function LoadingSkeleton({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="card p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="skeleton h-4 w-3/4 rounded" />
                        <div className="skeleton h-5 w-16 rounded-full" />
                    </div>
                    <div className="skeleton h-3 w-full rounded" />
                    <div className="skeleton h-3 w-5/6 rounded" />
                    <div className="skeleton h-3 w-4/6 rounded" />
                    <div className="flex gap-2 pt-2">
                        <div className="skeleton h-7 w-16 rounded-md" />
                        <div className="skeleton h-7 w-16 rounded-md" />
                        <div className="skeleton h-7 w-16 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    )
}
