import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ clientSecret, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setError(null);

        try {
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        // You can add billing details here if needed
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
                onError(result.error.message);
            } else {
                onSuccess(result.paymentIntent);
            }
        } catch (err) {
            setError('Payment processing failed');
            onError('Payment processing failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-row">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>
            {error && <div className="payment-error">{error}</div>}
            <button 
                type="submit" 
                disabled={!stripe || isProcessing}
                className="payment-button"
            >
                {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

const PaymentForm = ({ clientSecret, onSuccess, onError }) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm 
                clientSecret={clientSecret}
                onSuccess={onSuccess}
                onError={onError}
            />
        </Elements>
    );
};

export default PaymentForm;