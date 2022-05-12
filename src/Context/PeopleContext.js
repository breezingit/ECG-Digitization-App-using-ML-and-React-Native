import React, { useContext, useState } from "react";

const PeopleContext = React.createContext();
const setPeopleContext = React.createContext();
const NameDateDataContext = React.createContext();
const setNameDateDataContext = React.createContext();
const incrementContext=React.createContext();
const setIncrementContext=React.createContext();

export function usePeople() {
  return useContext(PeopleContext);
}

export function useSetPeopleContext() {
  return useContext(setPeopleContext);
}

export function useNameDateData() {
  return useContext(NameDateDataContext);
}

export function useSetNameDateData() {
  return useContext(setNameDateDataContext);
}

export function useIncrement() {
  return useContext(incrementContext);
}

export function useSetIncrement() {
  return useContext(setIncrementContext);
}

export function PeopleProvider({ children }) {
  const [people, setPeople] = useState({});

  const [nameDateData, setNameDateData] = useState({});

  const [increment, setIncrement] = useState(false);

  return (
    <PeopleContext.Provider value={people}>
      <setPeopleContext.Provider value={setPeople}>
        <NameDateDataContext.Provider value={nameDateData}>
          <setNameDateDataContext.Provider value={setNameDateData}>
            <incrementContext.Provider value={increment}>
              <setIncrementContext.Provider value={setIncrement}>
                {children}
              </setIncrementContext.Provider>
            </incrementContext.Provider>
          </setNameDateDataContext.Provider>
        </NameDateDataContext.Provider>
      </setPeopleContext.Provider>
    </PeopleContext.Provider>
  );
}
