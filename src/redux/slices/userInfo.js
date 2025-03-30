import { createSlice } from "@reduxjs/toolkit";

export const userInfoSlice = createSlice({
    name: "userInfo",
    initialState: {
        "isCompany": false,
        "userInfo": {},
        "user": null,
    },
    reducers : {
        setIsCompany: (state, action) => {
            state.isCompany = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        resetUserInfo: (state) => {
            state.userInfo = {};
            state.user = null;
            state.isCompany = false;
        }
    }
});

export const { setIsCompany, setUserInfo, setUser, resetUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;   
