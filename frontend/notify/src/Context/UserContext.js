import React, { useState, createContext, useEffect } from "react";

const UserContext=createContext()

function userDetailsFromLocalStorage(){
    const storedUserDetails=localStorage.getItem('userDetails')
    return storedUserDetails ? JSON.parse(storedUserDetails) : null
}

const UserProvider=({children})=>{
    const [userDetails,setUserDetails]=useState(userDetailsFromLocalStorage)

    useEffect(()=>{
        if(userDetails){
            localStorage.setItem('userDetails',JSON.stringify(userDetails))
        }
    },[userDetails])

    return (
        <UserContext.Provider value={{userDetails,setUserDetails}}>
            {children}
        </UserContext.Provider>
    )
}

export {UserContext,UserProvider}



