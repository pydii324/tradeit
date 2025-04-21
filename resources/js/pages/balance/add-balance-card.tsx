import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button'; // ShadCN provides Button and Input components.
import { Card } from '@/components/ui/card';
import { router } from '@inertiajs/react';

const AddBalanceCard = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post('/balance/add', {
            amount: amount,
        }, {
            onSuccess: (response) => {
                console.log('Balance updated successfully:', response);
                // Optionally, update local state or UI after success
            },
            onError: (error) => {
                console.error('Error updating balance:', error);
            }
        });
    };

    return (
        <Card className="flex flex-col p-4 shadow-lg">
            <h3 className="text-xl font-semibold">Add to Balance</h3>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="border border-gray-300 rounded p-2"
                    min="0"
                    step="any"
                />
                <Button
                    type="submit"
                    className="bg-blue-500 text-white rounded p-2 disabled:bg-blue-200"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Add Balance'}
                </Button>
                {message && (
                    <p className={`mt-2 ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
            </form>
        </Card>
    );
};

export default AddBalanceCard;
