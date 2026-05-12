import { ProductSkeleton } from '@/components/loaders';

export default function CollectionsPageLoading() {
    return (
        <div className="space-y-6">
            <div className="h-10 w-40 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
