import { CardSkeleton } from '@/components/loaders';

export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            <div className="h-10 w-40 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <CardSkeleton key={i} lines={3} />
                ))}
            </div>
        </div>
    );
}
