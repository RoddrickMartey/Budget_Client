import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router";
import LoginPage from "./components/Layout/Auth/LoginPage";
import HomePage from "./components/Layout/HomePage/HomePage";
import Protect from "./components/Protect";
import TransactionAllDisplay from "./components/Layout/HomePage/TransactionAllDisplay";

function App() {
  return (
    <main className="w-full bg-blue-200 min-h-screen">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Protect />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/transactions" element={<TransactionAllDisplay />} />
        </Route>
      </Routes>
      <ToastContainer theme="colored" position="top-center" />
    </main>
  );
}

export default App;
