import PropTypes from "prop-types";
import { FaMoneyBillWave, FaShoppingCart } from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import { IoCalendar } from "react-icons/io5";
import { useLocation } from "react-router";
import { BiSolidTrash } from "react-icons/bi";
import { deleteTransaction } from "../../config/axiosConfig";
import { useDispatch } from "react-redux";
import { updateUserBalance } from "../../redux/slices/userSlice/userSlice";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

function TransactionItem({ transaction }) {
  const { pathname } = useLocation();
  const [formattedDate, setFormattedDate] = useState("");
  const dispatch = useDispatch();

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      ` Are you sure you want to delete ${transaction.name}? This action cannot be undone.`
    );
    if (!isConfirmed) return;

    try {
      const response = await deleteTransaction(transaction.id);
      dispatch(updateUserBalance(response));
    } catch (error) {
      console.error("Reset failed:", error);
    }
  };

  useEffect(() => {
    if (transaction.date) {
      const newDate = format(
        new Date(transaction.date),
        "EEEE, do MMMM yyyy h:mm aaaa"
      );
      setFormattedDate(newDate);
    }
  }, [transaction]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`relative flex justify-between items-center p-4 shadow-md rounded-lg w-full ${
        transaction.type === "INCOME" ? "bg-green-200" : "bg-red-200"
      }`}
    >
      {/* Trash Icon at Top Right */}
      {pathname === "/" && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-1 right-2 text-red-600 hover:text-red-800 cursor-pointer hover:bg-white rounded-lg p-1"
          onClick={handleDelete}
        >
          <BiSolidTrash size={20} />
        </motion.button>
      )}

      {/* Left Section - Transaction Info */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {transaction.type === "INCOME" ? (
            <FaMoneyBillWave className="text-green-600" />
          ) : (
            <FaShoppingCart className="text-red-500" />
          )}
          {transaction.name}
        </h3>
        <p className="text-gray-700 flex items-center gap-2">
          <MdDescription className="text-blue-500" /> {transaction.detail}
        </p>
        <p className="text-gray-700 flex items-center gap-2">
          <IoCalendar className="text-gray-400" /> {formattedDate}
        </p>
      </div>

      {/* Right Section - Amount */}
      <motion.span
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`text-lg font-bold ${
          transaction.type === "INCOME" ? "text-green-600" : "text-red-500"
        }`}
      >
        {transaction.type === "INCOME" ? "+$" : "-$"}
        {transaction.amount}
      </motion.span>
    </motion.div>
  );
}

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["INCOME", "EXPENSE"]).isRequired,
    name: PropTypes.string.isRequired,
    detail: PropTypes.string,
    date: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }).isRequired,
};

export default TransactionItem;
