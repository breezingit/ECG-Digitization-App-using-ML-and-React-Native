
import React, {useContext, useState} from 'react'
import { ThemeContext } from 'react-native-elements'

const AuthContext = React.createContext()
const setAuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function useSetAuth(){
    return useContext(setAuthContext)
}


export function AuthProvider({children}){

    const [auth, setAuth]= useState("")

    return(
        
        <AuthContext.Provider value={auth}>
            <setAuthContext.Provider value={setAuth}>
                {children}
            </setAuthContext.Provider>
        </AuthContext.Provider>
    )

}