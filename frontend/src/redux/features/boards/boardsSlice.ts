import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Board {
    id: string;
    title: string;
}

interface BoardState {
    //Define state
    boards: [{
        id: string;
        title: string;
    }]
}

const initialState: BoardState = {
    //Initial state
    boards: [{ id: `${Math.random()}`, title: "Default Board" }]
};

const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        //Define reducers
        addBoard: (state, action: PayloadAction<Board>) => {
            state.boards.push(action.payload);
        }
        //Other actions
    },
});

export const { addBoard } = boardSlice.actions;
export default boardSlice.reducer;
