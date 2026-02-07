import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import Button from '../../components/Btncomponent';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get('payment_id');

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center py-20">
            <div className="max-w-md w-full mx-auto px-6">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 text-center border border-neutral-200 dark:border-neutral-800">
                    <div className="mb-6">
                        <FaCheckCircle className="text-6xl text-green-500 mx-auto" />
                    </div>

                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                        Payment Successful!
                    </h1>

                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        Your booking has been confirmed. You will receive a confirmation email shortly.
                    </p>

                    {paymentId && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-6">
                            Payment ID: {paymentId}
                        </p>
                    )}

                    <div className="flex flex-col gap-3">
                        <Button
                            variant="primary"
                            onClick={() => navigate('/bookings')}
                        >
                            View My Bookings
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/find-mentor')}
                        >
                            Find More Mentors
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
