import { CardSkeleton } from '@/components/loaders';

export default function ProductDetailLoading() {
    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <CardSkeleton showImage={true} imageHeight="h-96" />
            <div className="space-y-4">
                <CardSkeleton lines={4} />
                <CardSkeleton lines={2} />
            </div>
        </div>
    );
}
