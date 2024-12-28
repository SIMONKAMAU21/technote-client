import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { LoginApi } from "../src/pages/login/loginSlice";
import { StudentApi } from "../src/pages/student/studentSlice";
import { ClassApi } from "../src/pages/classes/classSlice";

export const store = configureStore({
    reducer:{
[LoginApi.reducerPath]:LoginApi.reducer,
[StudentApi.reducerPath]:StudentApi.reducer,
[ClassApi.reducerPath]: ClassApi.reducer
    },
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            LoginApi.middleware,
            StudentApi.middleware,
            ClassApi.middleware
        )
})

setupListeners(store.dispatch)