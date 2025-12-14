import axios from "axios";
import SummaryApi , { baseURL } from "../common/SummaryApi";


const Axios = axios.create({
    baseURL : baseURL,
    withCredentials : true
})

// sending access token in the header 
Axios.interceptors.request.use(
    async(config)=>{
        const accessToken =localStorage.getItem('accesstoken')

        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)
// extend the life span of access token with
// the help of refresh
Axios.interceptors.request.use(
    (response)=>{
        return response
    },
    async(error)=>{
        let originRequest = error.config

        if(error.response.status === 401 && !originRequest.retry){
            originRequest.retry = true

            const refreshToken = localStorage.getItem("refreshToken")

            if(refreshToken){
                const newAccessToken = await refreshAccessToken(refreshToken)

                if(newAccessToken){
                    originRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    return Axios(originRequest)
                }
            }
        }
        return Promise.reject(error)
    }
)

const refreshAccessToken =  async(refreshToken)=>{
    try {
        const response = await Axios({
            ...SummaryApi.refreshToken,
            headers : {
                Authorization : `Bearer ${refreshToken}`
            }
        })
        const accessToken = response.data.data.accessToken
        localStorage.setItem('accesstoken',accessToken)
        return accessToken 
    } catch (error) {
        console.log(error)
    }
}

export default Axios


// // import axios from "axios";
// // import SummaryApi, { baseURL } from "../common/SummaryApi";

// // const Axios = axios.create({
// //     baseURL: baseURL,
// //     withCredentials: true,
// // });

// // // Send access token in headers
// // Axios.interceptors.request.use(
// //     async (config) => {
// //         const accessToken = localStorage.getItem("accesstoken");

// //         if (accessToken) {
// //             config.headers.Authorization = `Bearer ${accessToken}`;
// //         }

// //         return config;
// //     },
// //     (error) => {
// //         return Promise.reject(error);
// //     }
// // );

// // // Handle 401 errors (access token expired)
// // Axios.interceptors.response.use(
// //     (response) => response, // Keep successful responses unchanged
// //     async (error) => {
// //         const originalRequest = error.config;

// //         if (error.response?.status === 401 && !originalRequest._retry) {
// //             originalRequest._retry = true; // Prevent infinite loops

// //             const refreshToken = localStorage.getItem("refreshToken");

// //             if (refreshToken) {
// //                 const newAccessToken = await refreshAccessToken(refreshToken);

// //                 if (newAccessToken) {
// //                     // Retry original request with new token
// //                     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
// //                     return Axios(originalRequest);
// //                 }
// //             }
// //         }

// //         // If refresh fails, remove tokens and don't trigger popups
// //         if (error.response?.status === 401) {
// //             console.log("User is not authenticated. Handling silently.");
// //             localStorage.removeItem("accesstoken");
// //             localStorage.removeItem("refreshToken");
// //             return Promise.resolve(null); // Prevents throwing an error
// //         }

// //         return Promise.reject(error);
// //     }
// // );

// // const refreshAccessToken = async (refreshToken) => {
// //     try {
// //         const response = await Axios({
// //             ...SummaryApi.refreshToken,
// //             headers: {
// //                 Authorization: `Bearer ${refreshToken}`,
// //             },
// //         });

// //         const newAccessToken = response.data.data.accessToken;
// //         localStorage.setItem("accesstoken", newAccessToken);
// //         return newAccessToken;
// //     } catch (error) {
// //         console.log("Refresh token expired. User must log in again.");
// //         localStorage.removeItem("accesstoken");
// //         localStorage.removeItem("refreshToken");
// //         return null;
// //     }
// // };

// // export default Axios;
