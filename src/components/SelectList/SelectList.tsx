import type { SelectListProps, TaskStatus } from "../../types";

export function SelectList<T> ({
    defaultValue,
    options,
    onChange}: SelectListProps<T>) {
    
        return (
        <select
        defaultValue={defaultValue as any}
        className="select text-wrap w-35 select-neutral bg-gray-300 text-black"
        onChange={(e) => {
            const selected = options.find(option => `${option.value}` === e.target.value);
            if(selected) onChange(selected.value)
        }}
        >
        {options.map( option =>
            <option key={`${option.value}`} value={option.value as any}>{option.label}</option>
        )}
        </select>
    );
}
