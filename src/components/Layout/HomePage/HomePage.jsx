import UserHeader from "../../UI/UserHeader";
import TransactionDisplay from "../../UI/TransactionDisplay";

function HomePage() {
  return (
    <section className="min-h-screen flex flex-col items-center p-5 ">
      {/* User Header Section */}
      <UserHeader />

      {/* Transactions Section */}
      <TransactionDisplay />
    </section>
  );
}

export default HomePage;
