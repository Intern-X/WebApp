import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Authorization/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import { useEffect, useState } from "react";
import { auth } from "./Firebase";
import { UNAUTHORIZED } from "./Utils/UserStates";
import authContext from "./Components/AuthContext/AuthContext";
import AllCompanies from "./Components/AllCompanies/AllCompanies";
import { useSelector } from "react-redux";
import ProjectPage from "./Components/Project/ProjectPage";
import Company from "./Components/AllCompanies/Company/Company";
import StudentProfile from "./Components/Profile/StudentProfile";
import NotFound from "./Components/NotFound/NotFound";
import AlumniRecruiters from "./Components/AlumniRecruiters/AlumniRecruiters";
import AlumniProfile from "./Components/AlumniRecruiters/AlumniProfile";
import RecruiterProfile from "./Components/AlumniRecruiters/RecruiterProfile";
function App() {

  const { isCompany } = useSelector((state) => state.userInfo);

  const mode = "no";

  if (mode === "production") {
    console.log = function () {};
    console.clear();
  }

  const [userImpl, setUserImpl] = useState(null);
  const [authImpl, setAuthImpl] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserImpl(user);
        setAuthImpl(user);
      } else {
        setUserImpl(UNAUTHORIZED);
        setAuthImpl(UNAUTHORIZED);
      }
    });
  }, []);


  return (
    <>
      {userImpl != null && userImpl != "unathorized" ? (
        <authContext.Provider
          value={{ userImpl, setUserImpl, authImpl, setAuthImpl }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={!isCompany ? <Dashboard /> : <Company />}/>
              <Route path="/companies" element={<AllCompanies />} />
              <Route path="/companies/:id" element={<Company />} />
              <Route path="/profile/:id" element={<StudentProfile />} />
              <Route path="/projects/:id" element={<ProjectPage />} />
              <Route path="/alumni-recruiters" element={<AlumniRecruiters />} />
              <Route path="/alumni/:id" element={<AlumniProfile />} />
              <Route path="/recruiters/:id" element={<RecruiterProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </authContext.Provider>
      ) : (
        <div></div>
      )}
    </>
  );
}


export default App;
