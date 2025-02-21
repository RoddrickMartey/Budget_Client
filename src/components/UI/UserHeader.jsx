import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentUser,
  logout,
  updateUserBalance,
} from "../../redux/slices/userSlice/userSlice";
import { FcBusinessman } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { IoLogOut, IoChevronDown } from "react-icons/io5";
import { reset } from "../../config/axiosConfig";
import { RiEraserFill } from "react-icons/ri";
import { PiListChecksFill } from "react-icons/pi";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

function UserHeader() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    dispatch(logout());
  };

  const handleReset = async () => {
    setIsDropdownOpen(false);
    const isConfirmed = window.confirm(
      "Are you sure you want to reset your balance? This action cannot be undone."
    );
    if (!isConfirmed) return;

    try {
      const response = await reset();
      dispatch(updateUserBalance(response));
    } catch (error) {
      console.error("Reset failed:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg relative"
    >
      {/* User Info Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3 text-gray-700">
          <FcBusinessman className="text-2xl" />
          <h1 className="text-lg font-semibold">
            Name: <span className="font-normal">{user.name}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <MdEmail className="text-2xl text-blue-500" />
          <h2 className="text-lg font-semibold">
            Email: <span className="font-normal">{user.email}</span>
          </h2>
        </div>
      </motion.div>

      {/* Balance Section */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-4 flex items-center gap-3 text-green-600"
      >
        <FaMoneyBillWave className="text-2xl" />
        <h1 className="text-lg font-semibold">
          Balance: <span className="font-bold">${user.balance}</span>
        </h1>
      </motion.div>

      {/* Dropdown Menu - Positioned to the Right */}
      <div className="absolute top-4 right-4" ref={dropdownRef}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition"
        >
          <IoChevronDown className="text-xl" />
        </motion.button>

        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute flex-col flex items-center right-0 mt-2 w-52 bg-white shadow-md rounded-lg p-1 z-50"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/transactions")}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-green-500 font-semibold hover:bg-gray-100 transition rounded-md my-1 bg-blue-100"
            >
              <PiListChecksFill className="text-xl" /> All transactions
            </motion.button>

            <div className="p-0.5 bg-blue-400 w-2/5 my-1"></div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-yellow-500 font-semibold hover:bg-gray-100 transition rounded-md my-1 bg-blue-100"
            >
              <RiEraserFill className="text-xl" /> Reset
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-500 font-semibold hover:bg-gray-100 transition rounded-md my-1 bg-blue-100"
            >
              <IoLogOut className="text-xl" /> Logout
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

export default UserHeader;
