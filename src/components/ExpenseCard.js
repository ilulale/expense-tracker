import React from "react";

function ExpenseCard({ expenseData, toggleCardDetail }) {
  let expenseClass =
    expenseData.category == "expense"
      ? "expense-background"
      : "income-background";
  return (
    <div
      className={`expense-card ${expenseClass}`}
      onClick={() => {
        console.log(expenseData);
        toggleCardDetail(expenseData);
      }}
    >
      <div className="expense-card-value">
        ₹ {expenseData.expense.toLocaleString("en-IN")}
      </div>
      <div className="expense-card-subtitle">
        {expenseData.type && (
          <div className="expense-card-type">{expenseData.type}</div>
        )}

        <div>
          <div className="expense-card-date">
            {new Date(expenseData.at).toLocaleString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="expense-card-date">
            {new Date(expenseData.at).toLocaleString("en-IN", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseCard;
