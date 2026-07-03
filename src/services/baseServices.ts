import axios from "axios";
import { getUser, setUser } from "./tokenService";

export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const REQUEST_TIMEOUT = 50000;

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    withCredentials: true, // Send and receive cookies (like refreshToken)
});

// Request interceptor to attach bearer token
instance.interceptors.request.use(
    (config) => {
        const authData = getUser();
        if (authData?.accessToken) {
            config.headers.Authorization = `Bearer ${authData.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — refresh token on 401 Unauthorized
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const authData = getUser();
        const originalConfig = error.config;

        if (error.response?.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;

            try {
                // Call backend refresh route which reads the httpOnly cookie
                const res = await instance.post("/auth/refresh");

                if (res.data?.success) {
                    const { accessToken } = res.data.data;

                    if (authData) {
                        setUser({
                            ...authData,
                            accessToken,
                        });
                    }

                    originalConfig.headers.Authorization = `Bearer ${accessToken}`;
                    return instance(originalConfig); // retry request with new token
                }
            } catch (refreshError) {
                if (authData) {
                    setUser(null);
                    window.location.reload();
                }
                console.error("Error refreshing token:", refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;