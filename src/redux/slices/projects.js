import { createSlice } from "@reduxjs/toolkit";

export const projectsSlice = createSlice({
    name: "projects",
    initialState: {
        "allProjects" : [],
        "interestProjects" : [],
    },
    reducers : {
        setAllProjects: (state, action) => {
            state.allProjects = action.payload;
        }, 
        setInterestProjects: (state, action) => {
            state.interestProjects = action.payload;
        },
        resetProjects: (state) => {
            state.allProjects = [];
        }   
    }
});

export const { setAllProjects, setInterestProjects, resetProjects } = projectsSlice.actions;
export default projectsSlice.reducer;
