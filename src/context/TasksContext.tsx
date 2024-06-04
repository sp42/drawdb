import React from 'react';
import { createContext, useState } from "react";

type TasksContextType = {
  tasks: []
  setTasks: React.Dispatch<React.SetStateAction<[]>>
  updateTask: (id: number, values: []) => void
};

export const TasksContext: React.Context<TasksContextType> = createContext({ tasks: [], setTasks: v => { }, updateTask(id, values) { } });

export default function TasksContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [tasks, setTasks] = useState<[]>([]);
  const updateTask = (id: number, values: []) => setTasks((prev: []) => prev.map((task, i: number) => (id === i ? { ...task, ...values } : task)));

  return <TasksContext.Provider value={{ tasks, setTasks, updateTask }}>
    {children}
  </TasksContext.Provider>;
}
