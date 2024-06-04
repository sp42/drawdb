import React from 'react';
import { createContext, useState } from "react";
type TasksContext = {
};

type TasksContextType = {
  tasks: TasksContext[]
  setTasks: React.Dispatch<React.SetStateAction<TasksContext[]>>
  updateTask: (id: number, values: []) => void
};
const _tasks: TasksContext[] = [];
export const TasksContext: React.Context<TasksContextType> = createContext({ tasks: _tasks, setTasks: v => { }, updateTask(id, values) { } });

export default function TasksContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [tasks, setTasks] = useState<TasksContext[]>([]);
  const updateTask = (id: number, values: []) => setTasks((prev) => prev.map((task, i: number) => (id === i ? { ...task, ...values } : task)));

  return <TasksContext.Provider value={{ tasks, setTasks, updateTask }}>
    {children}
  </TasksContext.Provider>;
}
