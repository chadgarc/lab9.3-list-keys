import type { TaskItemProps, TaskStatus } from "../../types";
import { SelectList } from "../SelectList/SelectList";

export function TaskItem({
    task,
    onStatusChange,
    onDelete}: TaskItemProps){

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
            
            {/* <select defaultValue={task.status}
                    className="select ms-auto text-wrap w-35 select-neutral bg-gray-300 text-black "
                    onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                    >
                <option value={'pending'}>Pending</option>
                <option value={'in-progress'}>In Progress</option>
                <option value={'completed'}>Completed</option>
            </select> */}
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

            <button className="btn btn-error" onClick={() => onDelete?.(task.id)}>Delete</button>
        </li>
    )
}