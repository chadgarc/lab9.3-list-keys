import { useState } from 'react'
import type { FilterHandle, Task, TaskStatus } from './types'
import { TaskList } from './components/TaskList/TaskList'
import { tasksData } from './data/tasksData'
import { TaskFilter } from './components/TaskFilter/TaskFilter'

function App() {

  const [filters, setFilters] = useState<FilterHandle>({})
  const [tasks, setTasks] = useState<Task[]>(tasksData)

  const updateStatusChange = (id: string, newStatus: TaskStatus) => {
    setTasks(previusTask =>
      previusTask.map(task => task.id === id ? { ...task, status: newStatus } : task )
    )
  }

  const deleteTask = (id: string) => {
    setTasks(previusTask =>
      previusTask.filter(task => task.id !== id)
    )
  }

  const handleFilter = (filter: FilterHandle) => {
    setFilters(prevFilter => ({ ...prevFilter, ...filter }))
  }

  const filteredTasks = (): Task[] => {
    const filteredTask = tasks.filter(task =>{
      const statusFilter = !filters.status || task.status === filters.status;

      const priorityFilter = !filters.priority || task.priority === filters.priority;

      return statusFilter && priorityFilter;
    })
    return filteredTask;
  }

  return (
    <>
    <section className='h-20 flex items-center justify-end gap-5 bg-slate-800 pe-10 rounded-xl'>
      <TaskFilter
        onFilterChange={handleFilter}
      />
    </section>
      <section className='my-auto'>
        <TaskList
        tasks={filteredTasks()}
        onStatusChange={updateStatusChange}
        onDelete={deleteTask}
        />
      </section>
    </>
  )
}

export default App
