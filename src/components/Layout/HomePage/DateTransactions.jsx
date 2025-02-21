import PropTypes from "prop-types";
import TransactionItem from "../../UI/TransactionItem";

function DateTransactions({ dateSortedTransactions }) {
  // Group transactions by "Month-Year"
  const groupedTransactions = dateSortedTransactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(transaction);

      return acc;
    },
    {}
  );

  return (
    <div className="w-full bg-white p-3 rounded-lg">
      {Object.keys(groupedTransactions).map((monthYear) => (
        <div key={monthYear} className="mb-6">
          {/* Month-Year Heading */}
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            {monthYear}
          </h2>

          <div className="  rounded-lg gap-3 flex flex-col items-center">
            {groupedTransactions[monthYear].map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

DateTransactions.propTypes = {
  dateSortedTransactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired, // Enum TransactionType
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      detail: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired, // Enum TransactionCategory
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
        .isRequired,
    })
  ).isRequired,
};

export default DateTransactions;
