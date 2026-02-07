import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import Button from '../../components/Btncomponent';

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center py-20">
            <div className="max-w-md w-full mx-auto px-6">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 text-center border border-neutral-200 dark:border-neutral-800">
                    <div className="mb-6">
                        <FaTimesCircle className="text-6xl text-red-500 mx-auto" />
                    </div>

                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                        Payment Failed
                    </h1>

                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        Unfortunately, your payment could not be processed. Please try again or contact support if the problem persists.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button
                            variant="primary"
                            onClick={() => navigate('/find-mentor')}
                        >
                            Try Again
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                        >
                            Go to Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
