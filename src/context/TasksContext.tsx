import React from 'react';
import { createContext, useState } from "react";

export const TasksContext: React.Context<any> = createContext(null);

export default function TasksContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [tasks, setTasks] = useState([]);

  const updateTask = (id: number, values: []) =>
    setTasks((prev: React.SetStateAction<never[]>) => prev.map((task, i: number) => (id === i ? { ...task, ...values } : task)));


  return (
    <TasksContext.Provider value={{ tasks, setTasks, updateTask }}>
      {children}
    </TasksContext.Provider>
  );
}
