import { ProductSkeleton } from '@/components/loaders';

export default function ShopLoading() {
    return (
        <div className="space-y-6">
            <div className="h-10 w-40 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
