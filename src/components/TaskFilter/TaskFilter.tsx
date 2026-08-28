import type { Priority, TaskFilterProps, TaskStatus } from "../../types";
import { SelectList } from "../SelectList/SelectList";

/**
 * Renders two dropdown filters (status and priority) and notifies the parent
 * component whenever either filter changes. Each SelectList sends only the
 * relevant part of the filter (status or priority), allowing the parent to
 * merge partial updates into a full filter state.
 *
 * @component
 * @param {TaskFilterProps} props - Props for the TaskFilter component.
 * @param {(filters: { status?: TaskStatus; priority?: Priority }) => void} props.onFilterChange
 *        Callback fired whenever the user updates one of the filters.
 */
export function TaskFilter({
    onFilterChange
    }:TaskFilterProps){

    return (
        <>
            {/*
             * Status filter dropdown.
             *
             * Sends `{ status: undefined }` when "All Statuses" is selected,
             * otherwise sends `{ status: <TaskStatus> }`.
             *
             * The parent merges this partial filter with the existing filter state. */}
            <SelectList
            defaultValue={'all'}
            options={[
                { label: 'All Statuses', value: 'all-stats' },
                { label: 'Pending', value: 'pending' },
                { label: 'In Progress', value: 'in-progress' },
                { label: 'Completed', value: 'completed' }
            ]}
            onChange={(value) => {
                onFilterChange({
                    status: value === 'all-stats' ? undefined : value as TaskStatus
                })}}
            />
            {/**
             * Priority filter dropdown.
             *
             * Sends `{ priority: undefined }` when "All Priorities" is selected,
             * otherwise sends `{ priority: <Priority> }`.
             *
             * The parent merges this partial filter with the existing filter state.
             */}
            <SelectList
            defaultValue={'all-priorities'}
            options={[
                { label: 'All Priorities', value: 'all-priorities' },
                { label: 'High', value: 'high' },
                { label: 'Medium', value: 'medium' },
                { label: 'Low', value: 'low' }
            ]}
            onChange={value => {
                onFilterChange({
                    priority: value === 'all-priorities' ? undefined : value as Priority
                })
            }}
            />
        </>
    )
}