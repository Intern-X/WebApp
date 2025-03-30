import { createSlice } from "@reduxjs/toolkit";

export const studentsSlice = createSlice({
    name: "students",
    initialState: {
        "allStudents" : [],
        "interestStudents" : [],
    },
    reducers : {
        setAllStudents: (state, action) => {
            state.allStudents = action.payload;
        }, 
        setInterestStudents: (state, action) => {
            state.interestStudents = action.payload;
        },
        resetStudents: (state) => {
            state.allStudents = [];
            state.interestStudents = [];
        }
    }
});

export const { setAllStudents, setInterestStudents, resetStudents } = studentsSlice.actions;
export default studentsSlice.reducer;