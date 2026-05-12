import { CardSkeleton } from '@/components/loaders';

export default function CheckoutLoading() {
    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
                <CardSkeleton lines={5} />
                <CardSkeleton lines={5} />
            </div>
            <CardSkeleton lines={6} />
        </div>
    );
}
