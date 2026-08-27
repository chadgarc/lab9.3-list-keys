import type { Task } from "../types";

export const tasksData: Task[] = [
    {
      id: '2020',
      title: 'Task 1',
      description: 'Some description',
      status: 'completed',
      priority: 'low',
      dueDate: '04/15/2026'
    },
    {
      id: '2030',
      title: 'Task 2',
      description: 'Another description',
      status: 'pending',
      priority: 'medium',
      dueDate: '04/20/2026'
    },
    {
      id: '2045',
      title: 'Task 3',
      description: 'Another another description',
      status: 'pending',
      priority: 'high',
      dueDate: '04/22/2026'
    },
    {
      id: '4010',
      title: 'Task 4',
      description: 'More descriptions',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '04/26/2026'
    },
    {
      id: '2430',
      title: 'Task 5',
      description: 'More and more descriptions',
      status: 'completed',
      priority: 'high',
      dueDate: '04/25/2026'
    }
  ]