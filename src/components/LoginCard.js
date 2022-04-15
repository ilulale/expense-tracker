import axios from "axios";
import React from "react";
import { useState } from "react/cjs/react.development";
import config from "../config";

function LoginCard({ changeLoggedInTrue }) {
  let [user, setUser] = useState("");
  let [pass, setPass] = useState("");
  let [email, setEmail] = useState("");
  let [showError, setShowError] = useState(false);
  let [errorMessage, setErrorMessage] = useState();
  let [userData, setUserData] = useState({});
  let [showRegister, setShowRegister] = useState(false);

  let baseUrl = `${config.baseUrl}/auth`;

  let logUser = (user, pass) => {
    let loginUrl = `${baseUrl}/login`;
    console.log(loginUrl)
    let loginData = {
      user: user,
      password: pass,
    };
    axios.post(loginUrl, loginData).then((res) => {
      console.log(res.data);
      if (res.data.id) {
        localStorage.setItem("userID", res.data.id);
        localStorage.setItem("userEmail", res.data.email);
        setUserData(res.data);
      } else {
        setErrorMessage(res.data.message);
        setShowError(true);
      }
    });
  };

  let registerUser = (user, pass, email) => {
    let registerUrl = `${baseUrl}/register`;
    let registerData = {
      user: user,
      password: pass,
      email: email,
    };
    axios.post(registerUrl, registerData).then((res) => {
      if (res.data.message == "success") {
        setShowRegister(false);
      } else {
        setErrorMessage(res.data.message);
        setShowError(true);
      }
    });
  };

  let handleClick = () => {
    if (user && pass && !showRegister) {
      logUser(user, pass);
      if (userData.id) {
        setShowError(false);
        changeLoggedInTrue(userData);
      }
    } else {
      if (user && pass && email && showRegister) {
        registerUser(user, pass, email);
      } else {
        setErrorMessage("Please fill out the details");
        setShowError(true);
      }
    }
  };

  return (
    <div className="app-container login-card-container">
      {showError && <div className="error-bar">{errorMessage}</div>}
      <div className="login-card">
        <div className="login-header">
          {showRegister ? "Register" : "Login"}
          {showRegister && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => {
                setShowRegister(false);
              }}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          )}
        </div>
        <div className="login-input">
          {showRegister && (
            <input
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>
          )}
          <input
            placeholder="User"
            onChange={(e) => {
              setUser(e.target.value);
            }}
          ></input>
          <input
            placeholder="Password"
            type="password"
            onChange={(e) => {
              setPass(e.target.value);
            }}
          ></input>
          {!showRegister && (
            <div
              className="register-btn"
              onClick={() => {
                setShowRegister(true);
              }}
            >
              New user?
            </div>
          )}
          <div className="go-btn" onClick={handleClick}>
            Go
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginCard;
