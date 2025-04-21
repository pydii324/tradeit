import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BalanceHistoryChart } from './balance_history_chart';
import { Card } from '@/components/ui/card';
import AddBalanceCard from './add-balance-card';
import BalanceValueCard from './balance-value-card';
import EquityCard from './equity-card';

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
                <div className="@container/main p-4">
                    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-1 @5xl/main:grid-cols-3">
                        <AddBalanceCard/>
                        <BalanceValueCard />
                        <EquityCard />
                        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs col-span-full">
                            <BalanceHistoryChart chartData={balance_history} />    
                        </div>
                    </div>
                </div>
        </AppLayout>
    );
}
