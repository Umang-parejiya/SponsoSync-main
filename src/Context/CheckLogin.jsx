import {  createContext } from "react";
import React from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const LoginContext = createContext();


export const LoginContextProvider = ({ children }) => {


    const navigate = useNavigate();
    
    const checkIsLogin = async(username , password)=>{
            try {
            

        } catch (error) {
            console.error(error);
        }
    
    }

    return (
        <LoginContext.Provider value={ {checkIsLogin} }>
            {children}
        </LoginContext.Provider>
    )
}