import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setIsSubscribed } from "../redux/slice/authSlice";

const PaymentStatusPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get payment status from URL
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  const isSuccess = status === "success";
  useEffect(() => {
    if (isSuccess) {
      dispatch(setIsSubscribed(true))
    }
  }, [])

  return (
    <div className="max-w-xl mx-auto mt-5  rounded-2xl px-5">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <div
          className={`text-6xl mb-4 ${isSuccess ? "text-green-500" : "text-red-500"
            }`}
        >
          {isSuccess ? "✅" : "❌"}
        </div>

        <h1 className="text-2xl font-semibold mb-2">
          {isSuccess ? "Payment Successful!" : "Payment Failed"}
        </h1>

        <p className="text-gray-600 mb-6">
          {isSuccess
            ? "Thank you for subscribing! Your plan is now active. You can visit your dashboard to explore your subscription."
            : "Oops! Something went wrong with your payment. Please try again or contact support."}
        </p>

        <button
          onClick={() => navigate(isSuccess ? "/user" : "/paymentplan")}
          className={`px-5 py-2 rounded-lg text-white font-medium transition ${isSuccess
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
            }`}
        >
          {isSuccess ? "Go to Dashboard" : "Try Again"}
        </button>
      </div>
    </div>
  );
};

export default PaymentStatusPage;
