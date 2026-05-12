import { CardSkeleton } from '@/components/loaders';

export default function BlogLoading() {
    return (
        <div className="space-y-8">
            <CardSkeleton lines={3} showImage={true} imageHeight="h-64" />
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <CardSkeleton key={i} lines={2} />
                ))}
            </div>
        </div>
    );
}
