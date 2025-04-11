import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { LoginApi } from "../src/pages/login/loginSlice";
import { StudentApi } from "../src/pages/student/studentSlice";
import { ClassApi } from "../src/pages/classes/classSlice";
import { SubjectApi } from "../src/pages/teacher/teacherSlice";
import { eventApi } from "../src/pages/events/eventSlice";
import { profileApi } from "../src/pages/profile/profileSlice";
import { MessageApi } from "../src/pages/inbox/inboxSlice";

export const store = configureStore({
  reducer: {
    [LoginApi.reducerPath]: LoginApi.reducer,
    [StudentApi.reducerPath]: StudentApi.reducer,
    [ClassApi.reducerPath]: ClassApi.reducer,
    [SubjectApi.reducerPath]: SubjectApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [MessageApi.reducerPath]: MessageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      LoginApi.middleware,
      StudentApi.middleware,
      ClassApi.middleware,
      SubjectApi.middleware,
      eventApi.middleware,
      profileApi.middleware,
      MessageApi.middleware
    ),
});

setupListeners(store.dispatch);
