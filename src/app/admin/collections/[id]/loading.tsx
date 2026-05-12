import { TableSkeleton } from '@/components/loaders';

export default function CollectionDetailLoading() {
    return (
        <div className="space-y-6">
            <div className="h-10 w-32 rounded bg-neutral-200 dark:bg-neutral-700" />
            <TableSkeleton rows={5} columns={3} />
        </div>
    );
}
