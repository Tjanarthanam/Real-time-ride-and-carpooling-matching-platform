// import React, { useEffect, useState } from "react";
// import { getPaymentHistory } from "../../api/paymentApi";

// export default function PaymentHistory() {

//     const [payments, setPayments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {

//         const fetchPayments = async () => {

//             try {

//                 const response = await getPaymentHistory();

//                 setPayments(response.data);

//             } catch (err) {

//                 console.error(err);

//                 setError("Unable to load payment history.");

//             } finally {

//                 setLoading(false);

//             }

//         };

//         fetchPayments();

//     }, []);

//         return (

//         <div className="min-h-screen bg-slate-50 pt-28 px-6 pb-8">

//             <div className="max-w-7xl mx-auto">

//                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

//                     <h1 className="text-3xl font-bold text-slate-800 mb-2">
//                         Payment History
//                     </h1>

//                     <p className="text-slate-500 mb-6">
//                         View all your completed payments.
//                     </p>

//                     {loading && (

//                         <div className="text-center py-10 text-slate-500">
//                             Loading payment history...
//                         </div>

//                     )}

//                     {error && (

//                         <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4 mb-4">
//                             {error}
//                         </div>

//                     )}

//                     {!loading && !error && (
//                         <div className="overflow-x-auto">

//                             <table className="min-w-full border border-slate-200 rounded-lg">

//                                 <thead className="bg-slate-100">

//                                     <tr>

//                                         <th className="px-4 py-3 text-left">
//                                             Transaction ID
//                                         </th>

//                                         <th className="px-4 py-3 text-left">
//                                             Booking ID
//                                         </th>

//                                         <th className="px-4 py-3 text-left">
//                                             Amount
//                                         </th>

//                                         <th className="px-4 py-3 text-left">
//                                             Payment Method
//                                         </th>

//                                         <th className="px-4 py-3 text-left">
//                                             Status
//                                         </th>

//                                         <th className="px-4 py-3 text-left">
//                                             Payment Date
//                                         </th>

//                                     </tr>

//                                 </thead>

//                                 <tbody>

//                                     {payments.length === 0 ? (

//                                         <tr>

//                                             <td
//                                                 colSpan="6"
//                                                 className="text-center py-8 text-slate-500"
//                                             >
//                                                 No payment history found.
//                                             </td>

//                                         </tr>

//                                     ) : (

//                                         payments.map((payment) => (

//                                             <tr
//                                                 key={payment.paymentId}
//                                                 className="border-t hover:bg-slate-50"
//                                             >

//                                                 <td className="px-4 py-3 text-sm break-all">
//                                                     {payment.transactionId}
//                                                 </td>

//                                                 <td className="px-4 py-3">
//                                                     #{payment.bookingId}
//                                                 </td>

//                                                 <td className="px-4 py-3 font-semibold text-green-600">
//                                                     ₹ {payment.amount}
//                                                 </td>

//                                                 <td className="px-4 py-3">
//                                                     {payment.paymentMethod}
//                                                 </td>

//                                                 <td className="px-4 py-3">

//                                                                                                         <span
//                                                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                                                             payment.paymentStatus === "SUCCESS"
//                                                                 ? "bg-green-100 text-green-700"
//                                                                 : "bg-red-100 text-red-700"
//                                                         }`}
//                                                     >
//                                                         {payment.paymentStatus}
//                                                     </span>

//                                                 </td>

//                                                 <td className="px-4 py-3">
//                                                     {new Date(payment.paymentDate).toLocaleString()}
//                                                 </td>

//                                             </tr>

//                                         ))

//                                     )}

//                                 </tbody>

//                             </table>

//                         </div>

//                     )}

//                 </div>

//             </div>

//         </div>

//     );
// }

import React, { useEffect, useMemo, useState } from "react";
import {
    Wallet,
    IndianRupee,
    Calendar,
    CheckCircle2,
    Search,
    Download,
    Receipt,
    Copy,
} from "lucide-react";

import { getPaymentHistory } from "../../api/paymentApi";

export default function PaymentHistory() {

    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    useEffect(() => {

        async function loadPayments() {

            try {

                const response = await getPaymentHistory();

                setPayments(response.data);
                setFilteredPayments(response.data);

            } catch (err) {

                console.error(err);

                setError("Unable to load payment history.");

            } finally {

                setLoading(false);

            }

        }

        loadPayments();

    }, []);

    useEffect(() => {

        const keyword = search.toLowerCase();

        setFilteredPayments(

            payments.filter(payment =>

                payment.transactionId
                    .toLowerCase()
                    .includes(keyword)

                ||

                String(payment.bookingId)
                    .includes(keyword)

            )

        );

    }, [search, payments]);

    const totalPayments = payments.length;

    const totalAmount = useMemo(() => {

        return payments.reduce(
            (sum, payment) => sum + payment.amount,
            0
        );

    }, [payments]);

    const successPayments = payments.filter(
        p => p.paymentStatus === "SUCCESS"
    ).length;

    const latestPayment =
        payments.length > 0
            ? payments[0]
            : null;
                return (

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white pt-28 pb-10 px-6">

            <div className="max-w-7xl mx-auto">

                {/* Header */}

                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 mb-8">

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                        <div>

                            <div className="flex items-center gap-4">

                                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">

                                    <Wallet
                                        size={34}
                                        className="text-blue-600"
                                    />

                                </div>

                                <div>

                                    <h1 className="text-4xl font-bold text-slate-800">

                                        Payment History

                                    </h1>

                                    <p className="text-slate-500 mt-1">

                                        View every payment you've made securely.

                                    </p>

                                </div>

                            </div>

                        </div>

                        <button
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl shadow-md"
                        >

                            <Download size={18} />

                            Export

                        </button>

                    </div>

                </div>

                {/* Statistics */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-6">

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-slate-500 text-sm">

                                    Total Payments

                                </p>

                                <h2 className="text-4xl font-bold mt-2">

                                    {totalPayments}

                                </h2>

                            </div>

                            <div className="bg-blue-100 p-4 rounded-2xl">

                                <Wallet
                                    className="text-blue-600"
                                    size={30}
                                />

                            </div>

                        </div>

                    </div>

                    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-6">

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-slate-500 text-sm">

                                    Total Spent

                                </p>

                                <h2 className="text-4xl font-bold mt-2 text-green-600">

                                    ₹ {totalAmount}

                                </h2>

                            </div>

                            <div className="bg-green-100 p-4 rounded-2xl">

                                <IndianRupee
                                    className="text-green-600"
                                    size={30}
                                />

                            </div>

                        </div>

                    </div>

                    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-6">

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-slate-500 text-sm">

                                    Latest Payment

                                </p>

                                <h2 className="text-2xl font-bold mt-2 text-purple-600">

                                    {latestPayment
                                        ? new Date(
                                              latestPayment.paymentDate
                                          ).toLocaleDateString()
                                        : "--"}

                                </h2>

                            </div>

                            <div className="bg-purple-100 p-4 rounded-2xl">

                                <Calendar
                                    className="text-purple-600"
                                    size={30}
                                />

                            </div>

                        </div>

                    </div>

                    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-6">

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-slate-500 text-sm">

                                    Success Rate

                                </p>

                                <h2 className="text-4xl font-bold mt-2 text-orange-500">

                                    {totalPayments === 0
                                        ? 0
                                        : Math.round(
                                              (successPayments /
                                                  totalPayments) *
                                                  100
                                          )}
                                    %

                                </h2>

                            </div>

                            <div className="bg-orange-100 p-4 rounded-2xl">

                                <CheckCircle2
                                    className="text-orange-500"
                                    size={30}
                                />

                            </div>

                        </div>

                    </div>

                </div>

                {/* Search */}

                <div className="bg-white rounded-2xl shadow-md p-5 mb-8">

                    <div className="relative">

                        <Search
                            size={20}
                            className="absolute left-4 top-3.5 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search Transaction ID or Booking ID..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        />

                    </div>

                </div>

                                {/* Premium Table */}

                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">

                    <div className="px-8 py-6 border-b bg-slate-50">

                        <h2 className="text-2xl font-bold text-slate-800">
                            Recent Transactions
                        </h2>

                        <p className="text-slate-500 mt-1">
                            All successful ride payments.
                        </p>

                    </div>

                    {loading ? (

                        <div className="py-20 text-center text-slate-500">
                            Loading payments...
                        </div>

                    ) : error ? (

                        <div className="py-20 text-center text-red-600">
                            {error}
                        </div>

                    ) : filteredPayments.length === 0 ? (

                        <div className="py-20 text-center text-slate-500">
                            No payment history found.
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-slate-100">

                                    <tr className="text-left text-slate-600">

                                        <th className="px-6 py-4">
                                            Transaction
                                        </th>

                                        <th className="px-6 py-4">
                                            Booking
                                        </th>

                                        <th className="px-6 py-4">
                                            Amount
                                        </th>

                                        <th className="px-6 py-4">
                                            Method
                                        </th>

                                        <th className="px-6 py-4">
                                            Status
                                        </th>

                                        <th className="px-6 py-4">
                                            Date
                                        </th>

                                        <th className="px-6 py-4 text-center">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredPayments.map((payment) => (

                                        <tr
                                            key={payment.paymentId}
                                            className="border-t hover:bg-blue-50 transition duration-300"
                                        >

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-3">

                                                    <div>

                                                        <p className="font-semibold text-slate-800">

                                                            {payment.transactionId.substring(0,18)}...

                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            <td className="px-6 py-5 font-semibold">

                                                #{payment.bookingId}

                                            </td>

                                            <td className="px-6 py-5">

                                                <span className="text-green-600 font-bold text-lg">

                                                    ₹ {payment.amount}

                                                </span>

                                            </td>

                                            <td className="px-6 py-5">

                                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">

                                                    {payment.paymentMethod}

                                                </span>

                                            </td>

                                            <td className="px-6 py-5">

                                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">

                                                    {payment.paymentStatus}

                                                </span>

                                            </td>

                                            <td className="px-6 py-5 text-slate-600">

                                                {new Date(
                                                    payment.paymentDate
                                                ).toLocaleString()}

                                            </td>

                                            <td className="px-6 py-5">

                                                                                                <div className="flex justify-center gap-3">

                                                    <button
                                                        onClick={() =>
                                                            navigator.clipboard.writeText(
                                                                payment.transactionId
                                                            )
                                                        }
                                                        className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 transition"
                                                        title="Copy Transaction ID"
                                                    >
                                                        <Copy
                                                            size={18}
                                                            className="text-slate-700"
                                                        />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            alert(
                                                                `Receipt\n\nTransaction ID: ${payment.transactionId}\nBooking ID: ${payment.bookingId}\nAmount: ₹${payment.amount}\nMethod: ${payment.paymentMethod}\nStatus: ${payment.paymentStatus}\nDate: ${new Date(
                                                                    payment.paymentDate
                                                                ).toLocaleString()}`
                                                            )
                                                        }
                                                        className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition"
                                                        title="View Receipt"
                                                    >
                                                        <Receipt
                                                            size={18}
                                                            className="text-green-700"
                                                        />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

                {/* Footer */}

                <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-lg p-8 text-white">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">

                            <Wallet size={30} />

                        </div>

                        <div>

                            <h2 className="text-2xl font-bold">

                                Secure Payments

                            </h2>

                            <p className="text-blue-100 mt-2">

                                Every transaction is encrypted and securely
                                processed. Your payment information is never
                                stored on the RideShare AI platform.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}