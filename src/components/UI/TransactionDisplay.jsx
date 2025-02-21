import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  FaPlusCircle,
  FaTimesCircle,
  FaDollarSign,
  FaListUl,
} from "react-icons/fa";
import {
  createTransaction,
  getUserTransactions,
} from "../../config/axiosConfig";
import { OrbitProgress } from "react-loading-indicators";
import { toast } from "react-toastify";
import {
  selectCurrentUser,
  updateUserBalance,
} from "../../redux/slices/userSlice/userSlice";
import TransactionItem from "./TransactionItem";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

function TransactionDisplay() {
  const dispatch = useDispatch();

  const user = useSelector(selectCurrentUser);

  const [loading, setLoading] = useState(false);

  const [addingTransaction, setAddingTransaction] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const getTransaction = async () => {
    const response = await getUserTransactions();
    setTransactions(response);
  };

  const [formData, setFormData] = useState({
    type: "INCOME",
    amount: "",
    category: "SALARY",
    detail: "",
    name: "",
  });

  const categories = {
    INCOME: ["SALARY"],
    EXPENSE: [
      "FOOD",
      "TRANSPORT",
      "SHOPPING",
      "UTILITIES",
      "INTERNET",
      "OTHER",
    ],
  };

  const changeMode = () => {
    setAddingTransaction(!addingTransaction);
    setFormData({
      type: "INCOME",
      amount: "",
      category: "SALARY",
      detail: "",
      name: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      // Ensure only valid numbers with up to 2 decimal places
      const formattedValue = value.replace(/[^0-9.]/g, ""); // Remove invalid characters
      const decimalMatch = formattedValue.match(/^\d*\.?\d{0,2}$/); // Allow only up to 2 decimal places

      if (!decimalMatch) return; // Prevent invalid input

      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        category: categories[value][0], // Update category based on type
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddTransaction = async () => {
    if (!formData.amount || !formData.detail || !formData.name) {
      toast.warn("Please fill in all fields.");
      return;
    }

    formData.amount = Number(formData.amount);

    setLoading(true);
    try {
      const response = await createTransaction(formData);
      dispatch(updateUserBalance(response));
      getTransaction();
      toast.success("Done!!!");
    } catch (error) {
      console.log(error);
      toast.error("Failed");
    } finally {
      setLoading(false);
      changeMode();
    }
  };

  useEffect(() => {
    getTransaction();
  }, []);

  useEffect(() => {
    getTransaction();
  }, [user.balance]);

  return (
    <motion.section className="w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg mt-4">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <motion.h2 className="text-lg sm:text-xl font-semibold text-gray-700">
          Transactions
        </motion.h2>

        {addingTransaction ? (
          <div className="flex gap-2 md:gap-4 mt-2 sm:mt-0">
            <motion.button
              onClick={handleAddTransaction}
              className="flex items-center gap-2 bg-green-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              <FaPlusCircle className="text-lg" />
              <span>Confirm</span>
            </motion.button>

            <motion.button
              onClick={changeMode}
              className="flex items-center gap-2 bg-red-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              <FaTimesCircle className="text-lg" />
              <span>Cancel</span>
            </motion.button>
          </div>
        ) : (
          <motion.button
            onClick={changeMode}
            className="flex items-center gap-2 bg-green-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-green-600 transition mt-2 sm:mt-0"
          >
            <FaPlusCircle className="text-lg sm:text-xl" />
            <span>Add Transaction</span>
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {/* Transaction Form */}
        {addingTransaction &&
          (loading ? (
            <OrbitProgress
              variant="spokes"
              dense
              color="#35dc35"
              size="medium"
              text="Processing"
              textColor=""
            />
          ) : (
            <motion.form
              className="space-y-4 sm:space-y-6"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerContainer}
            >
              {/* Type Selector */}
              <motion.div variants={fadeInUp}>
                <label className="block text-gray-600 font-medium">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                >
                  <option value="INCOME">INCOME</option>
                  <option value="EXPENSE">EXPENSE</option>
                </select>
              </motion.div>

              {/* Amount Input */}
              <motion.div variants={fadeInUp}>
                <label className="block text-gray-600 font-medium">
                  Amount
                </label>
                <div className="relative">
                  <FaDollarSign className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount 0.00"
                    className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </motion.div>

              {/* Category Selector */}
              <motion.div variants={fadeInUp}>
                <label className="block text-gray-600 font-medium">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                >
                  {categories[formData.type].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Name Input */}
              <motion.div variants={fadeInUp}>
                <label className="block text-gray-600 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                />
              </motion.div>

              {/* Detail Input */}
              <motion.div variants={fadeInUp}>
                <label className="block text-gray-600 font-medium">
                  Detail
                </label>
                <div className="relative">
                  <FaListUl className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    name="detail"
                    value={formData.detail}
                    onChange={handleInputChange}
                    placeholder="Enter details"
                    className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </motion.div>
            </motion.form>
          ))}
      </AnimatePresence>

      {!addingTransaction && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-3"
        >
          {transactions.length === 0 ? (
            <motion.p variants={fadeInUp} className="text-gray-500 text-center">
              No transactions yet.
            </motion.p>
          ) : (
            transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          )}
        </motion.div>
      )}
    </motion.section>
  );
}

export default TransactionDisplay;
