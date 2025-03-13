import axios from "axios";

const API_URL = "http://192.168.40.118:5000/auth";


export interface LoginData{
    username: string;
    password: string;
}

export interface RegisterData{
    username: string;
    password: string;
}



export const login = async (data: LoginData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, data);
        console.log("Token received:", response.data.token); // ✅ Check the token format

        if (typeof response.data.token === "string") {
            localStorage.setItem("token", response.data.token); // ✅ Store token as string
        } else {
            console.error("Invalid token format:", response.data.token);
        }
        
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const register = async (data: RegisterData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    console.log("Retrieved Token:", token); // Check token format

    return token ? { Authorization: `Bearer ${token}` } : {};
};


export const getUserInfo = async () => {
    try {
        const headers = getAuthHeaders();
        console.log("Auth Headers:", headers); // Debug log
        const response = await axios.get(`${API_URL}/userinfo`, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const logout = () => {
    localStorage.removeItem("token");
};

export const getAuthToken = () => {
    return localStorage.getItem("token");
};


export default {login, register, logout, getAuthToken, getUserInfo, getAuthHeaders};