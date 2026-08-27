# 📘 Task Manager – Architecture & Flow Documentation

This document explains how the application works internally, how each component interacts with the others, and how TypeScript types shape the entire structure.
It also describes the full flow of user actions: deleting tasks, changing status, and applying filters.

The goal is to make the logic understandable even if the code looks complex at first.

## 🧩 1. Types as the Foundation of the App

The entire app is built around a set of TypeScript types. These types define:

- What a task looks like
- What values are allowed
- What components must receive

Every component is designed around these types.
For example:

- TaskList receives Task[]
- TaskItem receives a single Task
- TaskFilter receives a callback that accepts { status?, priority? }

This ensures the app is predictable and prevents invalid values.

## 🏗️ 2. Component Architecture

```bash
App
 ├── TaskFilter ───────┐
 └── TaskList          │
       └── TaskItem    │
            └── SelectList
```

### App

- Holds the real state (tasks and filters)
- Contains all business logic (update, delete, filter)
- Passes data down and receives events up

### TaskFilter

- Renders two dropdowns (status + priority)
- Sends partial filter updates upward

### TaskList

- Receives filtered tasks
- Renders each TaskItem
- Passes callbacks down

### TaskItem

- Displays a single task
- Allows status change and deletion
- Calls parent callbacks

### SelectList

- Generic <select> component
- Works with any type (T)
- Converts values to/from strings

## 🔄 3. Data Flow: Upward Events & Downward Data

React uses unidirectional data flow:

### Data flows DOWN
From parent → child
`App → TaskList → TaskItem`

### Events flow UP
From child → parent
`TaskItem → TaskList → App`

This is why:

- Children never modify state directly
- Children call callbacks
- Parents update state
- React re-renders with new data

## 🗑️ 4. Full Flow: Deleting a Task

### Step 1: User clicks Delete

In `TaskItem`:

```tsx
<button onClick={() => onDelete(task.id)}>Delete</button>
```
This calls `onDelete(task.id)`.

### Step 2: TaskItem → TaskList

`TaskList` receives the ID and forwards it:

```ts
const handleDelete = (id) => onDelete(id);
```

### Step 3: TaskList → App

In `App`:

```tsx
<TaskList onDelete={deleteTask} />
```

So `onDelete` is actually `deleteTask`.

### Step 4: App updates state

```ts
setTasks(prev => prev.filter(task => task.id !== id));
```

This creates a new array without the deleted task.

### Step 5: React re-renders

1. `tasks` changed → `filteredTasks()` recalculates
2. `TaskList` receives the new list
3. The deleted `TaskItem` disappears

### How many components does Delete pass through?

1. TaskItem
2. TaskList
3. App
4. TaskList (re-render)
5. TaskItem (new list)

## 🔁 5. Full Flow: Changing Task Status

This is the most confusing part because it involves:

- Generic components
- Event handlers
- Type casting
- Spread operators

### Step 1: User selects a new status

In TaskItem:

```tsx
<SelectList
  defaultValue={task.status}
  options={[
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' }
  ]}
  onChange={(newStatus) => onStatusChange(task.id, newStatus as TaskStatus)}
/>
```

### Step 2: Why e.target.value?

Inside SelectList:

```tsx
onChange={(e) => {
  const selected = options.find(option => `${option.value}` === e.target.value);
  if (selected) onChange(selected.value);
}}
```

HTML `<select>` always returns strings

But our app uses typed values (`TaskStatus`, `Priority`, etc.)

So we:

- Convert option values to strings
- Compare with e.target.value
- Map back to the original typed value
- This is why `SelectList<T>` works with any type.

### Step 3: TaskItem → TaskList

TaskItem calls:

```ts
onStatusChange(task.id, newStatus)
```

### Step 4: TaskList → App

TaskList forwards the event:

``` ts
const handleStatusChange = (id, newStatus) => onStatusChange(id, newStatus);
```

### Step 5: App updates the task

``` ts
setTasks(prev =>
  prev.map(task =>
    task.id === id ? { ...task, status: newStatus } : task
  )
);
```