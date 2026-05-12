import { DashboardSkeleton } from '@/components/loaders';

export default function DashboardLoading() {
    return <DashboardSkeleton showHeader={true} cardCount={4} showChart={true} />;
}
