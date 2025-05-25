import './ExpenseDetails.css';

import React from 'react';

function ExpenseDetail({ incomeAmt = 0, expenseAmt = 0 }) {
  const balance = incomeAmt - expenseAmt;

  return (
    <div className="expense-detail">
      <h2>Your Balance: ₹{balance}</h2>
      <div className="amount-container">
        <div className="income">
          <h4>Income</h4>
          <span style={{ color: 'green' }}>₹{incomeAmt}</span>
        </div>
        <div className="expense">
          <h4>Expense</h4>
          <span style={{ color: 'red' }}>₹{expenseAmt}</span>
        </div>
      </div>
    </div>
  );
}

export default ExpenseDetail;
