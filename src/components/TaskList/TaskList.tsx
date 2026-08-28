import type { TaskListProps, TaskStatus } from "../../types";
import { TaskItem } from "../TaskItem/TaskItem";

/**
 * Renders a list of tasks and delegates user interactions
 * (status change and deletion) to callback functions provided
 * by the parent component.
 *
 * @component
 * @param {TaskListProps} props - Props for the TaskList component.
 * @param {Task[]} props.tasks - Array of tasks to display.
 * @param {(id: string, newStatus: TaskStatus) => void} props.onStatusChange
 *        Callback fired when a task's status is changed.
 * @param {(id: string) => void} props.onDelete
 *        Callback fired when a task is deleted.
 */
export function TaskList({
    tasks,
    onStatusChange,
    onDelete
    }:TaskListProps){

    /**
     * Handles status updates for a specific task.
     *
     * @function
     * @param {string} id - ID of the task being updated.
     * @param {TaskStatus} newStatus - New status selected by the user.
     *
     * Delegates the update to the parent callback `onStatusChange`.
     */
    const handleStatusChange = (id: string, newStatus: TaskStatus) => {
        onStatusChange(id, newStatus);
        console.log(tasks)
    }

    /**
     * Handles deletion of a specific task.
     *
     * @function
     * @param {string} id - ID of the task to delete.
     *
     * Delegates the deletion to the parent callback `onDelete`.
     */
    const handleDelete = (id: string) => {
        onDelete(id);
    }

    /**
     * Maps over the list of tasks and renders a TaskItem for each one.
     * Each TaskItem receives its own data and the delegated handlers.
     */
    return (
        <ul className="list bg-base-100 rounded-box shadow-md">
            {tasks.map(task => {
                return (
                <TaskItem
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                />)
            })}
        </ul>
    )
}