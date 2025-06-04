import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TestApiComponent from "../components/TestApiComponent";
import Navbar from "../components/Navbar/Navbar";
import TransactionForm from "../components/TransactionForm/TransactionForm";
import TransactionList from "../components/TransactionList/TransactionList";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import HomePage from "../components/HomePage/HomePage";
import PrivateRoute from "../components/Route/PrivateRoute";
import PublicRoute from "../components/Route/PublicRoute";
import BalanceBar from "../components/BalanceBar/BalanceBar";
import GroupMembersPage from "../pages/GroupsPage/GroupMembersPage";
import GroupDebtsPage from "../pages/GroupsPage/GroupDebtPage";
import GroupsPage from "../pages/GroupsPage/GroupsPage";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <BalanceBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/add-transaction"
            element={
              <PrivateRoute>
                <TransactionForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <TransactionList />
              </PrivateRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <PrivateRoute>
                <GroupsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/groups/:groupId/members"
            element={
              <PrivateRoute>
                <GroupMembersPage />
              </PrivateRoute>
            }
          />
          <Route path="/groups/:groupId/debts" element={<GroupDebtsPage />} />
          <Route path="/test" element={<TestApiComponent />} />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;
