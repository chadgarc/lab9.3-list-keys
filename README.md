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

- Generic `<select>` component
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

## ❗ Why { ...task, status: newStatus }?

Because React requires immutable updates.

- `...task` copies the entire object
- `status: newStatus` overwrites only the status
- A new object is created
- React detects the change and re-renders

If you mutated the object directly, React would NOT detect the change

## 🎚️ 6. Full Flow: Filters

Filters are confusing because:

- Each dropdown only updates one part of the filter
- The filter state must be merged
- The filter function must handle undefined values

### Step 1: User selects a filter

In TaskFilter:

```ts
onFilterChange({
  status: value === 'all-stats' ? undefined : value as TaskStatus
});
```

or

```ts
onFilterChange({
  priority: value === 'all-priorities' ? undefined : value as Priority
});
```

### Step 2: TaskFilter → App

In App:

``` ts
const handleFilter = (filter) => {
  setFilters(prev => ({ ...prev, ...filter }));
};
```

### ❗ Why { ...prev, ...filter }?

Because each dropdown only updates one field:

- status dropdown → { status: ... }
- priority dropdown → { priority: ... }

If we didn’t use spread:

- changing status would erase priority
- changing priority would erase status
- Spread merges the new filter with the old one.

### Step 3: App filters tasks

``` ts
const filteredTasks = tasks.filter(task => {
  const statusMatch = !filters.status || task.status === filters.status;
  const priorityMatch = !filters.priority || task.priority === filters.priority;
  return statusMatch && priorityMatch;
});
```

### Step 4: TaskList receives filtered tasks

Only tasks that match both filters are shown.

## 🧠 7. Why Spread Operators Are Necessary

{ ...task, status: newStatus }
Creates a new task object with updated status.

{ ...prevFilter, ...filter }
Creates a new filter object merging old + new values.

Without spreads:

- React wouldn’t detect changes
- Filters would overwrite each other
- Tasks would mutate incorrectly

Spread operators are essential for immutable state updates.

## 🧩 8. Summary of How Everything Works Together

### Delete Flow
TaskItem → TaskList → App → setTasks → re-render

### Status Change Flow
SelectList → TaskItem → TaskList → App → setTasks → re-render

### Filter Flow
SelectList → TaskFilter → App → setFilters → filteredTasks() → TaskList → re-render

### Types
Define the shape of data and enforce correctness.

### Spread Operators
Ensure immutable updates.

### Event Handlers
Send actions upward.

### e.target.value
Bridge between HTML strings and typed values.

## Reflection Questions
### How did you ensure unique keys for your list items?
Each task has a unique id, and the key prop uses that value to identify list items. This guarantees React can track each element correctly during rendering.

### What considerations did you make when implementing the filtering functionality?
I reused the same SelectList component that was originally built for choosing task priority. This made the filtering UI consistent and easier to maintain. The only thing that changed was the filtering logic itself. I also ensured that both filters (status and priority) could work together at the same time without interfering with each other.

### How did you handle state updates for task status changes?
I used useState, where the first value is the current state and the second is the setter function. Inside the setter, I used .map() to update only the specific task that needed its status changed, or .filter() when removing tasks. This creates a new list each time, which React requires for proper state updates.

### What challenges did you face when implementing conditional rendering?
The filtering feature required a lot of thought and several iterations. Building the filter component and making sure it interacted correctly with the rest of the app was not easy. Even now, it still takes me a moment to fully understand the logic when I revisit it. With more practice, this part will become more intuitive.