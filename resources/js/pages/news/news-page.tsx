import { RefreshCcw } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

interface NewsPageProps {
    title: string;
    apiEndpoint: string;
    category?: string;
}

const NewsPage = ({ title, apiEndpoint, category }: NewsPageProps) => {
    const { articles } = usePage().props;
    const page_href = `${apiEndpoint}`;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'News',
            href: '/news',
        },
        {
            title: `${title}`,
            href: `${apiEndpoint}`,
        }
    ];

    const [loading, setLoading] = useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        router.visit(`${page_href}`, { only: ['articles'] });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${title} News`} />
            {/* Refresh Wrapper */}
            <div className="flex w-full items-center justify-end p-4 pb-0">
                <button onClick={handleRefresh} className="cursor-pointer">
                    <div className="flex flex-row gap-1">
                        <span className="text-white/75">{loading ? 'Refreshing...' : 'Refresh'}</span>
                        <RefreshCcw size={25} className={loading ? 'animate-spin' : ''} />
                    </div>
                </button>
            </div>
            <div className="flex h-full flex-1 flex-col gap-5 rounded-xl p-4">
                {articles.length > 0 ? (
                    articles.map((article: any, index: number) => (
                        <a href={article.url}>
                            <div 
                                key={index} 
                                className="flex flex-row gap-5 p-4 border rounded-md shadow-sm cursor-pointer"
                            >
                                <img src={article.url_to_image} width="600" height="300" className='rounded-md' />
                                <div className="flex flex-col gap-5">
                                    <h2 className="text-3xl font-semibold">{article.title}</h2>
                                    <div
                                        className="text-white/75"
                                        dangerouslySetInnerHTML={{ __html: article.content }}
                                    />
                                </div>
                            </div>
                        </a>
                    ))
                ) : (
                    <div className="mt-10 flex justify-center">
                        <p>No articles found.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default NewsPage;