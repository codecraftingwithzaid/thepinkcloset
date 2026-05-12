import { TableSkeleton } from '@/components/loaders';

export default function NotificationsLoading() {
    return (
        <div className="space-y-6">
            <div className="h-10 w-40 rounded bg-neutral-200 dark:bg-neutral-700" />
            <TableSkeleton rows={5} columns={4} />
        </div>
    );
}
