import PropTypes from "prop-types";
import TransactionItem from "../../UI/TransactionItem";

function AmountTransactions({ amountSortedTransactions }) {
  // Separate transactions into income and expense
  const incomeTransactions = amountSortedTransactions.filter(
    (transaction) => transaction.type === "INCOME"
  );

  const expenseTransactions = amountSortedTransactions.filter(
    (transaction) => transaction.type === "EXPENSE"
  );

  // Calculate total income and total expense
  const totalIncome = incomeTransactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  const totalExpense = expenseTransactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  return (
    <div className="w-full">
      {/* Display Total Income & Expense */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Summary</h2>
        <div className="flex justify-between">
          <p className="text-green-600 font-semibold">
            Total Income: ${totalIncome.toFixed(2)}
          </p>
          <p className="text-red-600 font-semibold">
            Total Expense: ${totalExpense.toFixed(2)}
          </p>
        </div>
        <div className="mt-2">
          <p className="text-blue-600 font-bold">
            Total: ${totalIncome.toFixed(2) - totalExpense.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Income Transactions */}
      <div className="mb-6 bg-white p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-green-600 mb-2">Income</h2>
        <div className="  gap-3 flex flex-col items-center">
          {incomeTransactions.length > 0 ? (
            incomeTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <p className="text-gray-500">No income transactions.</p>
          )}
        </div>
      </div>

      {/* Expense Transactions */}
      <div className="mb-6 bg-white p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Expenses</h2>
        <div className=" gap-3 flex flex-col items-center">
          {expenseTransactions.length > 0 ? (
            expenseTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <p className="text-gray-500">No expense transactions.</p>
          )}
        </div>
      </div>
    </div>
  );
}

AmountTransactions.propTypes = {
  amountSortedTransactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired, // "income" or "expense"
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      detail: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
        .isRequired,
    })
  ).isRequired,
};

export default AmountTransactions;
