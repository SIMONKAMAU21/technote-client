import { io } from "socket.io-client";
import { ErrorToast, SuccessToast } from "../src/components/toaster";


export const API = import.meta.env.VITE_DOMAIN;
export const LOCAL = import.meta.env.VITE_LOCAL_DOMAIN;
const LOCAL_BASE = LOCAL.replace("/api", "");
export const socket = io(LOCAL_BASE, { retries: 3, ackTimeout: 10000 ,auth: { token: localStorage.getItem("token") }});
export const Onlinee =socket.on("connect", () => {
    SuccessToast("online")
    }
);
export const Offline = socket.on("disconnect", () => {
    ErrorToast("offline");
    }
);
