/// <reference types="vite/client" />
import {AxiosInstance} from "axios";

export {};

declare global {
    interface Window {
        axios: AxiosInstance;
    }
}
