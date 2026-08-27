import type { TaskItemProps, TaskStatus } from "../../types";

export function TaskItem({
    task,
    onStatusChange,
    onDelete}: TaskItemProps){

    const statusClass = {
        'pending': 'status-neutral',
        'in-progress': 'status-warning',
        'completed': 'status-success',
        }[task.status];

    return (
        <li className="list-row">
            <div>
                <div><h2>{task.title}</h2></div>
            </div>
            
            <div>
                <p className="list-col-wrap text-xs">
                {task.description}
                </p>
                <div className="flex justify-start gap-5">
                    <div className={`status animate-bounce ${statusClass}`}></div> {task.priority}
                    <p>Due: {task.dueDate}</p>
                </div>
                
            </div>
            
            <select defaultValue={task.status}
                    className="select"
                    onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                    >
                <option value={'pending'}>Pending</option>
                <option value={'in-progress'}>In Progress</option>
                <option value={'completed'}>Completed</option>
            </select>

            <button className="btn btn-error" onClick={(e) => onDelete?.(task.id)}>Delete</button>
        </li>
    )
}