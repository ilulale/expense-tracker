import axios from "axios";
import React, { useState, useEffect } from "react";
import config from "../config";

function Modal({ updateExpenses, loggOutUser, userData, closeModal }) {
  let [splits, setSplits] = useState([]);
  let [type, setType] = useState();
  let [ammount, setAmmount] = useState();
  let [selectedMenu, setSelectedMenu] = useState(0);
  let [categories, setCategories] = useState(["Grocery", "Home"]);
  let [editInput, setEditInput] = useState();
  let [roomInput, setRoomInput] = useState();
  let [room, setRoom] = useState();
  let [prefixInput, setPrefixInput] = useState();
  let [splitsInput, setSplitsInput] = useState();
  let [roomSplits, setRoomSplits] = useState();

  useEffect(async () => {
    axios.get(`${baseUrl}/${userData.id}`).then((res) => {
      setCategories(res.data.categories);
    });
    let roomdb = await axios.get(`${config.baseUrl}/room/user/${userData.id}`);
    roomdb = roomdb.data.roomInfo.room;
    if (roomdb) {
      setRoom(roomdb);
    }
    axios.get(`${config.baseUrl}/roomMap/${roomdb}`).then((res) => {
      if (res.data.roomMap) {
        setRoomSplits(res.data.roomMap.categories);
      }
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={closeModal}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
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
              placeholder={splits[0] ? splits.length : "Split between"}
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
                placeholder={split ? split.name : "Name"}
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
            {roomSplits && (
              <div className="room-split-selection">
                {roomSplits.map((rs) => (
                  <div
                    className="room-split-tag"
                    onClick={() => {
                      let splitObj = rs.splits.map((s) => {
                        return {
                          name: s,
                          paid: false,
                        };
                      });
                      setSplits(splitObj);
                    }}
                  >
                    {rs.prefix}
                  </div>
                ))}
              </div>
            )}
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
          <label className="modal-exit">
            Add New Category{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={closeModal}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </label>
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
            className={`edit-room-cta ${!room ? "bg-locked" : "bg-completed"}`}
          >
            {!room && (
              <>
                <input
                  type="text"
                  placeholder="Room #ID"
                  onChange={(e) => setRoomInput(e.target.value)}
                ></input>
                <div
                  className="edit-room-btn"
                  onClick={(e) => {
                    axios
                      .post(`${config.baseUrl}/room`, {
                        userId: userData.id,
                        room: roomInput,
                      })
                      .then((res) => {
                        setRoom(roomInput);
                        console.log(res);
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                  }}
                >
                  {" "}
                  Join
                </div>{" "}
              </>
            )}
            {room && (
              <>
                <div className="edit-room-label">{room}</div>
                <div className="edit-room-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>{" "}
              </>
            )}
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
      {selectedMenu == 2 && (
        <div className="edit-modal room-modal">
          <div className="room-modal-heading">Room Map</div>
          <div className="room-modal-add-container">
            <input
              type="text"
              placeholder="Prefix"
              onChange={(e) => {
                setPrefixInput(e.target.value);
              }}
              className="room-edit-prefix"
            ></input>
            <input
              type="text"
              onChange={(e) => {
                let splits = e.target.value.replaceAll(" ", "").split(",");
                setSplitsInput(splits);
              }}
              placeholder="Splits"
              className="room-edit-splits"
            ></input>
            <div
              onClick={() => {
                let roomSplitbody = {
                  room: room,
                  categories: [
                    {
                      prefix: prefixInput,
                      splits: splitsInput,
                    },
                  ],
                };
                axios
                  .post(`${config.baseUrl}/roomMap`, roomSplitbody)
                  .then((res) => {
                    if (roomSplits) {
                      setRoomSplits([
                        ...roomSplits,
                        ...roomSplitbody.categories,
                      ]);
                    } else {
                      setRoomSplits([...roomSplitbody.categories]);
                    }
                  });
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
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
        {room && (
          <div
            className={setSelectedClass(2, "submenu-opt-room")}
            onClick={() => setSelectedMenu(2)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
