import { router } from "@inertiajs/react";

interface ClosePositionProps {
    positionId: number;
    currentPrice: number;
}

const ClosePositionButton = ({ positionId, currentPrice }: ClosePositionProps) => {
    const closePosition = ({ positionId, currentPrice }: ClosePositionProps) => {
        // Send a POST request to close the position by its ID
        router.post(`/futures/positions/${positionId}/close`, {
            exit_price: currentPrice,  // The price at which the position is closed
        }, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Position closed!');
            },
            onError: (errors) => {
                console.error('Error closing position:', errors);
            },
        });
    };

    return (
        <button
            onClick={() => closePosition({ positionId, currentPrice })}
            className="bg-red-600 text-white px-3 py-1 rounded"
        >
            Close
        </button>
    );
};

export default ClosePositionButton;
