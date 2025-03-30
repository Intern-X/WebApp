// IMPORTS
import { useEffect, useState, useContext } from "react";

// STYLESHEETS
import "./Login.css";

import LoginView from "./LoginView/LoginView";
import { useNavigate } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase.js";
import AuthContext from "../Components/AuthContext/AuthContext.js";


// REDUX
import { useDispatch } from "react-redux";
import { resetCompanies, setAllCompanies, setInterestCompanies } from "../redux/slices/companies.js";
import { resetProjects, setAllProjects } from "../redux/slices/projects.js";
import { resetStudents, setAllStudents, setInterestStudents } from "../redux/slices/students.js";
import { setUser, setIsCompany, setUserInfo, resetUserInfo } from "../redux/slices/userInfo.js";
import RequestUtils from "../Utils/RequestUtils.js";
import RefreshData from "../Utils/getData.js";


// LOGIN PAGE
function Login() {
  // CONSTANTS AND USESTATE HOOKS

  const navigate = useNavigate();
  const dispatch = useDispatch();
  let [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      initializeStates(user);
    } else {
      navigate("/");
      dispatch(resetCompanies());
      dispatch(resetProjects());
      dispatch(resetStudents());
      dispatch(resetUserInfo());
    }
  }, [user, loading]);

  const initializeStates = (user) => {
    RefreshData.refreshData(user).then((data) => {

      let projects = data[1];


      dispatch(setAllCompanies(data[0]));
      dispatch(setAllProjects(projects));
      dispatch(setIsCompany(data[2]));
      dispatch(setUserInfo(data[3]));
      dispatch(setAllStudents(data[4]));


    }
    );
  }

  // DISPLAY LOGIN PAGE(S)
    return (
      <>
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            height: "100vh",
          }}
          className="wrapper"
        >
          <LoginView />
        </div>
      </>
    );
}
export default Login;