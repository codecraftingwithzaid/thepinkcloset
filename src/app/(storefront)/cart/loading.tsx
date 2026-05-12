import { CardSkeleton } from '@/components/loaders';

export default function CartLoading() {
    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <CardSkeleton key={i} lines={2} showImage={true} imageHeight="h-24" />
                ))}
            </div>
            <CardSkeleton lines={5} />
        </div>
    );
}
