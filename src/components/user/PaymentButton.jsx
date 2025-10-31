import React, { useEffect, useState } from "react";
import { fetchFitnessProgramWithId } from "../../api/admin/fitnessPrograms";
import { useParams } from "react-router-dom";
import { orderPayment, verifyPayment } from "../../api/user/paymentGateway";
import { useSelector } from "react-redux";
import LogInHeader from "../LogInHeader";

export default function PaymentButton() {
    const planId = useParams().id;
    const [plan, setPlan] = useState()
    const auth = useSelector((state) => state.auth)

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const result = await fetchFitnessProgramWithId(planId, auth.token);
                if (result.success && result.data) {
                    setPlan(result.data);
                }
            } catch (error) {
                console.error("Error fetching payment plan:", error);
            }
        };
        fetchPlan();
    }, []);

    const handlePayment = async () => {
        try {
            // 1️⃣ Create order on backend
            const order = { amount: plan.price }
            const result = await orderPayment(order, auth.token)

            if (!result.success) return alert("Unable to create order");

            const { id: order_id, amount } = result.data;

            // 2️⃣ Open Razorpay checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay key
                amount: amount,
                currency: "INR",
                name: "FitnessTrack",
                description: `${plan.name} Subscription`,
                order_id,
                handler: async (response) => {
                    const verfifyPayload = {
                        ...response, userId: auth.userId,
                        planId: plan._id, amount: amount, duration: plan.duration_days,
                    }
                    const verifyData = await verifyPayment(verfifyPayload, auth.token);
                    setTimeout(() => {
                        if (verifyData.success) {
                            window.location.assign(`${window.location.origin}/user/paymentstatus?status=success`);
                        } else {
                            window.location.assign(`${window.location.origin}/user/paymentstatus?status=failed`);
                        }
                    }, 500);

                },
                prefill: {
                    name: auth.name
                },
                theme: {
                    color: "#6366F1",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.submit', (response) => {
                paymentMethod.current = response.method;
            });

            rzp.on("payment.failed", function (response) {
                console.log("❌ Payment failed", response);
                window.location.href = `${window.location.origin}/user/paymentstatus?status=failed`;
            });
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Payment initiation failed");
        }
    };

    return (
        <div>
            <LogInHeader />
            <div className="max-w-md border mx-auto pl-10 mt-10 rounded-2xl">
                <div className="pb-5">
                    <h2 className="text-2xl font-semibold">{plan?.name}</h2>
                    <p className="text-sm mt-1 opacity-90">{plan?.description}</p>
                    <p className="text-3xl font-bold mt-4">
                        ₹{plan?.price}
                        <span className="text-sm font-medium opacity-80">
                            /{Math.round(plan?.duration_days / 30)} mo
                        </span>
                    </p>
                </div>
                <div className="pb-5">
                    <button type="button"
                        onClick={handlePayment}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-200"
                    >
                        CONFIRM AND PAY
                    </button>
                </div>
            </div>
        </div>
    );
}
