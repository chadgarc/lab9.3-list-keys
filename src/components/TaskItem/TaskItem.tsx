import type { TaskItemProps, TaskStatus } from "../../types";
import { SelectList } from "../SelectList/SelectList";

/**
 * Renders a single task item with its details, priority indicator,
 * status selector, and delete action. This component does not manage
 * state internally; instead, it delegates updates and deletions to
 * callback functions provided by the parent component.
 *
 * @component
 * @param {TaskItemProps} props - Props for the TaskItem component.
 * @param {Task} props.task - The task data to display.
 * @param {(taskId: string, newStatus: TaskStatus) => void} props.onStatusChange
 *        Callback fired when the user selects a new status.
 * @param {(taskId: string) => void} props.onDelete
 *        Callback fired when the user deletes the task.
 */
export function TaskItem({
    task,
    onStatusChange,
    onDelete}: TaskItemProps){

    /**
     * Maps the task's priority to a corresponding CSS class
     * used to visually indicate urgency.
     *
     * @constant
     * @type {string}
     */
    const priorityClass = {
        'low': 'status-info',
        'medium': 'status-warning',
        'high': 'status-error',
        }[task.priority];

    return (
        <li className="list-col-grow sm:list-row min-h-45 ps-10 pe-10 pt-5 pb-5 bg-slate-800">
            
            <section className="flex flex-col justify-between w-120 text-wrap">
                <div>
                    <h2 className="text-start">{task.title}</h2>

                    <p className="list-col-wrap text-start text-sm min-h-20">
                    {task.description}
                    </p>
                </div>

                <div className="flex justify-start gap-5 items-center">
                    <div className={`status animate-bounce ${priorityClass}`}></div>Priority: {task.priority}
                    <p>Due: {task.dueDate}</p>
                </div>
                
            </section>

            {/*
             * Status selector for the task. Uses the reusable SelectList
             * component to allow the user to change the task's workflow state.
             *
             * When a new status is selected, the parent callback `onStatusChange`
             * is invoked with the task ID and the new status value.
             */}
            <div className="ms-auto">
                <SelectList
                defaultValue={task.status}
                options={[
                    {label: 'Pending', value: 'pending'},
                    {label: 'In Progress', value: 'in-progress'},
                    {label: 'Completed', value: 'completed'}
                ]}
                onChange={(newStatus) => onStatusChange(task.id, newStatus as TaskStatus)}
                />
            </div>

            {/*
             * Deletes the current task by invoking the parent callback `onDelete`.
             * The task ID is passed upward so the parent can update its state.
             */}
            <button className="btn btn-error" onClick={() => onDelete?.(task.id)}>Delete</button>
        </li>
    )
}