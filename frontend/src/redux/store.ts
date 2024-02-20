import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "./features/boards/boardsSlice";
import authReducer from "./features/authentications/authSlice"
import workspaceReducer from "./features/workspaces/workspaceSlice"

export const store = configureStore({
    reducer: {
        board: boardsReducer,
        //Other reducers
        auth: authReducer,
        workspace:workspaceReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

