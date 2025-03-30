import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Authorization/Login';
import { Provider } from 'react-redux';
import store from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import Dashboard from './Components/Dashboard/Dashboard';
import AllCompanies from './Components/AllCompanies/AllCompanies';
import { ConfigProvider, theme } from 'antd';
import Company from './Components/AllCompanies/Company/Company';
import StudentProfile from './Components/Profile/StudentProfile';
import ProjectPage from './Components/Project/ProjectPage';
import AlumniRecruiters from './Components/AlumniRecruiters/AlumniRecruiters';
import RecruiterProfile from './Components/AlumniRecruiters/RecruiterProfile';
import AlumniProfile from './Components/AlumniRecruiters/AlumniProfile';
function App() {
  let persistor = persistStore(store);
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#786AC9',

            },
            algorithm: theme.darkAlgorithm
          }}
        >
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />}/>
              <Route path="/companies" element={<AllCompanies />} />
              <Route path="/companies/:id" element={<Company />} />
              <Route path="/profile/:id" element={<StudentProfile />} />
              <Route path="/projects/:id" element={<ProjectPage />} />
              <Route path="/alumni-recruiters" element={<AlumniRecruiters />} />
              <Route path="/alumni/:id" element={<AlumniProfile />} />
              <Route path="/recruiters/:id" element={<RecruiterProfile />} />
            </Routes>
          </Router>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;