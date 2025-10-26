import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
export const AppContent = createContext();

export const AppContextProvider = ({children})=>{
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin,setIsLoggedin] = useState(false);
    const [userData, setuserData] = useState(false)
    const getAuthState = async ()=>{
        try {
            
            const {data} = await axios.get(backendurl + '/api/auth/is-auth',{ withCredentials: true })
            if(data.success){
                setIsLoggedin(true);
                getUserData();
            }
            else{

            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const getUserData = async () =>{
        try {
            const {data} = await axios.get(backendurl +'/api/UserData',{ withCredentials: true })
            console.log(data.success);
            data.success?setuserData(data.userData):toast.error(data.message)
            console.log(data.userData)
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getAuthState();
    },[])
    const value = {
        backendurl,isLoggedin,setIsLoggedin,userData,setuserData,getUserData
    }
    return <AppContent.Provider value={value}>
        {children}
    </AppContent.Provider>
}