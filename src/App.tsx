import { useState } from 'react'
import type { FilterHandle, Task, TaskStatus } from './types'
import { TaskList } from './components/TaskList/TaskList'
import { tasksData } from './data/tasksData'
import { TaskFilter } from './components/TaskFilter/TaskFilter'

/**
 * Main application component. Manages global task state, filter state,
 * and delegates rendering to TaskFilter and TaskList. All business logic
 * (update, delete, filter) lives here.
 *
 * @component
 */
function App() {

  /**
   * Stores the active filter selections for tasks.
   * Each filter field is optional and merged incrementally.
   *
   * @type {FilterHandle}
   */
  const [filters, setFilters] = useState<FilterHandle>({})

  /**
   * Main task list state. Contains all tasks before filtering.
   *
   * @type {Task[]}
   */
  const [tasks, setTasks] = useState<Task[]>(tasksData)

  /**
   * Updates the status of a specific task.
   *
   * @function
   * @param {string} id - ID of the task to update.
   * @param {TaskStatus} newStatus - New status selected by the user.
   *
   * Maps over the existing tasks and replaces only the matching one.
   */
  const updateStatusChange = (id: string, newStatus: TaskStatus) => {
    setTasks(previusTask =>
      previusTask.map(task => task.id === id ? { ...task, status: newStatus } : task )
    )
  }

  /**
   * Deletes a task from the list.
   *
   * @function
   * @param {string} id - ID of the task to remove.
   *
   * Filters out the task with the matching ID.
   */
  const deleteTask = (id: string) => {
    setTasks(previusTask =>
      previusTask.filter(task => task.id !== id)
    )
  }

  /**
   * Merges a partial filter update into the existing filter state.
   *
   * @function
   * @param {FilterHandle} filter - Partial filter update (status or priority).
   *
   * Allows each SelectList to update only its own field.
   */
  const handleFilter = (filter: FilterHandle) => {
    setFilters(prevFilter => ({ ...prevFilter, ...filter }))
  }

  /**
   * Computes the list of tasks that match the active filters.
   *
   * @function
   * @returns {Task[]} Filtered tasks based on status and priority.
   *
   * A task is included only if:
   * - its status matches the filter (if provided)
   * - its priority matches the filter (if provided)
   */
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
