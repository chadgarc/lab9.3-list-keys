
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export type Priority = 'low' | 'medium' | 'high'

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: Priority;
    dueDate: string;
}

export interface TaskListProps {
    tasks: Task[];
    onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
    onDelete: (taskId: string) => void;
}

export interface TaskItemProps {
    task: Task;
    onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
    onDelete: (taskId: string) => void;
}

export interface TaskFilterProps {
    onFilterChange: (filters: {
        status?: TaskStatus;
        priority?: Priority;
    }) => void;
}

export interface Option<T> {
    label: string,
    value: T
}

export interface SelectListProps<T> {
    defaultValue: T,
    options: Option<T>[],
    onChange: (value: T) => void
}

export interface FilterHandle {
    status?: TaskStatus,
    priority?: Priority
}