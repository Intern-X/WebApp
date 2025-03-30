import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./slices/userInfo";
import companyReducer from "./slices/companies";
import projectsReducer from "./slices/projects";
import studentsReducer from "./slices/students";
import statusReducer from "./slices/status";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import  { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
    key: "root",
    version: 1,
    storage
}

const reducer = combineReducers({
    userInfo: userInfoReducer,
    companies: companyReducer,
    projects: projectsReducer,
    students: studentsReducer,
    status: statusReducer,
});


const persistedReducer = persistReducer(persistConfig, reducer);

export default configureStore({
    reducer: persistedReducer,
});