import axios from "axios";
import React, { useState, useEffect } from "react";
import config from "../config";

function Modal({ updateExpenses, loggOutUser, userData }) {
  let [splits, setSplits] = useState([]);
  let [type, setType] = useState();
  let [ammount, setAmmount] = useState();
  let [selectedMenu, setSelectedMenu] = useState(0);
  let [categories, setCategories] = useState(["Grocery", "Home"]);
  let [editInput, setEditInput] = useState();

  useEffect(() => {
    axios.get(`${baseUrl}/${userData.id}`).then((res) => {
      setCategories(res.data.categories);
    });
  }, []);

  let setSelectedClass = (option, ogClass) => {
    if (option == selectedMenu) {
      return ogClass;
    } else {
      return `${ogClass} not-selected`;
    }
  };

  let baseUrl = `${config.baseUrl}/category`;

  return (
    <div className="modal">
      {selectedMenu == 0 && (
        <div className="modal-form">
          <div className="modal-type-dropdown">
            <label>Type</label>
            <select
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              <option value={null}>Choose Option</option>
              {categories.map((category) => (
                <option value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="modal-amount-input">
            <label>Amount</label>
            <input
              type="number"
              placeholder="69.99"
              onChange={(e) => {
                setAmmount(parseInt(e.target.value));
              }}
            />
          </div>
          <div className="modal-split">
            <label>Split</label>
            <input
              type="number"
              placeholder="Split between"
              onChange={(e) => {
                if (e.target.value > 0 && e.target.value < 10) {
                  let Splitarray = new Array(parseInt(e.target.value)).fill(0);
                  setSplits(Splitarray);
                }
              }}
            />
            {splits.map((split, index) => (
              <input
                type="text"
                placeholder="Name"
                onChange={(e) => {
                  let tmpSplit = splits;
                  tmpSplit[index] = {
                    name: e.target.value,
                    paid: false,
                  };
                  setSplits(tmpSplit);
                }}
              />
            ))}
          </div>
          <div className="modal-options">
            <div
              className="modal-option modal-option-left expense-background"
              onClick={() => {
                console.log(`Ammount:${ammount} Type:${type}`);
                let tmpExpense = {
                  expense: ammount,
                  type: type,
                  at: Date.now(),
                  split: splits[0] ? splits : 0,
                  category: "expense",
                };
                updateExpenses(tmpExpense);
              }}
            >
              -
            </div>
            <div
              className="modal-option modal-option-right income-background"
              onClick={() => {
                console.log(`Ammount:${ammount} Type:${type} Split:${splits}`);
                let tmpExpense = {
                  expense: ammount,
                  type: type,
                  at: Date.now(),
                  split: splits[0] ? splits : 0,
                  category: "income",
                };
                updateExpenses(tmpExpense);
              }}
            >
              +
            </div>
          </div>
        </div>
      )}
      {selectedMenu == 1 && (
        <div className="edit-modal">
          <label>Add New Category</label>
          <input
            type="text"
            placeholder="Home"
            onChange={(e) => {
              setEditInput(e.target.value);
            }}
          ></input>
          <div
            className="edit-modal-cta"
            onClick={() => {
              if (editInput) {
                axios
                  .post(`${baseUrl}/${userData.id}`, {
                    categories: [...categories, editInput],
                  })
                  .then((res) => {
                    console.log(res.data);
                  });
                setCategories([...categories, editInput]);
                setSelectedMenu(0);
              }
            }}
          >
            Add
          </div>
          <div
            className="logout-cta"
            onClick={() => {
              localStorage.removeItem("userID");
              localStorage.removeItem("userEmail");
              loggOutUser();
            }}
          >
            Log out
          </div>
        </div>
      )}
      <div class="modal-submenu">
        <div
          className={setSelectedClass(0, "submenu-opt1")}
          onClick={() => {
            setSelectedMenu(0);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div
          className={setSelectedClass(1, "submenu-opt2")}
          onClick={() => {
            setSelectedMenu(1);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Modal;
