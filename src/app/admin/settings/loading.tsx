import { DashboardSkeleton } from '@/components/loaders';

export default function SettingsLoading() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="mb-2 h-8 w-40 rounded bg-neutral-200 dark:bg-neutral-700" />
                <p className="h-4 w-96 rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>
            <DashboardSkeleton showHeader={false} cardCount={1} showChart={false} />
        </div>
    );
}
