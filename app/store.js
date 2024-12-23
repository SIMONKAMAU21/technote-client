import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { LoginApi } from "../src/pages/login/loginSlice";
import { StudentApi } from "../src/pages/student/studentSlice";

export const store = configureStore({
    reducer:{
[LoginApi.reducerPath]:LoginApi.reducer,
[StudentApi.reducerPath]:StudentApi.reducer
    },
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            LoginApi.middleware,
            StudentApi.middleware
        )
})

setupListeners(store.dispatch)