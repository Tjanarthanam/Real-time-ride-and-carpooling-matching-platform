import React, { useState } from "react";
import { makePayment } from "../api/paymentApi";

export default function PaymentModal({
  booking,
  onClose,
  onSuccess,
}) {
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  // Extra state to show styled success popup view & error alert
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePayment = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      await makePayment({
        bookingId: booking.bookingId,
        paymentMethod,
      });

      // Instead of standard browser alert("Payment Successful!"), trigger styled view
      setIsSuccess(true);
    } catch (error) {
      console.error(error);

      // Instead of browser alert(error), show inline styled alert banner
      setErrorMessage(
        error.response?.data?.message ||
          "Payment Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-all duration-300">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">

        {!isSuccess ? (
          /* ================= PAYMENT FORM VIEW ================= */
          <>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-black text-slate-900">
                Complete Payment
              </h2>
              <button
                onClick={onClose}
                disabled={loading}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Ride
                  </p>
                  <p className="font-extrabold text-slate-900 text-base">
                    {booking.source} → {booking.destination}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Driver
                  </p>
                  <p className="font-extrabold text-slate-900">
                    {booking.driverName}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Amount
                  </p>
                  <p className="text-2xl font-black text-emerald-600">
                    ₹ {booking.totalAmount}
                  </p>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select Payment Method
                </p>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition cursor-pointer font-bold text-slate-800 text-sm">
                  <input
                    type="radio"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  UPI
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition cursor-pointer font-bold text-slate-800 text-sm">
                  <input
                    type="radio"
                    value="CREDIT_CARD"
                    checked={paymentMethod === "CREDIT_CARD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  Credit Card
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition cursor-pointer font-bold text-slate-800 text-sm">
                  <input
                    type="radio"
                    value="DEBIT_CARD"
                    checked={paymentMethod === "DEBIT_CARD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  Debit Card
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition cursor-pointer font-bold text-slate-800 text-sm">
                  <input
                    type="radio"
                    value="CASH"
                    checked={paymentMethod === "CASH"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  Cash
                </label>
              </div>

              {/* Styled Error Alert */}
              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-bold text-center">
                  {errorMessage}
                </div>
              )}

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-5 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer text-sm"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </>
        ) : (
          /* ================= STYLISH SUCCESS POPUP VIEW ================= */
          <div className="text-center py-4 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">
                Payment Successful!
              </h3>
              <p className="text-xs font-bold text-slate-500">
                Your booking is officially confirmed and added to your schedule.
              </p>
            </div>

            {/* Receipt Details Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2 text-xs font-bold text-slate-600">
              <div className="flex justify-between">
                <span>Route</span>
                <span className="text-slate-900 font-black">{booking.source} → {booking.destination}</span>
              </div>
              <div className="flex justify-between">
                <span>Driver</span>
                <span className="text-slate-900 font-black">{booking.driverName}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span>Amount Paid</span>
                <span className="text-emerald-600 font-black text-sm">₹ {booking.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="text-slate-900 font-black">{paymentMethod}</span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black py-4 rounded-2xl transition shadow-md text-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

      </div>

    </div>
  );
}