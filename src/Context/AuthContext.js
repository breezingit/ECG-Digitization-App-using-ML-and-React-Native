
import React, {useContext, useState} from 'react'
import { ThemeContext } from 'react-native-elements'

const AuthContext = React.createContext()
const setAuthContext = React.createContext()
const EmailContext = React.createContext()
const setEmailContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function useSetAuth(){
    return useContext(setAuthContext)
}
export function useEmail(){
    return useContext(EmailContext)
}

export function useSetEmail(){
    return useContext(setEmailContext)
}


export function AuthProvider({children}){

    const [auth, setAuth]= useState("")
    const [email, setEmail]= useState("")

    return(
        
        <AuthContext.Provider value={auth}>
            <setAuthContext.Provider value={setAuth}>
                <EmailContext.Provider value={email}>
                    <setEmailContext.Provider value={setEmail}>
                        {children}
                    </setEmailContext.Provider>
                </EmailContext.Provider>
            </setAuthContext.Provider>
        </AuthContext.Provider>
    )

}