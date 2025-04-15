import { RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function RefreshButton() {
    const [loading, setLoading] = useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        try {
            await Inertia.post('/fetch-forex-news');
            alert('News refreshed!');
        } catch (error) {
            console.error('Error refreshing news:', error);
            alert('Failed to refresh news.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleRefresh} className="cursor-pointer" disabled={loading}>
            <div className="flex flex-row gap-1 items-center">
                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                <RefreshCcw size={25} className={loading ? 'animate-spin' : ''} />
            </div>
        </button>
    );
}