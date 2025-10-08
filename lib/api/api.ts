import axios from "axios";
import serverURL from '../constant/serverURL'
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from "react-native-encrypted-storage";
// url 호출 시 기본 값 셋팅
const api = axios.create({
    baseURL: serverURL,
    headers: { "Content-type": "application/json" }, // data type
});
//api.defaults.withCredentials = true

// Add a request interceptor
api.interceptors.request.use(

    async function (config: any) {
        //const token = localStorage.getItem("token");
        const accessToken = await EncryptedStorage.getItem('accessToken')
        const refreshToken = await EncryptedStorage.getItem('refreshToken')

        //요청시 AccessToken 계속 보내주기
        if (!accessToken || !refreshToken) {
            config.headers.accessToken = null;
            config.headers.refreshToken = null;
            return config;
        }
        if (config.headers && accessToken && refreshToken) {
            //const { accessToken, refreshToken } = JSON.parse(token);
            config.headers.authorization = `Bearer ${accessToken}`;
            config.headers.refreshToken = `Bearer ${refreshToken}`;
            return config;
        }
        // Do something before request is sent
        console.log("request start", config);
    },
    function (error) {
        // Do something with request error
        console.log("request error", error);
        return Promise.reject(error);
    }
);


// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        try {
            const originalRequest = error.config;
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const accessToken = await EncryptedStorage.getItem('accessToken')
                    const refreshToken = await EncryptedStorage.getItem('refreshToken')
                    const {
                        data: { ok = '', data: { accessToken: newAccessToken = '', refreshToken: newRefreshToken = '' } = {} } = {},
                    } = await axios.post(
                        `${serverURL}/user/auth/renewal`, // token refresh api
                        {},
                        { headers: { authorization: `Bearer ${accessToken}`, refreshToken: `Bearer ${refreshToken}` } }
                    );
                    if (ok) {
                        if (accessToken) await EncryptedStorage.setItem('accessToken', newAccessToken)
                        if (refreshToken) await EncryptedStorage.setItem('refreshToken', newRefreshToken)
                        originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
                        return axios(originalRequest);
                    }
                } catch (error: any) {
                    const axiosError = error;
                    if (axiosError.isAxiosError && axiosError.response?.status === 404) {
                        //로그아웃
                    }
                }
            }
            return Promise.reject(error);
        } catch (err) {
            throw error;
        }
    }
);

export default api;