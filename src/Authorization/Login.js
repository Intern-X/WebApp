// IMPORTS
import { useEffect, useState, useContext } from "react";

// STYLESHEETS
import "./Login.css";

// IMAGES
import pageImage from "../assets/images/cover_image_internx.png";
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
  const { setUserImpl } = useContext(AuthContext);
  let [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      initializeStates(user);
      setUserImpl(user);
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

      let imageMap = {};
                // console.log(data);
      for (let i = 0; i < data[0].length; i++) {
          let val = data[0][i];

          imageMap[val.id] = val.imageLink;
      }

      let projects = data[1];

      for (let i = 0; i < projects.length; i++) {
          projects[i].avatar = imageMap[projects[i].company];
      }

      dispatch(setAllCompanies(data[0]));
      dispatch(setAllProjects(projects));
      dispatch(setIsCompany(data[2]));
      dispatch(setUserInfo(data[3]));
      dispatch(setAllStudents(data[4]));


    }).then(() => {
      navigate("/dashboard");
    }
    );
  }

  // DISPLAY LOGIN PAGE(S)
  return (
    <>
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          background: `url(${pageImage}) no-repeat scroll center center`,
          backgroundSize: "cover",
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