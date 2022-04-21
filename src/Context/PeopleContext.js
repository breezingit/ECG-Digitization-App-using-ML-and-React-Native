import React, {useContext, useState} from 'react'
import { ThemeContext } from 'react-native-elements'

const PeopleContext = React.createContext()
const setPeopleContext = React.createContext()

export function usePeople(){
    return useContext(PeopleContext)
}

export function useSetPeopleContext(){
    return useContext(setPeopleContext)
}


export function PeopleProvider({children}){

    const [people, setPeople]= useState({})

    return(
        
        <PeopleContext.Provider value={people}>
            <setPeopleContext.Provider value={setPeople}>
                {children}
            </setPeopleContext.Provider>
        </PeopleContext.Provider>
    )

}