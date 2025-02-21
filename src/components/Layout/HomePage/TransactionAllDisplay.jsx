import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { IoChevronBackSharp } from "react-icons/io5";
import { FaCalendarAlt, FaSortAmountUp } from "react-icons/fa";
import DateTransactions from "./DateTransactions";
import AmountTransactions from "./AmountTransactions";
import { getAllUserTransactions } from "../../../config/axiosConfig";
import { OrbitProgress } from "react-loading-indicators";
import { motion } from "framer-motion";

function TransactionAllDisplay() {
  const navigate = useNavigate();

  const sort = {
    date: "date",
    amount: "amount",
  };

  const [transactions, setTransactions] = useState([]);
  const [dateSortedTransactions, setDateSortedTransactions] = useState([]);
  const [amountSortedTransactions, setAmountSortedTransactions] = useState([]);
  const [activeSort, setActiveSort] = useState(sort.date);
  const [loading, setLoading] = useState(true);

  // Fetch transactions
  const getAllTransaction = async () => {
    try {
      const response = await getAllUserTransactions();
      setTransactions(response || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTransaction();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      // Sort transactions by date (most recent first)
      const sortedByDate = [...transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setDateSortedTransactions(sortedByDate);

      // Sort transactions by amount (highest first)
      const sortedByAmount = [...transactions].sort(
        (a, b) => b.amount - a.amount
      );
      setAmountSortedTransactions(sortedByAmount);
    }
  }, [transactions]);

  useEffect(() => {
    getAllTransaction();
  }, [activeSort]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center p-3 bg-blue-200"
    >
      {/* Back Button */}
      <div className="self-start">
        <button
          className="text-2xl text-blue-500 hover:text-blue-700 transition bg-white p-1 rounded-lg m-3"
          onClick={() => navigate("/")}
        >
          <IoChevronBackSharp />
        </button>
      </div>

      {/* Header */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md text-center w-full bg-white p-3 rounded-lg"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Transactions</h1>

        {/* Sort Buttons */}
        <div className="flex justify-center gap-4">
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition ${
              activeSort === sort.date
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setActiveSort(sort.date)}
          >
            <FaCalendarAlt className="text-lg" /> Date
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition ${
              activeSort === sort.amount
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setActiveSort(sort.amount)}
          >
            <FaSortAmountUp className="text-lg" /> Amount
          </button>
        </div>
      </motion.div>

      {/* Transactions Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg mt-6"
      >
        {loading ? (
          <OrbitProgress
            variant="spokes"
            dense
            color="#32cd32"
            size="medium"
            text=""
            textColor=""
          />
        ) : transactions.length === 0 ? (
          <p className="text-gray-500 text-center">No transactions found.</p>
        ) : activeSort === sort.date ? (
          <DateTransactions dateSortedTransactions={dateSortedTransactions} />
        ) : (
          <AmountTransactions
            amountSortedTransactions={amountSortedTransactions}
          />
        )}
      </motion.div>
    </motion.section>
  );
}

export default TransactionAllDisplay;
