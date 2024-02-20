import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Workspace } from "./workspaceTypes";
const initialState = {
    //Initial state
    Workspaces: [] as Workspace[]
};


const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        //Define reducers
        InitialWorkspace: (state, action: PayloadAction<Workspace[]>) => {
            state.Workspaces.push(...action.payload)
        }
    },
});

export const { InitialWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;




