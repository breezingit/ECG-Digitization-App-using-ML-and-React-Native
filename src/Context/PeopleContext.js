import React, { useContext, useState } from "react";
import { ThemeContext } from "react-native-elements";
import { set } from "react-native-reanimated";

const PeopleContext = React.createContext();
const setPeopleContext = React.createContext();

export function usePeople() {
  return useContext(PeopleContext);
}

export function useSetPeopleContext() {
  return useContext(setPeopleContext);
}
const NameDateDataContext = React.createContext();
const setNameDateDataContext = React.createContext();

export function useNameDateData() {
  return useContext(NameDateDataContext);
}

export function useSetNameDateData() {
  return useContext(setNameDateDataContext);
}

export function PeopleProvider({ children }) {
  const [people, setPeople] = useState({});

  const [nameDateData, setNameDateData] = useState({});

  return (
    <PeopleContext.Provider value={people}>
      <setPeopleContext.Provider value={setPeople}>
        <NameDateDataContext.Provider value={nameDateData}>
          <setNameDateDataContext.Provider value={setNameDateData}>
            {children}
          </setNameDateDataContext.Provider>
        </NameDateDataContext.Provider>
      </setPeopleContext.Provider>
    </PeopleContext.Provider>
  );
}
