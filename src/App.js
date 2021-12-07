import { useEffect, useState } from "react";
import "./App.scss";
import ExpenseCard from "./components/ExpenseCard";
import LoginCard from "./components/LoginCard";
import Modal from "./components/Modal";
import axios from "axios";
import CardDetail from "./components/CardDetail";
import config from "./config";

function App() {
  let [showModal, setShowModal] = useState(false);
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  let [userData, setUserData] = useState();
  let [total, setTotal] = useState(0);
  let [remaining, setRemaining] = useState(0);
  let [cardDetail, setCardDetail] = useState({});
  let [expenses, setExpenses] = useState([
    // {
    //   expense: 11000,
    //   type: "Grocery",
    //   at: Date.now(),
    //   category: "expense",
    // },
    // {
    //   expense: 11300,
    //   type: "Home",
    //   at: Date.now(),
    //   category: "income",
    // },
  ]);

  useEffect(() => {
    getExpenses();
  }, [isLoggedIn]);

  useEffect(() => {
    setTotal(calculateTotal(expenses));
  }, [expenses]);

  useEffect(() => {
    let tmpUserData = {
      id: localStorage.getItem("userID"),
      email: localStorage.getItem("userEmail"),
    };
    if (tmpUserData.id) {
      setUserData(tmpUserData);
      setIsLoggedIn(true);
    }
  }, []);

  let baseUrl = `${config.baseUrl}/expenses`;

  let splitCorrection = () => {
    let totalCorrection = 0;
    expenses.map((expense) => {
      if (expense.split[0] && expense.split[0].name) {
        expense.split.map((splt) => {
          if (splt.paid) {
            totalCorrection =
              totalCorrection + expense.expense / expense.split.length;
          }
        });
      }
    });
    return totalCorrection;
  };

  let calculateTotal = (expenses) => {
    let total = 0;
    expenses.map((expense) => {
      if (expense.category == "income") {
        total = total + expense.expense;
      }
    });
    return total;
  };

  let calculateRemaining = (expenses) => {
    let totalExp = 0;
    expenses.map((expense) => {
      if (expense.category == "expense") {
        totalExp = totalExp + expense.expense;
      }
    });
    return totalExp;
  };

  let getExpenses = () => {
    userData &&
      axios.get(`${baseUrl}/user/${userData.id}`).then((res) => {
        let expenses = res.data.expenses;
        setExpenses(expenses);
      });
  };

  let changeLoggedInTrue = (userData) => {
    setUserData(userData);
    setIsLoggedIn(true);
  };
  let loggOutUser = () => {
    setShowModal(false);
    setIsLoggedIn(false);
  };
  let updateSplit = (detail, index) => {
    detail.split[index].paid = !detail.split[index].paid;
    axios.post(`${baseUrl}/update`, detail).then((res) => {
      if (res.data.message == "success") {
        let tmpExpenses = expenses;
        let finaltmp = tmpExpenses.map((exp) => {
          if (exp._id == detail._id) {
            return detail;
          } else {
            return exp;
          }
        });
        setExpenses(finaltmp);
      }
    });
  };
  let updateExpenses = (tmpExpense) => {
    if (tmpExpense.expense) {
      setExpenses([...expenses, tmpExpense]);
      let uploadExpense = {
        ...tmpExpense,
        user: userData.id,
      };
      axios
        .post(`${baseUrl}/post`, { uploadExpense })
        .then((res) => console.log(res));
      setShowModal(!showModal);
    }
  };
  let toggleCardDetail = (expense) => {
    setCardDetail(expense);
  };
  let closeModal = () => {
    setShowModal(false);
  };

  let AppContainer = () => (
    <div className="app-container">
      {/* <div className="error-bar">ID : {userData.id}</div> */}
      {cardDetail.expense && (
        <CardDetail
          detail={cardDetail}
          updateSplit={updateSplit}
          toggleCardDetail={toggleCardDetail}
        />
      )}
      <div className="recent-cards">
        {expenses.map((expense) => (
          <ExpenseCard
            expenseData={expense}
            toggleCardDetail={toggleCardDetail}
          />
        ))}
      </div>
      {showModal && (
        <Modal
          updateExpenses={updateExpenses}
          loggOutUser={loggOutUser}
          userData={userData}
          closeModal={closeModal}
        />
      )}
      <div className="summary-card">
        <div className="total-title">
          Total
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => {
              setShowModal(!showModal);
            }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="total-value">
          ₹ {total - calculateRemaining(expenses) + splitCorrection()} / ₹{" "}
          {total}
        </div>
        {/* <div className="balence-distribution">
          Bank <span>11,000</span> | Cash <span>300</span>
        </div> */}
      </div>
    </div>
  );

  return (
    <>
      {isLoggedIn ? (
        <AppContainer />
      ) : (
        <LoginCard changeLoggedInTrue={changeLoggedInTrue} />
      )}
    </>
  );
}

export default App;
