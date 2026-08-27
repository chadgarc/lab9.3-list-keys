import type { TaskListProps, TaskStatus } from "../../types";
import { TaskItem } from "../TaskItem/TaskItem";


export function TaskList({
    tasks,
    onStatusChange,
    onDelete
    }:TaskListProps){

    const handleStatusChange = (id: string, newStatus: TaskStatus) => {
        onStatusChange(id, newStatus);
    }

    const handleDelete = (id: string) => {
        onDelete(id);
    }

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