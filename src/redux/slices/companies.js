import { createSlice } from "@reduxjs/toolkit";

export const companiesSlice = createSlice({
    name: "companies",
    initialState: {
        "allCompanies" : [],
    },
    reducers : {
        setAllCompanies: (state, action) => {
            state.allCompanies = action.payload;
        }, 
        // setInterestCompanies: (state, action) => {
        //     state.interestCompanies = action.payload;
        // },
        resetCompanies: (state) => {
            state.allCompanies = [];
            // state.interestCompanies = [];
        }
    }
});

export const { setAllCompanies, setInterestCompanies, resetCompanies } = companiesSlice.actions;
export default companiesSlice.reducer;