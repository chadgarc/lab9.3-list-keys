import type { SelectListProps } from "../../types";

/**
 * Reusable generic select component that supports any value type.
 *
 * @template T - The type of the option values.
 *
 * @component
 * @param {SelectListProps<T>} props - Props for the SelectList component.
 * @param {T} props.defaultValue - Initial selected value.
 * @param {Option<T>[]} props.options - List of selectable options.
 * @param {(value: T) => void} props.onChange - Callback fired when the user selects a new value.
 *
 * The component converts option values to strings internally to match
 * the native <select> element behavior, then maps back to the original
 * typed value before invoking `onChange`.
 */
export function SelectList<T> ({
    defaultValue,
    options,
    onChange}: SelectListProps<T>) {
    
        return (
        <select
        defaultValue={defaultValue as any}
        className="select text-wrap w-35 select-neutral bg-gray-300 text-black"

        /**
         * Handles selection changes by finding the matching option
         * and returning its typed value through the `onChange` callback.
         *
         * The comparison uses string conversion because HTML select
         * values are always strings.
         */
        onChange={(e) => {
            const selected = options.find(option => `${option.value}` === e.target.value);
            if(selected) onChange(selected.value)
        }}
        >
        {/*
         * Renders all provided options. Each option uses its value
         * (converted to string) as the key and the actual label for display.
         */}
        {options.map( option =>
            <option key={`${option.value}`} value={`${option.value}`}>{option.label}</option>
        )}
        </select>
    );
}
