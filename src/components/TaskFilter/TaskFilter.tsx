import type { TaskFilterProps, TaskStatus } from "../../types";
import { SelectList } from "../SelectList/SelectList";

export function TaskFilter({
    onFilterChange
    }:TaskFilterProps){

    return (
        <>
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
                    priority: value === 'all-priorities' ? undefined : value as ('low' | 'medium' | 'high')
                })
            }}
            />
        </>
    )
}