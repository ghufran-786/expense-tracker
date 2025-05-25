import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIUrl, handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import ExpensesTable from "./ExpensesTable";
import ExpenseTrackerForm from "./ExpenseTrackerForm";
import ExpenseDetails from "./ExpenseDetails";

function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [expenseAmt, setExpenseAmt] = useState(0);
  const [IncomeAmt, setIncomeAmt] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    } else {
      navigate("/login"); // If not logged in, redirect
    }
  }, [navigate]);

  useEffect(() => {
    if (Array.isArray(expenses)) {
      const amounts = expenses.map((item) => Number(item.amount));
      console.log(amounts);

      const income = amounts
        .filter((item) => item > 0)
        .reduce((acc, item) => acc + item, 0);
      console.log(income);

      const expense =
        amounts
          .filter((item) => item < 0)
          .reduce((acc, item) => acc + item, 0) * -1;
      console.log(expense);

      setIncomeAmt(income);
      setExpenseAmt(Math.abs(expense));
    }
  }, [expenses]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Logged out successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const fetchExpenses = async () => {
    try {
      const url = `${APIUrl}/expenses`;
      const headers = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      const response = await fetch(url, headers);
      if (response.status === 403) {
        navigate("/login");
        return;
      }
      const result = await response.json();
      console.log(result.data);

      if (Array.isArray(result.data)) {
        setExpenses(result.data);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const addExpenses = async (data) => {
    try {
      const url = `${APIUrl}/expenses`;
      const headers = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      };
      const response = await fetch(url, headers);
      if (response.status === 403) {
        navigate("/login");
        return;
      }
      const result = await response.json();
      console.log(result.data);

      if (Array.isArray(result.data)) {
        setExpenses(result.data);
      }
      handleSuccess(result.message);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDeleteExpense = async (expenseId) => {
    try {
      const url = `${APIUrl}/expenses/${expenseId}`;
      const headers = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        method: "DELETE",
        // body: JSON.stringify(data),
      };
      const response = await fetch(url, headers);
      if (response.status === 403) {
        navigate("/login");
        return;
      }
      const result = await response.json();
      console.log(result.data);

      if (Array.isArray(result.data)) {
        setExpenses(result.data);
      }
      handleSuccess(result.message);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div>
      <div className="user-section">
        <h1 className="name">Welcome {loggedInUser}</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      {/* Pass calculated values properly */}
      <ExpenseDetails incomeAmt={IncomeAmt} expenseAmt={expenseAmt} />

      {/* Pass props safely */}
      <ExpenseTrackerForm addExpenses={addExpenses} />

      {/* Safe render if expenses is array */}
      {Array.isArray(expenses) ? (
        <ExpensesTable
          expenses={expenses}
          handleDeleteExpense={handleDeleteExpense}
        />
      ) : (
        <p>No expenses available</p>
      )}

      <ToastContainer />
    </div>
  );
}

export default Home;
