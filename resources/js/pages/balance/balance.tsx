import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BalanceHistoryChart } from '@/components/charts/balance-history-chart';

export default function Balance() {
    const { balance_history } = usePage().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Balance',
            href: '/balance',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Balance" />
            <div className="grid grid-cols-3 grid-rows-4 h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <BalanceHistoryChart chartData={balance_history} />
            </div>
        </AppLayout>
    );
}
